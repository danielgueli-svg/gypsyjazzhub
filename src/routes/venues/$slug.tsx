import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ConcertRow } from "@/components/concert-row";
import { HubChat } from "@/components/hub-chat";
import { JamLine } from "@/components/jam-line";
import { Portrait } from "@/components/portrait";
import { ShareBox } from "@/components/share-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { listConcerts } from "@/lib/api";
import { CountryLabel } from "@/components/country-label";
import { countrySlug } from "@/lib/geo";
import { getHubVenue, listHubChat, listHubJams, type HubChatMessage } from "@/lib/hub-api";
import { getVenue, venueScene, type Venue } from "@/lib/venues";
import { overlayJamList, catalogJams } from "@/lib/jams";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

const FESTIVAL_DISCOGS =
  "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-";

export const Route = createFileRoute("/venues/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "stichting-alhambra") {
      throw redirect({ to: "/stichting-alhambra" });
    }
    if (params.slug === "gradina-alhambra") {
      throw redirect({ to: "/gradina-alhambra" });
    }
  },
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData?.venue.name ?? "Venue",
      description: loaderData?.venue.bio ?? "",
      path: loaderData ? `/venues/${loaderData.venue.slug}` : "/venues",
    }),
  loader: async ({ params }) => {
    const venue = getVenue(params.slug) ?? (await getHubVenue({ data: params.slug }));
    if (!venue) throw notFound();
    const closed = venue.slug === "le-quecumbar";
    const [concerts, chat, extraJams] = await Promise.all([
      listConcerts({ data: { filter: "upcoming" } }),
      listHubChat({ data: { kind: "venue", slug: venue.slug } }),
      listHubJams(),
    ]);
    const here = closed
      ? []
      : concerts.filter(
          (concert) =>
            !concert.isHistoric &&
            (concert.venue.toLowerCase().includes(venue.name.toLowerCase().slice(0, 12)) ||
              concert.city.trim().toLowerCase() === venue.city.trim().toLowerCase()),
        );
    const city = venue.city.trim().toLowerCase();
    const cityJams =
      !closed && city
        ? overlayJamList(catalogJams(), extraJams)
            .filter((jam) => jam.city.trim().toLowerCase() === city)
            .slice(0, 8)
        : [];
    return { venue, here, chat, cityJams };
  },
  component: VenuePage,
});

