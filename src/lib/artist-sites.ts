import type { ScanFind, SourceKind } from "@/lib/discovery";
import { resolveCountry } from "@/lib/geo";
import { slugify } from "@/lib/utils";

export type CrawlTarget = {
  slug: string;
  name: string;
  url: string;
  parse: "sinti" | "jsonld";
  sourceKind: SourceKind;
  eventKind?: "concert" | "jam" | "festival";
  festivalSlug?: string;
  city?: string;
  country?: string;
  artistSlug?: string;
  followAgenda?: boolean;
};

/** Always fetched first: agency + artists who keep a public tour page. */
export const ARTIST_TOUR_SITES: CrawlTarget[] = [
  {
    slug: "sinti-music",
    name: "Sinti Music",
    url: "https://www.sintimusic.nl/en/shows/",
    parse: "sinti",
    sourceKind: "artist_site",
  },
  {
    slug: "stephane-wrembel",
    name: "Stéphane Wrembel",
    url: "https://www.stephanewrembel.com/",
    parse: "jsonld",
    sourceKind: "artist_site",
    artistSlug: "stephane-wrembel",
  },
  {
    slug: "dario-napoli",
    name: "Dario Napoli",
    url: "https://darionapoli.com/",
    parse: "jsonld",
    sourceKind: "artist_site",
    artistSlug: "dario-napoli",
  },
  {
    slug: "denis-chang",
    name: "Denis Chang",
    url: "https://www.denischang.com/",
    parse: "jsonld",
    sourceKind: "artist_site",
    artistSlug: "denis-chang",
  },
  {
    slug: "nuno-marinho",
    name: "Nuno Marinho",
    url: "https://www.nunomarinho.com/",
    parse: "jsonld",
    sourceKind: "artist_site",
    artistSlug: "nuno-marinho",
  },
  {
    slug: "paulus-schafer",
    name: "Paulus Schäfer",
    url: "http://www.paulusschafer.com/",
    parse: "jsonld",
    sourceKind: "artist_site",
    artistSlug: "paulus-schafer",
  },
];

export type ArtistTourSite = CrawlTarget;

const SOCIAL =
  /facebook\.com|instagram\.com|youtube\.com|youtu\.be|spotify\.com|soundcloud\.com|tiktok\.com|twitter\.com|x\.com|bandcamp\.com/i;

export function isCrawlableUrl(url: string) {
  if (!/^https?:\/\//i.test(url.trim())) return false;
  return !SOCIAL.test(url);
}

export function urlKey(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, "") || "/";
    return `${host}${path}`;
  } catch {
    return url.replace(/\/+$/, "").toLowerCase();
  }
}

export function agendaFollowUrl(html: string, base: string) {
  const hrefs = [...html.matchAll(/href=["']([^"'#]+)["']/gi)].map((row) => row[1]!);
  for (const href of hrefs) {
    if (!/agenda|programma|programs?|concerts?|shows|tour|dates|line-?up|timetable|kalender|optredens/i.test(href)) {
      continue;
    }
    try {
      const next = new URL(href, base);
      if (next.hostname.replace(/^www\./, "") !== new URL(base).hostname.replace(/^www\./, "")) {
        continue;
      }
      if (urlKey(next.href) === urlKey(base)) continue;
      if (!isCrawlableUrl(next.href)) continue;
      return next.href;
    } catch {
      continue;
    }
  }
  return "";
}

const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const DATE_RE =
  /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(20\d{2})$/i;

const COUNTRY_TAIL =
  /^(.*?)\s+(The Netherlands|Netherlands|United States of America|United States|USA|UK|Iceland|France|Germany|Deutschland|Estonia|Luxembourg|Belgium|Latvia|England)$/i;

const CITY_COUNTRY: Record<string, string> = {
  "sint tunnis": "Netherlands",
  mierlo: "Netherlands",
  vorden: "Netherlands",
  stolwijk: "Netherlands",
  amersfoort: "Netherlands",
  valkenswaard: "Netherlands",
  texel: "Netherlands",
  "den hoorn": "Netherlands",
  "den bosch": "Netherlands",
  wingene: "Belgium",
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ");
}

function linesOf(html: string) {
  return stripHtml(html)
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function artistFromTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes("stochelo")) return { name: title, slug: "stochelo-rosenberg" };
  if (t.includes("mozes")) return { name: title, slug: "mozes-rosenberg" };
  if (t.includes("paulus")) return { name: title, slug: "paulus-schafer" };
  if (t.includes("rosenberg")) return { name: title, slug: "stochelo-rosenberg" };
  if (t.includes("gismo")) return { name: title, slug: "gismo-graf" };
  if (t.includes("dario")) return { name: title, slug: "dario-napoli" };
  if (t.includes("wrembel")) return { name: title, slug: "stephane-wrembel" };
  return { name: title, slug: slugify(title).slice(0, 48) };
}

function splitPlace(raw: string) {
  const at = raw.split(/\s+@\s+/);
  const venue = (at[1] ?? "").replace(/\s+/g, " ").trim();
  const left = (at[0] ?? raw).replace(/\s+/g, " ").trim();
  const tail = left.match(COUNTRY_TAIL);
  const city = (tail ? tail[1] : left).replace(/\s+/g, " ").trim();
  const countryToken = tail?.[2] ?? "";
  const country =
    resolveCountry(countryToken) ??
    resolveCountry(left) ??
    CITY_COUNTRY[city.toLowerCase()] ??
    CITY_COUNTRY[city.toLowerCase().replace(/,.*/, "").trim()] ??
    "";
  return { city, venue, country };
}

