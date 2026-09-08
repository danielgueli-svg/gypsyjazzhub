import { Link } from "@tanstack/react-router";
import type { Camp } from "@/lib/camps";
import { CountryLabel } from "@/components/country-label";
import { useI18n } from "@/lib/i18n";

export function CampLinks({ camps }: { camps: Camp[] }) {
  const { t } = useI18n();
  if (camps.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold">{t("country.camps")}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {camps.map((camp) => (
          <Link
            key={camp.slug}
            to="/learn/$slug"
            params={{ slug: camp.slug }}
            className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
          >
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
              <CountryLabel name={camp.country} short /> · {camp.when}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
              {camp.name}
            </h3>
            <p className="mt-1 text-sm text-muted">{camp.city}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
