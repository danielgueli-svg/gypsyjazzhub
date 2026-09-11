import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, getDbSource } from "@/lib/db";
import { slugify, toIso } from "@/lib/utils";

export type ForumTopic = {
  slug: string;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  replies: number;
};

export type ForumPost = {
  id: number;
  body: string;
  authorName: string;
  createdAt: string;
};

async function ensureForum() {
  const sql = await getSql();
  if (getDbSource() !== "do") {
    try {
      await sql.query(`
        alter table hub_profiles add column if not exists artist_slug text not null default ''
      `);
    } catch {
      /* table may not exist on a fresh local db */
    }
  }
  await sql.query(`
    create table if not exists hub_forum_topics (
      id serial primary key,
      slug text not null unique,
      title text not null,
      body text not null,
      user_id text not null,
      author_name text not null,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_forum_posts (
      id serial primary key,
      topic_id integer not null references hub_forum_topics (id) on delete cascade,
      body text not null,
      user_id text not null,
      author_name text not null,
      created_at timestamptz not null default now()
    )
  `);
  try {
    await sql.query(`delete from hub_forum_posts where user_id = 'hub-seed'`);
    await sql.query(`delete from hub_forum_topics where user_id = 'hub-seed'`);
  } catch {
    /* empty db */
  }
  const have = await sql<{ slug: string }>`
    select slug from hub_forum_topics where slug = ${"welcome"} limit 1
  `;
  if (have[0]) return;
  await sql`
    insert into hub_forum_topics (slug, title, body, user_id, author_name)
    values (
      ${"welcome"},
      ${"Welcome to the hub"},
      ${"Welcome. This forum is for the circle — pompe, camps, charts, where to sit in. Anyone can read. Join to ask. I am Daniel. Glad you are here."},
      ${"hub-owner"},
      ${"Daniel Gueli"}
    )
    on conflict (slug) do nothing
  `;
}

async function authorName(userId: string) {
  const sql = await getSql();
  const chat = await sql<{ chat_name: string }>`
    select chat_name from hub_profiles where user_id = ${userId} limit 1
  `;
  if (chat[0]?.chat_name) return chat[0].chat_name;
  const profile = await sql<{ display_name: string }>`
    select display_name from profiles where user_id = ${userId} limit 1
  `;
  if (profile[0]?.display_name) return profile[0].display_name;
  const user = await sql<{ name: string }>`
    select name from "user" where id = ${userId} limit 1
  `;
  return user[0]?.name || "Hub member";
}

export const listForumTopics = createServerFn({ method: "GET" }).handler(async () => {
  try {
  await ensureForum();
  const sql = await getSql();
  const rows = await sql<{
    slug: string;
    title: string;
    body: string;
    author_name: string;
    created_at: unknown;
    replies: number;
  }>`
    select t.slug, t.title, t.body, t.author_name, t.created_at,
           (select count(*)::int from hub_forum_posts p where p.topic_id = t.id) as replies
    from hub_forum_topics t
    where trim(t.title) <> '' and trim(t.body) <> '' and t.slug <> 'israel'
    order by t.created_at desc
    limit 80
  `;
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    body: row.body,
    authorName: row.author_name,
    createdAt: toIso(row.created_at),
    replies: Number(row.replies),
  })) satisfies ForumTopic[];
  } catch (err) {
    console.error("listForumTopics db failed", err);
    return [] as ForumTopic[];
  }
});

export const getForumTopic = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
    await ensureForum();
    const sql = await getSql();
    const topics = await sql<{
      id: number;
      slug: string;
      title: string;
      body: string;
      author_name: string;
      created_at: unknown;
    }>`
      select id, slug, title, body, author_name, created_at
      from hub_forum_topics where slug = ${slug} limit 1
    `;
    const topic = topics[0];
    if (!topic) return null;
    const posts = await sql<{
      id: number;
      body: string;
      author_name: string;
      created_at: unknown;
    }>`
      select id, body, author_name, created_at
      from hub_forum_posts where topic_id = ${topic.id} order by created_at asc
    `;
    return {
      slug: topic.slug,
      title: topic.title,
      body: topic.body,
      authorName: topic.author_name,
      createdAt: toIso(topic.created_at),
      replies: posts.length,
      posts: posts.map((row) => ({
        id: row.id,
        body: row.body,
        authorName: row.author_name,
        createdAt: toIso(row.created_at),
      })) satisfies ForumPost[],
    };
    } catch (err) {
      console.error("getForumTopic db failed", err);
      return null;
    }
  });

export const addForumTopic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureForum();
    const title = data.title.trim();
    const body = data.body.trim();
    if (title.length < 4) throw new Error("Give the question a title.");
    if (body.length < 8) throw new Error("Write a bit more so people can help.");
    const sql = await getSql();
    let slug = slugify(title) || "topic";
    for (let i = 0; i < 20; i += 1) {
      const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
      const taken = await sql.query<{ n: number }>(
        "select 1 as n from hub_forum_topics where slug = $1 limit 1",
        [candidate],
      );
      if (!taken[0]) {
        slug = candidate;
        break;
      }
    }
    const name = await authorName(context.userId);
    await sql`
      insert into hub_forum_topics (slug, title, body, user_id, author_name)
      values (${slug}, ${title}, ${body}, ${context.userId}, ${name})
    `;
    return { slug };
  });

export const addForumPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureForum();
    const body = data.body.trim();
    if (body.length < 2) throw new Error("Write a reply.");
    const sql = await getSql();
    const topic = await sql<{ id: number }>`
      select id from hub_forum_topics where slug = ${data.slug} limit 1
    `;
    if (!topic[0]) throw new Error("That topic is gone.");
    const name = await authorName(context.userId);
    await sql`
      insert into hub_forum_posts (topic_id, body, user_id, author_name)
      values (${topic[0].id}, ${body}, ${context.userId}, ${name})
    `;
    return { ok: true };
  });
