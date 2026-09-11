import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { toIso } from "@/lib/utils";
import {
  getDigestSettings,
  listDigestLog,
  runDigest,
  saveDigestSettings,
  type DigestSettings,
} from "@/lib/digest";
import {
  ensureSubscriptionTables,
  type SubscriptionKind,
} from "@/lib/subscriptions";
import {
  INSTRUMENT_OPTIONS,
  PROFILE_TYPES,
  isMusician,
  parseInstrumentIds,
  parseProfileTypes,
  typesFromMemberKind,
  type InstrumentId,
  type ProfileTypeId,
} from "@/lib/profile-types";
import { visitStats, type VisitDay, type VisitPlace } from "@/lib/visits";
import { isReservedTestEmail } from "@/lib/auth/email-password";
import { HUB_OWNER_EMAIL } from "@/lib/hub-owner";

const OWNER_PHRASE = "ile-du-berceau";
const OWNER_KEEP_EMAIL = HUB_OWNER_EMAIL;
const FOUNDING_KEEP_EMAILS = new Set([
  OWNER_KEEP_EMAIL,
  "mbamberg@kpnplanet.nl",
]);

function compactName(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z]/g, "");
}

function isFoundingMember(email: string, name = "") {
  const e = email.trim().toLowerCase();
  if (FOUNDING_KEEP_EMAILS.has(e)) return true;
  const n = compactName(name);
  if (!n) return false;
  if (n.includes("marciabamber") || n.includes("bamberg")) return true;
  if (n.includes("ronaldweel") || (n.includes("weel") && n.includes("ronald"))) return true;
  return false;
}

function isTestAccount(email: string, name = "", id = "") {
  if (isFoundingMember(email, name)) return false;
  const e = email.trim().toLowerCase();
  const n = name.trim().toLowerCase();
  if (id === "dev-user" || id === "hub-seed") return true;
  if (
    isReservedTestEmail(e) ||
    e.endsWith("@example.com") ||
    e.endsWith("@example.org") ||
    e.endsWith("@example.net") ||
    e.endsWith("@test.com") ||
    e.endsWith("@mailinator.com") ||
    e.endsWith("@yopmail.com") ||
    e.includes("grok-sandbox")
  ) {
    return true;
  }
  const local = e.split("@")[0] ?? "";
  if (/^(test|tester|testing|dummy|fake)(\d+)?([._+-].*)?$/.test(local)) return true;
  if (
    /^(hourly|hour check|hour-check|log ui|logui|footer check|footer-check|cookie persist|cookie-persist|cookie probe|cookieprobe|login e2e|login-e2e|login check|logincheck)$/.test(
      n,
    )
  ) {
    return true;
  }
  if (/^(test|tester|testing|test user|dummy|fake|fake user)$/.test(n)) return true;
  if (n.startsWith("test ")) return true;
  return false;
}

const TEST_EMAIL = `lower(email) like '%@gypsyjazzhub.test'
  or lower(email) = 'nobody@example.com'
  or (instr(lower(email), '@') > 0 and substr(lower(email), instr(lower(email), '@') + 1) like '%.test')`;

async function purgeTestAccounts() {
  const sql = await getSql();
  try {
    await sql.query(`
      delete from "session" where "userId" in (
        select id from "user" where ${TEST_EMAIL}
      )
    `);
    await sql.query(`
      delete from account where "userId" in (
        select id from "user" where ${TEST_EMAIL}
      )
    `);
    await sql.query(`
      delete from hub_subscriptions where user_id in (
        select id from "user" where ${TEST_EMAIL}
      )
    `);
    await sql.query(`
      delete from hub_members where ${TEST_EMAIL}
    `);
    await sql.query(`
      delete from "user" where ${TEST_EMAIL}
    `);
  } catch {
    /* best-effort */
  }
}

export type HubMember = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type HubActivity = {
  kind: string;
  id: string;
  title: string;
  who: string;
  when: string;
};

