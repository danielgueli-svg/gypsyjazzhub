import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ConcertRow } from "@/components/concert-row";
import { HubChat } from "@/components/hub-chat";
import { JamLine } from "@/components/jam-line";
import { ShareBox } from "@/components/share-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listConcerts } from "@/lib/api";
import { CountryLabel } from "@/components/country-label";
import { countrySlug } from "@/lib/geo";
import { getHubVenue, listHubChat, listHubJams } from "@/lib/hub-api";
import { getVenue, venueScene } from "@/lib/venues";
import { upcomingJams } from "@/lib/jams";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/venues/$slug")({
  loader: async ({ params }) => {
    const venue = getVenue(params.slug) ?? (await getHubVenue({ data: params.slug }));
    if (!venue) throw notFound();
    const [concerts, chat, extraJams] = await Promise.all([
      listConcerts({ data: { filter: "upcoming" } }),
      listHubChat({ data: { kind: "venue", slug: venue.slug } }),
      listHubJams(),
    ]);
    const here = concerts.filter(
      (concert) =>
        !concert.isHistoric &&
        (concert.venue.toLowerCase().includes(venue.name.toLowerCase().slice(0, 12)) ||
          concert.city.trim().toLowerCase() === venue.city.trim().toLowerCase()),
    );
    const city = venue.city.trim().toLowerCase();
    const cityJams = city
      ? [...upcomingJams(), ...extraJams]
          .filter((jam, i, all) => all.findIndex((row) => row.slug === jam.slug) === i)
          .filter((jam) => jam.city.trim().toLowerCase() === city)
          .slice(0, 8)
      : [];
    return { venue, here, chat, cityJams };
  },
  component: VenuePage,
});

function VenuePage() {
  const { venue, here, chat, cityJams } = Route.useLoaderData();
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Venue</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{venue.name}</h1>
      <p className="mt-3 text-muted">
        {venue.city} ·{" "}
        <Link
          to="/world/$slug"
          params={{ slug: countrySlug(venue.country) }}
          className="hover:text-fg"
        >
          <CountryLabel name={venue.country} />
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>{venue.kind}</Badge>
      </div>

      <div className="mt-6">
        <ShareBox
          compact
          url={`/venues/${venue.slug}`}
          title="Share this venue"
          text={`${venue.name}\n${venue.city} · ${venue.country}\n${venue.bio}`}
        />
      </div>

      <article className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">About</h2>
        <p>{venue.bio}</p>
        {venueScene(venue) !== "gypsy" ? (
          <p className="rounded-2xl bg-surface p-5 text-fg shadow-border">
            This house already books jazz. It is a potential room for a Gypsy Jazz jam
            or concert — write as a group or as an artist, then put the date on this hub
            so the scene can find it.
          </p>
        ) : null}
      </article>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">Who books gypsy jazz</h2>
        {venue.booker || venue.contact ? (
          <div className="mt-4 rounded-2xl bg-surface p-5 shadow-border">
            {venue.booker ? (
              <p className="font-display text-xl font-semibold">{venue.booker}</p>
            ) : (
              <p className="text-sm text-muted">Booker name not on file yet.</p>
            )}
            {venue.contact ? (
              <p className="mt-2">
                <a
                  href={venue.contact}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline"
                >
                  {venue.contact.replace(/^mailto:/, "")}
                </a>
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            No booker on file yet. Sign in and add who to write to for a gypsy
            jazz night here.
          </p>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        {venue.site ? (
          <Button asChild>
            <a href={venue.site} target="_blank" rel="noreferrer">
              Official site
            </a>
          </Button>
        ) : null}
        {venue.contact ? (
          <Button asChild variant="outline">
            <a href={venue.contact} target="_blank" rel="noreferrer">
              Bookers / contact
            </a>
          </Button>
        ) : null}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{t("home.upcoming")}</h2>
        {here.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("home.noConcerts")}</p>
        ) : (
          <div className="mt-5 space-y-3">
            {here.map((concert) => (
              <ConcertRow key={concert.id} concert={concert} />
            ))}
          </div>
        )}
      </section>

      {cityJams.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Jams in {venue.city}</h2>
          <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
            {cityJams.map((jam) => (
              <JamLine key={jam.slug} jam={jam} />
            ))}
          </ul>
        </section>
      ) : null}

      <HubChat kind="venue" slug={venue.slug} initial={chat} />
    </main>
  );
}
