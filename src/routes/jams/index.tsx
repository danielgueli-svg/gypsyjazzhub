import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { EventFilters } from "@/components/event-filters";
import { JamLine } from "@/components/jam-line";
import { Button } from "@/components/ui/button";
import { CountryLabel } from "@/components/country-label";
import { countrySlug, displayCountry } from "@/lib/geo";
import { listHubJams } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { jamsByCountry, type Jam } from "@/lib/jams";
import { filterAgenda, jamToAgenda, uniqueCities, uniqueCountries } from "@/lib/agenda";
import { pageHead, SEO } from "@/lib/seo";
import { settle } from "@/lib/settle";

type Search = { country?: string; city?: string; weekday?: string; type?: string };

export const Route = createFileRoute("/jams/")({
  head: () => pageHead(SEO.jams),
  validateSearch: (search: Record<string, unknown>): Search => ({
    country: typeof search.country === "string" ? search.country : undefined,
    city: typeof search.city === "string" ? search.city : undefined,
    weekday: typeof search.weekday === "string" ? search.weekday : undefined,
    type: typeof search.type === "string" ? search.type : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => ({ extra: await settle("hub-jams", [], () => listHubJams()), filter: deps }),
  component: JamsPage,
});

function JamsPage() {
  const { extra, filter } = Route.useLoaderData();
  const groups = jamsByCountry(extra);
  const { t, locale } = useI18n();
  const router = useRouter();
  const ordered = [...groups].sort((a, b) =>
    displayCountry(a.country, locale).localeCompare(displayCountry(b.country, locale), locale, {
      sensitivity: "base",
    }),
  );
  const allJams = groups.flatMap((g) => g.jams);
  const cities = uniqueCities(allJams);
  const countries = uniqueCountries(allJams).sort((a, b) =>
    displayCountry(a, locale).localeCompare(displayCountry(b, locale), locale, { sensitivity: "base" }),
  );

  function allowed(jam: Jam) {
    const item = jamToAgenda(jam);
    return filterAgenda([item], {
      country: filter.country,
      city: filter.city,
      weekday: filter.weekday,
      type: filter.type === "concert" ? "none" : filter.type,
    }).length > 0;
  }

  function go(next: Search) {
    void router.navigate({
      to: "/jams",
      search: {
        country: next.country || undefined,
        city: next.city || undefined,
        weekday: next.weekday || undefined,
        type: next.type || undefined,
      },
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("jams.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
        {t("jams.title")}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {t("jams.lead")}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild size="lg">
          <Link to="/add" search={{ kind: "jam" }}>
            {t("jams.meetup")}
          </Link>
        </Button>
      </div>

      <EventFilters
        countries={countries}
        cities={cities}
        country={filter.country}
        city={filter.city}
        weekday={filter.weekday}
        type={filter.type}
        showType
        onCountry={(country) => go({ ...filter, country })}
        onCity={(city) => go({ ...filter, city })}
        onWeekday={(weekday) => go({ ...filter, weekday })}
        onType={(type) => go({ ...filter, type })}
      />

      <div className="mt-10 space-y-8">
        {ordered.map((group) => {
          const jams = group.jams.filter(allowed);
          if (!jams.length) return null;
          return (
            <section key={group.country}>
              <Link
                to="/world/$slug"
                params={{ slug: countrySlug(group.country) }}
                className="font-display text-2xl font-semibold hover:underline"
              >
                <CountryLabel name={group.country} />
              </Link>
              <span className="ml-2 text-sm text-muted">({jams.length})</span>
              <ul className="mt-2">
                {jams.map((jam) => (
                  <JamLine key={jam.slug} jam={jam} showCountry={false} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <Contribute heading={t("jams.add")} defaultKind="jam" />
    </main>
  );
}
