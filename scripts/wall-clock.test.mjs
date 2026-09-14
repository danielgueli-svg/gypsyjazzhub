import assert from "node:assert/strict";
import { test } from "node:test";

function wallClockIso(value) {
  const raw = value.trim();
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) {
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? raw : parsed.toISOString();
  }
  const sec = match[4] ?? "00";
  return `${match[1]}T${match[2]}:${match[3]}:${sec}.000Z`;
}

function toWallClockInput(iso) {
  const match = iso.trim().match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/);
  if (match) return `${match[1]}T${match[2]}:${match[3]}`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function formatWhen(iso, timeZone = "Europe/Amsterdam") {
  const date = new Date(wallClockIso(iso));
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("weekday")} ${get("day")} ${get("month")} ${get("year")} · ${get("hour").padStart(2, "0")}:${get("minute")}`;
}

function viewerLocal(iso, timeZone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

test("posted 18:00 in Alkmaar stays 18:00, not Amsterdam 20:00", () => {
  const stored = wallClockIso("2026-10-15T18:00");
  assert.equal(stored, "2026-10-15T18:00:00.000Z");
  assert.equal(toWallClockInput(stored), "2026-10-15T18:00");
  assert.match(formatWhen(stored), /15 Oct 2026 · 18:00/);
  assert.equal(viewerLocal(stored, "Europe/Amsterdam"), "20:00");
});

test("posted 15:00 in March stays 15:00, not Amsterdam 16:00", () => {
  const stored = wallClockIso("2027-03-21T15:00");
  assert.equal(stored, "2027-03-21T15:00:00.000Z");
  assert.match(formatWhen(stored), /21 Mar 2027 · 15:00/);
  assert.equal(viewerLocal(stored, "Europe/Amsterdam"), "16:00");
});

test("same clock in Tokyo and New York", () => {
  const stored = wallClockIso("2026-10-15T18:00");
  assert.match(formatWhen(stored, "Asia/Tokyo"), /18:00/);
  assert.match(formatWhen(stored, "America/New_York"), /18:00/);
});
