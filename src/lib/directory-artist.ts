import {
  catalogCollaborators,
  catalogConcertsFor,
  catalogLegend,
  getLegend,
  listCollaborators,
  listLegendConcerts,
} from "@/lib/api";
import { campsForArtist } from "@/lib/camps";
import { festivalsForArtist } from "@/lib/festivals";
import { listHubClips, listHubNotes, listJoinedArtists } from "@/lib/hub-api";
import { listGuestbook, seedGuestbook } from "@/lib/guestbook";
import { listArtistReviews } from "@/lib/concert-reviews";
import { bookerFor } from "@/lib/bookers";
import { bandsFor } from "@/lib/scene";
import { schoolsForArtist } from "@/lib/scene-guide";
import { settle } from "@/lib/settle";

export async function loadArtistExtras(slug: string) {
  const [concerts, collaborators, clips, notes, joined, shoutouts, reports] = await Promise.all([
    settle("legend-concerts", catalogConcertsFor(slug), () => listLegendConcerts({ data: slug })),
    settle("collaborators", catalogCollaborators(slug), () => listCollaborators({ data: slug })),
    settle("clips", [], () => listHubClips({ data: slug })),
    settle("notes", [], () => listHubNotes({ data: slug })),
    settle("joined", [], () => listJoinedArtists()),
    settle("guestbook", seedGuestbook(slug), () => listGuestbook({ data: slug })),
    settle("reviews", [], () => listArtistReviews({ data: slug })),
  ]);
  return { concerts, collaborators, clips, notes, joined, shoutouts, reports };
}

export async function loadDirectoryArtist(slug: string) {
  const legend = await settle("legend", catalogLegend(slug), async () => {
    return (await getLegend({ data: slug })) ?? catalogLegend(slug);
  });
  if (!legend) return null;
  const extras = await loadArtistExtras(legend.slug);
  const member = extras.joined.find((row) => row.slug === legend.slug) ?? null;
  return {
    legend,
    concerts: extras.concerts,
    collaborators: extras.collaborators,
    clips: extras.clips,
    notes: extras.notes,
    shoutouts: extras.shoutouts,
    reports: extras.reports,
    bands: bandsFor(legend.slug),
    festivals: festivalsForArtist(legend.slug, legend.samois),
    camps: campsForArtist(legend.slug),
    schools: schoolsForArtist(legend.slug),
    member,
    booker: bookerFor(legend.slug),
  };
}

export type DirectoryArtistData = NonNullable<Awaited<ReturnType<typeof loadDirectoryArtist>>>;
