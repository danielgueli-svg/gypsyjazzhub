import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function nightKey(iso) {
  const stamp = (iso ?? "").trim();
  if (stamp.length < 10) return "";
  const day = stamp.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : "";
}

function todayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

function shouldPurgeGoing(night, currentNight, today = todayKey()) {
  if (!night) return true;
  if (currentNight && night !== currentNight) return true;
  if (today && night < today) return true;
  return false;
}

const TWO_DAYS_MS = 2 * 86_400_000;
const WINDOW_BEFORE = TWO_DAYS_MS + 12 * 3_600_000;
const WINDOW_AFTER = TWO_DAYS_MS - 12 * 3_600_000;

function inTwoDayWindow(iso, now = Date.now()) {
  const start = Date.parse(iso);
  if (!Number.isFinite(start)) return false;
  const delta = start - now;
  return delta >= WINDOW_AFTER && delta <= WINDOW_BEFORE;
}

test("nightKey keeps YYYY-MM-DD and drops junk", () => {
  assert.equal(nightKey("2026-09-18T20:00:00.000Z"), "2026-09-18");
  assert.equal(nightKey("2026-09-18"), "2026-09-18");
  assert.equal(nightKey(""), "");
  assert.equal(nightKey("soon"), "");
  assert.equal(nightKey("18-09-2026"), "");
});

test("going list is dropped after the posted night", () => {
  assert.equal(shouldPurgeGoing("2026-09-10", "2026-09-18", "2026-09-14"), true);
  assert.equal(shouldPurgeGoing("2026-09-18", "2026-09-18", "2026-09-14"), false);
  assert.equal(shouldPurgeGoing("2026-09-18", "2026-09-25", "2026-09-14"), true);
  assert.equal(shouldPurgeGoing("2026-09-10", "2026-09-10", "2026-09-14"), true);
  assert.equal(shouldPurgeGoing("", "2026-09-18", "2026-09-14"), true);
});

test("reminder window is roughly two days before the session", () => {
  const start = Date.parse("2026-09-18T20:00:00.000Z");
  assert.equal(inTwoDayWindow("2026-09-18T20:00:00.000Z", start - 48 * 3_600_000), true);
  assert.equal(inTwoDayWindow("2026-09-18T20:00:00.000Z", start - 24 * 3_600_000), false);
  assert.equal(inTwoDayWindow("2026-09-18T20:00:00.000Z", start - 72 * 3_600_000), false);
  assert.equal(inTwoDayWindow("not-a-date", start), false);
});

test("going and reminder copy exists for every language", () => {
  const src = readFileSync(new URL("../src/lib/jam-going-copy.ts", import.meta.url), "utf8");
  const i18n = readFileSync(new URL("../src/lib/i18n.tsx", import.meta.url), "utf8");
  const locales = [
    "en", "es", "pt", "fr", "de", "nl", "it", "hu", "ro", "sr", "cs", "pl", "hr",
    "ru", "ja", "ko", "zh", "zh-tw", "id", "th",
  ];
  const keys = [
    "jam.going", "jam.goingNot", "jam.goingKicker", "jam.goingEmpty", "jam.goingCount",
    "jam.goingSignin", "jam.goingLead", "jam.goingNoNight", "jam.remind", "jam.remindOn",
    "jam.remindLead", "jam.remindSignin",
  ];
  for (const key of keys) {
    const hits = src.match(new RegExp(`"${key.replace(".", "\\.")}":`, "g")) ?? [];
    assert.equal(hits.length, locales.length, `${key} missing in some locales (${hits.length}/${locales.length})`);
  }
  for (const locale of locales) {
    const token = locale === "zh-tw" ? '"zh-tw"' : locale;
    assert.match(src, new RegExp(`${token}: \\{`));
    assert.match(i18n, /JAM_GOING_UI/);
    const spread = locale === "zh-tw" ? 'JAM_GOING_UI["zh-tw"]' : `JAM_GOING_UI.${locale}`;
    assert.match(i18n, new RegExp(spread.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(i18n, /he: \{.*JAM_GOING_UI\.en/s);
});

test("jam page wires night-scoped going and the reminder lives on the page", () => {
  const page = readFileSync(new URL("../src/routes/jams/$slug.tsx", import.meta.url), "utf8");
  const rsvp = readFileSync(new URL("../src/components/going-rsvp.tsx", import.meta.url), "utf8");
  const reminders = readFileSync(new URL("../src/lib/jam-reminders.ts", import.meta.url), "utf8");
  assert.match(page, /night=\{jam\.nextStartsAt\}/);
  assert.match(page, /jamName=\{jam\.name\}/);
  assert.match(rsvp, /toggleSubscription/);
  assert.match(rsvp, /jam\.remind/);
  assert.match(reminders, /hub_jam_going/);
  assert.doesNotMatch(reminders, /open_for_invites/);
  assert.doesNotMatch(reminders, /WINDOW_AFTER/);
});
