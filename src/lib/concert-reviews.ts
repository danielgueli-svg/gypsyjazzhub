import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { loadConcert, type Concert } from "@/lib/api";
import { getSql } from "@/lib/db";
import { toIso } from "@/lib/utils";

export type NightMedia = {
  id: number;
  kind: "image" | "video";
  mime: string;
  filename: string;
  url: string;
};

export type NightReview = {
  id: number;
  concertId: string;
  artistSlug: string;
  authorName: string;
  userId: string;
  body: string;
  createdAt: string;
  media: NightMedia[];
};

type FileIn = { filename: string; mime: string; data: string };

const MIN_BODY = 8;
const MAX_BODY = 1200;
const MAX_FILES = 6;
const MAX_IMAGE = 3_000_000;
const MAX_VIDEO = 8_000_000;

const MIME: Record<string, { kind: "image" | "video"; max: number }> = {
  "image/jpeg": { kind: "image", max: MAX_IMAGE },
  "image/jpg": { kind: "image", max: MAX_IMAGE },
  "image/png": { kind: "image", max: MAX_IMAGE },
  "video/mp4": { kind: "video", max: MAX_VIDEO },
};

function stripDataUrl(raw: string) {
  const trimmed = raw.trim();
  const comma = trimmed.indexOf(",");
  if (trimmed.startsWith("data:") && comma >= 0) return trimmed.slice(comma + 1);
  return trimmed;
}

function decodedSize(b64: string) {
  const clean = b64.replace(/\s/g, "");
  if (!clean) return 0;
  const pad = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((clean.length * 3) / 4) - pad);
}

function extOk(filename: string, mime: string) {
  const name = filename.trim().toLowerCase();
  if (mime === "image/jpeg" || mime === "image/jpg") return /\.(jpe?g)$/.test(name) || !name.includes(".");
  if (mime === "image/png") return name.endsWith(".png") || !name.includes(".");
  if (mime === "video/mp4") return name.endsWith(".mp4") || !name.includes(".");
  return false;
}

function mediaUrl(id: number) {
  return `/api/concert-media/${id}`;
}

async function ensureReviews() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists concert_reviews (
      id serial primary key,
      concert_id text not null,
      artist_slug text not null,
      user_id text not null,
      author_name text not null,
      body text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create unique index if not exists concert_reviews_user_concert_idx
      on concert_reviews (concert_id, user_id)
  `);
  await sql.query(`
    create index if not exists concert_reviews_artist_idx
      on concert_reviews (artist_slug, created_at desc)
  `);
  await sql.query(`
    create index if not exists concert_reviews_concert_idx
      on concert_reviews (concert_id, created_at desc)
  `);
  await sql.query(`
    create table if not exists concert_media (
      id serial primary key,
      review_id integer not null references concert_reviews(id) on delete cascade,
      concert_id text not null,
      artist_slug text not null,
      user_id text not null,
      kind text not null,
      mime text not null,
      filename text not null,
      bytes text not null,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`create index if not exists concert_media_review_idx on concert_media (review_id)`);
  await sql.query(`create index if not exists concert_media_concert_idx on concert_media (concert_id)`);
  await sql.query(
    `create index if not exists concert_media_artist_idx on concert_media (artist_slug, created_at desc)`,
  );
  await sql.query(`delete from concert_reviews where user_id = 'review-seed'`);
}

async function authorName(userId: string) {
  const sql = await getSql();
  const profile = await sql<{ display_name: string }>`
    select display_name from profiles where user_id = ${userId} limit 1
  `;
  if (profile[0]?.display_name?.trim()) return profile[0].display_name.trim();
  const user = await sql<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  if (user[0]?.name?.trim()) return user[0].name.trim();
  if (user[0]?.email) return user[0].email.split("@")[0] ?? "Hub member";
  return "Hub member";
}

function parseKind(kind: string): "image" | "video" {
  return kind === "video" ? "video" : "image";
}

