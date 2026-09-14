import { BOOKERS_BY_ARTIST } from "@/lib/bookers";
import { getSql } from "@/lib/db";
import { HUB_CONTACT_EMAIL, HUB_OWNER_EMAIL } from "@/lib/hub-owner";
import { toIso } from "@/lib/utils";

export type MailQueueKind = "booker" | "organiser" | "outreach";
export type MailQueueStatus = "pending" | "sent" | "rejected";

export type QueuedMail = {
  id: number;
  createdAt: string;
  toEmail: string;
  toName: string;
  subject: string;
  body: string;
  kind: MailQueueKind;
  reason: string;
  status: MailQueueStatus;
  decidedAt: string;
  sentDetail: string;
};

const OWNER_INBOX = new Set(
  [HUB_OWNER_EMAIL, HUB_CONTACT_EMAIL].map((email) => email.trim().toLowerCase()),
);

function bookerAddresses() {
  const out = new Set<string>();
  for (const booker of Object.values(BOOKERS_BY_ARTIST)) {
    const email = booker.email?.trim().toLowerCase();
    if (email?.includes("@")) out.add(email);
  }
  return out;
}

export function isBookerAddress(email: string) {
  const address = email.trim().toLowerCase();
  if (!address.includes("@")) return false;
  if (OWNER_INBOX.has(address)) return false;
  if (bookerAddresses().has(address)) return true;
  const local = address.split("@")[0] ?? "";
  return /^(booking|booker|agent|management)$/.test(local);
}

export async function shouldQueueHubMail(email: string) {
  return isBookerAddress(email);
}

