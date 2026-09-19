import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArtistClips } from "@/components/artist-clips";
import { ArtistBioEdit } from "@/components/artist-bio-edit";
import { BookButton } from "@/components/book-button";
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
import { PageLinks } from "@/components/page-links";
import { RelatedPages } from "@/components/related-pages";
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
import { luthierSlugForArtist } from "@/lib/related-pages";
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
  "david-cooper": [
    { href: "https://www.davidcooper.eu/music/", label: "Website — davidcooper.eu/music" },
    { href: "https://valamiswing.bandcamp.com/album/hungarian-django-tales", label: "Hungarian Django Tales — Bandcamp" },
    { href: "https://valamiswing.bandcamp.com/album/barbara", label: "Barbara — Bandcamp" },
    { href: "/groups/valami-swing", label: "Valami Swing" },
  ],
  "nick-sansone": [
    { href: "https://nicksansonejazz.com/", label: "Website — nicksansonejazz.com" },
    { href: "mailto:nicksansonejazz@yahoo.com", label: "nicksansonejazz@yahoo.com" },
    { href: "/groups/sansonis-hot-fives", label: "Sansoni’s Hot Fives" },
    { href: "https://nicksansonejazz.com/upcoming-gigs-concerts/", label: "Events" },
  ],
  "sven-jungbeck": [
    { href: "/luthiers/amin-sharifi", label: "Amin Sharifi — guitar workshop, Köln-Kalk" },
  ],
  "pete-kubryk-townsend": [
    { href: "/venues/le-quecumbar", label: "Le QuecumBar, Battersea" },
    { href: "/musicians/sylvia-rushbrooke", label: "Sylvia Rushbrooke — Le QuecumBar" },
    { href: "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-", label: "Festival 3×CD — Discogs" },
  ],
  "andy-aitchison": [
    { href: "/venues/le-quecumbar", label: "Le QuecumBar, Battersea" },
    { href: "/musicians/sylvia-rushbrooke", label: "Sylvia Rushbrooke — Le QuecumBar" },
    { href: "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-", label: "Festival 3×CD — Discogs" },
  ],
  "andy-crowdy": [
    { href: "/venues/le-quecumbar", label: "Le QuecumBar, Battersea" },
    { href: "/musicians/sylvia-rushbrooke", label: "Sylvia Rushbrooke — Le QuecumBar" },
    { href: "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-", label: "Festival 3×CD — Discogs" },
  ],
  "benoit-viellefon": [
    { href: "https://benoitviellefon.com", label: "Website — benoitviellefon.com" },
    { href: "/venues/le-quecumbar", label: "Le QuecumBar, Battersea" },
    { href: "/musicians/sylvia-rushbrooke", label: "Sylvia Rushbrooke — Le QuecumBar" },
    { href: "/groups/benoit-viellefon-hot-club", label: "Benoit Viellefon Hot Club" },
  ],
  "ducato-piotrowski": [
    { href: "/venues/le-quecumbar", label: "Le QuecumBar, Battersea" },
    { href: "/musicians/sylvia-rushbrooke", label: "Sylvia Rushbrooke — Le QuecumBar" },
    { href: "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-", label: "Festival 3×CD — Discogs" },
  ],
  "gary-potter": [
    { href: "/venues/le-quecumbar", label: "Le QuecumBar, Battersea" },
    { href: "/musicians/sylvia-rushbrooke", label: "Sylvia Rushbrooke — Le QuecumBar" },
    { href: "https://www.discogs.com/release/11969919-The-Gary-Potter-Quartet-Le-QuecumBar-Live-In-London-", label: "Live In London — Discogs" },
  ],
  "hugo-richter": [
    { href: "/groups/kussi-weiss-gipsy-connection", label: "Kussi Weiss Gipsy Connection" },
    { href: "/venues/le-quecumbar", label: "Le QuecumBar, Battersea" },
    { href: "/musicians/sylvia-rushbrooke", label: "Sylvia Rushbrooke — Le QuecumBar" },
    { href: "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-", label: "Festival 3×CD — Discogs" },
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
  "leen-de-keijzer": [
    { href: "mailto:leen-music@hotmail.com", label: "leen-music@hotmail.com" },
    { href: "https://keijzermusic.nl/", label: "keijzermusic.nl" },
  ],
  "yorkshire-gypsy-swing-collective": [
    { href: "https://www.jazzleeds.org.uk/whats-on/gypsy-swing-collective/", label: "Jazz Leeds — Yorkshire Gypsy Swing Collective" },
    { href: "https://www.guitarworld.com/features/django-reinhardt-legacy", label: "Guitar World — Django Reinhardt’s legacy (Denny Ilett, 7 March 2023)" },
    { href: "https://pocketmags.com/guitarist-magazine/march-2023/articles/django-s-legacy", label: "Guitarist, March 2023 — Django’s Legacy" },
  ],
  "lewis-kilvington": [
    { href: "/groups/yorkshire-gypsy-swing-collective", label: "Yorkshire Gypsy Swing Collective" },
    { href: "https://www.guitarworld.com/features/django-reinhardt-legacy", label: "Guitar World — Django Reinhardt’s legacy (Denny Ilett, 7 March 2023)" },
    { href: "https://pocketmags.com/guitarist-magazine/march-2023/articles/django-s-legacy", label: "Guitarist, March 2023 — Django’s Legacy" },
  ],
  "martin-chung": [
    { href: "/groups/yorkshire-gypsy-swing-collective", label: "Yorkshire Gypsy Swing Collective" },
    { href: "https://martinchungmusic.wordpress.com/", label: "martinchungmusic.wordpress.com" },
  ],
  "james-munroe": [
    { href: "/groups/yorkshire-gypsy-swing-collective", label: "Yorkshire Gypsy Swing Collective" },
  ],
  "derek-magee": [
    { href: "/groups/yorkshire-gypsy-swing-collective", label: "Yorkshire Gypsy Swing Collective" },
  ],
  "christine-pinkard": [
    { href: "/groups/yorkshire-gypsy-swing-collective", label: "Yorkshire Gypsy Swing Collective" },
  ],
  "kussi-weiss": [
    { href: "https://kussiweisstrio.jimdofree.com/", label: "Website — kussiweisstrio.jimdofree.com" },
    { href: "/groups/kussi-weiss-trio", label: "Kussi Weiss Trio" },
    { href: "/groups/kussi-weiss-gipsy-connection", label: "Gipsy Connection" },
    { href: "https://secondhandsongs.com/release/486647/all", label: "There Will Never Be Another You (1996) — SecondHandSongs" },
    { href: "https://secondhandsongs.com/release/486650/all", label: "A Little Magic (1998) — SecondHandSongs" },
    { href: "https://www.glm.de/produkt/martin-weiss-ensemble-savoir-vivre/", label: "Savoir Vivre (2001) — GLM" },
    { href: "https://open.spotify.com/album/3rZK69ya2N9pvgOd89IPZB", label: "Gipsy Celebration (2008) — Spotify" },
    { href: "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-", label: "QuecumBar festival 3×CD — Discogs" },
    { href: "https://music.apple.com/us/artist/kussi-weiss-quintet/410149196", label: "Kussi Weiss Quintet — Apple Music" },
    { href: "https://de.wikipedia.org/wiki/Kussi_Weiss", label: "Wikipedia" },
    { href: "/musicians/martin-weiss", label: "Martin Weiss" },
  ],
  "tschabo-franzen": [
    { href: "/musicians/kussi-weiss", label: "Kussi Weiss" },
    { href: "/groups/kussi-weiss-trio", label: "Kussi Weiss Trio" },
    { href: "/groups/kussi-weiss-gipsy-connection", label: "Gipsy Connection" },
  ],
  "dietmar-osterburg": [
    { href: "/musicians/kussi-weiss", label: "Kussi Weiss" },
    { href: "/groups/kussi-weiss-trio", label: "Kussi Weiss Trio" },
    { href: "/groups/kussi-weiss-gipsy-connection", label: "Gipsy Connection" },
  ],
  "sylvia-rushbrooke": [
    { href: "/venues/le-quecumbar", label: "Le QuecumBar, Battersea" },
    { href: "https://www.quecumbar.co.uk/", label: "House site — quecumbar.co.uk (archive)" },
    { href: "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-", label: "Festival 3×CD — Discogs" },
    { href: "https://www.discogs.com/artist/6470230-Sylvia-Rushbrooke", label: "Sylvia Rushbrooke — Discogs" },
    { href: "https://www.thejazzmann.com/news/article/le-quecumbar-has-closed", label: "Closing statement — The Jazz Mann, 27 April 2022" },
  ],
  "julia-hornung": [
    { href: "https://juliahornungbass.de/", label: "Website — juliahornungbass.de" },
    { href: "https://juliahornungbass.de/live/", label: "Live dates — juliahornungbass.de/live" },
    { href: "mailto:booking@juliahornungbass.de", label: "booking@juliahornungbass.de" },
    { href: "https://www.instagram.com/juliahornungbass/", label: "Instagram" },
    { href: "https://www.youtube.com/@JuliaHornungBass", label: "YouTube" },
    { href: "/groups/julia-hornung-trio", label: "Julia Hornung Trio" },
    { href: "/groups/collectif-django", label: "Collectif Django" },
    { href: "/groups/duo-solera", label: "Duo Solèra" },
    { href: "/groups/munich-connection", label: "Munich Connection — Joscho Stephan" },
  ],
  "giangiacomo-rosso": [
    { href: "https://www.jazzschooltorino.it/jazz-school-torino-team/giangiacomo-rosso/", label: "Jazz School Torino" },
    { href: "https://gypsyjazzguitarmaster.com/meet-the-teachers/", label: "Gypsy Jazz Guitar Master" },
    { href: "mailto:giangiacomo.rosso@gmail.com", label: "giangiacomo.rosso@gmail.com" },
    { href: "https://www.instagram.com/giangiacrosso_guitar/", label: "Instagram" },
    { href: "https://www.youtube.com/@Jieck2305", label: "YouTube" },
    { href: "https://found.ee/HzWoT", label: "Kind of Gipsy — 23 Oct 2023" },
    { href: "/groups/julia-hornung-trio", label: "Julia Hornung Trio" },
    { href: "/groups/duo-solera", label: "Duo Solèra" },
  ],
};

