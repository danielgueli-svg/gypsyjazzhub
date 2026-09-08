import type { Legend } from "@/lib/api";
import { countriesFromText, displayCountry, isPastLegend } from "@/lib/geo";
import type { Band } from "@/lib/scene";

export const MUSICIAN_LEAD_COUNTRIES = ["Netherlands", "France", "Belgium"];
export const GROUP_LEAD_COUNTRIES = ["Netherlands", "Germany", "France", "Belgium"];

export const INSTRUMENT_FAMILIES = [
  "Guitar",
  "Rhythm guitar",
  "Violin",
  "Double bass",
  "Vocal",
  "Accordion",
  "Harmonica",
  "Piano",
  "Clarinet / sax",
] as const;

export type InstrumentFamily = (typeof INSTRUMENT_FAMILIES)[number] | "Other";

export function countryOfOrigin(origin: string): string {
  const places = countriesFromText(origin);
  return places[0] ?? "Other";
}

export function cityOfOrigin(origin: string): string {
  const country = countryOfOrigin(origin);
  const parts = origin
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return "";
  const last = parts[parts.length - 1];
  if (countryOfOrigin(last) === country || last === country) {
    return parts.slice(0, -1).join(", ");
  }
  return "";
}

export function instrumentFamily(raw: string): InstrumentFamily {
  const s = raw.toLowerCase();
  if (s.includes("vocal") || s.includes("voice") || s.includes("singer")) return "Vocal";
  if (s.includes("violin") || s.includes("fiddle") || s.includes("viool")) return "Violin";
  if (s.includes("bass") || s.includes("basse") || s.includes("contrabas")) return "Double bass";
  if (s.includes("accordion") || s.includes("accordeon")) return "Accordion";
  if (s.includes("harmonica")) return "Harmonica";
  if (s.includes("piano")) return "Piano";
  if (s.includes("clarinet") || s.includes("sax")) return "Clarinet / sax";
  if (s.includes("rhythm") || s.includes("ritme")) return "Rhythm guitar";
  if (s.includes("guitar") || s.includes("gitaar") || s.includes("solo")) return "Guitar";
  return "Other";
}

export function musicianStyle(legend: Legend): "playing" | "legends" {
  return isPastLegend(legend.years) ? "legends" : "playing";
}

export function filterMusicians(
  legends: Legend[],
  opts: { q?: string; instrument?: string; location?: string; style?: string; country?: string },
) {
  const q = opts.q?.trim().toLowerCase() ?? "";
  return legends.filter((legend) => {
    if (q) {
      const hay = `${legend.name} ${legend.origin} ${legend.instruments} ${legend.bio} ${legend.notable}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (opts.instrument && instrumentFamily(legend.instruments) !== opts.instrument) return false;
    if (opts.country && countryOfOrigin(legend.origin) !== opts.country) return false;
    if (opts.location && cityOfOrigin(legend.origin) !== opts.location) return false;
    if (opts.style && musicianStyle(legend) !== opts.style) return false;
    return true;
  });
}

export function musicianCountries(legends: Legend[]) {
  const counts: Record<string, number> = {};
  for (const legend of legends) {
    const country = countryOfOrigin(legend.origin);
    counts[country] = (counts[country] ?? 0) + 1;
  }
  return orderCountries(Object.keys(counts), MUSICIAN_LEAD_COUNTRIES, counts).map((name) => ({
    name,
    count: counts[name] ?? 0,
  }));
}

export function musicianCities(legends: Legend[], country?: string) {
  const counts: Record<string, number> = {};
  for (const legend of legends) {
    if (country && countryOfOrigin(legend.origin) !== country) continue;
    const city = cityOfOrigin(legend.origin);
    if (!city) continue;
    counts[city] = (counts[city] ?? 0) + 1;
  }
  return Object.keys(counts).sort(
    (a, b) => (counts[b] ?? 0) - (counts[a] ?? 0) || a.localeCompare(b),
  );
}

export function orderCountries(countries: string[], lead: string[], counts: Record<string, number>) {
  const present = [...new Set(countries)];
  const head = lead.filter((name) => present.includes(name));
  const rest = present
    .filter((name) => !lead.includes(name))
    .sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0) || a.localeCompare(b));
  return [...head, ...rest];
}

export function musiciansByCountry(legends: Legend[]) {
  const buckets = new Map<string, { playing: Legend[]; past: Legend[] }>();
  for (const legend of legends) {
    const country = countryOfOrigin(legend.origin);
    const row = buckets.get(country) ?? { playing: [], past: [] };
    if (isPastLegend(legend.years)) row.past.push(legend);
    else row.playing.push(legend);
    buckets.set(country, row);
  }
  const counts: Record<string, number> = {};
  for (const [country, row] of buckets) {
    row.playing.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
    row.past.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
    counts[country] = row.playing.length + row.past.length;
  }
  const order = orderCountries([...buckets.keys()], MUSICIAN_LEAD_COUNTRIES, counts);
  return order.map((country) => {
    const row = buckets.get(country) ?? { playing: [], past: [] };
    return {
      country,
      label: displayCountry(country),
      total: counts[country] ?? 0,
      playing: row.playing,
      past: row.past,
    };
  });
}

export function groupsByCountry(bands: Band[]) {
  const buckets = new Map<string, Band[]>();
  for (const band of bands) {
    const country = band.country || countryOfOrigin(band.origin);
    const list = buckets.get(country) ?? [];
    list.push(band);
    buckets.set(country, list);
  }
  const counts: Record<string, number> = {};
  for (const [country, list] of buckets) {
    list.sort((a, b) => a.name.localeCompare(b.name));
    counts[country] = list.length;
  }
  const order = orderCountries([...buckets.keys()], GROUP_LEAD_COUNTRIES, counts);
  return order.map((country) => ({
    country,
    label: displayCountry(country),
    groups: buckets.get(country) ?? [],
  }));
}
