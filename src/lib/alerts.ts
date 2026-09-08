import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { sendHubMail } from "@/lib/digest";
import {
  COUNTRY_OPTIONS,
  countrySlug,
  displayCountry,
  resolveCountry,
} from "@/lib/geo";
import { formatConcertWhen, toIso } from "@/lib/utils";
import { deleteSubscription, loadSubscriptions, upsertSubscription } from "@/lib/subscriptions";

export const ALERT_KINDS = ["concert", "jam", "festival"] as const;
export type AlertKind = (typeof ALERT_KINDS)[number];

export const ALERT_FREQUENCIES = ["every", "weekly", "monthly"] as const;
export type AlertFrequency = (typeof ALERT_FREQUENCIES)[number];

export type AlertPrefs = {
  countries: string[];
  kinds: AlertKind[];
  frequency: AlertFrequency;
  enabled: boolean;
  lastSentAt: string | null;
};

export type AlertFollow = {
  artistSlug: string;
  artistKind: "legend" | "musician";
  artistName: string;
  frequency?: AlertFrequency;
  lastSentAt?: string | null;
};

export type CountryFollow = {
  country: string;
  frequency: AlertFrequency;
  lastSentAt?: string | null;
};

export type AlertEvent = {
  id: string;
  kind: AlertKind;
  title: string;
  artistName: string;
  artistSlug: string;
  venue: string;
  city: string;
  country: string;
  startsAt: string;
  href: string;
  reason: "country" | "follow";
};

export type AlertLogRow = {
  id: number;
  sentAt: string;
  toEmail: string;
  subject: string;
  eventCount: number;
  ok: boolean;
  detail: string;
};

const HUB = "https://www.gypsyjazzhub.com";

const INTERVAL_MS: Record<AlertFrequency, number> = {
  every: 86_400_000,
  weekly: 7 * 86_400_000,
  monthly: 30 * 86_400_000,
};

const DEFAULT_PREFS: AlertPrefs = {
  countries: [],
  kinds: ["concert", "jam"],
  frequency: "every",
  enabled: true,
  lastSentAt: null,
};

async function rows<T>(query: Promise<T[]>): Promise<T[]> {
  try {
    return await query;
  } catch {
    return [];
  }
}

let alertReady: Promise<void> | null = null;

export async function ensureAlertTables() {
  alertReady ??= (async () => {
    const sql = await getSql();
    await sql.query(`
      create table if not exists hub_alert_prefs (
        user_id text primary key,
        countries text not null default '',
        kinds text not null default 'concert,jam',
        frequency text not null default 'weekly',
        enabled boolean not null default true,
        last_sent_at timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `);
    await sql.query(`
      create table if not exists hub_alert_follows (
        user_id text not null,
        artist_slug text not null,
        artist_kind text not null default 'legend',
        artist_name text not null default '',
        created_at timestamptz not null default now(),
        primary key (user_id, artist_slug)
      )
    `);
    await sql.query(`
      create index if not exists hub_alert_follows_user_idx on hub_alert_follows (user_id)
    `);
    await sql.query(`
      create table if not exists hub_alert_log (
        id serial primary key,
        user_id text not null,
        to_email text not null,
        subject text not null,
        body text not null,
        event_count integer not null default 0,
        ok boolean not null,
        detail text not null default '',
        sent_at timestamptz not null default now()
      )
    `);
    await sql.query(`
      create index if not exists hub_alert_log_user_idx on hub_alert_log (user_id, sent_at)
    `);
    await sql.query(`
      alter table hub_alert_follows add column if not exists frequency text not null default 'every'
    `);
    await sql.query(`
      alter table hub_alert_follows add column if not exists last_sent_at timestamptz
    `);
    await sql.query(`
      create table if not exists hub_country_follows (
        user_id text not null,
        country text not null,
        frequency text not null default 'every',
        last_sent_at timestamptz,
        created_at timestamptz not null default now(),
        primary key (user_id, country)
      )
    `);
    await sql.query(`
      create index if not exists hub_country_follows_user_idx on hub_country_follows (user_id)
    `);
    const { ensureSubscriptionTables } = await import("@/lib/subscriptions");
    await ensureSubscriptionTables();
  })();
  try {
    await alertReady;
  } catch (err) {
    alertReady = null;
    throw err;
  }
}

