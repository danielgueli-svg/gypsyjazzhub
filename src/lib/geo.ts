import { slugify } from "@/lib/utils";
import { CAMPS, type Camp } from "@/lib/camps";
import type { Concert, Legend, Profile } from "@/lib/api";
import { FESTIVALS, type Festival } from "@/lib/festivals";
import { JAMS, rollJamNext, type Jam } from "@/lib/jams";
import { VENUES, type Venue } from "@/lib/venues";
import { LUTHIERS, type Luthier } from "@/lib/luthiers";
import { SHOPS, type Shop } from "@/lib/shops";
import { BANDS, type Band } from "@/lib/scene";

export type GlobeArtist = {
  slug: string;
  name: string;
  kind: "legend" | "musician";
  instruments: string;
  place: string;
  past?: boolean;
};

export type GlobeCountry = {
  name: string;
  displayName: string;
  artists: GlobeArtist[];
  concerts: Concert[];
  festivals: Festival[];
  jams: Jam[];
  camps: Camp[];
  venues: Venue[];
  luthiers: Luthier[];
  shops: Shop[];
  bands: Band[];
};

const ALIASES: Record<string, string> = {
  usa: "United States of America",
  us: "United States of America",
  "u.s.": "United States of America",
  "u.s.a.": "United States of America",
  "united states": "United States of America",
  "united states of america": "United States of America",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  gb: "United Kingdom",
  "great britain": "United Kingdom",
  england: "United Kingdom",
  scotland: "United Kingdom",
  wales: "United Kingdom",
  "united kingdom": "United Kingdom",
  holland: "Netherlands",
  "the netherlands": "Netherlands",
  netherlands: "Netherlands",
  domburg: "Netherlands",
  "czech republic": "Czechia",
  czechia: "Czechia",
  "south korea": "South Korea",
  "north korea": "North Korea",
  russia: "Russia",
  "russian federation": "Russia",
  moscow: "Russia",
  москва: "Russia",
  petersburg: "Russia",
  "saint petersburg": "Russia",
  "st petersburg": "Russia",
  "st. petersburg": "Russia",
  "sankt-peterburg": "Russia",
  "bosnia": "Bosnia and Herz.",
  "bosnia and herzegovina": "Bosnia and Herz.",
  "dominican republic": "Dominican Rep.",
  "united arab emirates": "United Arab Emirates",
  france: "France",
  alsace: "France",
  corsica: "France",
  soufflenheim: "France",
  "samois-sur-seine": "France",
  samois: "France",
  fontainebleau: "France",
  paris: "France",
  arles: "France",
  montpellier: "France",
  belgium: "Belgium",
  germany: "Germany",
  cologne: "Germany",
  koln: "Germany",
  "köln": "Germany",
  italy: "Italy",
  spain: "Spain",
  romania: "Romania",
  sweden: "Sweden",
  finland: "Finland",
  austria: "Austria",
  switzerland: "Switzerland",
  argentina: "Argentina",
  japan: "Japan",
  canada: "Canada",
  victoria: "Canada",
  sidney: "Canada",
  australia: "Australia",
  brazil: "Brazil",
  brasil: "Brazil",
  poland: "Poland",
  ireland: "Ireland",
  dublin: "Ireland",
  letterkenny: "Ireland",
  ramelton: "Ireland",
  "dun laoghaire": "Ireland",
  "dún laoghaire": "Ireland",
  donegal: "Ireland",
  belfast: "United Kingdom",
  "northern ireland": "United Kingdom",
  cardiff: "United Kingdom",
  swansea: "United Kingdom",
  edinburgh: "United Kingdom",
  portugal: "Portugal",
  denmark: "Denmark",
  croatia: "Croatia",
  norway: "Norway",
  hungary: "Hungary",
  slovakia: "Slovakia",
  estonia: "Estonia",
  luxembourg: "Luxembourg",
  ukraine: "Ukraine",
  greece: "Greece",
  "north macedonia": "North Macedonia",
  macedonia: "North Macedonia",
  turkey: "Turkey",
  nepal: "Nepal",
  kuwait: "Kuwait",
  "kuwait city": "Kuwait",
  dubai: "United Arab Emirates",
  uae: "United Arab Emirates",
  mexico: "Mexico",
  chile: "Chile",
  colombia: "Colombia",
  uruguay: "Uruguay",
  peru: "Peru",
  ecuador: "Ecuador",
  venezuela: "Venezuela",
  paraguay: "Paraguay",
  bolivia: "Bolivia",
  "costa rica": "Costa Rica",
  india: "India",
  china: "China",
  taiwan: "Taiwan",
  taipei: "Taiwan",
  台灣: "Taiwan",
  台湾: "Taiwan",
  臺灣: "Taiwan",
  台北: "Taiwan",
  臺北: "Taiwan",
  "hong kong": "China",
  hongkong: "China",
  melbourne: "Australia",
  madison: "United States of America",
  singapore: "Singapore",
  malaysia: "Malaysia",
  "kuala lumpur": "Malaysia",
  bangkok: "Thailand",
  thailand: "Thailand",
  "new zealand": "New Zealand",
  auckland: "New Zealand",
  wellington: "New Zealand",
  liechtenstein: "Liechtenstein",
  "puerto rico": "Puerto Rico",
  kosovo: "Kosovo",
  bahamas: "Bahamas",
  angola: "Angola",
  armenia: "Armenia",
  azerbaijan: "Azerbaijan",
  bangladesh: "Bangladesh",
  belarus: "Belarus",
  benin: "Benin",
  botswana: "Botswana",
  cameroon: "Cameroon",
  cuba: "Cuba",
  cyprus: "Cyprus",
  georgia: "Georgia",
  ghana: "Ghana",
  guatemala: "Guatemala",
  kazakhstan: "Kazakhstan",
  latvia: "Latvia",
  lithuania: "Lithuania",
  mongolia: "Mongolia",
  montenegro: "Montenegro",
  panama: "Panama",
  suriname: "Suriname",
  "trinidad and tobago": "Trinidad and Tobago",
  uganda: "Uganda",
};

