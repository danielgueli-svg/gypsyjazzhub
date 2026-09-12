import { createFileRoute, Link } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { Button } from "@/components/ui/button";
import { FESTIVALS, type Festival } from "@/lib/festivals";
import { localizeFestival } from "@/lib/festival-copy";
import { CountryLabel } from "@/components/country-label";
import { displayCountry, preferCountryNames } from "@/lib/geo";
import { listHubFestivals } from "@/lib/hub-api";
import { formatConcertWhen, formatLocalDate } from "@/lib/utils";
import { pageHead, SEO } from "@/lib/seo";
import { localeHomeCountry, useI18n } from "@/lib/i18n";
import { settle } from "@/lib/settle";

function nextShort(
  festival: { when: string; nextStartsAt: string; tba?: boolean },
  locale: string,
) {
  if (festival.tba) return festival.when;
  return formatLocalDate(festival.nextStartsAt, "EEE d MMM yyyy", locale);
}

function isUpcoming(festival: Festival) {
  if (festival.tba) return false;
  const date = new Date(festival.nextStartsAt);
  return !Number.isNaN(date.getTime()) && date.getTime() >= Date.now();
}

const FEATURED_SLUG = "festival-django-reinhardt";

export const Route = createFileRoute("/festivals/")({
  head: () => pageHead(SEO.festivals),
  loader: async () => {
    const extra = await settle("hub-festivals", [], () => listHubFestivals());
    const known = new Set(FESTIVALS.map((festival) => festival.slug));
    return { extra: extra.filter((festival) => !known.has(festival.slug)) };
  },
  component: FestivalsPage,
});

function FestivalsPage() {
  const { extra } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const home = localeHomeCountry(locale);
  const all = [...FESTIVALS, ...extra].map((festival) => localizeFestival(festival, locale));
  const featured = all.find((festival) => festival.slug === FEATURED_SLUG) ?? all[0];
  const rest = all.filter((festival) => festival.slug !== featured.slug);
  const upcoming = rest
    .filter(isUpcoming)
    .sort(
      (a, b) => new Date(a.nextStartsAt).getTime() - new Date(b.nextStartsAt).getTime(),
    )
    .slice(0, 5);
  const countries = preferCountryNames(
    [
      ...new Set(rest.map((festival) => festival.country)),
    ].sort((a, b) => displayCountry(a, locale).localeCompare(displayCountry(b, locale), locale, { sensitivity: "base" })),
    home,
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("festivals.featured")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
        {t("festivals.title")}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {t("festivals.lead")}
      </p>
      <p className="mt-4">
        <Link to="/youtube" className="font-display text-lg font-semibold hover:underline">
          {t("festivals.youtube")}
        </Link>
        <span className="mx-1.5 text-faint">·</span>
        <span className="text-sm text-muted">
          {t("festivals.youtubeLead")}
        </span>
      </p>

      {featured ? (
        <section className="mt-10 rounded-2xl bg-surface p-6 shadow-border sm:p-8">
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
            {t("festivals.featured")} · <CountryLabel name="France" />
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {featured.name}
          </h2>
          <p className="mt-2 text-muted">
            Fontainebleau, <CountryLabel name="France" /> · {featured.when}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {featured.bio}
          </p>
          <p className="mt-4 text-xs text-faint">
            {t("festivals.next")} · {featured.tba ? featured.when : formatConcertWhen(featured.nextStartsAt, locale)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/festivals/$slug" params={{ slug: featured.slug }}>
                {t("festivals.open")}
              </Link>
            </Button>
            {featured.site ? (
              <Button asChild variant="outline">
                <a href={featured.site} target="_blank" rel="noreferrer">
                  {t("festivals.site")}
                </a>
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}

      {upcoming.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{t("festivals.upcoming")}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {t("festivals.upcomingLead")}
          </p>
          <ol className="mt-5 divide-y divide-border rounded-2xl bg-surface shadow-border">
            {upcoming.map((festival, index) => (
              <li key={festival.slug}>
                <Link
                  to="/festivals/$slug"
                  params={{ slug: festival.slug }}
                  className="flex items-baseline gap-3 px-4 py-3 hover:bg-raised sm:gap-4 sm:px-5"
                >
                  <span className="w-6 shrink-0 font-display text-lg text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display text-lg font-semibold leading-tight">
                      {festival.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {nextShort(festival, locale)}
                      <span className="mx-1.5 text-faint">·</span>
                      {festival.city}
                      <span className="mx-1.5 text-faint">·</span>
                      <CountryLabel name={festival.country} className="inline-flex" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">{t("festivals.world")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {t("festivals.worldLead")}
        </p>
        <div className="mt-8 space-y-12">
          {countries.map((country) => (
            <section key={country}>
              <h3 className="font-display text-2xl font-semibold">
                <CountryLabel name={country} />
              </h3>
              <ul className="mt-3 columns-1 gap-x-10 sm:columns-2">
                {rest
                  .filter((festival) => festival.country === country)
                  .map((festival) => (
                    <li key={festival.slug} className="break-inside-avoid py-1">
                      <Link
                        to="/festivals/$slug"
                        params={{ slug: festival.slug }}
                        className="hover:underline"
                      >
                        <span className="font-display text-lg font-semibold">
                          {festival.name}
                        </span>
                        <span className="mx-1.5 text-faint">·</span>
                        <span className="text-sm text-muted">{festival.city}</span>
                        <span className="mx-1.5 text-faint">·</span>
                        <span className="text-sm text-muted">{nextShort(festival, locale)}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <Contribute heading="Add a festival" />
    </main>
  );
}
