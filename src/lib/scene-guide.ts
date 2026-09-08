export type School = {
  name: string;
  place: string;
  url: string;
  relatedSlugs: string[];
  bio: string;
  /** If true, only show on that artist's page — not Learn / Scene lists. */
  artistOnly?: boolean;
  /** Year-round online school. Not a camp or a local private teacher. */
  online?: boolean;
};

export const SCHOOLS: School[] = [
  {
    name: "Van Hemert System — Christiaan van Hemert",
    place: "Netherlands — online worldwide",
    url: "https://christiaanvanhemert.com/workshops",
    relatedSlugs: ["christiaan-van-hemert"],
    bio: "Christiaan van Hemert’s school. Guitar and violin, the Van Hemert System for gypsy-jazz improvisation, and workshops online and on the road. A first-call guest with the Rosenberg Trio.",
    online: true,
  },
  {
    name: "DC Music School",
    place: "Japan — online worldwide",
    url: "https://www.dc-musicschool.com/",
    relatedSlugs: ["denis-chang"],
    bio: "Denis Chang’s school. Lessons, transcriptions and a YouTube library that has become the first room many amateurs walk into. He lives in Japan; the school is online.",
    online: true,
  },
  {
    name: "Joscho Stephan Gypsy Guitar Academy",
    place: "Germany — online worldwide",
    url: "https://gypsyguitaracademy.com/",
    relatedSlugs: ["joscho-stephan"],
    bio: "Joscho Stephan's academy — technique, repertoire and the German concert-school take on Django's guitar.",
    online: true,
  },
  {
    name: "Romane — teaching books & materials",
    place: "France",
    url: "https://www.hotclub.de/",
    relatedSlugs: ["romane"],
    bio: "Romane's books and materials still sit on amateur stands worldwide — original themes and a written way into the French school.",
  },
  {
    name: "Gismo Graf — Gypsy Guitar Weekend",
    place: "Germany",
    url: "https://www.gypsyguitar-weekend.de/",
    relatedSlugs: ["gismo-graf"],
    bio: "Gismo Graf's guitar weekend — the German Sinti school in the room.",
  },
  {
    name: "Bertino Rodmann — Gypsyjazz Guitar",
    place: "Frankfurt, Germany",
    url: "https://www.bertino-guitarrist.com/en/",
    relatedSlugs: ["bertino-rodmann"],
    bio: "Frankfurt guitarist and author. Weekend masterclass on pompe, rest-stroke and arpeggios. Method books Gypsyjazz Guitar Vol. 1 & 2, and The REAL Gypsy-Jazz Book Edition 2026 — 420 charts, PDF plus iReal.",
  },
  {
    name: "Tim Kliphuis Studio",
    place: "Netherlands — online worldwide",
    url: "https://gypsyjazzviolinlessons.com/",
    relatedSlugs: ["tim-kliphuis"],
    bio: "Tim Kliphuis's studio and the Grappelli-Django camp — violin, guitar and bass. Monthly songs, crash courses, play-alongs. gypsyjazzviolinlessons.com.",
    online: true,
  },
  {
    name: "Django à Gogo guitar camp",
    place: "United States",
    url: "http://www.djangoagogo.com/",
    relatedSlugs: ["stephane-wrembel"],
    bio: "Stéphane Wrembel's camp and school around Django à Gogo.",
  },
  {
    name: "Gitaarschool Heiloo — John Ligthart",
    place: "Heiloo, Netherlands",
    url: "https://gitaarschoolheiloo.nl/docent-bij-gitaarschool-heiloo-johnny-ligthart/",
    relatedSlugs: ["john-ligthart"],
    bio: "John Ligthart's guitar school in Heiloo. Private lessons — gypsy jazz and the rest of the guitar.",
  },
  {
    name: "Marcia Bamberg — Vocal Coach",
    place: "Obdam, Netherlands",
    url: "https://marciabamberg.nl/marcia-bamberg-vocal-coach",
    relatedSlugs: ["marcia-bamberg"],
    bio: "Private singing lessons and the workshop The Essence of the Voice. Beginners and experienced voices, any style — you bring the songs. 60 minutes in Noord-Holland. Book on her site.",
  },
  {
    name: "Rosenberg Academy",
    place: "Netherlands — online worldwide",
    url: "https://rosenbergacademy.com/",
    relatedSlugs: ["stochelo-rosenberg", "mozes-rosenberg"],
    bio: "The Rosenberg family's school. Stochelo and the Dutch Sinti chair, taught so amateurs anywhere can work the pompe and the lead language.",
    online: true,
  },
  {
    name: "Christiaan van Hemert Discord",
    place: "Online — worldwide",
    url: "https://discord.gg/UcPE96htqX",
    relatedSlugs: ["christiaan-van-hemert"],
    bio: "Christiaan van Hemert's gypsy jazz Discord. Free room to talk guitar, the pompe, and the Van Hemert System.",
    artistOnly: true,
  },
  {
    name: "Nuno Marinho — Gypsy Jazz Workshops",
    place: "Portugal — Zoom, worldwide",
    url: "https://www.nunomarinho.com/gypsy-jazz-workshops/",
    relatedSlugs: ["nuno-marinho", "marian-yanchyk"],
    bio: "Live Saturday workshops with Nuno Marinho, 15:00 UTC on Zoom. Ninety minutes on the music and the guitar. Patreon and Discord for the sessions. He also teaches at Django in June and the Grappelli-Django Camp.",
    online: true,
  },
  {
    name: "Vincent's Accordion Studio",
    place: "Taipei — also Taichung and Kaohsiung",
    url: "https://www.vincentaccordion.net/",
    relatedSlugs: ["vincent-tsai"],
    bio: "Vincent Tsai’s Taipei studio — accordion teaching and repair. Classroom of Taipei Gypsy Jazz Festival workshops (Paulus Schäfer and Christiaan van Hemert taught here in 2025).",
  },
  {
    name: "Patil Zakarian — piano manouche",
    place: "Kuwait / Belgium — online",
    url: "https://about.me/patilzakarian",
    relatedSlugs: ["patil-zakarian"],
    bio: "Armenian pianist. Arranges Django, Tchan-Tchou and Angelo Debarre for solo piano — La Gitane, Swing Gitan, La Manouche. Channel Pat_Pianooo.",
    online: true,
  },
  {
    name: "Yen-Hua Wang — chromatic harmonica",
    place: "Taipei — teaching and performance",
    url: "https://laelapsharmonica.com/en/laelaps-club/yen-hua-wang/",
    relatedSlugs: ["yen-hua-wang"],
    bio: "Full-time chromatic harmonica teaching and performance. Taipei Gypsy Jazz Festival, Piracicaba and Curitiba. Channel 王衍華Yen-Hua Wang.",
  },
];