const DISPLAY: Record<string, string> = {
  "United States of America": "United States",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "Dominican Rep.": "Dominican Republic",
  "Central African Rep.": "Central African Republic",
  "Dem. Rep. Congo": "Democratic Republic of the Congo",
  "Falkland Is.": "Falkland Islands",
  "Solomon Is.": "Solomon Islands",
  "S. Sudan": "South Sudan",
  "N. Cyprus": "Northern Cyprus",
  "Eq. Guinea": "Equatorial Guinea",
  "W. Sahara": "Western Sahara",
  "Fr. S. Antarctic Lands": "French Southern Lands",
  "United Kingdom": "Great Britain",
};

export function displayCountry(atlasName: string, locale = "en") {
  const key = resolveCountry(atlasName) ?? atlasName;
  const iso = ISO2[key];
  if (iso) {
    try {
      const label = new Intl.DisplayNames([locale], { type: "region" }).of(iso);
      if (label) return label;
    } catch {
      /* ignore */
    }
  }
  return DISPLAY[key] ?? key;
}

const ISO2: Record<string, string> = {
  Afghanistan: "AF",
  Albania: "AL",
  Algeria: "DZ",
  Angola: "AO",
  Argentina: "AR",
  Armenia: "AM",
  Australia: "AU",
  Austria: "AT",
  Azerbaijan: "AZ",
  Bahamas: "BS",
  Bangladesh: "BD",
  Belarus: "BY",
  Belgium: "BE",
  Belize: "BZ",
  Benin: "BJ",
  Bhutan: "BT",
  Bolivia: "BO",
  "Bosnia and Herz.": "BA",
  Botswana: "BW",
  Brazil: "BR",
  Brunei: "BN",
  Bulgaria: "BG",
  "Burkina Faso": "BF",
  Burundi: "BI",
  Cambodia: "KH",
  Cameroon: "CM",
  Canada: "CA",
  "Central African Rep.": "CF",
  Chad: "TD",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  Congo: "CG",
  "Costa Rica": "CR",
  Croatia: "HR",
  Cuba: "CU",
  Cyprus: "CY",
  Czechia: "CZ",
  "Côte d'Ivoire": "CI",
  "Dem. Rep. Congo": "CD",
  Denmark: "DK",
  Djibouti: "DJ",
  "Dominican Rep.": "DO",
  Ecuador: "EC",
  Egypt: "EG",
  "El Salvador": "SV",
  "Eq. Guinea": "GQ",
  Eritrea: "ER",
  Estonia: "EE",
  Ethiopia: "ET",
  "Falkland Is.": "FK",
  Fiji: "FJ",
  Finland: "FI",
  "Fr. S. Antarctic Lands": "TF",
  France: "FR",
  Gabon: "GA",
  Gambia: "GM",
  Georgia: "GE",
  Germany: "DE",
  Ghana: "GH",
  Greece: "GR",
  Greenland: "GL",
  Guatemala: "GT",
  Guinea: "GN",
  "Guinea-Bissau": "GW",
  Guyana: "GY",
  Haiti: "HT",
  Honduras: "HN",
  Hungary: "HU",
  Iceland: "IS",
  India: "IN",
  Indonesia: "ID",
  Iran: "IR",
  Iraq: "IQ",
  Ireland: "IE",
  Israel: "IL",
  Italy: "IT",
  Jamaica: "JM",
  Japan: "JP",
  Jordan: "JO",
  Kazakhstan: "KZ",
  Kenya: "KE",
  Kosovo: "XK",
  Kuwait: "KW",
  Kyrgyzstan: "KG",
  Laos: "LA",
  Latvia: "LV",
  Lebanon: "LB",
  Lesotho: "LS",
  Liberia: "LR",
  Libya: "LY",
  Lithuania: "LT",
  Luxembourg: "LU",
  Macedonia: "MK",
  "North Macedonia": "MK",
  Madagascar: "MG",
  Malawi: "MW",
  Malaysia: "MY",
  Mali: "ML",
  Mauritania: "MR",
  Malta: "MT",
  Mexico: "MX",
  Moldova: "MD",
  Mongolia: "MN",
  Montenegro: "ME",
  Morocco: "MA",
  Mozambique: "MZ",
  Myanmar: "MM",
  Namibia: "NA",
  Nepal: "NP",
  Netherlands: "NL",
  "New Caledonia": "NC",
  "New Zealand": "NZ",
  Nicaragua: "NI",
  Niger: "NE",
  Nigeria: "NG",
  "North Korea": "KP",
  Norway: "NO",
  Oman: "OM",
  Pakistan: "PK",
  Palestine: "PS",
  Panama: "PA",
  "Papua New Guinea": "PG",
  Paraguay: "PY",
  Peru: "PE",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  "Puerto Rico": "PR",
  Qatar: "QA",
  Romania: "RO",
  Russia: "RU",
  Rwanda: "RW",
  "S. Sudan": "SS",
  "Saudi Arabia": "SA",
  Senegal: "SN",
  Serbia: "RS",
  "Sierra Leone": "SL",
  Slovakia: "SK",
  Slovenia: "SI",
  "Solomon Is.": "SB",
  Somalia: "SO",
  "South Africa": "ZA",
  "South Korea": "KR",
  Spain: "ES",
  "Sri Lanka": "LK",
  Sudan: "SD",
  Suriname: "SR",
  Sweden: "SE",
  Switzerland: "CH",
  Syria: "SY",
  Taiwan: "TW",
  Tajikistan: "TJ",
  Tanzania: "TZ",
  Thailand: "TH",
  "Timor-Leste": "TL",
  Togo: "TG",
  "Trinidad and Tobago": "TT",
  Tunisia: "TN",
  Turkey: "TR",
  Turkmenistan: "TM",
  Uganda: "UG",
  Ukraine: "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States of America": "US",
  Uruguay: "UY",
  Uzbekistan: "UZ",
  Vanuatu: "VU",
  Venezuela: "VE",
  Vietnam: "VN",
  "W. Sahara": "EH",
  Yemen: "YE",
  Zambia: "ZM",
  Zimbabwe: "ZW",
  eSwatini: "SZ",
  Singapore: "SG",
  Liechtenstein: "LI",
};

