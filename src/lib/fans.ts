import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, getDbSource } from "@/lib/db";
import { sendHubMail } from "@/lib/digest";
import { formatConcertWhen, slugify, toIso } from "@/lib/utils";
import { parseProfileTypes, serializeTypes, typesFromMemberKind } from "@/lib/profile-types";

export type MemberKind = "musician" | "fan";

export type FanRow = {
  userId: string;
  slug: string;
  displayName: string;
  city: string;
  country: string;
  bio: string;
  openForInvites: boolean;
  memberKind: MemberKind;
};

export type JamInvite = {
  id: number;
  jamSlug: string;
  jamName: string;
  city: string;
  country: string;
  startsAt: string | null;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  body: string;
  createdAt: string;
};

const HUB = "https://www.gypsyjazzhub.com";

const SEED_FANS: Array<{
  userId: string;
  name: string;
  city: string;
  country: string;
  bio: string;
}> = [
  {
    userId: "fan-elodie",
    name: "Élodie Martin",
    city: "Samois-sur-Seine",
    country: "France",
    bio: "I come for the jams, not to play. The circle is the point — a chair at the side of the room, a glass, the pompe.",
  },
  {
    userId: "fan-jan",
    name: "Jan de Vries",
    city: "Utrecht",
    country: "Netherlands",
    bio: "Listener and dancer. Invite me if you need an extra pair of ears and someone to keep time with a foot.",
  },
  {
    userId: "fan-sophie",
    name: "Sophie Laurent",
    city: "Fontainebleau",
    country: "France",
    bio: "Festival friend. I’ll bring wine if you open a meetup jam. Non-musician, long-time fan of the circuit.",
  },
  {
    userId: "fan-marco",
    name: "Marco Rossi",
    city: "Milan",
    country: "Italy",
    bio: "I don’t play. I book the train, I film a little, I sit in. Open for invitations when a jam needs a room that isn’t only guitarists.",
  },
];

let fanReady: Promise<void> | null = null;

