import { hashPassword, isReservedTestEmail } from "@/lib/auth/email-password";
import { getSql } from "@/lib/db";
import { sendHubMail } from "@/lib/digest";
import { parseMailLocale, passwordMail } from "@/lib/welcome-mail";
import { getRequest } from "@tanstack/react-start/server";

const TTL_MS = 60 * 60 * 1000;
const COOLDOWN_MS = 10 * 60 * 1000;

async function tokenHash(token: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function ensureTable() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_password_resets (
      id text primary key,
      user_id text not null,
      email text not null,
      token_hash text not null,
      expires_at text not null,
      created_at text not null
    )
  `);
}

export async function requestPasswordReset(
  emailRaw: string,
  opts: { force?: boolean; mustExist?: boolean } = {},
) {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@") || isReservedTestEmail(email)) {
    if (opts.mustExist) throw new Error("No hub login for that email.");
    return { ok: true as const };
  }
  await ensureTable();
  const sql = await getSql();
  const users = await sql.query<{ id: string; name: string }>(
    `select id, name from "user" where lower(email) = $1 limit 1`,
    [email],
  );
  if (!users[0]) {
    if (opts.mustExist) throw new Error("No hub login for that email.");
    return { ok: true as const };
  }
  const userId = String(users[0].id);
  if (!opts.force) {
    const recent = await sql.query<{ id: string }>(
      `select id from hub_password_resets where email = $1 and created_at > $2 limit 1`,
      [email, new Date(Date.now() - COOLDOWN_MS).toISOString()],
    );
    if (recent[0]) return { ok: true as const };
  }
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
  const hash = await tokenHash(token);
  const now = new Date();
  await sql.query(`delete from hub_password_resets where user_id = $1`, [userId]);
  await sql.query(
    `insert into hub_password_resets (id, user_id, email, token_hash, expires_at, created_at)
     values ($1, $2, $3, $4, $5, $6)`,
    [
      crypto.randomUUID(),
      userId,
      email,
      hash,
      new Date(now.getTime() + TTL_MS).toISOString(),
      now.toISOString(),
    ],
  );
  const link = `https://www.gypsyjazzhub.com/reset-password?token=${encodeURIComponent(token)}`;
  let locale = parseMailLocale("en");
  let haveStored = false;
  try {
    const rows = await sql.query<{ locale: string }>(
      `select locale from hub_members where user_id = $1 limit 1`,
      [userId],
    );
    if (rows[0]?.locale) {
      locale = parseMailLocale(String(rows[0].locale));
      haveStored = true;
    }
  } catch {
    /* older rows */
  }
  if (!haveStored) {
    try {
      const request = getRequest();
      const cookie = request?.headers.get("cookie") ?? "";
      const match = cookie.match(/(?:^|;\s*)gjh-locale=([^;]*)/);
      if (match?.[1]) locale = parseMailLocale(decodeURIComponent(match[1]));
      else locale = parseMailLocale(request?.headers.get("accept-language"));
    } catch {
      /* stay en */
    }
  }
  const mail = passwordMail(locale, String(users[0].name ?? ""), link);
  try {
    await sendHubMail(email, mail.subject, mail.body);
  } catch (err) {
    if (opts.force) {
      return { ok: true as const, sent: false as const, email, link };
    }
    await sql.query(`delete from hub_password_resets where token_hash = $1`, [hash]);
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[password-reset] mail failed:", detail);
    if (/RESEND_API_KEY|Mail is not configured/i.test(detail)) {
      throw new Error(
        "Reset mail cannot be sent yet — the hub mail key is missing. Ask the board, or try again later.",
      );
    }
    throw new Error("Could not send the reset email. Try again in a few minutes.");
  }
  return { ok: true as const, sent: true as const, email };
}

export async function applyPasswordReset(tokenRaw: string, password: string) {
  const passwordTrim = password.trim();
  if (passwordTrim.length < 8) throw new Error("Password needs at least 8 characters.");
  const token = tokenRaw.trim();
  if (!token) throw new Error("That reset link is old or already used.");
  await ensureTable();
  const sql = await getSql();
  const hash = await tokenHash(token);
  const rows = await sql.query<{ user_id: string; expires_at: string }>(
    `select user_id, expires_at from hub_password_resets where token_hash = $1 limit 1`,
    [hash],
  );
  if (!rows[0]) throw new Error("That reset link is old or already used.");
  if (new Date(String(rows[0].expires_at)).getTime() < Date.now()) {
    await sql.query(`delete from hub_password_resets where token_hash = $1`, [hash]);
    throw new Error("That reset link has expired. Ask for a new one.");
  }
  const userId = String(rows[0].user_id);
  const hashed = await hashPassword(passwordTrim);
  const now = new Date().toISOString();
  const accounts = await sql.query<{ id: string }>(
    `select id from account where "userId" = $1 and "providerId" = $2 limit 1`,
    [userId, "credential"],
  );
  const firstPassword = !accounts[0]?.id;
  if (accounts[0]?.id) {
    await sql.query(`update account set password = $1, "updatedAt" = $2 where id = $3`, [
      hashed,
      now,
      String(accounts[0].id),
    ]);
  } else {
    await sql.query(
      `insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [crypto.randomUUID(), userId, "credential", userId, hashed, now, now],
    );
  }
  await sql.query(`delete from hub_password_resets where user_id = $1`, [userId]);
  await sql.query(`delete from session where "userId" = $1`, [userId]);
  if (firstPassword) {
    const who = await sql.query<{ email: string; name: string }>(
      `select email, name from "user" where id = $1 limit 1`,
      [userId],
    );
    const email = String(who[0]?.email ?? "").trim();
    const name = String(who[0]?.name ?? "").trim();
    if (email.includes("@")) {
      try {
        const { startEmailVerification } = await import("@/lib/hub-guard");
        await startEmailVerification(userId, email, true);
      } catch {
        try {
          await sendHubMail(
            email,
            "Your Gypsy Jazz Hub password is set",
            [
              `Hi${name ? ` ${name}` : ""},`,
              "",
              "Your password is saved. Sign in with your email and that password:",
              "https://www.gypsyjazzhub.com/login",
              "",
              "Gypsy Jazz Hub",
            ].join("\n"),
          );
        } catch {
          /* password is saved even if mail fails */
        }
      }
    }
  }
  return { ok: true as const };
}