async function ensureOwnerTable() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_owners (
      user_id text primary key,
      claimed_at timestamptz not null default now()
    )
  `);
}

async function ownerIds() {
  await ensureOwnerTable();
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`select user_id from hub_owners`;
  return rows.map((row) => row.user_id);
}

async function requireOwner(userId: string) {
  const sql = await getSql();
  try {
    const me = await sql<{ email: string }>`select email from "user" where id = ${userId} limit 1`;
    if ((me[0]?.email ?? "").toLowerCase() === OWNER_KEEP_EMAIL) return;
  } catch {
    /* fall through to hub_owners */
  }
  const ids = await ownerIds();
  if (!ids.includes(userId)) throw new Error("Owner desk is only for the hub owner.");
}

export const amIOwner = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await getSql();
      const me = await sql<{ email: string }>`
        select email from "user" where id = ${context.userId} limit 1
      `;
      if ((me[0]?.email ?? "").toLowerCase() === OWNER_KEEP_EMAIL) {
        await ensureOwnerTable();
        await sql`insert into hub_owners (user_id) values (${context.userId}) on conflict do nothing`;
        return { owner: true, claimed: true };
      }
    } catch {
      /* use hub_owners */
    }
    try {
      const ids = await ownerIds();
      return { owner: ids.includes(context.userId), claimed: ids.length > 0 };
    } catch {
      return { owner: false, claimed: false };
    }
  });

export const claimOwner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((phrase: string) => phrase.trim().toLowerCase())
  .handler(async ({ context, data: phrase }) => {
    if (phrase !== OWNER_PHRASE) throw new Error("That phrase is not right.");
    const sql = await getSql();
    await ensureOwnerTable();
    await sql`insert into hub_owners (user_id) values (${context.userId}) on conflict do nothing`;
    return { ok: true };
  });

export const listHubMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    const sql = await getSql();
    let rows: { id: string; name: string; email: string; createdAt: unknown }[] = [];
    try {
      rows = await sql<{
        id: string;
        name: string;
        email: string;
        createdAt: unknown;
      }>`
        select id, name, email, "createdAt" from "user" order by "createdAt" desc
      `;
    } catch {
      rows = [];
    }
    const members: HubMember[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: toIso(row.createdAt),
    }));
    try {
      const extra = await sql<{ user_id: string; email: string; created_at: unknown }>`
        select user_id, email, created_at from hub_members
      `;
      const have = new Set(members.map((row) => row.id));
      for (const row of extra) {
        if (have.has(row.user_id)) continue;
        members.push({
          id: row.user_id,
          name: (row.email || "").split("@")[0] || "Hub member",
          email: row.email || "",
          createdAt: toIso(row.created_at),
        });
      }
    } catch {
      /* hub_members optional */
    }
    const real = members.filter((row) => !isTestAccount(row.email, row.name, row.id));
    try {
      await purgeTestAccounts();
    } catch {
      /* hide first, delete when we can */
    }
    return real;
  });

export const getVisitStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    return visitStats();
  });

export type { VisitDay, VisitPlace };

export type HubUserRow = {
  id: string;
  name: string;
  email: string;
  country: string;
  city: string;
  profileTypes: ProfileTypeId[];
  musician: boolean;
  instruments: string;
  instrumentIds: InstrumentId[];
  subscriptions: { kind: SubscriptionKind; targetId: string; targetName: string }[];
  createdAt: string;
  banned: boolean;
  verified: boolean;
};

export type HubUserStats = {
  totalUsers: number;
  musicians: number;
  nonMusicians: number;
  byCountry: { country: string; count: number }[];
  byType: { type: ProfileTypeId; count: number }[];
  bySubscription: { kind: SubscriptionKind; count: number }[];
  byInstrument: { id: InstrumentId; count: number }[];
};

export type HubUserFilter = {
  country?: string;
  subscriptionKind?: SubscriptionKind | "";
  profileType?: ProfileTypeId | "";
  musician?: "all" | "musician" | "non";
  instrument?: InstrumentId | "";
  q?: string;
};

function mapUserRow(row: {
  id: string;
  name: string;
  email: string;
  createdAt: unknown;
  country: string | null;
  city: string | null;
  member_kind: string | null;
  profile_types: string | null;
  instruments: string | null;
  subs: string | null;
}): HubUserRow {
  const types = typesFromMemberKind(parseProfileTypes(row.profile_types), row.member_kind);
  const instruments = row.instruments ?? "";
  const subscriptions = (row.subs ?? "")
    .split("||")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [kind, targetId, targetName] = part.split("\t");
      if (!kind || !targetId) return null;
      return {
        kind: kind as SubscriptionKind,
        targetId,
        targetName: targetName || targetId,
      };
    })
    .filter((item): item is HubUserRow["subscriptions"][number] => Boolean(item));
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    country: row.country ?? "",
    city: row.city ?? "",
    profileTypes: types,
    musician: isMusician(types),
    instruments,
    instrumentIds: parseInstrumentIds(instruments),
    subscriptions,
    createdAt: toIso(row.createdAt),
    banned: false,
    verified: true,
  };
}

async function loadUsersRaw() {
  const sql = await getSql();
  try {
    return await sql<{
      id: string;
      name: string;
      email: string;
      createdAt: unknown;
      country: string | null;
      city: string | null;
      member_kind: string | null;
      profile_types: string | null;
      instruments: string | null;
    }>`
      select
        u.id,
        u.name,
        u.email,
        u."createdAt",
        p.country,
        p.city,
        p.member_kind,
        p.profile_types,
        p.instruments
      from "user" u
      left join profiles p on p.user_id = u.id
      order by u."createdAt" desc
    `;
  } catch {
    try {
      return await sql<{
        id: string;
        name: string;
        email: string;
        createdAt: unknown;
        country: string | null;
        city: string | null;
        member_kind: string | null;
        profile_types: string | null;
        instruments: string | null;
      }>`
        select
          u.id,
          u.name,
          u.email,
          u."createdAt",
          p.country,
          p.city,
          '' as member_kind,
          '' as profile_types,
          p.instruments
        from "user" u
        left join profiles p on p.user_id = u.id
        order by u."createdAt" desc
      `;
    } catch {
      return await sql<{
        id: string;
        name: string;
        email: string;
        createdAt: unknown;
        country: string | null;
        city: string | null;
        member_kind: string | null;
        profile_types: string | null;
        instruments: string | null;
      }>`
        select
          id,
          name,
          email,
          "createdAt",
          '' as country,
          '' as city,
          '' as member_kind,
          '' as profile_types,
          '' as instruments
        from "user"
        order by "createdAt" desc
      `;
    }
  }
}

async function loadDirectory(filter: HubUserFilter = {}): Promise<HubUserRow[]> {
  try {
    await ensureSubscriptionTables();
  } catch {
    /* subscriptions table is optional */
  }
  const sql = await getSql();
  const rows = await loadUsersRaw();
  let subRows: {
    user_id: string;
    kind: string;
    target_id: string;
    target_name: string;
  }[] = [];
  try {
    subRows = await sql<{
      user_id: string;
      kind: string;
      target_id: string;
      target_name: string;
    }>`
      select user_id, kind, target_id, target_name from hub_subscriptions
    `;
  } catch {
    subRows = [];
  }
  const byUser = new Map<string, string[]>();
  for (const row of subRows) {
    const line = `${row.kind}\t${row.target_id}\t${row.target_name ?? ""}`;
    const list = byUser.get(row.user_id) ?? [];
    list.push(line);
    byUser.set(row.user_id, list);
  }
  let users = rows.map((row) =>
    mapUserRow({
      ...row,
      subs: (byUser.get(row.id) ?? []).join("||"),
    }),
  );
  try {
    const { ensureGuard } = await import("@/lib/hub-guard");
    await ensureGuard();
    const extra = await sql<{
      user_id: string;
      email: string;
      verified: number;
      banned: number;
      created_at: unknown;
    }>`
      select user_id, email, verified, banned, created_at from hub_members
    `;
    const have = new Set(users.map((row) => row.id));
    for (const row of extra) {
      if (have.has(row.user_id)) continue;
      const email = row.email || "";
      users.push(
        mapUserRow({
          id: row.user_id,
          name: email.split("@")[0] || "Hub member",
          email,
          createdAt: row.created_at,
          country: "",
          city: "",
          member_kind: "",
          profile_types: "",
          instruments: "",
          subs: (byUser.get(row.user_id) ?? []).join("||"),
        }),
      );
      have.add(row.user_id);
    }
    const flags = new Map(extra.map((row) => [row.user_id, row]));
    users = users.map((user) => {
      const row = flags.get(user.id);
      return {
        ...user,
        banned: Boolean(row?.banned),
        verified: row ? Boolean(row.verified) : true,
      };
    });
  } catch {
    /* hub_members optional */
  }
  users = users.filter((row) => !isTestAccount(row.email, row.name, row.id));
  const q = filter.q?.trim().toLowerCase() ?? "";
  if (q) {
    users = users.filter((row) =>
      `${row.name} ${row.email} ${row.country} ${row.city}`.toLowerCase().includes(q),
    );
  }
  if (filter.country) {
    const country = filter.country.toLowerCase();
    users = users.filter((row) => row.country.toLowerCase() === country);
  }
  if (filter.subscriptionKind) {
    users = users.filter((row) => row.subscriptions.some((sub) => sub.kind === filter.subscriptionKind));
  }
  if (filter.profileType) {
    users = users.filter((row) => row.profileTypes.includes(filter.profileType as ProfileTypeId));
  }
  if (filter.musician === "musician") users = users.filter((row) => row.musician);
  if (filter.musician === "non") users = users.filter((row) => !row.musician);
  if (filter.instrument) {
    users = users.filter((row) => row.instrumentIds.includes(filter.instrument as InstrumentId));
  }
  return users;
}

export const listHubUserDirectory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: HubUserFilter = {}) => input)
  .handler(async ({ context, data }) => {
    await requireOwner(context.userId);
    return loadDirectory(data);
  });

export const listHubUserStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    const users = await loadDirectory();
    const byCountryMap = new Map<string, number>();
    const byTypeMap = new Map<ProfileTypeId, number>();
    const bySubMap = new Map<SubscriptionKind, number>();
    const byInstMap = new Map<InstrumentId, number>();
    for (const user of users) {
      if (user.country) byCountryMap.set(user.country, (byCountryMap.get(user.country) ?? 0) + 1);
      for (const type of user.profileTypes) byTypeMap.set(type, (byTypeMap.get(type) ?? 0) + 1);
      for (const sub of user.subscriptions) bySubMap.set(sub.kind, (bySubMap.get(sub.kind) ?? 0) + 1);
      for (const inst of user.instrumentIds) byInstMap.set(inst, (byInstMap.get(inst) ?? 0) + 1);
    }
    return {
      totalUsers: users.length,
      musicians: users.filter((row) => row.musician).length,
      nonMusicians: users.filter((row) => !row.musician).length,
      byCountry: [...byCountryMap.entries()]
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country)),
      byType: PROFILE_TYPES.map((row) => ({ type: row.id, count: byTypeMap.get(row.id) ?? 0 })).filter(
        (row) => row.count,
      ),
      bySubscription: [...bySubMap.entries()]
        .map(([kind, count]) => ({ kind, count }))
        .sort((a, b) => b.count - a.count),
      byInstrument: INSTRUMENT_OPTIONS.map((row) => ({
        id: row.id,
        count: byInstMap.get(row.id) ?? 0,
      })).filter((row) => row.count),
    } satisfies HubUserStats;
  });

export const listHubActivity = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    const sql = await getSql();
    const activity: HubActivity[] = [];

    const concerts = await sql<{
      id: number;
      title: string;
      artist_name: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, title, artist_name, submitted_name, created_at
      from hub_concerts order by created_at desc limit 40
    `;
    for (const row of concerts) {
      activity.push({
        kind: "concert",
        id: String(row.id),
        title: `${row.artist_name} — ${row.title}`,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }

    const clips = await sql<{
      id: number;
      title: string;
      artist_slug: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, title, artist_slug, submitted_name, created_at
      from hub_clips order by created_at desc limit 20
    `;
    for (const row of clips) {
      activity.push({
        kind: "clip",
        id: String(row.id),
        title: row.title || row.artist_slug,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }

    const notes = await sql<{
      id: number;
      body: string;
      artist_slug: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, body, artist_slug, submitted_name, created_at
      from hub_notes order by created_at desc limit 20
    `;
    for (const row of notes) {
      activity.push({
        kind: "note",
        id: String(row.id),
        title: row.body.slice(0, 80),
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }

    const festivals = await sql<{
      slug: string;
      name: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select slug, name, submitted_name, created_at
      from hub_festivals order by created_at desc limit 20
    `;
    for (const row of festivals) {
      activity.push({
        kind: "festival",
        id: row.slug,
        title: row.name,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }

    const jams = await sql<{
      slug: string;
      name: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select slug, name, submitted_name, created_at
      from hub_jams order by created_at desc limit 20
    `;
    for (const row of jams) {
      activity.push({
        kind: "jam",
        id: row.slug,
        title: row.name,
        who: row.submitted_name,
        when: toIso(row.created_at),
      });
    }

    const chat = await sql<{
      id: number;
      body: string;
      chat_name: string;
      target_kind: string;
      target_slug: string;
      created_at: unknown;
    }>`
      select id, body, chat_name, target_kind, target_slug, created_at
      from hub_chat order by created_at desc limit 30
    `;
    for (const row of chat) {
      activity.push({
        kind: "chat",
        id: String(row.id),
        title: `${row.target_kind}/${row.target_slug}: ${row.body.slice(0, 60)}`,
        who: row.chat_name,
        when: toIso(row.created_at),
      });
    }

    activity.sort((a, b) => (a.when < b.when ? 1 : -1));
    return activity.slice(0, 80);
  });

export const removeHubItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: string; id: string }) => input)
  .handler(async ({ context, data }) => {
    await requireOwner(context.userId);
    const sql = await getSql();
    const id = data.id;
    if (data.kind === "concert") {
      await sql`delete from hub_concerts where id = ${Number(id)}`;
    } else if (data.kind === "clip") {
      await sql`delete from hub_clips where id = ${Number(id)}`;
    } else if (data.kind === "note" || data.kind === "history" || data.kind === "archive") {
      await sql`delete from hub_notes where id = ${Number(id)}`;
    } else if (data.kind === "festival") {
      await sql`delete from hub_festivals where slug = ${id}`;
    } else if (data.kind === "jam") {
      await sql`delete from hub_jams where slug = ${id}`;
    } else if (data.kind === "venue") {
      await sql`delete from hub_venues where slug = ${id}`;
    } else if (data.kind === "luthier") {
      await sql`delete from hub_luthiers where slug = ${id}`;
    } else if (data.kind === "teacher") {
      await sql`delete from hub_teachers where id = ${Number(id)}`;
    } else if (data.kind === "artist") {
      await sql`delete from hub_notes where id = ${Number(id)}`;
    } else if (data.kind === "chat") {
      await sql`delete from hub_chat where id = ${Number(id)}`;
    } else {
      throw new Error("Unknown item.");
    }
    return { ok: true };
  });

export const getOwnerDigest = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    const [settings, log] = await Promise.all([getDigestSettings(), listDigestLog()]);
    return { settings, log };
  });

