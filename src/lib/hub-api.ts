import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, getDbSource } from "@/lib/db";
import type { Concert } from "@/lib/api";
import type { Festival } from "@/lib/festivals";
import type { Jam } from "@/lib/jams";
import type { Venue } from "@/lib/venues";
import type { Luthier } from "@/lib/luthiers";
import { parseLuthierCraft } from "@/lib/luthiers";
import { countrySlug, resolveCountry } from "@/lib/geo";
import { ensureFanTables } from "@/lib/fans";
import { slugify, toIso, wallClockIso, youtubeVideoId } from "@/lib/utils";
import { CATALOG_TEACHERS } from "@/lib/teachers";
import { ensureCatalogArtist } from "@/lib/catalog";
import { namedPhotoUrl } from "@/lib/profile-photos";

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

let hubReady: Promise<void> | null = null;

async function ensureHub() {
  if (getDbSource() === "none" || getDbSource() === "do") return;
  hubReady ??= runEnsureHub().catch((err) => {
    hubReady = null;
    throw err;
  });
  await hubReady;
}

async function runEnsureHub() {
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
    alter table hub_concerts add column if not exists source_id text not null default ''
  `);
  await sql.query(`
    alter table hub_jams add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_jams add column if not exists updated_at timestamptz not null default '1970-01-01 00:00:00+00'
  `);
  await sql.query(`
    alter table hub_jams add column if not exists updated_by text not null default ''
  `);
  await sql.query(`
    alter table hub_jams add column if not exists leader text not null default ''
  `);
  await sql.query(`
    alter table hub_jams add column if not exists leader_contact text not null default ''
  `);
  await sql.query(`
    update hub_jams
    set venue = 'Escal',
        address = '31 boulevard du Chemin de Fer, 51420 Witry-lès-Reims',
        hours = '18:00–20:00',
        when_text = 'Every Thursday',
        next_starts_at = '2026-09-17T16:00:00.000Z',
        leader = 'Frédéric Lefebvre, Gilles Valette',
        leader_contact = 'accueil@escal-witry.fr',
        bio = 'Thursday jam at Escal in Witry-lès-Reims, just outside Reims. A moment to play, not to judge — no lesson, no concert, no teacher, no audience, no pressure. Amateur musicians of every level, any acoustic instrument, from 16. Practice accompaniment or try improvising on jazz manouche standards; mistakes are part of the night. Witryats and visitors: 5€ under 16, 16€ from 16. Volunteer chairs: Frédéric Lefebvre and Gilles Valette. Un moment pour jouer, pas pour juger.'
    where slug = 'reims-souk'
      and (venue = 'Souk' or address = 'Reims' or bio like '%Souk%')
  `);
  await sql.query(`
    update hub_jams
    set leader = 'Asso Gypsy Jazz à Reims — Frédéric Lefebvre, Gilles Valette',
        leader_contact = ''
    where slug = 'reims-souk'
  `);
  await sql.query(`
    update hub_jams
    set hours = '19:30–23:30',
        when_text = 'Monthly, Friday',
        next_starts_at = '2026-09-25T17:30:00.000Z',
        address = 'Rijkstraatweg 37, Ubbergen',
        kind = 'regular',
        leader = 'Sigrid Booden',
        leader_contact = 'sigridvannistelrooij@icloud.com',
        bio = 'Monthly Friday jam near Nijmegen at Café van de Refter, Rijkstraatweg 37, Ubbergen, 19:30–23:30. Organised by Sigrid Booden. Sign up: sigridvannistelrooij@icloud.com.'
    where slug = 'ubbergen-refter-jam'
  `);
  await sql.query(`
    alter table hub_festivals add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    alter table hub_notes add column if not exists status text not null default 'published'
  `);
  await sql.query(`
    create table if not exists hub_artist_bios (
      artist_slug text primary key,
      bio text not null,
      submitted_by text not null,
      submitted_name text not null default '',
      status text not null default 'published',
      updated_at timestamptz not null default now()
    )
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
  await sql`
    delete from hub_teachers
    where country_slug = 'netherlands'
      and lower(name) = 'stochelo rosenberg'
  `;
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

function memoRows<T>(ttlMs: number) {
  let at = 0;
  let rows: T[] | null = null;
  let inflight: Promise<T[]> | null = null;
  const run = (async (load: () => Promise<T[]>) => {
    if (rows && Date.now() - at < ttlMs) return rows;
    if (inflight) return inflight;
    inflight = load()
      .then((next) => {
        rows = next;
        at = Date.now();
        return next;
      })
      .finally(() => {
        inflight = null;
      });
    return inflight;
  }) as ((load: () => Promise<T[]>) => Promise<T[]>) & { bust: () => void };
  run.bust = () => {
    at = 0;
    rows = null;
  };
  return run;
}

const hubJamsMemo = memoRows<Jam>(20_000);
const hubFestivalsMemo = memoRows<Festival>(20_000);
const hubConcertsMemo = memoRows<Concert>(20_000);

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
  source_id?: string;
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
    sourceId: row.source_id ?? "",
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
  leader?: string;
  leader_contact?: string;
  second_starts_at?: unknown;
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
    leader: row.leader ?? "",
    leaderContact: row.leader_contact ?? "",
    secondStartsAt: row.second_starts_at ? toIso(row.second_starts_at) : "",
  };
}

