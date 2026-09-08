import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag } from "@/components/flag";
import { InstrumentsSubnav } from "@/components/instruments-subnav";
import { listConcerts, listLegends, listMusicians } from "@/lib/api";
import { listHubCountries } from "@/lib/country-requests";
import {
  buildGlobeIndex,
  countrySlug,
  displayCountry,
  findCountry,
  siteCountryNames,
} from "@/lib/geo";
import { listHubFestivals, listHubJams, listHubLuthiers, listHubVenues } from "@/lib/hub-api";
import { splitLuthiers } from "@/lib/luthiers";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/instruments/luthiers/")({
  head: () => pageHead(SEO.instrumentsLuthiers),
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
    const extraCountries = siteCountryNames(hubCountries.map((row) => row.name));
    const globe = buildGlobeIndex(
      legends,
      musicians,
      upcoming,
      hubFestivals,
      hubJams,
      hubVenues,
      hubLuthiers,
      extraCountries,
    );
    const rows = extraCountries
      .map((name) => {
        const country = findCountry(globe, countrySlug(name));
        const { guitar, bass, violin } = splitLuthiers(country?.luthiers ?? []);
        const shops = country?.shops ?? [];
        return {
          name,
          slug: countrySlug(name),
          shops: shops.length,
          violin: violin.length,
          bass: bass.length,
          guitar: guitar.length,
          total: shops.length + violin.length + bass.length + guitar.length,
        };
      })
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
    return { rows };
  },
  component: LuthiersByCountryPage,
});

function LuthiersByCountryPage() {
  const { rows } = Route.useLoaderData();
  const { t, locale } = useI18n();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("nav.instruments")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("country.makers")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t("country.makersIndexLead")}</p>
      <InstrumentsSubnav />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => {
          const label = displayCountry(row.name, locale);
          const bits = [
            row.shops ? `${row.shops} ${t("instruments.shops").toLowerCase()}` : null,
            row.violin ? `${row.violin} ${t("instruments.violinLuthiers").toLowerCase()}` : null,
            row.bass ? `${row.bass} ${t("instruments.bassLuthiers").toLowerCase()}` : null,
            row.guitar ? `${row.guitar} ${t("instruments.guitarLuthiers").toLowerCase()}` : null,
          ].filter(Boolean);
          return (
            <li key={row.slug}>
              <Link
                to="/instruments/luthiers/$country"
                params={{ country: row.slug }}
                className="block h-full rounded-2xl bg-surface px-5 py-4 shadow-border hover:bg-raised"
              >
                <p className="inline-flex items-center gap-2 font-display text-xl font-semibold leading-tight">
                  <Flag name={row.name} className="h-5 w-7" />
                  {label}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {bits.length ? bits.join(" · ") : t("country.makersMore")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
