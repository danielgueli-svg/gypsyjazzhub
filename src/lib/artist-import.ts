import { getSql } from "@/lib/db";
import {
  ARTIST_TOUR_SITES,
  agendaFollowUrl,
  isCrawlableUrl,
  parseArtistPage,
  urlKey,
  venueEventFits,
  type CrawlTarget,
} from "@/lib/artist-sites";
import { syncDiscoveries } from "@/lib/discovery-api";
import type { ScanFind } from "@/lib/discovery";
import { CIRCLE_ARTISTS } from "@/lib/circle-artists";
import { FESTIVALS } from "@/lib/festivals";
import { CAMPS } from "@/lib/camps";
import { VENUES } from "@/lib/venues";
import { SCAN_SOURCES } from "@/lib/discovery";
import { slugify } from "@/lib/utils";

export type ArtistRun = {
  fetched: number;
  parsed: number;
  ingested: number;
  targets: number;
  sites: { name: string; url: string; ok: boolean; events: number }[];
  scannedAt: string;
};

async function ensureLog() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_artist_runs (
      id serial primary key,
      fetched integer not null default 0,
      parsed integer not null default 0,
      detail text not null default '',
      scanned_at timestamptz not null default now()
    )
  `);
}

async function fetchText(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        accept: "text/html",
        "user-agent": "Mozilla/5.0 (compatible; GypsyJazzHub/1.0; +https://gypsyjazzhub.com)",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      out[index] = await fn(items[index]!);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) || 1 }, () => worker()));
  return out;
}

function addTarget(list: CrawlTarget[], seen: Set<string>, target: CrawlTarget) {
  if (!isCrawlableUrl(target.url)) return;
  const key = urlKey(target.url);
  if (seen.has(key)) return;
  seen.add(key);
  list.push(target);
}

export function collectCrawlTargets(): CrawlTarget[] {
  const seen = new Set<string>();
  const list: CrawlTarget[] = [];
  for (const site of ARTIST_TOUR_SITES) addTarget(list, seen, site);

  for (const artist of CIRCLE_ARTISTS) {
    const url =
      "website_url" in artist && typeof artist.website_url === "string" ? artist.website_url.trim() : "";
    addTarget(list, seen, {
      slug: artist.slug,
      name: artist.name,
      url,
      parse: "jsonld",
      sourceKind: "artist_site",
      artistSlug: artist.slug,
    });
  }

  for (const festival of FESTIVALS) {
    addTarget(list, seen, {
      slug: festival.slug,
      name: festival.name,
      url: festival.site,
      parse: "jsonld",
      sourceKind: "festival_official",
      eventKind: "festival",
      festivalSlug: festival.slug,
      city: festival.city,
      country: festival.country,
      followAgenda: true,
    });
  }

  for (const camp of CAMPS) {
    addTarget(list, seen, {
      slug: camp.slug,
      name: `Camp · ${camp.name}`,
      url: camp.site,
      parse: "jsonld",
      sourceKind: "listing",
      eventKind: "festival",
      city: camp.city,
      country: camp.country,
      followAgenda: true,
    });
  }

  for (const venue of VENUES) {
    addTarget(list, seen, {
      slug: venue.slug,
      name: venue.name,
      url: venue.site,
      parse: "jsonld",
      sourceKind: "venue",
      city: venue.city,
      country: venue.country,
    });
  }

  for (const source of SCAN_SOURCES) {
    addTarget(list, seen, {
      slug: slugify(source.name),
      name: source.name,
      url: source.url,
      parse: "jsonld",
      sourceKind: "listing",
      followAgenda: true,
    });
  }

  return list;
}

function artistHints() {
  const names = new Set<string>();
  for (const artist of CIRCLE_ARTISTS) {
    const name = artist.name.trim().toLowerCase();
    if (name.length > 4) names.add(name);
    const last = name.split(/\s+/).pop() ?? "";
    if (last.length > 4) names.add(last);
  }
  return [...names];
}

export async function runArtistImport(): Promise<ArtistRun> {
  await ensureLog();
  const targets = collectCrawlTargets();
  const hints = artistHints();
  const live: ScanFind[] = [];
  const seen = new Set<string>();

  const rows = await mapLimit(targets, 8, async (site) => {
    try {
      let html = await fetchText(site.url);
      if (!html) return { name: site.name, url: site.url, ok: false, events: 0, finds: [] as ScanFind[] };
      let finds = parseArtistPage(html, site);
      if (finds.length === 0 && site.followAgenda) {
        const extra = agendaFollowUrl(html, site.url);
        if (extra) {
          const next = await fetchText(extra);
          if (next) finds = parseArtistPage(next, { ...site, url: extra });
        }
      }
      if (site.sourceKind === "venue") {
        finds = finds.filter((find) => venueEventFits(find.title, hints));
      }
      return { name: site.name, url: site.url, ok: true, events: finds.length, finds };
    } catch {
      return { name: site.name, url: site.url, ok: false, events: 0, finds: [] as ScanFind[] };
    }
  });

  const sites = rows.map((row) => ({
    name: row.name,
    url: row.url,
    ok: row.ok,
    events: row.events,
  }));

  for (const row of rows) {
    for (const find of row.finds) {
      const key = `${find.title}|${find.startsAt.slice(0, 10)}|${find.venue}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      live.push(find);
    }
  }

  await syncDiscoveries(live);

  const sql = await getSql();
  const hits = sites.filter((row) => row.events > 0);
  const detail = [
    `${targets.length} urls`,
    `${sites.filter((row) => row.ok).length} fetched`,
    `${live.length} dates`,
    ...hits.slice(0, 12).map((row) => `${row.name}: ${row.events}`),
    ...live.slice(0, 8).map((find) => find.title),
  ].join(" · ");
  await sql`
    insert into hub_artist_runs (fetched, parsed, detail)
    values (${sites.filter((row) => row.ok).length}, ${live.length}, ${detail.slice(0, 4000)})
  `;

  return {
    fetched: sites.filter((row) => row.ok).length,
    parsed: live.length,
    ingested: live.length,
    targets: targets.length,
    sites: hits.length ? hits : sites.slice(0, 12),
    scannedAt: new Date().toISOString(),
  };
}

export async function lastArtistRun() {
  await ensureLog();
  const sql = await getSql();
  const rows = await sql<{
    fetched: number;
    parsed: number;
    detail: string;
    scanned_at: unknown;
  }>`
    select fetched, parsed, detail, scanned_at
    from hub_artist_runs
    order by scanned_at desc
    limit 1
  `;
  return rows[0]
    ? {
        fetched: rows[0].fetched,
        parsed: rows[0].parsed,
        detail: rows[0].detail,
        scannedAt: String(rows[0].scanned_at),
      }
    : null;
}
