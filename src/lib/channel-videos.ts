/** Videos from Daniel Gueli Gypsy Jazz Channel only. */
import { youtubeVideoId } from "@/lib/utils";

export const CHANNEL_URL = "https://www.youtube.com/@danielgueli";

export type ChannelPlace = "concert" | "samoreau";

export type ChannelLink = {
  name: string;
  href?: string;
};

export type ChannelVideo = {
  name: string;
  url: string;
  clip: string;
  place: ChannelPlace;
  featured?: boolean;
  hub?: ChannelLink;
  with?: ChannelLink[];
};

export function youtubeThumb(url: string) {
  const id = youtubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

function artist(slug: string) {
  return `/musicians/${slug}`;
}
function group(slug: string) {
  return `/groups/${slug}`;
}

export const CHANNEL_VIDEOS: ChannelVideo[] = [
  {
    name: "Joscho Stephan Trio",
    url: "https://www.youtube.com/watch?v=jBEDrUXCHxM",
    clip: "Full concert — BIMHUIS, Django Festival Amsterdam",
    place: "concert",
    featured: true,
    hub: { name: "Joscho Stephan", href: artist("joscho-stephan") },
  },
  {
    name: "Amati Schmitt All Stars",
    url: "https://www.youtube.com/watch?v=CW7_iD1OZdg",
    clip: "Full concert — Festival Django Reinhardt 2024",
    place: "concert",
    featured: true,
    hub: { name: "Amati Schmitt", href: artist("amati-schmitt") },
  },
  {
    name: "Mozes Rosenberg Trio",
    url: "https://www.youtube.com/watch?v=gAINpePyrjQ",
    clip: "Joseph Joseph — Real Teatro, Palermo",
    place: "concert",
    featured: true,
    hub: { name: "Mozes Rosenberg Trio", href: group("mozes-rosenberg-trio") },
    with: [{ name: "Mozes Rosenberg", href: artist("mozes-rosenberg") }],
  },
  {
    name: "Adrien Moignard Quartet",
    url: "https://www.youtube.com/watch?v=RglgAgwtmpA",
    clip: "Valse d'Augustine — Festival Django Reinhardt 2026",
    place: "concert",
    hub: { name: "Adrien Moignard Quartet", href: group("adrien-moignard-quartet") },
  },
  {
    name: "Amati Schmitt",
    url: "https://www.youtube.com/watch?v=KehhO7B6pq4",
    clip: "La Lumière de Dieu — Festival Django Reinhardt 2024",
    place: "concert",
    hub: { name: "Amati Schmitt", href: artist("amati-schmitt") },
  },
  {
    name: "Angelo Debarre Trio",
    url: "https://www.youtube.com/watch?v=22GpLHSLUs8",
    clip: "R-vingt-six — Django Festival Amsterdam, BIMHUIS",
    place: "concert",
    hub: { name: "Angelo Debarre", href: artist("angelo-debarre") },
  },
  {
    name: "Fanou Torracinta",
    url: "https://www.youtube.com/watch?v=nCgdH2pqUPw",
    clip: "How High the Moon — Gipsy Guitar From Corsica",
    place: "concert",
    hub: { name: "Fanou Torracinta", href: artist("fanou-torracinta") },
  },
  {
    name: "Fapy Lafertin",
    url: "https://www.youtube.com/watch?v=B1mXaGot_OY",
    clip: "Autumn Leaves — Bridge Guitar Festival",
    place: "concert",
    hub: { name: "Fapy Lafertin", href: artist("fapy-lafertin") },
    with: [{ name: "Paulus Schäfer", href: artist("paulus-schafer") }],
  },
  {
    name: "Gismo Graf Trio",
    url: "https://www.youtube.com/watch?v=B38HuEZseQA",
    clip: "Rotterburg, set 1",
    place: "concert",
    hub: { name: "Gismo Graf Trio", href: group("gismo-graf-trio") },
  },
  {
    name: "Gismo Graf & Tim Kliphuis",
    url: "https://www.youtube.com/watch?v=VP_PiQxI5xU",
    clip: "Exactly Like You — Oslo 2026",
    place: "concert",
    hub: { name: "Gismo Graf", href: artist("gismo-graf") },
    with: [
      { name: "Tim Kliphuis", href: artist("tim-kliphuis") },
      { name: "Brady Winterstein", href: artist("brady-winterstein") },
      { name: "Daniel Gueli", href: artist("daniel-gueli") },
    ],
  },
  {
    name: "Hono Winterstein",
    url: "https://www.youtube.com/watch?v=RdaIUw_S12o",
    clip: "Gypsy Guitar Weekend 2025",
    place: "concert",
    hub: { name: "Hono Winterstein", href: artist("hono-winterstein") },
  },
  {
    name: "Jimmy Rosenberg",
    url: "https://www.youtube.com/watch?v=QI74stbG5Rs",
    clip: "Back in Oslo 2024",
    place: "concert",
    hub: { name: "Jimmy Rosenberg", href: artist("jimmy-rosenberg") },
  },
  {
    name: "Justin Geisler ft. Hugo Guezbar",
    url: "https://www.youtube.com/watch?v=ZA1p0owcx_s",
    clip: "Embraceable You — Festival Django Reinhardt 2024",
    place: "concert",
    hub: { name: "Justin Geisler", href: artist("justin-geisler") },
    with: [{ name: "Hugo Guezbar", href: artist("hugo-guezbar") }],
  },
  {
    name: "Kussi Weiss Trio",
    url: "https://www.youtube.com/watch?v=FZbziPoF_bw",
    clip: "For my Mandy — Festival Django Reinhardt 2023",
    place: "concert",
    hub: { name: "Kussi Weiss Trio", href: group("kussi-weiss-trio") },
  },
  {
    name: "Marcia Bamberg Swing Quartet",
    url: "https://www.youtube.com/watch?v=pzVEwzl8tP4",
    clip: "Festival Django Reinhardt 2026",
    place: "concert",
    hub: { name: "Marcia Bamberg Swing Quartet", href: group("marcia-bamberg-swing-quartet") },
    with: [
      { name: "John Ligthart", href: artist("john-ligthart") },
      { name: "Ronald Weel", href: artist("ronald-weel") },
    ],
  },
  {
    name: "Maria Pascual & The Kind of Gypsies",
    url: "https://www.youtube.com/watch?v=WNLCk1PP51w",
    clip: "Tricotism — Festival Django Reinhardt 2024",
    place: "concert",
    with: [{ name: "Mathieu Chatelain" }],
  },
  {
    name: "Paulus Schäfer & Joost Zoeteman Quartet",
    url: "https://www.youtube.com/watch?v=sXSFkeYRfss",
    clip: "Tenderly",
    place: "concert",
    hub: { name: "Paulus Schäfer", href: artist("paulus-schafer") },
    with: [{ name: "Joost Zoeteman", href: artist("joost-zoeteman") }],
  },
  {
    name: "Stochelo Rosenberg",
    url: "https://www.youtube.com/watch?v=Ix0a_j593xI",
    clip: "For Sephora — with Mozes Rosenberg, Serbia",
    place: "concert",
    hub: { name: "Stochelo Rosenberg", href: artist("stochelo-rosenberg") },
    with: [{ name: "Mozes Rosenberg", href: artist("mozes-rosenberg") }],
  },
  {
    name: "Lajos Sárközy Jr",
    url: "https://www.youtube.com/watch?v=xtmWqQbZ6_c",
    clip: "With Stochelo & Mozes Rosenberg Trio",
    place: "concert",
    hub: { name: "Lajos Sárközy Jr", href: artist("lajos-sarkozy-jr") },
    with: [
      { name: "Stochelo Rosenberg", href: artist("stochelo-rosenberg") },
      { name: "Mozes Rosenberg", href: artist("mozes-rosenberg") },
    ],
  },
  {
    name: "Tcha Limberger",
    url: "https://www.youtube.com/watch?v=6uDBQpd8NCs",
    clip: "Paulus Schäfer invites Tcha Limberger",
    place: "concert",
    hub: { name: "Tcha Limberger", href: artist("tcha-limberger") },
  },
  {
    name: "Thomas Dutronc",
    url: "https://www.youtube.com/watch?v=0M_LHDo2uCw",
    clip: "With Stochelo Rosenberg & Rocky Gresset — Festival Django Reinhardt",
    place: "concert",
    with: [
      { name: "Stochelo Rosenberg", href: artist("stochelo-rosenberg") },
      { name: "Rocky Gresset", href: artist("rocky-gresset") },
    ],
  },
  {
    name: "Cyrille Aimée",
    url: "https://www.youtube.com/watch?v=_bdGTWYDh4g",
    clip: "Zwolle",
    place: "concert",
    hub: { name: "Cyrille Aimée", href: artist("cyrille-aimee") },
  },
  {
    name: "William Brunard Cello Project",
    url: "https://www.youtube.com/watch?v=cQ7yXml3gNw",
    clip: "Festival Django Reinhardt 2026",
    place: "concert",
    hub: { name: "William Brunard Cello Project", href: group("william-brunard-cello-project") },
  },
  {
    name: "Jam at Benji Winterstein",
    url: "https://www.youtube.com/watch?v=Mfnt6UQXeFc",
    clip: "Django's Tiger — Samoreau 2023",
    place: "samoreau",
    hub: { name: "Benji Winterstein", href: artist("benji-winterstein") },
  },
  {
    name: "Jam at Benji Winterstein",
    url: "https://www.youtube.com/watch?v=x_3RSQc8nr0",
    clip: "Samoreau 2024",
    place: "samoreau",
    hub: { name: "Benji Winterstein", href: artist("benji-winterstein") },
  },
  {
    name: "Jam at Marcia Bamberg",
    url: "https://www.youtube.com/watch?v=8prxu2UsgcE",
    clip: "Late night — Samoreau 2024",
    place: "samoreau",
    hub: { name: "Marcia Bamberg", href: artist("marcia-bamberg") },
  },
  {
    name: "Jam at Marcia Bamberg",
    url: "https://www.youtube.com/watch?v=WBdMCVFtTBg",
    clip: "Samoreau 2025",
    place: "samoreau",
    hub: { name: "Marcia Bamberg", href: artist("marcia-bamberg") },
    with: [
      { name: "Django Rosenberg", href: artist("django-rosenberg") },
      { name: "Gismo Graf", href: artist("gismo-graf") },
    ],
  },
  {
    name: "Jam at Marcia Bamberg",
    url: "https://www.youtube.com/watch?v=Lp_8r-tq2D8",
    clip: "Jam 5 — Samoreau 2026",
    place: "samoreau",
    hub: { name: "Marcia Bamberg", href: artist("marcia-bamberg") },
    with: [
      { name: "Wawau Adler", href: artist("wawau-adler") },
      { name: "Christiaan van Hemert", href: artist("christiaan-van-hemert") },
    ],
  },
  {
    name: "Jam at Mathieu Chatelain",
    url: "https://www.youtube.com/watch?v=WSsBYiLZicI",
    clip: "Samoreau 2024",
    place: "samoreau",
  },
];