let jamLeaderReady: Promise<void> | null = null;

async function ensureJamLeaderColumns() {
  if (getDbSource() === "none") return;
  jamLeaderReady ??= (async () => {
    const sql = await getSql();
    for (const col of [
      "leader text not null default ''",
      "leader_contact text not null default ''",
      "second_starts_at timestamptz",
    ]) {
      try {
        await sql.query(`alter table hub_jams add column if not exists ${col}`);
      } catch {
        /* column already there */
      }
    }
  })().catch((err) => {
    jamLeaderReady = null;
    throw err;
  });
  await jamLeaderReady;
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
      const load = async () => {
        await ensureHub();
        const sql = await getSql();
        const rows = slug
          ? await sql<Parameters<typeof mapHubConcert>[0]>`
              select id, title, venue, city, country, starts_at, note, artist_name, artist_slug, artist_kind,
                     coalesce(source_id, '') as source_id
              from hub_concerts
              where artist_slug = ${slug} and coalesce(status, 'published') = 'published'
              order by starts_at asc
            `
          : await sql<Parameters<typeof mapHubConcert>[0]>`
              select id, title, venue, city, country, starts_at, note, artist_name, artist_slug, artist_kind,
                     coalesce(source_id, '') as source_id
              from hub_concerts
              where coalesce(status, 'published') = 'published'
              order by starts_at asc
            `;
        return rows.map(mapHubConcert);
      };
      if (!slug) return await hubConcertsMemo(load);
      return await load();
    } catch (err) {
      console.error("listHubConcerts db failed", err);
      return [];
    }
  });

export const listHubClips = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
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
    } catch (err) {
      console.error("listHubClips db failed", err);
      return [];
    }
  });

export const listHubNotes = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
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
    } catch (err) {
      console.error("listHubNotes db failed", err);
      return [];
    }
  });

export const getHubArtistBio = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      await ensureHub();
      const sql = await getSql();
      const rows = await sql<{ bio: string }>`
        select bio from hub_artist_bios
        where artist_slug = ${slug} and coalesce(status, 'published') = 'published'
        limit 1
      `;
      const bio = rows[0]?.bio.trim() ?? "";
      return bio || null;
    } catch (err) {
      console.error("getHubArtistBio db failed", err);
      return null;
    }
  });

export const updateHubArtistBio = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string; bio: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { sessionTrusted: true });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const slug = data.slug.trim();
    const bio = data.bio.trim();
    if (!slug) throw new Error("Missing musician.");
    if (bio.length < 20) throw new Error("Write a little more — a short paragraph is enough.");
    if (bio.length > 4000) throw new Error("Keep the bio under a few thousand characters.");
    const name = await submitterName(context.userId);
    const sql = await getSql();
    await sql.query(
      `insert into hub_artist_bios (artist_slug, bio, submitted_by, submitted_name, status, updated_at)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (artist_slug) do update set
         bio = excluded.bio,
         submitted_by = excluded.submitted_by,
         submitted_name = excluded.submitted_name,
         status = excluded.status,
         updated_at = excluded.updated_at`,
      [slug, bio, context.userId, name, gate.status, new Date().toISOString()],
    );
    return { ok: true as const, pending: gate.pending };
  });

export const listHubFestivals = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await hubFestivalsMemo(async () => {
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
        from hub_festivals
        where coalesce(status, 'published') = 'published'
        order by next_starts_at asc
      `;
      return rows.map(mapFestival);
    });
  } catch (err) {
    console.error("list hub festivals failed", err);
    return [];
  }
});

export const listHubJams = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await hubJamsMemo(async () => {
      await ensureHub();
      await ensureJamLeaderColumns();
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
        leader: string;
        leader_contact: string;
        second_starts_at: unknown;
      }>`
        select slug, name, city, country, venue, when_text, next_starts_at, bio, kind, address, hours,
               coalesce(leader, '') as leader, coalesce(leader_contact, '') as leader_contact,
               second_starts_at
        from hub_jams
        where coalesce(status, 'published') = 'published'
        order by next_starts_at asc
      `;
      return rows.map(mapJam);
    });
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
    await ensureJamLeaderColumns();
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
      leader: string;
      leader_contact: string;
      second_starts_at: unknown;
    }>`
      select slug, name, city, country, venue, when_text, next_starts_at, bio, kind, address, hours,
             coalesce(leader, '') as leader, coalesce(leader_contact, '') as leader_contact,
             second_starts_at
      from hub_jams
      where slug = ${slug} and coalesce(status, 'published') = 'published'
      limit 1
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
    const gate = await gateContribution(context.userId, {
      hp: data.hp,
      turnstile: data.turnstile,
      startsAt: data.startsAt,
    });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const title = data.title.trim();
    const country = data.country.trim();
    const artistSlug = data.artistSlug.trim();
    if (!title) throw new Error("Give the concert a title.");
    if (!country) throw new Error("Name the country.");
    if (!artistSlug) throw new Error("Pick an artist.");
    const starts = new Date(wallClockIso(data.startsAt));
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
    hubConcertsMemo.bust();
    return { ok: true as const, pending: gate.pending };
  });

