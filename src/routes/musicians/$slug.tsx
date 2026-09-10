import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ArtistClips } from "@/components/artist-clips";
import { ArtistMusic } from "@/components/artist-music";
import { Contribute } from "@/components/contribute";
import { DirectoryArtistPage } from "@/components/directory-artist-page";
import { FollowArtist } from "@/components/follow-artist";
import { Guestbook } from "@/components/guestbook";
import { HubExtras } from "@/components/hub-extras";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import { ShareBox } from "@/components/share-page";
import { JamLine } from "@/components/jam-line";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getMusician,
  listMusicianConcerts,
  sendMessage,
  type Concert,
  type Profile,
} from "@/lib/api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { artistPhoto } from "@/lib/photos";
import { basedInCountry } from "@/lib/geo";
import { loadDirectoryArtist } from "@/lib/directory-artist";
import { listHubClips, listHubJams, listHubNotes } from "@/lib/hub-api";
import { upcomingJams } from "@/lib/jams";
import { listGuestbook } from "@/lib/guestbook";
import { listArtistReviews } from "@/lib/concert-reviews";
import { contactHref, concertShareLine, formatInstrumentList } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/musicians/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "django-reinhardt") throw redirect({ to: "/django" });
    if (params.slug === "stephane-grappelli") throw redirect({ to: "/grappelli" });
    if (params.slug === "tata-mirando") throw redirect({ to: "/tata-mirando" });
    if (params.slug === "denis-chang") throw redirect({ to: "/denis-chang" });
  },
  loader: async ({ params }) => {
    const directory = await loadDirectoryArtist(params.slug);
    if (directory) return { kind: "directory" as const, directory };
    const musician = await getMusician({ data: params.slug });
    if (!musician) throw notFound();
    if (musician.memberKind === "fan") {
      throw redirect({ to: "/fans/$slug", params: { slug: musician.slug } });
    }
    const [concerts, clips, notes, shoutouts, extraJams, reports] = await Promise.all([
      listMusicianConcerts({ data: musician.userId }),
      listHubClips({ data: musician.slug }),
      listHubNotes({ data: musician.slug }),
      listGuestbook({ data: musician.slug }),
      listHubJams(),
      listArtistReviews({ data: musician.slug }),
    ]);
    const city = musician.city.trim().toLowerCase();
    const nearbyJams = city
      ? [...upcomingJams(), ...extraJams]
          .filter((jam, i, all) => all.findIndex((row) => row.slug === jam.slug) === i)
          .filter((jam) => jam.city.trim().toLowerCase() === city)
          .slice(0, 6)
      : [];
    return { kind: "member" as const, musician, concerts, clips, notes, shoutouts, nearbyJams, reports };
  },
  head: ({ loaderData }) => {
    if (loaderData?.kind === "directory") {
      const legend = loaderData.directory.legend;
      return pageHead({
        title: `${legend.name} — gypsy jazz ${legend.instruments}`,
        description: legend.bio || `${legend.name} is a gypsy jazz musician on Gypsy Jazz Hub.`,
      });
    }
    const musician = loaderData?.musician;
    if (!musician) return pageHead({ title: "Musician", description: "Gypsy jazz musician on Gypsy Jazz Hub." });
    return pageHead({
      title: `${musician.displayName} — gypsy jazz`,
      description: musician.bio || `${musician.displayName} is a gypsy jazz musician on Gypsy Jazz Hub.`,
    });
  },
  component: MusicianRoute,
});

function MusicianRoute() {
  const data = Route.useLoaderData();
  if (data.kind === "directory") return <DirectoryArtistPage data={data.directory} />;
  return <MemberMusicianPage data={data} />;
}