async function ensureMailQueue() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_mail_queue (
      id serial primary key,
      created_at timestamptz not null default now(),
      to_email text not null,
      to_name text not null default '',
      subject text not null,
      body text not null,
      html text not null default '',
      reply_to text not null default '',
      kind text not null default 'outreach',
      reason text not null default '',
      status text not null default 'pending',
      decided_at timestamptz,
      sent_detail text not null default ''
    )
  `);
}

function asKind(raw: string): MailQueueKind {
  if (raw === "booker" || raw === "organiser") return raw;
  return "outreach";
}

function asStatus(raw: string): MailQueueStatus {
  if (raw === "sent" || raw === "rejected") return raw;
  return "pending";
}

function mapRow(row: {
  id: number;
  created_at: unknown;
  to_email: string;
  to_name: string;
  subject: string;
  body: string;
  kind: string;
  reason: string;
  status: string;
  decided_at: unknown;
  sent_detail: string;
}): QueuedMail {
  return {
    id: Number(row.id),
    createdAt: toIso(row.created_at),
    toEmail: row.to_email,
    toName: row.to_name ?? "",
    subject: row.subject,
    body: row.body,
    kind: asKind(row.kind),
    reason: row.reason ?? "",
    status: asStatus(row.status),
    decidedAt: row.decided_at ? toIso(row.decided_at) : "",
    sentDetail: row.sent_detail ?? "",
  };
}

export async function queueHubMail(input: {
  to: string;
  subject: string;
  body: string;
  html?: string;
  replyTo?: string;
  toName?: string;
  kind?: MailQueueKind;
  reason?: string;
}) {
  await ensureMailQueue();
  const to = input.to.trim();
  const subject = input.subject.trim();
  const body = input.body.trim();
  if (!to.includes("@")) throw new Error("Need a real email address.");
  if (!subject) throw new Error("Write a subject.");
  if (!body) throw new Error("Write the mail.");
  if (OWNER_INBOX.has(to.toLowerCase())) {
    throw new Error("Mail to the owner inbox does not wait for green light.");
  }

  const sql = await getSql();
  const kind = input.kind ?? (isBookerAddress(to) ? "booker" : "outreach");
  const dup = await sql.query<{ id: number }>(
    `select id from hub_mail_queue
      where status = 'pending' and lower(to_email) = lower($1) and subject = $2
      limit 1`,
    [to, subject],
  );
  if (dup[0]) {
    return { id: Number(dup[0].id), queued: false as const, reason: "already on the list" };
  }

  const inserted = await sql.query<{ id: number }>(
    `insert into hub_mail_queue
      (to_email, to_name, subject, body, html, reply_to, kind, reason, status)
      values ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
      returning id`,
    [
      to,
      (input.toName ?? "").trim(),
      subject,
      body,
      input.html?.trim() ?? "",
      input.replyTo?.trim() ?? "",
      kind,
      (input.reason ?? "").trim(),
    ],
  );
  return { id: Number(inserted[0]?.id ?? 0), queued: true as const };
}

export async function listQueuedMail(status: MailQueueStatus | "all" = "pending") {
  await ensureMailQueue();
  const sql = await getSql();
  const rows =
    status === "all"
      ? await sql.query<Parameters<typeof mapRow>[0]>(
          `select id, created_at, to_email, to_name, subject, body, kind, reason, status, decided_at, sent_detail
           from hub_mail_queue order by created_at desc limit 80`,
        )
      : await sql.query<Parameters<typeof mapRow>[0]>(
          `select id, created_at, to_email, to_name, subject, body, kind, reason, status, decided_at, sent_detail
           from hub_mail_queue where status = $1 order by created_at asc limit 80`,
          [status],
        );
  return rows.map(mapRow);
}

export async function approveQueuedMail(id: number) {
  await ensureMailQueue();
  const sql = await getSql();
  const rows = await sql.query<{
    id: number;
    to_email: string;
    subject: string;
    body: string;
    html: string;
    reply_to: string;
    status: string;
  }>(
    `select id, to_email, subject, body, html, reply_to, status from hub_mail_queue where id = $1 limit 1`,
    [id],
  );
  const row = rows[0];
  if (!row) throw new Error("That mail is not on the list.");
  if (row.status === "sent") return { ok: true as const, detail: "already sent" };
  if (row.status !== "pending") throw new Error("That mail is no longer waiting.");

  const { sendHubMail } = await import("@/lib/digest");
  const detail = await sendHubMail(
    row.to_email,
    row.subject,
    row.body,
    row.html || undefined,
    row.reply_to || undefined,
    true,
  );
  await sql.query(
    `update hub_mail_queue set status = 'sent', decided_at = now(), sent_detail = $2 where id = $1`,
    [id, detail],
  );
  return { ok: true as const, detail };
}

export async function rejectQueuedMail(id: number) {
  await ensureMailQueue();
  const sql = await getSql();
  const rows = await sql.query<{ status: string }>(
    `select status from hub_mail_queue where id = $1 limit 1`,
    [id],
  );
  if (!rows[0]) throw new Error("That mail is not on the list.");
  if (rows[0].status !== "pending") throw new Error("That mail is no longer waiting.");
  await sql.query(
    `update hub_mail_queue set status = 'rejected', decided_at = now(), sent_detail = 'owner said no' where id = $1`,
    [id],
  );
  return { ok: true as const };
}

export async function runMailQueueDigest() {
  const pending = await listQueuedMail("pending");
  if (!pending.length) {
    return { ok: true as const, skipped: true as const, reason: "none waiting", count: 0 };
  }

  const { getDigestSettings, sendHubMail } = await import("@/lib/digest");
  const { wrapHubMailHtml } = await import("@/lib/hub-mail-html");
  const settings = await getDigestSettings();
  const to =
    settings.email.trim() ||
    HUB_CONTACT_EMAIL ||
    HUB_OWNER_EMAIL;
  if (!to.includes("@")) {
    return { ok: false as const, skipped: true as const, reason: "no owner email", count: pending.length };
  }

  const desk = "https://www.gypsyjazzhub.com/studio/owner#desk-mail-queue";
  const lines = pending.map((mail, i) => {
    const who = mail.toName ? `${mail.toName} <${mail.toEmail}>` : mail.toEmail;
    return `${i + 1}. ${mail.kind} → ${who}\n   ${mail.subject}`;
  });
  const subject =
    pending.length === 1
      ? "Gypsy Jazz Hub — 1 mail waiting for green light"
      : `Gypsy Jazz Hub — ${pending.length} mails waiting for green light`;
  const body = [
    "These mails are sitting on the owner desk. They do not go out until you give green light.",
    "",
    ...lines,
    "",
    desk,
    "",
    "Automated mail (welcome, jam reminder, password reset, morning digest) still sends on its own.",
  ].join("\n");

  const html = wrapHubMailHtml({
    body,
    buttonLabel: "Open the list",
    buttonHref: desk,
  });
  const detail = await sendHubMail(to, subject, body, html, undefined, true);
  return { ok: true as const, skipped: false as const, count: pending.length, detail };
}
