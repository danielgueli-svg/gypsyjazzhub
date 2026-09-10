import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, getDbSource } from "@/lib/db";
import { LEGEND_CONCERTS, LEGENDS, type ConcertSeed, type LegendSeed } from "@/lib/seed-data";
import { listHubConcerts } from "@/lib/hub-api";
import { liveConcertsSeed, resolveArtistSlug } from "@/lib/live-concerts";
import { SAMOIS_SLUGS } from "@/lib/samois-artists";
import { BANDS, bandForBill, collaboratorSlugs } from "@/lib/scene";
import { slugify, toIso } from "@/lib/utils";
import { syncSocialAlertFollow } from "@/lib/alerts";
import { ensureFanTables } from "@/lib/fans";
import { ensureCatalogColumns } from "@/lib/catalog";
import {
  isMusician,
  parseProfileTypes,
  serializeTypes,
  typesFromMemberKind,
  type ProfileTypeId,
} from "@/lib/profile-types";

function urlFromText(text: string) {
  return (text ?? "").match(/https?:\/\/[^\s)]+/i)?.[0] ?? "";
}

export type Profile = {
  userId: string;
  slug: string;
  displayName: string;
  city: string;
  country: string;
  instruments: string;
  bio: string;
  websiteUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  spotifyUrl: string;
  contactUrl: string;
  lookingForGigs: boolean;
  availableToJam: boolean;
  memberKind: "musician" | "fan";
  profileTypes: ProfileTypeId[];
  openForInvites: boolean;
  createdAt: string;
  followerCount: number;
};

export type Legend = {
  slug: string;
  name: string;
  years: string;
  origin: string;
  instruments: string;
  era: string;
  bio: string;
  notable: string;
  youtubeUrl: string;
  sortOrder: number;
  samois: boolean;
  photoUrl: string;
  photoCredit: string;
  websiteUrl: string;
  instagramUrl: string;
  spotifyUrl: string;
  catalogSource: string;
  bioStatus: string;
};

export type Concert = {
  id: string;
  kind: "community" | "legend";
  title: string;
  venue: string;
  city: string;
  country: string;
  startsAt: string;
  description: string;
  ticketUrl: string;
  isHistoric: boolean;
  artistName: string;
  artistSlug: string;
};

export function uniqueBills(concerts: Concert[]): Concert[] {
  const buckets = new Map<string, Concert[]>();
  for (const concert of concerts) {
    const key = `${concert.startsAt}|${(concert.venue ?? "").trim().toLowerCase()}|${(concert.city ?? "").trim().toLowerCase()}`;
    const list = buckets.get(key) ?? [];
    list.push(concert);
    buckets.set(key, list);
  }
  return [...buckets.values()].flatMap(collapseSlot);
}

function collapseSlot(list: Concert[]): Concert[] {
  if (list.length <= 1) return list;
  const slugs = [...new Set(list.map((row) => row.artistSlug))];
  const covering = BANDS.find(
    (band) => slugs.length > 1 && slugs.every((slug) => band.members.includes(slug)),
  );
  if (covering) {
    const lead =
      list.find((row) => row.artistSlug === covering.members[0]) ??
      list.find((row) => bandForBill(row.title)?.slug === covering.slug) ??
      list[0]!;
    return [{ ...lead, title: covering.name }];
  }
  const byTitle = new Map<string, Concert>();
  for (const row of list) {
    const band = bandForBill(row.title);
    const key = band?.slug ?? (row.title || row.artistName).trim().toLowerCase();
    if (!byTitle.has(key)) {
      byTitle.set(key, band ? { ...row, title: band.name } : row);
    }
  }
  return [...byTitle.values()];
}

export type MessageRow = {
  id: number;
  fromUserId: string;
  toUserId: string;
  body: string;
  createdAt: string;
  fromName: string;
  fromSlug: string;
  toName: string;
  toSlug: string;
};

type ProfileRow = {
  user_id: string;
  slug: string;
  display_name: string;
  city: string;
  country: string;
  instruments: string;
  bio: string;
  website_url: string;
  youtube_url: string;
  instagram_url: string;
  spotify_url?: string;
  contact_url?: string;
  looking_for_gigs: boolean;
  available_to_jam: boolean;
  member_kind?: string;
  profile_types?: string;
  open_for_invites?: boolean;
  created_at: unknown;
  follower_count?: number;
};

