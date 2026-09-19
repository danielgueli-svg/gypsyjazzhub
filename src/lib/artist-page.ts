/** Extra labelled links and a photo URL on a musician or group page.
 *  Stored on hub_artist_bios next to the member-edited bio. */

export type HubArtistLink = {
  label: string;
  url: string;
};

export type HubArtistPage = {
  bio: string;
  links: HubArtistLink[];
  photoUrl: string;
  bookingUrl: string;
};

export const MAX_PAGE_LINKS = 12;
const MAX_LABEL = 80;
const MAX_URL = 500;

const SAFE_PATH = /^\/[A-Za-z0-9/_\-.~?=&%+#]*$/;

export function emptyArtistPage(): HubArtistPage {
  return { bio: "", links: [], photoUrl: "", bookingUrl: "" };
}

export function parseArtistLinks(raw: unknown): HubArtistLink[] {
  if (!raw) return [];
  let value: unknown = raw;
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text || text === "[]") return [];
    try {
      value = JSON.parse(text);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  const out: HubArtistLink[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as { label?: unknown; url?: unknown; href?: unknown };
    const label = String(row.label ?? "").trim();
    const url = sanitizePageUrl(String(row.url ?? row.href ?? ""));
    if (!label || !url) continue;
    const key = url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ label: label.slice(0, MAX_LABEL), url });
    if (out.length >= MAX_PAGE_LINKS) break;
  }
  return out;
}

export function sanitizePageUrl(raw: string): string {
  const value = raw.trim();
  if (!value || value.length > MAX_URL) return "";
  if (value.startsWith("/")) {
    if (value.startsWith("//") || !SAFE_PATH.test(value)) return "";
    return value;
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return "";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
  if (!parsed.hostname) return "";
  return parsed.toString();
}

export function sanitizePhotoUrl(raw: string): string {
  return sanitizePageUrl(raw);
}

export function sanitizeBookingUrl(raw: string): string {
  const value = raw.trim();
  if (!value || value.length > MAX_URL) return "";
  if (value.includes("@") && !value.includes(" ")) {
    const email = value.replace(/^mailto:/i, "");
    return email.includes("@") ? `mailto:${email}` : "";
  }
  return sanitizePageUrl(value) || (looksLikeHost(value) ? `https://${value}` : "");
}

function looksLikeHost(value: string) {
  return /^[a-z0-9.-]+\.[a-z]{2,}([/?#].*)?$/i.test(value) && !value.includes(" ");
}

export function normalizeArtistLinks(
  rows: { label?: string; url?: string }[],
): HubArtistLink[] {
  return parseArtistLinks(rows);
}

export function mergePageLinks(
  catalog: { href: string; label: string }[],
  extra: HubArtistLink[],
): { href: string; label: string }[] {
  const seen = new Set<string>();
  const out: { href: string; label: string }[] = [];
  for (const link of [
    ...catalog,
    ...extra.map((row) => ({ href: row.url, label: row.label })),
  ]) {
    const href = link.href.trim();
    const label = link.label.trim();
    if (!href || !label) continue;
    const key = href.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ href, label });
  }
  return out;
}

export function pageLinkAttrs(href: string): {
  target?: "_blank";
  rel?: "noreferrer";
} {
  return /^https?:\/\//i.test(href) ? { target: "_blank", rel: "noreferrer" } : {};
}
