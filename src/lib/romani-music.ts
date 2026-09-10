/** Sister site for the country archive. Hub stays the source of truth. */

import {
  archiveBandsForCountry,
  archiveIndex,
  archiveSourcesForCountry,
} from "@/lib/archive";
import { archiveVideosForCountry } from "@/lib/archive-videos";
import { familiesForCountry } from "@/lib/families";

export const ROMANI_MUSIC_SITE = "https://www.romanimusic.com";

export function romaniMusicCountryUrl(slug: string) {
  return `${ROMANI_MUSIC_SITE}/${slug}`;
}

export function romaniMusicExport() {
  return {
    source: "Gypsy Jazz Hub",
    sister: ROMANI_MUSIC_SITE,
    note: "Country archive only — families, older orchestras, past chairs, sourced clips. Live jams and concerts stay on the hub.",
    countries: archiveIndex().map((row) => ({
      country: row.country,
      slug: row.slug,
      hub: `/archive/${row.slug}`,
      romaniMusic: romaniMusicCountryUrl(row.slug),
      families: familiesForCountry(row.country).map((family) => ({
        slug: family.slug,
        name: family.name,
        kicker: family.kicker,
        summary: family.summary,
        href: family.href,
        members: family.members,
      })),
      orchestras: archiveBandsForCountry(row.country).map((band) => ({
        slug: band.slug,
        name: band.name,
        origin: band.origin,
        country: band.country,
        bio: band.bio,
      })),
      sources: archiveSourcesForCountry(row.country),
      clips: archiveVideosForCountry(row.country).map((clip) => ({
        id: clip.id,
        title: clip.title,
        youtube: `https://www.youtube.com/watch?v=${clip.id}`,
      })),
    })),
  };
}
