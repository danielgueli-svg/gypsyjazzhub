import { createFileRoute, Link } from "@tanstack/react-router";
import { InstrumentsSubnav } from "@/components/instruments-subnav";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/instruments/")({
  head: () => pageHead(SEO.instruments),
  component: InstrumentsOverview,
});

function InstrumentsOverview() {
  const { t } = useI18n();

  const chairs = [
    {
      to: "/instruments/guitars" as const,
      key: "instruments.guitars",
      lead: "instruments.guitarsLead",
      role: "Lead · la pompe",
    },
    {
      to: "/instruments/double-bass" as const,
      key: "instruments.bass",
      lead: "instruments.bassLead",
      role: "The floor",
    },
    {
      to: "/instruments/other" as const,
      key: "instruments.other",
      lead: "instruments.otherLead",
      role: "Violin · reed · voice",
    },
  ];

  const dirs = [
    { to: "/shops" as const, key: "instruments.shops" },
    { to: "/luthiers/violin" as const, key: "instruments.violinLuthiers" },
    { to: "/luthiers/bass" as const, key: "instruments.bassLuthiers" },
    { to: "/luthiers" as const, key: "instruments.guitarLuthiers" },
    { to: "/instruments/luthiers" as const, key: "country.makers" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("instruments.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("instruments.title")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t("instruments.lead")}</p>
      <InstrumentsSubnav />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {chairs.map((chair) => (
          <li key={chair.to}>
            <Link
              to={chair.to}
              className="block h-full rounded-2xl bg-surface p-6 shadow-border hover:bg-raised"
            >
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{chair.role}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">{t(chair.key)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(chair.lead)}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">{t("instruments.directories")}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {dirs.map((dir) => (
            <li key={dir.to}>
              <Link
                to={dir.to}
                className="block rounded-2xl bg-surface px-5 py-4 shadow-border hover:bg-raised"
              >
                <p className="font-display text-xl font-semibold leading-tight">{t(dir.key)}</p>
                <p className="mt-1 text-sm text-muted">{t("instruments.browse")}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 max-w-2xl text-sm leading-relaxed text-muted">
        {t("instruments.learn")}{" "}
        <Link to="/learn" className="text-fg hover:underline">
          {t("nav.learn")}
        </Link>
        .
      </p>
    </main>
  );
}