export function DirectoryArtistPage({ data }: { data: DirectoryArtistData }) {
  const { legend, concerts, collaborators, bands, festivals, clips, notes, shoutouts, reports, camps, schools, member, hubPage } =
    data;
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const [claimed, setClaimed] = useState(Boolean(member));
  const upcoming = concerts.filter((c) => !c.isHistoric && new Date(c.startsAt).getTime() >= Date.now());
  const joined = claimed || Boolean(member);
  const filePhoto = artistPhoto(legend.slug, legend.instruments);
  const hubPhoto = hubPage?.photoUrl
    ? { src: hubPage.photoUrl, credit: "", href: undefined as string | undefined }
    : null;
  const memberPhoto = member?.photoUrl
    ? { src: member.photoUrl, credit: member.displayName || legend.name, href: undefined as string | undefined }
    : null;
  const photo = hubPhoto ?? memberPhoto ?? filePhoto ?? (legend.photoUrl
    ? { src: legend.photoUrl, credit: legend.photoCredit || "YouTube", href: legend.youtubeUrl || undefined }
    : null);
  const place = [member?.city?.trim(), member?.country?.trim()].filter(Boolean).join(", ") || legend.origin;
  const overlay = hubPage?.bio?.trim() ?? "";
  const bio = overlay || member?.bio?.trim() || legend.bio;
  const extraLinks = hubPage?.links ?? [];
  const bookingHref = hubPage?.bookingUrl?.trim() || member?.contactUrl?.trim() || "";
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
          {bookingHref ? (
            <div className="mt-4">
              <BookButton href={bookingHref} />
            </div>
          ) : null}
          <ArtistBioEdit
            slug={legend.slug}
            bio={bio}
            links={extraLinks}
            photoUrl={hubPage?.photoUrl ?? ""}
            bookingUrl={hubPage?.bookingUrl || member?.contactUrl || ""}
          />
          {legend.notable && !member?.bio?.trim() ? (
            <p className="mt-3 text-sm text-faint">{legend.notable}</p>
          ) : null}
          <PageLinks catalog={SCENE_LINKS[legend.slug] ?? []} extra={extraLinks} />
          <RelatedPages
            current="musician"
            musicianSlug={legend.slug}
            luthierSlug={luthierSlugForArtist(legend.slug)}
          />
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
