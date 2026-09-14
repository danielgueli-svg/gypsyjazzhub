/** Calendar day of a jam night (YYYY-MM-DD). Empty if the stamp is unusable. */
export function nightKey(iso: string) {
  const stamp = (iso ?? "").trim();
  if (stamp.length < 10) return "";
  const day = stamp.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : "";
}

export function todayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

/** After the posted night, the going-list is dropped so the next session starts empty. */
export function shouldPurgeGoing(night: string, currentNight: string, today = todayKey()) {
  if (!night) return true;
  if (currentNight && night !== currentNight) return true;
  if (today && night < today) return true;
  return false;
}

const TWO_DAYS_MS = 2 * 86_400_000;
const WINDOW_BEFORE = TWO_DAYS_MS + 12 * 3_600_000; // 60h
const WINDOW_AFTER = TWO_DAYS_MS - 12 * 3_600_000; // 36h

/** Cron window: mail roughly two days before the session. */
export function inTwoDayWindow(iso: string, now = Date.now()) {
  const start = Date.parse(iso);
  if (!Number.isFinite(start)) return false;
  const delta = start - now;
  return delta >= WINDOW_AFTER && delta <= WINDOW_BEFORE;
}

export const JAM_REMIND_HOURS = 48;