type LegendRow = {
  slug: string;
  name: string;
  years: string;
  origin: string;
  instruments: string;
  era: string;
  bio: string;
  notable: string;
  youtube_url: string;
  sort_order: number;
  samois?: boolean;
  photo_url?: string;
  photo_credit?: string;
  website_url?: string;
  instagram_url?: string;
  spotify_url?: string;
  catalog_source?: string;
  bio_status?: string;
};

let seedPromise: Promise<void> | null = null;
let concertSig = "";
let concertRefresh: Promise<void> | null = null;
let legendSig = "";

async function ensureSeed() {
  if (getDbSource() === "none") return;
  const sig = LEGENDS.map((legend) => `${legend.slug}|${legend.bio}|${legend.notable}`).join(";");
  if (sig !== legendSig) seedPromise = null;
  seedPromise ??= seedCatalog()
    .then(() => {
      legendSig = sig;
    })
    .catch((err) => {
      seedPromise = null;
      console.error("legend seed failed", err);
    });
  await seedPromise;
  await refreshConcerts().catch((err) => {
    console.error("concert seed failed", err);
  });
}

function mapSeedLegend(legend: LegendSeed): Legend {
  return {
    slug: legend.slug,
    name: legend.name,
    years: legend.years,
    origin: legend.origin,
    instruments: legend.instruments,
    era: legend.era,
    bio: legend.bio,
    notable: legend.notable,
    youtubeUrl: legend.youtube_url,
    sortOrder: legend.sort_order,
    samois: SAMOIS_SLUGS.has(legend.slug),
    photoUrl: legend.photo_url ?? "",
    photoCredit: legend.photo_credit ?? "",
    websiteUrl: legend.website_url ?? "",
    instagramUrl: legend.instagram_url ?? "",
    spotifyUrl: "",
    catalogSource: "seed",
    bioStatus: "ok",
  };
}

export function catalogLegend(slug: string): Legend | null {
  const seed = LEGENDS.find((row) => row.slug === slug);
  return seed ? mapSeedLegend(seed) : null;
}

export function catalogCollaborators(slug: string): Legend[] {
  const wanted = new Set(collaboratorSlugs(slug));
  if (wanted.size === 0) return [];
  return LEGENDS.filter((legend) => wanted.has(legend.slug)).map(mapSeedLegend);
}

export function catalogConcertsFor(slug: string): Concert[] {
  const name = LEGENDS.find((row) => row.slug === slug)?.name ?? slug;
  const seeded = LEGEND_CONCERTS.filter((concert) => concert.legend_slug === slug).map((concert) =>
    mapSeedConcert(concert, name),
  );
  const live = liveConcertsSeed().filter((concert) => concert.artistSlug === slug);
  return mergeConcertLists([seeded, live]);
}

function mergeLegends(rows: Legend[]): Legend[] {
  const bySlug = new Map<string, Legend>();
  for (const legend of LEGENDS) bySlug.set(legend.slug, mapSeedLegend(legend));
  for (const row of rows) {
    const seed = bySlug.get(row.slug);
    bySlug.set(row.slug, seed ? { ...seed, ...row, bio: row.bio || seed.bio } : row);
  }
  return [...bySlug.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );
}

async function loadLegendsFromDb(): Promise<Legend[]> {
  try {
    const sql = await getSql();
    const rows = await sql<LegendRow>`
      select slug, name, years, origin, instruments, era, bio, notable, youtube_url, sort_order, samois,
             photo_url, photo_credit, website_url, instagram_url, spotify_url, catalog_source, bio_status
      from legends
      order by sort_order asc
    `;
    return rows.map(mapLegend);
  } catch (err) {
    console.error("list legends failed", err);
    return [];
  }
}

