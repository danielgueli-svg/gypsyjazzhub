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
  const seeded = await sql<{ n: number }>`
    select count(*)::int as n from hub_board where user_id = 'hub-seed'
  `;
  if ((seeded[0]?.n ?? 0) > 0) return;
  const seeds: { kind: BoardKind; title: string; body: string; city: string; country: string; at: string }[] = [
    {
      kind: "looking",
      title: "Rhythm guitar needed Tuesday at The Hum",
      body: "London — need a rhythm guitar Tuesday at The Hum, Stoke Newington. Pompe that sits in the pocket. Two guitars and bass already have the chairs.",
      city: "London",
      country: "United Kingdom",
      at: "2026-08-18T19:10:00.000Z",
    },
    {
      kind: "charts",
      title: "Looking for a Minor Swing chart",
      body: "Barcelona — does anyone have a clean Minor Swing chart (changes + a simple head) I can bring to the jam this week?",
      city: "Barcelona",
      country: "Spain",
      at: "2026-08-19T10:40:00.000Z",
    },
    {
      kind: "venue",
      title: "Chair free Wednesday at Turia Bistro",
      body: "Valencia — one chair free Wednesday at Turia Bistro. Acoustic, small room, they like the Hot Club repertoire.",
      city: "Valencia",
      country: "Spain",
      at: "2026-08-20T16:05:00.000Z",
    },
    {
      kind: "looking",
      title: "Looking for a violin at A-Trane",
      body: "Berlin — looking for a violin who knows the language at A-Trane. Sit-in after the house set if the room allows it.",
      city: "Berlin",
      country: "Germany",
      at: "2026-08-21T12:20:00.000Z",
    },
    {
      kind: "other",
      title: "Macclesfield last Wednesday — anyone driving from Manchester?",
      body: "Last-Wednesday jam in Macclesfield. Is anyone driving from Manchester and has a seat?",
      city: "Macclesfield",
      country: "United Kingdom",
      at: "2026-08-22T08:55:00.000Z",
    },
    {
      kind: "other",
      title: "Sydney Rio session — is there parking?",
      body: "First time at the Rio session in Sydney. Is there parking, or should I come by train?",
      city: "Sydney",
      country: "Australia",
      at: "2026-08-23T07:15:00.000Z",
    },
    {
      kind: "other",
      title: "First jam — which 3 tunes should I have?",
      body: "First jam this month. Which three tunes should I have under my fingers so I am not a passenger?",
      city: "",
      country: "",
      at: "2026-08-24T14:00:00.000Z",
    },
  ];
  for (const row of seeds) {
    await sql`
      insert into hub_board (kind, title, body, city, country, user_id, author_name, status, created_at)
      values (
        ${row.kind}, ${row.title}, ${row.body}, ${row.city}, ${row.country},
        ${"hub-seed"}, ${"Circle"}, ${"published"}, ${row.at}
      )
    `;
  }
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
