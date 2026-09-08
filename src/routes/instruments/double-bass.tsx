import { createFileRoute, Link } from "@tanstack/react-router";
import { BassLuthiersDirectory, SuggestBassLuthier } from "@/components/bass-luthiers";
import { InstrumentsSubnav } from "@/components/instruments-subnav";
import { listHubLuthiers } from "@/lib/hub-api";
import { instrumentCopy } from "@/lib/instruments-copy";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/instruments/double-bass")({
  head: () => pageHead(SEO.instrumentsBass),
  loader: async () => ({ extra: await listHubLuthiers() }),
  component: DoubleBassPage,
});

function DoubleBassPage() {
  const { extra } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const bass = instrumentCopy("double-bass", locale);
  const bassExtra = extra.filter((row) => row.craft === "bass");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("instruments.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("instruments.bass")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t("instruments.bassLead")}</p>
      <InstrumentsSubnav />

      <Link
        to="/learn/instruments/$slug"
        params={{ slug: "double-bass" }}
        className="mt-10 block rounded-2xl bg-surface p-6 shadow-border hover:bg-raised"
      >
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{bass.role}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{bass.name}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{bass.blurb}</p>
        <p className="mt-3 text-sm text-fg">{t("instruments.learn")}</p>
      </Link>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">{t("instruments.bassLuthiers")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("bass.worldLead")}</p>
        <div className="mt-8">
          <BassLuthiersDirectory extra={bassExtra} />
        </div>
      </section>

      <div className="mt-12">
        <SuggestBassLuthier />
      </div>
    </main>
  );
}
