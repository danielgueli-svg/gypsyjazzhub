import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { CountryLabel } from "@/components/country-label";
import { countrySlug } from "@/lib/geo";
import { listHubVenues } from "@/lib/hub-api";
import { venueScene, venuesByCountry, type Venue } from "@/lib/venues";

export const Route = createFileRoute("/venues/in/$slug")({
  loader: async ({ params }) => {
    const extra = await listHubVenues();
    const group = venuesByCountry(extra).find(
      (row) => countrySlug(row.country) === params.slug,
    );
    if (!group) throw notFound();
    return { group };
  },
  component: VenuesInCountry,
});

function VenuesInCountry() {
  const { group } = Route.useLoaderData();
  const gypsy = group.venues.filter((venue) => venueScene(venue) === "gypsy");
  const other = group.venues.filter((venue) => venueScene(venue) !== "gypsy");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Link to="/venues" className="text-sm text-muted hover:text-fg">
        ← Venues
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">Venues</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
        <Link
          to="/world/$slug"
          params={{ slug: countrySlug(group.country) }}
          className="hover:underline"
        >
          <CountryLabel name={group.country} />
        </Link>
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        {group.venues.length} room{group.venues.length === 1 ? "" : "s"} for
        musicians looking for a stage. Gypsy jazz first, then jazz and world.
        Signed in, add a house and who books it.
      </p>
      {gypsy.length === 0 && other.length > 0 ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          These rooms already book jazz or world music. They are potential places to
          organise a Gypsy Jazz jam or concert — write as a group or as an artist, then
          put the date on the hub.
        </p>
      ) : null}

      {gypsy.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-3xl font-semibold">Gypsy jazz</h2>
          <VenueList venues={gypsy} />
        </section>
      ) : null}

      {other.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Jazz and world</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Rooms that already book live music. Write as a group or as an artist if you
            want to organise a Gypsy Jazz jam or concert here.
          </p>
          <VenueList venues={other} />
        </section>
      ) : null}

      <Contribute heading="Know a venue? Add it" />
    </main>
  );
}

function VenueList({ venues }: { venues: Venue[] }) {
  return (
    <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
      {venues.map((venue) => (
        <li key={venue.slug} className="break-inside-avoid py-1.5">
          <Link
            to="/venues/$slug"
            params={{ slug: venue.slug }}
            className="font-display text-xl font-semibold hover:underline"
          >
            {venue.name}
          </Link>
          <span className="text-sm text-muted">
            {" "}
            · {venue.city} · {venue.kind}
          </span>
        </li>
      ))}
    </ul>
  );
}
