import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopsDirectory } from "@/components/shops-directory";
import { pageHead, SEO } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/shops/")({
  head: () => pageHead(SEO.shops),
  component: ShopsPage,
});

function ShopsPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">The shops</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("nav.shops")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Retail shops that specialise in — or regularly stock — Selmer-Maccaferri
        style guitars, grouped by country. Makers who build to order live on the{" "}
        <Link to="/luthiers" className="text-fg hover:underline">
          luthiers
        </Link>{" "}
        page. All instrument makers and shops also live under{" "}
        <Link to="/instruments" className="text-fg hover:underline">
          Instruments
        </Link>
        . Open a name for address, phone, email and a map.
      </p>

      <div className="mt-10">
        <ShopsDirectory />
      </div>
    </main>
  );
}
