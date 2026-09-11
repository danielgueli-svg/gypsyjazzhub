import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ConcertRow } from "@/components/concert-row";
import { Button } from "@/components/ui/button";
import { JamLine } from "@/components/jam-line";
import { NewsBanner } from "@/components/news-story";
import { WorldGlobe } from "@/components/world-globe";
import { listConcerts, listLegends, listMusicians } from "@/lib/api";
import { upcomingCamps } from "@/lib/camps";
import { CountryClicker } from "@/components/country-clicker";
import { CountryLabel } from "@/components/country-label";
import { buildGlobeIndex, countrySlug, displayCountry, globeButtonNames, mixByCountry } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { listHubFestivals, listHubJams } from "@/lib/hub-api";
import { listHubCountries } from "@/lib/country-requests";
import { latestNews } from "@/lib/music";
import { catalogJams, isFrontJam, type Jam } from "@/lib/jams";
import { pageHead, SEO } from "@/lib/seo";
import { settle } from "@/lib/settle";

export const Route = createFileRoute("/")({
  head: () => pageHead(SEO.home),
  loader: async () => {
    const [concerts, legends, musicians, hubFestivals, hubJams, hubCountries] = await Promise.all([
      listConcerts({ data: { filter: "upcoming" } }),
      listLegends(),
      listMusicians({ data: {} }),
      settle("hub-festivals", [], () => listHubFestivals()),
      settle("hub-jams", [], () => listHubJams()),
      settle("hub-countries", [], () => listHubCountries()),
    ]);
    const upcoming = concerts.filter(
      (c) => !c.isHistoric && new Date(c.startsAt).getTime() >= Date.now(),
    );
    const globe = buildGlobeIndex(
      legends,
      musicians,
      upcoming,
      hubFestivals,
      hubJams,
      [],
      [],
      hubCountries.map((row) => row.name),
    );
    const globeCountries: Record<string, true> = {};
    for (const name of Object.keys(globe)) globeCountries[name] = true;
    return {
      concerts: upcoming.slice(0, 5),
      camps: upcomingCamps().slice(0, 5),
      jams: catalogJams().filter(isFrontJam),
      news: latestNews(20)
        .filter((item) => item.kind !== "album")
        .slice(0, 5),
      globeConcerts: upcoming,
      globeCountries,
      activeNames: globeButtonNames(globe),
    };
  },
  component: Home,
});