async function attachMedia(reviews: Omit<NightReview, "media">[]): Promise<NightReview[]> {
  if (reviews.length === 0) return [];
  const sql = await getSql();
  const ids = reviews.map((row) => row.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const media = await sql.query<{
    id: number;
    review_id: number;
    kind: string;
    mime: string;
    filename: string;
  }>(
    `select id, review_id, kind, mime, filename
     from concert_media
     where review_id in (${placeholders})
     order by created_at asc, id asc`,
    ids,
  );
  const byReview = new Map<number, NightMedia[]>();
  for (const row of media) {
    const list = byReview.get(row.review_id) ?? [];
    list.push({
      id: row.id,
      kind: parseKind(row.kind),
      mime: row.mime,
      filename: row.filename,
      url: mediaUrl(row.id),
    });
    byReview.set(row.review_id, list);
  }
  return reviews.map((row) => ({ ...row, media: byReview.get(row.id) ?? [] }));
}

function mapReview(row: {
  id: number;
  concert_id: string;
  artist_slug: string;
  author_name: string;
  user_id: string;
  body: string;
  created_at: unknown;
}): Omit<NightReview, "media"> {
  return {
    id: row.id,
    concertId: row.concert_id,
    artistSlug: row.artist_slug,
    authorName: row.author_name,
    userId: row.user_id,
    body: row.body,
    createdAt: toIso(row.created_at),
  };
}

export function concertHasStarted(concert: Concert, now = Date.now()) {
  if (concert.isHistoric) return true;
  return new Date(concert.startsAt).getTime() <= now + 12 * 60 * 60 * 1000;
}

export const listArtistReviews = createServerFn({ method: "GET" })
  .validator((slug: string) => slug.trim())
  .handler(async ({ data: slug }) => {
    await ensureReviews();
    if (!slug) return [] as NightReview[];
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      concert_id: string;
      artist_slug: string;
      author_name: string;
      user_id: string;
      body: string;
      created_at: unknown;
    }>`
      select id, concert_id, artist_slug, author_name, user_id, body, created_at
      from concert_reviews
      where artist_slug = ${slug}
      order by created_at desc
    `;
    return attachMedia(rows.map(mapReview));
  });

export const listConcertReviews = createServerFn({ method: "GET" })
  .validator((concertId: string) => concertId.trim())
  .handler(async ({ data: concertId }) => {
    try {
    await ensureReviews();
    if (!concertId) return [] as NightReview[];
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      concert_id: string;
      artist_slug: string;
      author_name: string;
      user_id: string;
      body: string;
      created_at: unknown;
    }>`
      select id, concert_id, artist_slug, author_name, user_id, body, created_at
      from concert_reviews
      where concert_id = ${concertId}
      order by created_at desc
    `;
    return attachMedia(rows.map(mapReview));
    } catch (err) {
      console.error("listConcertReviews db failed", err);
      return [] as NightReview[];
    }
  });

export const listReviewsForConcerts = createServerFn({ method: "GET" })
  .validator((ids: string[]) => ids.map((id) => id.trim()).filter(Boolean).slice(0, 80))
  .handler(async ({ data: ids }) => {
    await ensureReviews();
    if (ids.length === 0) return [] as NightReview[];
    const sql = await getSql();
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
    const rows = await sql.query<{
      id: number;
      concert_id: string;
      artist_slug: string;
      author_name: string;
      user_id: string;
      body: string;
      created_at: unknown;
    }>(
      `select id, concert_id, artist_slug, author_name, user_id, body, created_at
       from concert_reviews
       where concert_id in (${placeholders})
       order by created_at desc`,
      ids,
    );
    return attachMedia(rows.map(mapReview));
  });