function parseList(raw: string) {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseKinds(raw: string): AlertKind[] {
  const found = parseList(raw).filter((item): item is AlertKind =>
    (ALERT_KINDS as readonly string[]).includes(item),
  );
  return found.length ? [...new Set(found)] : ["concert", "jam"];
}

function parseFrequency(raw: unknown): AlertFrequency {
  if (raw === "quarterly") return "monthly";
  return typeof raw === "string" && (ALERT_FREQUENCIES as readonly string[]).includes(raw)
    ? (raw as AlertFrequency)
    : "every";
}

function parseCountries(raw: string): string[] {
  const allow = new Set(COUNTRY_OPTIONS);
  return [...new Set(parseList(raw).map((name) => resolveCountry(name) ?? name).filter((name) => allow.has(name)))];
}

function mapPrefs(row: {
  countries: string;
  kinds: string;
  frequency: string;
  enabled: boolean;
  last_sent_at: unknown;
}): AlertPrefs {
  return {
    countries: parseCountries(row.countries),
    kinds: parseKinds(row.kinds),
    frequency: parseFrequency(row.frequency),
    enabled: Boolean(row.enabled),
    lastSentAt: row.last_sent_at ? toIso(row.last_sent_at) : null,
  };
}

export async function loadAlertPrefs(userId: string): Promise<AlertPrefs> {
  await ensureAlertTables();
  const sql = await getSql();
  const found = await sql<{
    countries: string;
    kinds: string;
    frequency: string;
    enabled: boolean;
    last_sent_at: unknown;
  }>`
    select countries, kinds, frequency, enabled, last_sent_at
    from hub_alert_prefs
    where user_id = ${userId}
    limit 1
  `;
  return found[0] ? mapPrefs(found[0]) : { ...DEFAULT_PREFS };
}

async function ensurePrefsRow(userId: string) {
  const sql = await getSql();
  await sql`
    insert into hub_alert_prefs (user_id)
    values (${userId})
    on conflict (user_id) do nothing
  `;
}

export async function storeAlertPrefs(userId: string, input: Omit<AlertPrefs, "lastSentAt">) {
  await ensureAlertTables();
  const countries = parseCountries(input.countries.join(","));
  const kinds = parseKinds(input.kinds.join(","));
  const frequency = parseFrequency(input.frequency);
  const sql = await getSql();
  await sql`
    insert into hub_alert_prefs (user_id, countries, kinds, frequency, enabled, updated_at)
    values (
      ${userId},
      ${countries.join(",")},
      ${kinds.join(",")},
      ${frequency},
      ${Boolean(input.enabled)},
      now()
    )
    on conflict (user_id) do update set
      countries = excluded.countries,
      kinds = excluded.kinds,
      frequency = excluded.frequency,
      enabled = excluded.enabled,
      updated_at = now()
  `;
  return loadAlertPrefs(userId);
}

export async function loadAlertFollows(userId: string): Promise<AlertFollow[]> {
  await ensureAlertTables();
  const sql = await getSql();
  const found = await sql<{
    artist_slug: string;
    artist_kind: string;
    artist_name: string;
    frequency: string;
    last_sent_at: unknown;
  }>`
    select artist_slug, artist_kind, artist_name, frequency, last_sent_at
    from hub_alert_follows
    where user_id = ${userId}
    order by artist_name asc
  `;
  return found.map((row) => ({
    artistSlug: row.artist_slug,
    artistKind: row.artist_kind === "musician" ? "musician" : "legend",
    artistName: row.artist_name,
    frequency: parseFrequency(row.frequency),
    lastSentAt: row.last_sent_at ? toIso(row.last_sent_at) : null,
  }));
}

export async function isAlertFollow(userId: string, artistSlug: string) {
  await ensureAlertTables();
  const sql = await getSql();
  const found = await sql<{ n: number }>`
    select count(*)::int as n from hub_alert_follows
    where user_id = ${userId} and artist_slug = ${artistSlug}
  `;
  return (found[0]?.n ?? 0) > 0;
}

export async function setAlertFollow(
  userId: string,
  input: AlertFollow,
  following: boolean,
) {
  await ensureAlertTables();
  await ensurePrefsRow(userId);
  const sql = await getSql();
  const slug = input.artistSlug.trim();
  if (!slug) return { following: false, frequency: "every" as AlertFrequency };
  if (!following) {
    await sql`
      delete from hub_alert_follows
      where user_id = ${userId} and artist_slug = ${slug}
    `;
    const musician = await sql<{ user_id: string }>`
      select user_id from profiles where slug = ${slug} limit 1
    `;
    if (musician[0]) {
      await sql`
        delete from follows
        where follower_id = ${userId} and musician_user_id = ${musician[0].user_id}
      `;
    }
    await deleteSubscription(userId, { kind: "musician", targetId: slug });
    await deleteSubscription(userId, { kind: "legend", targetId: slug });
    return { following: false, frequency: "every" as AlertFrequency };
  }
  const kind = input.artistKind === "musician" ? "musician" : "legend";
  const name = input.artistName.trim() || slug;
  const frequency = parseFrequency(input.frequency);
  await sql`
    insert into hub_alert_follows (user_id, artist_slug, artist_kind, artist_name, frequency)
    values (${userId}, ${slug}, ${kind}, ${name}, ${frequency})
    on conflict (user_id, artist_slug) do update set
      artist_kind = excluded.artist_kind,
      artist_name = excluded.artist_name,
      frequency = excluded.frequency
  `;
  await upsertSubscription(userId, {
    kind: kind === "musician" ? "musician" : "legend",
    targetId: slug,
    targetName: name,
  });
  if (kind === "musician") {
    const musician = await sql<{ user_id: string }>`
      select user_id from profiles where slug = ${slug} limit 1
    `;
    if (musician[0] && musician[0].user_id !== userId) {
      await sql`
        insert into follows (follower_id, musician_user_id)
        values (${userId}, ${musician[0].user_id})
        on conflict do nothing
      `;
    }
  }
  return { following: true, frequency };
}

export async function syncSocialAlertFollow(
  followerId: string,
  musicianUserId: string,
  following: boolean,
) {
  await ensureAlertTables();
  await ensurePrefsRow(followerId);
  const sql = await getSql();
  const profile = await sql<{ slug: string; display_name: string }>`
    select slug, display_name from profiles where user_id = ${musicianUserId} limit 1
  `;
  if (!profile[0]) return;
  if (following) {
    await sql`
      insert into hub_alert_follows (user_id, artist_slug, artist_kind, artist_name, frequency)
      values (${followerId}, ${profile[0].slug}, ${"musician"}, ${profile[0].display_name}, ${"every"})
      on conflict (user_id, artist_slug) do update set
        artist_name = excluded.artist_name
    `;
    await upsertSubscription(followerId, {
      kind: "musician",
      targetId: profile[0].slug,
      targetName: profile[0].display_name,
    });
    return;
  }
  await sql`
    delete from hub_alert_follows
    where user_id = ${followerId} and artist_slug = ${profile[0].slug}
  `;
  await deleteSubscription(followerId, { kind: "musician", targetId: profile[0].slug });
}

export async function loadCountryFollows(userId: string): Promise<CountryFollow[]> {
  await ensureAlertTables();
  const sql = await getSql();
  const found = await sql<{
    country: string;
    frequency: string;
    last_sent_at: unknown;
  }>`
    select country, frequency, last_sent_at
    from hub_country_follows
    where user_id = ${userId}
    order by country asc
  `;
  const listed = found.map((row) => ({
    country: resolveCountry(row.country) ?? row.country,
    frequency: parseFrequency(row.frequency),
    lastSentAt: row.last_sent_at ? toIso(row.last_sent_at) : null,
  }));
  if (listed.length) return listed;
  const prefs = await loadAlertPrefs(userId);
  return prefs.countries.map((country) => ({
    country,
    frequency: prefs.frequency,
    lastSentAt: prefs.lastSentAt,
  }));
}

export async function isCountryFollow(userId: string, country: string) {
  const key = resolveCountry(country) ?? country.trim();
  const follows = await loadCountryFollows(userId);
  return follows.some((row) => countryKey(row.country) === countryKey(key));
}

export async function setCountryFollow(
  userId: string,
  country: string,
  following: boolean,
  frequency?: AlertFrequency,
) {
  await ensureAlertTables();
  await ensurePrefsRow(userId);
  const key = resolveCountry(country) ?? country.trim();
  if (!key) return { following: false, frequency: "every" as AlertFrequency };
  const sql = await getSql();
  const cadence = parseFrequency(frequency ?? "every");
  if (!following) {
    await sql`
      delete from hub_country_follows
      where user_id = ${userId} and country = ${key}
    `;
    const prefs = await loadAlertPrefs(userId);
    await storeAlertPrefs(userId, {
      ...prefs,
      countries: prefs.countries.filter((name) => countryKey(name) !== countryKey(key)),
    });
    await deleteSubscription(userId, { kind: "country", targetId: key });
    return { following: false, frequency: cadence };
  }
  await sql`
    insert into hub_country_follows (user_id, country, frequency)
    values (${userId}, ${key}, ${cadence})
    on conflict (user_id, country) do update set frequency = excluded.frequency
  `;
  await upsertSubscription(userId, { kind: "country", targetId: key, targetName: key });
  const prefs = await loadAlertPrefs(userId);
  const countries = prefs.countries.some((name) => countryKey(name) === countryKey(key))
    ? prefs.countries
    : [...prefs.countries, key];
  await storeAlertPrefs(userId, { ...prefs, countries });
  return { following: true, frequency: cadence };
}

export async function getArtistFollowState(userId: string, artistSlug: string) {
  const follows = await loadAlertFollows(userId);
  const found = follows.find((row) => row.artistSlug === artistSlug);
  return found
    ? { following: true, frequency: found.frequency }
    : { following: false, frequency: "every" as AlertFrequency };
}

export async function listAlertLog(userId: string): Promise<AlertLogRow[]> {
  await ensureAlertTables();
  const sql = await getSql();
  const found = await sql<{
    id: number;
    sent_at: unknown;
    to_email: string;
    subject: string;
    event_count: number;
    ok: boolean;
    detail: string;
  }>`
    select id, sent_at, to_email, subject, event_count, ok, detail
    from hub_alert_log
    where user_id = ${userId}
    order by sent_at desc
    limit 4
  `;
  return found.map((row) => ({
    id: row.id,
    sentAt: toIso(row.sent_at),
    toEmail: row.to_email,
    subject: row.subject,
    eventCount: row.event_count,
    ok: row.ok,
    detail: row.detail,
  }));
}

function artistPath(slug: string, kind: string) {
  if (!slug) return "/concerts";
  if (kind === "musician") return `/musicians/${slug}`;
  if (slug === "django-reinhardt") return "/django";
  if (slug === "stephane-grappelli") return "/grappelli";
  if (slug === "denis-chang") return "/denis-chang";
  return `/musicians/${slug}`;
}

function eventHref(kind: AlertKind, slug: string, artistKind: string) {
  if (kind === "jam") return `/jams/${slug}`;
  if (kind === "festival") return `/festivals/${slug}`;
  return artistPath(slug, artistKind);
}

type RawEvent = {
  id: string;
  kind: AlertKind;
  title: string;
  artistName: string;
  artistSlug: string;
  artistKind: string;
  venue: string;
  city: string;
  country: string;
  startsAt: string;
  createdAt: string | null;
};

async function loadCandidates(): Promise<RawEvent[]> {
  try {
    const { listConcerts } = await import("@/lib/api");
    await listConcerts({ data: { filter: "upcoming" } });
  } catch {
    /* catalog seed is best-effort so cron still mails hub imports */
  }
  const sql = await getSql();
  const now = new Date().toISOString();
  const events: RawEvent[] = [];

  for (const row of await rows(
    sql<{
      id: number;
      title: string;
      artist_name: string;
      artist_slug: string;
      artist_kind: string;
      venue: string;
      city: string;
      country: string;
      starts_at: unknown;
      created_at: unknown;
    }>`
      select id, title, artist_name, artist_slug, artist_kind, venue, city, country, starts_at, created_at
      from hub_concerts
      where starts_at >= ${now}::timestamptz
      order by starts_at asc
    `,
  )) {
    events.push({
      id: `hub-c-${row.id}`,
      kind: "concert",
      title: row.title,
      artistName: row.artist_name,
      artistSlug: row.artist_slug,
      artistKind: row.artist_kind,
      venue: row.venue,
      city: row.city,
      country: row.country,
      startsAt: toIso(row.starts_at),
      createdAt: row.created_at ? toIso(row.created_at) : null,
    });
  }

  for (const row of await rows(
    sql<{
      id: number;
      title: string;
      display_name: string;
      slug: string;
      venue: string;
      city: string;
      country: string;
      starts_at: unknown;
      created_at: unknown;
    }>`
      select c.id, c.title, p.display_name, p.slug, c.venue, c.city, c.country, c.starts_at, c.created_at
      from concerts c
      join profiles p on p.user_id = c.user_id
      where c.starts_at >= ${now}::timestamptz
      order by c.starts_at asc
    `,
  )) {
    events.push({
      id: `c-${row.id}`,
      kind: "concert",
      title: row.title,
      artistName: row.display_name,
      artistSlug: row.slug,
      artistKind: "musician",
      venue: row.venue,
      city: row.city,
      country: row.country,
      startsAt: toIso(row.starts_at),
      createdAt: row.created_at ? toIso(row.created_at) : null,
    });
  }

  for (const row of await rows(
    sql<{
      id: number;
      title: string;
      name: string;
      slug: string;
      venue: string;
      city: string;
      country: string;
      starts_at: unknown;
    }>`
      select lc.id, lc.title, l.name, l.slug, lc.venue, lc.city, lc.country, lc.starts_at
      from legend_concerts lc
      join legends l on l.slug = lc.legend_slug
      where lc.is_historic = false
        and lc.starts_at >= ${now}::timestamptz
      order by lc.starts_at asc
    `,
  )) {
    events.push({
      id: `l-${row.id}`,
      kind: "concert",
      title: row.title,
      artistName: row.name,
      artistSlug: row.slug,
      artistKind: "legend",
      venue: row.venue,
      city: row.city,
      country: row.country,
      startsAt: toIso(row.starts_at),
      createdAt: null,
    });
  }

  for (const row of await rows(
    sql<{
      slug: string;
      name: string;
      venue: string;
      city: string;
      country: string;
      next_starts_at: unknown;
      created_at: unknown;
    }>`
      select slug, name, venue, city, country, next_starts_at, created_at
      from hub_jams
      where next_starts_at >= ${now}::timestamptz
      order by next_starts_at asc
    `,
  )) {
    events.push({
      id: `jam-${row.slug}`,
      kind: "jam",
      title: row.name,
      artistName: row.name,
      artistSlug: row.slug,
      artistKind: "jam",
      venue: row.venue,
      city: row.city,
      country: row.country,
      startsAt: toIso(row.next_starts_at),
      createdAt: row.created_at ? toIso(row.created_at) : null,
    });
  }

  for (const row of await rows(
    sql<{
      slug: string;
      name: string;
      city: string;
      country: string;
      next_starts_at: unknown;
      created_at: unknown;
    }>`
      select slug, name, city, country, next_starts_at, created_at
      from hub_festivals
      where next_starts_at >= ${now}::timestamptz
      order by next_starts_at asc
    `,
  )) {
    events.push({
      id: `fest-${row.slug}`,
      kind: "festival",
      title: row.name,
      artistName: row.name,
      artistSlug: row.slug,
      artistKind: "festival",
      venue: "",
      city: row.city,
      country: row.country,
      startsAt: toIso(row.next_starts_at),
      createdAt: row.created_at ? toIso(row.created_at) : null,
    });
  }

  return events;
}

function countryKey(raw: string) {
  return resolveCountry(raw) ?? raw.trim();
}

function matchesCountry(eventCountry: string, selected: string[]) {
  if (selected.length === 0) return false;
  const key = countryKey(eventCountry);
  return selected.some((name) => countryKey(name) === key);
}

function isFresh(event: RawEvent, sinceMs: number, untilMs: number) {
  const created = event.createdAt ? Date.parse(event.createdAt) : Number.NaN;
  if (Number.isFinite(created) && created >= sinceMs) return true;
  const start = Date.parse(event.startsAt);
  return Number.isFinite(start) && start >= Date.now() - 60_000 && start <= untilMs;
}

function isDueFollow(frequency: AlertFrequency | undefined, lastSentAt: string | null | undefined, now: number) {
  return isDueFollowCadence(parseFrequency(frequency), lastSentAt, now);
}

function isDueFollowCadence(frequency: AlertFrequency, lastSentAt: string | null | undefined, now: number) {
  if (frequency === "every") return true;
  if (!lastSentAt) return true;
  const last = Date.parse(lastSentAt);
  if (!Number.isFinite(last)) return true;
  return now - last >= INTERVAL_MS[frequency];
}

function sinceFollow(frequency: AlertFrequency | undefined, lastSentAt: string | null | undefined, now: number) {
  const cadence = parseFrequency(frequency);
  if (lastSentAt) {
    const last = Date.parse(lastSentAt);
    if (Number.isFinite(last)) return last;
  }
  return now - INTERVAL_MS[cadence];
}

export async function matchingEvents(
  prefs: AlertPrefs,
  follows: AlertFollow[],
  countryFollows: CountryFollow[],
  now = Date.now(),
  userId?: string,
): Promise<AlertEvent[]> {
  const dueFollows = follows.filter((row) => isDueFollow(row.frequency, row.lastSentAt, now));
  const dueCountries = (countryFollows.length ? countryFollows : prefs.countries.map((country) => ({
    country,
    frequency: prefs.frequency,
    lastSentAt: prefs.lastSentAt,
  }))).filter((row) => isDueFollow(row.frequency, row.lastSentAt, now));
  const followSlugs = new Map(dueFollows.map((row) => [row.artistSlug, row]));
  const kinds = new Set(prefs.kinds);
  const seen = new Set<string>();
  const out: AlertEvent[] = [];
  const itemSubs = userId ? await loadSubscriptions(userId) : [];
  const concertIds = new Set(itemSubs.filter((row) => row.kind === "concert").map((row) => row.targetId));
  const jamIds = new Set(itemSubs.filter((row) => row.kind === "jam").map((row) => row.targetId));
  const festivalIds = new Set(itemSubs.filter((row) => row.kind === "festival").map((row) => row.targetId));

  for (const event of await loadCandidates()) {
    const follow = event.kind === "concert" ? followSlugs.get(event.artistSlug) : undefined;
    const countryHit = kinds.has(event.kind)
      ? dueCountries.find((row) => countryKey(row.country) === countryKey(event.country))
      : undefined;
    const itemHit =
      (event.kind === "concert" && (concertIds.has(event.id) || concertIds.has(event.artistSlug))) ||
      (event.kind === "jam" && (jamIds.has(event.artistSlug) || jamIds.has(event.id) || jamIds.has(event.id.replace(/^jam-/, "")))) ||
      (event.kind === "festival" && (festivalIds.has(event.artistSlug) || festivalIds.has(event.id)));
    if (!follow && !countryHit && !itemHit) continue;
    const sinceMs = Math.min(
      follow ? sinceFollow(follow.frequency, follow.lastSentAt, now) : Number.POSITIVE_INFINITY,
      countryHit ? sinceFollow(countryHit.frequency, countryHit.lastSentAt, now) : Number.POSITIVE_INFINITY,
      itemHit ? now - INTERVAL_MS.every : Number.POSITIVE_INFINITY,
    );
    const untilMs = now + INTERVAL_MS[parseFrequency(follow?.frequency ?? countryHit?.frequency)];
    if (!isFresh(event, sinceMs, untilMs)) continue;
    if (seen.has(event.id)) continue;
    seen.add(event.id);
    out.push({
      id: event.id,
      kind: event.kind,
      title: event.title,
      artistName: event.artistName,
      artistSlug: event.artistSlug,
      venue: event.venue,
      city: event.city,
      country: event.country,
      startsAt: event.startsAt,
      href: eventHref(event.kind, event.artistSlug, event.artistKind),
      reason: follow || itemHit ? "follow" : "country",
    });
  }

  out.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  return out.slice(0, 40);
}

function kindLabel(kind: AlertKind) {
  if (kind === "jam") return "JAM SESSIONS";
  if (kind === "festival") return "FESTIVALS";
  return "CONCERTS";
}

function eventLine(event: AlertEvent) {
  const when = formatConcertWhen(event.startsAt);
  const place = [event.venue, event.city, displayCountry(event.country)]
    .filter(Boolean)
    .join(", ");
  const bill =
    event.kind === "concert" && event.title && event.title !== event.artistName
      ? `${event.artistName} — ${event.title}`
      : event.title || event.artistName;
  return `- ${bill}\n  ${when}${place ? ` · ${place}` : ""}\n  ${HUB}${event.href}`;
}

function frequencyWord(frequency: AlertFrequency) {
  if (frequency === "every") return "latest";
  if (frequency === "monthly") return "monthly";
  return "weekly";
}

export function buildAlertMail(
  prefs: AlertPrefs,
  events: AlertEvent[],
  name: string,
) {
  const day = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Amsterdam",
  });
  const subject = `Gypsy Jazz Hub — ${events.length} new date${events.length === 1 ? "" : "s"} (${day})`;
  const chunks: string[] = [
    "Gypsy Jazz Hub",
    `Hello${name ? ` ${name}` : ""},`,
    "",
    `Your ${frequencyWord(prefs.frequency)} dates from the circle.`,
    "",
  ];
  for (const kind of ALERT_KINDS) {
    const group = events.filter((event) => event.kind === kind);
    if (!group.length) continue;
    chunks.push(`${kindLabel(kind)} (${group.length})`);
    for (const event of group) chunks.push(eventLine(event));
    chunks.push("");
  }
  if (prefs.countries.length) {
    chunks.push("COUNTRY AGENDAS");
    for (const country of prefs.countries) {
      chunks.push(`- ${displayCountry(country)}: ${HUB}/world/${countrySlug(country)}`);
    }
    chunks.push("");
  }
  chunks.push(`All concerts: ${HUB}/concerts`);
  chunks.push(`Jams: ${HUB}/jams`);
  chunks.push("");
  chunks.push(`Change countries, event types or artists: ${HUB}/studio`);
  chunks.push("Made by Daniel Gueli");
  return { subject, body: chunks.join("\n") };
}