export const updateHubConcert = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id: string;
      artistSlug: string;
      artistName: string;
      title: string;
      venue: string;
      city: string;
      country: string;
      startsAt: string;
      note: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { sessionTrusted: true });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const title = data.title.trim();
    const country = data.country.trim();
    const artistSlug = data.artistSlug.trim();
    if (!title) throw new Error("Give the concert a title.");
    if (!country) throw new Error("Name the country.");
    if (!artistSlug) throw new Error("Pick an artist.");
    const starts = new Date(wallClockIso(data.startsAt));
    if (Number.isNaN(starts.getTime())) throw new Error("Pick a valid date.");
    const sql = await getSql();
    const submitted = await submitterName(context.userId);
    const hubId = data.id.startsWith("h-") ? Number(data.id.slice(2)) : Number.NaN;
    if (Number.isFinite(hubId)) {
      await sql.query(
        `update hub_concerts
         set title = $1, venue = $2, city = $3, country = $4, starts_at = $5, note = $6
         where id = $7`,
        [title, data.venue.trim(), data.city.trim(), country, starts.toISOString(), data.note.trim(), hubId],
      );
    } else {
      const resolved = await ensureCatalogArtist({
        slug: artistSlug,
        name: data.artistName.trim() || artistSlug,
        origin: country,
        notable: "From a concert on the hub",
      });
      if (!resolved) throw new Error("Pick an artist.");
      await sql.query(
        `insert into hub_concerts (
          artist_slug, artist_name, artist_kind, title, venue, city, country,
          starts_at, note, submitted_by, submitted_name, status, source_id
        ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          resolved.slug,
          resolved.name,
          resolved.kind,
          title,
          data.venue.trim(),
          data.city.trim(),
          country,
          starts.toISOString(),
          data.note.trim(),
          context.userId,
          submitted,
          "published",
          data.id,
        ],
      );
    }
    hubConcertsMemo.bust();
    return { ok: true as const, pending: false };
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
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, { sessionTrusted: true });
    if (gate.skip) return { ok: true as const, pending: true as const };
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
      values (${historySlug(house)}, ${body}, ${context.userId}, ${name}, ${gate.status})
    `;
    return { ok: true as const, pending: gate.pending };
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
    const gate = await gateContribution(context.userId, {
      hp: data.hp,
      turnstile: data.turnstile,
      startsAt: data.nextStartsAt,
    });
    if (gate.skip) return { slug: "pending", pending: true as const };
    const name = data.name.trim();
    const country = data.country.trim();
    if (!name) throw new Error("Name the festival.");
    if (!country) throw new Error("Name the country.");
    const starts = new Date(wallClockIso(data.nextStartsAt));
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
    hubFestivalsMemo.bust();
    return { slug, pending: gate.pending };
  });

export const updateHubFestival = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      slug: string;
      name: string;
      city: string;
      country: string;
      when: string;
      nextStartsAt: string;
      bio: string;
      site: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    const { gateContribution } = await import("@/lib/hub-guard");
    const { getFestival } = await import("@/lib/festivals");
    const gate = await gateContribution(context.userId, { sessionTrusted: true });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const slug = data.slug.trim();
    if (!slug) throw new Error("Missing festival.");
    const catalog = getFestival(slug);
    const sql = await getSql();
    const existing = await sql.query<{ slug: string }>(
      `select slug from hub_festivals where slug = $1 limit 1`,
      [slug],
    );
    if (!catalog && !existing[0]) throw new Error("That festival is not on the hub.");
    const name = data.name.trim();
    const country = data.country.trim();
    if (!name) throw new Error("Name the festival.");
    if (!country) throw new Error("Name the country.");
    const starts = new Date(wallClockIso(data.nextStartsAt));
    if (Number.isNaN(starts.getTime())) throw new Error("Pick the next date.");
    const submitted = await submitterName(context.userId);
    const status = catalog || existing[0] ? "published" : gate.status;
    await sql.query(
      `insert into hub_festivals (
        slug, name, city, country, when_text, next_starts_at, bio, site,
        submitted_by, submitted_name, status
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      on conflict (slug) do update set
        name = excluded.name,
        city = excluded.city,
        country = excluded.country,
        when_text = excluded.when_text,
        next_starts_at = excluded.next_starts_at,
        bio = excluded.bio,
        site = excluded.site,
        status = excluded.status`,
      [
        slug,
        name,
        data.city.trim(),
        country,
        data.when.trim(),
        starts.toISOString(),
        data.bio.trim(),
        data.site.trim(),
        context.userId,
        submitted,
        status,
      ],
    );
    hubFestivalsMemo.bust();
    return { ok: true as const, slug, pending: status === "pending" };
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
      leader?: string;
      leaderContact?: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    await ensureJamLeaderColumns();
    const { gateContribution } = await import("@/lib/hub-guard");
    const gate = await gateContribution(context.userId, {
      hp: data.hp,
      turnstile: data.turnstile,
      startsAt: data.nextStartsAt,
    });
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
    const leader = data.leader?.trim() ?? "";
    const leaderContact = data.leaderContact?.trim() ?? "";
    await sql`
      insert into hub_jams (
        slug, name, city, country, venue, address, hours, when_text, next_starts_at, bio, kind,
        leader, leader_contact, submitted_by, submitted_name, status
      ) values (
        ${slug}, ${name}, ${data.city.trim()}, ${country}, ${data.venue.trim()},
        ${data.address?.trim() ?? ""}, ${data.hours?.trim() ?? ""},
        ${data.when.trim() || (kind === "meetup" ? "Meetup jam" : "")},
        ${starts.toISOString()}, ${data.bio.trim()}, ${kind},
        ${leader}, ${leaderContact},
        ${context.userId}, ${submitted}, ${gate.status}
      )
    `;
    hubJamsMemo.bust();
    return { slug, pending: gate.pending };
  });

