import { createFileRoute } from "@tanstack/react-router";
import { HubSearch } from "@/components/hub-search";
import { KIND_LABEL, searchCatalog } from "@/lib/catalog-search";
import { useI18n } from "@/lib/i18n";

type Search = { q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const { t } = useI18n();
  const hits = searchCatalog(q);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("nav.search")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("search.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("search.lead")}</p>
      <div className="mt-6 max-w-xl">
        <HubSearch />
      </div>

      {q.trim().length >= 2 ? (
        <p className="mt-8 text-sm text-muted">
          {hits.length} {t("search.results")} “{q.trim()}”
        </p>
      ) : (
        <p className="mt-8 text-sm text-muted">{t("search.hint")}</p>
      )}

      <ul className="mt-4 divide-y divide-border rounded-2xl bg-surface shadow-border">
        {hits.map((hit) => (
          <li key={`${hit.kind}-${hit.href}-${hit.name}`}>
            <a
              href={hit.href}
              className="flex flex-col gap-0.5 px-4 py-3 hover:bg-raised sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span>
                <span className="font-display text-lg font-semibold">{hit.name}</span>
                {hit.blurb ? (
                  <span className="mt-0.5 block text-sm text-muted">{hit.blurb}</span>
                ) : null}
              </span>
              <span className="shrink-0 text-[11px] tracking-[0.16em] text-faint uppercase">
                {KIND_LABEL[hit.kind]}
                {hit.country ? ` · ${hit.country}` : ""}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
