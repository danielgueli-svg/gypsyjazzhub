import { getSql } from "@/lib/db";
import { readEnv } from "@/lib/runtime-env";
import { toIso } from "@/lib/utils";

export type DigestLine = { kind: string; title: string; who: string };

export type Digest = {
  subject: string;
  body: string;
  members: { name: string; email: string }[];
  lines: DigestLine[];
  finds: { title: string; status: string }[];
  empty: boolean;
};

export type DigestSettings = {
  email: string;
  enabled: boolean;
};

export type DigestLogRow = {
  id: number;
  sentAt: string;
  toEmail: string;
  subject: string;
  body: string;
  ok: boolean;
  detail: string;
};

async function ensureDigestTables() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_digest_settings (
      id integer primary key,
      email text not null default '',
      enabled boolean not null default true,
      updated_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    insert into hub_digest_settings (id, email, enabled)
      values (1, '', true)
      on conflict (id) do nothing
  `);
  await sql.query(`
    create table if not exists hub_digest_log (
      id serial primary key,
      sent_at timestamptz not null default now(),
      to_email text not null,
      subject text not null,
      body text not null,
      ok boolean not null,
      detail text not null default ''
    )
  `);
}

function sinceIso() {
  return new Date(Date.now() - 86_400_000).toISOString();
}

async function rows<T>(query: Promise<T[]>): Promise<T[]> {
  try {
    return await query;
  } catch {
    return [];
  }
}

export async function getDigestSettings(): Promise<DigestSettings> {
  await ensureDigestTables();
  const sql = await getSql();
  const found = await sql<{ email: string; enabled: boolean }>`
    select email, enabled from hub_digest_settings where id = 1
  `;
  const row = found[0];
  return { email: row?.email ?? "", enabled: row?.enabled ?? true };
}

export async function saveDigestSettings(input: DigestSettings) {
  await ensureDigestTables();
  const sql = await getSql();
  await sql`
    insert into hub_digest_settings (id, email, enabled, updated_at)
    values (1, ${input.email}, ${input.enabled}, now())
    on conflict (id) do update set
      email = excluded.email,
      enabled = excluded.enabled,
      updated_at = now()
  `;
  return input;
}

export async function listDigestLog(): Promise<DigestLogRow[]> {
  await ensureDigestTables();
  const sql = await getSql();
  const found = await sql<{
    id: number;
    sent_at: unknown;
    to_email: string;
    subject: string;
    body: string;
    ok: boolean;
    detail: string;
  }>`
    select id, sent_at, to_email, subject, body, ok, detail
    from hub_digest_log
    order by sent_at desc
    limit 8
  `;
  return found.map((row) => ({
    id: row.id,
    sentAt: toIso(row.sent_at),
    toEmail: row.to_email,
    subject: row.subject,
    body: row.body,
    ok: row.ok,
    detail: row.detail,
  }));
}

export async function buildDigest(): Promise<Digest> {
  await ensureDigestTables();
  const sql = await getSql();
  const since = sinceIso();
  const lines: DigestLine[] = [];

  const members = await rows(
    sql<{ name: string; email: string }>`
      select name, email from "user"
      where "createdAt" >= ${since}::timestamptz
      order by "createdAt" desc
    `,
  );

  const push = async (
    kind: string,
    query: Promise<{ title: string; who: string }[]>,
  ) => {
    for (const row of await rows(query)) {
      lines.push({ kind, title: row.title, who: row.who });
    }
  };

  await push(
    "concert",
    sql`
      select (artist_name || ' — ' || title) as title, submitted_name as who
      from hub_concerts where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "jam",
    sql`
      select name as title, submitted_name as who
      from hub_jams where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "festival",
    sql`
      select name as title, submitted_name as who
      from hub_festivals where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "clip",
    sql`
      select title, submitted_name as who
      from hub_clips where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "note",
    sql`
      select left(body, 80) as title, submitted_name as who
      from hub_notes where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "venue",
    sql`
      select name as title, submitted_name as who
      from hub_venues where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "luthier",
    sql`
      select name as title, submitted_name as who
      from hub_luthiers where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "teacher",
    sql`
      select name as title, contact as who
      from hub_teachers where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "chat",
    sql`
      select (target_kind || '/' || target_slug || ': ' || left(body, 60)) as title,
        chat_name as who
      from hub_chat where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );
  await push(
    "forum",
    sql`
      select title, author_name as who
      from hub_forum_topics where created_at >= ${since}::timestamptz
      order by created_at desc
    `,
  );

  const finds = await rows(
    sql<{ title: string; status: string }>`
      select title, status from hub_discoveries
      where scanned_at >= ${since}::timestamptz
        or (status = 'hold')
      order by scanned_at desc
      limit 20
    `,
  );

  const empty = members.length === 0 && lines.length === 0 && finds.length === 0;
  const day = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Amsterdam",
  });
  const subject = empty
    ? `Gypsy Jazz Hub — quiet day (${day})`
    : `Gypsy Jazz Hub — ${members.length} new member${members.length === 1 ? "" : "s"}, ${lines.length} post${lines.length === 1 ? "" : "s"} (${day})`;

  const chunks: string[] = [`Gypsy Jazz Hub — daily update`, day, ""];
  if (empty) {
    chunks.push("Quiet day. No new members and no new posts in the last 24 hours.");
  } else {
    if (members.length) {
      chunks.push(`NEW MEMBERS (${members.length})`);
      for (const member of members) {
        chunks.push(`- ${member.name} · ${member.email}`);
      }
      chunks.push("");
    }
    const kinds = [...new Set(lines.map((line) => line.kind))];
    for (const kind of kinds) {
      const group = lines.filter((line) => line.kind === kind);
      chunks.push(`${kind.toUpperCase()} (${group.length})`);
      for (const line of group) {
        chunks.push(`- ${line.title}${line.who ? ` · ${line.who}` : ""}`);
      }
      chunks.push("");
    }
  }
  if (finds.length) {
    chunks.push(`SCAN FINDS (${finds.length})`);
    for (const find of finds) {
      chunks.push(`- ${find.title} · ${find.status}`);
    }
    chunks.push("");
  }
  chunks.push("Owner desk: https://www.gypsyjazzhub.com/studio/owner");
  chunks.push("Made by Daniel Gueli");

  return { subject, body: chunks.join("\n"), members, lines, finds, empty };
}