export async function ensureProfileColumns() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists profiles (
      user_id text primary key,
      slug text not null unique,
      display_name text not null,
      city text not null default '',
      country text not null default '',
      instruments text not null default '',
      bio text not null default '',
      website_url text not null default '',
      youtube_url text not null default '',
      instagram_url text not null default '',
      contact_url text not null default '',
      spotify_url text not null default '',
      looking_for_gigs integer not null default 0,
      available_to_jam integer not null default 0,
      member_kind text not null default 'musician',
      profile_types text not null default '',
      open_for_invites integer not null default 0,
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now'))
    )
  `);
  await sql.query(`
    create table if not exists follows (
      follower_id text not null,
      musician_user_id text not null,
      created_at text not null default (datetime('now')),
      primary key (follower_id, musician_user_id)
    )
  `);
  await sql.query(`
    create table if not exists hub_profiles (
      user_id text primary key,
      chat_name text not null default '',
      artist_slug text not null default '',
      updated_at text not null default (datetime('now'))
    )
  `);
  await sql.query(`
    create table if not exists concerts (
      id integer primary key autoincrement,
      user_id text not null,
      title text not null,
      venue text not null default '',
      city text not null default '',
      country text not null default '',
      starts_at text not null,
      description text not null default '',
      ticket_url text not null default '',
      created_at text not null default (datetime('now'))
    )
  `);
  for (const col of [
    "contact_url text not null default ''",
    "spotify_url text not null default ''",
    "member_kind text not null default 'musician'",
    "profile_types text not null default ''",
    "open_for_invites integer not null default 0",
    "looking_for_gigs integer not null default 0",
    "available_to_jam integer not null default 0",
  ]) {
    try {
      await sql.query(`alter table profiles add column ${col}`);
    } catch {
      /* column already there */
    }
  }
}

export async function ensureFanTables() {
  if (getDbSource() === "none") return;
  fanReady ??= (async () => {
    const sql = await getSql();
    await ensureProfileColumns();
    if (getDbSource() === "do") return;
    await sql.query(`alter table profiles add column if not exists member_kind text not null default 'musician'`);
    await sql.query(`alter table profiles add column if not exists open_for_invites boolean not null default false`);
    await sql.query(`alter table profiles add column if not exists profile_types text not null default ''`);
    await sql.query(`alter table profiles add column if not exists spotify_url text not null default ''`);
    await sql.query(`
      create table if not exists hub_jam_invites (
        id serial primary key,
        jam_slug text not null,
        jam_name text not null default '',
        city text not null default '',
        country text not null default '',
        starts_at timestamptz,
        from_user_id text not null,
        to_user_id text not null,
        body text not null default '',
        created_at timestamptz not null default now()
      )
    `);
    await sql.query(`create index if not exists hub_jam_invites_to_idx on hub_jam_invites (to_user_id, created_at desc)`);
    await sql.query(
      `create unique index if not exists hub_jam_invites_once_idx on hub_jam_invites (jam_slug, to_user_id)`,
    );
    for (const fan of SEED_FANS) {
      const slug = slugify(fan.name);
      await sql`
        insert into profiles (
          user_id, slug, display_name, city, country, bio, member_kind, open_for_invites, updated_at
        ) values (
          ${fan.userId}, ${slug}, ${fan.name}, ${fan.city}, ${fan.country}, ${fan.bio},
          ${"fan"}, ${true}, now()
        )
        on conflict (user_id) do nothing
      `;
    }
  })();
  try {
    await fanReady;
  } catch (err) {
    fanReady = null;
    throw err;
  }
}

function mapFan(row: {
  user_id: string;
  slug: string;
  display_name: string;
  city: string;
  country: string;
  bio: string;
  open_for_invites: boolean;
  member_kind?: string;
}): FanRow {
  return {
    userId: row.user_id,
    slug: row.slug,
    displayName: row.display_name,
    city: row.city,
    country: row.country,
    bio: row.bio,
    openForInvites: Boolean(row.open_for_invites),
    memberKind: row.member_kind === "fan" ? "fan" : "musician",
  };
}

export const listFans = createServerFn({ method: "GET" }).handler(async () => {
  await ensureFanTables();
  const sql = await getSql();
  const rows = await sql<{
    user_id: string;
    slug: string;
    display_name: string;
    city: string;
    country: string;
    bio: string;
    open_for_invites: boolean;
    member_kind: string;
  }>`
    select user_id, slug, display_name, city, country, bio, open_for_invites, member_kind
    from profiles
    where member_kind = ${"fan"}
    order by display_name asc
  `;
  return rows.map(mapFan);
});

export const getFan = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureFanTables();
    const sql = await getSql();
    const rows = await sql<{
      user_id: string;
      slug: string;
      display_name: string;
      city: string;
      country: string;
      bio: string;
      open_for_invites: boolean;
      member_kind: string;
    }>`
      select user_id, slug, display_name, city, country, bio, open_for_invites, member_kind
      from profiles
      where slug = ${slug} and member_kind = ${"fan"}
      limit 1
    `;
    return rows[0] ? mapFan(rows[0]) : null;
  });

export const listOpenInvitees = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { country?: string } = {}) => input)
  .handler(async ({ context, data }) => {
    await ensureFanTables();
    const sql = await getSql();
    const country = data.country?.trim() ?? "";
    const rows = country
      ? await sql<{
          user_id: string;
          slug: string;
          display_name: string;
          city: string;
          country: string;
          bio: string;
          open_for_invites: boolean;
        }>`
          select user_id, slug, display_name, city, country, bio, open_for_invites, member_kind
          from profiles
          where open_for_invites = true
            and user_id <> ${context.userId}
            and country ilike ${country}
          order by display_name asc
          limit 80
        `
      : await sql<{
          user_id: string;
          slug: string;
          display_name: string;
          city: string;
          country: string;
          bio: string;
          open_for_invites: boolean;
        }>`
          select user_id, slug, display_name, city, country, bio, open_for_invites, member_kind
          from profiles
          where open_for_invites = true
            and user_id <> ${context.userId}
          order by display_name asc
          limit 80
        `;
    return rows.map(mapFan);
  });

export const setMemberKind = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((kind: MemberKind) => (kind === "fan" ? "fan" : "musician"))
  .handler(async ({ context, data: kind }) => {
    await ensureFanTables();
    const sql = await getSql();
    const existing = await sql<{ display_name: string; profile_types?: string; member_kind?: string }>`
      select display_name, profile_types, member_kind from profiles where user_id = ${context.userId} limit 1
    `;
    if (!existing[0]) {
      const name = "Hub member";
      const types = kind === "fan" ? "fan" : "musician";
      await sql`
        insert into profiles (user_id, slug, display_name, country, member_kind, profile_types, updated_at)
        values (${context.userId}, ${await uniqueFanSlug(name, context.userId)}, ${name}, ${"France"}, ${kind}, ${types}, now())
      `;
    } else {
      const current = typesFromMemberKind(parseProfileTypes(existing[0].profile_types), existing[0].member_kind)
        .filter((id) => id !== "musician" && id !== "fan");
      const next = serializeTypes(kind === "musician" ? ["musician", ...current] : current.length ? current : ["fan"]);
      await sql`
        update profiles set member_kind = ${kind}, profile_types = ${next}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }
    return { kind };
  });

