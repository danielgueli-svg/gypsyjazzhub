import type { Album, NewsItem } from "./music-core";
import { ALBUMS } from "./music-core";
import { NEWS } from "./music-news";

export function albumsForArtist(slug: string) {
  return ALBUMS.filter((album) => album.artists.includes(slug)).sort((a, b) => b.year - a.year);
}

export function latestAlbums(limit = 8) {
  return [...ALBUMS].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)).slice(0, limit);
}

const PINNED_NEWS = [
  "django-donegal-october-2026",
  "elias-prinz-autumn-2026",
  "django-in-london-2026",
  "angelo-debarre-ulule",
  "la-pompe-live-app",
  "moignard-miroirs-sunset",
  "midwest-django-fest-2026",
];

export function latestNews(limit = 6) {
  const bySlug = new Map(NEWS.map((item) => [item.slug, item]));
  const pinned = PINNED_NEWS.map((slug) => bySlug.get(slug)).filter(
    (item): item is NewsItem => Boolean(item),
  );
  const rest = NEWS.filter((item) => !PINNED_NEWS.includes(item.slug)).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return [...pinned, ...rest].slice(0, limit);
}

export function getNews(slug: string) {
  return NEWS.find((item) => item.slug === slug) ?? null;
}

export function newsExcerpt(text: string, max = 92) {
  const cut = text.indexOf(". ");
  const first = cut > 12 && cut < max + 20 ? text.slice(0, cut + 1) : text;
  if (first.length <= max) return first;
  return `${first.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export function getAlbum(slug: string) {
  return ALBUMS.find((album) => album.slug === slug) ?? null;
}

export function albumQuery(album: Album) {
  return `${album.billed} ${album.title}`;
}

const ALBUM_COVERS = new Set([
  "olli-soikkeli-comeback",
  "dario-napoli-sicilian-blood",
  "joscho-stephan-playlist",
  "joscho-stephan-highwire",
  "stochelo-django-celebration-01",
  "stochelo-gypsy-today",
  "bireli-elegant-people",
  "fanou-gipsy-guitar-vol-2",
  "fanou-gipsy-guitar-vol-1",
  "joscho-stephan-four-of-a-kind",
  "bireli-plays-loulou-gaste",
  "veres-lajos-gipsy-souvenirs",
]);

const ARTIST_PHOTOS = new Set([
  "alexander-sobocinski",
  "andreas-oberg",
  "angelo-debarre",
  "anton-goudsmit",
  "bastien-brison",
  "bireli-lagrene",
  "christiaan-van-hemert",
  "christine-tassan",
  "cyrille-aimee",
  "daniel-gueli",
  "dario-napoli",
  "denis-chang",
  "django-reinhardt",
  "fapy-lafertin",
  "finn-hauge",
  "florin-niculescu",
  "george-washingmachine",
  "giani-lincan",
  "gildas-le-pape",
  "gismo-graf",
  "gonzalo-bergara",
  "gustav-lundgren",
  "harri-stojka",
  "ian-date",
  "jan-akkerman",
  "jason-anick",
  "jasper-somsen",
  "jimmy-rosenberg",
  "john-etheridge",
  "jon-larsen",
  "joscho-stephan",
  "julien-labro",
  "marcia-bamberg",
  "marion-lenfant-preus",
  "marius-preda",
  "martin-taylor",
  "mathias-levy",
  "mozes-rosenberg",
  "nigel-date",
  "nuno-marinho",
  "olli-soikkeli",
  "paul-mehling",
  "paulus-schafer",
  "peter-beets",
  "rein-mercha",
  "remi-harris",
  "richard-manetti",
  "robin-nolan",
  "rodolphe-raffalli",
  "rony-verbiest",
  "samy-daussat",
  "sandro-roy",
  "steeve-laffont",
  "stephane-grappelli",
  "stephane-wrembel",
  "stochelo-rosenberg",
  "tchavolo-schmitt",
  "tim-kliphuis",
  "torsten-goods",
  "wawau-adler",
]);

export function albumCover(slug: string) {
  return ALBUM_COVERS.has(slug) ? `/albums/${slug}.jpg` : null;
}

export function newsThumb(item: NewsItem) {
  if (item.image && item.image !== "/guitar-wood.jpg") return item.image;
  if (item.albumSlug) {
    const cover = albumCover(item.albumSlug);
    if (cover) return cover;
  }
  for (const slug of item.artistSlugs) {
    if (ARTIST_PHOTOS.has(slug)) return `/artists/${slug}.jpg`;
  }
  return null;
}

export function artistPageHref(slug: string) {
  if (slug === "django-reinhardt") return "/django";
  if (slug === "stephane-grappelli") return "/grappelli";
  if (slug === "tata-mirando") return "/tata-mirando";
  if (slug === "denis-chang") return "/denis-chang";
  return `/musicians/${slug}`;
}