function isoToFlag(iso: string) {
  return [...iso.toUpperCase()]
    .map((ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)))
    .join("");
}

export const COUNTRY_OPTIONS = [
  "France",
  "Belgium",
  "Netherlands",
  "Germany",
  "Italy",
  "Spain",
  "Portugal",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Romania",
  "Hungary",
  "Greece",
  "North Macedonia",
  "Ireland",
  "Iceland",
  "Malta",
  "United Kingdom",
  "United States of America",
  "Canada",
  "Mexico",
  "Argentina",
  "Brazil",
  "Chile",
  "Japan",
  "Australia",
  "New Zealand",
  "India",
  "Nepal",
  "Turkey",
  "Kuwait",
  "United Arab Emirates",
  "Russia",
  "Ukraine",
  "Czechia",
  "Estonia",
  "Luxembourg",
  "Croatia",
  "Serbia",
  "Slovenia",
  "Slovakia",
  "Bulgaria",
  "Morocco",
  "Tunisia",
  "Algeria",
  "South Africa",
  "China",
  "South Korea",
  "Taiwan",
  "Thailand",
  "Vietnam",
  "Indonesia",
  "Israel",
  "Lebanon",
  "Egypt",
  "Colombia",
  "Uruguay",
  "Peru",
  "Singapore",
  "Malaysia",
  "Philippines",
  "Cambodia",
  "Angola",
  "Armenia",
  "Azerbaijan",
  "Bahamas",
  "Bangladesh",
  "Belarus",
  "Benin",
  "Bolivia",
  "Bosnia and Herz.",
  "Botswana",
  "Cameroon",
  "Cuba",
  "Cyprus",
  "Ecuador",
  "Georgia",
  "Ghana",
  "Guatemala",
  "Kazakhstan",
  "Kosovo",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Mongolia",
  "Montenegro",
  "Panama",
  "Paraguay",
  "Puerto Rico",
  "Suriname",
  "Trinidad and Tobago",
  "Uganda",
  "Venezuela",
];

