import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ConcertRow } from "@/components/concert-row";
import { EventFilters } from "@/components/event-filters";
import { ShareBox } from "@/components/share-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountryLabel } from "@/components/country-label";
import { listConcerts } from "@/lib/api";
import { countrySlug, displayCountry, preferCountryNames, sameCountry } from "@/lib/geo";
import { monthKey, monthOptions, uniqueCities, weekdayName } from "@/lib/agenda";
import { FESTIVALS, type Festival } from "@/lib/festivals";
import { whenLabel } from "@/lib/festival-copy";
import { listHubFestivals, listHubJams } from "@/lib/hub-api";
import { jamsByCountry, type Jam } from "@/lib/jams";
import { localeHomeCountry, useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";
import { cn, concertAgendaText, formatConcertDay, formatConcertYear } from "@/lib/utils";
import { settle } from "@/lib/settle";

type Filter = "upcoming" | "historic" | "all";
type EventKind = "concert" | "festival" | "jam";
type Search = {
  q?: string;
  filter?: Filter;
  country?: string;
  city?: string;
  weekday?: string;
  month?: string;
  type?: EventKind;
};

type Night = {
  kind: EventKind;
  id: string;
  title: string;
  city: string;
  country: string;
  venue: string;
  startsAt: string;
  slug?: string;
  concert?: Awaited<ReturnType<typeof listConcerts>>[number];
};

function hay(night: Night) {
  return `${night.title} ${night.city} ${night.country} ${night.venue}`.toLowerCase();
}

export const Route = createFileRoute("/concerts/")({
  head: () => pageHead(SEO.concerts),
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
    filter:
      search.filter === "historic" || search.filter === "all" || search.filter === "upcoming"
        ? search.filter
        : undefined,
    country: typeof search.country === "string" && search.country ? search.country : undefined,
    city: typeof search.city === "string" && search.city ? search.city : undefined,
    weekday: typeof search.weekday === "string" && search.weekday ? search.weekday : undefined,
    month: typeof search.month === "string" && search.month ? search.month : undefined,
    type:
      search.type === "festival" || search.type === "jam" || search.type === "concert"
        ? search.type
        : undefined,
  }),
  loaderDeps: ({ search }) => ({
    q: search.q,
    filter: search.filter ?? "upcoming",
    country: search.country,
    city: search.city,
    weekday: search.weekday,
    month: search.month,
    type: search.type ?? "concert",
  }),
  loader: async ({ deps }) => {
    const kind = deps.type;
    const [catalog, extraFestivals, extraJams] = await Promise.all([
      listConcerts({ data: { filter: "all" } }),
      settle("hub-festivals", [], () => listHubFestivals()),
      settle("hub-jams", [], () => listHubJams()),
    ]);
    const now = Date.now();
    const q = deps.q?.trim().toLowerCase() ?? "";
    const timed = catalog.filter((concert) => {
      const t = new Date(concert.startsAt).getTime();
      if (deps.filter === "upcoming") {
        if (concert.isHistoric || t < now) return false;
      } else if (deps.filter === "historic") {
        if (!(concert.isHistoric || t < now)) return false;
      }
      if (!q) return true;
      const hay = `${concert.title} ${concert.artistName} ${concert.city} ${concert.country} ${concert.venue}`.toLowerCase();
      return hay.includes(q);
    });
    const festivals = [...FESTIVALS, ...extraFestivals].filter(
      (row, index, all) => all.findIndex((item) => item.slug === row.slug) === index,
    );
    const jams = jamsByCountry(extraJams).flatMap((group) => group.jams);

    let nights: Night[] = [];
    if (kind === "festival") {
      nights = festivals
        .filter((festival) => {
          if (deps.filter === "upcoming") {
            return !festival.tba && new Date(festival.nextStartsAt).getTime() >= now;
          }
          if (deps.filter === "historic") {
            return !festival.tba && new Date(festival.nextStartsAt).getTime() < now;
          }
          return true;
        })
        .map((festival) => festivalNight(festival));
    } else if (kind === "jam") {
      nights = jams.map((jam) => jamNight(jam));
    } else {
      nights = timed.map((concert) => concertNight(concert));
    }

    if (deps.q?.trim() && kind !== "concert") {
      const needle = deps.q.trim().toLowerCase();
      nights = nights.filter((night) => hay(night).includes(needle));
    }

    const counts = new Map<string, number>();
    for (const night of nights) {
      const name = night.country?.trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    const countries = [...counts.keys()].sort((a, b) =>
      displayCountry(a).localeCompare(displayCountry(b)),
    );

    let shown = deps.country
      ? nights.filter((night) => countrySlug(night.country) === deps.country)
      : nights;
    if (deps.city) {
      shown = shown.filter((night) => night.city.trim().toLowerCase() === deps.city!.trim().toLowerCase());
    }
    if (deps.weekday) {
      shown = shown.filter((night) => weekdayName(night.startsAt) === deps.weekday);
    }
    if (deps.month) {
      shown = shown.filter((night) => monthKey(night.startsAt) === deps.month);
    }
    shown = shown.sort((a, b) => a.startsAt.localeCompare(b.startsAt));

    return {
      nights: shown,
      countries,
      cities: uniqueCities(nights),
      months: monthOptions(nights.map((night) => night.startsAt)),
      counts: Object.fromEntries(counts),
      filter: deps.filter,
      type: kind,
    };
  },
  component: ConcertsPage,
});

