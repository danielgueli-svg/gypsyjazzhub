import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag } from "@/components/flag";
import { InstrumentsSubnav } from "@/components/instruments-subnav";
import { MakerSection, luthierEntry, shopEntry } from "@/components/makers-rows";
import { listConcerts, listLegends, listMusicians } from "@/lib/api";
import { listHubCountries } from "@/lib/country-requests";
import {
  buildGlobeIndex,
  countryFromSlug,
  displayCountry,
  findCountry,
  sameCountry,
  siteCountryNames,
} from "@/lib/geo";
import { listHubFestivals, listHubJams, listHubLuthiers, listHubVenues } from "@/lib/hub-api";
import { splitLuthiers } from "@/lib/luthiers";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/instruments/luthiers/$country")({
  loader: async ({ params }) => {
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
    const country = findCountry(globe, params.country);
    const atlasName = country?.name ?? countryFromSlug(params.country) ?? params.country.replace(/-/g, " ");
    const luthiers = (country?.luthiers ?? []).filter((item) => sameCountry(item.country, atlasName));
    const shops = (country?.shops ?? []).filter((item) => sameCountry(item.country, atlasName));
    return {
      country: country ?? null,
      atlasName,
      slug: params.country,
      luthiers,
      shops,
    };
  },
  head: ({ loaderData, params }) => {
    const name = loaderData?.country?.displayName ?? loaderData?.atlasName ?? "this country";
    return pageHead({
      title: `Luthiers & shops in ${name}`,
      description: `Gypsy jazz guitar shops, violin luthiers and double bass workshops in ${name}.`,
      path: `/instruments/luthiers/${params.country}`,
    });
  },
  component: CountryLuthiersPage,
});

function CountryLuthiersPage() {
  const { country, atlasName, slug, luthiers, shops } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const name = displayCountry(country?.name ?? atlasName, locale);
  const { guitar, bass, violin } = splitLuthiers(luthiers);
  const byName = <T extends { name: string }>(rows: T[]) =>
    [...rows].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-sm">
        <Link to="/instruments/luthiers" className="text-muted hover:text-fg">
          {t("country.makers")}
        </Link>
        {" · "}
        <Link to="/world/$slug" params={{ slug }} className="text-muted hover:text-fg">
          {name}
        </Link>
      </p>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">{t("country.makers")}</p>
      <h1 className="mt-3 inline-flex items-center gap-3 font-display text-4xl font-semibold sm:text-5xl">
        <Flag name={country?.name ?? atlasName} className="h-8 w-11 sm:h-10 sm:w-14" />
        {name}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
        {t("country.makersLead").replace("{country}", name)}
      </p>
      <InstrumentsSubnav />

      <MakerSection
        title={t("instruments.shops")}
        lead={t("country.shopsLead").replace("{country}", name)}
        entries={byName(shops).map(shopEntry)}
      />

      <MakerSection
        title={t("instruments.violinLuthiers")}
        lead={t("violin.lead").replaceAll("{country}", name)}
        entries={byName(violin).map(luthierEntry)}
      />

      <MakerSection
        title={t("instruments.bassLuthiers")}
        lead={t("bass.lead")}
        entries={byName(bass).map(luthierEntry)}
      />

      {guitar.length ? (
        <MakerSection
          title={t("instruments.guitarLuthiers")}
          lead={t("country.guitarLuthiersLead").replace("{country}", name)}
          entries={byName(guitar).map(luthierEntry)}
        />
      ) : null}
    </main>
  );
}
