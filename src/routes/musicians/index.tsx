import { createFileRoute, Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JoinedMark } from "@/components/joined-mark";
import { MusicianCard } from "@/components/musician-card";
import { listLegends, listMusicians, type Legend } from "@/lib/api";
import {
  INSTRUMENT_FAMILIES,
  filterMusicians,
  musicianCities,
  musicianCountries,
  musiciansByCountry,
} from "@/lib/directory";
import { artistHref, basedInCountry, countrySlug, displayCountry } from "@/lib/geo";
import { CountryLabel } from "@/components/country-label";
import { listJoinedArtists } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";
import { settle } from "@/lib/settle";

const PAGE_SIZE = 10;

type Search = {
  q?: string;
  country?: string;
  instrument?: string;
  location?: string;
  style?: string;
};

export const Route = createFileRoute("/musicians/")({
  head: () => pageHead(SEO.musicians),
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
    country: typeof search.country === "string" ? search.country : undefined,
    instrument: typeof search.instrument === "string" ? search.instrument : undefined,
    location: typeof search.location === "string" ? search.location : undefined,
    style: typeof search.style === "string" ? search.style : undefined,
  }),
  loaderDeps: ({ search }) => ({
    q: search.q,
    country: search.country,
    instrument: search.instrument,
    location: search.location,
    style: search.style,
  }),
  loader: async ({ deps }) => {
    const [musicians, legends, joined] = await Promise.all([
      listMusicians({ data: { q: deps.q } }),
      listLegends(),
      settle("joined", [], () => listJoinedArtists()),
    ]);
    const filtered = filterMusicians(legends, deps);
    const filtering = Boolean(
      deps.q || deps.country || deps.instrument || deps.location || deps.style,
    );
    return {
      musicians,
      groups: musiciansByCountry(filtered),
      countries: musicianCountries(legends),
      cities: musicianCities(legends, deps.country),
      joined: new Set(joined.map((row) => row.slug)),
      total: filtered.length,
      filtering,
    };
  },
  component: MusiciansPage,
});

