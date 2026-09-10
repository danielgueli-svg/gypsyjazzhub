export type Album = {
  slug: string;
  title: string;
  year: number;
  billed: string;
  artists: string[];
  note?: string;
};

export type NewsItem = {
  slug: string;
  date: string;
  title: string;
  body: string;
  kind: "album" | "scene";
  artistSlugs: string[];
  albumSlug?: string;
  href?: string;
  hrefLabel?: string;
  image?: string;
  youtubeUrl?: string;
};

const SPOTIFY_ARTIST: Record<string, string> = {
  "django-reinhardt": "5Z1XZyEFY0dewG8faEIiEx",
  "stephane-grappelli": "6AfbDYupHV5e6nse9W6tKG",
  "schnuckenack-reinhardt": "30W0jMVgGD9HjZryfNwUvh",
  "hansche-weiss": "59vmng4vlCEQIzXJTpE5bP",
  "titi-winterstein": "0HBZy1ZSzStfSfj1EdeJBN",
  "bamboula-ferret": "2vwe4EPfeQNqSaBbw4nzGv",
  "tchan-tchou-vidal": "3p0pyIg0BCyTXdrKueDeA5",
  "fapy-lafertin": "1dDfpFKmIJWoL6GbeEIXns",
  "stochelo-rosenberg": "4pTgWOAUPDXSB5c5xwHVM5",
  "rosenberg-trio": "4xIooHvSmj2aWhQGrniJSu",
  "tcha-limberger": "2dvhmoYT5Jd0DWxKyi3VuE",
  "paulus-schafer": "0IS1jQRwken3sKnUxHVGdv",
  "basily-gipsy-band": "2GkixG1AJcjMKprYHudm5F",
  "basily-boys": "5F4TIUDHpU6G9j3p91MvfB",
  "tata-mirando": "5o5Kejacmh3Y2xTNxsUKTv",
  "tata-mirando-orkest": "5o5Kejacmh3Y2xTNxsUKTv",
  "joscho-stephan": "03gMsWBnlCYwx7ivVnO0WG",
  "bireli-lagrene": "0G3ug1mpFw0I50kvAIxNhS",
  "dario-napoli": "3UXYR7TKo9LLZypFxwOAKd",
  "fanou-torracinta": "0Yo2W6yJSwbZydJ0f6xNER",
  "lajos-boross": "7HjhUUrJ74441HkT6afggW",
  "georges-boulanger": "4aoJFmFXwZgfrJLZ9ZcitL",
  "veres-lajos": "3sdxbQnEwT1UVdiIBlU8Vy",
};

export function spotifySearch(q: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(q)}`;
}

export function itunesSearch(q: string) {
  return `https://music.apple.com/us/search?term=${encodeURIComponent(q)}`;
}

export function artistSpotify(slug: string, name: string) {
  const id = SPOTIFY_ARTIST[slug];
  return id ? `https://open.spotify.com/artist/${id}` : spotifySearch(name);
}

export function artistItunes(name: string, appleId?: string) {
  return appleId
    ? `https://music.apple.com/us/artist/${appleId}`
    : itunesSearch(name);
}

