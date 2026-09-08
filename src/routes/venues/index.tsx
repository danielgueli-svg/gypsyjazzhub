import { createFileRoute, Link } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { CountryLabel } from "@/components/country-label";
import { countrySlug } from "@/lib/geo";
import { listHubVenues } from "@/lib/hub-api";
import { venuesByCountry } from "@/lib/venues";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/venues/")({
  head: () => pageHead(SEO.venues),
  loader: async () => ({ extra: await listHubVenues() }),
  component: VenuesPage,
});

function VenuesPage() {
  const { extra } = Route.useLoaderData();
  const groups = venuesByCountry(extra);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
        A booker list for players
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Venues</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        A database for musicians: rooms where you can try to get a concert, a
        jam, a festival night. Pick a country. Gypsy jazz stages sit first,
        then jazz and world houses. Signed in, add a venue you know — and,
        when you have it, the booker for gypsy jazz. The daily scan also
        adds rooms when the official website and a second listing agree.
      </p>

      <ul className="mt-10 space-y-3">
        {groups.map((group) => (
          <li key={group.country}>
            <Link
              to="/venues/in/$slug"
              params={{ slug: countrySlug(group.country) }}
              className="font-display text-2xl font-semibold hover:underline"
            >
              <CountryLabel name={group.country} />
            </Link>
            <span className="ml-2 text-sm text-muted">({group.venues.length})</span>
          </li>
        ))}
      </ul>
      <Contribute heading="Know a venue? Add it" />
    </main>
  );
}
