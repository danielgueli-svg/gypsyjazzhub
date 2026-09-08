import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConcertList } from "@/components/concert-row";
import { CountryLabel } from "@/components/country-label";
import { Flag } from "@/components/flag";
import { EventFilters } from "@/components/event-filters";
import { JamLine } from "@/components/jam-line";
import { HubChat } from "@/components/hub-chat";
import { CountryMakersPreview } from "@/components/country-makers-preview";
import { ListFold } from "@/components/list-fold";
import { SaveButton } from "@/components/save-button";
import { ShareBox } from "@/components/share-page";
import { Teachers } from "@/components/teachers";
import { CountryRequestForm } from "@/components/country-request";
import { FollowCountry } from "@/components/follow-country";
import { concertToAgenda, filterAgenda, jamToAgenda, uniqueCities } from "@/lib/agenda";
import {
  artistHref,
  displayCountry,
  sameCountry,
  type GlobeArtist,
  type GlobeCountry,
} from "@/lib/geo";
import type { HubChatMessage, HubTeacher } from "@/lib/hub-api";
import { splitLuthiers } from "@/lib/luthiers";
import { countryFeatured, COUNTRY_LAST_JAM, COUNTRY_NOTES } from "@/lib/country-copy";
import { familiesForCountry } from "@/lib/families";
import { isArchiveBand } from "@/lib/archive";
import { romaniMusicCountryUrl } from "@/lib/romani-music";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { hotClubsForCountry, type HotClub } from "@/lib/hot-clubs";
import { isThinGypsyScene, jamHours, jamPlace } from "@/lib/jams";
import { sortVenues, venueScene, type Venue } from "@/lib/venues";
import { useI18n } from "@/lib/i18n";

function shortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
}

function agendaText(countryName: string, country: GlobeCountry | null, pageUrl: string) {
  const lines = [`Gypsy Jazz Hub — ${countryName}`, ""];
  const jams = country?.jams ?? [];
  const concerts = country?.concerts ?? [];
  if (jams.length) {
    lines.push("Jams");
    for (const jam of jams.slice(0, 8)) {
      const when = jamHours(jam) || jam.when;
      const place = jamPlace(jam);
      lines.push(`• ${jam.name}${when ? ` — ${when}` : ""}${place ? `, ${place}` : ""}`);
    }
    lines.push("");
  }
  if (concerts.length) {
    lines.push("Concerts");
    for (const concert of concerts.slice(0, 8)) {
      const when = shortDate(concert.startsAt);
      const billed = concert.title || concert.artistName;
      const where = [concert.venue, concert.city].filter(Boolean).join(", ");
      lines.push(`• ${when ? `${when} — ` : ""}${billed}${where ? `, ${where}` : ""}`);
    }
    lines.push("");
  }
  if (!jams.length && !concerts.length) {
    lines.push("Open the country page for jams, concerts and festivals.");
    lines.push("");
  }
  lines.push(pageUrl);
  return lines.join("\n");
}

