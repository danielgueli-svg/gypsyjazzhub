import { createServerFn } from "@tanstack/react-start";
import { CAMPS } from "@/lib/camps";
import { CIRCLE_ARTISTS, CIRCLE_CONCERTS } from "@/lib/circle-artists";
import { FESTIVALS } from "@/lib/festivals";
import { JAMS } from "@/lib/jams";
import { NEWS } from "@/lib/music-news";
import type { TickerNews, TickerPayload, TickerStat } from "@/lib/ticker";

function countryFromHref(href: string) {
  const fest = href.match(/\/festivals\/([^/?#]+)/);
  if (fest) return FESTIVALS.find((row) => row.slug === fest[1])?.country;
  const camp = href.match(/\/learn\/([^/?#]+)/);
  if (camp) return CAMPS.find((row) => row.slug === camp[1])?.country;
}

function countryFromNews(item: { href?: string; artistSlugs?: string[] }) {
  const href = item.href || "";
  const fromHref = countryFromHref(href);
  if (fromHref) return fromHref;
  const slug = item.artistSlugs?.[0];
  if (!slug) return;
  return CIRCLE_ARTISTS.find((row) => row.slug === slug)?.origin;
}

function uniqueUpcomingConcerts(now: number) {
  const keys = new Set<string>();
  for (const row of CIRCLE_CONCERTS) {
    if (row.is_historic) continue;
    const at = Date.parse(row.starts_at);
    if (!Number.isFinite(at) || at < now) continue;
    keys.add(`${row.starts_at.slice(0, 10)}|${row.venue}|${row.title}`);
  }
  return keys.size;
}

export function tickerPayload(now = Date.now()): TickerPayload {
  const stats: TickerStat[] = [
    { id: "jams", href: "/jams", key: "ticker.jams", n: JAMS.length },
    { id: "camps", href: "/learn", hash: "camps", key: "ticker.camps", n: CAMPS.length },
    { id: "concerts", href: "/concerts", key: "ticker.concerts", n: uniqueUpcomingConcerts(now) },
    { id: "artists", href: "/musicians", key: "ticker.artists", n: CIRCLE_ARTISTS.length },
  ];

  const news: TickerNews[] = [];
  const from = now - 4 * 86_400_000;
  const to = now + 3 * 86_400_000;
  for (const festival of FESTIVALS) {
    const at = Date.parse(festival.nextStartsAt);
    if (!Number.isFinite(at) || at < from || at > to) continue;
    news.push({
      id: `fest-${festival.slug}`,
      href: `/festivals/${festival.slug}`,
      name: festival.name,
      country: festival.country,
      kind: "weekend",
    });
  }
  for (const item of NEWS.slice(0, 4)) {
    const href = item.href || `/news/${item.slug}`;
    news.push({
      id: `news-${item.slug}`,
      href,
      slug: item.slug,
      country: countryFromNews(item),
      kind: "news",
    });
  }
  return { stats, news };
}

export const getTicker = createServerFn({ method: "GET" }).handler(async () => tickerPayload());