function VenuePage() {
  const { venue, here, chat, cityJams } = Route.useLoaderData();
  const { t } = useI18n();

  if (venue.slug === "le-quecumbar") {
    return <QuecumbarArchive venue={venue} chat={chat} />;
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Venue</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{venue.name}</h1>
      <p className="mt-3 text-muted">
        {venue.city} ·{" "}
        <Link
          to="/world/$slug"
          params={{ slug: countrySlug(venue.country) }}
          className="hover:text-fg"
        >
          <CountryLabel name={venue.country} />
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>{venue.kind}</Badge>
      </div>

      <div className="mt-6">
        <ShareBox
          compact
          url={`/venues/${venue.slug}`}
          title="Share this venue"
          text={`${venue.name}\n${venue.city} · ${venue.country}\n${venue.bio}`}
        />
      </div>

      <article className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">About</h2>
        <p>{venue.bio}</p>
        {venueScene(venue) !== "gypsy" ? (
          <p className="rounded-2xl bg-surface p-5 text-fg shadow-border">
            This house already books jazz. It is a potential room for a Gypsy Jazz jam
            or concert — write as a group or as an artist, then put the date on this hub
            so the scene can find it.
          </p>
        ) : null}
      </article>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">Who books gypsy jazz</h2>
        {venue.booker || venue.contact ? (
          <div className="mt-4 rounded-2xl bg-surface p-5 shadow-border">
            {venue.booker ? (
              <p className="font-display text-xl font-semibold">{venue.booker}</p>
            ) : (
              <p className="text-sm text-muted">Booker name not on file yet.</p>
            )}
            {venue.contact ? (
              <p className="mt-2">
                <a
                  href={venue.contact}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline"
                >
                  {venue.contact.replace(/^mailto:/, "")}
                </a>
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            No booker on file yet. Sign in and add who to write to for a gypsy
            jazz night here.
          </p>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        {venue.site ? (
          <Button asChild>
            <a href={venue.site} target="_blank" rel="noreferrer">
              Official site
            </a>
          </Button>
        ) : null}
        {venue.contact ? (
          <Button asChild variant="outline">
            <a href={venue.contact} target="_blank" rel="noreferrer">
              Bookers / contact
            </a>
          </Button>
        ) : null}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{t("home.upcoming")}</h2>
        {here.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("home.noConcerts")}</p>
        ) : (
          <div className="mt-5 space-y-3">
            {here.map((concert) => (
              <ConcertRow key={concert.id} concert={concert} />
            ))}
          </div>
        )}
      </section>

      {cityJams.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Jams in {venue.city}</h2>
          <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
            {cityJams.map((jam) => (
              <JamLine key={jam.slug} jam={jam} />
            ))}
          </ul>
        </section>
      ) : null}

      <HubChat kind="venue" slug={venue.slug} initial={chat} />
    </main>
  );
}

const QUECUMBAR_RECORDS = [
  {
    year: 2006,
    title: "Biel Ballester Trio — Gypsy Jazz Live In London",
    href: "https://www.discogs.com/release/11970235-Biel-Ballester-Trio-Gypsy-Jazz-Live-In-London",
  },
  {
    year: 2007,
    title: "Le QuecumBar Allstars featuring Lollo Meier",
    href: "https://www.discogs.com/release/1028631-Le-QuecumBar-Allstars-Featuring-Lollo-Meier-Le-QuecumBar-Allstars",
  },
  {
    year: 2007,
    title: "The Ritary Gaguenetti Quartet — Live In London",
    href: "https://www.discogs.com/release/11969920-The-Ritary-Gaguenetti-Quartet-Le-QuecumBar-Live-in-London",
  },
  {
    year: 2008,
    title: "The Gary Potter Quartet — Live In London",
    href: "https://www.discogs.com/release/11969919-The-Gary-Potter-Quartet-Le-QuecumBar-Live-In-London-",
  },
  {
    year: 2008,
    title: "Stars of Gypsy Swing",
    href: "https://www.discogs.com/release/11970278-Various-Stars-Of-Gypsy-Swing",
  },
  {
    year: 2009,
    title: "The Aurore Quartet — Live in London",
    href: "https://www.discogs.com/release/11970276-The-Aurore-Quartet-Le-QuecumBar-Live-in-London-",
  },
  {
    year: 2009,
    title: "Patrick Saussois, Daniel John Martin — Live in London",
    href: "https://www.discogs.com/release/11969904-Patrick-Saussois-Daniel-John-Martin-Le-QuecumBar-Live-in-London",
  },
  {
    year: 2010,
    title: "Le QuecumBar International Gypsy Swing Guitar Festival — 3×CD, LEQ0108",
    href: FESTIVAL_DISCOGS,
  },
  {
    year: 2014,
    title: "The Gypsy Dynamite — Live In London",
    href: "https://www.discogs.com/release/11970735-The-Gypsy-Dynamite-Le-QuecumBar-Live-In-London",
  },
  {
    year: 2017,
    title: "The Three Gypsy Patrons — Live in London",
    href: "https://www.discogs.com/release/11970277-Various-Le-QuecumBar-Live-in-London-The-Three-Gypsy-Patrons",
  },
];

const FESTIVAL_PLAYERS: { slug: string; name: string; kind: "musician" | "group" }[] = [
  { slug: "sylvia-rushbrooke", name: "Sylvia Rushbrooke", kind: "musician" },
  { slug: "stochelo-rosenberg", name: "Stochelo Rosenberg", kind: "musician" },
  { slug: "lollo-meier", name: "Lollo Meier", kind: "musician" },
  { slug: "kussi-weiss", name: "Kussi Weiss", kind: "musician" },
  { slug: "tcha-limberger", name: "Tcha Limberger", kind: "musician" },
  { slug: "biel-ballester", name: "Biel Ballester", kind: "musician" },
  { slug: "paulus-schafer", name: "Paulus Schäfer", kind: "musician" },
  { slug: "ritary-gaguenetti", name: "Ritary Gaguenetti", kind: "musician" },
  { slug: "sebastien-giniaux", name: "Sébastien Giniaux", kind: "musician" },
  { slug: "ducato-piotrowski", name: "Ducato Piotrowski", kind: "musician" },
  { slug: "wattie-rosenberg", name: "Wattie Rosenberg", kind: "musician" },
  { slug: "sani-van-mullem", name: "Sani van Mullem", kind: "musician" },
  { slug: "feigeli-prisor", name: "Feigeli Prisor", kind: "musician" },
  { slug: "hugo-richter", name: "Hugo Richter", kind: "musician" },
  { slug: "andy-crowdy", name: "Andy Crowdy", kind: "musician" },
  { slug: "andy-aitchison", name: "Andy Aitchison", kind: "musician" },
  { slug: "pete-kubryk-townsend", name: "Pete Kubryk-Townsend", kind: "musician" },
  { slug: "noah-schafer", name: "Noah Schäfer", kind: "musician" },
  { slug: "fleur-de-paris", name: "Fleur de Paris", kind: "group" },
];

function QuecumbarArchive({
  venue,
  chat,
}: {
  venue: Venue;
  chat: HubChatMessage[];
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Closed venue</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{venue.name}</h1>
      <p className="mt-3 text-muted">
        Battersea, London · February 2003 – April 2022
      </p>
      <p className="mt-1 text-sm text-faint">
        42–44 Battersea High Street, SW11 3HX ·{" "}
        <Link
          to="/world/$slug"
          params={{ slug: countrySlug(venue.country) }}
          className="hover:text-fg"
        >
          <CountryLabel name={venue.country} />
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge className="bg-[#2a1c10] text-[#efe3b6]">Closed</Badge>
        <Badge>Gypsy swing brasserie</Badge>
        <Badge>Le Q Records</Badge>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Portrait
          src="/venues/le-quecumbar.jpg"
          alt="Le QuecumBar, Battersea High Street, December 2008"
          credit="Ewan Munro, 18 Dec 2008 · CC BY-SA 2.0"
          creditHref="https://commons.wikimedia.org/wiki/File:Le_QuecumBar,_Battersea,_SW11_(4868666773).jpg"
          className="w-full rounded-2xl object-cover shadow-border"
        />
        <Portrait
          src="/venues/le-quecumbar-van.jpg"
          alt="Le QuecumBar & Brasserie van, Battersea, May 2006"
          credit="wetwebwork, 21 May 2006 · CC BY-SA 2.0"
          creditHref="https://commons.wikimedia.org/wiki/File:Le_QuecumBar_&_Brasserie_Van.jpg"
          className="w-full rounded-2xl object-cover shadow-border"
        />
      </div>

      <article className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">Closed now</h2>
        <p>
          Le QuecumBar is no longer a room you can walk into. From February 2003
          until April 2022,{" "}
          <Link
            to="/musicians/$slug"
            params={{ slug: "sylvia-rushbrooke" }}
            className="text-fg hover:underline"
          >
            Sylvia Rushbrooke
          </Link>{" "}
          kept a gypsy-swing brasserie at 42–44 Battersea High Street — Django’s
          music, food and wine in a small Battersea house, not a West End hall.
          Discogs lists her as owner of the room.
        </p>
        <p>
          The doors were forced shut on 6 April 2022. The Jazz Mann published her
          statement on 27 April 2022: during lockdown a new landlord doubled the
          rent and would not renew the lease. The house site still stands as an
          archive, headed closed after 19 years.
        </p>
      </article>

      <article className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">The legacy is the tape</h2>
        <p>
          What remains is the music recorded in the room. QuecumBar Ltd traded as
          Le Q Records. The house site puts it plainly: the legacy of Le QuecumBar
          is the music left on that label.
        </p>
        <p>
          The document of the place is the 3×CD from January 2010:{" "}
          <a
            href={FESTIVAL_DISCOGS}
            target="_blank"
            rel="noreferrer"
            className="text-fg hover:underline"
          >
            Le QuecumBar International Gypsy Swing Guitar Festival
          </a>{" "}
          (Le Q Records LEQ0108). Django Reinhardt’s 100th birthday week, 17–25
          January. Nine days, sold out. The house site records 36 gypsy and
          non-gypsy musicians from five countries. Sylvia opens the set, speaks
          on Django’s birthday night, and closes the last night. Stochelo
          Rosenberg, Lollo Meier, Kussi Weiss, Tcha Limberger, Biel Ballester,
          Paulus Schäfer, Ritary Gaguenetti and the rest of that week are on the
          discs.
        </p>
        <p>
          The house film of the festival is still on the Le QuecumBar YouTube
          channel. The house site also notes a Biel Ballester live track from the
          room, “When I Was a Boy,” used in Woody Allen’s <em>Vicky Cristina Barcelona</em>.
        </p>
      </article>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">Festival film</h2>
        <p className="mt-3 text-sm text-muted">
          Official Le QuecumBar channel, December 2010 — Django’s 100th birthday
          week in Battersea, and a plug for the triple CD.
        </p>
        <div className="mt-5">
          <YouTubeEmbed
            url="https://www.youtube.com/watch?v=5OYY-GZVhqk"
            title="Django 100th Birthday Gypsy Swing Guitar Festival at Le QuecumBar"
          />
        </div>
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">Le Q Records from the room</h2>
        <p className="mt-3 text-sm text-muted">
          Live tapes Discogs lists from Le QuecumBar / Le Q Records. The 2010
          festival 3×CD is the one that holds the whole week.
        </p>
        <ul className="mt-5 space-y-3">
          {QUECUMBAR_RECORDS.map((row) => (
            <li key={row.href} className="border-b border-border py-3">
              <p className="font-display text-lg font-semibold leading-tight">{row.title}</p>
              <p className="mt-0.5 text-sm text-muted">{row.year}</p>
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-muted hover:text-fg"
              >
                Discogs
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">On the 2010 3×CD</h2>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
          {FESTIVAL_PLAYERS.map((player) =>
            player.kind === "group" ? (
              <Link
                key={player.slug}
                to="/groups/$slug"
                params={{ slug: player.slug }}
                className="hover:text-fg hover:underline"
              >
                {player.name}
              </Link>
            ) : (
              <Link
                key={player.slug}
                to="/musicians/$slug"
                params={{ slug: player.slug }}
                className="hover:text-fg hover:underline"
              >
                {player.name}
              </Link>
            ),
          )}
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <a href={FESTIVAL_DISCOGS} target="_blank" rel="noreferrer">
            Festival 3×CD — Discogs
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link to="/musicians/$slug" params={{ slug: "sylvia-rushbrooke" }}>
            Sylvia Rushbrooke
          </Link>
        </Button>
        <Button asChild variant="outline">
          <a href="https://www.quecumbar.co.uk/" target="_blank" rel="noreferrer">
            Archive site
          </a>
        </Button>
        <Button asChild variant="outline">
          <a
            href="https://www.thejazzmann.com/news/article/le-quecumbar-has-closed"
            target="_blank"
            rel="noreferrer"
          >
            Closing statement
          </a>
        </Button>
      </div>

      <div className="mt-8">
        <ShareBox
          compact
          url={`/venues/${venue.slug}`}
          title="Share this venue"
          text={`${venue.name} — closed. Battersea, February 2003–April 2022. Legacy: Le Q Records 3×CD, January 2010.`}
        />
      </div>

      <HubChat kind="venue" slug={venue.slug} initial={chat} />
    </main>
  );
}
