import { createFileRoute, Link } from "@tanstack/react-router";
import { BassLuthiersDirectory, SuggestBassLuthier } from "@/components/bass-luthiers";
import { listHubLuthiers } from "@/lib/hub-api";
import { pageHead, SEO } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/luthiers/bass")({
  head: () => pageHead(SEO.bassLuthiers),
  loader: async () => ({ extra: await listHubLuthiers() }),
  component: BassLuthiersPage,
});

function BassLuthiersPage() {
  const { extra } = Route.useLoaderData();
  const { t } = useI18n();
  const bassExtra = extra.filter((row) => row.craft === "bass");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("bass.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("bass.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {t("bass.worldLead")}
      </p>
      <p className="mt-3 text-sm">
        <Link to="/luthiers" className="text-muted hover:text-fg hover:underline">
          {t("bass.backLuthiers")}
        </Link>
      </p>

      <div className="mt-10">
        <BassLuthiersDirectory extra={bassExtra} />
      </div>

      <div className="mt-12">
        <SuggestBassLuthier />
      </div>
    </main>
  );
}
