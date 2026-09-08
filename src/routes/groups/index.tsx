import { createFileRoute, Link } from "@tanstack/react-router";
import { CountryLabel } from "@/components/country-label";
import { ListFold } from "@/components/list-fold";
import { groupsByCountry } from "@/lib/directory";
import { countrySlug } from "@/lib/geo";
import { BANDS } from "@/lib/scene";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/groups/")({
  head: () => pageHead(SEO.groups),
  component: GroupsPage,
});

function GroupsPage() {
  const groups = groupsByCountry(BANDS);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">On the stand</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Groups</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Band names by country — Netherlands, Germany, France first. Click a
        country for that page on the globe. Open a name for the photo, the
        members, and the concerts.
      </p>

      <div className="mt-12 space-y-12">
        {groups.map((group) => (
          <section key={group.country}>
            <Link
              to="/world/$slug"
              params={{ slug: countrySlug(group.country) }}
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-faint uppercase hover:text-fg"
            >
              <CountryLabel name={group.country} />
              <span className="font-sans tracking-normal text-muted">({group.groups.length})</span>
            </Link>
            <ListFold items={group.groups} limit={10}>
              {(shown) => (
                <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-5">
                  {shown.map((band) => (
                    <li key={band.slug} className="min-w-0">
                      <Link
                        to="/groups/$slug"
                        params={{ slug: band.slug }}
                        className="font-display text-xl font-semibold hover:underline"
                      >
                        {band.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </ListFold>
          </section>
        ))}
      </div>
    </main>
  );
}
