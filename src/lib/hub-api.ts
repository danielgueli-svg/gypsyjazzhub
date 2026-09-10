import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { syncDiscoveries } from "@/lib/discovery-api";
import type { Concert } from "@/lib/api";
import type { Festival } from "@/lib/festivals";
import type { Jam } from "@/lib/jams";
import type { Venue } from "@/lib/venues";
import type { Luthier } from "@/lib/luthiers";
import { parseLuthierCraft } from "@/lib/luthiers";
import { countrySlug, resolveCountry } from "@/lib/geo";
import { ensureFanTables } from "@/lib/fans";
import { slugify, toIso, youtubeVideoId } from "@/lib/utils";
import { CATALOG_TEACHERS } from "@/lib/teachers";
import { ensureCatalogArtist } from "@/lib/catalog";

export type ArtistOption = {
  slug: string;
  name: string;
  kind: "legend" | "musician";
};

export type HubClip = {
  id: number;
  artistSlug: string;
  title: string;
  youtubeUrl: string;
  submittedName: string;
  createdAt: string;
};

export type HubNote = {
  id: number;
  artistSlug: string;
  body: string;
  submittedName: string;
  createdAt: string;
};

async function ensureHub() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_concerts (
      id serial primary key,
      artist_slug text not null,
      artist_name text not null,
      artist_kind text not null default 'legend',
      title text not null,
      venue text not null default '',
      city text not null default '',
      country text not null,
      starts_at timestamptz not null,
      note text not null default '',
      submitted_by text not null,
      submitted_name text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_clips (
      id serial primary key,
      artist_slug text not null,
      title text not null default '',
      youtube_url text not null,
      submitted_by text not null,
      submitted_name text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_notes (
      id serial primary key,
      artist_slug text not null,
      body text not null,
      submitted_by text not null,
      submitted_name text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_festivals (
      id serial primary key,
      slug text not null unique,
      name text not null,
      city text not null default '',
      country text not null,
      when_text text not null default '',
      next_starts_at timestamptz not null,
      bio text not null default '',
      site text not null default '',
      submitted_by text not null,
      submitted_name text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_jams (
      id serial primary key,
      slug text not null unique,
      name text not null,
      city text not null default '',
      country text not null,
      venue text not null default '',
      when_text text not null default '',
      next_starts_at timestamptz not null,
      bio text not null default '',
      submitted_by text not null,
      submitted_name text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    alter table hub_jams add column if not exists kind text not null default 'regular'
  `);
  await sql.query(`
    alter table hub_jams add column if not exists address text not null default ''
  `);
  await sql.query(`
    alter table hub_jams add column if not exists hours text not null default ''
  `);
  await sql.query(`
    create table if not exists hub_venues (
      id serial primary key,
      slug text not null unique,
      name text not null,
      city text not null default '',
      country text not null,
      kind text not null default 'Club',
      site text not null default '',
      contact text not null default '',
      bio text not null default '',
      submitted_by text not null,
      submitted_name text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    alter table hub_venues add column if not exists scene text not null default 'gypsy'
  `);
  await sql.query(`
    alter table hub_venues add column if not exists booker text not null default ''
  `);
  await sql.query(`
    create table if not exists hub_luthiers (
      id serial primary key,
      slug text not null unique,
      name text not null,
      city text not null default '',
      country text not null,
      site text not null default '',
      contact text not null default '',
      bio text not null default '',
      submitted_by text not null,
      submitted_name text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    alter table hub_luthiers add column if not exists craft text not null default 'guitar'
  `);
  await sql.query(`
    alter table hub_luthiers add column if not exists note text not null default ''
  `);
  await sql.query(`
    create table if not exists hub_profiles (
      user_id text primary key,
      chat_name text not null,
      artist_slug text not null default '',
      updated_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    alter table hub_profiles add column if not exists artist_slug text not null default ''
  `);
  await sql.query(`
    create table if not exists hub_chat (
      id serial primary key,
      target_kind text not null,
      target_slug text not null,
      body text not null,
      user_id text not null,
      chat_name text not null,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_teachers (
      id serial primary key,
      country_slug text not null,
      name text not null,
      instruments text not null default '',
      contact text not null default '',
      note text not null default '',
      user_id text not null,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    alter table hub_teachers add column if not exists region text not null default ''
  `);
  await sql.query(`
    alter table hub_teachers add column if not exists city text not null default ''
  `);
  await sql.query(`
    alter table hub_teachers add column if not exists artist_slug text not null default ''
  `);
  await seedCatalogTeachers(sql);
  await sql.query(`
    alter table hub_concerts add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_jams add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_festivals add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_notes add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_clips add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_venues add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_luthiers add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_teachers add column if not exists status text not null default 'published'
  `);
}

async function seedCatalogTeachers(sql: Awaited<ReturnType<typeof getSql>>) {
  for (const teacher of CATALOG_TEACHERS) {
    const existing = await sql<{ id: number; user_id: string }>`
      select id, user_id from hub_teachers
      where name = ${teacher.name} and country_slug = ${teacher.countrySlug}
      order by id
    `;
    const owned = existing.filter((row) => row.user_id);
    const catalog = existing.filter((row) => !row.user_id);
    if (owned.length) {
      for (const row of catalog) {
        await sql`delete from hub_teachers where id = ${row.id}`;
      }
      continue;
    }
    const keep = catalog[0];
    for (const row of catalog.slice(1)) {
      await sql`delete from hub_teachers where id = ${row.id}`;
    }
    if (keep) {
      await sql`
        update hub_teachers set
          instruments = ${teacher.instruments},
          contact = ${teacher.contact},
          note = ${teacher.note},
          region = ${teacher.region},
          city = ${teacher.city},
          artist_slug = ${teacher.artistSlug}
        where id = ${keep.id}
      `;
    } else {
      await sql`
        insert into hub_teachers (
          country_slug, name, instruments, contact, note, region, city, artist_slug, user_id
        ) values (
          ${teacher.countrySlug}, ${teacher.name}, ${teacher.instruments},
          ${teacher.contact}, ${teacher.note}, ${teacher.region}, ${teacher.city},
          ${teacher.artistSlug}, ${""}
        )
      `;
    }
  }
}

async function submitterName(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  const row = rows[0];
  if (row?.name?.trim()) return row.name.trim();
  if (row?.email) return row.email.split("@")[0] ?? "Hub member";
  return "Hub member";
}

async function uniqueSlug(
  table: "hub_festivals" | "hub_jams" | "hub_venues" | "hub_luthiers" | "legends",
  base: string,
) {
  const sql = await getSql();
  let slug = slugify(base);
  for (let i = 0; i < 20; i += 1) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
    const rows = await sql.query<{ n: number }>(
      `select 1 as n from ${table} where slug = $1 limit 1`,
      [candidate],
    );
    if (!rows[0]) return candidate;
  }
  return `${slug}-${Date.now()}`;
}

function mapHubConcert(row: {
  id: number;
  title: string;
  venue: string;
  city: string;
  country: string;
  starts_at: unknown;
  note: string;
  artist_name: string;
  artist_slug: string;
  artist_kind: string;
}): Concert {
  const facebookUrl =
    row.note.match(/https?:\/\/[^\s]*facebook\.com[^\s]*/i)?.[0] ??
    row.note.match(/https?:\/\/[^\s]*djangobooks\.com[^\s]*/i)?.[0] ??
    "";
  return {
    id: `h-${row.id}`,
    kind: row.artist_kind === "musician" ? "community" : "legend",
    title: row.title,
    venue: row.venue,
    city: row.city,
    country: row.country,
    startsAt: toIso(row.starts_at),
    description: row.note,
    ticketUrl: facebookUrl,
    isHistoric: new Date(toIso(row.starts_at)).getTime() < Date.now(),
    artistName: row.artist_name,
    artistSlug: row.artist_slug,
  };
}

function mapFestival(row: {
  slug: string;
  name: string;
  city: string;
  country: string;
  when_text: string;
  next_starts_at: unknown;
  bio: string;
  site: string;
}): Festival {
  return {
    slug: row.slug,
    name: row.name,
    city: row.city,
    country: row.country,
    when: row.when_text,
    founded: "",
    site: row.site,
    bio: row.bio,
    nextStartsAt: toIso(row.next_starts_at),
    relatedSlugs: [],
  };
}

function mapJam(row: {
  slug: string;
  name: string;
  city: string;
  country: string;
  venue: string;
  when_text: string;
  next_starts_at: unknown;
  bio: string;
  kind?: string;
  address?: string;
  hours?: string;
}): Jam {
  return {
    slug: row.slug,
    name: row.name,
    city: row.city,
    country: row.country,
    venue: row.venue,
    address: row.address ?? "",
    hours: row.hours ?? "",
    when: row.when_text,
    nextStartsAt: toIso(row.next_starts_at),
    bio: row.bio,
    relatedSlugs: [],
    kind: row.kind === "meetup" ? "meetup" : "regular",
    site: row.bio.match(/https?:\/\/[^\s]+/)?.[0],
  };
}

export const listArtistOptions = createServerFn({ method: "GET" }).handler(async () => {
  await ensureHub();
  await ensureFanTables();
  const sql = await getSql();
  const legends = await sql<{ slug: string; name: string }>`
    select slug, name from legends order by name
  `;
  const musicians = await sql<{ slug: string; display_name: string }>`
    select slug, display_name from profiles
    where coalesce(member_kind, 'musician') <> 'fan'
    order by display_name
  `;
  const options: ArtistOption[] = [
    ...legends.map((row) => ({ slug: row.slug, name: row.name, kind: "legend" as const })),
    ...musicians.map((row) => ({
      slug: row.slug,
      name: row.display_name,
      kind: "musician" as const,
    })),
  ];
  options.sort((a, b) => a.name.localeCompare(b.name));
  return options;
});

export const listHubConcerts = createServerFn({ method: "GET" })
  .validator((slug?: string) => slug ?? "")
  .handler(async ({ data: slug }) => {
    try {
    await ensureHub();
    try {
      await syncDiscoveries();
    } catch {
      /* scan import should not hide the calendar */
    }
    const sql = await getSql();
    const rows = slug
      ? await sql<Parameters<typeof mapHubConcert>[0]>`
          select id, title, venue, city, country, starts_at, note, artist_name, artist_slug, artist_kind
          from hub_concerts
          where artist_slug = ${slug} and coalesce(status, 'published') = 'published'
          order by starts_at asc
        `
      : await sql<Parameters<typeof mapHubConcert>[0]>`
          select id, title, venue, city, country, starts_at, note, artist_name, artist_slug, artist_kind
          from hub_concerts
          where coalesce(status, 'published') = 'published'
          order by starts_at asc
        `;
    return rows.map(mapHubConcert);
    } catch (err) {
      console.error("listHubConcerts db failed", err);
      return [];
    }
  });

export const listHubClips = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureHub();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      artist_slug: string;
      title: string;
      youtube_url: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, artist_slug, title, youtube_url, submitted_name, created_at
      from hub_clips
      where artist_slug = ${slug} and coalesce(status, 'published') = 'published'
      order by created_at desc
    `;
    return rows.map((row) => ({
      id: row.id,
      artistSlug: row.artist_slug,
      title: row.title,
      youtubeUrl: row.youtube_url,
      submittedName: row.submitted_name,
      createdAt: toIso(row.created_at),
    })) satisfies HubClip[];
  });

export const listHubNotes = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureHub();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      artist_slug: string;
      body: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, artist_slug, body, submitted_name, created_at
      from hub_notes
      where artist_slug = ${slug} and coalesce(status, 'published') = 'published'
      order by created_at desc
    `;
    return rows.map((row) => ({
      id: row.id,
      artistSlug: row.artist_slug,
      body: row.body,
      submittedName: row.submitted_name,
      createdAt: toIso(row.created_at),
    })) satisfies HubNote[];
  });

export const listHubFestivals = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureHub();
    try {
      await syncDiscoveries();
    } catch {
      /* scan import should not hide festivals */
    }
    const sql = await getSql();
    const rows = await sql<{
      slug: string;
      name: string;
      city: string;
      country: string;
      when_text: string;
      next_starts_at: unknown;
      bio: string;
      site: string;
    }>`
    select slug, name, city, country, when_text, next_starts_at, bio, site
    from hub_festivals
    where coalesce(status, 'published') = 'published'
    order by next_starts_at asc
  `;
    return rows.map(mapFestival);
  } catch (err) {
    console.error("list hub festivals failed", err);
    return [];
  }
});

export const listHubJams = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureHub();
    try {
      await syncDiscoveries();
    } catch {
      /* scan import should not hide jams */
    }
    const sql = await getSql();
    const rows = await sql<{
      slug: string;
      name: string;
      city: string;
      country: string;
      venue: string;
      when_text: string;
      next_starts_at: unknown;
      bio: string;
      kind: string;
      address: string;
      hours: string;
    }>`
    select slug, name, city, country, venue, when_text, next_starts_at, bio, kind, address, hours
    from hub_jams
    where coalesce(status, 'published') = 'published'
    order by next_starts_at asc
  `;
    return rows.map(mapJam);
  } catch (err) {
    console.error("list hub jams failed", err);
    return [];
  }
});

export const getHubFestival = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureHub();
    const sql = await getSql();
    const rows = await sql<{
      slug: string;
      name: string;
      city: string;
      country: string;
      when_text: string;
      next_starts_at: unknown;
      bio: string;
      site: string;
    }>`
      select slug, name, city, country, when_text, next_starts_at, bio, site
      from hub_festivals where slug = ${slug} limit 1
    `;
    return rows[0] ? mapFestival(rows[0]) : null;
  });

export const getHubJam = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
    await ensureHub();
    const sql = await getSql();
    const rows = await sql<{
      slug: string;
      name: string;
      city: string;
      country: string;
      venue: string;
      when_text: string;
      next_starts_at: unknown;
      bio: string;
      kind: string;
      address: string;
      hours: string;
    }>`
      select slug, name, city, country, venue, when_text, next_starts_at, bio, kind, address, hours
      from hub_jams where slug = ${slug} limit 1
    `;
    return rows[0] ? mapJam(rows[0]) : null;
    } catch (err) {
      console.error("getHubJam db failed", err);
      return null;
    }
  });

export const addHubConcert = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      artistSlug: string;
      title: string;
      venue: string;
      city: string;
      country: string;
      startsAt: string;
      note: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const title = data.title.trim();
    const country = data.country.trim();
    const artistSlug = data.artistSlug.trim();
    if (!title) throw new Error("Give the concert a title.");
    if (!country) throw new Error("Name the country.");
    if (!artistSlug) throw new Error("Pick an artist.");
    const starts = new Date(data.startsAt);
    if (Number.isNaN(starts.getTime())) throw new Error("Pick a valid date.");
    const sql = await getSql();
    const dup = await sql<{ id: number }>`
      select id from hub_concerts
      where lower(title) = ${title.toLowerCase()}
        and starts_at = ${starts.toISOString()}
        and lower(city) = ${data.city.trim().toLowerCase()}
      limit 1
    `;
    if (dup[0]) throw new Error("That concert is already on the hub.");
    const resolved = await ensureCatalogArtist({
      slug: artistSlug,
      name: artistSlug,
      origin: country,
      notable: "From a concert on the hub",
    });
    if (!resolved) throw new Error("Pick an artist.");
    const artistName = resolved.name;
    const kind = resolved.kind;
    const name = await submitterName(context.userId);
    await sql`
      insert into hub_concerts (
        artist_slug, artist_name, artist_kind, title, venue, city, country,
        starts_at, note, submitted_by, submitted_name, status
      ) values (
        ${resolved.slug}, ${artistName}, ${kind}, ${title}, ${data.venue.trim()},
        ${data.city.trim()}, ${country}, ${starts.toISOString()}, ${data.note.trim()},
        ${context.userId}, ${name}, ${gate.status}
      )
    `;
    return { ok: true as const, pending: gate.pending };
  });

export const addHubClip = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { artistSlug: string; youtubeUrl: string; title: string; hp?: string; turnstile?: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const url = data.youtubeUrl.trim();
    if (!youtubeVideoId(url) && !/youtu(\.be|be\.com)/i.test(url)) {
      throw new Error("Paste a YouTube link.");
    }
    const slug = data.artistSlug.trim();
    if (!slug) throw new Error("Pick an artist.");
    const sql = await getSql();
    const resolved = await ensureCatalogArtist({
      slug,
      name: slug,
      youtubeUrl: url,
      notable: "From a YouTube clip on the hub",
    });
    const artistSlug = resolved?.slug ?? slug;
    const name = await submitterName(context.userId);
    await sql`
      insert into hub_clips (artist_slug, title, youtube_url, submitted_by, submitted_name, status)
      values (${artistSlug}, ${data.title.trim()}, ${url}, ${context.userId}, ${name}, ${gate.status})
    `;
    return { ok: true as const, pending: gate.pending };
  });

export const addHubNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { artistSlug: string; body: string; hp?: string; turnstile?: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const body = data.body.trim();
    if (body.length < 8) throw new Error("Write a little more — a sentence is enough.");
    const slug = data.artistSlug.trim();
    if (!slug) throw new Error("Pick an artist.");
    const sql = await getSql();
    const resolved = await ensureCatalogArtist({
      slug,
      name: slug,
      notable: "From a bio note on the hub",
    });
    const artistSlug = resolved?.slug ?? slug;
    const name = await submitterName(context.userId);
    await sql`
      insert into hub_notes (artist_slug, body, submitted_by, submitted_name, status)
      values (${artistSlug}, ${body}, ${context.userId}, ${name}, ${gate.status})
    `;
    return { ok: true as const, pending: gate.pending };
  });

export type HistoryCircleKind = "Name" | "Memory" | "Date" | "Correction" | "Photograph";

export type HistoryCircleNote = {
  id: number;
  house: string;
  kind: HistoryCircleKind;
  text: string;
  year: string;
  link: string;
  photoSource: string;
  licence: string;
  submittedName: string;
  createdAt: string;
};

const HISTORY_KINDS = new Set<HistoryCircleKind>([
  "Name",
  "Memory",
  "Date",
  "Correction",
  "Photograph",
]);

function historySlug(house: string) {
  const key = house.trim().toLowerCase().replace(/\s+/g, "-");
  return key.startsWith("history-") ? key : `history-${key}`;
}

function parseHistoryNote(
  body: string,
  slug: string,
): Pick<HistoryCircleNote, "house" | "kind" | "text" | "year" | "link" | "photoSource" | "licence"> {
  const house = slug.replace(/^history-/, "");
  try {
    const parsed = JSON.parse(body) as Partial<HistoryCircleNote>;
    const kind = HISTORY_KINDS.has(parsed.kind as HistoryCircleKind)
      ? (parsed.kind as HistoryCircleKind)
      : "Memory";
    return {
      house: typeof parsed.house === "string" && parsed.house ? parsed.house : house,
      kind,
      text: (parsed.text ?? "").trim() || body,
      year: (parsed.year ?? "").trim(),
      link: (parsed.link ?? "").trim(),
      photoSource: (parsed.photoSource ?? "").trim(),
      licence: (parsed.licence ?? "").trim(),
    };
  } catch {
    return {
      house,
      kind: "Memory",
      text: body,
      year: "",
      link: "",
      photoSource: "",
      licence: "",
    };
  }
}

export const listHistoryCircleNotes = createServerFn({ method: "GET" }).handler(async () => {
  try {
  await ensureHub();
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    artist_slug: string;
    body: string;
    submitted_name: string;
    created_at: unknown;
  }>`
    select id, artist_slug, body, submitted_name, created_at
    from hub_notes
    where artist_slug like 'history-%'
      and coalesce(status, 'published') = 'published'
    order by created_at desc
  `;
  return rows.map((row) => {
    const parsed = parseHistoryNote(row.body, row.artist_slug);
    return {
      id: row.id,
      submittedName: row.submitted_name,
      createdAt: toIso(row.created_at),
      ...parsed,
    } satisfies HistoryCircleNote;
  });
  } catch (err) {
    console.error("listHistoryCircleNotes db failed", err);
    return [] as HistoryCircleNote[];
  }
});

export const addHistoryCircleNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      house: string;
      kind: HistoryCircleKind;
      text: string;
      year?: string;
      link?: string;
      photoSource?: string;
      licence?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const text = data.text.trim();
    if (text.length < 8) throw new Error("Write a little more — a sentence is enough.");
    if (!HISTORY_KINDS.has(data.kind)) throw new Error("Pick a kind.");
    const house = data.house.trim().toLowerCase();
    if (!house) throw new Error("Pick a house.");
    const photoSource = (data.photoSource ?? "").trim();
    const licence = (data.licence ?? "").trim();
    if (data.kind === "Photograph") {
      if (!photoSource) throw new Error("Give a source URL for the photograph.");
      if (!licence) throw new Error("Name the licence.");
      const hay = `${photoSource} ${text} ${licence}`.toLowerCase();
      if (/midjourney|dall-?e|stable diffusion|ai[- ]generated|generated image/.test(hay)) {
        throw new Error("Refuse generated images. Use a real archive or photographer source.");
      }
    }
    const name = await submitterName(context.userId);
    const body = JSON.stringify({
      kind: data.kind,
      house,
      text,
      year: (data.year ?? "").trim(),
      link: (data.link ?? "").trim(),
      photoSource,
      licence,
    });
    const sql = await getSql();
    await sql`
      insert into hub_notes (artist_slug, body, submitted_by, submitted_name, status)
      values (${historySlug(house)}, ${body}, ${context.userId}, ${name}, 'pending')
    `;
    return { ok: true as const, pending: true as const };
  });

export const addHubFestival = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      city: string;
      country: string;
      when: string;
      nextStartsAt: string;
      bio: string;
      site: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { slug: "pending", pending: true as const };
    const name = data.name.trim();
    const country = data.country.trim();
    if (!name) throw new Error("Name the festival.");
    if (!country) throw new Error("Name the country.");
    const starts = new Date(data.nextStartsAt);
    if (Number.isNaN(starts.getTime())) throw new Error("Pick the next date.");
    const slug = await uniqueSlug("hub_festivals", name);
    const sql = await getSql();
    const submitted = await submitterName(context.userId);
    await sql`
      insert into hub_festivals (
        slug, name, city, country, when_text, next_starts_at, bio, site,
        submitted_by, submitted_name, status
      ) values (
        ${slug}, ${name}, ${data.city.trim()}, ${country}, ${data.when.trim()},
        ${starts.toISOString()}, ${data.bio.trim()}, ${data.site.trim()},
        ${context.userId}, ${submitted}, ${gate.status}
      )
    `;
    return { slug, pending: gate.pending };
  });

export const addHubJam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      city: string;
      country: string;
      venue: string;
      address?: string;
      hours?: string;
      when: string;
      nextStartsAt: string;
      bio: string;
      kind: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { slug: "pending", pending: true as const };
    const name = data.name.trim();
    const country = data.country.trim();
    if (!name) throw new Error("Name the jam.");
    if (!country) throw new Error("Name the country.");
    const starts = new Date(data.nextStartsAt);
    if (Number.isNaN(starts.getTime())) throw new Error("Pick the next date.");
    const slug = await uniqueSlug("hub_jams", name);
    const sql = await getSql();
    const submitted = await submitterName(context.userId);
    const kind = data.kind === "meetup" ? "meetup" : "regular";
    await sql`
      insert into hub_jams (
        slug, name, city, country, venue, address, hours, when_text, next_starts_at, bio, kind,
        submitted_by, submitted_name, status
      ) values (
        ${slug}, ${name}, ${data.city.trim()}, ${country}, ${data.venue.trim()},
        ${data.address?.trim() ?? ""}, ${data.hours?.trim() ?? ""},
        ${data.when.trim() || (kind === "meetup" ? "Meetup jam" : "")},
        ${starts.toISOString()}, ${data.bio.trim()}, ${kind},
        ${context.userId}, ${submitted}, ${gate.status}
      )
    `;
    return { slug, pending: gate.pending };
  });

export const listHubVenues = createServerFn({ method: "GET" }).handler(async () => {
  try {
  await ensureHub();
  try {
    await syncDiscoveries();
  } catch {
    /* scan import should not hide venues */
  }
  const sql = await getSql();
  const rows = await sql<{
    slug: string;
    name: string;
    city: string;
    country: string;
    kind: string;
    site: string;
    contact: string;
    bio: string;
    scene: string;
    booker: string;
  }>`
    select slug, name, city, country, kind, site, contact, bio, scene, booker from hub_venues
    where coalesce(status, 'published') = 'published'
    order by name
  `;
  return rows.map(
    (row) =>
      ({
        slug: row.slug,
        name: row.name,
        city: row.city,
        country: row.country,
        kind: row.kind,
        site: row.site,
        contact: row.contact,
        bio: row.bio,
        scene: (row.scene as Venue["scene"]) || "gypsy",
        booker: row.booker ?? "",
      }) satisfies Venue,
  );
  } catch (err) {
    console.error("listHubVenues db failed", err);
    return [] as Venue[];
  }
});

export const getHubVenue = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureHub();
    const sql = await getSql();
    const rows = await sql<{
      slug: string;
      name: string;
      city: string;
      country: string;
      kind: string;
      site: string;
      contact: string;
      bio: string;
      scene: string;
      booker: string;
    }>`
      select slug, name, city, country, kind, site, contact, bio, scene, booker
      from hub_venues where slug = ${slug} limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      slug: row.slug,
      name: row.name,
      city: row.city,
      country: row.country,
      kind: row.kind,
      site: row.site,
      contact: row.contact,
      bio: row.bio,
      scene: (row.scene as Venue["scene"]) || "gypsy",
      booker: row.booker ?? "",
    } satisfies Venue;
  });

export const addHubVenue = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      city: string;
      country: string;
      kind: string;
      site: string;
      contact: string;
      bio: string;
      scene: string;
      booker: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { slug: "pending", pending: true as const };
    const name = data.name.trim();
    const country = data.country.trim();
    if (!name) throw new Error("Name the venue.");
    if (!country) throw new Error("Name the country.");
    const slug = await uniqueSlug("hub_venues", name);
    const sql = await getSql();
    const submitted = await submitterName(context.userId);
    const scene = data.scene === "jazz" || data.scene === "world" ? data.scene : "gypsy";
    await sql`
      insert into hub_venues (
        slug, name, city, country, kind, site, contact, bio, scene, booker, submitted_by, submitted_name, status
      ) values (
        ${slug}, ${name}, ${data.city.trim()}, ${country},
        ${data.kind.trim() || "Club"}, ${data.site.trim()}, ${data.contact.trim()},
        ${data.bio.trim()}, ${scene}, ${data.booker.trim()}, ${context.userId}, ${submitted}, ${gate.status}
      )
    `;
    return { slug, pending: gate.pending };
  });

export const listHubLuthiers = createServerFn({ method: "GET" }).handler(async () => {
  try {
  await ensureHub();
  const sql = await getSql();
  const rows = await sql<{
    slug: string;
    name: string;
    city: string;
    country: string;
    site: string;
    contact: string;
    bio: string;
    craft: string;
    note: string;
  }>`
    select slug, name, city, country, site, contact, bio, craft, note from hub_luthiers
    where coalesce(status, 'published') = 'published'
    order by name
  `;
  return rows.map(
    (row) =>
      ({
        slug: row.slug,
        name: row.name,
        city: row.city,
        country: row.country,
        site: row.site,
        contact: row.contact,
        bio: row.bio,
        address: "",
        phone: "",
        email: "",
        hours: "",
        craft: parseLuthierCraft(row.craft),
        note: row.note ?? "",
      }) satisfies Luthier,
  );
  } catch (err) {
    console.error("listHubLuthiers db failed", err);
    return [] as Luthier[];
  }
});

export const getHubLuthier = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureHub();
    const sql = await getSql();
    const rows = await sql<{
      slug: string;
      name: string;
      city: string;
      country: string;
      site: string;
      contact: string;
      bio: string;
      craft: string;
      note: string;
    }>`
      select slug, name, city, country, site, contact, bio, craft, note
      from hub_luthiers where slug = ${slug} limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      slug: row.slug,
      name: row.name,
      city: row.city,
      country: row.country,
      site: row.site,
      contact: row.contact,
      bio: row.bio,
      address: "",
      phone: "",
      email: "",
      hours: "",
      craft: parseLuthierCraft(row.craft),
      note: row.note ?? "",
    } satisfies Luthier;
  });

export const addHubLuthier = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      city: string;
      country: string;
      site: string;
      contact: string;
      bio: string;
      craft?: string;
      note?: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { slug: "pending", pending: true as const };
    const name = data.name.trim();
    const country = data.country.trim();
    if (!name) throw new Error("Name the luthier.");
    if (!country) throw new Error("Name the country.");
    const slug = await uniqueSlug("hub_luthiers", name);
    const sql = await getSql();
    const submitted = await submitterName(context.userId);
    const craft = parseLuthierCraft(data.craft);
    const note = (data.note ?? "").trim();
    await sql`
      insert into hub_luthiers (
        slug, name, city, country, site, contact, bio, craft, note, submitted_by, submitted_name, status
      ) values (
        ${slug}, ${name}, ${data.city.trim()}, ${country},
        ${data.site.trim()}, ${data.contact.trim()}, ${data.bio.trim()},
        ${craft}, ${note}, ${context.userId}, ${submitted}, ${gate.status}
      )
    `;
    return { slug, pending: gate.pending };
  });

export const addHubArtist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { name: string; country: string; instruments: string; bio: string; hp?: string; turnstile?: string }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { slug: "pending", existed: false, pending: true as const };
    const name = data.name.trim();
    const country = data.country.trim();
    if (!name) throw new Error("Name the musician.");
    if (!country) throw new Error("Name the country they are based in.");
    if (gate.pending) {
      const who = await submitterName(context.userId);
      const sql = await getSql();
      await sql`
        insert into hub_notes (artist_slug, body, submitted_by, submitted_name, status)
        values (
          ${"pending-artist"},
          ${JSON.stringify({ name, country, instruments: data.instruments.trim(), bio: data.bio.trim() })},
          ${context.userId}, ${who}, ${"pending"}
        )
      `;
      return { slug: "pending", existed: false, pending: true as const };
    }
    const resolved = await ensureCatalogArtist({
      name,
      origin: country,
      instruments: data.instruments.trim(),
      notable: data.bio.trim() || "Added by the hub",
    });
    if (!resolved) throw new Error("Name the musician.");
    if (data.bio.trim() && resolved.kind === "legend") {
      const sql = await getSql();
      await sql`
        update legends
        set bio = ${data.bio.trim()},
            instruments = ${data.instruments.trim() || ""},
            origin = ${country},
            years = ${country},
            bio_status = ${data.bio.trim().length > 80 ? "ok" : "stub"}
        where slug = ${resolved.slug} and catalog_source = 'auto'
      `;
    }
    return { slug: resolved.slug, existed: !resolved.created, pending: false as const };
  });

export type ChatKind = "festival" | "jam" | "country" | "venue" | "luthier" | "shop";

export type HubChatMessage = {
  id: number;
  body: string;
  chatName: string;
  createdAt: string;
};

export const listHubChat = createServerFn({ method: "GET" })
  .validator((input: { kind: ChatKind; slug: string }) => input)
  .handler(async ({ data }) => {
    try {
    await ensureHub();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      body: string;
      chat_name: string;
      created_at: unknown;
    }>`
      select id, body, chat_name, created_at
      from hub_chat
      where target_kind = ${data.kind} and target_slug = ${data.slug}
      order by created_at asc
    `;
    return rows.map((row) => ({
      id: row.id,
      body: row.body,
      chatName: row.chat_name,
      createdAt: toIso(row.created_at),
    })) satisfies HubChatMessage[];
    } catch (err) {
      console.error("listHubChat db failed", err);
      return [] as HubChatMessage[];
    }
  });

export const getMyChatName = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureHub();
    const sql = await getSql();
    const saved = await sql<{ chat_name: string }>`
      select chat_name from hub_profiles where user_id = ${context.userId} limit 1
    `;
    if (saved[0]?.chat_name) return saved[0].chat_name;
    return submitterName(context.userId);
  });

export const addHubChat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { kind: ChatKind; slug: string; body: string; chatName: string }) =>
      input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const body = data.body.trim();
    const chatName = data.chatName.trim();
    if (body.length < 2) throw new Error("Write a comment.");
    if (!chatName) throw new Error("Put a name on the comment.");
    if (!data.slug) throw new Error("Missing page.");
    const sql = await getSql();
    await sql`
      insert into hub_profiles (user_id, chat_name, updated_at)
      values (${context.userId}, ${chatName}, now())
      on conflict (user_id) do update set chat_name = excluded.chat_name, updated_at = now()
    `;
    await sql`
      insert into hub_chat (target_kind, target_slug, body, user_id, chat_name)
      values (${data.kind}, ${data.slug}, ${body}, ${context.userId}, ${chatName})
    `;
    return { ok: true as const };
  });

export type JoinedArtist = {
  slug: string;
  userId: string;
};

export const listJoinedArtists = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureHub();
    const sql = await getSql();
    const fromPages = await sql<{ slug: string; user_id: string }>`
    select slug, user_id from profiles
  `;
    const fromClaims = await sql<{ artist_slug: string; user_id: string }>`
    select artist_slug, user_id from hub_profiles where artist_slug <> ''
  `;
    const map = new Map<string, string>();
    for (const row of fromPages) map.set(row.slug, row.user_id);
    for (const row of fromClaims) map.set(row.artist_slug, row.user_id);
    return [...map.entries()].map(([slug, userId]) => ({ slug, userId })) satisfies JoinedArtist[];
  } catch (err) {
    console.error("list joined artists failed", err);
    return [];
  }
});

export const claimArtist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((slug: string) => slug)
  .handler(async ({ context, data: slug }) => {
    await ensureHub();
    if (!slug) throw new Error("Missing artist.");
    const sql = await getSql();
    const name = await submitterName(context.userId);
    await sql`
      insert into hub_profiles (user_id, chat_name, artist_slug, updated_at)
      values (${context.userId}, ${name}, ${slug}, now())
      on conflict (user_id) do update set artist_slug = excluded.artist_slug, updated_at = now()
    `;
    return { ok: true as const };
  });

export type HubTeacher = {
  id: number;
  countrySlug: string;
  name: string;
  instruments: string;
  contact: string;
  note: string;
  region: string;
  city: string;
  userId: string;
  artistSlug: string;
};

function catalogTeachers(countrySlug?: string): HubTeacher[] {
  const rows = CATALOG_TEACHERS.filter(
    (row) => !countrySlug || row.countrySlug === countrySlug,
  );
  return rows.map((teacher, index) => ({
    id: index + 1,
    countrySlug: teacher.countrySlug,
    name: teacher.name,
    instruments: teacher.instruments,
    contact: teacher.contact,
    note: teacher.note,
    region: teacher.region,
    city: teacher.city,
    userId: "",
    artistSlug: teacher.artistSlug,
  }));
}

export const listHubTeachers = createServerFn({ method: "GET" })
  .validator((countrySlug: string) => countrySlug)
  .handler(async ({ data: countrySlug }) => {
    try {
    await ensureHub();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      country_slug: string;
      name: string;
      instruments: string;
      contact: string;
      note: string;
      region: string;
      city: string;
      user_id: string;
      artist_slug: string;
    }>`
      select id, country_slug, name, instruments, contact, note, region, city, user_id, artist_slug
      from hub_teachers
      where country_slug = ${countrySlug} and coalesce(status, 'published') = 'published'
      order by created_at desc
    `;
    return rows.map((row) => ({
      id: row.id,
      countrySlug: row.country_slug,
      name: row.name,
      instruments: row.instruments,
      contact: row.contact,
      note: row.note,
      region: row.region ?? "",
      city: row.city ?? "",
      userId: row.user_id,
      artistSlug: row.artist_slug ?? "",
    })) satisfies HubTeacher[];
    } catch (err) {
      console.error("listHubTeachers db failed", err);
      return catalogTeachers(countrySlug);
    }
  });

export const listAllHubTeachers = createServerFn({ method: "GET" }).handler(async () => {
  try {
  await ensureHub();
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    country_slug: string;
    name: string;
    instruments: string;
    contact: string;
    note: string;
    region: string;
    city: string;
    user_id: string;
    artist_slug: string;
  }>`
    select id, country_slug, name, instruments, contact, note, region, city, user_id, artist_slug
    from hub_teachers
    where coalesce(status, 'published') = 'published'
    order by country_slug, name
  `;
  if (rows.length === 0) return catalogTeachers();
  return rows.map((row) => ({
    id: row.id,
    countrySlug: row.country_slug,
    name: row.name,
    instruments: row.instruments,
    contact: row.contact,
    note: row.note,
    region: row.region ?? "",
    city: row.city ?? "",
    userId: row.user_id,
    artistSlug: row.artist_slug ?? "",
  })) satisfies HubTeacher[];
  } catch (err) {
    console.error("listAllHubTeachers db failed", err);
    return catalogTeachers();
  }
});

export const addHubTeacher = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      countrySlug?: string;
      country?: string;
      region?: string;
      city?: string;
      name: string;
      instruments: string;
      contact: string;
      note: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { ok: true as const, countrySlug: "", pending: true as const };
    const name = data.name.trim();
    if (!name) throw new Error("Put your name.");
    const contact = data.contact.trim();
    if (!contact) throw new Error("Put a way to contact you.");
    const resolved =
      data.countrySlug?.trim() ||
      countrySlug(resolveCountry(data.country ?? "") ?? data.country ?? "");
    if (!resolved) throw new Error("Pick a country.");
    const sql = await getSql();
    await sql`
      insert into hub_teachers (country_slug, name, instruments, contact, note, region, city, user_id, status)
      values (
        ${resolved}, ${name}, ${data.instruments.trim()},
        ${contact}, ${data.note.trim()}, ${data.region?.trim() ?? ""},
        ${data.city?.trim() ?? ""}, ${context.userId}, ${gate.status}
      )
    `;
    return { ok: true as const, countrySlug: resolved, pending: gate.pending };
  });

export type PendingHubItem = {
  kind: "jam" | "concert" | "festival" | "history" | "archive" | "clip" | "note" | "venue" | "luthier" | "teacher" | "artist";
  id: string;
  title: string;
  who: string;
  when: string;
};

export const listPendingHub = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureHub();
    const sql = await getSql();
    const owners = await sql<{ user_id: string }>`select user_id from hub_owners`;
    if (!owners.some((row) => row.user_id === context.userId)) {
      throw new Error("Owner desk is only for the hub owner.");
    }
    const items: PendingHubItem[] = [];
    const concerts = await sql<{
      id: number;
      title: string;
      artist_name: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, title, artist_name, submitted_name, created_at
      from hub_concerts where status = 'pending' order by created_at desc
    `;
    for (const row of concerts) {
      items.push({
        kind: "concert",
        id: String(row.id),
        title: `${row.artist_name} — ${row.title}`,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }
    const jams = await sql<{ slug: string; name: string; submitted_name: string; created_at: unknown }>`
      select slug, name, submitted_name, created_at
      from hub_jams where status = 'pending' order by created_at desc
    `;
    for (const row of jams) {
      items.push({
        kind: "jam",
        id: row.slug,
        title: row.name,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }
    const festivals = await sql<{ slug: string; name: string; submitted_name: string; created_at: unknown }>`
      select slug, name, submitted_name, created_at
      from hub_festivals where status = 'pending' order by created_at desc
    `;
    for (const row of festivals) {
      items.push({
        kind: "festival",
        id: row.slug,
        title: row.name,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }
    const history = await sql<{
      id: number;
      body: string;
      artist_slug: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, body, artist_slug, submitted_name, created_at
      from hub_notes
      where status = 'pending' and artist_slug like 'history-%'
      order by created_at desc
    `;
    for (const row of history) {
      const parsed = parseHistoryNote(row.body, row.artist_slug);
      items.push({
        kind: "history",
        id: String(row.id),
        title: `${parsed.kind} · ${parsed.house} — ${parsed.text.slice(0, 80)}`,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }
    const archive = await sql<{
      id: number;
      body: string;
      artist_slug: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, body, artist_slug, submitted_name, created_at
      from hub_notes
      where status = 'pending' and artist_slug like 'archive-%'
      order by created_at desc
    `;
    for (const row of archive) {
      const parsed = parseArchiveNote(row.body, row.artist_slug);
      items.push({
        kind: "archive",
        id: String(row.id),
        title: `${parsed.name || parsed.country} — ${parsed.text.slice(0, 80)}`,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }
    const clips = await sql<{ id: number; title: string; artist_slug: string; submitted_name: string; created_at: unknown }>`
      select id, title, artist_slug, submitted_name, created_at
      from hub_clips where status = 'pending' order by created_at desc
    `;
    for (const row of clips) {
      items.push({
        kind: "clip",
        id: String(row.id),
        title: `${row.artist_slug} — ${row.title || "clip"}`,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }
    const notes = await sql<{ id: number; body: string; artist_slug: string; submitted_name: string; created_at: unknown }>`
      select id, body, artist_slug, submitted_name, created_at
      from hub_notes
      where status = 'pending'
        and artist_slug not like 'history-%'
        and artist_slug not like 'archive-%'
      order by created_at desc
    `;
    for (const row of notes) {
      const artistPending = row.artist_slug === "pending-artist";
      items.push({
        kind: artistPending ? "artist" : "note",
        id: String(row.id),
        title: artistPending ? row.body.slice(0, 80) : `${row.artist_slug} — ${row.body.slice(0, 80)}`,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }
    const venues = await sql<{ slug: string; name: string; submitted_name: string; created_at: unknown }>`
      select slug, name, submitted_name, created_at from hub_venues where status = 'pending' order by created_at desc
    `;
    for (const row of venues) {
      items.push({ kind: "venue", id: row.slug, title: row.name, who: row.submitted_name, when: toIso(row.created_at) });
    }
    const luthiers = await sql<{ slug: string; name: string; submitted_name: string; created_at: unknown }>`
      select slug, name, submitted_name, created_at from hub_luthiers where status = 'pending' order by created_at desc
    `;
    for (const row of luthiers) {
      items.push({ kind: "luthier", id: row.slug, title: row.name, who: row.submitted_name, when: toIso(row.created_at) });
    }
    const teachers = await sql<{ id: number; name: string; country_slug: string; created_at: unknown }>`
      select id, name, country_slug, created_at from hub_teachers where status = 'pending' order by created_at desc
    `;
    for (const row of teachers) {
      items.push({
        kind: "teacher",
        id: String(row.id),
        title: `${row.name} · ${row.country_slug}`,
        who: row.name,
        when: toIso(row.created_at),
      });
    }
    return items.sort((a, b) => b.when.localeCompare(a.when));
  });

export const publishHubItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: PendingHubItem["kind"]; id: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureHub();
    const sql = await getSql();
    const { bumpApproved } = await import("@/lib/hub-guard");
    const owners = await sql<{ user_id: string }>`select user_id from hub_owners`;
    if (!owners.some((row) => row.user_id === context.userId)) {
      throw new Error("Owner desk is only for the hub owner.");
    }
    if (data.kind === "concert") {
      const row = await sql<{ submitted_by: string }>`select submitted_by from hub_concerts where id = ${Number(data.id)} limit 1`;
      await sql`update hub_concerts set status = 'published' where id = ${Number(data.id)}`;
      if (row[0]?.submitted_by) await bumpApproved(row[0].submitted_by);
    } else if (data.kind === "jam") {
      const row = await sql<{ submitted_by: string }>`select submitted_by from hub_jams where slug = ${data.id} limit 1`;
      await sql`update hub_jams set status = 'published' where slug = ${data.id}`;
      if (row[0]?.submitted_by) await bumpApproved(row[0].submitted_by);
    } else if (data.kind === "festival") {
      const row = await sql<{ submitted_by: string }>`select submitted_by from hub_festivals where slug = ${data.id} limit 1`;
      await sql`update hub_festivals set status = 'published' where slug = ${data.id}`;
      if (row[0]?.submitted_by) await bumpApproved(row[0].submitted_by);
    } else if (data.kind === "clip") {
      const row = await sql<{ submitted_by: string }>`select submitted_by from hub_clips where id = ${Number(data.id)} limit 1`;
      await sql`update hub_clips set status = 'published' where id = ${Number(data.id)}`;
      if (row[0]?.submitted_by) await bumpApproved(row[0].submitted_by);
    } else if (data.kind === "venue") {
      const row = await sql<{ submitted_by: string }>`select submitted_by from hub_venues where slug = ${data.id} limit 1`;
      await sql`update hub_venues set status = 'published' where slug = ${data.id}`;
      if (row[0]?.submitted_by) await bumpApproved(row[0].submitted_by);
    } else if (data.kind === "luthier") {
      const row = await sql<{ submitted_by: string }>`select submitted_by from hub_luthiers where slug = ${data.id} limit 1`;
      await sql`update hub_luthiers set status = 'published' where slug = ${data.id}`;
      if (row[0]?.submitted_by) await bumpApproved(row[0].submitted_by);
    } else if (data.kind === "teacher") {
      const row = await sql<{ user_id: string }>`select user_id from hub_teachers where id = ${Number(data.id)} limit 1`;
      await sql`update hub_teachers set status = 'published' where id = ${Number(data.id)}`;
      if (row[0]?.user_id) await bumpApproved(row[0].user_id);
    } else if (data.kind === "artist") {
      const row = await sql<{ submitted_by: string; body: string }>`
        select submitted_by, body from hub_notes where id = ${Number(data.id)} limit 1
      `;
      if (row[0]) {
        try {
          const parsed = JSON.parse(row[0].body) as { name?: string; country?: string; instruments?: string; bio?: string };
          await ensureCatalogArtist({
            name: parsed.name ?? "",
            origin: parsed.country ?? "",
            instruments: parsed.instruments ?? "",
            notable: parsed.bio || "Added by the hub",
          });
        } catch {
          /* body was not json */
        }
        await sql`update hub_notes set status = 'published' where id = ${Number(data.id)}`;
        if (row[0].submitted_by) await bumpApproved(row[0].submitted_by);
      }
    } else {
      const row = await sql<{ submitted_by: string }>`select submitted_by from hub_notes where id = ${Number(data.id)} limit 1`;
      await sql`update hub_notes set status = 'published' where id = ${Number(data.id)}`;
      if (row[0]?.submitted_by) await bumpApproved(row[0].submitted_by);
    }
    return { ok: true as const };
  });

export type ArchiveCircleNote = {
  id: number;
  country: string;
  name: string;
  text: string;
  year: string;
  link: string;
  submittedName: string;
  createdAt: string;
};

function archiveNoteSlug(countrySlugValue: string) {
  const key = countrySlugValue.trim().toLowerCase().replace(/\s+/g, "-");
  return key.startsWith("archive-") ? key : `archive-${key}`;
}

function parseArchiveNote(
  body: string,
  slug: string,
): Pick<ArchiveCircleNote, "country" | "name" | "text" | "year" | "link"> {
  const country = slug.replace(/^archive-/, "").replace(/-/g, " ");
  try {
    const parsed = JSON.parse(body) as Partial<ArchiveCircleNote>;
    return {
      country: (parsed.country ?? "").trim() || country,
      name: (parsed.name ?? "").trim(),
      text: (parsed.text ?? "").trim() || body,
      year: (parsed.year ?? "").trim(),
      link: (parsed.link ?? "").trim(),
    };
  } catch {
    return { country, name: "", text: body, year: "", link: "" };
  }
}

export const listArchiveNotes = createServerFn({ method: "GET" })
  .validator((input: { countrySlug: string }) => input)
  .handler(async ({ data }) => {
    await ensureHub();
    const sql = await getSql();
    const slug = archiveNoteSlug(data.countrySlug);
    const rows = await sql<{
      id: number;
      artist_slug: string;
      body: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, artist_slug, body, submitted_name, created_at
      from hub_notes
      where artist_slug = ${slug}
        and coalesce(status, 'published') = 'published'
      order by created_at desc
    `;
    return rows.map((row) => ({
      id: row.id,
      submittedName: row.submitted_name,
      createdAt: toIso(row.created_at),
      ...parseArchiveNote(row.body, row.artist_slug),
    })) satisfies ArchiveCircleNote[];
  });

export const addArchiveNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      countrySlug: string;
      country: string;
      name: string;
      text: string;
      year?: string;
      link?: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { hp: data.hp, turnstile: data.turnstile });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const name = data.name.trim();
    const text = data.text.trim();
    if (!name) throw new Error("Name the person or orchestra.");
    if (text.length < 8) throw new Error("Write a little more — a sentence is enough.");
    const body = JSON.stringify({
      country: data.country.trim(),
      name,
      text,
      year: (data.year ?? "").trim(),
      link: (data.link ?? "").trim(),
    });
    const who = await submitterName(context.userId);
    const sql = await getSql();
    await sql`
      insert into hub_notes (artist_slug, body, submitted_by, submitted_name, status)
      values (${archiveNoteSlug(data.countrySlug)}, ${body}, ${context.userId}, ${who}, 'pending')
    `;
    return { ok: true as const, pending: true as const };
  });

export const startHubEmailVerification = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { startEmailVerification } = await import("@/lib/hub-guard");
    const session = await getSessionUser();
    const email = session?.email ?? "";
    if (!email) throw new Error("Need an email on this account.");
    const token = await startEmailVerification(context.userId, email);
    return { token };
  });

export const confirmHubEmail = createServerFn({ method: "POST" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    const { confirmEmailToken } = await import("@/lib/hub-guard");
    const ok = await confirmEmailToken(token);
    if (!ok) throw new Error("That link is old or already used.");
    return { ok: true as const };
  });

