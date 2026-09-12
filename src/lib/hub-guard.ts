import { getRequest } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";

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

export async function startEmailVerification(userId: string, email: string) {
  await ensureGuard();
  const sql = await getSql();
  const address = email.trim();
  if (!address.includes("@")) throw new Error("Need an email on this account.");
  const already = await sql<{ verified: number }>`
    select verified from hub_members where user_id = ${userId} limit 1
  `;
  if (Number(already[0]?.verified) === 1) {
    return { token: "", mailed: false, already: true as const };
  }
  const token = crypto.randomUUID();
  await sql`
    insert into hub_members (user_id, email, verified, verify_token)
    values (${userId}, ${address}, 0, ${token})
    on conflict (user_id) do update set email = excluded.email, verify_token = excluded.verify_token
  `;
  const link = `https://www.gypsyjazzhub.com/verify-email?token=${encodeURIComponent(token)}`;
  let mailed = false;
  try {
    const { sendHubMail } = await import("@/lib/digest");
    await sendHubMail(
      address,
      "Confirm your Gypsy Jazz Hub email",
      [
        "Welcome to Gypsy Jazz Hub.",
        "",
        "Open this link to confirm your email. Then you can post a concert, jam or teacher:",
        link,
        "",
        "You can already sign in with the password you chose.",
        "",
        "If you did not join, ignore this mail.",
        "",
        "Gypsy Jazz Hub",
        "https://www.gypsyjazzhub.com/",
      ].join("\n"),
    );
    mailed = true;
  } catch {
    mailed = false;
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