async function userEmail(userId: string) {
  const sql = await getSql();
  const found = await sql<{ email: string; name: string }>`
    select email, name from "user" where id = ${userId} limit 1
  `;
  return found[0] ?? null;
}

function isDue(prefs: AlertPrefs, now: number) {
  if (!prefs.enabled) return false;
  if (!prefs.lastSentAt) return true;
  const last = Date.parse(prefs.lastSentAt);
  if (!Number.isFinite(last)) return true;
  return now - last >= INTERVAL_MS[prefs.frequency];
}

export type AlertSendResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  detail?: string;
  eventCount: number;
  subject?: string;
};

async function sendForUser(
  userId: string,
  source: "cron" | "test",
): Promise<AlertSendResult> {
  await ensureAlertTables();
  await ensurePrefsRow(userId);
  const [prefs, follows, countryFollows, account] = await Promise.all([
    loadAlertPrefs(userId),
    loadAlertFollows(userId),
    loadCountryFollows(userId),
    userEmail(userId),
  ]);
  if (!prefs.enabled && source === "cron") {
    return { ok: true, skipped: true, reason: "Alerts are off.", eventCount: 0 };
  }
  const events = await matchingEvents(prefs, follows, countryFollows, Date.now(), userId);
  if (source === "cron" && events.length === 0) {
    return { ok: true, skipped: true, reason: "No matching new dates.", eventCount: 0 };
  }
  if (!account?.email.includes("@")) {
    return {
      ok: false,
      skipped: true,
      reason: "No email on this account.",
      eventCount: events.length,
    };
  }
  if (events.length === 0) {
    return { ok: true, skipped: true, reason: "No matching new dates.", eventCount: 0 };
  }
  const mail = buildAlertMail(prefs, events, account.name);
  const sql = await getSql();
  try {
    const detail = await sendHubMail(account.email, mail.subject, mail.body);
    await sql`
      insert into hub_alert_log (user_id, to_email, subject, body, event_count, ok, detail)
      values (${userId}, ${account.email}, ${mail.subject}, ${mail.body}, ${events.length}, ${true}, ${detail})
    `;
    await sql`
      update hub_alert_prefs set last_sent_at = now(), updated_at = now()
      where user_id = ${userId}
    `;
    const usedArtists = new Set(
      events.filter((event) => event.reason === "follow").map((event) => event.artistSlug),
    );
    const usedCountries = new Set(
      events.filter((event) => event.reason === "country").map((event) => countryKey(event.country)),
    );
    for (const follow of follows) {
      if (!usedArtists.has(follow.artistSlug)) continue;
      await sql`
        update hub_alert_follows set last_sent_at = now()
        where user_id = ${userId} and artist_slug = ${follow.artistSlug}
      `;
    }
    for (const follow of countryFollows) {
      if (!usedCountries.has(countryKey(follow.country))) continue;
      await sql`
        update hub_country_follows set last_sent_at = now()
        where user_id = ${userId} and country = ${follow.country}
      `;
    }
    return { ok: true, detail, eventCount: events.length, subject: mail.subject };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Send failed";
    await sql`
      insert into hub_alert_log (user_id, to_email, subject, body, event_count, ok, detail)
      values (${userId}, ${account.email}, ${mail.subject}, ${mail.body}, ${events.length}, ${false}, ${detail})
    `;
    return { ok: false, detail, eventCount: events.length, subject: mail.subject };
  }
}