export const addNightReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { concertId: string; body: string; files: FileIn[] }) => input)
  .handler(async ({ context, data }) => {
    await ensureReviews();
    const concertId = data.concertId.trim();
    const body = data.body.trim();
    const files = Array.isArray(data.files) ? data.files.slice(0, MAX_FILES) : [];
    if (!concertId) throw new Error("Missing concert.");
    const concert = await loadConcert(concertId);
    if (!concert) throw new Error("That concert is not on the hub.");
    if (!concertHasStarted(concert)) throw new Error("This night has not started yet.");
    if (body && body.length < MIN_BODY) throw new Error("Write a little more — a sentence is enough.");
    if (body.length > MAX_BODY) throw new Error(`Keep the review under ${MAX_BODY} characters.`);
    if (!body && files.length === 0) throw new Error("Write a few words or add a photo.");

    let videoCount = 0;
    const cleanFiles: { filename: string; mime: string; kind: "image" | "video"; data: string }[] = [];
    for (const file of files) {
      const mime = (file.mime || "").trim().toLowerCase();
      const rule = MIME[mime];
      if (!rule) throw new Error("Use JPG, PNG or MP4.");
      const filename = (file.filename || "upload").trim().slice(0, 120) || "upload";
      if (!extOk(filename, mime)) throw new Error("Use JPG, PNG or MP4.");
      const data64 = stripDataUrl(file.data || "");
      if (!/^[A-Za-z0-9+/]+=*$/.test(data64) || data64.length < 16) {
        throw new Error("That file could not be read.");
      }
      const size = decodedSize(data64);
      if (size > rule.max) {
        throw new Error(rule.kind === "video" ? "That video is too large (8 MB max)." : "That photo is too large (3 MB max).");
      }
      if (rule.kind === "video") {
        videoCount += 1;
        if (videoCount > 1) throw new Error("One short video per review.");
      }
      cleanFiles.push({
        filename,
        mime: mime === "image/jpg" ? "image/jpeg" : mime,
        kind: rule.kind,
        data: data64,
      });
    }

    const sql = await getSql();
    const name = await authorName(context.userId);
    const existing = await sql<{ id: number; n: number }>`
      select r.id, (select count(*)::int from concert_media m where m.review_id = r.id) as n
      from concert_reviews r
      where r.concert_id = ${concertId} and r.user_id = ${context.userId}
      limit 1
    `;
    let reviewId: number;
    if (existing[0]) {
      const nextCount = existing[0].n + cleanFiles.length;
      if (nextCount > MAX_FILES) throw new Error(`Keep it to ${MAX_FILES} files.`);
      if (body) {
        await sql`
          update concert_reviews
          set body = ${body}, author_name = ${name}
          where id = ${existing[0].id} and user_id = ${context.userId}
        `;
      }
      reviewId = existing[0].id;
    } else {
      const inserted = await sql<{ id: number }>`
        insert into concert_reviews (concert_id, artist_slug, user_id, author_name, body)
        values (${concertId}, ${concert.artistSlug}, ${context.userId}, ${name}, ${body})
        returning id
      `;
      reviewId = inserted[0]!.id;
    }

    for (const file of cleanFiles) {
      await sql`
        insert into concert_media (review_id, concert_id, artist_slug, user_id, kind, mime, filename, bytes)
        values (
          ${reviewId}, ${concertId}, ${concert.artistSlug}, ${context.userId},
          ${file.kind}, ${file.mime}, ${file.filename}, ${file.data}
        )
      `;
    }

    const rows = await sql<{
      id: number;
      concert_id: string;
      artist_slug: string;
      author_name: string;
      user_id: string;
      body: string;
      created_at: unknown;
    }>`
      select id, concert_id, artist_slug, author_name, user_id, body, created_at
      from concert_reviews where id = ${reviewId} limit 1
    `;
    const mapped = await attachMedia(rows.map(mapReview));
    return mapped[0]!;
  });

export const deleteNightReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await ensureReviews();
    const sql = await getSql();
    await sql`delete from concert_reviews where id = ${id} and user_id = ${context.userId}`;
  });

export async function readConcertMedia(id: number) {
  await ensureReviews();
  if (!Number.isFinite(id) || id <= 0) return null;
  const sql = await getSql();
  const rows = await sql<{ mime: string; filename: string; bytes: string; kind: string }>`
    select mime, filename, bytes, kind from concert_media where id = ${id} limit 1
  `;
  return rows[0] ?? null;
}
