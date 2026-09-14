import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import {
  cs,
  de,
  es,
  fr,
  he,
  hr,
  hu,
  id as idLocale,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  ro,
  ru,
  sr,
  th,
  zhCN,
  zhTW,
} from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "musician";
}

export function formatInstrumentList(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function toIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
  }
  return String(value ?? "");
}

/**
 * Keep the posted clock. datetime-local `2026-10-15T18:00` in Alkmaar must stay
 * 18:00 on the hub in every country — not shift to the viewer's timezone.
 */
export function wallClockIso(value: string) {
  const raw = value.trim();
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) {
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? raw : parsed.toISOString();
  }
  const sec = match[4] ?? "00";
  return `${match[1]}T${match[2]}:${match[3]}:${sec}.000Z`;
}

export function toWallClockInput(iso: string) {
  const match = iso.trim().match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/);
  if (match) return `${match[1]}T${match[2]}:${match[3]}`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function wallDate(iso: string) {
  const date = new Date(wallClockIso(iso));
  if (Number.isNaN(date.getTime())) return null;
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

const FNS_LOCALES: Record<string, typeof fr> = {
  fr,
  de,
  nl,
  es,
  it,
  pt,
  ru,
  ja,
  ko,
  zh: zhCN,
  "zh-tw": zhTW,
  id: idLocale,
  th,
  hu,
  pl,
  cs,
  hr,
  ro,
  sr,
  he,
};

function withLocale(iso: string, pattern: string, locale?: string) {
  const date = wallDate(iso);
  if (!date) return iso;
  const loc = locale ? FNS_LOCALES[locale] : undefined;
  return loc ? format(date, pattern, { locale: loc }) : format(date, pattern);
}

export function formatLocalDate(iso: string, pattern: string, locale?: string) {
  return withLocale(iso, pattern, locale);
}

export function formatConcertWhen(iso: string, locale?: string) {
  return withLocale(iso, "EEE d MMM yyyy · HH:mm", locale);
}

export function concertShareLine(concert: {
  title?: string;
  artistName: string;
  venue?: string;
  city?: string;
  country?: string;
  startsAt: string;
}) {
  const bill = concert.title?.trim() || concert.artistName;
  const where = [concert.venue, concert.city, concert.country].filter(Boolean).join(", ");
  return `${formatConcertWhen(concert.startsAt)} — ${bill}${where ? ` — ${where}` : ""}`;
}

export function concertAgendaText(
  concerts: {
    title?: string;
    artistName: string;
    venue?: string;
    city?: string;
    country?: string;
    startsAt: string;
  }[],
  heading: string,
  limit = 5,
) {
  const rows = concerts.slice(0, limit);
  if (rows.length === 0) return heading;
  return [heading, "", ...rows.map((concert) => `• ${concertShareLine(concert)}`)].join("\n");
}

export function formatConcertDay(iso: string, locale?: string) {
  return withLocale(iso, "d MMM", locale);
}

export function formatConcertYear(iso: string) {
  const date = wallDate(iso);
  if (!date) return "";
  return format(date, "yyyy");
}

export function youtubeVideoId(url: string): string | null {
  const value = url.trim();
  if (!value) return null;
  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return fromQuery;
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (
        (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") &&
        parts[1]
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function contactHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(mailto:|tel:|https?:\/\/)/i.test(trimmed)) return trimmed;
  if (trimmed.includes("@") && !trimmed.includes(" ")) return `mailto:${trimmed}`;
  const digits = trimmed.replace(/[\s()./-]/g, "");
  if (/^\+?\d{6,16}$/.test(digits)) return `tel:${digits}`;
  return `https://${trimmed}`;
}
