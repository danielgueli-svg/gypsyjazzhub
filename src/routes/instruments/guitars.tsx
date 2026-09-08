import { createFileRoute, Link } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { InstrumentsSubnav } from "@/components/instruments-subnav";
import { GuitarLuthiersDirectory } from "@/components/luthier-list";
import { ShopsDirectory } from "@/components/shops-directory";
import { listHubLuthiers } from "@/lib/hub-api";
import { instrumentCopy } from "@/lib/instruments-copy";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/instruments/guitars")({
  head: () => pageHead(SEO.instrumentsGuitars),
  loader: async () => ({ extra: await listHubLuthiers() }),
  component: GuitarsPage,
});

function GuitarsPage() {
  const { extra } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const solo = instrumentCopy("solo-guitar", locale);
  const rhythm = instrumentCopy("rhythm-guitar", locale);
  const guitarExtra = extra.filter((row) => row.craft === "guitar");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("instruments.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("instruments.guitars")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t("instruments.guitarsLead")}</p>
      <InstrumentsSubnav />

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link
          to="/learn/instruments/$slug"
          params={{ slug: "solo-guitar" }}
          className="rounded-2xl bg-surface p-6 shadow-border hover:bg-raised"
        >
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{solo.role}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">{solo.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{solo.blurb}</p>
        </Link>
        <Link
          to="/learn/instruments/$slug"
          params={{ slug: "rhythm-guitar" }}
          className="rounded-2xl bg-surface p-6 shadow-border hover:bg-raised"
        >
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{rhythm.role}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">{rhythm.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{rhythm.blurb}</p>
        </Link>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">{t("instruments.guitarLuthiers")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {t("luthiers.lead")}
        </p>
        <div className="mt-8">
          <GuitarLuthiersDirectory extra={guitarExtra} />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">{t("instruments.shops")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {t("nav.hint.shops")}
        </p>
        <div className="mt-8">
          <ShopsDirectory />
        </div>
      </section>

      <Contribute heading="Add a luthier" />
    </main>
  );
}
