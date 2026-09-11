import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, getDbSource } from "@/lib/db";
import { countrySlug } from "@/lib/geo";
import { toIso } from "@/lib/utils";

export type CountryRequest = {
  id: number;
  countryName: string;
  slug: string;
  city: string;
  kind: string;
  note: string;
  submittedBy: string;
  submittedName: string;
  status: string;
  createdAt: string;
};

export type HubCountry = {
  slug: string;
  name: string;
};

async function ensureCountryTables() {
  if (getDbSource() === "do") return;
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_country_requests (
      id serial primary key,
      country_name text not null,
      slug text not null,
      city text not null default '',
      kind text not null default 'page',
      note text not null default '',
      submitted_by text not null,
      submitted_name text not null default '',
      status text not null default 'pending',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists hub_countries (
      slug text primary key,
      name text not null,
      requested_by text not null default '',
      created_at timestamptz not null default now()
    )
  `);
}

async function submitterName(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ name: string | null; email: string | null }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  const row = rows[0];
  if (row?.name?.trim()) return row.name.trim();
  if (row?.email) return row.email.split("@")[0] ?? "Hub member";
  return "Hub member";
}

export const listHubCountries = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureCountryTables();
    const sql = await getSql();
    const rows = await sql<{ slug: string; name: string }>`
      select slug, name from hub_countries order by name
    `;
    return rows.map((row) => ({ slug: row.slug, name: row.name })) satisfies HubCountry[];
  } catch (err) {
    console.error("list hub countries failed", err);
    return [];
  }
});

export const requestCountry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { countryName: string; city: string; kind: string; note: string }) => input,
  )
  .handler(async ({ context, data }) => {
    await ensureCountryTables();
    const countryName = data.countryName.trim();
    if (countryName.length < 3) throw new Error("Name the country.");
    const slug = countrySlug(countryName);
    if (!slug) throw new Error("Name the country.");
    const sql = await getSql();
    const existing = await sql<{ slug: string }>`
      select slug from hub_countries where slug = ${slug} limit 1
    `;
    if (existing[0]) {
      return { ok: true as const, already: true, slug };
    }
    const waiting = await sql<{ id: number }>`
      select id from hub_country_requests where slug = ${slug} and status = 'pending' limit 1
    `;
    if (waiting[0]) throw new Error("A request for this country is already waiting.");
    const name = await submitterName(context.userId);
    const kind = ["concert", "jam", "festival", "page"].includes(data.kind) ? data.kind : "page";
    await sql`
      insert into hub_country_requests (
        country_name, slug, city, kind, note, submitted_by, submitted_name, status
      ) values (
        ${countryName}, ${slug}, ${data.city.trim()}, ${kind}, ${data.note.trim()},
        ${context.userId}, ${name}, 'pending'
      )
    `;
    return { ok: true as const, already: false, slug };
  });

export const listCountryRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureCountryTables();
    const sql = await getSql();
    const owners = await sql<{ user_id: string }>`select user_id from hub_owners`;
    if (!owners.some((row) => row.user_id === context.userId)) {
      throw new Error("Owner desk is only for the hub owner.");
    }
    const rows = await sql<{
      id: number;
      country_name: string;
      slug: string;
      city: string;
      kind: string;
      note: string;
      submitted_by: string;
      submitted_name: string;
      status: string;
      created_at: unknown;
    }>`
      select id, country_name, slug, city, kind, note, submitted_by, submitted_name, status, created_at
      from hub_country_requests
      order by case when status = 'pending' then 0 else 1 end, created_at desc
      limit 80
    `;
    return rows.map((row) => ({
      id: row.id,
      countryName: row.country_name,
      slug: row.slug,
      city: row.city,
      kind: row.kind,
      note: row.note,
      submittedBy: row.submitted_by,
      submittedName: row.submitted_name,
      status: row.status,
      createdAt: toIso(row.created_at),
    })) satisfies CountryRequest[];
  });

export const reviewCountryRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; action: "approve" | "reject" }) => input)
  .handler(async ({ context, data }) => {
    await ensureCountryTables();
    const sql = await getSql();
    const owners = await sql<{ user_id: string }>`select user_id from hub_owners`;
    if (!owners.some((row) => row.user_id === context.userId)) {
      throw new Error("Owner desk is only for the hub owner.");
    }
    const rows = await sql<{
      id: number;
      country_name: string;
      slug: string;
      submitted_by: string;
    }>`
      select id, country_name, slug, submitted_by from hub_country_requests where id = ${data.id} limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("That request is gone.");
    if (data.action === "approve") {
      await sql`
        insert into hub_countries (slug, name, requested_by)
        values (${row.slug}, ${row.country_name}, ${row.submitted_by})
        on conflict (slug) do nothing
      `;
      await sql`update hub_country_requests set status = 'approved' where id = ${row.id}`;
    } else {
      await sql`update hub_country_requests set status = 'rejected' where id = ${row.id}`;
    }
    return { ok: true as const };
  });