export const updateHubJam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      slug: string;
      name: string;
      city: string;
      country: string;
      venue: string;
      address: string;
      hours: string;
      when: string;
      nextStartsAt: string;
      bio: string;
      leader?: string;
      leaderContact?: string;
      hp?: string;
      turnstile?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureHub();
    await ensureJamLeaderColumns();
    const { gateContribution } = await import("@/lib/hub-guard");
    const { getJam } = await import("@/lib/jams");
    const gate = await gateContribution(context.userId, {
      hp: data.hp,
      turnstile: data.turnstile,
      sessionTrusted: true,
    });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const slug = data.slug.trim();
    if (!slug) throw new Error("Missing jam.");
    const catalog = getJam(slug);
    const sql = await getSql();
    const existing = await sql.query<{ slug: string }>(
      `select slug from hub_jams where slug = $1 limit 1`,
      [slug],
    );
    if (!catalog && !existing[0]) throw new Error("That jam is not on the hub.");
    const name = data.name.trim();
    const country = data.country.trim();
    const venue = data.venue.trim();
    if (!name) throw new Error("Name the jam.");
    if (!country) throw new Error("Name the country.");
    if (!venue) throw new Error("Name the venue.");
    const starts = new Date(data.nextStartsAt);
    if (Number.isNaN(starts.getTime())) throw new Error("Pick the next date.");
    const submitted = await submitterName(context.userId);
    const kind = catalog?.kind === "meetup" ? "meetup" : "regular";
    const status = catalog || existing[0] ? "published" : gate.status;
    const leader = data.leader?.trim() ?? "";
    const leaderContact = data.leaderContact?.trim() ?? "";
    await sql.query(
      `insert into hub_jams (
        slug, name, city, country, venue, address, hours, when_text, next_starts_at, bio, kind,
        leader, leader_contact, submitted_by, submitted_name, status, updated_at, updated_by
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      on conflict (slug) do update set
        name = excluded.name,
        city = excluded.city,
        country = excluded.country,
        venue = excluded.venue,
        address = excluded.address,
        hours = excluded.hours,
        when_text = excluded.when_text,
        next_starts_at = excluded.next_starts_at,
        bio = excluded.bio,
        leader = excluded.leader,
        leader_contact = excluded.leader_contact,
        status = excluded.status,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by`,
      [
        slug,
        name,
        data.city.trim(),
        country,
        venue,
        data.address.trim(),
        data.hours.trim(),
        data.when.trim(),
        starts.toISOString(),
        data.bio.trim(),
        kind,
        leader,
        leaderContact,
        context.userId,
        submitted,
        status,
        new Date().toISOString(),
        context.userId,
      ],
    );
    hubJamsMemo.bust();
    return { ok: true as const, slug, pending: status === "pending" };
  });

