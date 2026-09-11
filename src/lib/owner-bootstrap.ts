import { hashPassword } from "@/lib/auth/email-password";
import { runDoSql } from "@/lib/do-sql";
import { readEnv } from "@/lib/runtime-env";

const OWNER_EMAIL = "danielgueli@mac.com";
const OWNER_NAME = "Daniel Gueli";

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return crypto.randomUUID();
}

/** Create the owner email login once. Do not re-hash on every Worker boot. */
export async function ensureOwnerAccount() {
  const password = readEnv("OWNER_PASSWORD");
  if (!password || password.length < 8) return;
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
