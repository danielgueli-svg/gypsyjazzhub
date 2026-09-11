import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, getDbSource } from "@/lib/db";
import { slugify } from "@/lib/utils";

const MAX_IMAGE = 400_000;
/** Cloudflare SQLite Durable Object cap (Workers Paid). */
export const PHOTO_STORE_LIMIT = 10_000_000_000;

export function namedPhotoUrl(slug: string, rev: number | string | null | undefined) {
  const key = slugify(slug);
  const n = Number(rev ?? 0);
  if (!key || !Number.isFinite(n) || n <= 0) return "";
  return `/api/photos/${encodeURIComponent(key)}?v=${n}`;
}

export function profilePhotoUrl(slugOrId: string, rev: number | string | null | undefined) {
  return namedPhotoUrl(slugOrId, rev);
}

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

function cleanMime(mime: string) {
  const value = mime.trim().toLowerCase();
  if (value === "image/jpg") return "image/jpeg";
  return value;
}

export async function ensureProfilePhotos() {
  if (getDbSource() === "none") return;
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_photos (
      slug text primary key,
      name text not null default '',
      mime text not null,
      filename text not null,
      bytes text not null,
      byte_size integer not null default 0,
      kind text not null default 'portrait',
      owner_user_id text not null default '',
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now'))
    )
  `);
  await sql.query(`
    create table if not exists profile_photos (
      user_id text primary key,
      mime text not null,
      filename text not null,
      bytes text not null,
      updated_at text not null default (datetime('now'))
    )
  `);
  for (const col of [
    "photo_rev integer not null default 0",
    "photo_slug text not null default ''",
  ]) {
    try {
      await sql.query(`alter table profiles add column ${col}`);
    } catch {
      /* column already there */
    }
  }
  try {
    await sql.query(`
      insert into hub_photos (slug, name, mime, filename, bytes, byte_size, kind, owner_user_id, updated_at)
      select p.slug, p.display_name, ph.mime, ph.filename, ph.bytes,
             cast(length(ph.bytes) * 3 / 4 as integer), 'portrait', ph.user_id, datetime('now')
      from profile_photos ph
      join profiles p on p.user_id = ph.user_id
      where p.slug <> ''
      on conflict (slug) do nothing
    `);
  } catch {
    /* copy optional */
  }
  try {
    await sql.query(`
      update profiles
      set photo_slug = slug
      where coalesce(photo_rev, 0) > 0 and coalesce(photo_slug, '') = ''
    `);
  } catch {
    /* optional */
  }
}

export async function readNamedPhoto(slug: string) {
  const key = slugify(slug);
  if (!key || key === "musician") return null;
  await ensureProfilePhotos();
  const sql = await getSql();
  const rows = await sql<{ mime: string; filename: string; bytes: string }>`
    select mime, filename, bytes from hub_photos where slug = ${key} limit 1
  `;
  return rows[0] ?? null;
}

export async function readProfilePhoto(userId: string) {
  const id = userId.trim();
  if (!id) return null;
  await ensureProfilePhotos();
  const sql = await getSql();
  const named = await sql<{ slug: string }>`
    select coalesce(nullif(photo_slug, ''), slug) as slug
    from profiles where user_id = ${id} limit 1
  `;
  if (named[0]?.slug) {
    const row = await readNamedPhoto(named[0].slug);
    if (row) return row;
  }
  const rows = await sql<{ mime: string; filename: string; bytes: string }>`
    select mime, filename, bytes from profile_photos where user_id = ${id} limit 1
  `;
  return rows[0] ?? null;
}

export type PhotoStorage = {
  portraits: number;
  concertShots: number;
  usedBytes: number;
  limitBytes: number;
  remainingBytes: number;
  maxPerPhoto: number;
  aboutPhotosLeft: number;
};

export async function photoStorage(): Promise<PhotoStorage> {
  await ensureProfilePhotos();
  const sql = await getSql();
  let portraits = 0;
  let portraitBytes = 0;
  try {
    const rows = await sql<{ n: number; bytes: number }>`
      select count(*) as n, coalesce(sum(byte_size), 0) as bytes from hub_photos
    `;
    portraits = Number(rows[0]?.n ?? 0);
    portraitBytes = Number(rows[0]?.bytes ?? 0);
  } catch {
    /* empty */
  }
  let concertShots = 0;
  let concertBytes = 0;
  try {
    const rows = await sql<{ n: number; bytes: number }>`
      select count(*) as n, coalesce(sum(length(bytes) * 3 / 4), 0) as bytes from concert_media
    `;
    concertShots = Number(rows[0]?.n ?? 0);
    concertBytes = Number(rows[0]?.bytes ?? 0);
  } catch {
    /* optional */
  }
  const usedBytes = Math.max(0, Math.round(portraitBytes + concertBytes));
  const remainingBytes = Math.max(0, PHOTO_STORE_LIMIT - usedBytes);
  return {
    portraits,
    concertShots,
    usedBytes,
    limitBytes: PHOTO_STORE_LIMIT,
    remainingBytes,
    maxPerPhoto: MAX_IMAGE,
    aboutPhotosLeft: Math.floor(remainingBytes / MAX_IMAGE),
  };
}

export const saveMyPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { filename: string; mime: string; data: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureProfilePhotos();
    const mime = cleanMime(data.mime);
    if (mime !== "image/jpeg" && mime !== "image/png") {
      throw new Error("Use a JPEG or PNG photo.");
    }
    const bytes = stripDataUrl(data.data);
    if (!bytes) throw new Error("That photo did not upload. Try another file.");
    const size = decodedSize(bytes);
    if (size > MAX_IMAGE) {
      throw new Error("That photo is too large (400 KB max after resize).");
    }
    const filename = (data.filename.trim() || (mime === "image/png" ? "photo.png" : "photo.jpg"))
      .replace(/[^\w.\-]+/g, "-")
      .slice(0, 80);
    const sql = await getSql();
    const have = await sql<{ user_id: string; slug: string; display_name: string; photo_slug?: string }>`
      select user_id, slug, display_name, photo_slug from profiles
      where user_id = ${context.userId} limit 1
    `;
    if (!have[0]) throw new Error("Save your page first, then add a photo.");
    const slug = slugify(have[0].slug || have[0].display_name);
    const oldSlug = slugify(have[0].photo_slug || "");
    await sql`
      insert into hub_photos (
        slug, name, mime, filename, bytes, byte_size, kind, owner_user_id, updated_at
      ) values (
        ${slug}, ${have[0].display_name}, ${mime}, ${filename}, ${bytes}, ${size},
        ${"portrait"}, ${context.userId}, now()
      )
      on conflict (slug) do update set
        name = excluded.name,
        mime = excluded.mime,
        filename = excluded.filename,
        bytes = excluded.bytes,
        byte_size = excluded.byte_size,
        kind = excluded.kind,
        owner_user_id = excluded.owner_user_id,
        updated_at = now()
    `;
    await sql`
      insert into profile_photos (user_id, mime, filename, bytes, updated_at)
      values (${context.userId}, ${mime}, ${filename}, ${bytes}, now())
      on conflict (user_id) do update set
        mime = excluded.mime,
        filename = excluded.filename,
        bytes = excluded.bytes,
        updated_at = now()
    `;
    if (oldSlug && oldSlug !== slug) {
      try {
        await sql`delete from hub_photos where slug = ${oldSlug} and owner_user_id = ${context.userId}`;
      } catch {
        /* rename leftover */
      }
    }
    await sql`
      update profiles
      set photo_rev = coalesce(photo_rev, 0) + 1, photo_slug = ${slug}, updated_at = now()
      where user_id = ${context.userId}
    `;
    const rev = await sql<{ photo_rev: number }>`
      select photo_rev from profiles where user_id = ${context.userId} limit 1
    `;
    return { photoUrl: namedPhotoUrl(slug, rev[0]?.photo_rev), slug };
  });

export const deleteMyPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfilePhotos();
    const sql = await getSql();
    const have = await sql<{ slug: string; photo_slug?: string }>`
      select slug, photo_slug from profiles where user_id = ${context.userId} limit 1
    `;
    const slugs = [have[0]?.photo_slug, have[0]?.slug].filter(Boolean).map((row) => slugify(String(row)));
    for (const slug of slugs) {
      try {
        await sql`delete from hub_photos where slug = ${slug} and owner_user_id = ${context.userId}`;
      } catch {
        /* optional */
      }
    }
    await sql`delete from profile_photos where user_id = ${context.userId}`;
    try {
      await sql`
        update profiles
        set photo_rev = 0, photo_slug = '', updated_at = now()
        where user_id = ${context.userId}
      `;
    } catch {
      /* column optional on old rows */
    }
    return { photoUrl: "" };
  });
