import type { Concert } from "@/lib/api";
import type { Jam } from "@/lib/jams";
import { countrySlug } from "@/lib/geo";

export type AgendaKind = "jam" | "concert";

export type AgendaItem = {
  id: string;
  kind: AgendaKind;
  title: string;
  when: string;
  city: string;
  country: string;
  venue: string;
  href: string;
  type: string;
};

export type EventFilter = {
  country?: string;
  city?: string;
  weekday?: string;
  type?: string;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function weekdayName(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return WEEKDAYS[d.getDay()] ?? "";
}

export function weekdayOptions() {
  return WEEKDAYS;
}

export function concertToAgenda(concert: Concert): AgendaItem {
  return {
    id: `concert-${concert.id}`,
    kind: "concert",
    title: concert.title || concert.artistName,
    when: concert.startsAt,
    city: concert.city,
    country: concert.country,
    venue: concert.venue,
    href:
      concert.kind === "community"
        ? `/musicians/${concert.artistSlug}`
        : `/musicians/${concert.artistSlug}`,
    type: "concert",
  };
}

export function jamToAgenda(jam: Jam): AgendaItem {
  return {
    id: `jam-${jam.slug}`,
    kind: "jam",
    title: jam.name,
    when: jam.nextStartsAt,
    city: jam.city,
    country: jam.country,
    venue: jam.venue,
    href: `/jams/${jam.slug}`,
    type: jam.kind === "meetup" ? "sit-in" : "open",
  };
}

export function filterAgenda(items: AgendaItem[], opts: EventFilter) {
  return items.filter((item) => {
    if (opts.country && countrySlug(item.country) !== opts.country && item.country !== opts.country) {
      return false;
    }
    if (opts.city && item.city.trim().toLowerCase() !== opts.city.trim().toLowerCase()) return false;
    if (opts.weekday && weekdayName(item.when) !== opts.weekday) return false;
    if (opts.type && item.type !== opts.type) return false;
    return true;
  });
}

export function uniqueCities(items: { city: string }[]) {
  const set = new Set<string>();
  for (const item of items) {
    const city = item.city.trim();
    if (city) set.add(city);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function uniqueCountries(items: { country: string }[]) {
  const set = new Set<string>();
  for (const item of items) {
    const country = item.country.trim();
    if (country) set.add(country);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function itemsForDay(items: AgendaItem[], isoDay: string) {
  return items.filter((item) => item.when.slice(0, 10) === isoDay);
}

export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ date: string | null; day: number | null }> = [];
  for (let i = 0; i < start; i += 1) cells.push({ date: null, day: null });
  for (let d = 1; d <= days; d += 1) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date: iso, day: d });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
  return cells;
}

export function monthKey(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleString("en", { month: "long", year: "numeric" });
}

export function monthOptions(dates: string[]) {
  const keys = [...new Set(dates.map(monthKey).filter(Boolean))].sort();
  return keys.map((value) => ({ value, label: monthLabel(value) }));
}