export const updateHubJamNight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string; slot: number; startsAt: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureHub();
    await ensureJamLeaderColumns();
    const { gateContribution } = await import("@/lib/hub-guard");
    const { getJam, overlayJam, stepJamNext } = await import("@/lib/jams");
    const gate = await gateContribution(context.userId, {
      sessionTrusted: true,
    });
    if (gate.skip) return { ok: true as const, pending: true as const };
    const slug = data.slug.trim();
    if (!slug) throw new Error("Missing jam.");
    const slot = data.slot === 2 ? 2 : 1;
    const starts = new Date(data.startsAt);
    if (Number.isNaN(starts.getTime())) throw new Error("Pick a date.");
    const catalog = getJam(slug);
    const sql = await getSql();
    const existing = await sql.query<{ slug: string }>(
      `select slug from hub_jams where slug = $1 limit 1`,
      [slug],
    );
    if (!catalog && !existing[0]) throw new Error("That jam is not on the hub.");
    const hub = await sql<{
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
      leader: string;
      leader_contact: string;
      second_starts_at: unknown;
    }>`
      select slug, name, city, country, venue, when_text, next_starts_at, bio, kind, address, hours,
             coalesce(leader, '') as leader, coalesce(leader_contact, '') as leader_contact,
             second_starts_at
      from hub_jams where slug = ${slug} limit 1
    `;
    const jam = overlayJam(catalog, hub[0] ? mapJam(hub[0]) : null);
    if (!jam) throw new Error("That jam is not on the hub.");
    let first = jam.nextStartsAt;
    let second = jam.secondStartsAt && Date.parse(jam.secondStartsAt) > Date.parse(first)
      ? jam.secondStartsAt
      : stepJamNext(jam, first);
    const iso = starts.toISOString();
    if (slot === 1) {
      first = iso;
      if (Date.parse(second) <= Date.parse(first)) second = stepJamNext({ ...jam, nextStartsAt: first }, first);
    } else if (Date.parse(iso) <= Date.parse(first)) {
      second = first;
      first = iso;
    } else {
      second = iso;
    }
    const submitted = await submitterName(context.userId);
    const kind = jam.kind === "meetup" ? "meetup" : "regular";
    const status = catalog || existing[0] ? "published" : gate.status;
    await sql.query(
      `insert into hub_jams (
        slug, name, city, country, venue, address, hours, when_text, next_starts_at, second_starts_at,
        bio, kind, leader, leader_contact, submitted_by, submitted_name, status, updated_at, updated_by
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      on conflict (slug) do update set
        next_starts_at = excluded.next_starts_at,
        second_starts_at = excluded.second_starts_at,
        status = excluded.status,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by`,
      [
        slug,
        jam.name,
        jam.city,
        jam.country,
        jam.venue,
        jam.address,
        jam.hours,
        jam.when,
        first,
        second,
        jam.bio,
        kind,
        jam.leader ?? "",
        jam.leaderContact ?? "",
        context.userId,
        submitted,
        status,
        new Date().toISOString(),
        context.userId,
      ],
    );
    hubJamsMemo.bust();
    return { ok: true as const, slug, pending: status === "pending", first, second };
  });

