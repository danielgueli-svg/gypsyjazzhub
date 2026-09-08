import { Link } from "@tanstack/react-router";
import { LuthierName } from "@/components/luthier-name";
import { CountryLabel } from "@/components/country-label";
import type { Luthier } from "@/lib/luthiers";
import { luthiersByCountryForCraft, siteHost, splitLuthiers } from "@/lib/luthiers";
import { countrySlug } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";

export function LuthierList({ luthiers }: { luthiers: Luthier[] }) {
  const { t } = useI18n();
  const { guitar, bass, violin } = splitLuthiers(luthiers);
  if (!guitar.length && !bass.length && !violin.length) return null;

  const labelled = [guitar.length, bass.length, violin.length].filter(Boolean).length > 1;

  return (
    <div className="space-y-6">
      {guitar.length ? (
        <CraftBlock label={labelled ? t("luthiers.guitar") : undefined} rows={guitar} />
      ) : null}
      {bass.length ? <CraftBlock label={t("luthiers.bass")} rows={bass} rich /> : null}
      {violin.length ? <CraftBlock label={t("luthiers.violin")} rows={violin} rich /> : null}
    </div>
  );
}

export function GuitarLuthiersDirectory({ extra = [] }: { extra?: Luthier[] }) {
  const groups = luthiersByCountryForCraft("guitar", extra);

  if (groups.length === 0) return null;

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.country}>
          <Link
            to="/world/$slug"
            params={{ slug: countrySlug(group.country) }}
            className="text-[11px] tracking-[0.18em] text-faint uppercase hover:text-fg"
          >
            <CountryLabel name={group.country} />
            <span className="ml-2 text-faint">({group.luthiers.length})</span>
          </Link>
          <div className="mt-3">
            <LuthierList luthiers={group.luthiers} />
          </div>
        </section>
      ))}
    </div>
  );
}

function CraftBlock({
  label,
  rows,
  rich,
}: {
  label?: string;
  rows: Luthier[];
  rich?: boolean;
}) {
  return (
    <div>
      {label ? (
        <p className="text-[11px] tracking-[0.18em] text-faint uppercase">{label}</p>
      ) : null}
      <ul className={label ? "mt-3 columns-1 gap-x-10 sm:columns-2" : "columns-1 gap-x-10 sm:columns-2"}>
        {rows.map((luthier) => (
          <li key={luthier.slug} className="break-inside-avoid py-1.5">
            <LuthierName luthier={luthier} />
            {luthier.city ? <span className="text-sm text-muted"> · {luthier.city}</span> : null}
            {rich && luthier.site ? (
              <p className="text-sm">
                <a
                  href={luthier.site}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-fg hover:underline"
                >
                  {siteHost(luthier.site)}
                </a>
              </p>
            ) : null}
            {rich && luthier.note ? <p className="text-sm text-muted">{luthier.note}</p> : null}
            {!rich && luthier.hours && luthier.hours !== "By appointment" ? (
              <p className="text-sm text-muted">{luthier.hours}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