export const ALBUMS: Album[] = [
  {
    slug: "fanou-gipsy-guitar-vol-2",
    title: "Gipsy Guitar From Corsica, Vol. 2",
    year: 2023,
    billed: "Fanou Torracinta",
    artists: ["fanou-torracinta", "benji-winterstein", "william-brunard", "bastien-brison"],
    note: "Corsica and manouche. Benji Winterstein, William Brunard, Bastien Brison.",
  },
  {
    slug: "fanou-gipsy-guitar-vol-1",
    title: "Gipsy Guitar From Corsica, Vol. 1",
    year: 2021,
    billed: "Fanou Torracinta",
    artists: ["fanou-torracinta", "benji-winterstein", "william-brunard", "bastien-brison"],
    note: "Fanou’s first record under his name — original writing, Paris quartet.",
  },
  {
    slug: "olli-soikkeli-comeback",
    title: "Comeback",
    year: 2026,
    billed: "Olli Soikkeli",
    artists: [
      "olli-soikkeli",
      "stochelo-rosenberg",
      "paulus-schafer",
      "matheus-nicolaiewsky",
    ],
    note: "Gypsy-jazz roots record with Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg and Matheus Nicolaiewsky.",
  },
  {
    slug: "dario-napoli-sicilian-blood",
    title: "Sicilian Blood",
    year: 2026,
    billed: "Dario Napoli",
    artists: ["dario-napoli", "benji-winterstein", "tonino-de-sensi"],
    note: "Seventh album from Napoli. Title track out first; the trio with Benji Winterstein on rhythm.",
  },
  {
    slug: "joscho-stephan-four-of-a-kind",
    title: "Four Of A Kind",
    year: 2023,
    billed: "Joscho Stephan",
    artists: ["joscho-stephan"],
  },
  {
    slug: "joscho-stephan-highwire",
    title: "Highwire",
    year: 2025,
    billed: "Joscho Stephan",
    artists: ["joscho-stephan"],
  },
  {
    slug: "joscho-stephan-playlist",
    title: "Playlist",
    year: 2025,
    billed: "Joscho Stephan Trio",
    artists: ["joscho-stephan"],
    note: "Best-of from the trio’s YouTube book, opened with California Dreamin’.",
  },
  {
    slug: "stochelo-django-celebration-01",
    title: "Django Celebration #01",
    year: 2025,
    billed: "Stochelo Rosenberg",
    artists: ["stochelo-rosenberg", "mozes-rosenberg", "paulus-schafer"],
  },
  {
    slug: "stochelo-gypsy-today",
    title: "Gypsy Today",
    year: 2025,
    billed: "Stochelo Rosenberg",
    artists: ["stochelo-rosenberg", "rocky-gresset"],
  },
  {
    slug: "bireli-plays-loulou-gaste",
    title: "Biréli Lagrène Plays Loulou Gasté",
    year: 2024,
    billed: "Biréli Lagrène",
    artists: ["bireli-lagrene"],
    note: "French composer Loulou Gasté, including Feelings (Pour Toi).",
  },
  {
    slug: "bireli-elegant-people",
    title: "Elegant People",
    year: 2024,
    billed: "Biréli Lagrène",
    artists: ["bireli-lagrene"],
  },
  {
    slug: "adrien-moignard-miroirs",
    title: "Miroirs",
    year: 2026,
    billed: "Adrien Moignard",
    artists: ["adrien-moignard", "benji-winterstein", "julien-cattiaux"],
    note: "Label Ouest. Gipsy 4tet with Benji Winterstein, Julien Cattiaux and Fabricio Nicolas-Garcia. Album guests on the record: Baptiste Herbin, Anne Sila. Album night 11 September 2026 at Sunset, Paris.",
  },
  {
    slug: "angelo-adrien-new-viaggio",
    title: "New Viaggio",
    year: 2025,
    billed: "Angelo Debarre & Adrien Moignard",
    artists: ["angelo-debarre", "adrien-moignard"],
  },
  {
    slug: "paulus-tribute-king-tico",
    title: "Tribute to King Tico",
    year: 2023,
    billed: "Paulus Schäfer",
    artists: ["paulus-schafer"],
  },
  {
    slug: "dario-napoli-gypsy-nights",
    title: "Gypsy Nights",
    year: 2022,
    billed: "Dario Napoli",
    artists: ["dario-napoli", "benji-winterstein"],
  },
  {
    slug: "dario-napoli-bella-vita",
    title: "Bella Vita",
    year: 2020,
    billed: "Dario Napoli",
    artists: ["dario-napoli"],
  },
  {
    slug: "stochelo-gypsy-n-able",
    title: "Gypsy ’n Able",
    year: 2005,
    billed: "Stochelo Rosenberg",
    artists: ["stochelo-rosenberg"],
  },
  {
    slug: "rosenberg-trio-impressions",
    title: "Impressions",
    year: 2006,
    billed: "Rosenberg Trio",
    artists: ["stochelo-rosenberg", "mozes-rosenberg", "nousche-rosenberg"],
  },
  {
    slug: "rosenberg-trio-gipsy-summer",
    title: "Gipsy Summer",
    year: 1996,
    billed: "Rosenberg Trio",
    artists: ["stochelo-rosenberg", "mozes-rosenberg"],
  },
  {
    slug: "jimmy-rosenberg-sinti",
    title: "Sinti",
    year: 1996,
    billed: "Jimmy Rosenberg",
    artists: ["jimmy-rosenberg"],
  },
  {
    slug: "fapy-lafertin-fleur-de-lavender",
    title: "Fleur de Lavender",
    year: 1996,
    billed: "Fapy Lafertin",
    artists: ["fapy-lafertin"],
  },
  {
    slug: "tchavolo-schmitt-alors",
    title: "Alors?… Voilà!",
    year: 2003,
    billed: "Tchavolo Schmitt",
    artists: ["tchavolo-schmitt"],
  },
  {
    slug: "dorado-schmitt-live",
    title: "Live",
    year: 2004,
    billed: "Dorado Schmitt",
    artists: ["dorado-schmitt", "samson-schmitt", "amati-schmitt"],
  },
  {
    slug: "angelo-debarre-entre-amis",
    title: "Entre Amis",
    year: 2007,
    billed: "Angelo Debarre",
    artists: ["angelo-debarre"],
  },
  {
    slug: "romane-swing-for-ninine",
    title: "Swing for Ninine",
    year: 1998,
    billed: "Romane",
    artists: ["romane", "ninine-garcia"],
  },
  {
    slug: "wrembel-django-limpressionniste",
    title: "Django l’impressionniste",
    year: 2019,
    billed: "Stéphane Wrembel",
    artists: ["stephane-wrembel"],
  },
  {
    slug: "gonzalo-bergara-por-el-fuego",
    title: "Por el Fuego",
    year: 2011,
    billed: "Gonzalo Bergara",
    artists: ["gonzalo-bergara"],
  },
  {
    slug: "tim-kliphuis-the-grappelli-album",
    title: "The Grappelli Album",
    year: 2013,
    billed: "Tim Kliphuis",
    artists: ["tim-kliphuis"],
  },
  {
    slug: "lulo-reinhardt-lulo",
    title: "Lulo Reinhardt",
    year: 2014,
    billed: "Lulo Reinhardt",
    artists: ["lulo-reinhardt"],
  },
  {
    slug: "wawau-adler-manouche-swing",
    title: "Manouche Swing",
    year: 2010,
    billed: "Wawau Adler",
    artists: ["wawau-adler"],
  },
  {
    slug: "andreas-oberg-live",
    title: "Live",
    year: 2013,
    billed: "Andreas Öberg",
    artists: ["andreas-oberg"],
  },
  {
    slug: "costel-nitescu-gypsy-jazz-violin",
    title: "Gypsy Jazz Violin",
    year: 2012,
    billed: "Costel Nitescu",
    artists: ["costel-nitescu"],
  },
  {
    slug: "django-nuages",
    title: "Nuages",
    year: 1940,
    billed: "Django Reinhardt & Stéphane Grappelli",
    artists: ["django-reinhardt", "stephane-grappelli"],
    note: "The Quintette language. The record that still teaches the style.",
  },
  {
    slug: "django-djangology",
    title: "Djangology",
    year: 1949,
    billed: "Django Reinhardt",
    artists: ["django-reinhardt", "stephane-grappelli"],
  },
  {
    slug: "grappelli-plays",
    title: "Stéphane Grappelli Plays",
    year: 1973,
    billed: "Stéphane Grappelli",
    artists: ["stephane-grappelli"],
  },
  {
    slug: "denis-chang-gypsy-jazz",
    title: "Gypsy Jazz",
    year: 2016,
    billed: "Denis Chang",
    artists: ["denis-chang"],
  },
  {
    slug: "christiaan-van-hemert-rosenberg",
    title: "With the Rosenberg Trio",
    year: 2018,
    billed: "Christiaan van Hemert",
    artists: ["christiaan-van-hemert", "stochelo-rosenberg", "mozes-rosenberg"],
  },
  {
    slug: "tata-mirando-zigeuner-romance",
    title: "Zigeuner romance",
    year: 1977,
    billed: "Tata Mirando en zijn Zigeunerorkest",
    artists: ["tata-mirando"],
    note: "Family gypsy orchestra — Hungarian and Romanian chairs, Dutch Sinti house.",
  },
  {
    slug: "tata-mirando-sinto-gilias",
    title: "Sinto Gilia's",
    year: 1980,
    billed: "Tata Mirando en zijn Zigeunerorkest",
    artists: ["tata-mirando"],
  },
  {
    slug: "tata-mirando-orkest-1994",
    title: "Tata Mirando en zijn zigeunerorkest",
    year: 1994,
    billed: "Tata Mirando en zijn Zigeunerorkest",
    artists: ["tata-mirando"],
  },
  {
    slug: "tata-mirando-gipsy-festival",
    title: "Gipsy Festival",
    year: 2001,
    billed: "Tata Mirando and His Gipsy Orchestra",
    artists: ["tata-mirando"],
  },
  {
    slug: "tata-mirando-dadesko-wazst",
    title: "Dadesko Wazst",
    year: 2004,
    billed: "Royal Gipsy Orchestra Tata Mirando & Nello Mirando",
    artists: ["tata-mirando"],
    note: "Live in Amsterdam, with Nello Mirando and the Hungarian Gypsy Ensemble.",
  },
  {
    slug: "veres-lajos-gipsy-souvenirs",
    title: "Gipsy Souvenirs",
    year: 1953,
    billed: "Veres Lajos et son orchestre",
    artists: ["veres-lajos"],
    note: "Hungarian, Romanian and Russian gypsy melodies. Philips / later BnF Collection 2014 (World Europe). Spotify: Veres Lajos et son orchestre.",
  },
];