export function countryIso(atlasName: string) {
  const key = resolveCountry(atlasName) ?? atlasName;
  return ISO2[key] ?? "";
}

export function countryFlag(atlasName: string) {
  const iso = countryIso(atlasName);
  return iso ? isoToFlag(iso) : "";
}

const SHORT: Record<string, string> = {
  "United States of America": "USA",
  "United Kingdom": "UK",
  "United Arab Emirates": "UAE",
};

export function countryCode(atlasName: string) {
  const key = resolveCountry(atlasName) ?? atlasName;
  return SHORT[key] ?? ISO2[key] ?? "";
}

export function basedInCountry(...parts: Array<string | null | undefined>): string {
  const text = parts.filter(Boolean).join(", ");
  if (!text.trim()) return "";
  const places = countriesFromText(text);
  return places.map((name) => displayCountry(name)).join(" / ");
}

export function resolveCountry(raw: string): string | null {
  const token = raw.trim().toLowerCase().replace(/\./g, "");
  if (!token) return null;
  if (ALIASES[token]) return ALIASES[token];
  if (ALIASES[raw.trim().toLowerCase()]) return ALIASES[raw.trim().toLowerCase()];
  const titled = raw.trim();
  if (ALIASES[titled.toLowerCase()]) return ALIASES[titled.toLowerCase()];
  return null;
}

export function countriesFromText(text: string): string[] {
  if (!text.trim()) return [];
  const found = new Set<string>();
  const parts = text.split(/[,/|·–-]+/).map((part) => part.trim()).filter(Boolean);
  for (const part of parts) {
    const resolved = resolveCountry(part) ?? matchKnown(part);
    if (resolved) found.add(resolved);
  }
  if (found.size === 0) {
    const resolved = resolveCountry(text) ?? matchKnown(text);
    if (resolved) found.add(resolved);
  }
  if (found.size === 0) {
    for (const part of parts.length ? parts : [text.trim()]) {
      if (/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .'-]{2,50}$/.test(part.trim())) {
        found.add(part.trim());
      }
    }
  }
  return [...found];
}

