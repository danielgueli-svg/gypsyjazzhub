import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { toIso } from "@/lib/utils";

export const SUBSCRIPTION_KINDS = [
  "musician",
  "legend",
  "concert",
  "jam",
  "country",
  "festival",
  "venue",
] as const;

export type SubscriptionKind = (typeof SUBSCRIPTION_KINDS)[number];

export type Subscription = {
  kind: SubscriptionKind;
  targetId: string;
  targetName: string;
  createdAt: string;
};

function parseKind(raw: string): SubscriptionKind | null {
  return (SUBSCRIPTION_KINDS as readonly string[]).includes(raw)
    ? (raw as SubscriptionKind)
    : null;
}

let ready: Promise<void> | null = null;

export async function ensureSubscriptionTables() {
  ready ??= (async () => {
    const sql = await getSql();
    await sql.query(`
      create table if not exists hub_subscriptions (
        user_id text not null,
        kind text not null,
        target_id text not null,
        target_name text not null default '',
        created_at timestamptz not null default now(),
        primary key (user_id, kind, target_id)
      )
    `);
    await sql.query(`create index if not exists hub_subscriptions_user_idx on hub_subscriptions (user_id)`);
    await sql.query(`create index if not exists hub_subscriptions_kind_idx on hub_subscriptions (kind)`);
    try {
      await sql.query(`alter table profiles add column if not exists profile_types text not null default ''`);
    } catch {
      /* profiles table is optional on Workers */
    }
    try {
      await sql.query(`
        insert into hub_subscriptions (user_id, kind, target_id, target_name)
        select user_id,
          case when artist_kind = 'musician' then 'musician' else 'legend' end,
          artist_slug,
          artist_name
        from hub_alert_follows
        on conflict do nothing
      `);
    } catch {
      /* alert tables may not exist yet */
    }
    try {
      await sql.query(`
        insert into hub_subscriptions (user_id, kind, target_id, target_name)
        select user_id, 'country', country, country
        from hub_country_follows
        on conflict do nothing
      `);
    } catch {
      /* country follows may not exist yet */
    }
  })();
  try {
    await ready;
  } catch (err) {
    ready = null;
    throw err;
  }
}

export async function loadSubscriptions(userId: string): Promise<Subscription[]> {
  await ensureSubscriptionTables();
  const sql = await getSql();
  const rows = await sql<{
    kind: string;
    target_id: string;
    target_name: string;
    created_at: unknown;
  }>`
    select kind, target_id, target_name, created_at
    from hub_subscriptions
    where user_id = ${userId}
    order by created_at desc
  `;
  return rows
    .map((row) => {
      const kind = parseKind(row.kind);
      if (!kind) return null;
      return {
        kind,
        targetId: row.target_id,
        targetName: row.target_name || row.target_id,
        createdAt: toIso(row.created_at),
      } satisfies Subscription;
    })
    .filter((row): row is Subscription => Boolean(row));
}

export async function upsertSubscription(
  userId: string,
  input: { kind: SubscriptionKind; targetId: string; targetName?: string },
) {
  await ensureSubscriptionTables();
  const targetId = input.targetId.trim();
  if (!targetId) return;
  const sql = await getSql();
  await sql`
    insert into hub_subscriptions (user_id, kind, target_id, target_name)
    values (${userId}, ${input.kind}, ${targetId}, ${(input.targetName ?? "").trim() || targetId})
    on conflict (user_id, kind, target_id) do update set
      target_name = excluded.target_name
  `;
}

export async function deleteSubscription(
  userId: string,
  input: { kind: SubscriptionKind; targetId: string },
) {
  await ensureSubscriptionTables();
  const sql = await getSql();
  await sql`
    delete from hub_subscriptions
    where user_id = ${userId} and kind = ${input.kind} and target_id = ${input.targetId.trim()}
  `;
}

export async function isSubscribed(
  userId: string,
  kind: SubscriptionKind,
  targetId: string,
) {
  await ensureSubscriptionTables();
  const sql = await getSql();
  const rows = await sql<{ n: number }>`
    select 1 as n from hub_subscriptions
    where user_id = ${userId} and kind = ${kind} and target_id = ${targetId}
    limit 1
  `;
  return Boolean(rows[0]);
}

export const listMySubscriptions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadSubscriptions(context.userId));

export const getSubscriptionState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { kind: SubscriptionKind; targetId: string }) => input)
  .handler(async ({ context, data }) =>
    isSubscribed(context.userId, data.kind, data.targetId.trim()),
  );

export const toggleSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: SubscriptionKind; targetId: string; targetName?: string }) => input)
  .handler(async ({ context, data }) => {
    const targetId = data.targetId.trim();
    if (!targetId) return { subscribed: false };
    const on = await isSubscribed(context.userId, data.kind, targetId);
    if (on) {
      await deleteSubscription(context.userId, { kind: data.kind, targetId });
      return { subscribed: false };
    }
    await upsertSubscription(context.userId, {
      kind: data.kind,
      targetId,
      targetName: data.targetName,
    });
    return { subscribed: true };
  });

export function subscriptionLabel(kind: SubscriptionKind) {
  if (kind === "musician") return "Musician";
  if (kind === "legend") return "Legend";
  if (kind === "concert") return "Concert";
  if (kind === "jam") return "Jam session";
  if (kind === "country") return "Country";
  if (kind === "festival") return "Festival";
  return "Venue";
}
