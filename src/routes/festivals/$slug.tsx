import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArtistNameLink } from "@/components/artist-name-link";
import { HubChat } from "@/components/hub-chat";
import { LegendCard } from "@/components/legend-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/subscribe-button";
import { ConcertList } from "@/components/concert-row";
import { listConcerts, listLegends, uniqueBills } from "@/lib/api";
import { getFestival, concertBelongsToFestival, festivalTicketUrl } from "@/lib/festivals";
import { CountryLabel } from "@/components/country-label";
import { countrySlug } from "@/lib/geo";
import { getHubFestival, listHubChat } from "@/lib/hub-api";
import { groupsForFestival } from "@/lib/scene";
import { formatConcertWhen } from "@/lib/utils";
import { pageHead } from "@/lib/seo";
import { settle } from "@/lib/settle";

export const Route = createFileRoute("/festivals/$slug")({
  loader: async ({ params }) => {
    const festival = getFestival(params.slug) ?? (await getHubFestival({ data: params.slug }));
    if (!festival) throw notFound();
    const [legends, chat, upcoming] = await Promise.all([
      listLegends(),
      settle("fest-chat", [], () => listHubChat({ data: { kind: "festival", slug: festival.slug } })),
      listConcerts({ data: { filter: "upcoming" } }),
    ]);
    const related = festival.relatedSlugs
      .map((slug) => legends.find((legend) => legend.slug === slug))
      .filter((legend) => Boolean(legend));
    return {
      festival,
      related,
      groups: groupsForFestival(festival.relatedSlugs),
      legends,
      chat,
      concerts: uniqueBills(upcoming.filter((concert) => concertBelongsToFestival(festival, concert))),
    };
  },
  head: ({ loaderData, params }) => {
    const path = `/festivals/${params.slug}`;
    const festival = loaderData?.festival;
    if (!festival) {
      return pageHead({ title: "Festival", description: "Gypsy jazz festival.", path });
    }
    return pageHead({
      title: `${festival.name} — gypsy jazz festival`,
      description:
        festival.bio ||
        `${festival.name} is a gypsy jazz festival in ${festival.city}, ${festival.country}.`,
      path,
    });
  },
  component: FestivalPage,
});

function FestivalPage() {
  const { festival, related, groups, legends, chat, concerts } = Route.useLoaderData();
  const nameOf = (slug: string) =>
    legends.find((legend) => legend.slug === slug)?.name ?? slug;
  const tickets = festivalTicketUrl(festival);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Festival</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
        {festival.name}
      </h1>
      <p className="mt-3 text-muted">
        {festival.city} · <CountryLabel name={festival.country} />
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>{festival.when}</Badge>
        {festival.founded ? <Badge>Since {festival.founded}</Badge> : null}
      </div>
      <div className="mt-6">
        <SubscribeButton
          kind="festival"
          targetId={festival.slug}
          targetName={festival.name}
          label="Notify me"
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Next</p>
          <p className="mt-2 font-display text-xl font-semibold">
            {festival.tba ? festival.when : formatConcertWhen(festival.nextStartsAt)}
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Where</p>
          <p className="mt-2 font-display text-xl font-semibold">{festival.city}</p>
        </div>
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Country</p>
          <p className="mt-2 font-display text-xl font-semibold">
            <CountryLabel name={festival.country} />
          </p>
        </div>
      </div>

      <article className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">About</h2>
        <p>{festival.bio}</p>
      </article>

      {festival.site || tickets ? (
        <div className="mt-6 flex flex-col items-start gap-2">
          {festival.site ? (
            <Button asChild>
              <a href={festival.site} target="_blank" rel="noreferrer">
                {festival.site.includes("djangobooks.com")
                  ? "DjangoBooks thread"
                  : "Official website"}
              </a>
            </Button>
          ) : null}
          {tickets ? (
            <Button asChild variant={festival.site ? "outline" : "default"}>
              <a href={tickets} target="_blank" rel="noreferrer">
                Tickets
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}

      {concerts.length > 0 ? (
        <ConcertList title="Concerts" concerts={concerts} compact />
      ) : null}

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Artists</h2>
          <p className="mt-2 text-sm text-muted">
            Open a name for that musician's page.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((legend) =>
              legend ? <LegendCard key={legend.slug} legend={legend} /> : null,
            )}
          </div>
        </section>
      ) : null}

      {groups.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Groups</h2>
          <p className="mt-2 text-sm text-muted">
            Bands on this gathering — open the group, or the main artist.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {groups.map((band) => (
              <div
                key={band.slug}
                className="rounded-2xl bg-surface p-5 shadow-border"
              >
                <Link
                  to="/groups/$slug"
                  params={{ slug: band.slug }}
                  className="font-display text-2xl font-semibold hover:underline"
                >
                  {band.name}
                </Link>
                <p className="mt-2 text-sm text-muted">
                  Main artist{" "}
                  <ArtistNameLink
                    slug={band.members[0]}
                    name={nameOf(band.members[0])}
                    className="text-fg hover:underline"
                  />
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <HubChat kind="festival" slug={festival.slug} initial={chat} />

      <p className="mt-12 text-sm text-muted">
        <Link to="/festivals" className="text-fg hover:underline">
          All festivals
        </Link>
        {" · "}
        <Link
          to="/world/$slug"
          params={{ slug: countrySlug(festival.country) }}
          className="text-fg hover:underline"
        >
          <CountryLabel name={festival.country} /> on the globe
        </Link>
      </p>
    </main>
  );
}