export const saveOwnerDigest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: DigestSettings) => ({
    email: input.email.trim().toLowerCase(),
    enabled: Boolean(input.enabled),
  }))
  .handler(async ({ context, data }) => {
    await requireOwner(context.userId);
    if (data.email && !data.email.includes("@")) {
      throw new Error("That does not look like an email.");
    }
    return saveDigestSettings(data);
  });

export const sendOwnerDigest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    return runDigest("test");
  });

export const banHubMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; banned: boolean }) => input)
  .handler(async ({ context, data }) => {
    await requireOwner(context.userId);
    const { setMemberBanned } = await import("@/lib/hub-guard");
    await setMemberBanned(data.userId, data.banned);
    return { ok: true as const };
  });

export const eraseHubMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((userId: string) => userId.trim())
  .handler(async ({ context, data: userId }) => {
    await requireOwner(context.userId);
    if (!userId) throw new Error("Need a member.");
    if (userId === context.userId) throw new Error("You cannot erase your own login.");
    const sql = await getSql();
    const rows = await sql.query<{ email: string; name: string }>(
      `select email, name from "user" where id = $1 limit 1`,
      [userId],
    );
    const email = String(rows[0]?.email ?? "").toLowerCase();
    const name = String(rows[0]?.name ?? "");
    if (email === OWNER_KEEP_EMAIL || isFoundingMember(email, name)) {
      throw new Error("That member stays on the hub.");
    }
    const run = async (text: string, params: unknown[] = []) => {
      try {
        await sql.query(text, params);
      } catch {
        /* table may not exist */
      }
    };
    await run(`delete from "session" where "userId" = $1`, [userId]);
    await run(`delete from account where "userId" = $1`, [userId]);
    await run(`delete from hub_subscriptions where user_id = $1`, [userId]);
    await run(`delete from hub_members where user_id = $1`, [userId]);
    await run(`delete from hub_password_resets where user_id = $1`, [userId]);
    await run(`delete from profiles where user_id = $1`, [userId]);
    await run(`delete from "user" where id = $1`, [userId]);
    return { ok: true as const };
  });

export const verifyHubMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((userId: string) => userId)
  .handler(async ({ context, data: userId }) => {
    await requireOwner(context.userId);
    const { markMemberVerified } = await import("@/lib/hub-guard");
    await markMemberVerified(userId);
    return { ok: true as const };
  });

export const banHubIp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((ip: string) => ip.trim())
  .handler(async ({ context, data: ip }) => {
    await requireOwner(context.userId);
    if (!ip) throw new Error("Need an IP.");
    const { ensureGuard } = await import("@/lib/hub-guard");
    await ensureGuard();
    const sql = await getSql();
    await sql`insert into hub_bans (user_id, ip, reason) values (${""}, ${ip}, ${"desk"})`;
    return { ok: true as const };
  });
