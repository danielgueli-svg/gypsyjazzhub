export type Album = {
  slug: string;
  title: string;
  year: number;
  billed: string;
  artists: string[];
  note?: string;
  href?: string;
  hrefLabel?: string;
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
    slug: "kussi-weiss-there-will-never-be-another-you",
    title: "There Will Never Be Another You",
    year: 1996,
    billed: "Kussi Weiss Ensemble",
    artists: ["kussi-weiss"],
    note: "First album as leader. Idol Records IR 8096 5. Recorded December 1995 and February 1996.",
    href: "https://secondhandsongs.com/release/486647/all",
    hrefLabel: "SecondHandSongs",
  },
  {
    slug: "kussi-weiss-a-little-magic",
    title: "A Little Magic",
    year: 1998,
    billed: "Kussi Weiss Trio",
    artists: ["kussi-weiss"],
    note: "Idol Records IR 1798 5. Second album under his name, billed Kussi Weiss Trio.",
    href: "https://secondhandsongs.com/release/486650/all",
    hrefLabel: "SecondHandSongs",
  },
  {
    slug: "martin-weiss-savoir-vivre",
    title: "Savoir Vivre",
    year: 2001,
    billed: "Martin Weiss Ensemble",
    artists: ["martin-weiss", "kussi-weiss", "tschabo-franzen"],
    note: "GLM / Edition Collage EC 523-2. Kussi Weiss solo guitar; Tschabo Franzen rhythm; Martin Weiss violin.",
    href: "https://www.glm.de/produkt/martin-weiss-ensemble-savoir-vivre/",
    hrefLabel: "GLM",
  },
  {
    slug: "martin-weiss-gipsy-celebration",
    title: "Gipsy Celebration",
    year: 2008,
    billed: "Martin Weiss",
    artists: ["martin-weiss", "kussi-weiss", "tschabo-franzen", "dietmar-osterburg"],
    note: "H19 Produktion, 2 May 2008. Martin Weiss with Kussi Weiss, Tschabo Franzen and Dietmar Osterburg.",
    href: "https://open.spotify.com/album/3rZK69ya2N9pvgOd89IPZB",
    hrefLabel: "Spotify",
  },
  {
    slug: "le-quecumbar-international-gypsy-swing-guitar-festival",
    title: "Le QuecumBar International Gypsy Swing Guitar Festival",
    year: 2010,
    billed: "Various",
    artists: [
      "kussi-weiss",
      "hugo-richter",
      "biel-ballester",
      "stochelo-rosenberg",
      "lollo-meier",
      "paulus-schafer",
      "tcha-limberger",
      "ritary-gaguenetti",
      "sebastien-giniaux",
      "ducato-piotrowski",
      "pete-kubryk-townsend",
      "andy-aitchison",
      "noah-schafer",
      "andy-crowdy",
      "feigeli-prisor",
      "wattie-rosenberg",
      "sani-van-mullem",
    ],
    note: "3×CD, Le Q Records LEQ0108, Battersea, January 2010. Kussi Weiss Quintet: Them There Eyes, Close To You, All of Me, Close Your Eyes.",
    href: "https://www.discogs.com/release/11968877-Various-Le-QuecumBar-International-Gypsy-Swing-Guitar-Festival-",
    hrefLabel: "Discogs",
  },
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