export const saveProfileTypes = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((types: string[]) => types.map((id) => id.trim().toLowerCase()).filter(Boolean))
  .handler(async ({ context, data }) => {
    await ensureFanTables();
    const types = parseProfileTypes(data.join(","));
    const next = serializeTypes(types.length ? types : ["fan"]);
    const memberKind = types.includes("musician") ? "musician" : "fan";
    const sql = await getSql();
    const existing = await sql<{ display_name: string }>`
      select display_name from profiles where user_id = ${context.userId} limit 1
    `;
    if (!existing[0]) {
      const name = "Hub member";
      await sql`
        insert into profiles (user_id, slug, display_name, country, member_kind, profile_types, updated_at)
        values (${context.userId}, ${await uniqueFanSlug(name, context.userId)}, ${name}, ${"France"}, ${memberKind}, ${next}, now())
      `;
    } else {
      await sql`
        update profiles set member_kind = ${memberKind}, profile_types = ${next}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }
    return { types, memberKind };
  });

export const setOpenForInvites = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((open: boolean) => Boolean(open))
  .handler(async ({ context, data: open }) => {
    await ensureFanTables();
    const sql = await getSql();
    const existing = await sql<{ n: number }>`
      select count(*)::int as n from profiles where user_id = ${context.userId}
    `;
    if (!(existing[0]?.n ?? 0)) {
      await sql`
        insert into profiles (user_id, slug, display_name, country, open_for_invites, updated_at)
        values (
          ${context.userId},
          ${await uniqueFanSlug("Hub member", context.userId)},
          ${"Hub member"},
          ${"France"},
          ${open},
          now()
        )
      `;
    } else {
      await sql`
        update profiles set open_for_invites = ${open}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }
    return { open };
  });