function Home() {
  const { camps, jams, news, globeConcerts, globeCountries, activeNames } =
    Route.useLoaderData();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [country, setCountry] = useState<string | null>(null);
  const [jamCountry, setJamCountry] = useState<string | null>(null);
  const jamCountries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const jam of jams) {
      const name = jam.country?.trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.keys()].sort((a, b) => displayCountry(a).localeCompare(displayCountry(b)));
  }, [jams]);
  const countryJams = useMemo(() => {
    if (jamCountry) {
      return jams.filter((jam) => countrySlug(jam.country) === jamCountry);
    }
    const mixed = mixByCountry(jams, (jam) => jam.country);
    const seen = new Set<string>();
    const one: Jam[] = [];
    for (const jam of mixed) {
      if (seen.has(jam.country)) continue;
      seen.add(jam.country);
      one.push(jam);
    }
    return one.sort((a, b) =>
      displayCountry(a.country, locale).localeCompare(displayCountry(b.country, locale), locale, {
        sensitivity: "base",
      }),
    );
  }, [jamCountry, jams, locale]);
  const shownJams = countryJams;
  const concertCountries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const concert of globeConcerts) {
      const name = concert.country?.trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.keys()].sort((a, b) => displayCountry(a).localeCompare(displayCountry(b)));
  }, [globeConcerts]);
  const countryConcerts = useMemo(() => {
    if (!country) return mixByCountry(globeConcerts, (concert) => concert.country);
    return globeConcerts.filter((concert) => countrySlug(concert.country) === country);
  }, [country, globeConcerts]);
  const shownConcerts = country ? countryConcerts : countryConcerts.slice(0, 5);
  const alphaCountries = useMemo(
    () =>
      [...activeNames].sort((a, b) =>
        displayCountry(a, locale).localeCompare(displayCountry(b, locale), locale, {
          sensitivity: "base",
        }),
      ),
    [activeNames, locale],
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-14">
      <section>
        <p className="text-[11px] tracking-[0.22em] text-faint uppercase">
          gypsyjazzhub.com
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h1 className="font-display text-5xl leading-[0.95] font-semibold tracking-tight sm:text-6xl">
              Gypsy Jazz
              <span className="italic"> Hub</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {t("home.intro")}
            </p>
            <p className="mt-3 text-lg leading-relaxed text-muted">
              {t("home.intro2")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="lg">
              <Link to="/learn">{t("home.learn")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/add" search={{ kind: "jam" }}>
                {t("home.organize")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/board">{t("nav.board")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="relative z-0 overflow-visible rounded-2xl bg-[#071018] p-3 ring-1 ring-white/15 sm:p-4">
          <WorldGlobe
            countries={globeCountries}
            selected={null}
            onSelect={(name) => {
              void navigate({
                to: "/world/$slug",
                params: { slug: countrySlug(name) },
              });
            }}
          />
          <div className="flex justify-center">
            <CountryClicker
              countries={alphaCountries}
              value={null}
              allowClear={false}
              layout="list"
              onDark
              className="mt-3 mb-0"
              onChange={(slug) => {
                if (!slug) return;
                void navigate({
                  to: "/world/$slug",
                  params: { slug },
                });
              }}
            />
          </div>
        </div>
      </section>

      <section className="mt-14 sm:mt-16">
        <SectionHeading
          kicker={t("nav.jams")}
          title={t("home.jams")}
          to="/jams"
          action={t("nav.jams")}
        />
        {jamCountries.length > 1 ? (
          <CountryClicker
            countries={jamCountries}
            value={jamCountry}
            onChange={setJamCountry}
          />
        ) : null}
        {shownJams.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("home.noJams")}</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-5">
            {shownJams.slice(0, 15).map((jam) => (
              <JamLine key={jam.slug} jam={jam} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14 sm:mt-16">
        <SectionHeading
          kicker={t("home.worldwide")}
          title={t("home.upcoming")}
          to="/concerts"
          action={t("nav.concerts")}
        />
        {concertCountries.length > 1 ? (
          <CountryClicker
            countries={concertCountries}
            value={country}
            onChange={setCountry}
          />
        ) : null}
        <div className="mt-4">
          <Button asChild size="lg" variant="outline">
            <Link to="/concerts" search={country ? { country } : {}}>
              {t("home.showAllConcerts").replace("{n}", String(countryConcerts.length))}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-4 space-y-1">
          {shownConcerts.length === 0 ? (
            <p className="text-sm text-muted">{t("home.noConcerts")}</p>
          ) : (
            shownConcerts.map((concert) => (
              <ConcertRow key={concert.id} concert={concert} compact />
            ))
          )}
        </div>
      </section>

      <section className="mt-14 sm:mt-16">
        <SectionHeading
          kicker={t("news.kicker")}
          title={t("news.title")}
          to="/news"
          action={t("nav.news")}
        />
        <ol className="mt-4 space-y-1">
          {news.map((item) => (
            <li key={item.slug}>
              <NewsBanner item={item} />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 sm:mt-16">
        <SectionHeading
          kicker={t("home.camps")}
          title={t("home.learn")}
          to="/learn"
          action={t("nav.learn")}
        />
        <div className="mt-4 space-y-1">
          {camps.map((camp) => (
            <Link
              key={camp.slug}
              to="/learn/$slug"
              params={{ slug: camp.slug }}
              className="grid grid-cols-[4.5rem_1fr] items-center gap-3 py-2 hover:underline"
            >
              <div className="text-center">
                <CountryLabel name={camp.country} short className="justify-center" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold leading-tight">
                  {camp.name}
                </h3>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {camp.city} · {camp.when}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-3 sm:mt-20 sm:grid-cols-3">
        {[
          {
            to: "/history" as const,
            kicker: t("home.lineage"),
            title: t("home.historyTitle"),
            body: t("home.historyBody"),
          },
          {
            to: "/django" as const,
            kicker: "1910–1953",
            title: "Django",
            body: t("home.djangoBody"),
          },
          {
            to: "/grappelli" as const,
            kicker: "1908–1997",
            title: "Grappelli",
            body: t("home.grappelliBody"),
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-2xl bg-surface p-6 shadow-border transition-colors duration-150 hover:bg-raised"
          >
            <p className="text-[11px] tracking-[0.18em] text-faint uppercase">{item.kicker}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </Link>
        ))}
      </section>

      <section className="mt-16 sm:mt-20">
        <aside className="rounded-2xl bg-accent px-5 py-5 text-accent-fg sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-7 sm:py-6">
          <div className="max-w-2xl">
            <p className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
              {t("home.banner")}
            </p>
            <p className="mt-2 text-sm leading-relaxed sm:text-base">
              {t("home.bannerLead")}
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
              <Link to="/add" search={{ kind: "jam" }} className="underline-offset-2 hover:underline">
                {t("home.bannerJam")}
              </Link>
              <Link to="/add" search={{ kind: "concert" }} className="underline-offset-2 hover:underline">
                {t("home.bannerConcert")}
              </Link>
              <Link to="/join" className="underline-offset-2 hover:underline">
                {t("home.bannerAsk")}
              </Link>
            </p>
          </div>
          <div className="mt-4 shrink-0 sm:mt-0">
            <Link
              to="/join"
              className="inline-flex h-12 items-center rounded-md bg-accent-fg px-5 text-sm font-medium text-accent hover:opacity-90"
            >
              {t("home.bannerJoin")}
            </Link>
          </div>
        </aside>
        <p className="mt-10 text-[11px] tracking-[0.18em] text-faint uppercase">{t("home.joinKicker")}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          {t("home.joinTitle")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {t("home.joinLead")}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: t("home.makePage"),
              body: t("home.makePageBody"),
            },
            {
              title: t("home.putConcert"),
              body: t("home.putConcertBody"),
            },
            {
              title: t("home.addFest"),
              body: t("home.addFestBody"),
            },
          ].map((item) => (
            <li key={item.title} className="rounded-2xl bg-surface p-5 shadow-border">
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              <div className="mt-4">
                <Button asChild size="sm">
                  <Link to="/join">{t("home.join")}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/join">{t("home.join")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  kicker,
  title,
  to,
  action,
}: {
  kicker: string;
  title: string;
  to?: "/concerts" | "/legends" | "/musicians" | "/learn" | "/news" | "/jams" | "/world";
  action?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-faint uppercase">{kicker}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          {to ? (
            <Link to={to} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
      </div>
      {to && action ? (
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
        >
          {action}
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
