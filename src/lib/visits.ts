import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

function visitorId(raw: unknown) {
  const id = typeof raw === "string" ? raw.trim() : "";
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(id)) throw new Error("Bad visitor id");
  return id;
}

function amsterdamDay(at = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function sinceDay(days: number) {
  return amsterdamDay(new Date(Date.now() - days * 86_400_000));
}

async function ensureVisits() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_visits (
      day date not null,
      visitor_id text not null,
      hits int not null default 1,
      first_at timestamptz not null default now(),
      last_at timestamptz not null default now(),
      primary key (day, visitor_id)
    )
  `);
}

export const pingVisit = createServerFn({ method: "POST" })
  .validator(visitorId)
  .handler(async ({ data: id }) => {
    try {
      await ensureVisits();
      const sql = await getSql();
      const day = amsterdamDay();
      const now = new Date().toISOString();
      await sql`
        insert into hub_visits (day, visitor_id, hits, last_at)
        values (${day}, ${id}, 1, ${now})
        on conflict (day, visitor_id) do update
          set hits = hub_visits.hits + 1,
              last_at = ${now}
      `;
      return { ok: true as const };
    } catch {
      return { ok: false as const };
    }
  });

export type VisitDay = {
  day: string;
  visitors: number;
  hits: number;
};

export type VisitStats = {
  today: VisitDay;
  days: VisitDay[];
  total: { visitors: number; hits: number };
};

export async function visitStats(): Promise<VisitStats> {
  const empty = {
    today: { day: amsterdamDay(), visitors: 0, hits: 0 },
    days: [] as VisitDay[],
    total: { visitors: 0, hits: 0 },
  };
  try {
    await ensureVisits();
    const sql = await getSql();
    const today = amsterdamDay();
    const from = sinceDay(13);
    const rows = await sql<{ day: string; visitors: unknown; hits: unknown }>`
      select
        day as day,
        count(*) as visitors,
        coalesce(sum(hits), 0) as hits
      from hub_visits
      where day >= ${from}
      group by day
      order by day desc
    `;
    const days = rows.map((row) => ({
      day: String(row.day ?? "").slice(0, 10),
      visitors: num(row.visitors),
      hits: num(row.hits),
    }));
    const todayRow = days.find((row) => row.day === today) ?? {
      day: today,
      visitors: 0,
      hits: 0,
    };
    const [totalRow] = await sql<{ visitors: unknown; hits: unknown }>`
      select
        count(distinct visitor_id) as visitors,
        coalesce(sum(hits), 0) as hits
      from hub_visits
    `;
    return {
      today: todayRow,
      days,
      total: {
        visitors: num(totalRow?.visitors),
        hits: num(totalRow?.hits),
      },
    };
  } catch {
    return empty;
  }
}
