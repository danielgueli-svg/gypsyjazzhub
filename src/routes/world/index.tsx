import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { CountryClicker } from "@/components/country-clicker";
import { WorldGlobe } from "@/components/world-globe";
import { listConcerts, listLegends, listMusicians } from "@/lib/api";
import { listHubCountries } from "@/lib/country-requests";
import { buildGlobeIndex, countrySlug, displayCountry, globeButtonNames } from "@/lib/geo";
import { listHubFestivals, listHubJams, listHubLuthiers, listHubVenues } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/world/")({
  head: () =>
    pageHead({
      title: "Countries",
      description:
        "Gypsy jazz by country — spin the globe for jams, concerts, luthiers and shops.",
    }),
  loader: async () => {
    const [concerts, legends, musicians, hubFestivals, hubJams, hubVenues, hubLuthiers, hubCountries] =
      await Promise.all([
        listConcerts({ data: { filter: "upcoming" } }),
        listLegends(),
        listMusicians({ data: {} }),
        listHubFestivals(),
        listHubJams(),
        listHubVenues(),
        listHubLuthiers(),
        listHubCountries(),
      ]);
    const upcoming = concerts.filter(
      (c) => !c.isHistoric && new Date(c.startsAt).getTime() >= Date.now(),
    );
    const globe = buildGlobeIndex(
      legends,
      musicians,
      upcoming,
      hubFestivals,
      hubJams,
      hubVenues,
      hubLuthiers,
      hubCountries.map((row) => row.name),
    );
    const globeCountries: Record<string, true> = {};
    for (const name of Object.keys(globe)) globeCountries[name] = true;
    return {
      globeCountries,
      activeNames: globeButtonNames(globe),
    };
  },
  component: WorldIndexPage,
});

function WorldIndexPage() {
  const { globeCountries, activeNames } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const alphaCountries = useMemo(
    () =>
      [...activeNames].sort((a, b) =>
        displayCountry(a, locale).localeCompare(displayCountry(b, locale), locale, {
          sensitivity: "base",
        }),
      ),
    [activeNames, locale],
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("nav.globe")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("nav.globe")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t("home.intro")}</p>

      <section className="mt-8">
        <div className="relative z-0 overflow-visible rounded-2xl bg-[#071018] p-3 ring-1 ring-white/15 sm:p-4">
          <WorldGlobe
            countries={globeCountries}
            selected={null}
            onSelect={(name) => {
              void navigate({
                to: "/world/$slug",
                params: { slug: countrySlug(name) },
              });
            }}
          />
          <div className="flex justify-center">
            <CountryClicker
              countries={alphaCountries}
              value={null}
              allowClear={false}
              layout="list"
              onDark
              className="mt-3 mb-0"
              onChange={(slug) => {
                if (!slug) return;
                void navigate({
                  to: "/world/$slug",
                  params: { slug },
                });
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
