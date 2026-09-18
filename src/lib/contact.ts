import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { sendHubMail } from "@/lib/digest";
import { HUB_CONTACT_EMAIL, PUBLIC_CONTACT_EMAIL } from "@/lib/hub-owner";
import { toIso } from "@/lib/utils";

export const CONTACT_TOPICS = ["festival", "concert", "jam", "question", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

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
  const rows = await sql.query<{ user_id: string }>(
    `select user_id from hub_owners where user_id = $1 limit 1`,
    [userId],
  );
  if (!rows[0]) throw new Error("Owner desk is only for the hub owner.");
}

function clean(value: string, max: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUserError(message: string) {
  return /please |working email|short message|wait a moment|public photo/i.test(message);
}

function isContactTopic(value: string): value is ContactTopic {
  return (CONTACT_TOPICS as readonly string[]).includes(value);
}

function cleanPhotoUrl(value: string) {
  const raw = value.trim().slice(0, 500);
  if (!raw) return "";
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Please use a public photo link (http or https).");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Please use a public photo link (http or https).");
  }
  return url.toString();
}

function mailLines(parts: Array<string | undefined>) {
  return parts.filter((line): line is string => line !== undefined).join("\n");
}

export const submitContact = createServerFn({ method: "POST" })
  .validator(
    (input: {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      company?: string;
      topic?: string;
      eventTitle?: string;
      date?: string;
      place?: string;
      photoUrl?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    try {
      if (data.company?.trim()) return { ok: true as const };
      await ensureContact();
      const name = clean(data.name ?? "", 80);
      const email = clean(data.email ?? "", 120).toLowerCase();
      const topicRaw = clean(data.topic ?? "", 40).toLowerCase();
      const fromPage = Boolean(topicRaw);
      const topic = fromPage && isContactTopic(topicRaw) ? topicRaw : "";
      const eventTitle = clean(data.eventTitle ?? "", 140);
      const date = clean(data.date ?? "", 40);
      const place = clean(data.place ?? "", 140);
      const photoUrl = cleanPhotoUrl(data.photoUrl ?? "");
      const message = (data.message ?? "").trim().slice(0, 4000);
      const subject = fromPage
        ? clean([topic, eventTitle].filter(Boolean).join(": "), 140)
        : clean(data.subject ?? "", 140);

      if (name.length < 2) throw new Error("Please add your name.");
      if (!validEmail(email)) throw new Error("Please add a working email.");
      if (fromPage && !topic) throw new Error("Please pick a topic.");
      if (fromPage && eventTitle.length < 2) throw new Error("Please add a title or event name.");
      if (subject.length < 2) throw new Error("Please add a subject.");
      if (message.length < 8) throw new Error("Please write a short message.");

      const sql = await getSql();
      const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      const recent = await sql.query<{ n: number | string }>(
        `select count(*) as n from hub_contact where email = $1 and created_at > $2`,
        [email, since],
      );
      if (Number(recent[0]?.n ?? 0) > 0) {
        throw new Error("Please wait a moment before sending another note.");
      }

      const storedMessage = fromPage
        ? mailLines([
            topic ? `Topic: ${topic}` : undefined,
            eventTitle ? `Title: ${eventTitle}` : undefined,
            date ? `Date: ${date}` : undefined,
            place ? `Place: ${place}` : undefined,
            photoUrl ? `Photo: ${photoUrl}` : undefined,
            "",
            message,
          ]).slice(0, 4000)
        : message;

      const body = fromPage
        ? mailLines([
            `${name} wrote via the Contact page.`,
            `From: ${name} <${email}>`,
            `Topic: ${topic}`,
            `Title: ${eventTitle}`,
            date ? `Date: ${date}` : undefined,
            place ? `Place: ${place}` : undefined,
            photoUrl ? `Photo: ${photoUrl}` : undefined,
            "",
            message,
            "",
            "Reply to this mail to answer them.",
          ])
        : mailLines([
            `${name} wrote via Contact the Board.`,
            `From: ${name} <${email}>`,
            `Subject: ${subject}`,
            "",
            message,
            "",
            "Reply to this mail to answer them.",
          ]);

      await sendHubMail(
        fromPage ? PUBLIC_CONTACT_EMAIL : HUB_CONTACT_EMAIL,
        fromPage ? `Contact — ${subject}` : `Contact the Board — ${subject}`,
        body,
        undefined,
        email,
        true,
      );

      await sql.query(
        `insert into hub_contact (name, email, subject, message) values ($1, $2, $3, $4)`,
        [name, email, subject, storedMessage],
      );
      return { ok: true as const };
    } catch (err) {
      if (err instanceof Error && isUserError(err.message)) throw err;
      console.error("submitContact failed", err);
      throw new Error("Could not send. Try again in a moment.");
    }
  });

export const listContactMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    await ensureContact();
    const sql = await getSql();
    const rows = await sql.query<{
      id: number;
      name: string;
      email: string;
      subject: string;
      message: string;
      status: string;
      created_at: unknown;
    }>(
      `select id, name, email, subject, message, status, created_at
       from hub_contact
       order by created_at desc
       limit 80`,
    );
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
    await sql.query(`update hub_contact set status = 'read' where id = $1`, [id]);
    return { ok: true as const };
  });