async function seedCatalog() {
  const sql = await getSql();
  await ensureCatalogColumns();
  await sql.query(
    "alter table legends add column if not exists samois boolean not null default false",
  );
  await sql.query(
    "alter table profiles add column if not exists contact_url text not null default ''",
  );
  await sql.query(
    "alter table profiles add column if not exists spotify_url text not null default ''",
  );
  const haveRows = await sql<{ slug: string }>`select slug from legends`;
  const have = new Set(haveRows.map((row) => row.slug));
  const missing = LEGENDS.filter((legend) => !have.has(legend.slug));
  for (const legend of missing) {
    const samois = SAMOIS_SLUGS.has(legend.slug);
    const photoUrl = legend.photo_url ?? "";
    const photoCredit = legend.photo_credit ?? "";
    const website = legend.website_url ?? "";
    const instagram = legend.instagram_url ?? "";
    await sql`
      insert into legends (
        slug, name, years, origin, instruments, era, bio, notable, youtube_url, sort_order, samois,
        photo_url, photo_credit, website_url, instagram_url
      ) values (
        ${legend.slug}, ${legend.name}, ${legend.years}, ${legend.origin},
        ${legend.instruments}, ${legend.era}, ${legend.bio}, ${legend.notable},
        ${legend.youtube_url}, ${legend.sort_order}, ${samois},
        ${photoUrl}, ${photoCredit}, ${website}, ${instagram}
      )
      on conflict (slug) do update set
        name = excluded.name,
        years = excluded.years,
        origin = excluded.origin,
        instruments = excluded.instruments,
        era = excluded.era,
        bio = excluded.bio,
        notable = excluded.notable,
        youtube_url = excluded.youtube_url,
        sort_order = excluded.sort_order,
        samois = excluded.samois,
        photo_url = case when excluded.photo_url <> '' then excluded.photo_url else legends.photo_url end,
        photo_credit = case when excluded.photo_credit <> '' then excluded.photo_credit else legends.photo_credit end,
        website_url = case when excluded.website_url <> '' then excluded.website_url else legends.website_url end,
        instagram_url = case when excluded.instagram_url <> '' then excluded.instagram_url else legends.instagram_url end
    `;
  }
}

async function refreshConcerts() {
  const sig = LEGEND_CONCERTS.map(
    (concert) =>
      `${concert.legend_slug}|${concert.starts_at}|${concert.title}|${concert.country}|${concert.note ?? ""}`,
  ).join(";");
  if (sig === concertSig) return;
  concertRefresh ??= (async () => {
    const sql = await getSql();
    const upcoming = LEGEND_CONCERTS.filter((concert) => !concert.is_historic);
    const stamp = (starts: unknown, slug: string, title: string) =>
      `${slug}|${new Date(typeof starts === "string" ? starts : toIso(starts)).getTime()}|${title}`;
    const keep = new Set(
      upcoming.map((concert) => stamp(concert.starts_at, concert.legend_slug, concert.title)),
    );
    const rows = await sql<{
      id: number;
      legend_slug: string;
      title: string;
      starts_at: unknown;
      note: string | null;
      venue: string | null;
      city: string | null;
      country: string | null;
    }>`
      select id, legend_slug, title, starts_at, note, venue, city, country
      from legend_concerts where is_historic = false
    `;
    const have = new Set(
      rows.map((row) => stamp(row.starts_at, row.legend_slug, row.title)),
    );
    for (const row of rows) {
      if (keep.has(stamp(row.starts_at, row.legend_slug, row.title))) continue;
      await sql`delete from legend_concerts where id = ${row.id}`;
    }
    for (const concert of upcoming) {
      const existing = rows.find(
        (row) =>
          stamp(row.starts_at, row.legend_slug, row.title) ===
          stamp(concert.starts_at, concert.legend_slug, concert.title),
      );
      if (existing) {
        if (
          (existing.note ?? "") !== (concert.note ?? "") ||
          (existing.venue ?? "") !== concert.venue ||
          (existing.city ?? "") !== concert.city ||
          (existing.country ?? "") !== concert.country
        ) {
          await sql`
            update legend_concerts
            set note = ${concert.note ?? ""},
                venue = ${concert.venue},
                city = ${concert.city},
                country = ${concert.country}
            where id = ${existing.id}
          `;
        }
        continue;
      }
      if (have.has(stamp(concert.starts_at, concert.legend_slug, concert.title))) continue;
      await sql`
        insert into legend_concerts (
          legend_slug, title, venue, city, country, starts_at, is_historic, note
        ) values (
          ${concert.legend_slug}, ${concert.title}, ${concert.venue}, ${concert.city},
          ${concert.country}, ${concert.starts_at}, ${concert.is_historic}, ${concert.note}
        )
      `;
    }
    for (const concert of LEGEND_CONCERTS) {
      if (!concert.is_historic) continue;
      const existing = await sql<{ id: number }>`
        select id from legend_concerts
        where legend_slug = ${concert.legend_slug}
          and starts_at = ${concert.starts_at}
        limit 1
      `;
      if (existing[0]) continue;
      await sql`
        insert into legend_concerts (
          legend_slug, title, venue, city, country, starts_at, is_historic, note
        ) values (
          ${concert.legend_slug}, ${concert.title}, ${concert.venue}, ${concert.city},
          ${concert.country}, ${concert.starts_at}, ${concert.is_historic}, ${concert.note}
        )
      `;
    }
    concertSig = sig;
  })().finally(() => {
    concertRefresh = null;
  });
  await concertRefresh;
}

