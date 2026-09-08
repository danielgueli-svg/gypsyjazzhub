const RETURN_KEY = "gjh-return-to";
const RSVP_KEY = "gjh-pending-rsvp";

export type PendingRsvp = { kind: "jam" | "concert"; targetId: string };

function safePath(raw: string) {
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (!/^\/(jams|concerts)\/[A-Za-z0-9._~-]+$/.test(path)) return null;
  return path;
}

export function setReturnTo(path: string) {
  if (typeof sessionStorage === "undefined") return;
  const next = safePath(path);
  if (next) sessionStorage.setItem(RETURN_KEY, next);
}

export function takeReturnTo(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(RETURN_KEY);
  sessionStorage.removeItem(RETURN_KEY);
  return raw ? safePath(raw) : null;
}

export function peekReturnTo(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(RETURN_KEY);
  return raw ? safePath(raw) : null;
}

export function setPendingRsvp(kind: "jam" | "concert", targetId: string) {
  if (typeof sessionStorage === "undefined") return;
  const id = targetId.trim();
  if (!id) return;
  sessionStorage.setItem(RSVP_KEY, JSON.stringify({ kind, targetId: id } satisfies PendingRsvp));
}

export function peekPendingRsvp(): PendingRsvp | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(RSVP_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PendingRsvp;
    if ((parsed.kind === "jam" || parsed.kind === "concert") && parsed.targetId?.trim()) {
      return { kind: parsed.kind, targetId: parsed.targetId.trim() };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function takePendingRsvp(): PendingRsvp | null {
  const pending = peekPendingRsvp();
  if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(RSVP_KEY);
  return pending;
}
