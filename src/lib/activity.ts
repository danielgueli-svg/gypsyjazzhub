import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { latestNews } from "@/lib/music";
import { toIso } from "@/lib/utils";

export type ActivityItem = {
  id: string;
  kind: string;
  title: string;
  who: string;
  href: string;
  when: string;
};

export const listPublicActivity = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const items: ActivityItem[] = [];

  try {
    const jams = await sql<{ slug: string; name: string; submitted_name: string; created_at: unknown }>`
      select slug, name, submitted_name, created_at from hub_jams
      where coalesce(status, 'published') = 'published'
      order by created_at desc limit 8
    `;
    for (const row of jams) {
      items.push({
        id: `jam-${row.slug}`,
        kind: "jam",
        title: `added a jam: ${row.name}`,
        who: row.submitted_name || "Someone",
        href: `/jams/${row.slug}`,
        when: toIso(row.created_at),
      });
    }
  } catch {
    /* table may not exist yet */
  }

  try {
    const concerts = await sql<{
      id: number;
      title: string;
      artist_name: string;
      submitted_name: string;
      created_at: unknown;
    }>`
      select id, title, artist_name, submitted_name, created_at from hub_concerts
      where coalesce(status, 'published') = 'published'
      order by created_at desc limit 8
    `;
    for (const row of concerts) {
      items.push({
        id: `concert-${row.id}`,
        kind: "concert",
        title: `posted ${row.artist_name} — ${row.title}`,
        who: row.submitted_name || "Someone",
        href: "/concerts",
        when: toIso(row.created_at),
      });
    }
  } catch {
    /* ignore */
  }

  try {
    const artists = await sql<{ slug: string; display_name: string; created_at: unknown }>`
      select slug, display_name, created_at from profiles
      where coalesce(member_kind, 'musician') <> 'fan'
      order by created_at desc limit 6
    `;
    for (const row of artists) {
      items.push({
        id: `artist-${row.slug}`,
        kind: "artist",
        title: `made a page: ${row.display_name}`,
        who: row.display_name,
        href: `/musicians/${row.slug}`,
        when: toIso(row.created_at),
      });
    }
  } catch {
    /* ignore */
  }

  for (const news of latestNews(4)) {
    items.push({
      id: `news-${news.slug}`,
      kind: news.kind === "album" ? "album" : "news",
      title: news.title,
      who: "The hub",
      href: "/news",
      when: news.date,
    });
  }

  return items
    .sort((a, b) => b.when.localeCompare(a.when))
    .slice(0, 12);
});
