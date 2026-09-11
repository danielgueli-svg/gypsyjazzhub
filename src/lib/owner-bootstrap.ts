import { hashPassword } from "@/lib/auth/email-password";
import { runDoSql } from "@/lib/do-sql";
import { readEnv } from "@/lib/runtime-env";

const OWNER_EMAIL = "danielgueli@mac.com";
const OWNER_NAME = "Daniel Gueli";

const FOUNDING_MEMBERS = [
  {
    name: "Marcia Bamberg",
    email: "mbamberg@kpnplanet.nl",
    country: "Netherlands",
    city: "Obdam",
    instruments: "vocal",
    slug: "marcia-bamberg",
  },
] as const;

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return crypto.randomUUID();
}

async function ensureFoundingMembers() {
  const now = nowIso();
  for (const member of FOUNDING_MEMBERS) {
    const email = member.email.toLowerCase();
    const existing = await runDoSql(
      `select id from "user" where lower(email) = $1 limit 1`,
      [email],
    );
    let userId = String(existing[0]?.id ?? "");
    if (!userId) {
      const byName = await runDoSql(
        `select id from "user" where lower(replace(name, ' ', '')) like $1 limit 1`,
        [`%${member.name.toLowerCase().replace(/\s/g, "")}%`],
      );
      userId = String(byName[0]?.id ?? "");
    }
    if (!userId) {
      userId = newId();
      const hash = await hashPassword(`${newId()}${newId()}`);
      await runDoSql(
        `insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
         values ($1, $2, $3, $4, $5, $6)`,
        [userId, member.name, email, 1, now, now],
      );
      await runDoSql(
        `insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
         values ($1, $2, $3, $4, $5, $6, $7)`,
        [newId(), userId, "credential", userId, hash, now, now],
      );
    } else {
      await runDoSql(
        `update "user" set name = $1, "emailVerified" = 1, "updatedAt" = $2 where id = $3`,
        [member.name, now, userId],
      );
    }
    try {
      await runDoSql(
        `insert into hub_members (user_id, email, verified)
         values ($1, $2, 1)
         on conflict (user_id) do update set email = excluded.email, verified = 1`,
        [userId, email],
      );
    } catch {
      /* hub_members may not exist yet */
    }
    await runDoSql(
      `insert into profiles (user_id, slug, display_name, city, country, instruments, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       on conflict (user_id) do update set
         display_name = excluded.display_name,
         city = excluded.city,
         country = excluded.country,
         instruments = excluded.instruments,
         updated_at = excluded.updated_at`,
      [userId, member.slug, member.name, member.city, member.country, member.instruments, now, now],
    ).catch(() => undefined);
  }
}

/** Create the owner email login once. Do not re-hash on every Worker boot. */
export async function ensureOwnerAccount() {
  try {
    const password = readEnv("OWNER_PASSWORD");
    if (password && password.length >= 8) {
      await restoreOwnerLogin(password);
    }
  } finally {
    await ensureFoundingMembers().catch(() => undefined);
  }
}

async function restoreOwnerLogin(password: string) {
  const email = OWNER_EMAIL.toLowerCase();
  const now = nowIso();
  const users = await runDoSql(
    `select id from "user" where lower(email) = $1 limit 1`,
    [email],
  );
  let userId = String(users[0]?.id ?? "");
  const reset = Boolean(readEnv("OWNER_PASSWORD_RESET"));
  if (userId) {
    const accounts = await runDoSql(
      `select id, password from account where "userId" = $1 and "providerId" = $2 limit 1`,
      [userId, "credential"],
    );
    const hasPassword = Boolean(accounts[0]?.password);
    if (hasPassword && !reset) {
      await runDoSql(
        `create table if not exists hub_owners (
          user_id text primary key,
          claimed_at timestamptz not null default now()
        )`,
      );
      await runDoSql(
        `insert into hub_owners (user_id, claimed_at) values ($1, $2)
         on conflict (user_id) do nothing`,
        [userId, now],
      );
      return;
    }
    await runDoSql(
      `update "user" set "emailVerified" = 1, name = $1, "updatedAt" = $2 where id = $3`,
      [OWNER_NAME, now, userId],
    );
    const hash = await hashPassword(password);
    if (accounts[0]?.id) {
      await runDoSql(
        `update account set password = $1, "updatedAt" = $2 where id = $3`,
        [hash, now, String(accounts[0].id)],
      );
    } else {
      await runDoSql(
        `insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
         values ($1, $2, $3, $4, $5, $6, $7)`,
        [newId(), userId, "credential", userId, hash, now, now],
      );
    }
  } else {
    userId = newId();
    const hash = await hashPassword(password);
    await runDoSql(
      `insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
       values ($1, $2, $3, $4, $5, $6)`,
      [userId, OWNER_NAME, email, 1, now, now],
    );
    await runDoSql(
      `insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [newId(), userId, "credential", userId, hash, now, now],
    );
  }
  await runDoSql(
    `create table if not exists hub_owners (
      user_id text primary key,
      claimed_at timestamptz not null default now()
    )`,
  );
  await runDoSql(
    `insert into hub_owners (user_id, claimed_at) values ($1, $2)
     on conflict (user_id) do nothing`,
    [userId, now],
  );
}