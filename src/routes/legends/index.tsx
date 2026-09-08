import { createFileRoute, Link } from "@tanstack/react-router";
import { listLegends, type Legend } from "@/lib/api";
import { musiciansByCountry } from "@/lib/directory";
import { artistHref, countrySlug } from "@/lib/geo";
import { CountryLabel } from "@/components/country-label";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/legends/")({
  head: () => pageHead(SEO.legends),
  loader: async () => ({ legends: await listLegends() }),
  component: LegendsPage,
});

function LegendsPage() {
  const { legends } = Route.useLoaderData();
  const groups = musiciansByCountry(legends);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Compendium</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
        Famous gypsy jazz players
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Currently playing first, then legends of the past. Open a name for the
        photo and the bio.
      </p>
      <div className="mt-12 space-y-14">
        {groups.map((group) => (
          <section key={group.country}>
            <Link
              to="/world/$slug"
              params={{ slug: countrySlug(group.country) }}
              className="text-[11px] tracking-[0.18em] text-faint uppercase hover:text-fg"
            >
              <CountryLabel name={group.country} />
            </Link>
            {group.playing.length > 0 ? (
              <>
                <h2 className="mt-3 font-display text-2xl font-semibold">Currently playing</h2>
                <ul className="mt-3 columns-1 gap-x-10 sm:columns-2">
                  {group.playing.slice(0, 10).map((artist) => (
                    <li key={artist.slug} className="break-inside-avoid py-1">
                      <NameLink artist={artist} />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {group.past.length > 0 ? (
              <>
                <h2 className="mt-8 font-display text-2xl font-semibold">Legends of the past</h2>
                <ul className="mt-3 columns-1 gap-x-10 sm:columns-2">
                  {group.past.map((artist) => (
                    <li key={artist.slug} className="break-inside-avoid py-1">
                      <NameLink artist={artist} />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}

function NameLink({ artist }: { artist: Legend }) {
  const href = artistHref({
    slug: artist.slug,
    name: artist.name,
    kind: "legend",
    instruments: artist.instruments,
    place: artist.origin,
  });
  const className = "font-display text-xl font-semibold hover:underline";
  if (href === "/django") return <Link to="/django" className={className}>{artist.name}</Link>;
  if (href === "/grappelli") return <Link to="/grappelli" className={className}>{artist.name}</Link>;
  return (
    <Link to="/musicians/$slug" params={{ slug: artist.slug }} className={className}>
      {artist.name}
    </Link>
  );
}
