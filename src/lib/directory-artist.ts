import { getLegend, listCollaborators, listLegendConcerts } from "@/lib/api";
import { campsForArtist } from "@/lib/camps";
import { festivalsForArtist } from "@/lib/festivals";
import { listHubClips, listHubNotes, listJoinedArtists } from "@/lib/hub-api";
import { listGuestbook } from "@/lib/guestbook";
import { listArtistReviews } from "@/lib/concert-reviews";
import { bookerFor } from "@/lib/bookers";
import { bandsFor } from "@/lib/scene";
import { schoolsForArtist } from "@/lib/scene-guide";

export async function loadDirectoryArtist(slug: string) {
  const legend = await getLegend({ data: slug });
  if (!legend) return null;
  const [concerts, collaborators, clips, notes, joined, shoutouts, reports] = await Promise.all([
    listLegendConcerts({ data: slug }),
    listCollaborators({ data: slug }),
    listHubClips({ data: slug }),
    listHubNotes({ data: slug }),
    listJoinedArtists(),
    listGuestbook({ data: slug }),
    listArtistReviews({ data: slug }),
  ]);
  const member = joined.find((row) => row.slug === legend.slug) ?? null;
  return {
    legend,
    concerts,
    collaborators,
    clips,
    notes,
    shoutouts,
    reports,
    bands: bandsFor(legend.slug),
    festivals: festivalsForArtist(legend.slug, legend.samois),
    camps: campsForArtist(legend.slug),
    schools: schoolsForArtist(legend.slug),
    member,
    booker: bookerFor(legend.slug),
  };
}

export type DirectoryArtistData = NonNullable<Awaited<ReturnType<typeof loadDirectoryArtist>>>;
