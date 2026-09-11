import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { toIso } from "@/lib/utils";

export type BoardKind = "looking" | "charts" | "venue" | "other";

export type BoardPost = {
  id: number;
  kind: BoardKind;
  title: string;
  body: string;
  city: string;
  country: string;
  authorName: string;
  createdAt: string;
};

async function ensureBoard() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_board (
      id serial primary key,
      kind text not null default 'looking',
      title text not null,
      body text not null default '',
      city text not null default '',
      country text not null default '',
      user_id text not null,
      author_name text not null default '',
      status text not null default 'published',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`delete from hub_board where user_id = 'hub-seed'`);
  const have = await sql<{ id: number }>`
    select id from hub_board where user_id = ${"hub-owner"} limit 1
  `;
  if (have[0]) return;
  await sql`
    insert into hub_board (kind, title, body, city, country, user_id, author_name, status)
    values (
      ${"other"},
      ${"Welcome to the hub"},
      ${"Welcome. This board is for the circle — a chair, a chart, a lift to a jam, a room that wants a night. Post as yourself. I am Daniel. Glad you are here."},
      ${""},
      ${""},
      ${"hub-owner"},
      ${"Daniel Gueli"},
      ${"published"}
    )
  `;
}

async function authorName(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  const row = rows[0];
  if (row?.name?.trim()) return row.name.trim();
  if (row?.email) return row.email.split("@")[0] ?? "Hub member";
  return "Hub member";
}

export const listBoard = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureBoard();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      kind: string;
      title: string;
      body: string;
      city: string;
      country: string;
      author_name: string;
      created_at: unknown;
    }>`
      select id, kind, title, body, city, country, author_name, created_at
      from hub_board
      where coalesce(status, 'published') = 'published'
      order by created_at desc
      limit 80
    `;
    return rows.map((row) => ({
      id: row.id,
      kind: (["looking", "charts", "venue", "other"].includes(row.kind) ? row.kind : "other") as BoardKind,
      title: row.title,
      body: row.body,
      city: row.city,
      country: row.country,
      authorName: row.author_name,
      createdAt: toIso(row.created_at),
    })) satisfies BoardPost[];
  } catch (err) {
    console.error("listBoard db failed", err);
    return [] as BoardPost[];
  }
});

export const addBoardPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { kind: BoardKind; title: string; body: string; city: string; country: string }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureBoard();
    const title = data.title.trim();
    if (title.length < 4) throw new Error("Write a short title.");
    const kind: BoardKind = ["looking", "charts", "venue", "other"].includes(data.kind)
      ? data.kind
      : "other";
    const name = await authorName(context.userId);
    const sql = await getSql();
    await sql`
      insert into hub_board (kind, title, body, city, country, user_id, author_name, status)
      values (
        ${kind}, ${title}, ${data.body.trim()}, ${data.city.trim()}, ${data.country.trim()},
        ${context.userId}, ${name}, 'published'
      )
    `;
    return { ok: true as const };
  });
