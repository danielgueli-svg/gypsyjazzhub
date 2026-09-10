import type { Concert } from "@/lib/api";
import { LEGEND_CONCERTS, LEGENDS } from "@/lib/seed-data";

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function urlFromText(text: string) {
  return (text ?? "").match(/https?:\/\/[^\s)]+/i)?.[0] ?? "";
}

type NameSlug = { name: string; slug: string; needle: string };

let nameIndex: NameSlug[] | null = null;

function artistNames(): NameSlug[] {
  if (nameIndex) return nameIndex;
  const rows: NameSlug[] = [];
  for (const legend of LEGENDS) {
    const names = [legend.name, legend.slug.replace(/-/g, " ")];
    for (const name of names) {
      const needle = fold(name.trim());
      if (!needle) continue;
      rows.push({ name, slug: legend.slug, needle });
    }
  }
  rows.sort((a, b) => b.needle.length - a.needle.length);
  nameIndex = rows;
  return rows;
}

/** Longest-name-wins substring match against LEGENDS. Empty if not confident. */
export function resolveArtistSlug(title: string, extra = ""): string {
  const hay = fold(`${title} ${extra}`.trim());
  if (!hay) return "";
  for (const row of artistNames()) {
    const tooShort = row.needle.length < 8 && !row.needle.includes(" ");
    if (tooShort) continue;
    if (hay.includes(row.needle)) return row.slug;
  }
  return "";
}

export function liveConcertsSeed(): Concert[] {
  return LEGEND_CONCERTS.filter((concert) => !concert.is_historic).map((concert, index) => {
    const artistSlug =
      concert.legend_slug || resolveArtistSlug(concert.title) || "";
    const artistName =
      LEGENDS.find((row) => row.slug === artistSlug)?.name || concert.title;
    return {
      id: `live-${artistSlug || index}-${concert.starts_at}`,
      kind: "legend" as const,
      title: concert.title,
      venue: concert.venue,
      city: concert.city,
      country: concert.country,
      startsAt: concert.starts_at,
      description: concert.note,
      ticketUrl: urlFromText(concert.note),
      isHistoric: false,
      artistName,
      artistSlug,
    };
  });
}