export async function runAlerts(source: "cron" | "test") {
  await ensureAlertTables();
  const sql = await getSql();
  const users = await sql<{ user_id: string }>`
    select user_id from hub_alert_prefs where enabled = true
  `;
  const extra = await sql<{ follower_id: string }>`
    select distinct follower_id from follows
  `;
  const alertFollowers = await sql<{ user_id: string }>`
    select distinct user_id from hub_alert_follows
  `;
  const countryFollowers = await sql<{ user_id: string }>`
    select distinct user_id from hub_country_follows
  `;
  const ids = [
    ...new Set([
      ...users.map((row) => row.user_id),
      ...extra.map((row) => row.follower_id),
      ...alertFollowers.map((row) => row.user_id),
      ...countryFollowers.map((row) => row.user_id),
    ]),
  ];
  const results: { userId: string; result: AlertSendResult }[] = [];
  for (const userId of ids.slice(0, 80)) {
    results.push({ userId, result: await sendForUser(userId, source) });
  }
  const sent = results.filter((row) => row.result.ok && !row.result.skipped).length;
  const skipped = results.filter((row) => row.result.skipped).length;
  const failed = results.filter((row) => !row.result.ok && !row.result.skipped).length;
  return { sent, skipped, failed, checked: results.length };
}

export const getAlertPrefs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureAlertTables();
    const prefs = await loadAlertPrefs(context.userId);
    const follows = await loadAlertFollows(context.userId);
    const countries = await loadCountryFollows(context.userId);
    const log = await listAlertLog(context.userId);
    const account = await userEmail(context.userId);
    return {
      prefs,
      follows,
      countries,
      log,
      email: account?.email ?? "",
    };
  });

