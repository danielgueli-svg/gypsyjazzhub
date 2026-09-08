import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArtistNameLink } from "@/components/artist-name-link";
import { ConcertList } from "@/components/concert-row";
import { Nightbook } from "@/components/i-was-there";
import { FestivalLinks } from "@/components/festival-links";
import { LegendCard } from "@/components/legend-card";
import { Portrait } from "@/components/portrait";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { listLegendConcerts, listLegends, type Concert, type Legend } from "@/lib/api";
import { listReviewsForConcerts } from "@/lib/concert-reviews";
import { festivalsForArtist } from "@/lib/festivals";
import { groupPhoto } from "@/lib/photos";
import { getBand } from "@/lib/scene";
import { useI18n } from "@/lib/i18n";

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
    return { band, members, lead, concerts, festivals, reports };
  },
  component: GroupPage,
});

function GroupPage() {
  const { band, members, lead, concerts, festivals, reports } = Route.useLoaderData();
  const { t } = useI18n();
  const upcoming = concerts.filter(
    (concert) => !concert.isHistoric && new Date(concert.startsAt).getTime() >= Date.now(),
  );
  const photo = groupPhoto(band.slug, band.members);

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
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">{band.bio}</p>
      {photo ? (
        <Portrait
          src={photo.src}
          alt={band.name}
          credit={photo.credit}
          creditHref={photo.href}
          className="mt-8 aspect-[16/9] w-full rounded-2xl shadow-border"
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
