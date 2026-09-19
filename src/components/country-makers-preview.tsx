import { Link } from "@tanstack/react-router";
import { MakerRows, luthierEntry, shopEntry } from "@/components/makers-rows";
import { Button } from "@/components/ui/button";
import type { Luthier } from "@/lib/luthiers";
import { splitLuthiers } from "@/lib/luthiers";
import type { Shop } from "@/lib/shops";
import { useI18n } from "@/lib/i18n";

const PREVIEW = 5;

export function CountryMakersPreview({
  luthiers,
  shops,
  countryName,
  countrySlug,
}: {
  luthiers: Luthier[];
  shops: Shop[];
  countryName: string;
  countrySlug: string;
}) {
  const { t } = useI18n();
  const cta = t("country.viewAllMakers").replace("{country}", countryName);
  const { guitar, bass, violin, accordion, other } = splitLuthiers(luthiers);
  const preview = [...luthiers.map(luthierEntry), ...shops.map(shopEntry)].slice(
    0,
    Math.max(PREVIEW, luthiers.length ? Math.min(luthiers.length + Math.min(2, shops.length), PREVIEW + 4) : PREVIEW),
  );
  const bits = [
    guitar.length ? `${guitar.length} ${t("instruments.guitarLuthiers").toLowerCase()}` : null,
    bass.length ? `${bass.length} ${t("instruments.bassLuthiers").toLowerCase()}` : null,
    violin.length ? `${violin.length} ${t("instruments.violinLuthiers").toLowerCase()}` : null,
    accordion.length ? `${accordion.length} ${t("instruments.accordionLuthiers").toLowerCase()}` : null,
    other.length ? `${other.length} ${t("instruments.otherLuthiers").toLowerCase()}` : null,
    shops.length ? `${shops.length} ${t("instruments.shops").toLowerCase()}` : null,
  ].filter(Boolean);

  if (!luthiers.length) return null;

  return (
    <section id="makers" className="mt-12 scroll-mt-40">
      <h2 className="font-display text-3xl font-semibold">{t("country.makers")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        {t("country.makersLead").replace("{country}", countryName)}
      </p>
      {bits.length ? (
        <p className="mt-2 text-sm text-muted">{bits.join(" · ")}</p>
      ) : null}

      {preview.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t("country.makersMore")}</p>
      ) : (
        <div className="mt-5">
          <MakerRows entries={preview} />
        </div>
      )}

      <div className="mt-8">
        <Button asChild size="lg">
          <Link to="/instruments/luthiers/$country" params={{ country: countrySlug }}>
            {cta}
          </Link>
        </Button>
      </div>
    </section>
  );
}
