import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { JamLine } from "@/components/jam-line";
import { Button } from "@/components/ui/button";
import { CountryLabel } from "@/components/country-label";
import { countryFromSlug, countrySlug } from "@/lib/geo";
import { listHubJams } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { jamsByCountry } from "@/lib/jams";

export const Route = createFileRoute("/jams/in/$slug")({
  loader: async ({ params }) => {
    const extra = await listHubJams();
    const group = jamsByCountry(extra).find(
      (row) => countrySlug(row.country) === params.slug,
    );
    if (group) return { group };
    const country = countryFromSlug(params.slug);
    if (!country) throw notFound();
    return { group: { country, jams: [] } };
  },
  component: JamsInCountry,
});

function JamsInCountry() {
  const { group } = Route.useLoaderData();
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Link to="/jams" className="text-sm text-muted hover:text-fg">
        ← {t("nav.jams")}
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">
        {t("home.jams")}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
        <Link
          to="/world/$slug"
          params={{ slug: countrySlug(group.country) }}
          className="hover:underline"
        >
          <CountryLabel name={group.country} />
        </Link>
      </h1>
      <div className="mt-6">
        <Button asChild>
          <Link to="/add" search={{ kind: "jam" }}>
            {t("home.organize")}
          </Link>
        </Button>
      </div>
      {group.jams.length === 0 ? (
        <p className="mt-8 text-sm text-muted">{t("country.noJams")}</p>
      ) : (
        <ul className="mt-8">
          {group.jams.map((jam) => (
            <JamLine key={jam.slug} jam={jam} showCountry={false} />
          ))}
        </ul>
      )}
      <Contribute heading={t("jams.add")} defaultKind="jam" />
    </main>
  );
}
