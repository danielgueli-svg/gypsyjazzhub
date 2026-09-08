import { createFileRoute, Link } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { LuthierList } from "@/components/luthier-list";
import { ShopsDirectory } from "@/components/shops-directory";
import { CountryLabel } from "@/components/country-label";
import { countrySlug } from "@/lib/geo";
import { listHubLuthiers } from "@/lib/hub-api";
import { luthiersByCountry } from "@/lib/luthiers";
import { pageHead, SEO } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/luthiers/")({
  head: () => pageHead(SEO.luthiers),
  loader: async () => ({ extra: await listHubLuthiers() }),
  component: LuthiersPage,
});

function LuthiersPage() {
  const { extra } = Route.useLoaderData();
  const groups = luthiersByCountry(extra);
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("luthiers.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("nav.luthiers")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {t("luthiers.lead")}{" "}
        <Link to="/instruments" className="text-fg hover:underline">
          {t("nav.instruments")}
        </Link>
        {" · "}
        <Link to="/luthiers/bass" className="text-fg hover:underline">
          {t("bass.worldwide")}
        </Link>
        {" · "}
        <Link to="/luthiers/violin" className="text-fg hover:underline">
          {t("violin.worldwide")}
        </Link>
        .
      </p>

      <div className="mt-10 space-y-10">
        {groups.map((group) => (
          <section key={group.country}>
            <Link
              to="/world/$slug"
              params={{ slug: countrySlug(group.country) }}
              className="text-[11px] tracking-[0.18em] text-faint uppercase hover:text-fg"
            >
              <CountryLabel name={group.country} />
              <span className="ml-2 text-faint">({group.luthiers.length})</span>
            </Link>
            <div className="mt-3">
              <LuthierList luthiers={group.luthiers} />
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16">
        <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Retail</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">{t("country.shops")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Shops that specialise in Selmer-Maccaferri style guitars — stock on
          the floor, not only a workshop. Open a name for address, phone and
          email. The full list is also on{" "}
          <Link to="/shops" className="text-fg hover:underline">
            guitar shops
          </Link>
          .
        </p>
        <div className="mt-8">
          <ShopsDirectory />
        </div>
      </section>

      <Contribute heading="Add a luthier" />
    </main>
  );
}
