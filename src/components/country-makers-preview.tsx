import { Link } from "@tanstack/react-router";
import { MakerRows, luthierEntry, shopEntry } from "@/components/makers-rows";
import { Button } from "@/components/ui/button";
import type { Luthier } from "@/lib/luthiers";
import type { Shop } from "@/lib/shops";
import { useI18n } from "@/lib/i18n";

const PREVIEW = 5;

function pickPreview(shops: Shop[], violin: Luthier[], bass: Luthier[], guitar: Luthier[]) {
  const entries = [
    ...shops.map(shopEntry),
    ...violin.map(luthierEntry),
    ...bass.map(luthierEntry),
    ...guitar.map(luthierEntry),
  ];
  return entries.slice(0, PREVIEW);
}

export function CountryMakersPreview({
  guitar,
  violin,
  bass,
  shops,
  countryName,
  countrySlug,
}: {
  guitar: Luthier[];
  violin: Luthier[];
  bass: Luthier[];
  shops: Shop[];
  countryName: string;
  countrySlug: string;
}) {
  const { t } = useI18n();
  const cta = t("country.viewAllMakers").replace("{country}", countryName);
  const preview = pickPreview(shops, violin, bass, guitar);
  const bits = [
    shops.length ? `${shops.length} ${t("instruments.shops").toLowerCase()}` : null,
    violin.length ? `${violin.length} ${t("instruments.violinLuthiers").toLowerCase()}` : null,
    bass.length ? `${bass.length} ${t("instruments.bassLuthiers").toLowerCase()}` : null,
    guitar.length ? `${guitar.length} ${t("instruments.guitarLuthiers").toLowerCase()}` : null,
  ].filter(Boolean);

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
