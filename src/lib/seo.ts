const SITE = "Gypsy Jazz Hub";
export const CANONICAL_HOST = "https://www.gypsyjazzhub.com";
const OG_IMAGE = `${CANONICAL_HOST}/og.jpg`;

export function pageHead(input: {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
}) {
  const title = input.title === SITE ? SITE : `${input.title} | ${SITE}`;
  const description = input.description.replace(/\s+/g, " ").trim().slice(0, 160);
  const path = !input.path || input.path === "/" ? "/" : input.path;
  const url = `${CANONICAL_HOST}${path === "/" ? "/" : path}`;
  return {
    meta: [
      { title },
      { name: "description" as const, content: description },
      { name: "robots" as const, content: input.noindex ? "noindex, nofollow" : "index, follow" },
      { property: "og:type" as const, content: "website" },
      { property: "og:site_name" as const, content: SITE },
      { property: "og:url" as const, content: url },
      { property: "og:title" as const, content: title },
      { property: "og:description" as const, content: description },
      { property: "og:image" as const, content: OG_IMAGE },
      { property: "og:image:width" as const, content: "1200" },
      { property: "og:image:height" as const, content: "630" },
      { name: "twitter:card" as const, content: "summary_large_image" },
      { name: "twitter:title" as const, content: title },
      { name: "twitter:description" as const, content: description },
      { name: "twitter:image" as const, content: OG_IMAGE },
    ],
    links: [{ rel: "canonical" as const, href: url }],
  };
}

export const SEO = {
  home: {
    title: SITE,
    description:
      "Gypsy jazz jam sessions, musicians, concerts and festivals worldwide. Jazz Manouche events on an interactive globe — from Paris to Moscow.",
    path: "/",
  },
  jams: {
    title: "Gypsy jazz jam sessions",
    description:
      "Find gypsy jazz jam sessions by country — weekly open jams, hours, venues and maps. Jazz Manouche sessions from Europe to the Americas and Asia.",
    path: "/jams",
  },
  concerts: {
    title: "Gypsy jazz concerts & events",
    description:
      "Upcoming gypsy jazz concerts and events worldwide. Dates, venues, tickets and festival nights — Jazz Manouche on one calendar.",
    path: "/concerts",
  },
  festivals: {
    title: "Gypsy jazz festivals",
    description:
      "Gypsy jazz festivals around the world — Festival Django Reinhardt, DjangoFest, Samois and local Jazz Manouche gatherings.",
    path: "/festivals",
  },
  musicians: {
    title: "Gypsy jazz musicians",
    description:
      "Gypsy jazz musicians by country — guitar, violin, bass, clarinet and voice. Open a player for bio, concerts and jam connections.",
    path: "/musicians",
  },
  legends: {
    title: "Famous gypsy jazz players",
    description:
      "Django Reinhardt, Stéphane Grappelli and the living circuit — gypsy jazz musicians and legends with bios, clips and dates.",
    path: "/legends",
  },
  learn: {
    title: "Learn gypsy jazz",
    description:
      "Learn gypsy jazz by instrument — camps, workshops, private teachers, charts and practice apps. La pompe, violin, bass and more.",
    path: "/learn",
  },
  teachers: {
    title: "Gypsy jazz teachers",
    description:
      "Private gypsy jazz teachers by country and instrument — guitar, violin, double bass, accordion and voice. Contact, websites and YouTube.",
    path: "/learn/teachers",
  },
  news: {
    title: "Gypsy jazz news",
    description:
      "Gypsy jazz news: tours, jam sessions, festivals and album releases from the worldwide Jazz Manouche community.",
    path: "/news",
  },
  join: {
    title: "Join the hub",
    description:
      "Join Gypsy Jazz Hub free. Make a musician page, post a jam session or concert, and help the Jazz Manouche circuit stay alive.",
    path: "/join",
  },
  board: {
    title: "Community board",
    description:
      "The gypsy jazz community board — looking for a player, charts, venue tips. Post after you join the hub.",
    path: "/board",
  },
  history: {
    title: "History of Gypsy Jazz and the Sinti",
    description:
      "Gypsy jazz grew out of a much older tradition carried by the Sinti across Europe — from northwestern India to Django, and a living family music today.",
    path: "/history",
  },
  archive: {
    title: "Archive — families and orchestras by country",
    description:
      "The country archive: older gypsy orchestras, Sinti and Roma family houses, past chairs. Pick a country. Logged-in members can suggest a name for the owner desk.",
    path: "/archive",
  },
  venues: {
    title: "Gypsy jazz venues",
    description:
      "Rooms that host gypsy jazz — clubs, cafés and festival stages by country. A list for musicians looking for a concert or a jam.",
    path: "/venues",
  },
  groups: {
    title: "Gypsy jazz groups",
    description:
      "Gypsy jazz groups and Hot Club bands by country — members, concerts and the Jazz Manouche circuit.",
    path: "/groups",
  },
  luthiers: {
    title: "Gypsy jazz luthiers",
    description:
      "Luthiers of Selmer-style gypsy jazz guitars, double basses and violins — workshops listed by country.",
    path: "/luthiers",
  },
  bassLuthiers: {
    title: "Double bass luthiers",
    description:
      "Double bass luthiers and workshops for gypsy jazz — makers, restorers and jazz setup specialists, listed by country.",
    path: "/luthiers/bass",
  },
  violinLuthiers: {
    title: "Violin luthiers",
    description:
      "Violin makers and workshops for gypsy jazz players — instruments, repairs and setup, listed by country.",
    path: "/luthiers/violin",
  },
  shops: {
    title: "Gypsy jazz guitar shops",
    description:
      "Shops that stock Selmer-Maccaferri style gypsy jazz guitars — TFOA, Django Guitars, Galerie Casanova and more, listed by country.",
    path: "/shops",
  },
  instrumentsLuthiers: {
    title: "Luthiers & shops by country",
    description:
      "Gypsy jazz guitar shops, violin luthiers and double bass workshops listed for every country on the hub.",
    path: "/instruments/luthiers",
  },
  instruments: {
    title: "Gypsy jazz instruments",
    description:
      "Guitars, violins, double bass and the other chairs of gypsy jazz — shops and luthiers by country.",
    path: "/instruments",
  },
  instrumentsGuitars: {
    title: "Gypsy jazz guitars",
    description:
      "Selmer-Maccaferri style gypsy jazz guitars — luthiers and shops that stock them, listed by country.",
    path: "/instruments/guitars",
  },
  instrumentsViolins: {
    title: "Gypsy jazz violins & violas",
    description:
      "Violin and viola makers and workshops for gypsy jazz players — instruments, repairs and setup, listed by country.",
    path: "/instruments/violins",
  },
  instrumentsOther: {
    title: "Other gypsy jazz instruments",
    description:
      "Violin, clarinet, saxophone, accordion, mandolin, piano, harmonica and voice — Learn pages for every chair, plus violin luthiers by country.",
    path: "/instruments/other",
  },
  instrumentsBass: {
    title: "Gypsy jazz double bass",
    description:
      "Double bass luthiers and workshops for gypsy jazz — makers, restorers and jazz setup, listed by country.",
    path: "/instruments/double-bass",
  },
  youtube: {
    title: "Gypsy jazz on YouTube",
    description:
      "Gypsy jazz concerts and jam sessions on YouTube — clips from the worldwide Jazz Manouche circuit.",
    path: "/youtube",
  },
};
