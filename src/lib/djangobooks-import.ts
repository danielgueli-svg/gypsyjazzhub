import { getSql } from "@/lib/db";
import {
  DJANGOBOOKS_BOARDS,
  parseDjangoBooksPost,
  threadUrlsFromHtml,
  type ForumKind,
} from "@/lib/djangobooks";
import { syncDiscoveries } from "@/lib/discovery-api";
import type { ScanFind } from "@/lib/discovery";

export type DjangoBooksRun = {
  fetched: number;
  parsed: number;
  ingested: number;
  boards: { name: string; url: string; ok: boolean; threads: number }[];
  scannedAt: string;
};

async function ensureLog() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_djangobooks_runs (
      id serial primary key,
      fetched integer not null default 0,
      parsed integer not null default 0,
      detail text not null default '',
      scanned_at timestamptz not null default now()
    )
  `);
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: {
      accept: "text/html",
      "user-agent": "Mozilla/5.0 (compatible; GypsyJazzHub/1.0; +https://gypsyjazzhub.com)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) return "";
  return res.text();
}

function stripHtml(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
}

function firstPost(html: string) {
  const og = html.match(/property="og:description"\s+content="([^"]+)"/i)?.[1] ?? "";
  const message =
    html.match(
      /<div[^>]*class="[^"]*(?:Message|userContent|Item-Body|Discussion)[^"]*"[^>]*>([\s\S]{20,5000}?)<\/div>/i,
    )?.[1] ?? "";
  const raw = `${og} ${message}`.trim() || html;
  return stripHtml(raw).replace(/\s+/g, " ").trim().slice(0, 4000);
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

export async function runDjangoBooksImport(): Promise<DjangoBooksRun> {
  await ensureLog();
  const boards: DjangoBooksRun["boards"] = [];
  const live: (ScanFind & { eventKind: ForumKind })[] = [];
  const seen = new Set<string>();

  for (const board of DJANGOBOOKS_BOARDS) {
    try {
      const html = await fetchText(board.url);
      const cap = board.slug === "discussions" ? 6 : 8;
      const urls = html ? threadUrlsFromHtml(html).slice(0, cap) : [];
      const parsed = await mapLimit(urls, 4, async (url) => {
        try {
          const page = await fetchText(url);
          if (!page) return null;
          const title =
            page.match(/<title>([^<]+)<\/title>/i)?.[1]?.replace(/\s+[—|].*$/, "") ?? "";
          return parseDjangoBooksPost(title, firstPost(page), url);
        } catch {
          return null;
        }
      });
      let threads = 0;
      for (const find of parsed) {
        if (!find) continue;
        const key = `${find.title}|${find.startsAt.slice(0, 10)}|${find.venue}`.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        live.push(find);
        threads += 1;
      }
      boards.push({ name: board.name, url: board.url, ok: Boolean(html), threads });
    } catch {
      boards.push({ name: board.name, url: board.url, ok: false, threads: 0 });
    }
  }

  await syncDiscoveries(live);

  const sql = await getSql();
  const detail = [
    ...boards.map((row) => `${row.name}: ${row.ok ? `${row.threads} threads` : "no fetch"}`),
    ...live.slice(0, 8).map((find) => `${find.eventKind} ${find.title}`),
  ].join(" · ");
  await sql`
    insert into hub_djangobooks_runs (fetched, parsed, detail)
    values (${boards.filter((row) => row.ok).length}, ${live.length}, ${detail})
  `;

  return {
    fetched: boards.filter((row) => row.ok).length,
    parsed: live.length,
    ingested: live.length,
    boards,
    scannedAt: new Date().toISOString(),
  };
}

export async function lastDjangoBooksRun() {
  await ensureLog();
  const sql = await getSql();
  const rows = await sql<{
    fetched: number;
    parsed: number;
    detail: string;
    scanned_at: unknown;
  }>`
    select fetched, parsed, detail, scanned_at
    from hub_djangobooks_runs
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
