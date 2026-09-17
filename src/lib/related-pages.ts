import { getLuthier } from "@/lib/luthiers";

/** Catalog people who have both a musician page and a workshop page. */
export const ARTIST_TO_LUTHIER: Record<string, string> = {
  "leen-de-keijzer": "de-molenhoek",
};

const LUTHIER_TO_ARTIST: Record<string, string> = Object.fromEntries(
  Object.entries(ARTIST_TO_LUTHIER).map(([artist, luthier]) => [luthier, artist]),
);

export function luthierSlugForArtist(artistSlug: string): string | undefined {
  return ARTIST_TO_LUTHIER[artistSlug] ?? getLuthier(artistSlug)?.slug;
}

export function artistSlugForLuthier(luthierSlug: string): string | undefined {
  return LUTHIER_TO_ARTIST[luthierSlug];
}
