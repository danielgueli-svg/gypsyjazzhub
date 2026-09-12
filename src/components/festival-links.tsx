import { Link } from "@tanstack/react-router";
import type { Festival } from "@/lib/festivals";
import { CountryLabel } from "@/components/country-label";
import { whenLabel } from "@/lib/festival-copy";
import { useI18n } from "@/lib/i18n";

export function FestivalLinks({ festivals }: { festivals: Festival[] }) {
  const { t, locale } = useI18n();
  if (festivals.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold">{t("nav.festivals")}</h2>
      <p className="mt-2 text-sm text-muted">
        {t("festival.artistsLead")}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {festivals.map((festival) => (
          <Link
            key={festival.slug}
            to="/festivals/$slug"
            params={{ slug: festival.slug }}
            className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
          >
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
              <CountryLabel name={festival.country} /> · {whenLabel(festival.when, locale)}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
              {festival.name}
            </h3>
            <p className="mt-1 text-sm text-muted">{festival.city}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
