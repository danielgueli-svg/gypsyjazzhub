/** Country archive — older orchestras, family houses, past chairs. Not the live jam scene. */

import { FAMILIES, familiesForCountry } from "@/lib/families";
import { COUNTRY_OPTIONS, countrySlug, sameCountry } from "@/lib/geo";
import { BANDS, type Band } from "@/lib/scene";

const ARCHIVE_BAND_SLUGS = new Set([
  "tata-mirando-orkest",
  "jaroka-mirando-band",
  "veres-lajos-orchestre",
  "sandor-jaroka-orchestra",
  "lajos-boross-gypsy-band",
  "georges-boulanger-orchestra",
  "mera-gypsy-band",
  "taraful-palatca",
  "buffo-rigo-gypsy-band",
  "roma-heina-mirando-orkest",
  "moro-mirando-orkest",
  "erno-kallai-kiss-zenekara",
  "gabora-lajos-zenekara",
  "youri-farkas-zenekara",
  "lakatos-vilmos-orchestra",
  "lakatos-miklos-orchestra",
  "lakatos-pityu-zenekara",
  "kis-tyutyu-zenekara",
  "olah-vilmos-orchestra",
  "imre-magyari-orchestra",
  "virgil-radulescu-orchestra",
  "taraf-de-haidouks",
  "padar-lajos-orchestra",
  "dula-horvath-orchestra",
  "budapest-gypsy-symphony",
  "schnuckenack-reinhardt",
  "tonte-andras-zenekara",
  "balogh-janos-zenekara",
  "varga-jeno-zenekara",
  "santa-ferenc-zenekara",
  "gagyi-oszkar-zenekara",
  "puporka-geza-zenekara",
  "horvath-gyula-orchestra",
  "rene-bikar-orchestra",
]);

const ARCHIVE_NAME =
  /zenekara|gypsy orchestra|gipsy orchestra|taraf de|tagú|symphony orchestra|koninklijk zigeuner|orkest moro|tata mirando orkest/i;

export function isArchiveBand(band: { slug: string; name?: string }): boolean {
  if (ARCHIVE_BAND_SLUGS.has(band.slug)) return true;
  return ARCHIVE_NAME.test(band.name ?? "");
}

export function archiveBandsForCountry(country: string): Band[] {
  return BANDS.filter(
    (band) =>
      isArchiveBand(band) && (sameCountry(band.country, country) || sameCountry(band.origin, country)),
  );
}

export type ArchiveSource = { title: string; lead: string; url: string };

export function archiveSourcesForCountry(country: string): ArchiveSource[] {
  if (country === "Netherlands") {
    return [
      {
        title: "The International Archive for Sinti & Gypsy Music",
        lead: "Family YouTube channel, hosted by Moro and Lupa Heina Mirando. Orchestra nights, primas chairs and Dutch Sinti rooms.",
        url: "https://www.youtube.com/@theinternationalarchivefor9731",
      },
    ];
  }
  return [];
}

export type ArchiveCountryRow = {
  country: string;
  slug: string;
  families: number;
  orchestras: number;
};

export function archiveIndex(): ArchiveCountryRow[] {
  const byCountry = new Map<string, ArchiveCountryRow>();
  function row(country: string) {
    let next = byCountry.get(country);
    if (!next) {
      next = { country, slug: countrySlug(country), families: 0, orchestras: 0 };
      byCountry.set(country, next);
    }
    return next;
  }
  for (const family of FAMILIES) {
    for (const country of family.countries ?? [family.country]) {
      row(country).families += 1;
    }
  }
  for (const band of BANDS) {
    if (!isArchiveBand(band)) continue;
    row(band.country).orchestras += 1;
  }
  return [...byCountry.values()]
    .filter((item) => item.families + item.orchestras > 0)
    .sort((a, b) => a.country.localeCompare(b.country));
}

export function archiveEmptyCountries(): { country: string; slug: string }[] {
  const filled = new Set(archiveIndex().map((row) => row.country));
  return COUNTRY_OPTIONS.filter((country) => !filled.has(country))
    .map((country) => ({ country, slug: countrySlug(country) }))
    .sort((a, b) => a.country.localeCompare(b.country));
}

export function archiveCounts(country: string) {
  return {
    families: familiesForCountry(country).length,
    orchestras: archiveBandsForCountry(country).length,
  };
}
