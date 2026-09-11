import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArtistClips } from "@/components/artist-clips";
import { ArtistMusic } from "@/components/artist-music";
import { BookerLinks } from "@/components/booker-links";
import { ConcertList } from "@/components/concert-row";
import { Nightbook } from "@/components/i-was-there";
import { Contribute } from "@/components/contribute";
import { FollowArtist } from "@/components/follow-artist";
import { FestivalLinks } from "@/components/festival-links";
import { Guestbook } from "@/components/guestbook";
import { HubExtras } from "@/components/hub-extras";
import { JoinedMark } from "@/components/joined-mark";
import { LearnLinks } from "@/components/learn-links";
import { MessageMember } from "@/components/message-member";
import { PlaysWith } from "@/components/plays-with";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import { ShareBox } from "@/components/share-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { basedInCountry } from "@/lib/geo";
import { claimArtist } from "@/lib/hub-api";
import { artistPhoto } from "@/lib/photos";
import type { DirectoryArtistData } from "@/lib/directory-artist";
import { useI18n } from "@/lib/i18n";
import { concertShareLine } from "@/lib/utils";

const SCENE_LINKS: Record<string, { href: string; label: string }[]> = {
  "hono-winterstein": [
    { href: "/history#forbach", label: "History / Forbach" },
    { href: "/festivals/festival-jazz-manouche-forbach", label: "Festival de jazz manouche de Forbach" },
  ],
  "popots-winterstein": [
    { href: "/history#forbach", label: "History / Forbach" },
    { href: "/festivals/festival-jazz-manouche-forbach", label: "Festival de jazz manouche de Forbach" },
  ],
  "brady-winterstein": [
    { href: "/festivals/festival-jazz-manouche-forbach", label: "Forbach festival — 9 May 2026 (archive)" },
    { href: "/history#forbach", label: "History / Forbach" },
  ],
  "benji-winterstein": [
    { href: "/history#forbach", label: "History / Forbach" },
    { href: "/festivals/festival-jazz-manouche-forbach", label: "Festival de jazz manouche de Forbach" },
  ],
  "holzmanno-winterstein": [
    { href: "/history#forbach", label: "History / Forbach" },
  ],
  "holzmano-lagrene": [
    { href: "/history#forbach", label: "History / Forbach" },
  ],
  "dorado-schmitt": [{ href: "/history#forbach", label: "The Forbach rooms" }],
  "tchavolo-schmitt": [{ href: "/history#forbach", label: "The Forbach rooms" }],
  "bireli-lagrene": [{ href: "/history#forbach", label: "The Forbach rooms" }],
};