export function schoolsForArtist(slug: string) {
  return SCHOOLS.filter((school) => school.relatedSlugs.includes(slug));
}

export function onlineSchools() {
  return SCHOOLS.filter((school) => school.online && !school.artistOnly);
}

export const YOUTUBE_CHANNELS = [
  {
    name: "Stochelo Rosenberg / Rosenberg Academy",
    url: "https://www.youtube.com/@RosenbergAcademy",
    note: "Dutch Sinti school, lessons and performances.",
  },
  {
    name: "Joscho Stephan",
    url: "https://www.youtube.com/@joschostephan",
    note: "German virtuoso school.",
  },
  {
    name: "Denis Chang",
    url: "https://www.youtube.com/@DenisChangMusic",
    note: "Player channel — Japan, concerts and lessons. Canadian guitarist living in Japan.",
  },
  {
    name: "DC Music School",
    url: "https://www.youtube.com/@DCMusicSchool",
    note: "Denis Chang’s school library — transcriptions and lessons.",
  },
  {
    name: "Nuno Marinho",
    url: "https://www.youtube.com/nunomarinho",
    note: "Portugal’s gypsy jazz school, Festival Django Portugal, workshops.",
  },
];

export const APPS = [
  {
    slug: "la-pompe-live",
    name: "La Pompe Live",
    maker: "Christiaan van Hemert",
    makerSlug: "christiaan-van-hemert",
    bio: "Backing tracks, scrollable charts and setlists — built for jazz and the pompe. iPhone and Android. His beginner tutorial is from August 2026.",
    site: "https://vanhemertsystem.fws.store/product/la-pompe-live-backing-track-app",
    ios: "https://apps.apple.com/us/app/la-pompe-live/id6790375139",
    android:
      "https://play.google.com/store/apps/details?id=com.vanhemertsystem.lapompelive",
    youtube: {
      title: "The Ultimate Backing Track App: La Pompe Live — Beginner Guide",
      url: "https://www.youtube.com/watch?v=RYLanvfhm3I",
    } as { title: string; url: string } | null,
  },
  {
    slug: "ireal-pro",
    name: "iReal Pro",
    maker: "Technimo",
    makerSlug: "",
    bio: "The chord-chart and backing-band app most players already have. Practice any tune, any key, with a band that follows you.",
    site: "https://www.irealpro.com/",
    ios: "https://apps.apple.com/us/app/ireal-pro/id298206806",
    android: "https://play.google.com/store/apps/details?id=com.massimobiolcati.irealb",
    youtube: null as { title: string; url: string } | null,
  },
];