function matchKnown(part: string): string | null {
  const t = part.trim();
  if (t.length < 4) return null;
  const lower = t.toLowerCase();
  for (const name of Object.keys(ISO2)) {
    if (name.toLowerCase() === lower) return name;
  }
  return null;
}

export function directoryArtistHref(slug: string) {
  if (slug === "django-reinhardt") return "/django";
  if (slug === "stephane-grappelli") return "/grappelli";
  if (slug === "tata-mirando") return "/tata-mirando";
  if (slug === "denis-chang") return "/denis-chang";
  return `/musicians/${slug}`;
}

export function isPastLegend(years: string) {
  if (/\d{4}\s*[–-]\s*\d{4}/.test(years)) return true;
  if (/†/.test(years)) return true;
  if (/\b(d\.|died|overleden)\b/i.test(years)) return true;
  return false;
}

export function artistHref(artist: GlobeArtist) {
  if (artist.kind === "musician") return `/musicians/${artist.slug}`;
  return directoryArtistHref(artist.slug);
}

export function countrySlug(name: string) {
  return slugify(name);
}

export function countryFromSlug(slug: string) {
  return COUNTRY_OPTIONS.find((name) => countrySlug(name) === slug);
}

export function siteCountryNames(extra: string[] = []) {
  return [...new Set([...COUNTRY_OPTIONS, ...extra.map((name) => name.trim()).filter(Boolean)])];
}

export function primaryCountry(text: string): string | null {
  const raw = text.trim();
  if (!raw) return null;
  const direct = resolveCountry(raw) ?? matchKnown(raw);
  if (direct) return direct;
  const parts = raw.split(/[,/|·–-]+/).map((part) => part.trim()).filter(Boolean);
  for (const part of parts) {
    const resolved = resolveCountry(part) ?? matchKnown(part);
    if (resolved) return resolved;
  }
  return null;
}

export function sameCountry(value: string, atlasName: string) {
  const key = primaryCountry(value);
  if (!key) return false;
  return key === atlasName || countrySlug(key) === countrySlug(atlasName);
}

export function preferCountryNames(names: string[], preferred?: string) {
  if (!preferred) return names;
  const hit: string[] = [];
  const rest: string[] = [];
  for (const name of names) {
    (sameCountry(name, preferred) ? hit : rest).push(name);
  }
  return [...hit, ...rest];
}

/** Round-robin by country so a short homepage list is worldwide, not one scene. */
export function mixByCountry<T>(rows: T[], countryOf: (row: T) => string): T[] {
  const buckets = new Map<string, T[]>();
  const order: string[] = [];
  for (const row of rows) {
    const key = countryOf(row).trim() || "Other";
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = [];
      buckets.set(key, bucket);
      order.push(key);
    }
    bucket.push(row);
  }
  const out: T[] = [];
  let i = 0;
  let more = true;
  while (more) {
    more = false;
    for (const key of order) {
      const row = buckets.get(key)?.[i];
      if (row) {
        out.push(row);
        more = true;
      }
    }
    i += 1;
  }
  return out;
}

export function findCountry(
  index: Record<string, GlobeCountry>,
  slug: string,
): GlobeCountry | undefined {
  const rows = Object.values(index);
  const direct = rows.find((row) => countrySlug(row.name) === slug);
  if (direct) return direct;
  const titled = slug.replace(/-/g, " ");
  const key = resolveCountry(titled) ?? resolveCountry(slug);
  if (key && index[key]) return index[key];
  return rows.find((row) => countrySlug(resolveCountry(row.name) ?? row.name) === slug);
}

export function isOnGlobe(active: Record<string, unknown>, atlasName: string) {
  if (active[atlasName]) return true;
  const key = resolveCountry(atlasName) ?? atlasName;
  if (active[key]) return true;
  const slug = countrySlug(key);
  return Object.keys(active).some((name) => countrySlug(name) === slug);
}

export function hasLiveScene(row: GlobeCountry) {
  return (
    row.jams.length > 0 ||
    row.concerts.length > 0 ||
    row.festivals.length > 0 ||
    row.camps.length > 0 ||
    row.venues.length > 0 ||
    row.bands.length > 0
  );
}

