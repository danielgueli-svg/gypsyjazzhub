import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { toIso } from "@/lib/utils";

export type GuestbookEntry = {
  id: number;
  artistSlug: string;
  body: string;
  authorName: string;
  userId: string;
  createdAt: string;
};

const MIN_BODY = 4;
const MAX_BODY = 600;

const SEED: { slug: string; name: string; body: string; at: string }[] = [
  {
    slug: "django-reinhardt",
    name: "Clara M.",
    body: "Played Minor Swing at the kitchen table with my dad when I was twelve. Still the first tune I teach. Merci, Django.",
    at: "2026-08-12T18:20:00.000Z",
  },
  {
    slug: "django-reinhardt",
    name: "Jan V.",
    body: "We leave a chair empty at the Utrecht jam when Nuages starts. The room always goes still.",
    at: "2026-08-03T20:05:00.000Z",
  },
  {
    slug: "django-reinhardt",
    name: "Élodie",
    body: "Walked up to the grave in Samois last summer. Left a pick. The village still feels like he just stepped out.",
    at: "2026-07-21T15:40:00.000Z",
  },
  {
    slug: "stephane-grappelli",
    name: "Tim K.",
    body: "The bow never hurries. I put on Sweet Chorus when I need to remember that.",
    at: "2026-08-08T11:10:00.000Z",
  },
  {
    slug: "bireli-lagrene",
    name: "Marc",
    body: "Saw you in Strasbourg — the electric set melted the room and the acoustic encore put it back together. Bravo.",
    at: "2026-08-15T22:30:00.000Z",
  },
  {
    slug: "stochelo-rosenberg",
    name: "Sophie",
    body: "Your tone is the reason I bought a Selmer copy. Still chasing that first note of I Can't Give You Anything But Love.",
    at: "2026-08-01T19:00:00.000Z",
  },
  {
    slug: "angelo-debarre",
    name: "Léo",
    body: "Thank you for the workshop in Arles. I went home and finally understood the pompe. The book is for everyone who was in that room.",
    at: "2026-07-28T16:45:00.000Z",
  },
];

async function ensureGuestbook() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists artist_guestbook (
      id serial primary key,
      artist_slug text not null,
      body text not null,
      user_id text not null,
      author_name text not null,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(
    `create index if not exists artist_guestbook_slug_idx on artist_guestbook (artist_slug, created_at desc)`,
  );
  const existing = await sql<{ n: number }>`
    select count(*)::int as n from artist_guestbook
  `;
  if ((existing[0]?.n ?? 0) > 0) return;
  for (const row of SEED) {
    await sql`
      insert into artist_guestbook (artist_slug, body, user_id, author_name, created_at)
      values (${row.slug}, ${row.body}, ${"guestbook-seed"}, ${row.name}, ${row.at})
    `;
  }
}

async function authorName(userId: string) {
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

function mapEntry(row: {
  id: number;
  artist_slug: string;
  body: string;
  author_name: string;
  user_id: string;
  created_at: unknown;
}): GuestbookEntry {
  return {
    id: row.id,
    artistSlug: row.artist_slug,
    body: row.body,
    authorName: row.author_name,
    userId: row.user_id,
    createdAt: toIso(row.created_at),
  };
}

export const listGuestbook = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureGuestbook();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      artist_slug: string;
      body: string;
      author_name: string;
      user_id: string;
      created_at: unknown;
    }>`
      select id, artist_slug, body, author_name, user_id, created_at
      from artist_guestbook
      where artist_slug = ${slug}
      order by created_at desc
    `;
    return rows.map(mapEntry);
  });

export const addGuestbook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { artistSlug: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureGuestbook();
    const slug = data.artistSlug.trim();
    const body = data.body.trim();
    if (!slug) throw new Error("Missing musician.");
    if (body.length < MIN_BODY) throw new Error("Write a little more — a sentence is enough.");
    if (body.length > MAX_BODY) throw new Error(`Keep it under ${MAX_BODY} characters.`);
    const sql = await getSql();
    const musician = await sql<{ slug: string }>`
      select slug from profiles where slug = ${slug} limit 1
    `;
    const legend = musician[0]
      ? []
      : await sql<{ slug: string }>`
          select slug from legends where slug = ${slug} limit 1
        `;
    if (!musician[0] && !legend[0]) throw new Error("That musician is not on the hub.");
    const recent = await sql<{ body: string; created_at: unknown }>`
      select body, created_at from artist_guestbook
      where user_id = ${context.userId} and artist_slug = ${slug}
      order by created_at desc
      limit 1
    `;
    if (recent[0]?.body === body) throw new Error("You already left that shout-out.");
    const name = await authorName(context.userId);
    await sql`
      insert into artist_guestbook (artist_slug, body, user_id, author_name)
      values (${slug}, ${body}, ${context.userId}, ${name})
    `;
    return { ok: true as const };
  });
