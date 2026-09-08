import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AgendaCalendar } from "@/components/agenda-calendar";
import { EventFilters } from "@/components/event-filters";
import { Button } from "@/components/ui/button";
import { listConcerts } from "@/lib/api";
import {
  concertToAgenda,
  filterAgenda,
  jamToAgenda,
  uniqueCities,
  uniqueCountries,
} from "@/lib/agenda";
import { listHubJams } from "@/lib/hub-api";
import { upcomingJams } from "@/lib/jams";
import { cn } from "@/lib/utils";

type Search = {
  country?: string;
  city?: string;
  weekday?: string;
  type?: string;
  view?: "calendar" | "list";
};

export const Route = createFileRoute("/agenda")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    country: typeof search.country === "string" ? search.country : undefined,
    city: typeof search.city === "string" ? search.city : undefined,
    weekday: typeof search.weekday === "string" ? search.weekday : undefined,
    type: typeof search.type === "string" ? search.type : undefined,
    view: search.view === "list" ? "list" : "calendar",
  }),
  loader: async () => {
    const [concerts, extraJams] = await Promise.all([
      listConcerts({ data: { filter: "upcoming" } }),
      listHubJams(),
    ]);
    const jams = [...upcomingJams(), ...extraJams].filter(
      (jam, i, all) => all.findIndex((row) => row.slug === jam.slug) === i,
    );
    return { concerts, jams };
  },
  component: AgendaPage,
});

function AgendaPage() {
  const { concerts, jams } = Route.useLoaderData();
  const search = Route.useSearch();
  const router = useRouter();
  const [view, setView] = useState<"calendar" | "list">(search.view ?? "calendar");

  const all = useMemo(() => {
    const concertItems = concerts
      .filter((c) => !c.isHistoric)
      .map(concertToAgenda);
    const jamItems = jams.map(jamToAgenda);
    return [...concertItems, ...jamItems].sort((a, b) => a.when.localeCompare(b.when));
  }, [concerts, jams]);

  const shown = filterAgenda(all, {
    country: search.country,
    city: search.city,
    weekday: search.weekday,
    type: search.type,
  });

  function go(next: Search) {
    void router.navigate({
      to: "/agenda",
      search: {
        country: next.country || undefined,
        city: next.city || undefined,
        weekday: next.weekday || undefined,
        type: next.type || undefined,
        view,
      },
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Live music</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Calendar</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Jams and concerts on one month. Filter a country or a city, then tap a
        night. Signed-in members can add a date — it goes on the calendar.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className={cn(
            "h-11 rounded-md px-4 text-sm",
            view === "calendar" ? "bg-accent text-accent-fg" : "bg-raised text-muted",
          )}
          onClick={() => setView("calendar")}
        >
          Calendar
        </button>
        <button
          type="button"
          className={cn(
            "h-11 rounded-md px-4 text-sm",
            view === "list" ? "bg-accent text-accent-fg" : "bg-raised text-muted",
          )}
          onClick={() => setView("list")}
        >
          List
        </button>
        <Button asChild variant="outline">
          <Link to="/add">Add a date</Link>
        </Button>
      </div>
      <EventFilters
        countries={uniqueCountries(all)}
        cities={uniqueCities(all)}
        country={search.country}
        city={search.city}
        weekday={search.weekday}
        type={search.type}
        showType
        onCountry={(country) => go({ ...search, country })}
        onCity={(city) => go({ ...search, city })}
        onWeekday={(weekday) => go({ ...search, weekday })}
        onType={(type) => go({ ...search, type })}
      />
      <div className="mt-8">
        {view === "calendar" ? (
          <AgendaCalendar items={shown} />
        ) : shown.length === 0 ? (
          <p className="text-sm text-muted">Nothing matches those filters yet.</p>
        ) : (
          <ul className="space-y-2">
            {shown.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="block rounded-xl bg-surface px-4 py-3 hover:bg-raised">
                  <p className="font-display text-lg font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {item.when.slice(0, 10)} · {item.kind} · {item.city}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
