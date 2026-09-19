/** UI locale guess: saved pick wins, else Cloudflare country, else Accept-Language. */

export const LOCALE_COOKIE = "gjh-locale";
export const LOCALE_PICKED_COOKIE = "gjh-locale-picked";

const IDS = [
  "en",
  "es",
  "pt",
  "fr",
  "de",
  "nl",
  "it",
  "hu",
  "ro",
  "sr",
  "cs",
  "pl",
  "hr",
  "ru",
  "ja",
  "ko",
  "zh",
  "zh-tw",
  "id",
  "th",
  "he",
] as const;

export type DetectedLocale = (typeof IDS)[number];

const ID_SET = new Set<string>(IDS);

export function detectedLocale(raw: unknown): DetectedLocale | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();
  return ID_SET.has(value) ? (value as DetectedLocale) : null;
}

/** One country → one hub language. Skip mixed countries (they use COUNTRY_OPTIONS). */
const COUNTRY_LOCALE: Record<string, DetectedLocale> = {
  NL: "nl",
  SR: "nl",
  DE: "de",
  AT: "de",
  LI: "de",
  FR: "fr",
  MC: "fr",
  IT: "it",
  SM: "it",
  VA: "it",
  ES: "es",
  MX: "es",
  GT: "es",
  HN: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  CU: "es",
  DO: "es",
  PR: "es",
  CO: "es",
  VE: "es",
  EC: "es",
  PE: "es",
  BO: "es",
  PY: "es",
  UY: "es",
  AR: "es",
  CL: "es",
  PT: "pt",
  BR: "pt",
  AO: "pt",
  MZ: "pt",
  CV: "pt",
  HU: "hu",
  RO: "ro",
  MD: "ro",
  RS: "sr",
  ME: "sr",
  HR: "hr",
  CZ: "cs",
  PL: "pl",
  RU: "ru",
  BY: "ru",
  JP: "ja",
  KR: "ko",
  CN: "zh",
  TW: "zh-tw",
  HK: "zh-tw",
  MO: "zh-tw",
  ID: "id",
  TH: "th",
  IL: "he",
  US: "en",
  GB: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
};

/** Countries with more than one hub language — Accept-Language picks among these. */
const COUNTRY_OPTIONS: Record<string, DetectedLocale[]> = {
  BE: ["nl", "fr", "de"],
  CH: ["de", "fr", "it"],
  LU: ["fr", "de"],
  CA: ["en", "fr"],
};

const CRAWLER =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex(?:bot)?|facebookexternalhit|twitterbot|linkedinbot|applebot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider/i;

export function isCrawler(userAgent: string | null | undefined): boolean {
  return Boolean(userAgent && CRAWLER.test(userAgent));
}

function tagToLocale(tag: string): DetectedLocale | null {
  const raw = tag.trim().toLowerCase().replace(/_/g, "-");
  if (!raw) return null;
  if (raw.startsWith("zh-tw") || raw.startsWith("zh-hant") || raw === "zh-hk" || raw === "zh-mo") {
    return "zh-tw";
  }
  if (raw.startsWith("zh")) return "zh";
  if (raw.startsWith("pt")) return "pt";
  const base = raw.split("-")[0] ?? "";
  if (base === "nb" || base === "nn") return null;
  return detectedLocale(base);
}

/** First hub language in an Accept-Language header (or navigator.language list). */
export function localeFromAccept(
  header: string | null | undefined,
  only?: readonly DetectedLocale[],
): DetectedLocale | null {
  if (!header?.trim()) return null;
  const allow = only ? new Set<string>(only) : null;
  const parts = header.split(",").map((part) => {
    const [tag, ...params] = part.trim().split(";");
    let q = 1;
    for (const param of params) {
      const [key, value] = param.trim().split("=");
      if (key === "q") {
        const n = Number(value);
        if (Number.isFinite(n)) q = n;
      }
    }
    return { tag: (tag ?? "").trim(), q };
  });
  parts.sort((a, b) => b.q - a.q);
  for (const { tag, q } of parts) {
    if (q <= 0) continue;
    const locale = tagToLocale(tag);
    if (!locale) continue;
    if (allow && !allow.has(locale)) continue;
    return locale;
  }
  return null;
}

export function localeFromCountry(
  country: string | null | undefined,
  acceptLanguage?: string | null,
): DetectedLocale | null {
  const code = (country ?? "").trim().toUpperCase();
  if (!code || code === "XX" || code === "T1" || code === "A1" || code === "A2") return null;
  const options = COUNTRY_OPTIONS[code];
  if (options) {
    return localeFromAccept(acceptLanguage, options) ?? options[0] ?? null;
  }
  return COUNTRY_LOCALE[code] ?? null;
}

export function cookieValue(header: string, name: string): string | null {
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1].trim());
  } catch {
    return match[1].trim();
  }
}

export function localeFromCookie(header: string | null | undefined): DetectedLocale | null {
  if (!header) return null;
  const picked = cookieValue(header, LOCALE_PICKED_COOKIE);
  if (picked !== "1") return null;
  return detectedLocale(cookieValue(header, LOCALE_COOKIE));
}

export function resolveLocale(input: {
  chosen?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
  crawler?: boolean;
}): DetectedLocale {
  const chosen = detectedLocale(input.chosen);
  if (chosen) return chosen;
  if (input.crawler) return "en";
  return (
    localeFromCountry(input.country, input.acceptLanguage) ??
    localeFromAccept(input.acceptLanguage) ??
    "en"
  );
}