export const inviteToJam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      jamSlug: string;
      jamName: string;
      city?: string;
      country?: string;
      startsAt?: string;
      toUserIds?: string[];
      allOpen?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureFanTables();
    const jamSlug = data.jamSlug.trim();
    const jamName = data.jamName.trim() || jamSlug;
    if (!jamSlug) throw new Error("Name the jam.");
    const sql = await getSql();
    let targets = (data.toUserIds ?? []).filter((id) => id && id !== context.userId);
    if (data.allOpen || targets.length === 0) {
      const country = data.country?.trim() ?? "";
      const open = country
        ? await sql<{ user_id: string }>`
            select user_id from profiles
            where open_for_invites = true and user_id <> ${context.userId} and country ilike ${country}
            limit 80
          `
        : await sql<{ user_id: string }>`
            select user_id from profiles
            where open_for_invites = true and user_id <> ${context.userId}
            limit 80
          `;
      targets = open.map((row) => row.user_id);
    }
    if (targets.length === 0) return { sent: 0 };

    const from = await sql<{ display_name: string }>`
      select display_name from profiles where user_id = ${context.userId} limit 1
    `;
    const fromName = from[0]?.display_name || "A hub member";
    const when = data.startsAt ? formatConcertWhen(data.startsAt) : "";
    const place = [data.city, data.country].filter(Boolean).join(", ");
    const href = `${HUB}/jams/${jamSlug}`;
    const body = [
      `${fromName} invites you to ${jamName}.`,
      when ? `When: ${when}` : "",
      place ? `Where: ${place}` : "",
      "",
      href,
    ]
      .filter((line) => line !== "")
      .join("\n");

    let sent = 0;
    for (const toUserId of targets) {
      try {
        await sql`
          insert into hub_jam_invites (
            jam_slug, jam_name, city, country, starts_at, from_user_id, to_user_id, body
          ) values (
            ${jamSlug}, ${jamName}, ${data.city?.trim() ?? ""}, ${data.country?.trim() ?? ""},
            ${data.startsAt || null}, ${context.userId}, ${toUserId}, ${body}
          )
          on conflict (jam_slug, to_user_id) do nothing
        `;
        await sql`
          insert into messages (from_user_id, to_user_id, body)
          values (${context.userId}, ${toUserId}, ${body})
        `;
        const account = await sql<{ email: string; name: string }>`
          select email, name from "user" where id = ${toUserId} limit 1
        `;
        const email = account[0]?.email ?? "";
        if (email.includes("@")) {
          await sendHubMail(
            email,
            `Jam invitation: ${jamName}`,
            `Hello${account[0]?.name ? ` ${account[0].name}` : ""},\n\n${body}\n\nYou turned on Open for invitations on Gypsy Jazz Hub.\nMade by Daniel Gueli`,
          );
        }
        sent += 1;
      } catch {
        /* skip a single failed invite */
      }
    }
    return { sent };
  });

export const listMyInvites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureFanTables();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      jam_slug: string;
      jam_name: string;
      city: string;
      country: string;
      starts_at: unknown;
      from_user_id: string;
      to_user_id: string;
      body: string;
      created_at: unknown;
      from_name: string;
      to_name: string;
    }>`
      select i.id, i.jam_slug, i.jam_name, i.city, i.country, i.starts_at,
             i.from_user_id, i.to_user_id, i.body, i.created_at,
             coalesce(fp.display_name, 'Hub member') as from_name,
             coalesce(tp.display_name, 'Hub member') as to_name
      from hub_jam_invites i
      left join profiles fp on fp.user_id = i.from_user_id
      left join profiles tp on tp.user_id = i.to_user_id
      where i.to_user_id = ${context.userId} or i.from_user_id = ${context.userId}
      order by i.created_at desc
      limit 40
    `;
    return rows.map(
      (row) =>
        ({
          id: row.id,
          jamSlug: row.jam_slug,
          jamName: row.jam_name,
          city: row.city,
          country: row.country,
          startsAt: row.starts_at ? toIso(row.starts_at) : null,
          fromUserId: row.from_user_id,
          fromName: row.from_name,
          toUserId: row.to_user_id,
          toName: row.to_name,
          body: row.body,
          createdAt: toIso(row.created_at),
        }) satisfies JamInvite,
    );
  });

async function uniqueFanSlug(base: string, userId: string) {
  const sql = await getSql();
  const root = slugify(base) || "member";
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
