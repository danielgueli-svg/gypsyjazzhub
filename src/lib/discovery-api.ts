import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  discoveryKey,
  isTrustedFestival,
  scanVerdict,
  venueDiscoveryKey,
  venueVerdict,
  type ScanFind,
  type ScanSource,
  type ScanVenue,
} from "@/lib/discovery";
import { getSql } from "@/lib/db";
import { SCAN_QUEUE, VENUE_QUEUE } from "@/lib/scan-queue";
import { FACEBOOK_QUEUE, facebookCredit } from "@/lib/facebook-groups";
import { DJANGOBOOKS_QUEUE, djangobooksCredit } from "@/lib/djangobooks";
import { slugify, toIso } from "@/lib/utils";
import { FESTIVALS } from "@/lib/festivals";
import { JAMS } from "@/lib/jams";
import { VENUES } from "@/lib/venues";
import { ensureCatalogArtist } from "@/lib/catalog";

export type DiscoveryRow = {
  id: number;
  fingerprint: string;
  title: string;
  artistName: string;
  artistSlug: string;
  venue: string;
  city: string;
  country: string;
  startsAt: string;
  festivalSlug: string;
  sources: ScanSource[];
  trustedFestival: boolean;
  status: string;
  reason: string;
  concertId: number | null;
  kind: string;
  itemSlug: string;
  scannedAt: string;
  publishedAt: string;
};

type DbRow = {
  id: number;
  fingerprint: string;
  title: string;
  artist_name: string;
  artist_slug: string;
  venue: string;
  city: string;
  country: string;
  starts_at: unknown;
  festival_slug: string;
  sources_json: string;
  trusted_festival: boolean;
  status: string;
  reason: string;
  concert_id: number | null;
  kind: string;
  item_slug: string;
  scanned_at: unknown;
  published_at: unknown;
};