export const listHubVenues = createServerFn({ method: "GET" }).handler(async () => {
  try {
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
  displayName?: string;
  bio?: string;
  city?: string;
  country?: string;
  instruments?: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  spotifyUrl?: string;
  contactUrl?: string;
  photoUrl?: string;
};

export const listJoinedArtists = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureHub();
    await ensureFanTables();
    const sql = await getSql();
    const map = new Map<string, JoinedArtist>();
    try {
      const fromPages = await sql<{
        slug: string;
        user_id: string;
        display_name: string;
        bio: string;
        city: string;
        country: string;
        instruments: string;
        website_url: string;
        youtube_url: string;
        instagram_url: string;
        spotify_url: string;
        contact_url: string;
        photo_rev: number;
      }>`
        select slug, user_id, display_name, bio, city, country, instruments,
               website_url, youtube_url, instagram_url, coalesce(spotify_url, '') as spotify_url,
               coalesce(contact_url, '') as contact_url,
               coalesce(photo_rev, 0) as photo_rev
        from profiles
      `;
      for (const row of fromPages) {
        map.set(row.slug, {
          slug: row.slug,
          userId: row.user_id,
          displayName: row.display_name,
          bio: row.bio,
          city: row.city,
          country: row.country,
          instruments: row.instruments,
          websiteUrl: row.website_url,
          youtubeUrl: row.youtube_url,
          instagramUrl: row.instagram_url,
          spotifyUrl: row.spotify_url,
          contactUrl: row.contact_url,
          photoUrl: namedPhotoUrl(row.slug, row.photo_rev),
        });
      }
    } catch {
      const fromPages = await sql<{ slug: string; user_id: string }>`select slug, user_id from profiles`;
      for (const row of fromPages) map.set(row.slug, { slug: row.slug, userId: row.user_id });
    }
    try {
      const fromClaims = await sql<{ artist_slug: string; user_id: string }>`
        select artist_slug, user_id from hub_profiles where artist_slug <> ''
      `;
      for (const row of fromClaims) {
        const have = map.get(row.artist_slug);
        if (!have) map.set(row.artist_slug, { slug: row.artist_slug, userId: row.user_id });
        else if (!have.userId) have.userId = row.user_id;
      }
    } catch {
      /* claims optional */
    }
    return [...map.values()] satisfies JoinedArtist[];
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

export function catalogTeachersForCountry(countrySlug?: string): HubTeacher[] {
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

function catalogTeachers(countrySlug?: string): HubTeacher[] {
  return catalogTeachersForCountry(countrySlug);
}

function mergeHubTeachers(fromDb: HubTeacher[], countrySlug?: string): HubTeacher[] {
  const catalog = catalogTeachers(countrySlug);
  const dropped = new Set(["netherlands|stochelo rosenberg"]);
  const liveDb = fromDb.filter(
    (row) => !dropped.has(`${row.countrySlug}|${row.name.toLowerCase()}`),
  );
  if (liveDb.length === 0) return catalog;
  const keys = new Set(liveDb.map((row) => `${row.countrySlug}|${row.name.toLowerCase()}`));
  return [
    ...catalog.filter((row) => !keys.has(`${row.countrySlug}|${row.name.toLowerCase()}`)),
    ...liveDb,
  ];
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
    return mergeHubTeachers(
      rows.map((row) => ({
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
      })),
      countrySlug,
    );
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
  return mergeHubTeachers(
    rows.map((row) => ({
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
    })),
  );
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
        title: artistPending ? pendingArtistTitle(row.body) : `${row.artist_slug} — ${row.body.slice(0, 80)}`,
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

export type HubSubmission = PendingHubItem & {
  status: "pending" | "published";
  place: string;
};

function submissionStatus(value: string | null | undefined): "pending" | "published" {
  return value === "pending" ? "pending" : "published";
}

function placeLine(city?: string | null, country?: string | null) {
  return [city, country].map((part) => (part ?? "").trim()).filter(Boolean).join(", ");
}

function parsePendingArtistBody(body: string): {
  name: string;
  country: string;
  instruments: string;
  bio: string;
} | null {
  const raw = body.trim();
  if (!raw.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;
    const bioRaw = String(parsed.bio ?? "").trim();
    if (bioRaw.startsWith("{") && /"name"\s*:/.test(bioRaw)) {
      return parsePendingArtistBody(bioRaw);
    }
    const name = String(parsed.name ?? "").trim();
    if (!name) return null;
    return {
      name,
      country: String(parsed.country ?? "").trim(),
      instruments: String(parsed.instruments ?? "").trim(),
      bio: bioRaw,
    };
  } catch {
    return null;
  }
}

function pendingArtistTitle(body: string) {
  const parsed = parsePendingArtistBody(body);
  if (!parsed) return body.slice(0, 80);
  return [parsed.name, parsed.country, parsed.instruments].filter(Boolean).join(" · ");
}

async function openPendingArtistPage(body: string, submittedBy: string, submittedName: string) {
  const parsed = parsePendingArtistBody(body);
  if (!parsed) return null;
  const resolved = await ensureCatalogArtist({
    name: parsed.name,
    origin: parsed.country,
    instruments: parsed.instruments,
    notable: parsed.bio || "Added from a hub member form.",
  });
  if (!resolved) return null;
  const sql = await getSql();
  if (parsed.bio && resolved.kind === "legend") {
    try {
      await sql.query(
        `update legends
         set bio = $1,
             instruments = coalesce(nullif($2, ''), instruments),
             origin = coalesce(nullif($3, ''), origin),
             years = coalesce(nullif($3, ''), years),
             bio_status = $4
         where slug = $5 and catalog_source = 'auto'`,
        [
          parsed.bio,
          parsed.instruments,
          parsed.country,
          parsed.bio.length > 80 ? "ok" : "stub",
          resolved.slug,
        ],
      );
    } catch (err) {
      console.error("pending artist bio update failed", err);
    }
  }
  if (parsed.bio.length >= 20) {
    try {
      await sql.query(
        `insert into hub_artist_bios (artist_slug, bio, submitted_by, submitted_name, status, updated_at)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (artist_slug) do update set
           bio = excluded.bio,
           submitted_by = excluded.submitted_by,
           submitted_name = excluded.submitted_name,
           status = excluded.status,
           updated_at = excluded.updated_at`,
        [resolved.slug, parsed.bio, submittedBy, submittedName, "published", new Date().toISOString()],
      );
    } catch (err) {
      console.error("pending artist hub bio failed", err);
    }
  }
  return { ...resolved, bio: parsed.bio };
}

export async function materializePendingArtists() {
  const sql = await getSql();
  let rows: {
    id: number;
    body: string;
    submitted_by: string;
    submitted_name: string;
    status: string;
  }[] = [];
  try {
    rows = await sql.query(
      `select id, body, submitted_by, submitted_name, coalesce(status, 'published') as status
       from hub_notes
       where artist_slug = 'pending-artist'`,
    );
  } catch {
    return 0;
  }
  let opened = 0;
  for (const row of rows) {
    if (row.status === "pending") continue;
    try {
      const resolved = await openPendingArtistPage(row.body, row.submitted_by, row.submitted_name);
      if (!resolved) continue;
      await sql.query(`update hub_notes set artist_slug = $1, body = $2 where id = $3`, [
        resolved.slug,
        resolved.bio || `Added ${resolved.name}.`,
        row.id,
      ]);
      opened += 1;
    } catch (err) {
      console.error("materialize pending artist failed", err);
    }
  }
  return opened;
}

export const listHubSubmissions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureHub();
    await materializePendingArtists();
    const sql = await getSql();
    const owners = await sql<{ user_id: string }>`select user_id from hub_owners`;
    if (!owners.some((row) => row.user_id === context.userId)) {
      throw new Error("Owner desk is only for the hub owner.");
    }
    const items: HubSubmission[] = [];
    const posted = `coalesce(submitted_by, '') <> '' or coalesce(submitted_name, '') <> ''`;

    try {
      const concerts = await sql.query<{
        id: number;
        title: string;
        artist_name: string;
        city: string;
        country: string;
        submitted_name: string;
        status: string;
        created_at: unknown;
      }>(
        `select id, title, artist_name, city, country, submitted_name, coalesce(status, 'published') as status, created_at
         from hub_concerts
         where ${posted}
         order by created_at desc limit 80`,
      );
      for (const row of concerts) {
        items.push({
          kind: "concert",
          id: String(row.id),
          title: `${row.artist_name} — ${row.title}`,
          who: row.submitted_name || "member",
          when: toIso(row.created_at),
          status: submissionStatus(row.status),
          place: placeLine(row.city, row.country),
        });
      }
    } catch {
      /* table optional */
    }

    try {
      const jams = await sql.query<{
        slug: string;
        name: string;
        city: string;
        country: string;
        submitted_name: string;
        status: string;
        created_at: unknown;
      }>(
        `select slug, name, city, country, submitted_name, coalesce(status, 'published') as status, created_at
         from hub_jams
         where ${posted}
         order by created_at desc limit 80`,
      );
      for (const row of jams) {
        items.push({
          kind: "jam",
          id: row.slug,
          title: row.name,
          who: row.submitted_name || "member",
          when: toIso(row.created_at),
          status: submissionStatus(row.status),
          place: placeLine(row.city, row.country),
        });
      }
    } catch {
      /* table optional */
    }

    try {
      const festivals = await sql.query<{
        slug: string;
        name: string;
        city: string;
        country: string;
        submitted_name: string;
        status: string;
        created_at: unknown;
      }>(
        `select slug, name, city, country, submitted_name, coalesce(status, 'published') as status, created_at
         from hub_festivals
         where ${posted}
         order by created_at desc limit 80`,
      );
      for (const row of festivals) {
        items.push({
          kind: "festival",
          id: row.slug,
          title: row.name,
          who: row.submitted_name || "member",
          when: toIso(row.created_at),
          status: submissionStatus(row.status),
          place: placeLine(row.city, row.country),
        });
      }
    } catch {
      /* table optional */
    }

    try {
      const clips = await sql.query<{
        id: number;
        title: string;
        artist_slug: string;
        submitted_name: string;
        status: string;
        created_at: unknown;
      }>(
        `select id, title, artist_slug, submitted_name, coalesce(status, 'published') as status, created_at
         from hub_clips
         where ${posted}
         order by created_at desc limit 40`,
      );
      for (const row of clips) {
        items.push({
          kind: "clip",
          id: String(row.id),
          title: `${row.artist_slug} — ${row.title || "clip"}`,
          who: row.submitted_name || "member",
          when: toIso(row.created_at),
          status: submissionStatus(row.status),
          place: "",
        });
      }
    } catch {
      /* table optional */
    }

    try {
      const notes = await sql.query<{
        id: number;
        body: string;
        artist_slug: string;
        submitted_name: string;
        status: string;
        created_at: unknown;
      }>(
        `select id, body, artist_slug, submitted_name, coalesce(status, 'published') as status, created_at
         from hub_notes
         where ${posted}
         order by created_at desc limit 60`,
      );
      for (const row of notes) {
        const slug = row.artist_slug || "";
        if (slug.startsWith("history-")) {
          const parsed = parseHistoryNote(row.body, slug);
          items.push({
            kind: "history",
            id: String(row.id),
            title: `${parsed.kind} · ${parsed.house} — ${parsed.text.slice(0, 80)}`,
            who: row.submitted_name || "member",
            when: toIso(row.created_at),
            status: submissionStatus(row.status),
            place: "",
          });
        } else if (slug.startsWith("archive-")) {
          const parsed = parseArchiveNote(row.body, slug);
          items.push({
            kind: "archive",
            id: String(row.id),
            title: `${parsed.name || parsed.country} — ${parsed.text.slice(0, 80)}`,
            who: row.submitted_name || "member",
            when: toIso(row.created_at),
            status: submissionStatus(row.status),
            place: "",
          });
        } else if (slug === "pending-artist") {
          items.push({
            kind: "artist",
            id: String(row.id),
            title: pendingArtistTitle(row.body),
            who: row.submitted_name || "member",
            when: toIso(row.created_at),
            status: submissionStatus(row.status),
            place: "",
          });
        } else {
          items.push({
            kind: "note",
            id: String(row.id),
            title: `${slug} — ${row.body.slice(0, 80)}`,
            who: row.submitted_name || "member",
            when: toIso(row.created_at),
            status: submissionStatus(row.status),
            place: "",
          });
        }
      }
    } catch {
      /* table optional */
    }

    try {
      const venues = await sql.query<{
        slug: string;
        name: string;
        city: string;
        country: string;
        submitted_name: string;
        status: string;
        created_at: unknown;
      }>(
        `select slug, name, city, country, submitted_name, coalesce(status, 'published') as status, created_at
         from hub_venues
         where ${posted}
         order by created_at desc limit 40`,
      );
      for (const row of venues) {
        items.push({
          kind: "venue",
          id: row.slug,
          title: row.name,
          who: row.submitted_name || "member",
          when: toIso(row.created_at),
          status: submissionStatus(row.status),
          place: placeLine(row.city, row.country),
        });
      }
    } catch {
      /* table optional */
    }

    try {
      const luthiers = await sql.query<{
        slug: string;
        name: string;
        city: string;
        country: string;
        submitted_name: string;
        status: string;
        created_at: unknown;
      }>(
        `select slug, name, city, country, submitted_name, coalesce(status, 'published') as status, created_at
         from hub_luthiers
         where ${posted}
         order by created_at desc limit 40`,
      );
      for (const row of luthiers) {
        items.push({
          kind: "luthier",
          id: row.slug,
          title: row.name,
          who: row.submitted_name || "member",
          when: toIso(row.created_at),
          status: submissionStatus(row.status),
          place: placeLine(row.city, row.country),
        });
      }
    } catch {
      /* table optional */
    }

    try {
      const teachers = await sql.query<{
        id: number;
        name: string;
        country_slug: string;
        status: string;
        created_at: unknown;
      }>(
        `select id, name, country_slug, coalesce(status, 'published') as status, created_at
         from hub_teachers
         where coalesce(user_id, '') <> ''
         order by created_at desc limit 40`,
      );
      for (const row of teachers) {
        items.push({
          kind: "teacher",
          id: String(row.id),
          title: row.name,
          who: row.name,
          when: toIso(row.created_at),
          status: submissionStatus(row.status),
          place: row.country_slug || "",
        });
      }
    } catch {
      /* table optional */
    }

    return items.sort((a, b) => {
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      return b.when.localeCompare(a.when);
    });
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
        const opened = await openPendingArtistPage(row[0].body, row[0].submitted_by, row[0].submitted_name ?? "");
        if (opened) {
          await sql.query(`update hub_notes set artist_slug = $1, body = $2, status = 'published' where id = $3`, [
            opened.slug,
            opened.bio || `Added ${opened.name}.`,
            Number(data.id),
          ]);
        } else {
          await sql`update hub_notes set status = 'published' where id = ${Number(data.id)}`;
        }
        if (row[0].submitted_by) await bumpApproved(row[0].submitted_by);
      }
    } else {
      const row = await sql<{ submitted_by: string }>`select submitted_by from hub_notes where id = ${Number(data.id)} limit 1`;
      await sql`update hub_notes set status = 'published' where id = ${Number(data.id)}`;
      if (row[0]?.submitted_by) await bumpApproved(row[0].submitted_by);
    }
    return { ok: true as const };
  });