function mapProfile(row: ProfileRow): Profile {
  return {
    userId: row.user_id,
    slug: row.slug,
    displayName: row.display_name,
    city: row.city,
    country: row.country,
    instruments: row.instruments,
    bio: row.bio,
    websiteUrl: row.website_url,
    youtubeUrl: row.youtube_url,
    instagramUrl: row.instagram_url,
    spotifyUrl: row.spotify_url ?? "",
    contactUrl: row.contact_url ?? "",
    lookingForGigs: Boolean(row.looking_for_gigs),
    availableToJam: Boolean(row.available_to_jam),
    memberKind: row.member_kind === "fan" ? "fan" : "musician",
    profileTypes: typesFromMemberKind(parseProfileTypes(row.profile_types), row.member_kind),
    openForInvites: Boolean(row.open_for_invites),
    createdAt: toIso(row.created_at),
    followerCount: Number(row.follower_count ?? 0),
  };
}

function mapLegend(row: LegendRow): Legend {
  return {
    slug: row.slug,
    name: row.name,
    years: row.years,
    origin: row.origin,
    instruments: row.instruments,
    era: row.era,
    bio: row.bio,
    notable: row.notable,
    youtubeUrl: row.youtube_url,
    sortOrder: row.sort_order,
    samois: Boolean(row.samois) || SAMOIS_SLUGS.has(row.slug),
    photoUrl: row.photo_url ?? "",
    photoCredit: row.photo_credit ?? "",
    websiteUrl: row.website_url ?? "",
    instagramUrl: row.instagram_url ?? "",
    spotifyUrl: row.spotify_url ?? "",
    catalogSource: row.catalog_source ?? "seed",
    bioStatus: row.bio_status ?? "ok",
  };
}

function mapSeedConcert(concert: ConcertSeed, name: string): Concert {
  return {
    id: `s-${concert.legend_slug}-${concert.starts_at}`,
    kind: "legend",
    title: concert.title,
    venue: concert.venue,
    city: concert.city,
    country: concert.country,
    startsAt: concert.starts_at,
    description: concert.note,
    ticketUrl: urlFromText(concert.note),
    isHistoric: concert.is_historic,
    artistName: name,
    artistSlug: concert.legend_slug,
  };
}

function mergeConcertLists(lists: Concert[][]): Concert[] {
  const by = new Map<string, Concert>();
  for (const list of lists) {
    for (const row of list) {
      const key = `${new Date(row.startsAt).getTime()}|${row.title.trim().toLowerCase()}|${row.venue.trim().toLowerCase()}|${row.artistSlug}`;
      if (!by.has(key)) by.set(key, row);
    }
  }
  return [...by.values()].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

async function uniqueSlug(base: string, userId: string) {
  const sql = await getSql();
  const root = slugify(base);
  let candidate = root;
  let n = 2;
  for (;;) {
    const existing = await sql<{ user_id: string }>`
      select user_id from profiles where slug = ${candidate} limit 1
    `;
    if (!existing[0] || existing[0].user_id === userId) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

async function legendsCatalog() {
  void ensureSeed();
  return mergeLegends(await loadLegendsFromDb());
}

export const listLegends = createServerFn({ method: "GET" }).handler(async () => {
  return legendsCatalog();
});

export const getLegend = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    void ensureSeed();
    try {
      const sql = await getSql();
      const rows = await sql<LegendRow>`
        select slug, name, years, origin, instruments, era, bio, notable, youtube_url, sort_order, samois,
               photo_url, photo_credit, website_url, instagram_url, spotify_url, catalog_source, bio_status
        from legends where slug = ${slug} limit 1
      `;
      if (rows[0]) {
        const seed = LEGENDS.find((row) => row.slug === slug);
        const mapped = mapLegend(rows[0]);
        return seed ? { ...mapSeedLegend(seed), ...mapped, bio: mapped.bio || seed.bio } : mapped;
      }
    } catch (err) {
      console.error("get legend failed", err);
    }
    const seed = LEGENDS.find((row) => row.slug === slug);
    return seed ? mapSeedLegend(seed) : null;
  });

export const listCollaborators = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      const wanted = collaboratorSlugs(slug);
      if (wanted.length === 0) return [];
      const allow = new Set(wanted);
      const legends = await legendsCatalog();
      return legends.filter((legend) => allow.has(legend.slug));
    } catch (err) {
      console.error("listCollaborators failed", err);
      return catalogCollaborators(slug);
    }
  });