async function ensureDiscoveries() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_discoveries (
      id serial primary key,
      fingerprint text not null unique,
      title text not null,
      artist_name text not null default '',
      artist_slug text not null default '',
      venue text not null default '',
      city text not null default '',
      country text not null default '',
      starts_at timestamptz,
      festival_slug text not null default '',
      sources_json text not null default '[]',
      trusted_festival boolean not null default false,
      status text not null default 'hold',
      reason text not null default '',
      concert_id integer,
      scanned_at timestamptz not null default now(),
      published_at timestamptz
    )
  `);
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
    alter table hub_discoveries add column if not exists kind text not null default 'concert'
  `);
  await sql.query(`
    alter table hub_discoveries add column if not exists item_slug text not null default ''
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
}

function parseSources(raw: string): ScanSource[] {
  try {
    const parsed = JSON.parse(raw) as ScanSource[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapRow(row: DbRow): DiscoveryRow {
  return {
    id: row.id,
    fingerprint: row.fingerprint,
    title: row.title,
    artistName: row.artist_name,
    artistSlug: row.artist_slug,
    venue: row.venue,
    city: row.city,
    country: row.country,
    startsAt: row.starts_at ? toIso(row.starts_at) : "",
    festivalSlug: row.festival_slug,
    sources: parseSources(row.sources_json),
    trustedFestival: Boolean(row.trusted_festival),
    status: row.status,
    reason: row.reason,
    concertId: row.concert_id,
    kind: row.kind || "concert",
    itemSlug: row.item_slug || "",
    scannedAt: toIso(row.scanned_at),
    publishedAt: row.published_at ? toIso(row.published_at) : "",
  };
}

async function resolveArtist(name: string, slug: string) {
  const sql = await getSql();
  const wantSlug = slug.trim();
  const wantName = name.trim();
  if (wantSlug) {
    const legend = await sql<{ slug: string; name: string }>`
      select slug, name from legends where slug = ${wantSlug} limit 1
    `;
    if (legend[0]) return { slug: legend[0].slug, name: legend[0].name, kind: "legend" as const };
    const profile = await sql<{ slug: string; display_name: string }>`
      select slug, display_name from profiles where slug = ${wantSlug} limit 1
    `;
    if (profile[0]) {
      return {
        slug: profile[0].slug,
        name: profile[0].display_name,
        kind: "musician" as const,
      };
    }
  }
  if (!wantName) return null;
  const legend = await sql<{ slug: string; name: string }>`
    select slug, name from legends where lower(name) = ${wantName.toLowerCase()} limit 1
  `;
  if (legend[0]) return { slug: legend[0].slug, name: legend[0].name, kind: "legend" as const };
  const profile = await sql<{ slug: string; display_name: string }>`
    select slug, display_name from profiles
    where lower(display_name) = ${wantName.toLowerCase()} limit 1
  `;
  if (profile[0]) {
    return { slug: profile[0].slug, name: profile[0].display_name, kind: "musician" as const };
  }
  return null;
}

async function publishRow(id: number, force: boolean) {
  const sql = await getSql();
  const rows = await sql<DbRow>`select * from hub_discoveries where id = ${id} limit 1`;
  const row = rows[0];
  if (!row) throw new Error("Find not found.");
  if (row.status === "rejected") throw new Error("That find was taken down.");
  if ((row.kind || "concert") === "venue") return publishVenueRow(row, force);
  if (row.kind === "jam") return publishJamRow(row, force);
  if (row.kind === "festival") return publishFestivalRow(row, force);

  const find: ScanFind = {
    title: row.title,
    artistName: row.artist_name,
    artistSlug: row.artist_slug,
    venue: row.venue,
    city: row.city,
    country: row.country,
    startsAt: row.starts_at ? toIso(row.starts_at) : "",
    festivalSlug: row.festival_slug || undefined,
    sources: parseSources(row.sources_json),
  };
  const verdict = scanVerdict(find);
  if (!force && verdict.status !== "publish") {
    await sql`
      update hub_discoveries
      set status = 'hold', reason = ${verdict.reason}
      where id = ${id}
    `;
    return { ok: false as const, reason: verdict.reason };
  }
  const artist =
    (await resolveArtist(row.artist_name, row.artist_slug)) ??
    (await ensureCatalogArtist({
      name: row.artist_name.trim() || row.title,
      slug: row.artist_slug,
      origin: row.country,
      notable: "From a scanned concert",
    }));
  if (!artist) {
    const reason = "No matching musician page yet — held for the owner.";
    await sql`
      update hub_discoveries set status = 'hold', reason = ${reason} where id = ${id}
    `;
    return { ok: false as const, reason };
  }
  return insertConcert(row, find, verdict.reason, artist, force);
}

async function insertConcert(
  row: DbRow,
  find: ScanFind,
  reason: string,
  artist: { slug: string; name: string; kind: "legend" | "musician" },
  _force: boolean,
) {
  const sql = await getSql();
  const facebook = find.sources.some((source) => source.kind === "facebook_group");
  const forum = find.sources.some((source) => source.kind === "djangobooks");
  const who = forum ? "djangobooks-import" : facebook ? "facebook-import" : "daily-scan";
  const whoName = forum ? "DjangoBooks import" : facebook ? "Facebook import" : "Daily scan";
  const note = [
    forum ? "Weekly DjangoBooks import." : facebook ? "Weekly Facebook import." : "Daily scan.",
    reason,
    forum ? djangobooksCredit(find) : facebook ? facebookCredit(find) : "",
    find.sources.map((source) => `${source.label}: ${source.url}`).join(" · "),
  ]
    .filter(Boolean)
    .join(" ");
  const starts = row.starts_at ? toIso(row.starts_at) : new Date().toISOString();
  const day = starts.slice(0, 10);
  const title = row.title.trim();
  const existing = row.concert_id
    ? await sql<{ id: number; note: string; venue: string; city: string }>`
        select id, note, venue, city from hub_concerts where id = ${row.concert_id} limit 1
      `
    : await sql<{ id: number; note: string; venue: string; city: string }>`
        select id, note, venue, city from hub_concerts
        where left(starts_at::text, 10) = ${day}
          and (
            lower(title) = ${title.toLowerCase()}
            or lower(artist_name) = ${artist.name.toLowerCase()}
          )
        limit 1
      `;
  const current = existing[0];
  if (current) {
    const sourceUrl = find.sources[0]?.url ?? "";
    const nextNote =
      sourceUrl && !current.note.includes(sourceUrl) ? `${current.note} ${note}`.trim() : current.note;
    await sql`
      update hub_concerts
      set venue = ${current.venue.trim() || row.venue},
          city = ${current.city.trim() || row.city},
          note = ${nextNote}
      where id = ${current.id}
    `;
    await sql`
      update hub_discoveries
      set status = 'published', reason = ${reason},
          artist_slug = ${artist.slug}, artist_name = ${artist.name},
          concert_id = ${current.id}, published_at = coalesce(published_at, now())
      where id = ${row.id}
    `;
    return { ok: true as const, concertId: current.id };
  }
  const inserted = await sql<{ id: number }>`
    insert into hub_concerts (
      artist_slug, artist_name, artist_kind, title, venue, city, country,
      starts_at, note, submitted_by, submitted_name
    ) values (
      ${artist.slug}, ${artist.name}, ${artist.kind}, ${row.title}, ${row.venue},
      ${row.city}, ${row.country}, ${starts}, ${note},
      ${who}, ${whoName}
    )
    returning id
  `;
  const concertId = inserted[0]!.id;
  await sql`
    update hub_discoveries
    set status = 'published', reason = ${reason},
        artist_slug = ${artist.slug}, artist_name = ${artist.name},
        concert_id = ${concertId}, published_at = now()
    where id = ${row.id}
  `;
  return { ok: true as const, concertId };
}

async function publishVenueRow(row: DbRow, force: boolean) {
  const sql = await getSql();
  const sources = parseSources(row.sources_json);
  const site = (row.artist_slug || sources.find((s) => s.kind === "venue")?.url || sources[0]?.url || "").trim();
  const scene =
    row.festival_slug === "jazz" || row.festival_slug === "world" ? row.festival_slug : "gypsy";
  const venue: ScanVenue = {
    name: row.title,
    city: row.city,
    country: row.country,
    kind: row.venue || "Club",
    site,
    bio: "",
    scene,
    sources,
  };
  const checked = venueVerdict(venue);
  if (!force && checked.status !== "publish") {
    await sql`
      update hub_discoveries
      set status = 'hold', reason = ${checked.reason}
      where id = ${row.id}
    `;
    return { ok: false as const, reason: checked.reason };
  }
  const slugBase = slugify(row.title);
  const existingCatalog = VENUES.find(
    (item) =>
      item.slug === slugBase ||
      (item.name.toLowerCase() === row.title.toLowerCase() &&
        item.city.toLowerCase() === row.city.toLowerCase()),
  );
  if (existingCatalog) {
    await sql`
      update hub_discoveries
      set status = 'published', item_slug = ${existingCatalog.slug},
          reason = ${"Already on the venues page."},
          published_at = coalesce(published_at, now())
      where id = ${row.id}
    `;
    return { ok: true as const, concertId: row.concert_id };
  }
  const taken = await sql<{ slug: string }>`
    select slug from hub_venues
    where slug = ${slugBase}
       or (lower(name) = ${row.title.toLowerCase()} and lower(city) = ${row.city.toLowerCase()})
    limit 1
  `;
  const slug = taken[0]?.slug ?? slugBase;
  if (!taken[0]) {
    const kind = venue.kind || "Club";
    const bio = sources.map((source) => `${source.label}: ${source.url}`).join(" · ");
    await sql`
      insert into hub_venues (
        slug, name, city, country, kind, site, contact, bio, scene, booker, submitted_by, submitted_name
      ) values (
        ${slug}, ${row.title}, ${row.city}, ${row.country}, ${kind}, ${site},
        ${""}, ${bio}, ${scene}, ${""}, ${"daily-scan"}, ${"Daily scan"}
      )
    `;
  }
  await sql`
    update hub_discoveries
    set status = 'published', reason = ${checked.reason},
        item_slug = ${slug}, published_at = now()
    where id = ${row.id}
  `;
  return { ok: true as const, concertId: row.concert_id };
}

async function publishListing(
  row: DbRow,
  table: "hub_jams" | "hub_festivals",
  force: boolean,
) {
  const sql = await getSql();
  const find: ScanFind = {
    title: row.title,
    artistName: row.artist_name,
    artistSlug: row.artist_slug,
    venue: row.venue,
    city: row.city,
    country: row.country,
    startsAt: row.starts_at ? toIso(row.starts_at) : "",
    festivalSlug: row.festival_slug || undefined,
    eventKind: table === "hub_jams" ? "jam" : "festival",
    sources: parseSources(row.sources_json),
  };
  const verdict = scanVerdict(find);
  if (!force && verdict.status !== "publish") {
    await sql`
      update hub_discoveries set status = 'hold', reason = ${verdict.reason} where id = ${row.id}
    `;
    return { ok: false as const, reason: verdict.reason };
  }
  const slugBase = slugify(row.item_slug || row.title) || "event";
  const titleKey = row.title.toLowerCase().replace(/\s+20\d{2}.*$/, "").trim();
  if (table === "hub_festivals") {
    const catalog = FESTIVALS.find(
      (item) =>
        item.slug === slugBase ||
        item.name.toLowerCase() === row.title.toLowerCase() ||
        item.name.toLowerCase() === titleKey ||
        item.slug === slugify(titleKey),
    );
    if (catalog) {
      await sql`
        update hub_discoveries
        set status = 'published', item_slug = ${catalog.slug},
            reason = ${"Already on the festivals page."},
            published_at = coalesce(published_at, now())
        where id = ${row.id}
      `;
      return { ok: true as const, concertId: row.concert_id };
    }
  } else {
    const catalog = JAMS.find(
      (item) =>
        item.slug === slugBase ||
        item.name.toLowerCase() === row.title.toLowerCase() ||
        item.name.toLowerCase() === titleKey,
    );
    if (catalog) {
      await sql`
        update hub_discoveries
        set status = 'published', item_slug = ${catalog.slug},
            reason = ${"Already on the jams page."},
            published_at = coalesce(published_at, now())
        where id = ${row.id}
      `;
      return { ok: true as const, concertId: row.concert_id };
    }
  }
  const existing = await sql.query<{ slug: string; bio: string; city: string; venue?: string }>(
    table === "hub_jams"
      ? `select slug, bio, city, venue from hub_jams
         where slug = $1 or lower(name) = $2
         limit 1`
      : `select slug, bio, city from hub_festivals
         where slug = $1 or lower(name) = $2
         limit 1`,
    [slugBase, row.title.toLowerCase()],
  );
  const slug = existing[0]?.slug ?? slugBase;
  const credit = djangobooksCredit(find) || facebookCredit(find);
  const bio = [verdict.reason, credit, find.sources.map((s) => `${s.label}: ${s.url}`).join(" · ")]
    .filter(Boolean)
    .join(" ");
  const starts = row.starts_at ? toIso(row.starts_at) : new Date().toISOString();
  const who = find.sources.some((s) => s.kind === "djangobooks")
    ? "djangobooks-import"
    : "facebook-import";
  if (existing[0]) {
    const nextBio =
      find.sources[0]?.url && !existing[0].bio.includes(find.sources[0].url)
        ? `${existing[0].bio} ${bio}`.trim()
        : existing[0].bio;
    if (table === "hub_jams") {
      await sql`
        update hub_jams
        set venue = ${existing[0].venue?.trim() || row.venue},
            city = ${existing[0].city.trim() || row.city},
            next_starts_at = ${starts},
            bio = ${nextBio}
        where slug = ${slug}
      `;
    } else {
      await sql`
        update hub_festivals
        set city = ${existing[0].city.trim() || row.city},
            next_starts_at = ${starts},
            bio = ${nextBio}
        where slug = ${slug}
      `;
    }
  } else if (table === "hub_jams") {
    await sql`
      insert into hub_jams (
        slug, name, city, country, venue, when_text, next_starts_at, bio,
        kind, address, hours, submitted_by, submitted_name
      ) values (
        ${slug}, ${row.title}, ${row.city}, ${row.country}, ${row.venue},
        ${"Announced on DjangoBooks"}, ${starts}, ${bio},
        ${"meetup"}, ${""}, ${""}, ${who}, ${"DjangoBooks import"}
      )
    `;
  } else {
    const site = find.sources[0]?.url ?? "";
    await sql`
      insert into hub_festivals (
        slug, name, city, country, when_text, next_starts_at, bio, site,
        submitted_by, submitted_name
      ) values (
        ${slug}, ${row.title}, ${row.city}, ${row.country},
        ${"Announced on DjangoBooks"}, ${starts}, ${bio}, ${site},
        ${who}, ${"DjangoBooks import"}
      )
    `;
  }
  await sql`
    update hub_discoveries
    set status = 'published', reason = ${verdict.reason}, item_slug = ${slug}, published_at = now()
    where id = ${row.id}
  `;
  return { ok: true as const, concertId: row.concert_id };
}

async function publishJamRow(row: DbRow, force: boolean) {
  return publishListing(row, "hub_jams", force);
}

async function publishFestivalRow(row: DbRow, force: boolean) {
  return publishListing(row, "hub_festivals", force);
}

export async function syncDiscoveries(extra: ScanFind[] = []) {
  await ensureDiscoveries();
  const sql = await getSql();
  const queued = [...SCAN_QUEUE, ...FACEBOOK_QUEUE, ...DJANGOBOOKS_QUEUE];
  const queuedKeys = new Set(
    queued.filter((find) => find.title.trim() && find.startsAt).map((find) => discoveryKey(find)),
  );
  const live = extra.filter(
    (find) => find.title.trim() && find.startsAt && !queuedKeys.has(discoveryKey(find)),
  );
  for (const find of [...queued, ...live]) {
    if (!find.title.trim() || !find.startsAt) continue;
    const fingerprint = discoveryKey(find);
    const verdict = scanVerdict(find);
    const sourcesJson = JSON.stringify(find.sources);
    const trusted = isTrustedFestival(find.festivalSlug);
    const festivalSlug = find.festivalSlug ?? "";
    const artistSlug = find.artistSlug.trim();
    const artistName = find.artistName.trim();
    const title = find.title.trim();
    const venue = find.venue.trim();
    const city = find.city.trim();
    const country = find.country.trim();
    const kind = find.eventKind ?? "concert";
    await sql.query(
      `insert into hub_discoveries (
        fingerprint, title, artist_name, artist_slug, venue, city, country,
        starts_at, festival_slug, sources_json, trusted_festival, status, reason, kind
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      on conflict (fingerprint) do update set
        sources_json = excluded.sources_json,
        trusted_festival = excluded.trusted_festival,
        reason = excluded.reason,
        status = excluded.status,
        kind = excluded.kind,
        scanned_at = now()
      where hub_discoveries.status not in ('published', 'rejected')`,
      [
        fingerprint,
        title,
        artistName,
        artistSlug,
        venue,
        city,
        country,
        find.startsAt,
        festivalSlug,
        sourcesJson,
        trusted,
        verdict.status,
        verdict.reason,
        kind,
      ],
    );
  }
  for (const room of VENUE_QUEUE) {
    if (!room.name.trim() || !room.country.trim()) continue;
    const fingerprint = venueDiscoveryKey(room);
    const verdict = venueVerdict(room);
    const sourcesJson = JSON.stringify(room.sources);
    const site = room.site.trim();
    await sql.query(
      `insert into hub_discoveries (
        fingerprint, title, artist_name, artist_slug, venue, city, country,
        festival_slug, sources_json, trusted_festival, status, reason, kind
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,false,$10,$11,'venue')
      on conflict (fingerprint) do update set
        sources_json = excluded.sources_json,
        artist_slug = excluded.artist_slug,
        venue = excluded.venue,
        festival_slug = excluded.festival_slug,
        reason = excluded.reason,
        status = excluded.status,
        scanned_at = now()
      where hub_discoveries.status not in ('published', 'rejected')`,
      [
        fingerprint,
        room.name.trim(),
        room.kind.trim() || "Club",
        site,
        room.kind.trim() || "Club",
        room.city.trim(),
        room.country.trim(),
        room.scene,
        sourcesJson,
        verdict.status,
        verdict.reason,
      ],
    );
  }
  const pending = await sql<{ id: number; status: string }>`
    select id, status from hub_discoveries
    where status = 'publish'
      and (
        (coalesce(kind, 'concert') = 'concert' and concert_id is null)
        or (kind = 'venue' and item_slug = '')
        or (kind in ('jam', 'festival') and item_slug = '')
      )
  `;
  for (const row of pending) {
    if (row.status === "publish") {
      await publishRow(row.id, false);
    }
  }
}

async function requireOwner(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`
    select user_id from hub_owners where user_id = ${userId} limit 1
  `;
  if (!rows[0]) throw new Error("Owner desk is only for the hub owner.");
}

export const listDiscoveries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    await syncDiscoveries();
    const sql = await getSql();
    const rows = await sql<DbRow>`
      select * from hub_discoveries
      where status != 'rejected'
      order by scanned_at desc
      limit 80
    `;
    return rows.map(mapRow);
  });

export const publishDiscovery = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await requireOwner(context.userId);
    return publishRow(id, true);
  });

export const rejectDiscovery = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await requireOwner(context.userId);
    const sql = await getSql();
    const rows = await sql<{ concert_id: number | null; kind: string; item_slug: string }>`
      select concert_id, kind, item_slug from hub_discoveries where id = ${id} limit 1
    `;
    const concertId = rows[0]?.concert_id;
    if (concertId) {
      await sql`
        delete from hub_concerts
        where id = ${concertId}
          and submitted_by in ('daily-scan', 'facebook-import', 'djangobooks-import')
      `;
    }
    const itemSlug = rows[0]?.item_slug;
    if (rows[0]?.kind === "venue" && itemSlug) {
      await sql`
        delete from hub_venues
        where slug = ${itemSlug} and submitted_by = ${"daily-scan"}
      `;
    }
    if (rows[0]?.kind === "jam" && itemSlug) {
      await sql`
        delete from hub_jams
        where slug = ${itemSlug}
          and submitted_by in ('daily-scan', 'facebook-import', 'djangobooks-import')
      `;
    }
    if (rows[0]?.kind === "festival" && itemSlug) {
      await sql`
        delete from hub_festivals
        where slug = ${itemSlug}
          and submitted_by in ('daily-scan', 'facebook-import', 'djangobooks-import')
      `;
    }
    await sql`
      update hub_discoveries
      set status = 'rejected', concert_id = null
      where id = ${id}
    `;
    return { ok: true as const };
  });