export async function sendHubMail(to: string, subject: string, body: string) {
  const resend = readEnv("RESEND_API_KEY");
  if (resend) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Gypsy Jazz Hub <noreply@gypsyjazzhub.com>",
        to,
        subject,
        text: body,
      }),
    });
    if (!response.ok) {
      throw new Error(`Resend: ${await response.text()}`);
    }
    return "sent with Resend";
  }

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "box",
        _captcha: "false",
        message: body,
      }),
    },
  );
  const text = await response.text();
  let parsed: { success?: string | boolean; message?: string } = {};
  try {
    parsed = JSON.parse(text) as { success?: string | boolean; message?: string };
  } catch {
    parsed = {};
  }
  const ok =
    response.ok &&
    parsed.success !== false &&
    parsed.success !== "false" &&
    !/activation/i.test(parsed.message ?? text);
  if (!ok) {
    throw new Error(
      (parsed.message || text).slice(0, 200) || "Could not send mail",
    );
  }
  return "sent — first time, confirm the FormSubmit mail in your inbox";
}

export type DigestRun = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  detail?: string;
  digest: Digest;
};

export async function runDigest(source: "cron" | "test"): Promise<DigestRun> {
  await ensureDigestTables();
  const settings = await getDigestSettings();
  const digest = await buildDigest();
  const sql = await getSql();

  if (source === "cron" && !settings.enabled) {
    return { ok: false, skipped: true, reason: "Digest is switched off.", digest };
  }
  if (!settings.email.includes("@")) {
    await sql`
      insert into hub_digest_log (to_email, subject, body, ok, detail)
      values (${""}, ${digest.subject}, ${digest.body}, ${false}, ${"No owner email yet."})
    `;
    return {
      ok: false,
      skipped: true,
      reason: "Set your email on the owner desk first.",
      digest,
    };
  }

  try {
    const detail = await sendHubMail(settings.email, digest.subject, digest.body);
    await sql`
      insert into hub_digest_log (to_email, subject, body, ok, detail)
      values (${settings.email}, ${digest.subject}, ${digest.body}, ${true}, ${detail})
    `;
    return { ok: true, detail, digest };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Send failed";
    await sql`
      insert into hub_digest_log (to_email, subject, body, ok, detail)
      values (${settings.email}, ${digest.subject}, ${digest.body}, ${false}, ${detail})
    `;
    return { ok: false, detail, digest };
  }
}