export const saveAlertPrefs = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { countries: string[]; kinds: AlertKind[]; frequency: AlertFrequency; enabled: boolean }) => input)
  .handler(async ({ context, data }) => {
    const saved = await storeAlertPrefs(context.userId, data);
    const current = await loadCountryFollows(context.userId);
    const keep = new Set(data.countries.map((name) => resolveCountry(name) ?? name));
    for (const row of current) {
      const key = resolveCountry(row.country) ?? row.country;
      if (!keep.has(key)) await setCountryFollow(context.userId, key, false);
    }
    for (const name of data.countries) {
      const existing = current.find((row) => countryKey(row.country) === countryKey(name));
      await setCountryFollow(context.userId, name, true, existing?.frequency ?? data.frequency);
    }
    return saved;
  });

export const listMyAlertFollows = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadAlertFollows(context.userId));

export const isAlertFollowing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((artistSlug: string) => artistSlug)
  .handler(async ({ context, data }) => getArtistFollowState(context.userId, data));

export const toggleAlertFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: AlertFollow) => input)
  .handler(async ({ context, data }) => {
    const current = await getArtistFollowState(context.userId, data.artistSlug);
    if (current.following && data.frequency && data.frequency !== current.frequency) {
      return setAlertFollow(context.userId, { ...data, frequency: data.frequency }, true);
    }
    return setAlertFollow(context.userId, { ...data, frequency: data.frequency || current.frequency }, !current.following);
  });

