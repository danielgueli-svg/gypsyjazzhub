import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

function visitorId(raw: unknown) {
  const id = typeof raw === "string" ? raw.trim() : "";
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(id)) throw new Error("Bad visitor id");
  return id;
}

export const pingVisit = createServerFn({ method: "POST" })
  .validator(visitorId)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    await sql`
      insert into hub_visits (day, visitor_id, hits)
      values (((now() at time zone 'Europe/Amsterdam')::date), ${id}, 1)
      on conflict (day, visitor_id) do update
        set hits = hub_visits.hits + 1,
            last_at = now()
    `;
    return { ok: true as const };
  });

export type VisitDay = {
  day: string;
  visitors: number;
  hits: number;
};

export async function visitStats() {
  const sql = await getSql();
  const [todayRow] = await sql<{ day: string }>`
    select (now() at time zone 'Europe/Amsterdam')::date::text as day
  `;
  const amsterdamToday = todayRow?.day ?? "";
  const rows = await sql<{ day: string; visitors: number; hits: number }>`
    select
      day::text as day,
      count(*)::int as visitors,
      coalesce(sum(hits), 0)::int as hits
    from hub_visits
    where day >= ((now() at time zone 'Europe/Amsterdam')::date - 13)
    group by day
    order by day desc
  `;
  const today = rows.find((row) => row.day === amsterdamToday) ?? {
    day: amsterdamToday,
    visitors: 0,
    hits: 0,
  };
  return { today, days: rows };
}
