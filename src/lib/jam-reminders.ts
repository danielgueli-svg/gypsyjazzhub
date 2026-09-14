import { getSql } from "@/lib/db";
import { sendHubMail } from "@/lib/digest";
import { overlayJamList, catalogJams, isFrontJam, jamHours, jamPlace, formatJamNext, type Jam } from "@/lib/jams";
import { inTwoDayWindow, nightKey } from "@/lib/jam-going";
import { purgePastJamGoing } from "@/lib/rsvp";
import { toIso } from "@/lib/utils";

const HUB = "https://www.gypsyjazzhub.com";

async function ensureReminderTables() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_jam_reminders (
      jam_slug text not null,
      night text not null,
      sent_at timestamptz not null default now(),
      sent_count integer not null default 0,
      primary key (jam_slug, night)
    )
  `);
}

async function hubJams(): Promise<Jam[]> {
  try {
    const sql = await getSql();
    const rows = await sql<{
      slug: string;
      name: string;
      city: string;
      country: string;
      venue: string;
      when_text: string;
      next_starts_at: unknown;
      bio: string;
      kind: string;
      address: string;
      hours: string;
    }>`
      select slug, name, city, country, venue, when_text, next_starts_at, bio, kind, address, hours
      from hub_jams
      where coalesce(status, 'published') = 'published'
    `;
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      city: row.city,
      country: row.country,
      venue: row.venue,
      address: row.address,
      hours: row.hours,
      when: row.when_text,
      nextStartsAt: toIso(row.next_starts_at),
      bio: row.bio,
      relatedSlugs: [],
      kind: row.kind === "meetup" ? "meetup" : "regular",
    }));
  } catch {
    return [];
  }
}

async function jamNotes(slug: string) {
  try {
    const sql = await getSql();
    const rows = await sql<{ body: string; chat_name: string }>`
      select body, chat_name from hub_chat
      where target_kind = 'jam' and target_slug = ${slug}
      order by created_at desc
      limit 6
    `;
    return rows.map((row) => ({
      name: row.chat_name.trim() || "Hub member",
      body: row.body.trim(),
    })).filter((row) => row.body);
  } catch {
    return [];
  }
}

async function roomEmails(jam: Jam) {
  const sql = await getSql();
  const ids = new Set<string>();
  const night = nightKey(jam.nextStartsAt);
  try {
    await purgePastJamGoing(jam.slug, jam.nextStartsAt);
    if (night) {
      const going = await sql<{ user_id: string }>`
        select user_id from hub_jam_going where jam_slug = ${jam.slug} and night = ${night}
      `;
      for (const row of going) ids.add(row.user_id);
    }
  } catch {
    /* table may not exist */
  }
  try {
    const subs = await sql<{ user_id: string }>`
      select user_id from hub_subscriptions where kind = 'jam' and target_id = ${jam.slug}
    `;
    for (const row of subs) ids.add(row.user_id);
  } catch {
    /* */
  }
  if (ids.size === 0) return [];
  const list = [...ids].slice(0, 80);
  const accounts: { id: string; email: string; name: string }[] = [];
  for (const id of list) {
    try {
      const found = await sql<{ id: string; email: string; name: string }>`
        select id, email, name from "user" where id = ${id} limit 1
      `;
      if (found[0]?.email.includes("@")) accounts.push(found[0]);
    } catch {
      /* skip */
    }
  }
  return accounts;
}

function buildMail(jam: Jam, notes: { name: string; body: string }[]) {
  const when = formatJamNext(jam, "en");
  const place = jamPlace(jam);
  const hours = jamHours(jam);
  const href = `${HUB}/jams/${jam.slug}`;
  const lines = [
    `${jam.name} is in two days.`,
    "",
    jam.venue ? jam.venue : "",
    place,
    [jam.city, jam.country].filter(Boolean).join(", "),
    [jam.when, hours].filter(Boolean).join(" · "),
    `Next: ${when}`,
    "",
  ].filter((line, i, all) => line !== "" || all[i - 1] !== "");
  if (notes.length) {
    lines.push("Notes on this jam (a guest night, a date, who is sitting in):");
    for (const note of notes) {
      lines.push(`- ${note.name}: ${note.body}`);
    }
    lines.push("");
  }
  lines.push(href);
  lines.push("");
  lines.push("You get this because you said you're going to this session, or you asked for a reminder two days before.");
  lines.push("Made by Daniel Gueli");
  return {
    subject: `Reminder: ${jam.name} in 2 days — ${jam.city || jam.country}`,
    body: lines.filter((line, i, all) => !(line === "" && all[i - 1] === "")).join("\n"),
  };
}

export async function runJamRoomReminders(now = Date.now()) {
  await ensureReminderTables();
  try {
    await purgePastJamGoing();
  } catch {
    /* going table may not exist yet */
  }
  const extra = await hubJams();
  const jams = overlayJamList(catalogJams(now), extra, now).filter(
    (jam) => isFrontJam(jam) && Boolean(nightKey(jam.nextStartsAt)) && inTwoDayWindow(jam.nextStartsAt, now),
  );
  const sql = await getSql();
  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const jam of jams) {
    const night = nightKey(jam.nextStartsAt);
    const already = await sql<{ n: number }>`
      select 1 as n from hub_jam_reminders where jam_slug = ${jam.slug} and night = ${night} limit 1
    `;
    if (already[0]) {
      skipped += 1;
      continue;
    }
    const [notes, people] = await Promise.all([jamNotes(jam.slug), roomEmails(jam)]);
    if (people.length === 0) {
      await sql`
        insert into hub_jam_reminders (jam_slug, night, sent_count)
        values (${jam.slug}, ${night}, 0)
        on conflict do nothing
      `;
      skipped += 1;
      continue;
    }
    const mail = buildMail(jam, notes);
    let okCount = 0;
    for (const person of people) {
      try {
        await sendHubMail(person.email, mail.subject, mail.body);
        okCount += 1;
        sent += 1;
      } catch {
        failed += 1;
      }
    }
    await sql`
      insert into hub_jam_reminders (jam_slug, night, sent_count)
      values (${jam.slug}, ${night}, ${okCount})
      on conflict do nothing
    `;
  }
  return { sent, skipped, failed, jams: jams.length };
}
