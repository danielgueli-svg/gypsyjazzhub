import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { parseMailLocale, welcomeMail, type MailLocale } from "@/lib/welcome-mail";

const RATE_PER_HOUR = 6;

export type ContributeGate = {
  skip: boolean;
  pending: boolean;
  status: "pending" | "published";
};

export async function ensureGuard() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_members (
      user_id text primary key,
      email text not null default '',
      verified integer not null default 0,
      banned integer not null default 0,
      approved_count integer not null default 0,
      verify_token text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  try {
    await sql.query(`alter table hub_members add column locale text not null default 'en'`);
  } catch {
    /* column already there */
  }
  await sql.query(`
    create table if not exists hub_bans (
      id serial primary key,
      user_id text not null default '',
      ip text not null default '',
      reason text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_submits (
      id serial primary key,
      user_id text not null,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_meta (
      k text primary key,
      v text not null default ''
    )
  `);
  try {
    const done = await sql<{ v: string }>`select v from hub_meta where k = ${"released_waiting_20260912"} limit 1`;
    if (!done[0]) {
      await sql`update hub_members set verified = 1, verify_token = '' where verified = 0`;
      await sql`insert into hub_meta (k, v) values (${"released_waiting_20260912"}, ${"1"}) on conflict (k) do nothing`;
    }
  } catch {
    /* first boot */
  }
}

export function clientIp() {
  try {
    const request = getRequest();
    if (!request) return "";
    const cf = request.headers.get("cf-connecting-ip");
    if (cf) return cf.trim();
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() ?? "";
  } catch {
    /* no request */
  }
  return "";
}

async function turnstileOk(token?: string) {
  const secret = process.env.TURNSTILE_SECRET?.trim();
  if (!secret) return true;
  if (!token?.trim()) return false;
  try {
    const body = new URLSearchParams({ secret, response: token.trim(), remoteip: clientIp() });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const json = (await res.json()) as { success?: boolean };
    return Boolean(json.success);
  } catch {
    return false;
  }
}

function localeFromRequest(): MailLocale {
  try {
    const request = getRequest();
    if (!request) return "en";
    const cookie = request.headers.get("cookie") ?? "";
    const match = cookie.match(/(?:^|;\s*)gjh-locale=([^;]*)/);
    const fromCookie = match?.[1] ? decodeURIComponent(match[1]) : "";
    if (fromCookie) return parseMailLocale(fromCookie);
    return parseMailLocale(request.headers.get("accept-language"));
  } catch {
    return "en";
  }
}

export async function startEmailVerification(userId: string, email: string, resend = false) {
  await ensureGuard();
  const sql = await getSql();
  const address = email.trim();
  if (!address.includes("@")) throw new Error("Need an email on this account.");
  let existing: { verified: number; verify_token: string; locale?: string }[] = [];
  try {
    existing = await sql<{ verified: number; verify_token: string; locale?: string }>`
      select verified, verify_token, locale from hub_members where user_id = ${userId} limit 1
    `;
  } catch {
    existing = await sql<{ verified: number; verify_token: string }>`
      select verified, verify_token from hub_members where user_id = ${userId} limit 1
    `;
  }
  if (Number(existing[0]?.verified) === 1) {
    return { token: "", mailed: false, already: true as const };
  }
  const oldToken = String(existing[0]?.verify_token ?? "").trim();
  if (oldToken && !resend) {
    return { token: oldToken, mailed: false, already: false as const };
  }
  const stored = String(existing[0]?.locale ?? "").trim();
  const locale = stored ? parseMailLocale(stored) : localeFromRequest();
  const token = crypto.randomUUID();
  try {
    await sql`
      insert into hub_members (user_id, email, verified, verify_token, locale)
      values (${userId}, ${address}, 0, ${token}, ${locale})
      on conflict (user_id) do update set
        email = excluded.email,
        verify_token = excluded.verify_token,
        locale = case
          when coalesce(hub_members.locale, '') = '' then excluded.locale
          else hub_members.locale
        end
    `;
  } catch {
    await sql`
      insert into hub_members (user_id, email, verified, verify_token)
      values (${userId}, ${address}, 0, ${token})
      on conflict (user_id) do update set email = excluded.email, verify_token = excluded.verify_token
    `;
  }
  const mail = welcomeMail(parseMailLocale(stored || locale), `https://www.gypsyjazzhub.com/verify-email?token=${encodeURIComponent(token)}`);
  let mailed = false;
  try {
    const { sendHubMail } = await import("@/lib/digest");
    await sendHubMail(address, mail.subject, mail.body);
    mailed = true;
  } catch {
    mailed = false;
  }
  if (!mailed) {
    try {
      await sql`update hub_members set verified = 1 where user_id = ${userId}`;
    } catch {
      /* keep token as backup */
    }
  }
  return { token, mailed, already: false as const };
}