export const listMusicians = createServerFn({ method: "GET" })
  .validator((input: { q?: string } = {}) => input)
  .handler(async ({ data }) => {
    try {
      await ensureSeed();
      await ensureFanTables();
      const sql = await getSql();
      const q = data.q?.trim() ?? "";
      const like = `%${q}%`;
      const rows = q
        ? await sql<ProfileRow>`
          select p.*, (
            select count(*)::int from follows f where f.musician_user_id = p.user_id
          ) as follower_count
          from profiles p
          where coalesce(p.member_kind, 'musician') <> 'fan'
            and (
              p.display_name ilike ${like}
              or p.city ilike ${like}
              or p.country ilike ${like}
              or p.instruments ilike ${like}
            )
          order by p.created_at desc
        `
        : await sql<ProfileRow>`
          select p.*, (
            select count(*)::int from follows f where f.musician_user_id = p.user_id
          ) as follower_count
          from profiles p
          where coalesce(p.member_kind, 'musician') <> 'fan'
          order by p.created_at desc
        `;
      return rows.map(mapProfile);
    } catch (err) {
      console.error("list musicians failed", err);
      return [];
    }
  });

export const getMusician = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
    await ensureFanTables();
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
      select p.*, (
        select count(*)::int from follows f where f.musician_user_id = p.user_id
      ) as follower_count
      from profiles p
      where p.slug = ${slug}
      limit 1
    `;
    return rows[0] ? mapProfile(rows[0]) : null;
    } catch (err) {
      console.error("getMusician db failed", err);
      return null;
    }
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureFanTables();
    const sql = await getSql();
    const rows = await sql<ProfileRow>`
      select p.*, (
        select count(*)::int from follows f where f.musician_user_id = p.user_id
      ) as follower_count
      from profiles p
      where p.user_id = ${context.userId}
      limit 1
    `;
    return rows[0] ? mapProfile(rows[0]) : null;
  });

export const saveMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      displayName: string;
      city: string;
      country: string;
      instruments: string;
      bio: string;
      websiteUrl: string;
      youtubeUrl: string;
      instagramUrl: string;
      spotifyUrl?: string;
      contactUrl: string;
      lookingForGigs: boolean;
      availableToJam: boolean;
      memberKind?: "musician" | "fan";
      profileTypes?: ProfileTypeId[];
      openForInvites?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const displayName = data.displayName.trim();
    if (!displayName) throw new Error("Give your page a name.");
    await ensureFanTables();
    const sql = await getSql();
    const slug = await uniqueSlug(displayName, context.userId);
    const types = typesFromMemberKind(data.profileTypes ?? [], data.memberKind);
    const memberKind = isMusician(types) ? "musician" : "fan";
    const openForInvites = Boolean(data.openForInvites);
    const profileTypes = serializeTypes(types);
    await sql`
      insert into profiles (
        user_id, slug, display_name, city, country, instruments, bio,
        website_url, youtube_url, instagram_url, spotify_url, contact_url, looking_for_gigs, available_to_jam,
        member_kind, profile_types, open_for_invites, updated_at
      ) values (
        ${context.userId}, ${slug}, ${displayName}, ${data.city.trim()},
        ${data.country.trim()}, ${data.instruments.trim()}, ${data.bio.trim()},
        ${data.websiteUrl.trim()}, ${data.youtubeUrl.trim()}, ${data.instagramUrl.trim()},
        ${(data.spotifyUrl ?? "").trim()}, ${data.contactUrl.trim()}, ${data.lookingForGigs}, ${data.availableToJam},
        ${memberKind}, ${profileTypes}, ${openForInvites}, now()
      )
      on conflict (user_id) do update set
        slug = excluded.slug,
        display_name = excluded.display_name,
        city = excluded.city,
        country = excluded.country,
        instruments = excluded.instruments,
        bio = excluded.bio,
        website_url = excluded.website_url,
        youtube_url = excluded.youtube_url,
        instagram_url = excluded.instagram_url,
        spotify_url = excluded.spotify_url,
        contact_url = excluded.contact_url,
        looking_for_gigs = excluded.looking_for_gigs,
        available_to_jam = excluded.available_to_jam,
        member_kind = excluded.member_kind,
        profile_types = excluded.profile_types,
        open_for_invites = excluded.open_for_invites,
        updated_at = now()
    `;
    const rows = await sql<ProfileRow>`
      select p.*, (
        select count(*)::int from follows f where f.musician_user_id = p.user_id
      ) as follower_count
      from profiles p where p.user_id = ${context.userId} limit 1
    `;
    return mapProfile(rows[0]!);
  });

export const listConcerts = createServerFn({ method: "POST" })
  .validator((input: { filter?: "upcoming" | "historic" | "all"; q?: string } = {}) => input)
  .handler(async ({ data }) => {
    void ensureSeed();
    const filter = data.filter ?? "upcoming";
    const q = data.q?.trim() ?? "";
    const live = liveConcertsSeed();

    let community: {
      id: number;
      title: string;
      venue: string;
      city: string;
      country: string;
      starts_at: unknown;
      description: string;
      ticket_url: string;
      display_name: string;
      slug: string;
    }[] = [];
    let legendRows: {
      id: number;
      title: string;
      venue: string;
      city: string;
      country: string;
      starts_at: unknown;
      note: string;
      is_historic: boolean;
      name: string;
      slug: string;
    }[] = [];
    let hub: Concert[] = [];
    try {
      const sql = await getSql();
      community = await sql`
      select c.id, c.title, c.venue, c.city, c.country, c.starts_at, c.description, c.ticket_url,
             p.display_name, p.slug
      from concerts c
      join profiles p on p.user_id = c.user_id
      order by c.starts_at asc
    `;
      legendRows = await sql`
      select lc.id, lc.title, lc.venue, lc.city, lc.country, lc.starts_at, lc.note, lc.is_historic,
             l.name, l.slug
      from legend_concerts lc
      left join legends l on l.slug = lc.legend_slug
      order by lc.starts_at asc
    `;
    } catch (err) {
      console.error("list concerts db failed", err);
    }
    try {
      hub = await listHubConcerts({ data: "" });
    } catch (err) {
      console.error("list concerts hub failed", err);
    }

    const now = Date.now();
    const mapped: Concert[] = [
      ...community.map((row) => ({
        id: `c-${row.id}`,
        kind: "community" as const,
        title: row.title,
        venue: row.venue,
        city: row.city,
        country: row.country,
        startsAt: toIso(row.starts_at),
        description: row.description,
        ticketUrl: row.ticket_url,
        isHistoric: false,
        artistName: row.display_name,
        artistSlug: row.slug,
      })),
      ...legendRows.map((row) => ({
        id: `l-${row.id}`,
        kind: "legend" as const,
        title: row.title,
        venue: row.venue,
        city: row.city,
        country: row.country,
        startsAt: toIso(row.starts_at),
        description: row.note,
        ticketUrl: urlFromText(row.note),
        isHistoric: Boolean(row.is_historic),
        artistName: row.name || row.title,
        artistSlug: row.slug || resolveArtistSlug(row.title),
      })),
      ...hub,
      ...live,
    ];

    return uniqueBills(
      mergeConcertLists([mapped])
        .filter((concert) => {
          const t = new Date(concert.startsAt).getTime();
          if (filter === "upcoming") return !concert.isHistoric && t >= now;
          if (filter === "historic") return concert.isHistoric || t < now;
          return true;
        })
        .filter((concert) => {
          if (!q) return true;
          const hay = `${concert.title} ${concert.artistName} ${concert.city} ${concert.country} ${concert.venue}`.toLowerCase();
          return hay.includes(q.toLowerCase());
        })
        .sort((a, b) => {
          const dir = filter === "historic" ? -1 : 1;
          return (new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()) * dir;
        }),
    );
  });

export const listLegendConcerts = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
    void ensureSeed();
    const name = LEGENDS.find((row) => row.slug === slug)?.name ?? slug;
    const seeded = LEGEND_CONCERTS.filter((concert) => concert.legend_slug === slug).map((concert) =>
      mapSeedConcert(concert, name),
    );
    let fromDb: Concert[] = [];
    try {
      const sql = await getSql();
      const rows = await sql<{
        id: number;
        title: string;
        venue: string;
        city: string;
        country: string;
        starts_at: unknown;
        note: string;
        is_historic: boolean;
        name: string;
        slug: string;
      }>`
        select lc.id, lc.title, lc.venue, lc.city, lc.country, lc.starts_at, lc.note, lc.is_historic,
               l.name, l.slug
        from legend_concerts lc
        left join legends l on l.slug = lc.legend_slug
        where lc.legend_slug = ${slug}
        order by lc.starts_at asc
      `;
      fromDb = rows.map((row) => ({
        id: `l-${row.id}`,
        kind: "legend" as const,
        title: row.title,
        venue: row.venue,
        city: row.city,
        country: row.country,
        startsAt: toIso(row.starts_at),
        description: row.note,
        ticketUrl: urlFromText(row.note),
        isHistoric: Boolean(row.is_historic),
        artistName: row.name || name,
        artistSlug: row.slug || slug,
      }));
    } catch (err) {
      console.error("legend concerts failed", err);
    }
    let hub: Concert[] = [];
    try {
      hub = await listHubConcerts({ data: slug });
    } catch (err) {
      console.error("hub concerts failed", err);
    }
    const live = liveConcertsSeed().filter((concert) => concert.artistSlug === slug);
    return mergeConcertLists([seeded, fromDb, hub, live]);
    } catch (err) {
      console.error("listLegendConcerts failed", err);
      return catalogConcertsFor(slug);
    }
  });

export async function loadConcert(id: string): Promise<Concert | null> {
  const raw = decodeURIComponent(id.trim());
  if (!raw) return null;
  const seeded = liveConcertsSeed();
  const seedHit = seeded.find((row) => row.id === raw) ?? null;
  if (seedHit) return seedHit;

  if (raw.startsWith("s-")) {
    for (const concert of LEGEND_CONCERTS) {
      const name =
        LEGENDS.find((legend) => legend.slug === concert.legend_slug)?.name ?? concert.legend_slug;
      const mapped = mapSeedConcert(concert, name);
      if (mapped.id === raw) return mapped;
    }
    const byStamp = seeded.find((row) => {
      const seedId = `s-${row.artistSlug}-${row.startsAt}`;
      return seedId === raw || raw.endsWith(row.startsAt);
    });
    if (byStamp) return byStamp;
  }

  const match = /^(l|c|h)-(\d+)$/.exec(raw);
  if (!match) return null;

  try {
    await ensureSeed();
    const sql = await getSql();
    const num = Number(match[2]);
    if (match[1] === "l") {
      const rows = await sql<{
        id: number;
        title: string;
        venue: string;
        city: string;
        country: string;
        starts_at: unknown;
        note: string;
        is_historic: boolean;
        name: string;
        slug: string;
      }>`
      select lc.id, lc.title, lc.venue, lc.city, lc.country, lc.starts_at, lc.note, lc.is_historic,
             l.name, l.slug
      from legend_concerts lc
      join legends l on l.slug = lc.legend_slug
      where lc.id = ${num}
      limit 1
    `;
      const row = rows[0];
      if (!row) return seedHit;
      return {
        id: `l-${row.id}`,
        kind: "legend",
        title: row.title,
        venue: row.venue,
        city: row.city,
        country: row.country,
        startsAt: toIso(row.starts_at),
        description: row.note,
        ticketUrl: urlFromText(row.note),
        isHistoric: Boolean(row.is_historic),
        artistName: row.name,
        artistSlug: row.slug,
      };
    }
    if (match[1] === "c") {
      const rows = await sql<{
        id: number;
        title: string;
        venue: string;
        city: string;
        country: string;
        starts_at: unknown;
        description: string;
        ticket_url: string;
        display_name: string;
        slug: string;
      }>`
      select c.id, c.title, c.venue, c.city, c.country, c.starts_at, c.description, c.ticket_url,
             p.display_name, p.slug
      from concerts c
      join profiles p on p.user_id = c.user_id
      where c.id = ${num}
      limit 1
    `;
      const row = rows[0];
      if (!row) return seedHit;
      return {
        id: `c-${row.id}`,
        kind: "community",
        title: row.title,
        venue: row.venue,
        city: row.city,
        country: row.country,
        startsAt: toIso(row.starts_at),
        description: row.description,
        ticketUrl: row.ticket_url,
        isHistoric: false,
        artistName: row.display_name,
        artistSlug: row.slug,
      };
    }
    const hub = await listHubConcerts({ data: "" });
    return hub.find((row) => row.id === raw) ?? seedHit;
  } catch (err) {
    console.error("loadConcert db failed", err);
    return seedHit;
  }
}

export const getConcert = createServerFn({ method: "GET" })
  .validator((id: string) => id.trim())
  .handler(async ({ data: id }) => loadConcert(id));

export const listMusicianConcerts = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const sql = await getSql();
    const profile = await sql<{ slug: string }>`
      select slug from profiles where user_id = ${userId} limit 1
    `;
    const rows = await sql<{
      id: number;
      title: string;
      venue: string;
      city: string;
      country: string;
      starts_at: unknown;
      description: string;
      ticket_url: string;
      display_name: string;
      slug: string;
    }>`
      select c.id, c.title, c.venue, c.city, c.country, c.starts_at, c.description, c.ticket_url,
             p.display_name, p.slug
      from concerts c
      join profiles p on p.user_id = c.user_id
      where c.user_id = ${userId}
      order by c.starts_at asc
    `;
    const hub = profile[0] ? await listHubConcerts({ data: profile[0].slug }) : [];
    return [
      ...rows.map((row) => ({
        id: `c-${row.id}`,
        kind: "community" as const,
        title: row.title,
        venue: row.venue,
        city: row.city,
        country: row.country,
        startsAt: toIso(row.starts_at),
        description: row.description,
        ticketUrl: row.ticket_url,
        isHistoric: false,
        artistName: row.display_name,
        artistSlug: row.slug,
      })),
      ...hub,
    ] satisfies Concert[];
  });

export const addConcert = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      title: string;
      venue: string;
      city: string;
      country: string;
      startsAt: string;
      description: string;
      ticketUrl: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const title = data.title.trim();
    if (!title) throw new Error("Give the concert a title.");
    const starts = new Date(data.startsAt);
    if (Number.isNaN(starts.getTime())) throw new Error("Pick a valid date.");
    const sql = await getSql();
    const profile = await sql<{ slug: string }>`
      select slug from profiles where user_id = ${context.userId} limit 1
    `;
    if (!profile[0]) throw new Error("Create your musician page before posting a concert.");
    const rows = await sql<{ id: number }>`
      insert into concerts (user_id, title, venue, city, country, starts_at, description, ticket_url)
      values (
        ${context.userId}, ${title}, ${data.venue.trim()}, ${data.city.trim()},
        ${data.country.trim()}, ${starts.toISOString()}, ${data.description.trim()},
        ${data.ticketUrl.trim()}
      )
      returning id
    `;
    return { id: rows[0]!.id };
  });

export const deleteConcert = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from concerts where id = ${id} and user_id = ${context.userId}`;
  });

