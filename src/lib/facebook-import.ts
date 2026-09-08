import { getSql } from "@/lib/db";
import { FACEBOOK_GROUPS, parseFacebookPost } from "@/lib/facebook-groups";
import { syncDiscoveries } from "@/lib/discovery-api";

export type FacebookRun = {
  fetched: number;
  parsed: number;
  groups: { name: string; url: string; ok: boolean; posts: number }[];
  scannedAt: string;
};

async function ensureFacebookLog() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_facebook_runs (
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
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return "";
  return res.text();
}

function postUrls(html: string, groupUrl: string) {
  const found = new Set<string>([groupUrl]);
  const re = /https?:\/\/(?:www\.)?facebook\.com\/(?:groups\/[^"'\\\s]+\/posts\/\d+|permalink\.php\?story_fbid=\d+[^"'\\\s]*|[^"'\\\s]+\/posts\/[^"'\\\s]+)/gi;
  for (const match of html.match(re) ?? []) {
    found.add(match.replace(/[\\>]+$/, ""));
  }
  return [...found];
}

export async function runFacebookImport(): Promise<FacebookRun> {
  await ensureFacebookLog();
  const groups: FacebookRun["groups"] = [];
  let parsed = 0;

  for (const group of FACEBOOK_GROUPS) {
    try {
      const html = await fetchText(group.url);
      const urls = html ? postUrls(html, group.url) : [group.url];
      let posts = 0;
      for (const url of urls.slice(0, 8)) {
        const body = url === group.url ? html : (await fetchText(url)) || html;
        const find = parseFacebookPost(body.replace(/<[^>]+>/g, " "), group, url);
        if (find) posts += 1;
      }
      parsed += posts;
      groups.push({ name: group.name, url: group.url, ok: Boolean(html), posts });
    } catch {
      groups.push({ name: group.name, url: group.url, ok: false, posts: 0 });
    }
  }

  await syncDiscoveries();

  const sql = await getSql();
  const detail = groups
    .map((row) => `${row.name}: ${row.ok ? `${row.posts} public posts` : "login wall"}`)
    .join(" · ");
  await sql`
    insert into hub_facebook_runs (fetched, parsed, detail)
    values (${groups.filter((row) => row.ok).length}, ${parsed}, ${detail})
  `;

  return {
    fetched: groups.filter((row) => row.ok).length,
    parsed,
    groups,
    scannedAt: new Date().toISOString(),
  };
}

export async function lastFacebookRun() {
  await ensureFacebookLog();
  const sql = await getSql();
  const rows = await sql<{
    fetched: number;
    parsed: number;
    detail: string;
    scanned_at: unknown;
  }>`
    select fetched, parsed, detail, scanned_at
    from hub_facebook_runs
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