export function globeButtonNames(index: Record<string, GlobeCountry>): string[] {
  return Object.values(index)
    .filter(hasLiveScene)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map((row) => row.name);
}

/** Extra city pins on the globe (tiny countries that vanish as a fill). */
export const GLOBE_CITIES: { city: string; country: string; lon: number; lat: number }[] = [
  { city: "Moscow", country: "Russia", lon: 37.62, lat: 55.75 },
  { city: "Saint Petersburg", country: "Russia", lon: 30.32, lat: 59.93 },
  { city: "Dubai", country: "United Arab Emirates", lon: 55.27, lat: 25.2 },
  { city: "Kuwait City", country: "Kuwait", lon: 47.98, lat: 29.38 },
  { city: "Reykjavík", country: "Iceland", lon: -21.94, lat: 64.15 },
  { city: "Eschen", country: "Liechtenstein", lon: 9.52, lat: 47.21 },
  { city: "Pristina", country: "Kosovo", lon: 21.17, lat: 42.66 },
  { city: "Nassau", country: "Bahamas", lon: -77.35, lat: 25.05 },
  { city: "San Juan", country: "Puerto Rico", lon: -66.11, lat: 18.47 },
];

export function globeCityForCountry(country: string) {
  const key = resolveCountry(country) ?? country;
  return GLOBE_CITIES.find((row) => row.country === key);
}

export const CONTINENTS = [
  "africa",
  "asia",
  "europe",
  "middle-east",
  "north-america",
  "oceania",
  "south-america",
] as const;

export type ContinentId = (typeof CONTINENTS)[number];

const CONTINENT_BY_ISO: Record<string, ContinentId> = {
  AL: "europe",
  AD: "europe",
  AT: "europe",
  BA: "europe",
  BE: "europe",
  BG: "europe",
  BY: "europe",
  CH: "europe",
  CY: "europe",
  CZ: "europe",
  DE: "europe",
  DK: "europe",
  EE: "europe",
  ES: "europe",
  FI: "europe",
  FR: "europe",
  GB: "europe",
  GE: "europe",
  GR: "europe",
  HR: "europe",
  HU: "europe",
  IE: "europe",
  IS: "europe",
  IT: "europe",
  LI: "europe",
  LT: "europe",
  LU: "europe",
  LV: "europe",
  MD: "europe",
  ME: "europe",
  MK: "europe",
  MT: "europe",
  NL: "europe",
  NO: "europe",
  PL: "europe",
  PT: "europe",
  RO: "europe",
  RS: "europe",
  RU: "europe",
  SE: "europe",
  SI: "europe",
  SK: "europe",
  SM: "europe",
  UA: "europe",
  XK: "europe",
  TR: "europe",
  CA: "north-america",
  US: "north-america",
  MX: "north-america",
  GT: "north-america",
  BZ: "north-america",
  HN: "north-america",
  SV: "north-america",
  NI: "north-america",
  CR: "north-america",
  PA: "north-america",
  CU: "north-america",
  JM: "north-america",
  HT: "north-america",
  DO: "north-america",
  PR: "north-america",
  BS: "north-america",
  TT: "north-america",
  GL: "north-america",
  AR: "south-america",
  BO: "south-america",
  BR: "south-america",
  CL: "south-america",
  CO: "south-america",
  EC: "south-america",
  GY: "south-america",
  PE: "south-america",
  PY: "south-america",
  SR: "south-america",
  UY: "south-america",
  VE: "south-america",
  FK: "south-america",
  AF: "asia",
  AM: "asia",
  AZ: "asia",
  BD: "asia",
  BN: "asia",
  BT: "asia",
  CN: "asia",
  ID: "asia",
  IN: "asia",
  JP: "asia",
  KG: "asia",
  KH: "asia",
  KP: "asia",
  KR: "asia",
  KZ: "asia",
  LA: "asia",
  LK: "asia",
  MM: "asia",
  MN: "asia",
  MY: "asia",
  NP: "asia",
  PH: "asia",
  PK: "asia",
  SG: "asia",
  TH: "asia",
  TJ: "asia",
  TL: "asia",
  TM: "asia",
  TW: "asia",
  UZ: "asia",
  VN: "asia",
  BH: "middle-east",
  IL: "middle-east",
  IQ: "middle-east",
  IR: "middle-east",
  JO: "middle-east",
  KW: "middle-east",
  LB: "middle-east",
  OM: "middle-east",
  PS: "middle-east",
  QA: "middle-east",
  SA: "middle-east",
  SY: "middle-east",
  AE: "middle-east",
  YE: "middle-east",
  DZ: "africa",
  AO: "africa",
  BF: "africa",
  BI: "africa",
  BJ: "africa",
  BW: "africa",
  CD: "africa",
  CF: "africa",
  CG: "africa",
  CI: "africa",
  CM: "africa",
  DJ: "africa",
  EG: "africa",
  EH: "africa",
  ER: "africa",
  ET: "africa",
  GA: "africa",
  GH: "africa",
  GM: "africa",
  GN: "africa",
  GQ: "africa",
  GW: "africa",
  KE: "africa",
  LR: "africa",
  LS: "africa",
  LY: "africa",
  MA: "africa",
  MG: "africa",
  ML: "africa",
  MR: "africa",
  MW: "africa",
  MZ: "africa",
  NA: "africa",
  NE: "africa",
  NG: "africa",
  RW: "africa",
  SD: "africa",
  SL: "africa",
  SN: "africa",
  SO: "africa",
  SS: "africa",
  SZ: "africa",
  TD: "africa",
  TG: "africa",
  TN: "africa",
  TZ: "africa",
  UG: "africa",
  ZA: "africa",
  ZM: "africa",
  ZW: "africa",
  AU: "oceania",
  FJ: "oceania",
  NC: "oceania",
  NZ: "oceania",
  PG: "oceania",
  SB: "oceania",
  VU: "oceania",
};