export const setArtistFollowCadence = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: AlertFollow) => input)
  .handler(async ({ context, data }) => setAlertFollow(context.userId, data, true));

export const getCountryFollowState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((country: string) => country)
  .handler(async ({ context, data }) => {
    const follows = await loadCountryFollows(context.userId);
    const key = resolveCountry(data) ?? data;
    const found = follows.find((row) => countryKey(row.country) === countryKey(key));
    return found
      ? { following: true, frequency: found.frequency }
      : { following: false, frequency: "every" as AlertFrequency };
  });

export const setCountryFollowCadence = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { country: string; following: boolean; frequency?: AlertFrequency }) => input)
  .handler(async ({ context, data }) =>
    setCountryFollow(context.userId, data.country, data.following, data.frequency),
  );

export const previewMyAlerts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const [prefs, follows, countries] = await Promise.all([
      loadAlertPrefs(context.userId),
      loadAlertFollows(context.userId),
      loadCountryFollows(context.userId),
    ]);
    const events = await matchingEvents(prefs, follows, countries, Date.now(), context.userId);
    const account = await userEmail(context.userId);
    const mail = events.length
      ? buildAlertMail(prefs, events, account?.name ?? "")
      : null;
    return { events, subject: mail?.subject ?? "", body: mail?.body ?? "" };
  });

export const sendMyAlertSample = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => sendForUser(context.userId, "test"));
