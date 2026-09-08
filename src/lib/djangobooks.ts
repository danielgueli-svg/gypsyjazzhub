import type { ScanFind } from "@/lib/discovery";
import { countriesFromText, resolveCountry } from "@/lib/geo";
import { slugify } from "@/lib/utils";

export type ForumKind = "concert" | "jam" | "festival";

export type DjangoBooksBoard = {
  slug: string;
  name: string;
  url: string;
};

export const DJANGOBOOKS_BOARDS: DjangoBooksBoard[] = [
  {
    slug: "europe",
    name: "Europe",
    url: "https://www.djangobooks.com/forum/categories/europe",
  },
  {
    slug: "north-america",
    name: "North America",
    url: "https://www.djangobooks.com/forum/categories/north-america",
  },
  {
    slug: "international",
    name: "International",
    url: "https://www.djangobooks.com/forum/categories/international",
  },
  {
    slug: "events",
    name: "Gypsy Jazz Events",
    url: "https://www.djangobooks.com/forum/categories/gypsy-jazz-events",
  },
  {
    slug: "discussions",
    name: "Recent discussions",
    url: "https://www.djangobooks.com/forum/discussions",
  },
];

/**
 * Events announced on DjangoBooks with a real thread URL.
 * Past nights stay out. Type is concert, jam or festival as billed.
 */
export const DJANGOBOOKS_QUEUE: (ScanFind & { eventKind: ForumKind })[] = [
  {
    eventKind: "concert",
    title: "DC Ambiance",
    artistName: "DC Ambiance",
    artistSlug: "dc-ambiance",
    venue: "The Lyceum",
    city: "Alexandria",
    country: "United States of America",
    startsAt: "2026-08-29T23:00:00.000Z",
    sources: [
      {
        kind: "djangobooks",
        url: "https://www.djangobooks.com/forum/discussion/21966/dc-ambiance-at-lyceum-in-alexandria-va",
        label: "DjangoBooks",
      },
    ],
  },
];

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
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const MONTH_RE =
  "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept?|Oct|Nov|Dec";

const US_STATES = new Set([
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
]);

const CA_PROVINCES = new Set(["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"]);

const SKIP_VENUE =
  /^(the\s+)?(end|least|home|night|time|moment|last|first|area|this|that|our|your|my|his|her|their|least|beginning)\b/i;

export function forumEventKind(text: string): ForumKind {
  const s = text.toLowerCase();
  if (/\b(jam session|jam\b|jams\b|boeuf|meetup jam)\b/.test(s) && !/\bfestival\b/.test(s)) {
    return "jam";
  }
  if (/\b(festival|fest\b|camp\b|workshop)\b/.test(s)) return "festival";
  return "concert";
}

