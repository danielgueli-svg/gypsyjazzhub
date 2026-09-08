import type { ScanFind } from "@/lib/discovery";

export type FacebookGroup = {
  slug: string;
  name: string;
  url: string;
  /** Atlas country name. Empty = worldwide. */
  country?: string;
};

/** Public gypsy jazz Facebook groups the weekly import watches. */
export const FACEBOOK_GROUPS: FacebookGroup[] = [
  {
    slug: "gypsyjazzguitar",
    name: "GYPSYJAZZGUITAR",
    url: "https://www.facebook.com/groups/116001620450/",
  },
  {
    slug: "gypsy-jazz",
    name: "Gypsy Jazz",
    url: "https://www.facebook.com/groups/270897353017162/",
  },
  {
    slug: "gypsyjazz",
    name: "Gypsyjazz",
    url: "https://www.facebook.com/groups/gypsyjazz/",
  },
  {
    slug: "gypsy-jazz-society",
    name: "Gypsy Jazz Society",
    url: "https://www.facebook.com/groups/gypsyjazzsociety/",
  },
  {
    slug: "announce-concerts",
    name: "Announce your Gypsy Jazz Concert, Fest, Jam or Workshop",
    url: "https://www.facebook.com/groups/458090860914272/",
  },
  {
    slug: "gypsy-jazz-jam-alert",
    name: "Gypsy Jazz Jam Alert",
    url: "https://www.facebook.com/groups/359232930814598/",
  },
  {
    slug: "i-love-manouche-guitar",
    name: "I Love Manouche Guitar",
    url: "https://www.facebook.com/groups/709949199125871/",
  },
  {
    slug: "manouche-guitar-acoustic",
    name: "GUITAR Acoustic, Jazz & Gypsy Jazz Manouche",
    url: "https://www.facebook.com/groups/manouche.guitar/",
  },
  {
    slug: "manouche-folk-jazz",
    name: "Manouche, folk, jazz, flamenco, gipsy style music",
    url: "https://www.facebook.com/groups/360577644042159/",
  },
  {
    slug: "gypsy-jazz-uk",
    name: "Gypsy jazz uk",
    url: "https://www.facebook.com/groups/363471863725904/",
    country: "United Kingdom",
  },
  {
    slug: "gypsy-jazz-north-england",
    name: "Gypsy Jazz in the North of England!",
    url: "https://www.facebook.com/groups/497753073575129/",
    country: "United Kingdom",
  },
  {
    slug: "gypsy-jazz-exeter",
    name: "Gypsy Jazz Sessions Exeter",
    url: "https://www.facebook.com/groups/gypsyjazzexeter/",
    country: "United Kingdom",
  },
  {
    slug: "gypsy-jazz-macclesfield",
    name: "Gypsy Jazz Macclesfield",
    url: "https://www.facebook.com/groups/1441626002675877/",
    country: "United Kingdom",
  },
  {
    slug: "jazz-manouche-paris",
    name: "JAZZ MANOUCHE À PARIS",
    url: "https://www.facebook.com/groups/149176271838405/",
    country: "France",
  },
  {
    slug: "jazz-manouche-belgique",
    name: "Jazz Manouche En Belgique",
    url: "https://www.facebook.com/groups/jazzmanouche/",
    country: "Belgium",
  },
  {
    slug: "gypsy-jazz-deutschland",
    name: "Gypsy Jazz - Deutschland",
    url: "https://www.facebook.com/groups/1462123627388945/",
    country: "Germany",
  },
  {
    slug: "jazz-manouche-suisse",
    name: "JAZZ MANOUCHE — Suisse / Schweiz / Svizzera",
    url: "https://www.facebook.com/groups/1479798168901937/",
    country: "Switzerland",
  },
  {
    slug: "jazz-manouche-italia",
    name: "Jazz Manouche Italia",
    url: "https://www.facebook.com/groups/48328614226/",
    country: "Italy",
  },
  {
    slug: "gypsy-jazz-jams-budapest",
    name: "Gypsy Jazz Jams Budapest",
    url: "https://www.facebook.com/groups/628542240660254/",
    country: "Hungary",
  },
  {
    slug: "jazz-manouche-hungary",
    name: "Jazz Manouche Hungary",
    url: "https://www.facebook.com/groups/526699704058786/",
    country: "Hungary",
  },
  {
    slug: "jazz-manouche-czech",
    name: "Jazz Manouche Czech Republic",
    url: "https://www.facebook.com/groups/467446336607200/",
    country: "Czechia",
  },
  {
    slug: "australian-gypsy-jazz",
    name: "Australian Gypsy Jazz",
    url: "https://www.facebook.com/groups/ozmanouche/",
    country: "Australia",
  },
  {
    slug: "gypsy-jazz-ireland",
    name: "Gypsy Jazz Ireland",
    url: "https://www.facebook.com/groups/gypsyjazzireland/",
    country: "Ireland",
  },
  {
    slug: "gypsy-jazzers-south-wales",
    name: "Gypsy Jazzers Of South Wales",
    url: "https://www.facebook.com/groups/1652019531681084/",
    country: "United Kingdom",
  },
  {
    slug: "gypsy-jazz-new-zealand",
    name: "Gypsy Jazz New Zealand",
    url: "https://www.facebook.com/groups/767151096760479/",
    country: "New Zealand",
  },
  {
    slug: "jazz-manouche-brasil",
    name: "Jazz Manouche no Brasil",
    url: "https://www.facebook.com/groups/117755024959336/",
    country: "Brazil",
  },
  {
    slug: "gypsy-swing-nyc",
    name: "Gypsy Swing NYC",
    url: "https://www.facebook.com/groups/731629976889413/",
    country: "United States of America",
  },
  {
    slug: "the-keep-gypsy-jam",
    name: "Weekly Hot & Gypsy Jazz Jam at The Keep",
    url: "https://www.facebook.com/groups/860099624120921/",
    country: "United States of America",
  },
  {
    slug: "atlanta-gypsy-jazzers",
    name: "Atlanta Gypsy Jazzers",
    url: "https://www.facebook.com/groups/135762209767583/",
    country: "United States of America",
  },
  {
    slug: "baltimore-django-jazz-jam",
    name: "Baltimore Django Jazz Jam",
    url: "https://www.facebook.com/groups/2022554631159901/",
    country: "United States of America",
  },
  {
    slug: "baltimore-django-community",
    name: "Baltimore Django Reinhardt Jazz Community",
    url: "https://www.facebook.com/groups/1484604891757136/",
    country: "United States of America",
  },
  {
    slug: "saratoga-gypsy-jazz",
    name: "Saratoga/Capital Region Gypsy Jazz Community",
    url: "https://www.facebook.com/groups/saratogagypsyjazz/",
    country: "United States of America",
  },
  {
    slug: "louisville-gypsy-jazz",
    name: "Louisville Gypsy Jazz",
    url: "https://www.facebook.com/groups/louisvillegypsyjazz/",
    country: "United States of America",
  },
  {
    slug: "ventura-county-gypsy-jazz",
    name: "Ventura County Gypsy Jazz Jam",
    url: "https://www.facebook.com/groups/176588178695302/",
    country: "United States of America",
  },
  {
    slug: "agnesviertel-live",
    name: "Agnesviertel LIVE Jazz & Blues Session",
    url: "https://www.facebook.com/groups/1826268940989735/",
    country: "Germany",
  },
  {
    slug: "hcdf-nederland",
    name: "Stichting Hot Club de France-Nederland",
    url: "https://www.facebook.com/hcdfnederland/",
    country: "Netherlands",
  },
];

