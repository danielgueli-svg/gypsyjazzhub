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
  if (getDbSource() === "do") return;
  const sql = await getSql();
  await sql.query(`
    alter table hub_profiles add column if not exists artist_slug text not null default ''
  `);
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
  const topics = [
    {
      slug: "pompe-right-hand",
      title: "Pompe right hand — how hard do you hit?",
      body: "I can keep time but the pompe still sounds thin. Do you play from the wrist, and how much of the stroke is down vs the bounce? A short clip of what to listen for would help.",
      at: "2026-08-16T18:00:00.000Z",
    },
    {
      slug: "first-jam-setlist",
      title: "First jam setlist — which 3 tunes?",
      body: "Sitting in for the first time next week. Which three tunes should I have cold so I am not a passenger when they call the room?",
      at: "2026-08-18T09:30:00.000Z",
    },
    {
      slug: "violin-setup",
      title: "Violin setup for gypsy jazz",
      body: "Steel or gut, and how high is the action for this language? I play a bit of swing already and I do not want to fight the instrument at a jam.",
      at: "2026-08-19T15:10:00.000Z",
    },
    {
      slug: "420-charts-ireal",
      title: "Where to find 420 charts / iReal",
      body: "People mention the 420 gypsy-jazz charts and iReal. Where is the current file, and is there a set that matches what the jams actually call?",
      at: "2026-08-21T11:45:00.000Z",
    },
    {
      slug: "how-to-sit-in-at-a-trane",
      title: "How to sit in at A-Trane",
      body: "Berlin — first time at A-Trane. Do you talk to the house band before, or wait until they nod? What do they expect if you show up with a violin?",
      at: "2026-08-22T20:05:00.000Z",
    },
    {
      slug: "solo-guitar-rest-stroke",
      title: "Solo guitar rest-stroke — pick still bouncing off?",
      body: "I can play the notes of a Django chorus but the rest-stroke is not there yet. The pick flies off instead of landing on the next string. What should I listen for, and is a heavier pick the whole story?",
      at: "2026-08-17T10:00:00.000Z",
    },
    {
      slug: "solo-guitar-first-chorus",
      title: "Solo guitar — which chorus to copy first?",
      body: "Stochelo, Biréli, Joscho, Tchavolo — too many schools. If I sit in with three tunes, which one living chorus should I have cold so I am not mixing them?",
      at: "2026-08-17T10:05:00.000Z",
    },
    {
      slug: "rhythm-guitar-pompe-wrist",
      title: "Rhythm guitar pompe wrist — from the wrist or the arm?",
      body: "My pompe still sounds like strumming. Do you play the two-and-four from the wrist, and how much of the stroke is the mute after the chord?",
      at: "2026-08-16T18:10:00.000Z",
    },
    {
      slug: "rhythm-guitar-three-note",
      title: "Rhythm guitar — three-note grips or full six?",
      body: "Closed voicings keep ringing on my Selmer. Do you really leave strings out, and how do you mute so the bass still has the root?",
      at: "2026-08-16T18:20:00.000Z",
    },
    {
      slug: "violin-bow-swing",
      title: "Violin bow — swing or classical détaché?",
      body: "I come from classical. The gypsy jazz bow still sounds like an etude. Grappelli floated; I cannot hear the off-beat yet. What should I copy first?",
      at: "2026-08-19T15:20:00.000Z",
    },
    {
      slug: "bass-two-feel",
      title: "Double bass two-feel — when do you walk?",
      body: "Theme in two, walking choruses, back to two for the last theme — is that the whole arrangement? And how short should the notes be so the pompe still cracks?",
      at: "2026-08-20T12:00:00.000Z",
    },
    {
      slug: "bass-realist-setup",
      title: "Double bass — Realist or mic in a café?",
      body: "First sit-in with a pickup. Realist on the bridge foot, or a mic on the side? I do not want a disco sub under the guitar.",
      at: "2026-08-20T12:10:00.000Z",
    },
    {
      slug: "clarinet-sit-in",
      title: "Clarinet sit-in manners — unpack before they nod?",
      body: "I play clarinet and I do not want to be a second violin. Do you ask the host before you unpack, and how many choruses is polite on a first night?",
      at: "2026-08-20T16:00:00.000Z",
    },
    {
      slug: "clarinet-rostaing-model",
      title: "Clarinet — Rostaing or Giacomo Smith as the model?",
      body: "Hubert Rostaing is the old Quintette chair. Giacomo Smith sits opposite Mozes now. Which one should I copy for a café jam, and is saxophone the same book?",
      at: "2026-08-20T16:10:00.000Z",
    },
    {
      slug: "vocals-singer-key",
      title: "Singer key — G or C for Nuages at the jam?",
      body: "I want to sit in with vocals on Nuages, Si tu savais, Coquette, All of Me. Which keys do rooms actually call, and do I tell the host before the downbeat?",
      at: "2026-08-21T09:00:00.000Z",
    },
    {
      slug: "vocals-one-mic",
      title: "Vocals — one mic into the guitar amp?",
      body: "Small café, no PA. Do singers really share the Acus with the Selmer, or should I bring a stand and stay acoustic?",
      at: "2026-08-21T09:10:00.000Z",
    },
    {
      slug: "accordion-sit-in",
      title: "Accordion — too loud for a café jam?",
      body: "I play accordion (Loeffler / Paats chair). Do I amp, or is the box already enough? And do I drop out for the guitar chorus so we are not both in the midrange?",
      at: "2026-08-21T14:00:00.000Z",
    },
    {
      slug: "accordion-musette-then-swing",
      title: "Accordion — waltz first, then the pompe?",
      body: "Musette to open, then swing. Is that how the Dutch and Alsatian rooms still do it, or do I wait until they call a waltz?",
      at: "2026-08-21T14:10:00.000Z",
    },
    {
      slug: "mandolin-lead-chair",
      title: "Mandolin as a lead chair — same book as guitar?",
      body: "I play mandolin (Brazilian Hot Club rooms, Victor Angeleas). Do I take the theme like a guitar, and is tremolo a colour or the whole language?",
      at: "2026-08-21T15:00:00.000Z",
    },
    {
      slug: "mandolin-pompe",
      title: "Mandolin — leave the pompe to the guitar?",
      body: "Bluegrass chop vs gypsy jazz lead. If there is already a rhythm guitar, do I never chop two-and-four on mandolin?",
      at: "2026-08-21T15:10:00.000Z",
    },
    {
      slug: "piano-manouche-comping",
      title: "Piano — do not double the pompe?",
      body: "Café has a piano. If the guitar is already pumping, should I lay out, play melody, or light harmony? I do not want to fight the two-and-four.",
      at: "2026-08-21T16:00:00.000Z",
    },
    {
      slug: "piano-zakarian-arrangements",
      title: "Piano manouche — Zakarian’s La Gitane as a way in?",
      body: "Patil Zakarian arranges Tchan-Tchou and Django for solo piano. Is that the door if I am not a guitarist, or should I just learn the guitar changes first?",
      at: "2026-08-21T16:10:00.000Z",
    },
    {
      slug: "harmonica-chromatic-or-diatonic",
      title: "Harmonica — chromatic or a G Marine Band for Minor Swing?",
      body: "Yen-Hua Wang plays chromatic harmonica. Jason Ricci’s Minor Swing lesson is a G Hohner. Which harp do I bring to a jam so I am not a blues band?",
      at: "2026-08-21T17:00:00.000Z",
    },
    {
      slug: "harmonica-larry-adler",
      title: "Harmonica — which Django / Larry Adler tunes does the jam still call?",
      body: "Django recorded with Larry Adler. Which of those harmonica tunes actually get called, and do I take a chorus like a clarinet?",
      at: "2026-08-21T17:10:00.000Z",
    },
    {
      slug: "saxophone-cousin-of-clarinet",
      title: "Saxophone — same book as the clarinet?",
      body: "Alto saxophone player, first gypsy jazz jam. Is the book the same as Giacomo Smith’s clarinet chair, and do I wait if a clarinet is already there?",
      at: "2026-08-21T18:00:00.000Z",
    },
    {
      slug: "saxophone-clip-on",
      title: "Saxophone clip-on — DPA into the Acus?",
      body: "Small room, no horn PA. Saxophone clip-on into the guitar combo, or stay acoustic and sit further back?",
      at: "2026-08-21T18:10:00.000Z",
    },
  ];
  for (const topic of topics) {
    await sql`
      insert into hub_forum_topics (slug, title, body, user_id, author_name, created_at)
      values (
        ${topic.slug}, ${topic.title}, ${topic.body}, ${"hub-seed"}, ${"author" in topic ? topic.author : "Circle"}, ${topic.at}
      )
      on conflict (slug) do nothing
    `;
  }
  await sql`
    delete from hub_forum_topics
    where slug = ${"israel"}
       or trim(title) = ${""}
       or trim(body) = ${""}
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