function MemberMusicianPage({
  data,
}: {
  data: {
    musician: Profile;
    concerts: Concert[];
    clips: Awaited<ReturnType<typeof listHubClips>>;
    notes: Awaited<ReturnType<typeof listHubNotes>>;
    shoutouts: Awaited<ReturnType<typeof listGuestbook>>;
    nearbyJams: ReturnType<typeof upcomingJams>;
    reports: Awaited<ReturnType<typeof listArtistReviews>>;
  };
}) {
  const { musician, concerts, clips, notes, shoutouts, nearbyJams } = data;
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const instruments = formatInstrumentList(musician.instruments);
  const country = basedInCountry(musician.country, musician.city);
  const isSelf = user?.id === musician.userId;
  const booking = contactHref(musician.contactUrl);
  const upcoming = concerts.filter((c) => new Date(c.startsAt).getTime() >= Date.now());
  const photo = artistPhoto(musician.slug, musician.instruments);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Musician</p>
      <div className="mt-3 flex items-start gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-semibold sm:text-6xl">
            {musician.displayName}
          </h1>
          <p className="mt-2 text-muted">
            {country ? `Based in ${country}` : "On the road"}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {instruments.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
            {musician.availableToJam ? <Badge>Open to jam</Badge> : null}
            {musician.lookingForGigs ? <Badge>Looking for gigs</Badge> : null}
          </div>
          <div className="mt-6">
            {isPending ? (
              <div className="h-11 w-40 animate-pulse rounded-md bg-raised" />
            ) : isSelf ? (
              <Button asChild variant="outline">
                <Link to="/studio">Edit page</Link>
              </Button>
            ) : (
              <FollowArtist
                artist={{
                  artistSlug: musician.slug,
                  artistKind: "musician",
                  artistName: musician.displayName,
                }}
              />
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {booking ? (
              <Button asChild>
                <a href={booking} target={booking.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">
                  Contact / book
                </a>
              </Button>
            ) : null}
            <SaveButton kind="artist" slug={musician.slug} label="Save artist" />
          </div>
        </div>
        {photo ? (
          <Portrait
            src={photo.src}
            alt={musician.displayName}
            credit={photo.credit}
            creditHref={photo.href}
            className="h-auto w-28 max-h-80 shrink-0 rounded-2xl object-contain object-top shadow-border sm:w-40 sm:max-h-[22rem] lg:w-64"
          />
        ) : null}
      </div>

      {musician.bio ? (
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">{musician.bio}</p>
      ) : (
        <p className="mt-8 text-sm text-faint">This player has not written a bio yet.</p>
      )}

      {musician.youtubeUrl ? (
        <div className="mt-10 max-w-3xl">
          <YouTubeEmbed url={musician.youtubeUrl} title={musician.displayName} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {musician.websiteUrl ? (
          <a href={musician.websiteUrl} className="text-muted hover:text-fg" target="_blank" rel="noreferrer">
            Website
          </a>
        ) : null}
        {musician.youtubeUrl ? (
          <a href={musician.youtubeUrl} className="text-muted hover:text-fg" target="_blank" rel="noreferrer">
            YouTube
          </a>
        ) : null}
        {musician.instagramUrl ? (
          <a href={musician.instagramUrl} className="text-muted hover:text-fg" target="_blank" rel="noreferrer">
            Instagram
          </a>
        ) : null}
        {musician.spotifyUrl ? (
          <a href={musician.spotifyUrl} className="text-muted hover:text-fg" target="_blank" rel="noreferrer">
            Spotify
          </a>
        ) : null}
        {booking ? (
          <a href={booking} className="text-muted hover:text-fg" target={booking.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">
            Contact bookers
          </a>
        ) : null}
      </div>

      <ArtistMusic slug={musician.slug} name={musician.displayName} />

      <div className="mt-10 max-w-2xl">
        <ShareBox
          url={`/musicians/${musician.slug}`}
          title={t("share.profile")}
          lead={t("share.profileLead")}
          text={[
            `${musician.displayName}${instruments.length ? ` — ${instruments.join(", ")}` : ""}`,
            country ? `Based in ${country}` : "",
            musician.bio
              ? musician.bio.length > 180
                ? `${musician.bio.slice(0, 180).trim()}…`
                : musician.bio
              : "",
            upcoming.length
              ? `\nNext dates:\n${upcoming.slice(0, 5).map((concert) => `• ${concertShareLine(concert)}`).join("\n")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n")}
        />
      </div>

      {nearbyJams.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Jams in {musician.city}</h2>
          <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
            {nearbyJams.map((jam) => (
              <JamLine key={jam.slug} jam={jam} />
            ))}
          </ul>
        </section>
      ) : null}

      <ArtistClips slug={musician.slug} />

      <Guestbook slug={musician.slug} name={musician.displayName} initial={shoutouts} />

      {!isPending && user && !isSelf ? (
        <section className="mt-12 max-w-xl rounded-2xl bg-surface p-6 shadow-border">
          <h2 className="font-display text-2xl font-semibold">Send a note</h2>
          <p className="mt-1 text-sm text-muted">
            A short message to this player. It lands in their studio inbox.
          </p>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              setStatus(null);
              void sendMessage({ data: { toUserId: musician.userId, body: note } })
                .then(() => {
                  setNote("");
                  setStatus("Note sent.");
                })
                .catch((err) =>
                  setStatus(err instanceof Error ? err.message : "Could not send"),
                );
            }}
          >
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Where do you play, what do you need, when are you in town…"
            />
            {status ? <p className="text-sm text-muted">{status}</p> : null}
            <Button type="submit">Send</Button>
          </form>
        </section>
      ) : null}

      <HubExtras clips={clips} notes={notes} />
      <Contribute
        presetSlug={musician.slug}
        presetName={musician.displayName}
        heading={`Add to ${musician.displayName}`}
      />
    </main>
  );
}