export function CountryView({
  country,
  selected,
  slug,
  chat,
  teachers,
}: {
  country: GlobeCountry | null;
  selected: string;
  slug: string;
  chat: HubChatMessage[];
  teachers: HubTeacher[];
}) {
  const atlasName = country?.name ?? selected;
  const allJams = (country?.jams ?? []).filter((jam) => sameCountry(jam.country, atlasName));
  const festivals = (country?.festivals ?? []).filter((item) => sameCountry(item.country, atlasName));
  const allConcerts = (country?.concerts ?? []).filter((item) => sameCountry(item.country, atlasName));
  const camps = (country?.camps ?? []).filter((item) => sameCountry(item.country, atlasName));
  const venues = sortVenues((country?.venues ?? []).filter((item) => sameCountry(item.country, atlasName)));
  const startJam = isThinGypsyScene(allJams, venues.length);
  const luthiers = (country?.luthiers ?? []).filter((item) => sameCountry(item.country, atlasName));
  const { guitar: guitarLuthiers, bass: bassLuthiers, violin: violinLuthiers } = splitLuthiers(luthiers);
  const shops = (country?.shops ?? []).filter((item) => sameCountry(item.country, atlasName));
  const artists = country?.artists ?? [];
  const hotClubs = hotClubsForCountry(atlasName);
  const { t, locale } = useI18n();
  const name = displayCountry(country?.name ?? selected, locale);
  const pageUrl = `https://www.gypsyjazzhub.com/world/${slug}`;
  const featured = countryFeatured(atlasName, locale);
  const archiveCounts = {
    families: familiesForCountry(atlasName).length,
    orchestras: (country?.bands ?? []).filter((band) => isArchiveBand(band)).length,
  };
  const livingBands = (country?.bands ?? []).filter((band) => !isArchiveBand(band));
  const [city, setCity] = useState("");
  const [weekday, setWeekday] = useState("");
  const cities = useMemo(() => uniqueCities([...allJams, ...allConcerts]), [allJams, allConcerts]);
  const jams = allJams.filter((jam) => filterAgenda([jamToAgenda(jam)], { city, weekday }).length > 0);
  const concerts = allConcerts.filter(
    (concert) => filterAgenda([concertToAgenda(concert)], { city, weekday }).length > 0,
  );

  return (
    <section>
      <Link to="/" className="text-sm text-muted hover:text-fg">
        {t("country.back")}
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">{t("country.label")}</p>
      <h1 className="mt-3 inline-flex items-center gap-3 font-display text-5xl font-semibold sm:text-6xl">
        <Flag name={country?.name ?? selected} className="h-8 w-11 sm:h-10 sm:w-14" />
        {name}
      </h1>
      {COUNTRY_NOTES[atlasName] ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{COUNTRY_NOTES[atlasName]}</p>
      ) : null}
      <p className="mt-3 text-sm text-muted">
        {jams.length} jam{jams.length === 1 ? "" : "s"}
        {" · "}
        {concerts.length} concert{concerts.length === 1 ? "" : "s"}
        {" · "}
        {festivals.length} festival{festivals.length === 1 ? "" : "s"}
        {" · "}
        {camps.length} camp{camps.length === 1 ? "" : "s"}
        {" · "}
        {venues.length} venue{venues.length === 1 ? "" : "s"}
        {" · "}
        {guitarLuthiers.length} luthier{guitarLuthiers.length === 1 ? "" : "s"}
        {" · "}
        {bassLuthiers.length} bass workshop{bassLuthiers.length === 1 ? "" : "s"}
        {" · "}
        {violinLuthiers.length} violin workshop{violinLuthiers.length === 1 ? "" : "s"}
        {" · "}
        {shops.length} shop{shops.length === 1 ? "" : "s"}
      </p>

      {!country ? (
        <div className="mt-8">
          <p className="max-w-2xl text-base leading-relaxed text-muted">{t("country.missing")}</p>
          <CountryRequestForm presetName={name} compact />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-start gap-3">
        <SaveButton kind="country" slug={slug} label="Save country" />
        <FollowCountry country={atlasName} />
        <ShareBox
          compact
          url={pageUrl}
          title={t("share.agenda")}
          text={agendaText(name, country, pageUrl)}
        />
      </div>

      <CountryJump
        items={[
          { id: "jams", label: t("nav.jams") },
          featured ? { id: "featured", label: featured.title } : null,
          { id: "concerts", label: t("nav.concerts") },
          { id: "archive", label: t("country.archive") },
          { id: "festivals", label: t("nav.festivals") },
          { id: "camps", label: t("nav.camps") },
          hotClubs.length ? { id: "hot-clubs", label: t("country.hotClub") } : null,
          (livingBands.length || (country?.bands ?? []).length) ? { id: "groups", label: t("nav.groups") } : null,
          { id: "venues", label: t("country.venues") },
          { id: "makers", label: t("country.makers") },
          { id: "teachers", label: t("country.teachers") },
          { id: "players", label: t("country.currently") },
          artists.some((artist) => artist.past) ? { id: "past", label: t("country.past") } : null,
          { id: "chat", label: "Chat" },
        ].filter((item): item is { id: string; label: string } => Boolean(item))}
      />

      {cities.length > 1 || allJams.length + allConcerts.length > 3 ? (
        <EventFilters
          countries={[atlasName]}
          cities={cities}
          city={city}
          weekday={weekday}
          hideCountry
          onCountry={() => undefined}
          onCity={setCity}
          onWeekday={setWeekday}
        />
      ) : null}

      <section id="jams" className="mt-12 scroll-mt-40">
        <h2 className="font-display text-3xl font-semibold">
          {t("country.jams")}
          {jams.length > 0 ? (
            <span className="ml-2 text-lg font-normal text-muted">({jams.length})</span>
          ) : null}
        </h2>
        {startJam && !COUNTRY_LAST_JAM[atlasName] ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t("country.startJamNoJams")}</p>
        ) : null}
        {jams.length === 0 ? (
          <>
            {startJam && !COUNTRY_LAST_JAM[atlasName] ? null : (
              <p className="mt-4 text-sm text-muted">{t("country.noJams")}</p>
            )}
            {COUNTRY_LAST_JAM[atlasName] ? (
              <p className="mt-2 max-w-2xl text-sm text-muted">{COUNTRY_LAST_JAM[atlasName]}</p>
            ) : null}
          </>
        ) : (
          <ListFold items={jams} limit={10}>
            {(rows) => (
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-5">
                {rows.map((jam) => (
                  <JamLine key={jam.slug} jam={jam} />
                ))}
              </ul>
            )}
          </ListFold>
        )}
      </section>

      {featured ? (
        <section id="featured" className="mt-12 scroll-mt-40">
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{featured.kicker}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">{featured.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{featured.body}</p>
          {featured.pageHref ? (
            <p className="mt-2">
              <a href={featured.pageHref} className="text-sm font-medium text-accent hover:underline">
                {featured.pageLabel ?? featured.title} →
              </a>
            </p>
          ) : featured.site ? (
            <p className="mt-2">
              <a
                href={featured.site}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-accent hover:underline"
              >
                {featured.siteLabel} →
              </a>
            </p>
          ) : null}
          {featured.youtubeUrl ? (
            <div className="mt-4 w-full max-w-[18rem] sm:max-w-[20rem]">
              <YouTubeEmbed url={featured.youtubeUrl} title={featured.videoTitle ?? featured.title} />
              {featured.videoTitle ? (
                <p className="mt-1.5 text-xs text-muted">{featured.videoTitle}</p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {startJam ? (
        <section id="venues" className="mt-12 scroll-mt-40">
          <h2 className="font-display text-3xl font-semibold">
            {t("country.venues")}
            {venues.length > 10 ? (
              <span className="ml-2 text-lg font-normal text-muted">({venues.length})</span>
            ) : null}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{t("country.startJamVenuesLead")}</p>
          <VenueLines venues={venues} empty={t("country.noVenues")} booksJazz={t("country.venue.booksJazz")} />
        </section>
      ) : null}

      <ConcertList
        id="concerts"
        title={t("country.concerts")}
        concerts={concerts}
        empty={t("country.noConcerts")}
        initial={5}
      />

      <section id="archive" className="mt-12 scroll-mt-40">
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("nav.archive")}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">{t("country.archive")}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {t("country.archiveLead").replace("{country}", name)}
          </p>
          {archiveCounts.families + archiveCounts.orchestras > 0 ? (
            <p className="mt-2 text-sm text-muted">
              {archiveCounts.families} {t("archive.families").toLowerCase()}
              {" · "}
              {archiveCounts.orchestras} {t("archive.orchestras").toLowerCase()}
            </p>
          ) : null}
          <p className="mt-3">
            <Link
              to="/archive/$slug"
              params={{ slug }}
              className="text-sm font-medium text-accent hover:underline"
            >
              {t("country.archiveOpen")} →
            </Link>
          </p>
          <p className="mt-2">
            <a
              href={romaniMusicCountryUrl(slug)}
              className="text-sm text-muted hover:text-fg hover:underline"
              rel="noreferrer"
            >
              {t("archive.romaniOpen")} →
            </a>
          </p>
        </div>
      </section>

      <div className="mt-10">
        <ShareBox
          url={pageUrl}
          title={t("share.agenda")}
          lead={t("share.agendaLead")}
          text={agendaText(name, country, pageUrl)}
        />
      </div>

      <section id="festivals" className="mt-12 scroll-mt-40">
        <h2 className="font-display text-3xl font-semibold">{t("country.festivals")}</h2>
        {festivals.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("country.noFestivals")}</p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {festivals.map((festival) => (
              <Link
                key={festival.slug}
                to="/festivals/$slug"
                params={{ slug: festival.slug }}
                className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
              >
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                  {festival.when}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
                  {festival.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{festival.city}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="camps" className="mt-12 scroll-mt-40">
        <h2 className="font-display text-3xl font-semibold">{t("country.camps")}</h2>
        {camps.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("country.noCamps")}</p>
        ) : (
          <ListFold items={camps} limit={5}>
            {(shownCamps) => (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {shownCamps.map((camp) => (
              <Link
                key={camp.slug}
                to="/learn/$slug"
                params={{ slug: camp.slug }}
                className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
              >
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                  <CountryLabel name={camp.country} short /> · {camp.when}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
                  {camp.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{camp.city}</p>
              </Link>
            ))}
          </div>
            )}
          </ListFold>
        )}
      </section>

      {hotClubs.length > 0 ? <HotClubBlock clubs={hotClubs} /> : null}

      {livingBands.length > 0 ? (
        <section id="groups" className="mt-12 scroll-mt-40">
          <h2 className="font-display text-3xl font-semibold">
            {t("nav.groups")}
            <span className="ml-2 text-lg font-normal text-muted">({livingBands.length})</span>
          </h2>
          <GroupFold bands={livingBands} />
          {archiveCounts.orchestras > 0 ? (
            <p className="mt-3 text-sm text-muted">
              {t("country.archiveGroups")}{" "}
              <Link to="/archive/$slug" params={{ slug }} className="font-medium text-accent hover:underline">
                {t("country.archiveOpen")}
              </Link>
            </p>
          ) : null}
        </section>
      ) : archiveCounts.orchestras > 0 ? (
        <section id="groups" className="mt-12 scroll-mt-40">
          <h2 className="font-display text-3xl font-semibold">{t("nav.groups")}</h2>
          <p className="mt-3 text-sm text-muted">
            {t("country.archiveGroups")}{" "}
            <Link to="/archive/$slug" params={{ slug }} className="font-medium text-accent hover:underline">
              {t("country.archiveOpen")}
            </Link>
          </p>
        </section>
      ) : null}

      {startJam ? null : (
      <section id="venues" className="mt-12 scroll-mt-40">
        <h2 className="font-display text-3xl font-semibold">
          {t("country.venues")}
          {venues.length > 10 ? (
            <span className="ml-2 text-lg font-normal text-muted">({venues.length})</span>
          ) : null}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{t("country.venuesLead")}</p>
        <VenueLines venues={venues} empty={t("country.noVenues")} booksJazz={t("country.venue.booksJazz")} />
      </section>
      )}

      <CountryMakersPreview
        guitar={guitarLuthiers}
        violin={violinLuthiers}
        bass={bassLuthiers}
        shops={shops}
        countryName={name}
        countrySlug={slug}
      />

      <Teachers teachers={teachers} countrySlug={slug} countryName={name} />

      <section id="players" className="mt-12 scroll-mt-40">
        <h2 className="font-display text-3xl font-semibold">{t("country.currently")}</h2>
        <PlayerFold artists={artists.filter((artist) => !artist.past)} empty={t("country.noPlayers")} />
      </section>

      {artists.some((artist) => artist.past) ? (
        <section id="past" className="mt-12 scroll-mt-40">
          <h2 className="font-display text-3xl font-semibold">{t("country.past")}</h2>
          <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
            {artists
              .filter((artist) => artist.past)
              .map((artist: GlobeArtist) => (
                <li key={artist.slug} className="break-inside-avoid py-1.5">
                  <a href={artistHref(artist)} className="font-display text-xl font-semibold hover:underline">
                    {artist.name}
                  </a>
                  {artist.instruments ? (
                    <span className="text-sm text-muted"> · {artist.instruments}</span>
                  ) : null}
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <HubChat kind="country" slug={slug} initial={chat} />
    </section>
  );
}

function CountryJump({ items }: { items: { id: string; label: string }[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={root} className="relative mt-6">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-raised px-3.5 text-sm shadow-border hover:bg-surface"
      >
        {t("country.jump")}
        <ChevronDown className={`size-4 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute z-30 mt-2 w-[min(100%,20rem)] rounded-xl bg-surface p-2 shadow-border">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm hover:bg-raised"
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PlayerFold({ artists, empty }: { artists: GlobeArtist[]; empty: string }) {
  const [open, setOpen] = useState(false);
  const shown = open ? artists : artists.slice(0, 5);
  const hidden = Math.max(0, artists.length - 5);

  if (artists.length === 0) {
    return <p className="mt-4 text-sm text-muted">{empty}</p>;
  }

  return (
    <>
      <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
        {shown.map((artist) => (
          <li key={artist.slug} className="break-inside-avoid py-1.5">
            <a href={artistHref(artist)} className="font-display text-xl font-semibold hover:underline">
              {artist.name}
            </a>
            {artist.instruments ? (
              <span className="text-sm text-muted"> · {artist.instruments}</span>
            ) : null}
          </li>
        ))}
      </ul>
      {hidden > 0 ? (
        <FoldMore hidden={hidden} open={open} onToggle={() => setOpen((value) => !value)} />
      ) : null}
    </>
  );
}

function FoldMore({ hidden, open, onToggle }: { hidden: number; open: boolean; onToggle: () => void }) {
  const { t } = useI18n();
  if (hidden <= 0) return null;
  return (
    <button type="button" onClick={onToggle} className="mt-3 text-sm text-muted hover:text-fg">
      {open ? t("country.showLess") : `${t("country.seeMore")} (${hidden})`}
    </button>
  );
}

function GroupFold({ bands }: { bands: { slug: string; name: string; origin?: string }[] }) {
  const [open, setOpen] = useState(false);
  const shown = open ? bands : bands.slice(0, 10);
  const hidden = Math.max(0, bands.length - 10);
  return (
    <>
      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-5">
        {shown.map((band) => (
          <li key={band.slug} className="min-w-0 py-1">
            <Link
              to="/groups/$slug"
              params={{ slug: band.slug }}
              className="font-display text-xl font-semibold hover:underline"
            >
              {band.name}
            </Link>
          </li>
        ))}
      </ul>
      <FoldMore hidden={hidden} open={open} onToggle={() => setOpen((value) => !value)} />
    </>
  );
}

function VenueLines({
  venues,
  empty,
  booksJazz,
}: {
  venues: Venue[];
  empty: string;
  booksJazz: string;
}) {
  const [open, setOpen] = useState(false);
  if (venues.length === 0) {
    return <p className="mt-4 text-sm text-muted">{empty}</p>;
  }
  const shown = open ? venues : venues.slice(0, 10);
  const hidden = Math.max(0, venues.length - 10);
  return (
    <>
      <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
        {shown.map((venue) => (
          <li key={venue.slug} className="break-inside-avoid py-1.5">
            <Link
              to="/venues/$slug"
              params={{ slug: venue.slug }}
              className="font-display text-xl font-semibold hover:underline"
            >
              {venue.name}
            </Link>
            <span className="text-sm text-muted"> · {venue.city}</span>
            {venueScene(venue) !== "gypsy" ? (
              <span className="text-sm text-faint"> · {booksJazz}</span>
            ) : null}
          </li>
        ))}
      </ul>
      <FoldMore hidden={hidden} open={open} onToggle={() => setOpen((value) => !value)} />
    </>
  );
}

function HotClubBlock({ clubs }: { clubs: HotClub[] }) {
  const { t } = useI18n();
  const featured = clubs.filter((club) => club.featured);
  const rest = clubs.filter((club) => !club.featured);
  return (
    <section id="hot-clubs" className="mt-10 scroll-mt-40">
      {featured.map((club) => (
        <a
          key={club.slug}
          href={club.site || undefined}
          target={club.site ? "_blank" : undefined}
          rel={club.site ? "noreferrer" : undefined}
          className="block overflow-hidden rounded-2xl bg-gradient-to-br from-[#3d2314] via-[#6a3d22] to-[#1a120e] p-6 shadow-border sm:p-8"
        >
          <p className="text-[11px] tracking-[0.28em] text-[#e6c15a] uppercase">{t("country.hotClub")}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[#fff1b0] sm:text-4xl">{club.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#f3e6cf]">{club.bio}</p>
          {club.site ? (
            <p className="mt-4 text-sm font-medium text-[#e6c15a]">{club.site.replace(/^https?:\/\//, "")} →</p>
          ) : null}
        </a>
      ))}
      {rest.length > 0 ? (
        <div className={featured.length ? "mt-8" : ""}>
          <h2 className="font-display text-3xl font-semibold">{t("country.hotClubs")}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{t("country.hotClubsLead")}</p>
          <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
            {rest.map((club) => (
              <li key={club.slug} className="break-inside-avoid py-1.5">
                {club.site ? (
                  <a
                    href={club.site}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display text-xl font-semibold hover:underline"
                  >
                    {club.name}
                  </a>
                ) : (
                  <span className="font-display text-xl font-semibold">{club.name}</span>
                )}
                <span className="text-sm text-muted">
                  {" "}
                  · {club.city} · {club.kind}
                </span>
                <p className="mt-0.5 max-w-xl text-sm text-muted">{club.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