export const isFollowing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((musicianUserId: string) => musicianUserId)
  .handler(async ({ context, data: musicianUserId }) => {
    const sql = await getSql();
    const rows = await sql<{ n: number }>`
      select count(*)::int as n from follows
      where follower_id = ${context.userId} and musician_user_id = ${musicianUserId}
    `;
    return (rows[0]?.n ?? 0) > 0;
  });

export const toggleFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((musicianUserId: string) => musicianUserId)
  .handler(async ({ context, data: musicianUserId }) => {
    if (musicianUserId === context.userId) throw new Error("You already have your own page.");
    const sql = await getSql();
    const existing = await sql<{ n: number }>`
      select count(*)::int as n from follows
      where follower_id = ${context.userId} and musician_user_id = ${musicianUserId}
    `;
    if ((existing[0]?.n ?? 0) > 0) {
      await sql`
        delete from follows
        where follower_id = ${context.userId} and musician_user_id = ${musicianUserId}
      `;
      await syncSocialAlertFollow(context.userId, musicianUserId, false);
      return { following: false };
    }
    await sql`
      insert into follows (follower_id, musician_user_id)
      values (${context.userId}, ${musicianUserId})
      on conflict do nothing
    `;
    await syncSocialAlertFollow(context.userId, musicianUserId, true);
    return { following: true };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { toUserId: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    if (data.toUserId === context.userId) throw new Error("Write to someone else in the circle.");
    const body = data.body.trim();
    if (!body) throw new Error("Write a short note.");
    if (body.length > 2000) throw new Error("Keep it under 2000 characters.");
    const sql = await getSql();
    await sql`
      insert into messages (from_user_id, to_user_id, body)
      values (${context.userId}, ${data.toUserId}, ${body})
    `;
  });

export const listInbox = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      from_user_id: string;
      to_user_id: string;
      body: string;
      created_at: unknown;
      from_name: string;
      from_slug: string;
      to_name: string;
      to_slug: string;
    }>`
      select m.id, m.from_user_id, m.to_user_id, m.body, m.created_at,
             coalesce(fp.display_name, 'Musician') as from_name,
             coalesce(fp.slug, '') as from_slug,
             coalesce(tp.display_name, 'Musician') as to_name,
             coalesce(tp.slug, '') as to_slug
      from messages m
      left join profiles fp on fp.user_id = m.from_user_id
      left join profiles tp on tp.user_id = m.to_user_id
      where m.to_user_id = ${context.userId} or m.from_user_id = ${context.userId}
      order by m.created_at desc
      limit 80
    `;
    return rows.map(
      (row) =>
        ({
          id: row.id,
          fromUserId: row.from_user_id,
          toUserId: row.to_user_id,
          body: row.body,
          createdAt: toIso(row.created_at),
          fromName: row.from_name,
          fromSlug: row.from_slug,
          toName: row.to_name,
          toSlug: row.to_slug,
        }) satisfies MessageRow,
    );
  });
