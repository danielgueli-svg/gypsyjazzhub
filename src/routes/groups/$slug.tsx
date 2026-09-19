import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArtistBioEdit } from "@/components/artist-bio-edit";
import { BookButton } from "@/components/book-button";
import { ArtistNameLink } from "@/components/artist-name-link";
import { ConcertList } from "@/components/concert-row";
import { Nightbook } from "@/components/i-was-there";
import { FestivalLinks } from "@/components/festival-links";
import { LegendCard } from "@/components/legend-card";
import { PageLinks } from "@/components/page-links";
import { Portrait } from "@/components/portrait";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { listLegendConcerts, listLegends, type Concert, type Legend } from "@/lib/api";
import { listReviewsForConcerts } from "@/lib/concert-reviews";
import { festivalsForArtist } from "@/lib/festivals";
import { getHubArtistBio } from "@/lib/hub-api";
import { groupPhoto } from "@/lib/photos";
import { getBand } from "@/lib/scene";
import { useI18n } from "@/lib/i18n";
import { settle } from "@/lib/settle";

const GROUP_LINKS: Record<string, { href: string; label: string }[]> = {
  "valami-swing": [
    { href: "https://www.davidcooper.eu/music/", label: "David Cooper — davidcooper.eu/music" },
    { href: "https://valamiswing.bandcamp.com/album/hungarian-django-tales", label: "Hungarian Django Tales — Bandcamp" },
    { href: "https://valamiswing.bandcamp.com/album/barbara", label: "Barbara — Bandcamp" },
  ],
  "sansonis-hot-fives": [
    { href: "https://nicksansonejazz.com/sansonis-hot-fives/", label: "Sansoni’s Hot Fives — nicksansonejazz.com" },
    { href: "https://nicksansonejazz.com/", label: "Nick Sansone" },
    { href: "mailto:nicksansonejazz@yahoo.com", label: "nicksansonejazz@yahoo.com" },
  ],
  "yorkshire-gypsy-swing-collective": [
    { href: "https://www.jazzleeds.org.uk/whats-on/gypsy-swing-collective/", label: "Jazz Leeds — Yorkshire Gypsy Swing Collective" },
    { href: "https://www.guitarworld.com/features/django-reinhardt-legacy", label: "Guitar World — Django Reinhardt’s legacy (Denny Ilett, 7 March 2023)" },
    { href: "https://pocketmags.com/guitarist-magazine/march-2023/articles/django-s-legacy", label: "Guitarist, March 2023 — Django’s Legacy" },
  ],
};

function uniqueConcerts(rows: Concert[]): Concert[] {
  const seen = new Set<string>();
  const out: Concert[] = [];
  for (const concert of rows) {
    const key = `${concert.title}|${concert.startsAt}|${concert.city}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(concert);
  }
  return out.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export const Route = createFileRoute("/groups/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "tata-mirando" || params.slug === "tata-mirando-orkest") {
      throw redirect({ to: "/tata-mirando" });
    }
  },
  loader: async ({ params }) => {
    const band = getBand(params.slug);
    if (!band) throw notFound();
    const [legends, nested] = await Promise.all([
      listLegends(),
      Promise.all(band.members.map((slug) => listLegendConcerts({ data: slug }))),
    ]);
    const bySlug = new Map(legends.map((legend) => [legend.slug, legend]));
    const members = band.members
      .map((slug) => bySlug.get(slug))
      .filter((legend): legend is Legend => Boolean(legend));
    const lead = members[0] ?? null;
    const festivals = lead
      ? festivalsForArtist(lead.slug, lead.samois)
      : [];
    const concerts = uniqueConcerts(nested.flat()).filter((concert) => {
      const hay = `${concert.title} ${concert.description}`.toLowerCase();
      return hay.includes(band.name.toLowerCase());
    });
    const reports = await listReviewsForConcerts({ data: concerts.map((row) => row.id) });
    const hubPage = await settle("group-hub-page", null, () => getHubArtistBio({ data: band.slug }));
    return { band, members, lead, concerts, festivals, reports, hubPage };
  },
  component: GroupPage,
});

function GroupPage() {
  const { band, members, lead, concerts, festivals, reports, hubPage } = Route.useLoaderData();
  const { t } = useI18n();
  const upcoming = concerts.filter(
    (concert) => !concert.isHistoric && new Date(concert.startsAt).getTime() >= Date.now(),
  );
  const catalogPhoto = groupPhoto(band.slug, band.members);
  const photo = hubPage?.photoUrl
    ? { src: hubPage.photoUrl, credit: "", href: undefined as string | undefined }
    : catalogPhoto;
  const bio = hubPage?.bio?.trim() || band.bio;
  const extraLinks = hubPage?.links ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Group</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
        {band.name}
      </h1>
      <p className="mt-3 text-muted">{band.origin}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>{members.length} members</Badge>
        <Badge>{band.country}</Badge>
      </div>
      {hubPage?.bookingUrl ? (
        <div className="mt-4">
          <BookButton href={hubPage.bookingUrl} kind="group" />
        </div>
      ) : null}
      {lead ? (
        <p className="mt-4 text-sm text-muted">
          Main artist{" "}
          <ArtistNameLink
            slug={lead.slug}
            name={lead.name}
            className="text-fg hover:underline"
          />
        </p>
      ) : null}
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">{bio}</p>
      <ArtistBioEdit
        slug={band.slug}
        bio={bio}
        links={extraLinks}
        photoUrl={hubPage?.photoUrl ?? ""}
        bookingUrl={hubPage?.bookingUrl ?? ""}
        returnTo={`/groups/${band.slug}`}
      />
      <PageLinks catalog={GROUP_LINKS[band.slug] ?? []} extra={extraLinks} />
      {photo ? (
        <Portrait
          src={photo.src}
          alt={band.name}
          credit={photo.credit}
          creditHref={photo.href}
          className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-border"
        />
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Band members</h2>
        <p className="mt-2 text-sm text-muted">
          Open a name for that musician's page — bio, who they play with,
          upcoming concerts.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <LegendCard
              key={member.slug}
              legend={member}
              role={band.roles?.[member.slug]}
            />
          ))}
        </div>
      </section>

      <FestivalLinks festivals={festivals} />

      <ConcertList
        title={t("home.upcoming")}
        concerts={upcoming}
        empty={t("home.noConcerts")}
      />

      {band.clips && band.clips.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Watch</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {band.clips.map((clip) => (
              <figure key={clip.url} className="space-y-3">
                <YouTubeEmbed url={clip.url} title={clip.title} />
                <figcaption className="font-display text-xl font-semibold">
                  {clip.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <Nightbook artistName={band.name} concerts={concerts} initialReviews={reports} />

      <p className="mt-12 text-sm text-muted">
        <Link to="/groups" className="text-fg hover:underline">
          All groups
        </Link>
        {" · "}
        <Link to="/musicians" className="text-fg hover:underline">
          Musicians
        </Link>
      </p>
    </main>
  );
}