function MusiciansPage() {
  const { musicians, groups, countries, cities, joined, total, filtering } = Route.useLoaderData();
  const search = Route.useSearch();
  const router = useRouter();
  const { t } = useI18n();
  const [value, setValue] = useState(search.q ?? "");
  const [openCountries, setOpenCountries] = useState<Record<string, boolean>>({});

  function go(next: Search) {
    void router.navigate({
      to: "/musicians",
      search: {
        q: next.q || undefined,
        country: next.country || undefined,
        instrument: next.instrument || undefined,
        location: next.location || undefined,
        style: next.style || undefined,
      },
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("musicians.kicker")}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-6xl">
        {t("musicians.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {t("musicians.lead")}
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/add" search={{ kind: "artist" }}>
            Make or claim your page
          </Link>
        </Button>
      </div>

      <form
        className="mt-10 rounded-2xl bg-surface p-4 shadow-border sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          go({ ...search, q: value.trim() });
        }}
      >
        <label className="sr-only" htmlFor="musician-q">
          {t("musicians.search")}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-faint" />
            <Input
              id="musician-q"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("musicians.searchPh")}
              className="h-14 rounded-xl pl-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-8">
            {t("musicians.search")}
          </Button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label={t("musicians.country")}
            value={search.country ?? ""}
            onChange={(country) => go({ ...search, q: value.trim(), country, location: "" })}
            options={countries.map((row) => ({
              value: row.name,
              label: `${displayCountry(row.name)} (${row.count})`,
            }))}
            all={t("musicians.all")}
          />
          <FilterSelect
            label={t("musicians.instrument")}
            value={search.instrument ?? ""}
            onChange={(instrument) => go({ ...search, q: value.trim(), instrument })}
            options={INSTRUMENT_FAMILIES.map((name) => ({ value: name, label: name }))}
            all={t("musicians.all")}
          />
          <FilterSelect
            label={t("musicians.location")}
            value={search.location ?? ""}
            onChange={(location) => go({ ...search, q: value.trim(), location })}
            options={cities.map((name) => ({ value: name, label: name }))}
            all={t("musicians.all")}
          />
          <FilterSelect
            label={t("musicians.style")}
            value={search.style ?? ""}
            onChange={(style) => go({ ...search, q: value.trim(), style })}
            options={[
              { value: "playing", label: t("musicians.playing") },
              { value: "legends", label: t("musicians.past") },
            ]}
            all={t("musicians.all")}
          />
        </div>
      </form>

      <p className="mt-8 text-sm text-muted">
        {total} {t("musicians.results")}
      </p>

      {musicians.length > 0 ? (
        <section className="mt-10">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
            {t("musicians.hubMembers")}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {musicians.map((musician) => (
              <MusicianCard
                key={musician.userId}
                person={{
                  slug: musician.slug,
                  name: musician.displayName,
                  href: `/musicians/${musician.slug}`,
                  instruments: musician.instruments,
                  place: basedInCountry(musician.country, musician.city),
                  bio: musician.bio,
                  joined: true,
                  youtubeUrl: musician.youtubeUrl,
                  instagramUrl: musician.instagramUrl,
                  websiteUrl: musician.websiteUrl,
                  spotifyUrl: musician.spotifyUrl,
                  photoUrl: musician.photoUrl,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {groups.length === 0 ? (
        <p className="mt-12 text-muted">{t("musicians.empty")}</p>
      ) : (
        <div className="mt-14 space-y-16">
          {groups.map((group) => {
            const open = Boolean(openCountries[group.country]);
            const playing = open ? group.playing : group.playing.slice(0, PAGE_SIZE);
            const past = open ? group.past : group.past.slice(0, PAGE_SIZE);
            return (
              <section key={group.country}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link
                    to="/world/$slug"
                    params={{ slug: countrySlug(group.country) }}
                    className="font-display text-2xl font-semibold hover:underline"
                  >
                    <CountryLabel name={group.country} />
                  </Link>
                  <span className="text-sm text-muted">
                    {t("musicians.indexed").replace("{n}", String(group.total))}
                  </span>
                </div>
                {playing.length > 0 ? (
                  <>
                    <h2 className="mt-5 text-[11px] tracking-[0.18em] text-faint uppercase">
                      {t("musicians.playing")}
                    </h2>
                    <ul className="mt-3 columns-1 gap-x-12 sm:columns-2">
                      {playing.map((artist) => (
                        <li key={artist.slug} className="break-inside-avoid py-1.5">
                          <ArtistLink artist={artist} joined={joined.has(artist.slug)} />
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {past.length > 0 ? (
                  <>
                    <h2 className="mt-8 text-[11px] tracking-[0.18em] text-faint uppercase">
                      {t("musicians.past")}
                    </h2>
                    <ul className="mt-3 columns-1 gap-x-12 sm:columns-2">
                      {past.map((artist) => (
                        <li key={artist.slug} className="break-inside-avoid py-1.5">
                          <ArtistLink artist={artist} joined={joined.has(artist.slug)} />
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {group.total > PAGE_SIZE ? (
                  <button
                    type="button"
                    className="mt-4 text-sm text-fg hover:underline"
                    onClick={() =>
                      setOpenCountries((prev) => ({
                        ...prev,
                        [group.country]: !open,
                      }))
                    }
                  >
                    {open
                      ? t("musicians.showLess")
                      : t("musicians.seeAll").replace("{n}", String(group.total))}
                  </button>
                ) : null}
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-16 text-sm text-muted">
        {t("musicians.groupsCta")}{" "}
        <Link to="/groups" className="text-fg hover:underline">
          {t("nav.groups")}
        </Link>
      </p>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  all,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  all: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.16em] text-faint uppercase">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-12 w-full rounded-xl bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_14%,transparent)] outline-none focus-visible:shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]"
      >
        <option value="">{all}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ArtistLink({ artist, joined }: { artist: Legend; joined?: boolean }) {
  const href = artistHref({
    slug: artist.slug,
    name: artist.name,
    kind: "legend",
    instruments: artist.instruments,
    place: artist.origin,
  });
  const className =
    "inline-flex items-baseline gap-1.5 font-display text-xl font-semibold hover:underline";
  const label = (
    <>
      {artist.name}
      {joined ? <JoinedMark /> : null}
    </>
  );
  if (href === "/django") {
    return (
      <Link to="/django" className={className}>
        {label}
      </Link>
    );
  }
  if (href === "/grappelli") {
    return (
      <Link to="/grappelli" className={className}>
        {label}
      </Link>
    );
  }
  return (
    <Link to="/musicians/$slug" params={{ slug: artist.slug }} className={className}>
      {label}
    </Link>
  );
}
