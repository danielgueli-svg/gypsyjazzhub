export type SourceKind =
  | "artist_site"
  | "venue"
  | "festival_official"
  | "press"
  | "listing"
  | "facebook_group"
  | "djangobooks";

export type ScanSource = {
  kind: SourceKind;
  url: string;
  label: string;
};

export type ScanFind = {
  title: string;
  artistName: string;
  artistSlug: string;
  venue: string;
  city: string;
  country: string;
  startsAt: string;
  festivalSlug?: string;
  eventKind?: "concert" | "jam" | "festival";
  sources: ScanSource[];
};

export type ScanVenue = {
  name: string;
  city: string;
  country: string;
  kind: string;
  site: string;
  contact?: string;
  booker?: string;
  bio: string;
  scene: "gypsy" | "jazz" | "world";
  sources: ScanSource[];
};

/** Official festival sites we already trust — one confirmation is enough. */
export const TRUSTED_FESTIVAL_SLUGS = new Set([
  "festival-django-reinhardt",
  "django-liberchies",
  "djangofollies",

  "gypsy-festival-tilburg",
  "djangofest-northwest",
  "django-in-june",
  "django-a-gogo",
  "london-gypsy-jazz-festival",
  "festival-django-portugal",
  "festival-django-lh",
  "festival-django-lh",
  "villamajazz",
  "festival-jazz-manouche-almada",
  "festival-jazz-manouche-forbach",
  "ozmanouche",
  "birdland-django-festival",
  "gipsy-festival-angers",
  "django-amsterdam",
  "midwest-gypsy-swing-fest",
  "django-in-london",
  "asheville-djangofest",
  "djangofest-mill-valley",
  "viljandi-guitar-festival",
  "taipei-gypsy-jazz-festival",
  "charm-city-django",
  "copenhagen-django",
  "djangofestivalen-oslo",
  "festival-jazz-manouche-piracicaba",
  "festival-manouche-curitiba",
  "festival-django-argentina",
  "festival-django-cl",
]);

export const SCAN_SOURCES = [
  { name: "Festival Django Reinhardt", url: "https://www.festivaldjangoreinhardt.com/" },
  { name: "Django Liberchies", url: "https://www.djangoliberchies.be/" },
  { name: "Djangofollies", url: "https://www.djangofollies.be/" },
  { name: "International Gipsyfestival", url: "https://www.gipsyfestival.nl/" },
  { name: "Djangofest Northwest", url: "https://www.djangofest.com/" },
  { name: "Sintimusic", url: "https://www.sintimusic.nl/" },
  { name: "TSF Jazz agenda", url: "https://www.tsfjazz.com/" },
  { name: "Bimhuis", url: "https://www.bimhuis.nl/" },
  { name: "New Morning", url: "https://www.newmorning.com/" },
  { name: "Swing Medical jam", url: "https://swingmedicaljam.com/" },
  { name: "Festival Manouche Curitiba", url: "https://www.instagram.com/festivalmanouchecuritiba/" },
  { name: "Festival Django Argentina", url: "https://www.instagram.com/argentinadjangofestival/" },
  { name: "Festival Jazz Manouche Piracicaba", url: "https://festivaljazzmanouche.com.br/" },
  { name: "Festival Django CL", url: "https://gam.cl/es/que-hacer-en-gam/musica-popular/festival-django/" },
  { name: "Django Festival Colombia", url: "https://www.instagram.com/djangofestival/" },
  { name: "Gypsy Jazz SP", url: "https://www.instagram.com/gypsyjazzsp/" },
  { name: "Hot Club de San Miguel", url: "https://www.sanmigueljazz.com.mx/" },
];

export function discoveryKey(find: Pick<ScanFind, "title" | "startsAt" | "venue">) {
  const day = find.startsAt.slice(0, 10);
  return `${find.title}|${day}|${find.venue}`.toLowerCase().replace(/\s+/g, " ").trim();
}

export function venueDiscoveryKey(venue: Pick<ScanVenue, "name" | "city" | "country">) {
  return `venue|${venue.name}|${venue.city}|${venue.country}`
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function isTrustedFestival(slug?: string) {
  return Boolean(slug && TRUSTED_FESTIVAL_SLUGS.has(slug));
}

/**
 * Auto-publish only with two independent confirmations:
 * artist website + venue (or artist + official festival page).
 * Trusted big festivals: the official festival site alone is enough.
 */
export function scanVerdict(find: ScanFind): {
  status: "publish" | "hold";
  reason: string;
} {
  const kinds = new Set(find.sources.map((source) => source.kind));
  const urls = new Set(find.sources.map((source) => source.url.trim()).filter(Boolean));
  if (urls.size < 1) {
    return { status: "hold", reason: "No source URL." };
  }
  if (isTrustedFestival(find.festivalSlug) && kinds.has("festival_official")) {
    return {
      status: "publish",
      reason: "Trusted festival — official site is enough.",
    };
  }
  const artistAndVenue = kinds.has("artist_site") && kinds.has("venue") && urls.size >= 2;
  const artistAndFestival =
    kinds.has("artist_site") && kinds.has("festival_official") && urls.size >= 2;
  if (artistAndVenue || artistAndFestival) {
    return {
      status: "publish",
      reason: "Two confirmations: artist site and venue / festival.",
    };
  }
  const facebook = find.sources.find(
    (source) => source.kind === "facebook_group" && /facebook\.com/i.test(source.url),
  );
  if (
    facebook &&
    find.title.trim() &&
    find.artistName.trim() &&
    find.venue.trim() &&
    find.country.trim() &&
    find.startsAt
  ) {
    return {
      status: "publish",
      reason: `Facebook group announcement — ${facebook.label}. Date, venue and artist are on the post.`,
    };
  }
  const forum = find.sources.find(
    (source) => source.kind === "djangobooks" && /djangobooks\.com/i.test(source.url),
  );
  if (
    forum &&
    find.title.trim() &&
    (find.venue.trim() || find.city.trim()) &&
    find.country.trim() &&
    find.startsAt
  ) {
    return {
      status: "publish",
      reason: `DjangoBooks thread — ${forum.label}. Date, venue and place are on the post.`,
    };
  }
  return {
    status: "hold",
    reason:
      "Needs two confirmations (artist website and venue). One source is not enough, except a trusted festival official site, a complete Facebook group post, or a complete DjangoBooks thread.",
  };
}

/**
 * Auto-add a venue with official website + a second listing
 * (artist site, festival bill, jazz guide). Site alone is held.
 */
export function venueVerdict(venue: ScanVenue): {
  status: "publish" | "hold";
  reason: string;
} {
  const site = venue.site.trim();
  const urls = new Set(
    [site, ...venue.sources.map((source) => source.url.trim())].filter(Boolean),
  );
  if (!site) {
    return { status: "hold", reason: "Need the venue’s own website." };
  }
  const extras = venue.sources.filter((source) => source.url.trim() && source.url.trim() !== site);
  if (extras.length >= 1 && urls.size >= 2) {
    return {
      status: "publish",
      reason: "Official website plus a second listing.",
    };
  }
  return {
    status: "hold",
    reason: "Need a second listing besides the venue’s own site (artist, festival, or guide).",
  };
}
