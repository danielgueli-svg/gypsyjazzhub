import { getSql } from "@/lib/db";
import { ARTIST_TOUR_SITES, parseArtistPage } from "@/lib/artist-sites";
import { syncDiscoveries } from "@/lib/discovery-api";
import type { ScanFind } from "@/lib/discovery";

export type ArtistRun = {
  fetched: number;
  parsed: number;
  ingested: number;
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
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

export async function runArtistImport(): Promise<ArtistRun> {
  await ensureLog();
  const sites: ArtistRun["sites"] = [];
  const live: ScanFind[] = [];
  const seen = new Set<string>();

  for (const site of ARTIST_TOUR_SITES) {
    try {
      const html = await fetchText(site.url);
      const finds = html ? parseArtistPage(html, site) : [];
      let events = 0;
      for (const find of finds) {
        const key = `${find.title}|${find.startsAt.slice(0, 10)}|${find.venue}`.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        live.push(find);
        events += 1;
      }
      sites.push({ name: site.name, url: site.url, ok: Boolean(html), events });
    } catch {
      sites.push({ name: site.name, url: site.url, ok: false, events: 0 });
    }
  }

  await syncDiscoveries(live);

  const sql = await getSql();
  const detail = [
    ...sites.map((row) => `${row.name}: ${row.ok ? `${row.events} dates` : "no fetch"}`),
    ...live.slice(0, 8).map((find) => find.title),
  ].join(" · ");
  await sql`
    insert into hub_artist_runs (fetched, parsed, detail)
    values (${sites.filter((row) => row.ok).length}, ${live.length}, ${detail})
  `;

  return {
    fetched: sites.filter((row) => row.ok).length,
    parsed: live.length,
    ingested: live.length,
    sites,
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