export async function publishPendingByUser(userId: string) {
  if (!userId) return 0;
  const sql = await getSql();
  const run = async (text: string, params: unknown[] = []) => {
    try {
      await sql.query(text, params);
    } catch {
      /* table optional */
    }
  };
  await run(`update hub_concerts set status = 'published' where submitted_by = $1 and status = 'pending'`, [userId]);
  await run(`update hub_jams set status = 'published' where submitted_by = $1 and status = 'pending'`, [userId]);
  await run(`update hub_festivals set status = 'published' where submitted_by = $1 and status = 'pending'`, [userId]);
  await run(`update hub_clips set status = 'published' where submitted_by = $1 and status = 'pending'`, [userId]);
  await run(`update hub_notes set status = 'published' where submitted_by = $1 and status = 'pending'`, [userId]);
  await run(`update hub_venues set status = 'published' where submitted_by = $1 and status = 'pending'`, [userId]);
  await run(`update hub_luthiers set status = 'published' where submitted_by = $1 and status = 'pending'`, [userId]);
  await run(`update hub_teachers set status = 'published' where user_id = $1 and status = 'pending'`, [userId]);
  await materializePendingArtists();
  return 1;
}

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
    const result = await startEmailVerification(context.userId, email, true);
    return result;
  });

export const confirmHubEmail = createServerFn({ method: "POST" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    const { confirmEmailToken } = await import("@/lib/hub-guard");
    const ok = await confirmEmailToken(token);
    if (!ok) throw new Error("That link is old or already used.");
    return { ok: true as const };
  });

export const loginAccountHint = createServerFn({ method: "POST" })
  .validator((email: string) => email.trim().toLowerCase())
  .handler(async ({ data: email }) => {
    if (!email.includes("@")) return { hint: "generic" as const };
    const sql = await getSql();
    const users = await sql.query<{ id: string }>(
      `select id from "user" where lower(email) = $1 limit 1`,
      [email],
    );
    if (!users[0]) return { hint: "generic" as const };
    const cred = await sql.query<{ id: string }>(
      `select id from account where "userId" = $1 and "providerId" = $2 limit 1`,
      [String(users[0].id), "credential"],
    );
    if (!cred[0]) return { hint: "no-password" as const };
    return { hint: "generic" as const };
  });

export const requestHubPasswordReset = createServerFn({ method: "POST" })
  .validator((email: string) => email.trim())
  .handler(async ({ data: email }) => {
    const { requestPasswordReset } = await import("@/lib/password-reset");
    return requestPasswordReset(email);
  });

export const applyHubPasswordReset = createServerFn({ method: "POST" })
  .validator((input: { token: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { applyPasswordReset } = await import("@/lib/password-reset");
    return applyPasswordReset(data.token, data.password);
  });