export function facebookGroupsForCountry(country: string) {
  return FACEBOOK_GROUPS.filter((group) => group.country === country);
}

/** Hand-checked Facebook finds. Empty until the import lands a dated post. */
export const FACEBOOK_QUEUE: ScanFind[] = [];

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

export function parseFacebookPost(text: string, group: FacebookGroup, postUrl = ""): ScanFind | null {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length < 40) return null;
  const monthMatch = cleaned.match(
    new RegExp(`\\b(${MONTH_RE})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,)?\\s*(\\d{4})?`, "i"),
  );
  if (!monthMatch) return null;
  const month = MONTHS[monthMatch[1]!.toLowerCase()];
  const day = Number(monthMatch[2]);
  const year = Number(monthMatch[3] || new Date().getUTCFullYear());
  if (month == null || !day || !year) return null;
  const starts = new Date(Date.UTC(year, month, day, 19, 0, 0));
  if (Number.isNaN(starts.getTime()) || starts.getTime() < Date.now() - 86_400_000) return null;

  const at = cleaned.match(/\b(?:at|@|venue[:\s]+)\s*([^,.]{3,60})/i);
  const venue = at?.[1]?.trim() || "";
  if (!venue) return null;

  const title = cleaned.slice(0, 80).replace(/\s+/g, " ").trim();
  return {
    title,
    artistName: title,
    artistSlug: "",
    venue,
    city: "",
    country: group.country ?? "",
    startsAt: starts.toISOString(),
    sources: [{ kind: "facebook_group", url: postUrl || group.url, label: group.name }],
  };
}

export function facebookCredit(find: Pick<ScanFind, "sources">) {
  const fb = find.sources.find((source) => source.kind === "facebook_group");
  if (!fb) return "";
  return `From Facebook · ${fb.label} · ${fb.url}`;
}
