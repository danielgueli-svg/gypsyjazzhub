import { ChevronDown, Globe2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Flag } from "@/components/flag";
import { countrySlug, displayCountry, groupByContinent } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function isUsa(name: string) {
  const slug = countrySlug(name);
  return slug === "united-states-of-america" || slug === "united-states" || slug === "usa";
}

function countryMatches(name: string, query: string, locale: string) {
  const needle = fold(query.trim());
  if (!needle) return true;
  const label = fold(displayCountry(name, locale));
  const raw = fold(name);
  return label.includes(needle) || raw.includes(needle);
}

function countryRank(name: string, query: string, locale: string) {
  const needle = fold(query.trim());
  const label = fold(displayCountry(name, locale));
  const raw = fold(name);
  const words = `${label} ${raw}`.split(/[^a-z0-9]+/).filter(Boolean);
  if (label.startsWith(needle) || raw.startsWith(needle)) return 0;
  if (words.some((word) => word.startsWith(needle))) return 1;
  return 2;
}

export function CountryClicker({
  countries,
  value,
  onChange,
  allowClear = true,
  className,
  layout = "chips",
  onDark = false,
}: {
  countries: string[];
  value: string | null;
  onChange: (slug: string | null) => void;
  allowClear?: boolean;
  className?: string;
  layout?: "chips" | "list";
  onDark?: boolean;
}) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = countries.find((name) => countrySlug(name) === value) ?? null;
  const groups = useMemo(() => {
    const rows = groupByContinent(countries.filter((name) => !isUsa(name)));
    const europe = rows.filter((group) => group.id === "europe");
    const rest = rows.filter((group) => group.id !== "europe");
    return [...europe, ...rest];
  }, [countries]);

  const filtered = useMemo(() => {
    const q = query.trim();
    const names = countries.filter((name) => countryMatches(name, q, locale));
    names.sort((a, b) => {
      if (!q) {
        if (isUsa(a) && !isUsa(b)) return -1;
        if (!isUsa(a) && isUsa(b)) return 1;
      }
      if (q) {
        const d = countryRank(a, q, locale) - countryRank(b, q, locale);
        if (d) return d;
      }
      return displayCountry(a, locale).localeCompare(displayCountry(b, locale), locale, {
        sensitivity: "base",
      });
    });
    return names;
  }, [countries, query, locale]);

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;
    const allow = new Set(filtered);
    return groups
      .map((group) => ({
        ...group,
        countries: group.countries
          .filter((name) => allow.has(name))
          .sort((a, b) => filtered.indexOf(a) - filtered.indexOf(b)),
      }))
      .filter((group) => group.countries.length);
  }, [groups, query, filtered]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const id = window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (countries.length < 2) return null;

  function pick(slug: string | null) {
    onChange(slug);
    setQuery("");
    setOpen(false);
  }

  function onSearchKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const first = filtered[0];
    if (first) pick(countrySlug(first));
  }

  const searchField = (
    <input
      ref={searchRef}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      onKeyDown={onSearchKey}
      placeholder={t("home.searchCountry")}
      aria-label={t("home.searchCountry")}
      className="mb-2 h-11 w-full rounded-md bg-raised px-3 text-sm text-fg placeholder:text-faint outline-none"
    />
  );

  if (layout === "list") {
    return (
      <div ref={root} className={cn("relative z-20 mt-4", className)}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            "inline-flex min-h-12 w-[min(100%,22rem)] items-center justify-between gap-2 rounded-lg px-3.5 text-left text-base sm:min-h-11 sm:text-sm",
            onDark
              ? "bg-white/15 text-white ring-1 ring-white/30"
              : "bg-raised text-fg shadow-border",
          )}
        >
          <span>{selected ? displayCountry(selected, locale) : t("home.chooseCountry")}</span>
          <ChevronDown
            className={cn("size-4 shrink-0 opacity-70 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
        {open ? (
          <div
            role="listbox"
            className="absolute left-1/2 z-[300] mt-2 w-[min(100vw-2rem,22rem)] -translate-x-1/2 rounded-xl bg-surface p-2 text-fg shadow-border ring-1 ring-border sm:left-0 sm:translate-x-0"
          >
            {searchField}
            <div className="max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-3 py-3 text-sm text-muted">{t("home.noCountryMatch")}</p>
              ) : (
                filtered.map((name) => {
                  const slug = countrySlug(name);
                  const on = value === slug;
                  return (
                    <button
                      key={name}
                      type="button"
                      role="option"
                      aria-selected={on}
                      onClick={() => pick(slug)}
                      className={cn(
                        "flex min-h-11 w-full items-center rounded-md px-3 text-left text-sm",
                        on ? "bg-accent text-accent-fg" : "text-fg hover:bg-raised",
                      )}
                    >
                      {displayCountry(name, locale)}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={root} className={cn("relative z-20 mt-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            "inline-flex min-h-12 items-center gap-2 rounded-lg px-3.5 text-base sm:min-h-11 sm:text-sm",
            onDark
              ? open || selected
                ? "bg-white/20 text-white"
                : "bg-white/10 text-white/80 hover:text-white"
              : cn(
                  "bg-raised shadow-border",
                  open || selected ? "text-fg" : "text-muted hover:text-fg",
                ),
          )}
        >
          {selected ? (
            <>
              <Flag name={selected} />
              <span>{displayCountry(selected, locale)}</span>
            </>
          ) : (
            <>
              <Globe2 className="size-4 opacity-70" aria-hidden />
              <span>{t("home.chooseCountry")}</span>
            </>
          )}
          <ChevronDown
            className={cn("size-4 opacity-50 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
        {allowClear && selected ? (
          <button
            type="button"
            onClick={() => pick(null)}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2.5 text-sm text-muted hover:text-fg"
          >
            <X className="size-3.5" aria-hidden />
            {t("home.all")}
          </button>
        ) : null}
      </div>
      {open ? (
        <div
          role="listbox"
          className="absolute z-[300] mt-2 w-[min(100%,22rem)] rounded-xl bg-surface p-3 text-fg shadow-border ring-1 ring-border"
        >
          {searchField}
          {allowClear ? (
          <button
            type="button"
            onClick={() => pick(null)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-md px-3 text-sm",
              value === null ? "bg-accent text-accent-fg" : "text-muted hover:bg-raised hover:text-fg",
            )}
          >
            {t("home.all")}
          </button>
          ) : null}
          <div className="mt-3 max-h-72 space-y-3 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-1 text-sm text-muted">{t("home.noCountryMatch")}</p>
            ) : (
              <>
                {filtered.filter(isUsa).map((name) => {
                  const slug = countrySlug(name);
                  const on = value === slug;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => pick(slug)}
                      aria-pressed={on}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-xs",
                        on ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
                      )}
                    >
                      <Flag name={name} />
                      <span>{displayCountry(name, locale)}</span>
                    </button>
                  );
                })}
                {filteredGroups.map((group) => (
              <div key={group.id}>
                <p className="px-1 text-xs tracking-[0.14em] text-muted uppercase">
                  {t(`home.region.${group.id}`)}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {group.countries.map((name) => {
                    const slug = countrySlug(name);
                    const on = value === slug;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => pick(slug)}
                        aria-pressed={on}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-xs",
                          on ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
                        )}
                      >
                        <Flag name={name} />
                        <span>{displayCountry(name, locale)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
                ))}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
