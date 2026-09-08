import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { toIso } from "@/lib/utils";

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

export function mapsHref(address: string) {
  if (!address.trim()) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

async function ensureContact() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_contact (
      id serial primary key,
      name text not null,
      email text not null,
      subject text not null,
      message text not null,
      status text not null default 'new',
      created_at timestamptz not null default now()
    )
  `);
}

async function requireOwner(userId: string) {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_owners (
      user_id text primary key,
      claimed_at timestamptz not null default now()
    )
  `);
  const rows = await sql<{ user_id: string }>`
    select user_id from hub_owners where user_id = ${userId} limit 1
  `;
  if (!rows[0]) throw new Error("Owner desk is only for the hub owner.");
}

function clean(value: string, max: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const submitContact = createServerFn({ method: "POST" })
  .validator(
    (input: {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      company?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    if (data.company?.trim()) return { ok: true as const };
    await ensureContact();
    const name = clean(data.name ?? "", 80);
    const email = clean(data.email ?? "", 120).toLowerCase();
    const subject = clean(data.subject ?? "", 140);
    const message = (data.message ?? "").trim().slice(0, 4000);
    if (name.length < 2) throw new Error("Please add your name.");
    if (!validEmail(email)) throw new Error("Please add a working email.");
    if (subject.length < 2) throw new Error("Please add a subject.");
    if (message.length < 8) throw new Error("Please write a short message.");

    const sql = await getSql();
    const recent = await sql<{ n: number }>`
      select count(*)::int as n from hub_contact
      where email = ${email} and created_at > now() - interval '2 minutes'
    `;
    if ((recent[0]?.n ?? 0) > 0) {
      throw new Error("Please wait a moment before sending another note.");
    }

    await sql`
      insert into hub_contact (name, email, subject, message)
      values (${name}, ${email}, ${subject}, ${message})
    `;
    return { ok: true as const };
  });

export const listContactMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    await ensureContact();
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      name: string;
      email: string;
      subject: string;
      message: string;
      status: string;
      created_at: unknown;
    }>`
      select id, name, email, subject, message, status, created_at
      from hub_contact
      order by created_at desc
      limit 80
    `;
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status,
      createdAt: toIso(row.created_at),
    })) satisfies ContactMessage[];
  });

export const markContactRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await requireOwner(context.userId);
    await ensureContact();
    const sql = await getSql();
    await sql`update hub_contact set status = 'read' where id = ${id}`;
    return { ok: true as const };
  });