export function DirectoryArtistPage({ data }: { data: DirectoryArtistData }) {
  const { legend, concerts, collaborators, bands, festivals, clips, notes, shoutouts, reports, camps, schools, member } =
    data;
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const [claimed, setClaimed] = useState(Boolean(member));
  const upcoming = concerts.filter((c) => !c.isHistoric && new Date(c.startsAt).getTime() >= Date.now());
  const joined = claimed || Boolean(member);
  const filePhoto = artistPhoto(legend.slug, legend.instruments);
  const memberPhoto = member?.photoUrl
    ? { src: member.photoUrl, credit: member.displayName || legend.name }
    : null;
  const photo = memberPhoto ?? filePhoto ?? (legend.photoUrl
    ? { src: legend.photoUrl, credit: legend.photoCredit || "YouTube", href: legend.youtubeUrl || undefined }
    : null);
  const place = [member?.city?.trim(), member?.country?.trim()].filter(Boolean).join(", ") || legend.origin;
  const bio = member?.bio?.trim() || legend.bio;
  const websiteUrl = member?.websiteUrl?.trim() || legend.websiteUrl;
  const youtubeUrl = member?.youtubeUrl?.trim() || legend.youtubeUrl;
  const instagramUrl = member?.instagramUrl?.trim() || legend.instagramUrl;
  const spotifyUrl = member?.spotifyUrl?.trim() || legend.spotifyUrl;
  const instruments = member?.instruments?.trim() || legend.instruments;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
            {instruments}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-6xl">
            <span className="inline-flex flex-wrap items-baseline gap-3">
              {legend.name}
              {joined ? <JoinedMark className="size-6" /> : null}
            </span>
          </h1>
          <p className="mt-3 text-muted">
            {basedInCountry(place) ? `Based in ${basedInCountry(place)}` : "On the road"}
          </p>
          {legend.years && legend.years !== legend.origin ? (
            <p className="mt-1 text-sm text-faint">{legend.years}</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {legend.samois ? <Badge>Samois</Badge> : null}
            {bands.map((band) => (
              <Link key={band.slug} to="/groups/$slug" params={{ slug: band.slug }}>
                <Badge>{band.name}</Badge>
              </Link>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{bio}</p>
          {legend.notable && !member?.bio?.trim() ? (
            <p className="mt-3 text-sm text-faint">{legend.notable}</p>
          ) : null}
          {SCENE_LINKS[legend.slug]?.length ? (
            <p className="mt-4 flex flex-col items-start gap-1 text-sm">
              {SCENE_LINKS[legend.slug]!.map((link) => (
                <a key={link.href} href={link.href} className="text-muted hover:text-fg hover:underline">
                  {link.label}
                </a>
              ))}
            </p>
          ) : null}
          {websiteUrl || youtubeUrl || instagramUrl || spotifyUrl ? (
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {websiteUrl ? (
                <a href={websiteUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
                  Website
                </a>
              ) : null}
              {youtubeUrl ? (
                <a href={youtubeUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
                  YouTube
                </a>
              ) : null}
              {instagramUrl ? (
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
                  Instagram
                </a>
              ) : null}
              {spotifyUrl ? (
                <a href={spotifyUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
                  Spotify
                </a>
              ) : null}
            </p>
          ) : null}

          {joined && member ? <MessageMember toUserId={member.userId} name={legend.name} /> : null}
          <div className="mt-6">
            <FollowArtist
              artist={{
                artistSlug: legend.slug,
                artistKind: "legend",
                artistName: legend.name,
              }}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-start gap-3">
            <SaveButton kind="artist" slug={legend.slug} label="Save artist" />
            {user && !member ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void claimArtist({ data: legend.slug }).then(() => setClaimed(true));
                }}
              >
                This is me — I joined the hub
              </Button>
            ) : null}
          </div>
        </div>
        {photo ? (
          <Portrait
            src={photo.src}
            alt={legend.name}
            credit={photo.credit}
            creditHref={photo.href}
            className="h-auto w-28 max-h-80 shrink-0 rounded-2xl object-contain object-top shadow-border sm:w-40 sm:max-h-[22rem] lg:w-64"
          />
        ) : (
          <div
            aria-hidden
            className="grid aspect-[4/5] w-28 shrink-0 place-items-center rounded-2xl bg-raised font-display text-3xl text-faint shadow-border sm:w-40 sm:text-4xl lg:w-64"
          >
            {legend.name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>
        )}
      </div>

      <ArtistMusic slug={legend.slug} name={legend.name} />

      <ConcertList
        className="mt-10"
        title={t("home.upcoming")}
        concerts={upcoming}
        empty={t("home.noConcerts")}
        compact
      />

      <div className="mt-10 max-w-2xl">
        <ShareBox
          url={`/musicians/${legend.slug}`}
          title={t("share.profile")}
          lead={t("share.profileLead")}
          text={[
            `${legend.name} — ${legend.instruments}`,
            basedInCountry(legend.origin)
              ? `Based in ${basedInCountry(legend.origin)}`
              : "",
            legend.notable ||
              (legend.bio.length > 180 ? `${legend.bio.slice(0, 180).trim()}…` : legend.bio),
            upcoming.length
              ? `\nNext dates:\n${upcoming.slice(0, 5).map((concert) => `• ${concertShareLine(concert)}`).join("\n")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n")}
        />
      </div>

      <BookerLinks booker={data.booker} />

      <LearnLinks
        schools={schools}
        camps={camps.filter((camp) => camp.hostSlugs.includes(legend.slug))}
      />

      <ArtistClips slug={legend.slug} />

      <PlaysWith artists={collaborators} bands={bands} />

      <FestivalLinks festivals={festivals} />

      <Nightbook artistName={legend.name} concerts={concerts} initialReviews={reports} />
      <Guestbook slug={legend.slug} name={legend.name} initial={shoutouts} />
      <HubExtras clips={clips} notes={notes} />

      <Contribute
        presetSlug={legend.slug}
        presetName={legend.name}
        heading={`Add to ${legend.name}`}
      />
    </main>
  );
}