export function cleanThreadTitle(title: string) {
  return title
    .replace(
      /\s+[-—|]\s*(Gypsy Jazz Events|Europe|North America|International|Discussions|DjangoBooks Forum|DjangoBooks).*$/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function fromParts(year: number, month: number, day: number, explicitYear: boolean) {
  const now = Date.now();
  let starts = Date.UTC(year, month, day, 19, 0, 0);
  if (Number.isNaN(starts) || day < 1 || day > 31) return null;
  if (starts < now - 86_400_000 && !explicitYear) {
    starts = Date.UTC(year + 1, month, day, 19, 0, 0);
  }
  if (starts < now - 86_400_000) return null;
  return new Date(starts).toISOString();
}

function yearHint(hay: string, matched?: string) {
  if (matched) return { year: Number(matched), explicit: true };
  const years = [...hay.matchAll(/\b(20\d{2})\b/g)].map((row) => Number(row[1]));
  const unique = [...new Set(years)];
  if (unique.length === 1) return { year: unique[0]!, explicit: true };
  return { year: new Date().getUTCFullYear(), explicit: false };
}

function parseForumDate(hay: string): string | null {
  const iso = hay.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) {
    return fromParts(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), true);
  }

  const euroRange = hay.match(
    new RegExp(`\\b(\\d{1,2})\\s*[-–]\\s*(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_RE})\\.?\\s*,?\\s*(20\\d{2})?\\b`, "i"),
  );
  if (euroRange) {
    const month = MONTHS[euroRange[3]!.toLowerCase()];
    const day = Number(euroRange[1]);
    const hint = yearHint(hay, euroRange[4]);
    if (month != null) return fromParts(hint.year, month, day, hint.explicit);
  }

  const euro = hay.match(
    new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_RE})\\.?\\s*,?\\s*(20\\d{2})?\\b`, "i"),
  );
  if (euro) {
    const month = MONTHS[euro[2]!.toLowerCase()];
    const day = Number(euro[1]);
    const hint = yearHint(hay, euro[3]);
    if (month != null) return fromParts(hint.year, month, day, hint.explicit);
  }

  const us = hay.match(
    new RegExp(`\\b(${MONTH_RE})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(20\\d{2}))?\\b`, "i"),
  );
  if (us) {
    const month = MONTHS[us[1]!.toLowerCase()];
    const day = Number(us[2]);
    const hint = yearHint(hay, us[3]);
    if (month != null) return fromParts(hint.year, month, day, hint.explicit);
  }

  return null;
}

function tidyVenue(raw: string) {
  const venue = raw
    .replace(/\s+/g, " ")
    .replace(/\s+in\s+.+$/i, "")
    .replace(/[.,;:]+$/, "")
    .trim();
  if (venue.length < 3 || venue.length > 60) return "";
  if (SKIP_VENUE.test(venue)) return "";
  if (/^(saturday|sunday|monday|tuesday|wednesday|thursday|friday)$/i.test(venue)) return "";
  return venue;
}

function isCountryLabel(place: string, country: string) {
  const t = place.trim().toLowerCase().replace(/\./g, "");
  const c = country.toLowerCase();
  if (!t) return true;
  if (t === c) return true;
  if (["usa", "us", "united states", "united states of america"].includes(t)) {
    return country === "United States of America";
  }
  if (["uk", "united kingdom", "great britain", "england", "scotland", "wales"].includes(t)) {
    return country === "United Kingdom";
  }
  if (["holland", "the netherlands", "netherlands"].includes(t)) return country === "Netherlands";
  return false;
}

function parsePlace(raw: string): { city: string; country: string } {
  const place = raw.replace(/\s+/g, " ").replace(/[.,;]+$/, "").trim();
  if (!place) return { city: "", country: "" };

  const us = place.match(new RegExp(`^(.+?)[,\\s]+(${[...US_STATES].join("|")})\\.?$`, "i"));
  if (us && US_STATES.has(us[2]!.toUpperCase())) {
    return { city: us[1]!.replace(/,$/, "").trim(), country: "United States of America" };
  }

  const ca = place.match(new RegExp(`^(.+?)[,\\s]+(${[...CA_PROVINCES].join("|")})\\.?$`, "i"));
  if (ca && CA_PROVINCES.has(ca[2]!.toUpperCase())) {
    return { city: ca[1]!.replace(/,$/, "").trim(), country: "Canada" };
  }

  const asCountry = resolveCountry(place);
  if (asCountry) {
    return {
      city: isCountryLabel(place, asCountry) ? "" : place,
      country: asCountry,
    };
  }

  const fromText = countriesFromText(place);
  if (fromText[0]) {
    const city = place
      .replace(new RegExp(fromText[0], "i"), "")
      .replace(/\b(usa|united states|uk|england|canada)\b/i, "")
      .replace(/[,\s]+$/, "")
      .trim();
    return { city, country: fromText[0] };
  }

  return { city: place, country: "" };
}

function inferCountry(hay: string, city: string, place: string) {
  const fromPlace = parsePlace(place);
  if (fromPlace.country) return fromPlace.country;
  const bits = countriesFromText(`${hay} ${city} ${place}`);
  if (bits[0]) return bits[0];
  const named = hay.match(
    /\b(France|Belgium|Netherlands|Germany|Italy|Spain|United Kingdom|England|Scotland|Wales|Canada|Australia|United States|USA|Switzerland|Austria|Portugal|Sweden|Norway|Denmark|Ireland|Japan|Brazil|Argentina|Mexico|Poland|Czechia|Romania|Hungary)\b/i,
  );
  if (!named?.[1]) return "";
  return resolveCountry(named[1]) ?? named[1];
}

export function parseDjangoBooksPost(
  title: string,
  body: string,
  threadUrl: string,
): (ScanFind & { eventKind: ForumKind }) | null {
  const cleaned = cleanThreadTitle(title);
  const hay = `${cleaned} ${body}`.replace(/\s+/g, " ").trim();
  if (hay.length < 16) return null;
  const startsAt = parseForumDate(hay);
  if (!startsAt) return null;

  const billed = cleaned.match(/^(.+?)\s+at\s+(.+?)(?:\s+in\s+(.+))?$/i);
  let artist = (billed?.[1] ?? cleaned).replace(/\s+/g, " ").trim().slice(0, 80);
  let venue = billed?.[2] ? tidyVenue(billed[2]) : "";
  let place = billed?.[3]?.trim() ?? "";

  if (!venue) {
    const at = hay.match(/\b(?:at|@|venue[:\s]+)\s*([^,.]{3,60})/i);
    venue = at?.[1] ? tidyVenue(at[1]) : "";
  }
  if (!place) {
    const inPlace = hay.match(/\bin\s+([A-Z][A-Za-z.]+(?:[\s,][A-Z][A-Za-z.]{1,20}){0,3})/);
    place = inPlace?.[1]?.trim() || "";
    if (!venue) {
      const onPlace = hay.match(/\bon\s+([A-Z][A-Za-z.]+(?:\s+[A-Z][A-Za-z.]{1,20}){0,3})/);
      if (onPlace?.[1]) {
        place = place || onPlace[1].trim();
        venue = tidyVenue(onPlace[1]);
      }
    }
  }

  const located = parsePlace(place);
  const city = located.city;
  const local = `${cleaned} ${body.slice(0, 1200)}`;
  const country = inferCountry(local, city, place);
  if (!venue && !city && !country) return null;

  const eventKind = forumEventKind(`${cleaned} ${body.slice(0, 800)}`);
  if (!artist) artist = cleaned.slice(0, 80);
  return {
    eventKind,
    title: artist,
    artistName: artist,
    artistSlug: slugify(artist),
    venue,
    city,
    country,
    startsAt,
    sources: [{ kind: "djangobooks", url: threadUrl, label: "DjangoBooks" }],
  };
}

export function djangobooksCredit(find: Pick<ScanFind, "sources">) {
  const row = find.sources.find((source) => source.kind === "djangobooks");
  if (!row) return "";
  return `From DjangoBooks · ${row.url}`;
}

export function threadUrlsFromHtml(html: string) {
  const found = new Set<string>();
  const re = /https?:\/\/(?:www\.)?djangobooks\.com\/forum\/discussion\/\d+\/[a-z0-9-]+/gi;
  for (const match of html.match(re) ?? []) found.add(match.split("?")[0]!);
  const rel = /href="(\/forum\/discussion\/\d+\/[a-z0-9-]+)"/gi;
  let hit: RegExpExecArray | null;
  while ((hit = rel.exec(html))) {
    found.add(`https://www.djangobooks.com${hit[1]}`);
  }
  return [...found];
}
