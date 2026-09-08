import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

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

export function formatConcertWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return format(date, "EEE d MMM yyyy · HH:mm");
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

export function formatConcertDay(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return format(date, "d MMM");
}

export function formatConcertYear(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
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
  if (trimmed.startsWith("mailto:") || /^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.includes("@") && !trimmed.includes(" ")) return `mailto:${trimmed}`;
  return `https://${trimmed}`;
}