export function continentOf(name: string): ContinentId | null {
  const key = resolveCountry(name) ?? name;
  const iso = ISO2[key];
  return iso ? (CONTINENT_BY_ISO[iso] ?? null) : null;
}

export function isAfricaCountry(name: string) {
  return continentOf(name) === "africa";
}

export function groupByContinent(names: string[]) {
  const buckets = new Map<ContinentId, string[]>();
  for (const name of names) {
    const id = continentOf(name);
    if (!id) continue;
    const list = buckets.get(id) ?? [];
    list.push(name);
    buckets.set(id, list);
  }
  return CONTINENTS.flatMap((id) => {
    const countries = buckets.get(id);
    if (!countries?.length) return [];
    return [
      {
        id,
        countries: [...countries].sort((a, b) =>
          displayCountry(a).localeCompare(displayCountry(b)),
        ),
      },
    ];
  });
}

export function buildGlobeIndex(
  legends: Legend[],
  musicians: Profile[],
  concerts: Concert[],
  extraFestivals: Festival[] = [],
  extraJams: Jam[] = [],
  extraVenues: Venue[] = [],
  extraLuthiers: Luthier[] = [],
  extraCountries: string[] = [],
): Record<string, GlobeCountry> {
  const index: Record<string, GlobeCountry> = {};

  function ensure(name: string): GlobeCountry {
    const key = resolveCountry(name) ?? name.trim();
    if (!key) {
      return {
        name: name.trim(),
        displayName: displayCountry(name),
        artists: [],
        concerts: [],
        festivals: [],
        jams: [],
        camps: [],
        venues: [],
        luthiers: [],
        shops: [],
        bands: [],
      };
    }
    if (!index[key]) {
      index[key] = {
        name: key,
        displayName: displayCountry(key),
        artists: [],
        concerts: [],
        festivals: [],
        jams: [],
        camps: [],
        venues: [],
        luthiers: [],
        shops: [],
        bands: [],
      };
    }
    return index[key];
  }

  for (const extra of extraCountries) {
    if (extra.trim()) ensure(extra);
  }

  for (const legend of legends) {
    const places = countriesFromText(legend.origin);
    const artist: GlobeArtist = {
      slug: legend.slug,
      name: legend.name,
      kind: "legend",
      instruments: legend.instruments,
      place: basedInCountry(legend.origin),
      past: isPastLegend(legend.years),
    };
    for (const place of places) {
      const row = ensure(place);
      if (!row.artists.some((a) => a.slug === artist.slug && a.kind === artist.kind)) {
        row.artists.push(artist);
      }
    }
  }

  for (const musician of musicians) {
    const places = countriesFromText(`${musician.city} ${musician.country}`);
    const artist: GlobeArtist = {
      slug: musician.slug,
      name: musician.displayName,
      kind: "musician",
      instruments: musician.instruments,
      place: basedInCountry(musician.country, musician.city),
    };
    for (const place of places) {
      const row = ensure(place);
      if (!row.artists.some((a) => a.slug === artist.slug && a.kind === artist.kind)) {
        row.artists.push(artist);
      }
    }
  }

  const now = Date.now();
  for (const concert of concerts) {
    if (concert.isHistoric) continue;
    if (new Date(concert.startsAt).getTime() < now) continue;
    const place = primaryCountry(concert.country);
    if (!place) continue;
    ensure(place).concerts.push(concert);
  }

  for (const festival of [...FESTIVALS, ...extraFestivals]) {
    const place = primaryCountry(festival.country);
    if (!place) continue;
    const row = ensure(place);
    if (!row.festivals.some((item) => item.slug === festival.slug)) {
      row.festivals.push(festival);
    }
  }

  const nowJam = Date.now();
  const catalogSlugs = new Set(JAMS.map((jam) => jam.slug));
  for (const jam of [...JAMS, ...extraJams]) {
    const place = primaryCountry(jam.country);
    if (!place) continue;
    const row = ensure(place);
    const rolled = { ...jam, nextStartsAt: rollJamNext(jam, nowJam) };
    const past = new Date(rolled.nextStartsAt).getTime() < nowJam;
    if (past && !catalogSlugs.has(jam.slug)) continue;
    if (!row.jams.some((item) => item.slug === jam.slug)) {
      row.jams.push(rolled);
    }
  }

  const nowCamp = Date.now();
  for (const camp of CAMPS) {
    if (new Date(camp.nextStartsAt).getTime() < nowCamp - 86_400_000) continue;
    const place = primaryCountry(camp.country);
    if (!place) continue;
    const row = ensure(place);
    if (!row.camps.some((item) => item.slug === camp.slug)) {
      row.camps.push(camp);
    }
  }

  for (const venue of [...VENUES, ...extraVenues]) {
    const place = primaryCountry(venue.country);
    if (!place) continue;
    const row = ensure(place);
    if (!row.venues.some((item) => item.slug === venue.slug)) {
      row.venues.push(venue);
    }
  }

  for (const luthier of [...LUTHIERS, ...extraLuthiers]) {
    const place = primaryCountry(luthier.country);
    if (!place) continue;
    const row = ensure(place);
    if (!row.luthiers.some((item) => item.slug === luthier.slug)) {
      row.luthiers.push(luthier);
    }
  }

  for (const shop of SHOPS) {
    const place = primaryCountry(shop.country);
    if (!place) continue;
    const row = ensure(place);
    if (!row.shops.some((item) => item.slug === shop.slug)) {
      row.shops.push(shop);
    }
  }

  for (const band of BANDS) {
    const place = primaryCountry(band.country) ?? primaryCountry(band.origin);
    if (!place) continue;
    const row = ensure(place);
    if (!row.bands.some((item) => item.slug === band.slug)) {
      row.bands.push(band);
    }
  }

  for (const row of Object.values(index)) {
    row.artists.sort((a, b) => a.name.localeCompare(b.name));
    row.concerts.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
    row.jams.sort(
      (a, b) => new Date(a.nextStartsAt).getTime() - new Date(b.nextStartsAt).getTime(),
    );
    row.camps.sort(
      (a, b) => new Date(a.nextStartsAt).getTime() - new Date(b.nextStartsAt).getTime(),
    );
  }

  return index;
}
