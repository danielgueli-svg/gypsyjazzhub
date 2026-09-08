import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { CountryLabel } from "@/components/country-label";
import { countrySlug, groupByContinent, type ContinentId } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function GlobeRegions({ names }: { names: string[] }) {
  const { t, locale } = useI18n();
  const groups = useMemo(() => {
    const rows = groupByContinent(names);
    return [...rows].sort((a, b) =>
      t(`home.region.${a.id}`).localeCompare(t(`home.region.${b.id}`), locale, {
        sensitivity: "base",
      }),
    );
  }, [names, t, locale]);
  const [open, setOpen] = useState<ContinentId | null>(null);
  const active = groups.find((group) => group.id === open);

  return (
    <div className="mt-3">
      <div className="flex flex-wrap justify-center gap-1.5">
        {groups.map((group) => {
          const on = open === group.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setOpen(on ? null : group.id)}
              aria-expanded={on}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm",
                on ? "bg-white/20 text-white" : "bg-white/10 text-white/80 hover:text-white",
              )}
            >
              {t(`home.region.${group.id}`)}
              <span className="text-[11px] text-white/50">{group.countries.length}</span>
              <ChevronDown
                className={cn("size-4 text-white/50 transition-transform", on && "rotate-180")}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
      {active ? (
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {active.countries.map((name) => (
            <Link
              key={name}
              to="/world/$slug"
              params={{ slug: countrySlug(name) }}
              className="inline-flex h-8 items-center rounded-md bg-white/10 px-2.5 text-xs text-white/80 hover:text-white"
            >
              <CountryLabel name={name} short />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
