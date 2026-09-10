import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flag } from "@/components/flag";
import { LineageLinks } from "@/components/lineage-links";
import { listLegends } from "@/lib/api";
import { archiveEmptyCountries, archiveIndex } from "@/lib/archive";
import { COUNTRY_OPTIONS, countriesFromText, countrySlug, displayCountry, isPastLegend } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/archive/")({
  head: () => pageHead(SEO.archive),
  loader: async () => {
    const legends = await listLegends();
    const extra = new Map<string, number>();
    for (const legend of legends) {
      if (!isPastLegend(legend.years)) continue;
      for (const country of countriesFromText(legend.origin)) {
        extra.set(country, (extra.get(country) ?? 0) + 1);
      }
    }
    return { pastByCountry: Object.fromEntries(extra) };
  },
  component: ArchiveIndexPage,
});

function ArchiveIndexPage() {
  const { t, locale } = useI18n();
  const { pastByCountry } = Route.useLoaderData() as { pastByCountry: Record<string, number> };
  const seed = archiveIndex();
  const filledSlugs = new Set(seed.map((row) => row.country));
  const filled = [
    ...seed.map((row) => ({
      ...row,
      past: pastByCountry[row.country] ?? 0,
    })),
    ...Object.entries(pastByCountry)
      .filter(([country]) => !filledSlugs.has(country) && (COUNTRY_OPTIONS as readonly string[]).includes(country))
      .map(([country, past]) => ({
        country,
        slug: countrySlug(country),
        families: 0,
        orchestras: 0,
        past,
      })),
  ].sort((a, b) => a.country.localeCompare(b.country));
  const rest = archiveEmptyCountries().filter((row) => !pastByCountry[row.country]);
  const [open, setOpen] = useState(false);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("archive.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("archive.title")}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{t("archive.lead")}</p>
      <div className="mt-6">
        <LineageLinks current="/archive" />
      </div>
      <p className="mt-3 text-sm">
        <Link to="/history" className="text-muted hover:text-fg">
          {t("archive.backHistory")}
        </Link>
        {" · "}
        <a href="https://www.romanimusic.com" className="text-muted hover:text-fg">
          {t("nav.romaniMusic")}
        </a>
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">{t("archive.pick")}</h2>
        <ul className="mt-4 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
          {filled.map((row) => (
            <li key={row.slug} className="break-inside-avoid py-1.5">
              <Link
                to="/archive/$slug"
                params={{ slug: row.slug }}
                className="inline-flex items-center gap-2 font-display text-xl font-semibold hover:underline"
              >
                <Flag name={row.country} className="h-4 w-6" />
                {displayCountry(row.country, locale)}
              </Link>
              <span className="text-sm text-muted">
                {" "}
                · {row.families + row.orchestras + ("past" in row ? row.past : 0)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {rest.length > 0 ? (
        <section className="mt-12">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="text-sm font-medium text-accent hover:underline"
          >
            {open ? t("archive.hideEmpty") : t("archive.showEmpty")} ({rest.length})
          </button>
          {open ? (
            <ul className="mt-4 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
              {rest.map((row) => (
                <li key={row.slug} className="break-inside-avoid py-1">
                  <Link
                    to="/archive/$slug"
                    params={{ slug: row.slug }}
                    className="text-sm text-muted hover:text-fg hover:underline"
                  >
                    {displayCountry(row.country, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