function fromDay(year: number, month: number, day: number) {
  const starts = Date.UTC(year, month, day, 19, 0, 0);
  if (Number.isNaN(starts) || starts < Date.now() - 86_400_000) return null;
  return new Date(starts).toISOString();
}

export function parseSintiShows(html: string, pageUrl: string): ScanFind[] {
  const lines = linesOf(html);
  const out: ScanFind[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < lines.length; i += 1) {
    const date = lines[i]!.match(DATE_RE);
    if (!date) continue;
    const month = MONTHS[date[3]!.toLowerCase()];
    const day = Number(date[2]);
    const year = Number(date[4]);
    if (month == null || !day || !year) continue;
    const startsAt = fromDay(year, month, day);
    if (!startsAt) continue;
    let cursor = i + 1;
    if (lines[cursor]?.startsWith("→")) cursor += 1;
    const title = lines[cursor] ?? "";
    const place = lines[cursor + 1] ?? "";
    if (!title || title.toLowerCase() === "tickets") continue;
    const { city, venue, country } = splitPlace(place);
    if (!venue && !city) continue;
    const who = artistFromTitle(title);
    const key = `${title}|${startsAt.slice(0, 10)}|${venue}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const fest = /\b(festival|fest)\b/i.test(`${title} ${place}`);
    out.push({
      title,
      artistName: who.name,
      artistSlug: who.slug,
      venue: venue || city,
      city,
      country,
      startsAt,
      eventKind: fest ? "festival" : "concert",
      sources: [{ kind: "artist_site", url: pageUrl, label: "Sinti Music" }],
    });
  }
  return out;
}

function jsonLdBlocks(html: string) {
  const found: unknown[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let hit: RegExpExecArray | null;
  while ((hit = re.exec(html))) {
    try {
      found.push(JSON.parse(hit[1]!.trim()));
    } catch {
      /* ignore broken json-ld */
    }
  }
  return found;
}

function walkJsonLd(node: unknown, acc: Record<string, unknown>[]): Record<string, unknown>[] {
  if (!node) return acc;
  if (Array.isArray(node)) {
    for (const item of node) walkJsonLd(item, acc);
    return acc;
  }
  if (typeof node !== "object") return acc;
  const row = node as Record<string, unknown>;
  const types = [row["@type"]].flat().map((value) => String(value || "").toLowerCase());
  if (types.includes("event") || types.includes("musicevent")) acc.push(row);
  if (row["@graph"]) walkJsonLd(row["@graph"], acc);
  return acc;
}

export function parseJsonLdEvents(html: string, site: CrawlTarget): ScanFind[] {
  const out: ScanFind[] = [];
  const seen = new Set<string>();
  const sourceKind = site.sourceKind;
  const eventKind =
    site.eventKind ??
    (sourceKind === "festival_official" ? "festival" : "concert");
  for (const block of jsonLdBlocks(html)) {
    for (const event of walkJsonLd(block, [])) {
      const title = String(event.name || "").replace(/\s+/g, " ").trim();
      const start = String(event.startDate || event.start_date || "").trim();
      if (!title || !start) continue;
      const when = new Date(start);
      if (Number.isNaN(when.getTime()) || when.getTime() < Date.now() - 86_400_000) continue;
      const loc = event.location;
      const locObj =
        loc && typeof loc === "object" && !Array.isArray(loc)
          ? (loc as Record<string, unknown>)
          : {};
      const address =
        locObj.address && typeof locObj.address === "object"
          ? (locObj.address as Record<string, unknown>)
          : {};
      const venue = String(locObj.name || event.location || site.name || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);
      const city = String(address.addressLocality || site.city || "").trim();
      const country =
        resolveCountry(String(address.addressCountry || "")) ??
        resolveCountry(String(site.country || "")) ??
        resolveCountry(String(address.addressLocality || "")) ??
        "";
      if (!venue && !city) continue;
      const billed = title.includes(site.name) ? title : `${site.name} — ${title}`;
      const who = artistFromTitle(billed);
      const startsAt = when.toISOString();
      const key = `${title}|${startsAt.slice(0, 10)}|${venue}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        title: title.slice(0, 120),
        artistName: who.name,
        artistSlug: site.artistSlug || who.slug,
        venue: venue || city,
        city,
        country,
        startsAt,
        festivalSlug: site.festivalSlug,
        eventKind: /\b(festival|fest|camp|workshop)\b/i.test(title) ? "festival" : eventKind,
        sources: [{ kind: sourceKind, url: site.url, label: site.name }],
      });
    }
  }
  return out;
}

export function parseArtistPage(html: string, site: CrawlTarget): ScanFind[] {
  if (site.parse === "sinti") return parseSintiShows(html, site.url);
  return parseJsonLdEvents(html, site);
}

const GYPSY_HINT =
  /\b(django|manouche|gypsy|gipsy|sinti|reinhardt|hot club|selmer|rosenberg|schafer|schäfer)\b/i;

export function venueEventFits(title: string, hints: string[]) {
  if (GYPSY_HINT.test(title)) return true;
  const hay = title.toLowerCase();
  return hints.some((name) => name.length > 4 && hay.includes(name));
}
