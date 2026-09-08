import { createFileRoute, Link } from "@tanstack/react-router";
import { InstrumentsSubnav } from "@/components/instruments-subnav";
import { SuggestViolinLuthier, ViolinLuthiersDirectory } from "@/components/violin-luthiers";
import { listHubLuthiers } from "@/lib/hub-api";
import { INSTRUMENTS } from "@/lib/instruments";
import { instrumentCopy } from "@/lib/instruments-copy";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/instruments/other")({
  head: () => pageHead(SEO.instrumentsOther),
  loader: async () => ({ extra: await listHubLuthiers() }),
  component: OtherInstrumentsPage,
});

const OTHER_SLUGS = [
  "violin",
  "clarinet",
  "saxophone",
  "vocals",
  "accordion",
  "mandolin",
  "piano",
  "harmonica",
] as const;

function OtherInstrumentsPage() {
  const { extra } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const violinExtra = extra.filter((row) => row.craft === "violin");

  const chairs = OTHER_SLUGS.map((slug) => ({
    slug,
    copy: instrumentCopy(slug, locale),
  })).filter((chair) => INSTRUMENTS.some((item) => item.slug === chair.slug));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("instruments.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("instruments.other")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t("instruments.otherLead")}</p>
      <InstrumentsSubnav />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {chairs.map((chair) => (
          <li key={chair.slug} id={chair.slug}>
            <Link
              to="/learn/instruments/$slug"
              params={{ slug: chair.slug }}
              className="block h-full rounded-2xl bg-surface p-6 shadow-border hover:bg-raised"
            >
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{chair.copy.role}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{chair.copy.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{chair.copy.blurb}</p>
              <p className="mt-3 text-sm text-fg">{t("instruments.learn")}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">{t("instruments.violinLuthiers")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("violin.worldLead")}</p>
        <div className="mt-8">
          <ViolinLuthiersDirectory extra={violinExtra} />
        </div>
      </section>

      <div className="mt-12">
        <SuggestViolinLuthier />
      </div>
    </main>
  );
}