export async function confirmEmailToken(token: string) {
  await ensureGuard();
  const sql = await getSql();
  const key = token.trim();
  if (!key) return false;
  const rows = await sql<{ user_id: string }>`
    select user_id from hub_members where verify_token = ${key} limit 1
  `;
  if (!rows[0]) return false;
  await sql`
    update hub_members set verified = 1, verify_token = '' where user_id = ${rows[0].user_id}
  `;
  return true;
}

export async function releaseWaitingMembers() {
  await ensureGuard();
  const sql = await getSql();
  let released = 0;
  try {
    const waiting = await sql<{ n: number }>`
      select count(*)::int as n from hub_members where verified = 0 and banned = 0
    `;
    released = waiting[0]?.n ?? 0;
    await sql`update hub_members set verified = 1, verify_token = '' where verified = 0 and banned = 0`;
  } catch {
    released = 0;
  }
  return { released };
}

export async function markMemberVerified(userId: string, email?: string) {
  await ensureGuard();
  const sql = await getSql();
  await sql`
    insert into hub_members (user_id, email, verified)
    values (${userId}, ${email ?? ""}, 1)
    on conflict (user_id) do update set verified = 1, email = coalesce(nullif(excluded.email, ''), hub_members.email)
  `;
}

export async function bumpApproved(userId: string) {
  if (!userId) return;
  await ensureGuard();
  const sql = await getSql();
  await sql`
    insert into hub_members (user_id, verified, approved_count)
    values (${userId}, 1, 1)
    on conflict (user_id) do update set approved_count = hub_members.approved_count + 1
  `;
}

export async function setMemberBanned(userId: string, banned: boolean, ip = "") {
  await ensureGuard();
  const sql = await getSql();
  await sql`
    insert into hub_members (user_id, banned)
    values (${userId}, ${banned ? 1 : 0})
    on conflict (user_id) do update set banned = ${banned ? 1 : 0}
  `;
  if (banned) {
    await sql`insert into hub_bans (user_id, ip, reason) values (${userId}, ${ip}, ${"desk"})`;
  }
}

export async function memberFlags(userId: string) {
  await ensureGuard();
  const sql = await getSql();
  const rows = await sql<{ verified: number; banned: number; approved_count: number }>`
    select verified, banned, approved_count from hub_members where user_id = ${userId} limit 1
  `;
  return rows[0] ?? null;
}

export async function gateContribution(
  userId: string,
  input: { hp?: string; turnstile?: string } = {},
): Promise<ContributeGate> {
  await ensureGuard();
  if (input.hp?.trim()) {
    return { skip: true, pending: true, status: "pending" };
  }
  if (!(await turnstileOk(input.turnstile))) {
    throw new Error("Could not verify you are a person. Refresh and try again.");
  }
  const sql = await getSql();
  const ip = clientIp();
  if (ip) {
    const ipBan = await sql<{ id: number }>`select id from hub_bans where ip = ${ip} limit 1`;
    if (ipBan[0]) throw new Error("This account cannot post.");
  }
  let row = await memberFlags(userId);
  if (!row) {
    await sql`
      insert into hub_members (user_id, verified, approved_count)
      values (${userId}, 1, 0)
      on conflict (user_id) do nothing
    `;
    row = await memberFlags(userId);
  }
  if (row?.banned) throw new Error("This account cannot post.");
  if (row && row.verified === 0) {
    throw new Error("Verify your email first. We sent a link — or ask the hub desk.");
  }
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await sql<{ n: number }>`
    select count(*)::int as n from hub_submits
    where user_id = ${userId} and created_at > ${hourAgo}
  `;
  if ((recent[0]?.n ?? 0) >= RATE_PER_HOUR) {
    throw new Error("Slow down — a few posts per hour is enough.");
  }
  await sql`insert into hub_submits (user_id) values (${userId})`;
  const pending = !row || row.approved_count < 1;
  return { skip: false, pending, status: pending ? "pending" : "published" };
}