function concertNight(concert: Awaited<ReturnType<typeof listConcerts>>[number]): Night {
  return {
    kind: "concert",
    id: concert.id,
    title: concert.title || concert.artistName,
    city: concert.city,
    country: concert.country,
    venue: concert.venue,
    startsAt: concert.startsAt,
    concert,
  };
}

function festivalNight(festival: Festival): Night {
  return {
    kind: "festival",
    id: `festival-${festival.slug}`,
    title: festival.name,
    city: festival.city,
    country: festival.country,
    venue: festival.when,
    startsAt: festival.nextStartsAt,
    slug: festival.slug,
  };
}

function jamNight(jam: Jam): Night {
  return {
    kind: "jam",
    id: `jam-${jam.slug}`,
    title: jam.name,
    city: jam.city,
    country: jam.country,
    venue: jam.venue,
    startsAt: jam.nextStartsAt,
    slug: jam.slug,
  };
}

function ConcertsPage() {
  const { nights, countries, cities, months, filter, type } = Route.useLoaderData();
  const search = Route.useSearch();
  const router = useRouter();
  const [value, setValue] = useState(search.q ?? "");
  const { t, locale } = useI18n();
  const home = localeHomeCountry(locale);
  const countryOptions = preferCountryNames(countries, home);
  const listed = search.country
    ? nights
    : [...nights].sort((a, b) => {
        const aHit = sameCountry(a.country, home) ? 0 : 1;
        const bHit = sameCountry(b.country, home) ? 0 : 1;
        if (aHit !== bHit) return aHit - bHit;
        return a.startsAt.localeCompare(b.startsAt);
      });

  function go(next: {
    q?: string | null;
    filter?: Filter;
    country?: string | null;
    city?: string | null;
    weekday?: string | null;
    month?: string | null;
    type?: EventKind | null;
  }) {
    void router.navigate({
      to: "/concerts",
      search: {
        q: next.q === undefined ? search.q : next.q || undefined,
        filter: next.filter ?? search.filter ?? "upcoming",
        country: next.country === undefined ? search.country : next.country || undefined,
        city: next.city === undefined ? search.city : next.city || undefined,
        weekday: next.weekday === undefined ? search.weekday : next.weekday || undefined,
        month: next.month === undefined ? search.month : next.month || undefined,
        type: next.type === undefined ? search.type : next.type || undefined,
      },
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("concerts.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("concerts.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {t("concerts.lead")}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["upcoming", t("concerts.upcoming")],
            ["historic", t("concerts.archive")],
            ["all", t("concerts.all")],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => go({ filter: key })}
            className={cn(
              "h-11 rounded-md px-4 text-sm",
              filter === key ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex w-full gap-2 sm:max-w-md"
        onSubmit={(event) => {
          event.preventDefault();
          go({ q: value.trim() || undefined });
        }}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="City, player, venue…"
        />
        <Button type="submit" variant="outline">
          {t("concerts.search")}
        </Button>
      </form>

      <EventFilters
        countries={countryOptions}
        cities={cities}
        country={search.country}
        city={search.city}
        weekday={search.weekday}
        month={search.month}
        type={type}
        months={months}
        showType
        typeOptions={[
          { value: "concert", label: t("concerts.typeConcert") },
          { value: "festival", label: t("concerts.typeFestival") },
          { value: "jam", label: t("concerts.typeJam") },
        ]}
        onCountry={(country) => go({ country: country || null })}
        onCity={(city) => go({ city: city || null })}
        onWeekday={(weekday) => go({ weekday: weekday || null })}
        onMonth={(month) => go({ month: month || null })}
        onType={(next) => go({ type: (next as EventKind) || "concert" })}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-faint">
          {listed.length} {t("concerts.nights")}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/add" search={{ kind: "concert" }}>
            {t("concerts.post")}
          </Link>
        </Button>
      </div>

      {listed.length > 0 ? (
        <div className="mt-6 max-w-2xl">
          <ShareBox
            url="/concerts"
            title={t("share.dates")}
            lead={t("share.datesLead")}
            text={concertAgendaText(
              listed.map((night) => ({
                title: night.title,
                artistName: night.title,
                venue: night.venue,
                city: night.city,
                country: night.country,
                startsAt: night.startsAt,
              })),
              "Gypsy Jazz Hub — next dates",
            )}
          />
        </div>
      ) : null}

      {listed.length === 0 ? (
        <p className="mt-10 text-sm text-muted">{t("concerts.empty")}</p>
      ) : (
        <div className="mt-5 space-y-3">
          {listed.map((night) =>
            night.kind === "concert" && night.concert ? (
              <ConcertRow key={night.id} concert={night.concert} />
            ) : (
              <NightRow key={night.id} night={night} />
            ),
          )}
        </div>
      )}
    </main>
  );
}

function NightRow({ night }: { night: Night }) {
  const { locale } = useI18n();
  const when = night.kind === "festival" ? whenLabel(night.venue, locale) : night.venue;
  const bits = [night.city, when].filter(Boolean);
  const titleLink = "font-display text-lg font-semibold leading-tight hover:underline";
  const title =
    night.kind === "festival" && night.slug ? (
      <Link to="/festivals/$slug" params={{ slug: night.slug }} className={titleLink}>
        {night.title}
      </Link>
    ) : night.kind === "jam" && night.slug ? (
      <Link to="/jams/$slug" params={{ slug: night.slug }} className={titleLink}>
        {night.title}
      </Link>
    ) : (
      <p className="font-display text-lg font-semibold leading-tight">{night.title}</p>
    );

  return (
    <article className="grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-2xl bg-surface/85 p-4 shadow-border sm:grid-cols-[5.5rem_1fr] sm:p-5">
      <div className="text-center">
        <div className="font-display text-xl font-semibold leading-none">
          {formatConcertDay(night.startsAt, locale)}
        </div>
        <div className="mt-0.5 text-xs tracking-wide text-faint">
          {formatConcertYear(night.startsAt)}
        </div>
      </div>
      <div className="min-w-0">
        {title}
        {night.country || bits.length > 0 ? (
          <p className="mt-1 truncate text-sm text-muted">
            {night.country ? <CountryLabel name={night.country} className="inline-flex" /> : null}
            {night.country && bits.length > 0 ? " · " : null}
            {bits.join(" · ")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
