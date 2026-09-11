import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
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

function countryName(code: string) {
  const iso = code.trim().toUpperCase();
  if (!iso || iso === "XX" || iso === "T1") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(iso) ?? iso;
  } catch {
    return iso;
  }
}

type CfRequest = Request & {
  cf?: { country?: string; city?: string; region?: string };
};

function visitPlace() {
  try {
    const request = getRequest() as CfRequest | undefined;
    if (!request) return { country: "", city: "" };
    const header = request.headers.get("cf-ipcountry")?.trim().toUpperCase() ?? "";
    let country = (request.cf?.country || header || "").toUpperCase();
    if (country === "XX" || country === "T1" || country === "A1" || country === "A2") country = "";
    country = country.replace(/[^A-Z]/g, "").slice(0, 2);
    const city = String(request.cf?.city ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
    return { country, city };
  } catch {
    return { country: "", city: "" };
  }
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
      country text not null default '',
      city text not null default '',
      primary key (day, visitor_id)
    )
  `);
  for (const col of ["country text not null default ''", "city text not null default ''"]) {
    try {
      await sql.query(`alter table hub_visits add column if not exists ${col}`);
    } catch {
      /* column already there */
    }
  }
}

export const pingVisit = createServerFn({ method: "POST" })
  .validator(visitorId)
  .handler(async ({ data: id }) => {
    try {
      await ensureVisits();
      const sql = await getSql();
      const day = amsterdamDay();
      const now = new Date().toISOString();
      const place = visitPlace();
      await sql`
        insert into hub_visits (day, visitor_id, hits, last_at, country, city)
        values (${day}, ${id}, 1, ${now}, ${place.country}, ${place.city})
        on conflict (day, visitor_id) do update
          set hits = hub_visits.hits + 1,
              last_at = ${now},
              country = case when excluded.country <> '' then excluded.country else hub_visits.country end,
              city = case when excluded.city <> '' then excluded.city else hub_visits.city end
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

export type VisitPlace = {
  country: string;
  countryName: string;
  city: string;
  visitors: number;
  hits: number;
};

export type VisitStats = {
  today: VisitDay;
  days: VisitDay[];
  total: { visitors: number; hits: number };
  countries: VisitPlace[];
  cities: VisitPlace[];
};

export async function visitStats(): Promise<VisitStats> {
  const empty: VisitStats = {
    today: { day: amsterdamDay(), visitors: 0, hits: 0 },
    days: [],
    total: { visitors: 0, hits: 0 },
    countries: [],
    cities: [],
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
    const countryRows = await sql<{ country: string; visitors: unknown; hits: unknown }>`
      select
        country as country,
        count(distinct visitor_id) as visitors,
        coalesce(sum(hits), 0) as hits
      from hub_visits
      group by country
      order by count(distinct visitor_id) desc, coalesce(sum(hits), 0) desc
    `;
    const cityRows = await sql<{ country: string; city: string; visitors: unknown; hits: unknown }>`
      select
        country as country,
        city as city,
        count(distinct visitor_id) as visitors,
        coalesce(sum(hits), 0) as hits
      from hub_visits
      where city <> ''
      group by country, city
      order by count(distinct visitor_id) desc, coalesce(sum(hits), 0) desc
    `;
    const countries = countryRows.map((row) => {
      const code = String(row.country ?? "").toUpperCase();
      return {
        country: code,
        countryName: countryName(code),
        city: "",
        visitors: num(row.visitors),
        hits: num(row.hits),
      };
    });
    const cities = cityRows.slice(0, 40).map((row) => {
      const code = String(row.country ?? "").toUpperCase();
      return {
        country: code,
        countryName: countryName(code),
        city: String(row.city ?? "").trim(),
        visitors: num(row.visitors),
        hits: num(row.hits),
      };
    });
    return {
      today: todayRow,
      days,
      total: {
        visitors: num(totalRow?.visitors),
        hits: num(totalRow?.hits),
      },
      countries,
      cities,
    };
  } catch {
    return empty;
  }
}
