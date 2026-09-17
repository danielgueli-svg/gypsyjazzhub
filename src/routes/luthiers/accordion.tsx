import { createFileRoute, Link } from "@tanstack/react-router";
import { AccordionLuthiersDirectory } from "@/components/luthier-list";
import { Contribute } from "@/components/contribute";
import { listHubLuthiers } from "@/lib/hub-api";
import { pageHead, SEO } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/luthiers/accordion")({
  head: () => pageHead(SEO.accordionLuthiers),
  loader: async () => ({ extra: await listHubLuthiers() }),
  component: AccordionLuthiersPage,
});

function AccordionLuthiersPage() {
  const { extra } = Route.useLoaderData();
  const { t } = useI18n();
  const accordionExtra = extra.filter((row) => row.craft === "accordion");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("accordion.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("accordion.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {t("accordion.worldLead")}
      </p>
      <p className="mt-3 text-sm">
        <Link to="/luthiers" className="text-muted hover:text-fg hover:underline">
          {t("accordion.backLuthiers")}
        </Link>
      </p>

      <div className="mt-10">
        <AccordionLuthiersDirectory extra={accordionExtra} />
      </div>

      <div className="mt-12">
        <Contribute heading="Add an accordion atelier" defaultKind="luthier" defaultCraft="accordion" />
      </div>
    </main>
  );
}