export const NEWS: NewsItem[] = [
  {
    slug: "la-pompe-live-app",
    date: "2026-09-10",
    title: "Christiaan van Hemert released La Pompe",
    body: "The Dutch violinist and teacher released La Pompe Live in August 2026 — charts, setlists and the pompe in your pocket. iPhone and Android. Beginner guide on YouTube from 10 August.",
    kind: "scene",
    artistSlugs: ["christiaan-van-hemert"],
    href: "/learn/apps",
    hrefLabel: "news.openApps",
    youtubeUrl: "https://www.youtube.com/watch?v=RYLanvfhm3I",
    image: "/artists/christiaan-van-hemert.jpg",
  },
  {
    slug: "moignard-miroirs-sunset",
    date: "2026-09-09",
    title: "Adrien Moignard Quartet + guests — Miroirs at Sunset, 11 September",
    body: "Friday 11 September 2026, 20:30, Sunset in Paris, for the album Miroirs (Label Ouest). Adrien Moignard Quartet + guests — Benji Winterstein and Julien Cattiaux on rhythm, Fabricio Nicolas-Garcia on bass. Tickets from Sunset-Sunside.",
    kind: "scene",
    artistSlugs: ["adrien-moignard", "benji-winterstein", "julien-cattiaux"],
    albumSlug: "adrien-moignard-miroirs",
    href: "https://billetterie.sunset-sunside.com/event/777395-adrien-moignard-quartet?eventDate=2964111",
    hrefLabel: "Tickets",
    image: "/guitar-wood.jpg",
  },
  {
    slug: "midwest-django-fest-2026",
    date: "2026-09-08",
    title: "Midwest Django Fest — Madison this weekend",
    body: "11–12 September at William G. Lunney Lake Farm County Park, Madison. Gonzalo Bergara Trio, Dario Napoli Trio, Alfonso Ponticelli, Hot Club of Baltimore, Harmonious Wail. Campfire djam both nights. Schedule: midwestdjangofestival.com.",
    kind: "scene",
    artistSlugs: ["gonzalo-bergara", "dario-napoli", "alfonso-ponticelli"],
    href: "https://midwestdjangofestival.com/schedule/",
    hrefLabel: "Schedule",
    image: "/samois-jam.jpg",
  },
  {
    slug: "shrewsbury-django-fest-2026",
    date: "2026-09-08",
    title: "Shrewsbury Django Fest 2026 line-up is up",
    body: "23–25 October in Shrewsbury. Friday: John Wheatcroft Trio featuring Olivia Frances Brown, then the Mozes Rosenberg Trio with Christiaan van Hemert. Saturday: Marion & Sobo Band, then Paulus Schäfer and Olli Soikkeli. Sunday: the Gypsy Jazz Retreat concert, Marion & Sobo again, and the all-star jam. Free daytime DJams Saturday and Sunday at Glou Glou, The Bull Inn and The Nags Head. Tickets from shrewsburydjangofest.co.uk.",
    kind: "scene",
    artistSlugs: [
      "mozes-rosenberg",
      "christiaan-van-hemert",
      "paulus-schafer",
      "olli-soikkeli",
      "john-wheatcroft",
      "chris-quinn",
    ],
    href: "https://www.shrewsburydjangofest.co.uk/django-fest-line-up",
    hrefLabel: "Line-up",
    image: "/festival-django.jpg",
  },
  {
    slug: "weekly-scan-2026-08-23",
    date: "2026-09-07",
    title: "This week on the globe — Paris, Madison, Chicago, Langley",
    body: "Tonight and Friday: Olli Soikkeli with the Finnish Air Force Big Band (Kuopio, Tampere). Friday in Paris: Adrien Moignard’s Miroirs at Sunset. Weekend: Midwest Django Fest in Madison (Bergara, Napoli, Ponticelli). Next week: DjangoFest Northwest (15–20 Sep, Whidbey Island — Gismo Graf, Gonzalo Bergara, Pearl Django), Chicago Gypsy Jazz Fest from 15 Sep (SPACE, Green Mill), Django In London 17–19 Sep. Rosenberg brothers in Viljandi, 9 October.",
    kind: "scene",
    artistSlugs: [
      "olli-soikkeli",
      "adrien-moignard",
      "hugo-guezbar",
      "angelo-debarre",
      "dario-napoli",
      "stephane-wrembel",
      "gismo-graf",
      "stochelo-rosenberg",
      "mozes-rosenberg",
      "alfonso-ponticelli",
    ],
    image: "/samois-jam.jpg",
  },
  {
    slug: "pgc-steven-reinhardt",
    date: "2026-09-06",
    title: "Paris Guitar Connection sits with Steven Reinhardt",
    body: "The Paris podcast — six guitarists, two sofas — put Saint-Ouen’s Steven Reinhardt on the couch. Gypsy Jazz with a Gypsy: family time, the pompe, Swing Lâg shop guitars, then Blues en mineur and What Is This Thing Called Love. PGC is not a weekly jam. The public jam is still La Chope des Puces, weekends on rue des Rosiers. The hosts are Aurélien Robert, Guillaume Muschalle, François Thouvenot, Ghali Hadefi, Nicolas Lestoquoy and Yoann Kempst. Ghali’s pompe shorts are the ones players send each other. Watch the episode on the channel.",
    kind: "scene",
    artistSlugs: ["steven-reinhardt"],
    href: "https://www.youtube.com/watch?v=4cK5mZdbNqM",
    hrefLabel: "news.watchPodcast",
    youtubeUrl: "https://www.youtube.com/watch?v=4cK5mZdbNqM",
    image: "/guitar-wood.jpg",
  },
  {
    slug: "djangofest-northwest-2026",
    date: "2026-09-03",
    title: "DjangoFest Northwest — Gismo Graf, Pearl Django, Bergara",
    body: "26th year at WICA, Langley, 15–20 September 2026. Six days: 3 Parts Bourbon, Pearl Django, Eric Vanderbilt-Mathews, John Jorgenson Trio, Gonzalo Bergara Quintet, Gismo Graf Quintet, then the Nick Lehr Memorial djam. Free second-stage sets. BroadwayWorld posted the bill 3 September.",
    kind: "scene",
    artistSlugs: ["gismo-graf", "gonzalo-bergara", "john-jorgenson"],
    href: "https://www.broadwayworld.com/seattle/article/Gismo-Graf-Quintet-Pearl-Django-More-Set-for-DjangoFest-Northwest-20260903",
    hrefLabel: "Line-up",
    image: "/festival-django.jpg",
  },
  {
    slug: "africa-manouche-2026",
    date: "2026-09-03",
    title: "Africa — Gypsy Jazz is rare; South Africa holds the chairs",
    body: "Dedicated Gypsy Jazz open jams are essentially nonexistent across Africa. The style stays niche and European. South Africa has the only standing scene: Hot Club d’Afrique in Johannesburg (all-acoustic, founded 2008), Hot Club of Cape Town, Tarabu in the Winelands, and Manouche in Cape Town — performance groups for venues, festivals and hire, not open jams. Morocco has seen occasional Django homage concerts (Royal Symphony Orchestra Jazz Band, Casablanca and Rabat, 2024). Egypt, Senegal, Nigeria, Kenya, Ghana and Ethiopia have no posted Manouche jam. General jazz jams in Cape Town, Johannesburg, Cairo and Dakar are not Hot Club nights.",
    kind: "scene",
    artistSlugs: [],
    image: "/guitar-wood.jpg",
  },
  {
    slug: "latin-america-manouche-2026",
    date: "2026-09-04",
    title: "South & Central America — jams and festivals on the globe",
    body: "Buenos Aires: Swing Medical’s monthly jam at Bar de Fondo (Julián Álvarez 1200). Argentina Django Festival returns each May. Curitiba: Festival Manouche, 20–25 October 2026. Brasília Gypsy Jazz Club, Piracicaba, Hot Club Medellín, Hot Club de San Miguel, Festival Django CL in Santiago. Uruguay has no standing jam posted.",
    kind: "scene",
    artistSlugs: [
      "lucas-reydo",
      "roque-monsalve",
      "lucas-miranda",
      "ludovik-dorkis",
      "victor-angeleas",
      "carlos-caceres",
      "antonio-lozoya",
    ],
    image: "/guitar-wood.jpg",
  },
  {
    slug: "hot-club-de-tms",
    date: "2026-09-05",
    title: "Hot Club de TMS — first Saturday in Utrecht",
    body: "Jazz Manouche at The Music Space XL, Australiëlaan 24. First Saturday of the month, 19:00–23:00. First night 5 September 2026: Chris’ Collective opens. WhatsApp community on the jam page.",
    kind: "scene",
    artistSlugs: [],
    image: "/samois-jam.jpg",
  },
  {
    slug: "denis-chang-japan-tour",
    date: "2026-09-05",
    title: "Denis Chang — first leader mini-tour in Japan",
    body: "October 2026: Tokyo 8th (u-ma Kagurazaka), Osaka 9th (Piano Bar Kiyomi), then Setouchi Django Street in Yashima, Kagawa, 10–11. Reilly Farrell on violin, Alison Zhen on rhythm, Hanaoka Toshio on bass. Live and session both club nights, 19:30.",
    kind: "scene",
    artistSlugs: ["denis-chang", "reilly-farrell", "alison-zhen", "hanaoka-toshio"],
    image: "/artists/denis-chang.jpg",
  },
  {
    slug: "django-portugal-camp-2027",
    date: "2026-09-04",
    title: "Django Portugal Camp — Vila Viçosa, 28 April–2 May 2027",
    body: "Nuno Marinho and Marian Yanchyk’s gypsy jazz camp in the Alentejo. Rhythm in the morning, soloing after lunch, jams after dinner. Festival Django Portugal is the touring sister.",
    kind: "scene",
    artistSlugs: ["nuno-marinho", "marian-yanchyk"],
    image: "/festival-django.jpg",
  },
  {
    slug: "hot-club-insulinde",
    date: "2026-09-10",
    title: "Hot Club Insulinde — second Wednesday in Amsterdam",
    body: "Acoustic gypsy jazz jam at Café Insulinde, Sumatrastraat 24 (Insulindeweg). Second Wednesday of the month from 19:00. Open to all. Next: 14 October 2026.",
    kind: "scene",
    artistSlugs: [],
    image: "/guitar-wood.jpg",
  },
  {
    slug: "hub-opens",
    date: "2026-09-01",
    title: "Gypsy Jazz Hub is open",
    body: "A worldwide circle for the music: jams, concerts, groups, camps, luthiers, and the pages of the players. Join and put a date on the calendar.",
    kind: "scene",
    artistSlugs: ["daniel-gueli"],
    image: "/artists/daniel-gueli.jpg",
  },
  {
    slug: "gypsy-jazz-band-klebelsberg",
    date: "2026-08-30",
    title: "Gypsy Jazz Band — Klebelsberg Kultúrkúria, 30 August",
    body: "Budapest, Sunday 30 August 2026, 19:30. Róbert Kárpáti’s Gypsy Jazz Band with Roby Lakatos, guests Charlie Horváth and Csondor Kata. Templom utca 2–10. For chairs to sit in, Manuska posts Django jams in Gypsy Jazz Jams Budapest — not a fixed weekly night.",
    kind: "scene",
    artistSlugs: ["robert-karpati", "roby-lakatos"],
    image: "/festival-django.jpg",
  },
  {
    slug: "fanou-vol-2-out",
    date: "2023-05-31",
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "The Corsican guitarist’s second album with Benji Winterstein, William Brunard and Bastien Brison. One of the main current French groups. Listen on Spotify and iTunes.",
    kind: "album",
    artistSlugs: ["fanou-torracinta", "benji-winterstein", "william-brunard", "bastien-brison"],
    albumSlug: "fanou-gipsy-guitar-vol-2",
  },
  {
    slug: "olli-soikkeli-comeback-out",
    date: "2026-07-07",
    title: "Olli Soikkeli’s Comeback is out",
    body: "The Finnish guitarist’s new record returns to gypsy jazz. Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg and Matheus Nicolaiewsky are on it. Listen on Spotify and iTunes.",
    kind: "album",
    artistSlugs: ["olli-soikkeli", "stochelo-rosenberg", "paulus-schafer", "matheus-nicolaiewsky"],
    albumSlug: "olli-soikkeli-comeback",
  },
  {
    slug: "dario-napoli-sicilian-blood",
    date: "2026-05-01",
    title: "Dario Napoli: Sicilian Blood",
    body: "Napoli’s seventh album. The title track came first; the full record is on the platforms now. Benji Winterstein holds rhythm.",
    kind: "album",
    artistSlugs: ["dario-napoli", "benji-winterstein"],
    albumSlug: "dario-napoli-sicilian-blood",
  },
  {
    slug: "stochelo-django-celebration",
    date: "2025-09-17",
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "A new Django book from Helmond. Stochelo’s Celebration series is on Spotify; the live Django Celebration nights keep touring.",
    kind: "album",
    artistSlugs: ["stochelo-rosenberg"],
    albumSlug: "stochelo-django-celebration-01",
  },
  {
    slug: "joscho-playlist",
    date: "2025-05-09",
    title: "Joscho Stephan Trio: Playlist",
    body: "The German trio’s YouTube book, on record. California Dreamin’ opens it. Highwire followed the same year.",
    kind: "album",
    artistSlugs: ["joscho-stephan"],
    albumSlug: "joscho-stephan-playlist",
  },
  {
    slug: "joscho-highwire",
    date: "2025-03-07",
    title: "Joscho Stephan: Highwire",
    body: "Joscho Stephan with Cornelius Claudio Kreusch — the 2025 guitar record. Listen on Spotify and iTunes.",
    kind: "album",
    artistSlugs: ["joscho-stephan"],
    albumSlug: "joscho-stephan-highwire",
  },
  {
    slug: "joscho-four-of-a-kind",
    date: "2023-02-01",
    title: "Joscho Stephan Trio: Four Of A Kind",
    body: "The German trio’s album with Costel Nitescu — thirteen pieces, recorded in a day and a half.",
    kind: "album",
    artistSlugs: ["joscho-stephan"],
    albumSlug: "joscho-stephan-four-of-a-kind",
  },
  {
    slug: "bireli-loulou-gaste",
    date: "2024-06-01",
    title: "Biréli Lagrène plays Loulou Gasté",
    body: "Lagrène reads the French songwriter who wrote Feelings. A guitar record that is still gypsy jazz in the left hand.",
    kind: "album",
    artistSlugs: ["bireli-lagrene"],
    albumSlug: "bireli-plays-loulou-gaste",
  },
  {
    slug: "angelo-adrien-viaggio",
    date: "2025-02-01",
    title: "Angelo Debarre and Adrien Moignard: New Viaggio",
    body: "Two French lead guitars on one date. Debarre’s sound, Moignard’s fire.",
    kind: "album",
    artistSlugs: ["angelo-debarre", "adrien-moignard"],
    albumSlug: "angelo-adrien-new-viaggio",
  },
];

export function albumsForArtist(slug: string) {
  return ALBUMS.filter((album) => album.artists.includes(slug)).sort((a, b) => b.year - a.year);
}

export function latestAlbums(limit = 8) {
  return [...ALBUMS].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)).slice(0, limit);
}

const PINNED_NEWS = [
  "la-pompe-live-app",
  "moignard-miroirs-sunset",
  "midwest-django-fest-2026",
  "djangofest-northwest-2026",
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
  "bireli-lagrene",
  "christiaan-van-hemert",
  "christine-tassan",
  "cyrille-aimee",
  "daniel-gueli",
  "dario-napoli",
  "denis-chang",
  "django-reinhardt",
  "fapy-lafertin",
  "florin-niculescu",
  "gismo-graf",
  "gonzalo-bergara",
  "jimmy-rosenberg",
  "joscho-stephan",
  "marcia-bamberg",
  "marion-lenfant-preus",
  "mozes-rosenberg",
  "nuno-marinho",
  "olli-soikkeli",
  "paul-mehling",
  "paulus-schafer",
  "remi-harris",
  "robin-nolan",
  "stephane-grappelli",
  "stephane-wrembel",
  "stochelo-rosenberg",
  "tchavolo-schmitt",
  "tim-kliphuis",
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
