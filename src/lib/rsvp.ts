import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type RsvpKind = "jam" | "concert";

export type RsvpPerson = {
  userId: string;
  name: string;
};

async function ensureRsvps() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_rsvps (
      user_id text not null,
      kind text not null,
      target_id text not null,
      display_name text not null default '',
      created_at timestamptz not null default now(),
      primary key (user_id, kind, target_id)
    )
  `);
  await sql.query(`create index if not exists hub_rsvps_target_idx on hub_rsvps (kind, target_id, created_at)`);
}

function parseKind(raw: string): RsvpKind | null {
  return raw === "jam" || raw === "concert" ? raw : null;
}

async function displayNameFor(userId: string) {
  const sql = await getSql();
  const profile = await sql<{ display_name: string }>`
    select display_name from profiles where user_id = ${userId} limit 1
  `;
  if (profile[0]?.display_name?.trim()) return profile[0].display_name.trim();
  const user = await sql<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  if (user[0]?.name?.trim()) return user[0].name.trim();
  if (user[0]?.email) return user[0].email.split("@")[0] ?? "Hub member";
  return "Hub member";
}

export const listRsvps = createServerFn({ method: "GET" })
  .validator((input: { kind: RsvpKind; targetId: string }) => input)
  .handler(async ({ data }) => {
    const kind = parseKind(data.kind);
    const targetId = data.targetId.trim();
    if (!kind || !targetId) return [] as RsvpPerson[];
    try {
    await ensureRsvps();
    const sql = await getSql();
    const rows = await sql<{ user_id: string; display_name: string }>`
      select user_id, display_name
      from hub_rsvps
      where kind = ${kind} and target_id = ${targetId}
      order by created_at asc
    `;
    return rows.map((row) => ({
      userId: row.user_id,
      name: row.display_name.trim() || "Hub member",
    })) satisfies RsvpPerson[];
    } catch (err) {
      console.error("listRsvps db failed", err);
      return [] as RsvpPerson[];
    }
  });

export const toggleRsvp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: RsvpKind; targetId: string; going?: boolean }) => input)
  .handler(async ({ context, data }) => {
    const kind = parseKind(data.kind);
    const targetId = data.targetId.trim();
    if (!kind || !targetId) return { going: false, people: [] as RsvpPerson[] };
    await ensureRsvps();
    const sql = await getSql();
    const existing = await sql<{ n: number }>`
      select 1 as n from hub_rsvps
      where user_id = ${context.userId} and kind = ${kind} and target_id = ${targetId}
      limit 1
    `;
    const wantOn = data.going ?? !existing[0];
    if (wantOn && !existing[0]) {
      const name = await displayNameFor(context.userId);
      await sql`
        insert into hub_rsvps (user_id, kind, target_id, display_name)
        values (${context.userId}, ${kind}, ${targetId}, ${name})
        on conflict do nothing
      `;
    } else if (!wantOn && existing[0]) {
      await sql`
        delete from hub_rsvps
        where user_id = ${context.userId} and kind = ${kind} and target_id = ${targetId}
      `;
    }
    const rows = await sql<{ user_id: string; display_name: string }>`
      select user_id, display_name
      from hub_rsvps
      where kind = ${kind} and target_id = ${targetId}
      order by created_at asc
    `;
    return {
      going: wantOn,
      people: rows.map((row) => ({
        userId: row.user_id,
        name: row.display_name.trim() || "Hub member",
      })),
    };
  });
