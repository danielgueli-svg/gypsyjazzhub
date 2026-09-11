import { createFileRoute } from "@tanstack/react-router";
import { CountryView } from "@/components/country-view";
import { listConcerts, listLegends, listMusicians } from "@/lib/api";
import { buildGlobeIndex, findCountry, siteCountryNames } from "@/lib/geo";
import { listHubChat, listHubFestivals, listHubJams, listHubLuthiers, listHubTeachers, listHubVenues } from "@/lib/hub-api";
import { listHubCountries } from "@/lib/country-requests";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/world/$slug")({
  loader: async ({ params }) => {
    const [concerts, legends, musicians, hubFestivals, hubJams, hubVenues, hubLuthiers, chat, teachers, hubCountries] =
      await Promise.all([
        listConcerts({ data: { filter: "upcoming" } }),
        listLegends(),
        listMusicians({ data: {} }),
        listHubFestivals(),
        listHubJams(),
        listHubVenues(),
        listHubLuthiers(),
        listHubChat({ data: { kind: "country", slug: params.slug } }),
        listHubTeachers({ data: params.slug }),
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
      siteCountryNames(hubCountries.map((row) => row.name)),
    );
    const country = findCountry(globe, params.slug);
    return {
      country: country ?? null,
      selected: country?.name ?? params.slug.replace(/-/g, " "),
      slug: params.slug,
      chat,
      teachers,
    };
  },
  head: ({ loaderData, params }) => {
    const name = loaderData?.country?.displayName ?? loaderData?.selected ?? "this country";
    return pageHead({
      title: `Gypsy jazz in ${name}`,
      description: `Gypsy jazz jam sessions, concerts, festivals and musicians in ${name}. Jazz Manouche events on Gypsy Jazz Hub.`,
      path: `/world/${params.slug}`,
    });
  },
  component: WorldCountryPage,
});

function WorldCountryPage() {
  const { country, selected, slug, chat, teachers } = Route.useLoaderData();
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <CountryView
        selected={selected}
        country={country}
        slug={slug}
        chat={chat}
        teachers={teachers}
      />
    </main>
  );
}
