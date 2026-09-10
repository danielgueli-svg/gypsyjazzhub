import { APPS, SCHOOLS } from "@/lib/scene-guide";

export const INSTRUMENT_SLUGS = [
  "solo-guitar",
  "rhythm-guitar",
  "violin",
  "double-bass",
  "clarinet",
  "saxophone",
  "vocals",
  "accordion",
  "mandolin",
  "piano",
  "harmonica",
] as const;

export type InstrumentSlug = (typeof INSTRUMENT_SLUGS)[number];

export type InstrumentCopy = {
  name: string;
  role: string;
  blurb: string;
  intro: string;
  techniques: { title: string; body: string }[];
  tips: string[];
};

export type InstrumentResource = {
  label: string;
  to?:
    | "/learn/charts"
    | "/learn/apps"
    | "/learn/start-jam"
    | "/learn/amplification"
    | "/luthiers"
    | "/luthiers/bass"
    | "/luthiers/violin"
    | "/shops"
    | "/learn/teachers";
  href?: string;
  note: string;
};

export type InstrumentMaker = {
  name: string;
  craft: string;
  note: string;
  href?: string;
  city?: string;
  country?: string;
};

export type InstrumentChart = {
  name: string;
  note: string;
  href: string;
};

export type AmpNote = {
  title: string;
  body: string;
};

export type RepertoireTune = {
  title: string;
  key: string;
  note: string;
};

export type Instrument = {
  slug: InstrumentSlug;
  family: string;
  schoolSlugs: string[];
  appSlugs: string[];
  players: { slug: string; name: string; note: string }[];
  resources: InstrumentResource[];
  teacherNeedles: string[];
  videos: { title: string; url: string; by: string }[];
  makers: InstrumentMaker[];
  makersLead: string;
  charts: InstrumentChart[];
  ampNotes: AmpNote[];
  showShops: boolean;
  repertoire?: RepertoireTune[];
};

export function luthierCraftForInstrument(slug: InstrumentSlug): "guitar" | "bass" | "violin" | null {
  if (slug === "double-bass") return "bass";
  if (slug === "violin") return "violin";
  if (slug === "solo-guitar" || slug === "rhythm-guitar") return "guitar";
  return null;
}

const GUITAR_CHARTS: InstrumentChart[] = [
  {
    name: "The REAL Gypsy-Jazz Book — Edition 2026",
    note: "Bertino Rodmann — 420 charts, PDF plus iReal. The jam book.",
    href: "https://www.bertino-guitarrist.com/en/",
  },
  {
    name: "Gypsyjazz Guitar Vol. 1",
    note: "Bertino Rodmann method — pompe, rest-stroke, the first book.",
    href: "https://payhip.com/b/FNSBM",
  },
  {
    name: "DjangoBooks charts",
    note: "Minor Swing, All of Me, Dark Eyes, Nuages — the shared shelf.",
    href: "https://www.djangobooks.com/",
  },
];

const SHARED_CHARTS: InstrumentChart[] = [
  {
    name: "The REAL Gypsy-Jazz Book — Edition 2026",
    note: "Bertino Rodmann — 420 charts the rooms actually call. Same book as the guitar.",
    href: "https://www.bertino-guitarrist.com/en/",
  },
  {
    name: "DjangoBooks charts",
    note: "Minor Swing, All of Me, Dark Eyes, Nuages.",
    href: "https://www.djangobooks.com/",
  },
];

const GUITAR_AMP: AmpNote[] = [
  {
    title: "The Selmer voice",
    body: "Petite bouche on stage usually means a magnetic pickup in the Stimer tradition, not an undersaddle. Cut a little around 250–400 Hz if it booms; leave the bite. Full notes on the amplification page.",
  },
  {
    title: "Small acoustic combos",
    body: "Acus, AER Compact 60, Henriksen The Bud — built for strings, not for a Strat. One small combo for the whole band is often enough in a café.",
  },
  {
    title: "Piezo",
    body: "If the guitar already has a piezo, a ToneDexter (or a good acoustic preamp) in front of the amp is how you make it sound like wood. Brands sit on /learn/amplification.",
  },
];

export const INSTRUMENTS: Instrument[] = [
  {
    slug: "solo-guitar",
    family: "Guitar",
    schoolSlugs: [
      "denis-chang",
      "joscho-stephan",
      "stochelo-rosenberg",
      "mozes-rosenberg",
      "john-ligthart",
      "christiaan-van-hemert",
      "nuno-marinho",
      "romane",
      "bertino-rodmann",
      "tim-kliphuis",
    ],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: true,
    players: [
      { slug: "django-reinhardt", name: "Django Reinhardt", note: "The language, two fingers" },
      { slug: "stochelo-rosenberg", name: "Stochelo Rosenberg", note: "Dutch Sinti school" },
      { slug: "bireli-lagrene", name: "Biréli Lagrène", note: "Alsace, fire and harmony" },
      { slug: "joscho-stephan", name: "Joscho Stephan", note: "German concert school" },
      { slug: "tchavolo-schmitt", name: "Tchavolo Schmitt", note: "Alsace, the raw chair" },
      { slug: "mozes-rosenberg", name: "Mozes Rosenberg", note: "Dutch lead, living circuit" },
    ],
    resources: [
      { label: "Charts & backing", to: "/learn/charts", note: "Minor Swing, All of Me, Nuages" },
      { label: "Apps", to: "/learn/apps", note: "La Pompe Live — Christiaan van Hemert — and iReal Pro" },
      { label: "Luthiers", to: "/luthiers", note: "Selmer-Maccaferri guitar makers" },
      { label: "Shops", to: "/shops", note: "Who stocks Selmer-style" },
      { label: "Amplification", to: "/learn/amplification", note: "Stimer, piezo, Acus and AER" },
    ],
    teacherNeedles: ["guitar", "gitaar", "lead", "solo", "guitare"],
    videos: [
      {
        title: "Gypsy Jazz Guitar Technique — Licks / Picking",
        url: "https://www.youtube.com/watch?v=8YJUK6v7ckA",
        by: "Denis Chang / DC Music School",
      },
      {
        title: "Start here if you’re an absolute jazz guitar beginner",
        url: "https://www.youtube.com/watch?v=DLWuo8QEPik",
        by: "Christiaan van Hemert",
      },
    ],
    makers: [],
    makersLead: "Selmer-Maccaferri guitar makers. The same list lives on guitar and rhythm guitar.",
    charts: GUITAR_CHARTS,
    ampNotes: GUITAR_AMP,
  },
  {
    slug: "rhythm-guitar",
    family: "Rhythm guitar",
    schoolSlugs: [
      "stochelo-rosenberg",
      "mozes-rosenberg",
      "denis-chang",
      "christiaan-van-hemert",
      "bertino-rodmann",
      "john-ligthart",
    ],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: true,
    players: [
      { slug: "joseph-reinhardt", name: "Joseph Reinhardt", note: "Nin-Nin — the original pompe" },
      { slug: "nousche-rosenberg", name: "Nous'che Rosenberg", note: "Rosenberg Trio engine" },
      { slug: "hono-winterstein", name: "Hono Winterstein", note: "Alsace pompe" },
      { slug: "ninine-garcia", name: "Ninine Garcia", note: "French rhythm chair" },
      { slug: "sven-jungbeck", name: "Sven Jungbeck", note: "Joscho Stephan Trio" },
      { slug: "benji-winterstein", name: "Benji Winterstein", note: "Dario Napoli Trio" },
    ],
    resources: [
      { label: "Charts & backing", to: "/learn/charts", note: "A pompe you can play along with" },
      { label: "Apps", to: "/learn/apps", note: "La Pompe Live — Christiaan van Hemert" },
      { label: "Start a jam", to: "/learn/start-jam", note: "One host who starts the pompe" },
      { label: "Luthiers", to: "/luthiers", note: "Selmer-Maccaferri guitar makers" },
      { label: "Shops", to: "/shops", note: "Who stocks Selmer-style" },
      { label: "Amplification", to: "/learn/amplification", note: "One small combo for the room" },
    ],
    teacherNeedles: ["guitar", "gitaar", "rhythm", "ritme", "pompe", "guitare"],
    videos: [
      {
        title: "Gypsy Jazz Rhythm — La Pompe, the wrist",
        url: "https://www.youtube.com/watch?v=Ko89X1wVaqU",
        by: "Denis Chang / DC Music School",
      },
      {
        title: "Gypsy Jazz Guitar Chords: How to Play La Pompe",
        url: "https://www.youtube.com/watch?v=nDpakBkHqas",
        by: "Jazz Guitar Online",
      },
    ],
    makers: [],
    makersLead: "Selmer-Maccaferri guitar makers. The same list lives on guitar and rhythm guitar.",
    charts: GUITAR_CHARTS,
    ampNotes: GUITAR_AMP,
  },
  {
    slug: "violin",
    family: "Violin",
    schoolSlugs: ["christiaan-van-hemert", "tim-kliphuis"],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: false,
    players: [
      { slug: "stephane-grappelli", name: "Stéphane Grappelli", note: "The other half of the Hot Club" },
      { slug: "florin-niculescu", name: "Florin Niculescu", note: "Romanian swing violin" },
      { slug: "tcha-limberger", name: "Tcha Limberger", note: "Belgian Sinti violin" },
      { slug: "tim-kliphuis", name: "Tim Kliphuis", note: "Grappelli-Django camp" },
      { slug: "christiaan-van-hemert", name: "Christiaan van Hemert", note: "Rosenberg orbit, teacher" },
      { slug: "costel-nitescu", name: "Costel Nitescu", note: "Romanian concert violin" },
      { slug: "koos-koopmans", name: "Koos Koopmans", note: "Centre Ville, Netherlands" },
    ],
    resources: [
      { label: "Amplification", to: "/learn/amplification", note: "How to hear a violin in a room" },
      { label: "Charts & backing", to: "/learn/charts", note: "The same book as the guitar" },
      { label: "Luthiers", to: "/luthiers/violin", note: "Violin makers, restorers and setup workshops" },
      {
        label: "Tim Kliphuis Studio",
        href: "https://gypsyjazzviolinlessons.com/",
        note: "Online studio — monthly songs, crash courses, play-alongs",
      },
    ],
    teacherNeedles: ["violin", "viool", "violon", "geige", "hegedű", "fiddle", "housle", "skrzyp"],
    videos: [
      {
        title: "Gypsy Jazz Violin — Minor Swing lesson excerpt",
        url: "https://www.youtube.com/watch?v=xMLtAXo_K2A",
        by: "Tim Kliphuis / DC Music School",
      },
      {
        title: "2 gypsy jazz violin licks — major, minor, dominant",
        url: "https://www.youtube.com/watch?v=zXSwrfnDTrs",
        by: "Tim Kliphuis (posted by Eva Slongo)",
      },
    ],
    makers: [],
    makersLead: "Violin makers and workshops — new instruments, repairs and setup.",
    charts: [
      ...SHARED_CHARTS,
      {
        name: "Tim Kliphuis Studio",
        note: "Violin method, play-alongs and the Grappelli-Django camp.",
        href: "https://gypsyjazzviolinlessons.com/",
      },
    ],
    ampNotes: [
      {
        title: "Clip or contact",
        body: "A clip microphone or a good contact (Schertler, DPA 4099) keeps the bow. A guitar amp with a violin in front of it howls.",
      },
      {
        title: "Off-axis",
        body: "Face slightly off-axis from the cab. Less gain than you think. Full notes on the amplification page.",
      },
    ],
  },
  {
    slug: "double-bass",
    family: "Double bass",
    schoolSlugs: ["tim-kliphuis"],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: false,
    players: [
      { slug: "nonnie-rosenberg", name: "Nonnie Rosenberg", note: "Rosenberg Trio floor" },
      { slug: "sebastien-girardot", name: "Sébastien Girardot", note: "Rosenberg / Kelbie groups" },
      { slug: "diego-imbert", name: "Diego Imbert", note: "French first-call bass" },
      { slug: "juan-pablo-robaldo", name: "Juan Pablo Robaldo", note: "Buenos Aires — Swing Medical" },
    ],
    resources: [
      { label: "Amplification", to: "/learn/amplification", note: "Realist, David Gage, AER — bass in a café" },
      { label: "Charts & backing", to: "/learn/charts", note: "Roots of the common book" },
      { label: "Luthiers", to: "/luthiers/bass", note: "Double bass makers, restorers and jazz-setup workshops" },
    ],
    teacherNeedles: ["bass", "contrabas", "double bass", "bőgő", "kontrabas", "contrebasse"],
    videos: [
      {
        title: "Top tips for gypsy jazz bass lines",
        url: "https://www.youtube.com/watch?v=FDV1dT46Wzc",
        by: "Olivier Babaz / Discover Double Bass",
      },
      {
        title: "How to play gypsy jazz bass — even if you’re new to it",
        url: "https://www.youtube.com/watch?v=cxLUiyzbS9Y",
        by: "Robin Nolan",
      },
    ],
    makers: [],
    makersLead: "Double bass is a core instrument in gypsy jazz. Makers, restorers and jazz-setup workshops, listed by country.",
    charts: SHARED_CHARTS,
    ampNotes: [
      {
        title: "Realist on the bridge",
        body: "A Realist or K&K on the bridge, sometimes a mic on the side. The job is the pump and the low G, not a disco sub.",
      },
      {
        title: "David Gage",
        body: "David Gage String Instruments in New York is the shop behind the Realist. Jazz setup, rentals, the copper-head piezo a lot of festival bassists still use.",
      },
      {
        title: "AER, not a rock stack",
        body: "AER Compact or an Acus — roll off the very bottom so the guitar still has air. Full notes on the amplification page.",
      },
    ],
  },
  {
    slug: "clarinet",
    family: "Clarinet",
    schoolSlugs: [],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: false,
    players: [
      { slug: "giacomo-smith", name: "Giacomo Smith", note: "Opposite Mozes Rosenberg" },
      { slug: "jean-francois-foliez", name: "Jean François Foliez", note: "Clarinet of Dance of Joy" },
      { slug: "tomas-bobrowicky", name: "Tomás Bobrowicky", note: "Swing Medical, Buenos Aires" },
      { slug: "koen-de-cauter", name: "Koen De Cauter", note: "Waso family — clarinet and sax" },
    ],
    resources: [
      { label: "Amplification", to: "/learn/amplification", note: "A quiet horn in a café — clip-on, never a stack" },
      { label: "Charts & backing", to: "/learn/charts", note: "Sing the melody, then the changes" },
    ],
    teacherNeedles: ["clarinet", "klarinet", "klarinét", "klarinette"],
    videos: [
      {
        title: "Hubert Rostaing — Just One Of Those Things (Brussels, 1947)",
        url: "https://www.youtube.com/watch?v=kkG5BMHQ2r8",
        by: "Hubert Rostaing — the Hot Club clarinet model",
      },
      {
        title: "Giacomo Smith — Django Reinhardt at Kansas Smitty’s",
        url: "https://www.youtube.com/watch?v=wLjwCHcINGo",
        by: "Giacomo Smith — living clarinet / alto chair",
      },
    ],
    makers: [
      {
        name: "Buffet Crampon",
        craft: "Woodwind maker — not a gypsy-guitar luthier",
        note: "French clarinet house since 1825. R13 and the student-to-pro range. Take repairs to a woodwind tech, not a Selmer-Maccaferri workshop.",
        href: "https://www.buffetcrampon.com/collections/clarinets",
        city: "Mantes-la-Ville",
        country: "France",
      },
      {
        name: "Henri Selmer Paris — clarinets",
        craft: "Woodwind maker — not the guitar Selmer",
        note: "The reed Selmer, not the Maccaferri guitar. Bb/A clarinets (Signature, Privilège, Muse). Setup and pads belong with a clarinet technician.",
        href: "https://www.selmer.fr/en/collections/clarinettes",
        city: "Paris",
        country: "France",
      },
    ],
    makersLead:
      "Woodwind makers and repair — Buffet and Selmer clarinet, not gypsy-guitar luthiers. Pads, cork and a clip-on go to a reed tech.",
    charts: SHARED_CHARTS,
    ampNotes: [
      {
        title: "Clip-on, never a stack",
        body: "A DPA 4099 (clarinet clip) or a quiet clip-on into the same Acus/AER as the guitars. The horn is colour, not a PA.",
      },
      {
        title: "Sit in after the theme",
        body: "Ask the host before you unpack. One chorus, then air. Full notes on the amplification page.",
      },
    ],
  },
  {
    slug: "saxophone",
    family: "Saxophone",
    schoolSlugs: [],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: false,
    players: [
      { slug: "giacomo-smith", name: "Giacomo Smith", note: "Alto opposite Mozes Rosenberg" },
      { slug: "koen-de-cauter", name: "Koen De Cauter", note: "Waso family — sax and clarinet" },
      { slug: "tomas-bobrowicky", name: "Tomás Bobrowicky", note: "Swing Medical, Buenos Aires" },
    ],
    resources: [
      { label: "Amplification", to: "/learn/amplification", note: "Same manners as the clarinet" },
      { label: "Charts & backing", to: "/learn/charts", note: "Cousin of the clarinet — same book" },
    ],
    teacherNeedles: ["sax", "saxophone", "tenor sax"],
    videos: [
      {
        title: "Giacomo Smith — Django Reinhardt at Kansas Smitty’s",
        url: "https://www.youtube.com/watch?v=wLjwCHcINGo",
        by: "Giacomo Smith — clarinet and alto",
      },
      {
        title: "Made in France — Mozes Rosenberg / Giacomo Smith Quartet",
        url: "https://www.youtube.com/watch?v=gr3vdUW6vAA",
        by: "Sinti Music",
      },
    ],
    makers: [
      {
        name: "Henri Selmer Paris — saxophones",
        craft: "Woodwind maker — not the guitar Selmer",
        note: "The reed Selmer. Alto and tenor. Setup belongs with a woodwind tech, not a guitar luthier.",
        href: "https://www.selmer.fr/",
        city: "Paris",
        country: "France",
      },
      {
        name: "Buffet Crampon",
        craft: "Woodwind maker — not a gypsy-guitar luthier",
        note: "Clarinet house that also builds saxophones. Same repair bench as the clarinet chair.",
        href: "https://www.buffetcrampon.com/",
        city: "Mantes-la-Ville",
        country: "France",
      },
    ],
    makersLead:
      "Woodwind makers and repair — Selmer and Buffet saxophones, not gypsy-guitar luthiers. Same book as the clarinet.",
    charts: SHARED_CHARTS,
    ampNotes: [
      {
        title: "Clip-on, same as clarinet",
        body: "A DPA 4099 or a quiet clip-on into the band’s acoustic combo. Alto is a colour, not a second violin.",
      },
      {
        title: "One chorus, then air",
        body: "The guitar already fills the top. Play, then listen as hard as you played.",
      },
    ],
  },
  {
    slug: "vocals",
    family: "Vocal",
    schoolSlugs: ["marcia-bamberg"],
    appSlugs: ["ireal-pro"],
    showShops: false,
    players: [
      { slug: "cyrille-aimee", name: "Cyrille Aimée", note: "Born in Samois" },
      { slug: "marcia-bamberg", name: "Marcia Bamberg", note: "Dutch quartet, vocal coach" },
      { slug: "eva-slongo", name: "Eva Slongo", note: "Swiss manouche voice" },
      { slug: "maria-fernanda-yamil", name: "María Fernanda Yamil", note: "Buenos Aires Manouche" },
      { slug: "marion-lenfant-preus", name: "Marion Lenfant-Preus", note: "Marion & Sobo Band, Bonn" },
    ],
    resources: [
      { label: "Charts & backing", to: "/learn/charts", note: "The songs the jam already calls" },
      { label: "Start a jam", to: "/learn/start-jam", note: "A singer needs a host and a key" },
      { label: "Amplification", to: "/learn/amplification", note: "One mic into the same combo as the band" },
    ],
    teacherNeedles: ["vocal", "voice", "zang", "sing", "chant", "ének"],
    videos: [
      {
        title: "Cyrille Aimée — jam at camping Samoreau, Samois 2024",
        url: "https://www.youtube.com/watch?v=wrFZz9xam2A",
        by: "Daniel Gueli Gypsy Jazz Channel",
      },
      {
        title: "Marcia Bamberg Swing Quartet — Festival Django Reinhardt 2026, Samoreau",
        url: "https://www.youtube.com/watch?v=pzVEwzl8tP4",
        by: "Marcia Bamberg",
      },
    ],
    makers: [],
    makersLead: "",
    charts: SHARED_CHARTS,
    ampNotes: [
      {
        title: "One mic, same amp",
        body: "A handheld or a small condenser into the Acus/AER the guitars already use. Not a vocal stack. The pompe has to stay louder than the PA.",
      },
      {
        title: "Ask the key first",
        body: "Rooms usually call these in G or C. Tell the host the key before the downbeat.",
      },
    ],
    repertoire: [
      { title: "Nuages", key: "G", note: "Django’s ballad. Slow. Rooms also call it in G minor — ask before you start." },
      { title: "Si tu savais", key: "G / C", note: "French lyric. Know the form and where the tag is." },
      { title: "Coquette", key: "G", note: "Swing, short melody, a chorus then the guitar." },
      { title: "All of Me", key: "C / G", note: "The standard the jam already knows. C is common; G if the guitar asks." },
    ],
  },
  {
    slug: "accordion",
    family: "Accordion",
    schoolSlugs: ["vincent-tsai"],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: false,
    players: [
      { slug: "marcel-loeffler", name: "Marcel Loeffler", note: "Alsace — waltz, musette, swing" },
      { slug: "dominique-paats", name: "Dominique Paats", note: "Paulus Schäfer; Dance of Joy" },
      { slug: "julien-labro", name: "Julien Labro", note: "Hot Club of Detroit" },
      { slug: "onno-kuipers", name: "Onno Kuipers", note: "Centre Ville, Netherlands" },
      { slug: "vincent-tsai", name: "Vincent Tsai", note: "Taipei Gypsy Jazz Festival; teaching studio" },
      { slug: "florin-pana", name: "Florin Pană", note: "Django Sound Quartet, Bucharest" },
    ],
    resources: [
      { label: "Charts & backing", to: "/learn/charts", note: "Musettes and the shared jam book" },
      { label: "Amplification", to: "/learn/amplification", note: "Accordion is loud — a clip, not a stack" },
    ],
    teacherNeedles: ["accordion", "accordeon", "accordéon", "akkordeon"],
    videos: [
      {
        title: "C'est si bon — Marcel Loeffler jazz accordion solo (with transcription)",
        url: "https://www.youtube.com/watch?v=lDbavrvUic4",
        by: "Marcel Loeffler / transcription Arrigo Tomasi",
      },
      {
        title: "C'est Si Bon / One Note Samba — Marcel Loeffler live, Strasbourg",
        url: "https://www.youtube.com/watch?v=BI8fUOxKvG4",
        by: "Marcel Loeffler with Rick Hannah",
      },
    ],
    makers: [
      {
        name: "Vincent's Accordion Studio",
        craft: "Accordion teaching and repair",
        note: "蔡偉靖手風琴工作室. Vincent Tsai’s Taipei studio — teaching, repair, and the classroom of Taipei Gypsy Jazz Festival workshops. Rooms also in Taichung and Kaohsiung.",
        href: "https://www.vincentaccordion.net/",
        city: "Taipei",
        country: "Taiwan",
      },
    ],
    makersLead:
      "Accordion repair and teaching — not guitar luthiers. Vincent’s studio in Taipei is the one room on this hub that does both.",
    charts: SHARED_CHARTS,
    ampNotes: [
      {
        title: "The box is already loud",
        body: "In a café you often need no amp. If you do, a clip-on or a small condenser into the band combo — never a keyboard stack.",
      },
      {
        title: "Leave air for the pompe",
        body: "Musette fills the midrange the guitar also wants. Play, then drop out for the guitar chorus.",
      },
    ],
  },
  {
    slug: "mandolin",
    family: "Mandolin",
    schoolSlugs: [],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: false,
    players: [
      { slug: "victor-angeleas", name: "Victor Angeleas", note: "Gypsy Jazz Club, Brasília" },
    ],
    resources: [
      { label: "Charts & backing", to: "/learn/charts", note: "The same book — mandolin as a lead chair" },
      { label: "Amplification", to: "/learn/amplification", note: "A clip or a small piezo, not a Strat amp" },
    ],
    teacherNeedles: ["mandolin", "mandoline", "bandolim", "mandolino"],
    videos: [
      {
        title: "Menestrel — Victor Angeleas with Gypsy Jazz Club",
        url: "https://www.youtube.com/watch?v=FgT9RQ4O_FQ",
        by: "Victor Angeleas",
      },
      {
        title: "L'archet d'or — Gypsy Jazz Club (Victor Angeleas, mandolin)",
        url: "https://www.youtube.com/watch?v=UmsQE5rDv7A",
        by: "Face Musical",
      },
    ],
    makers: [
      {
        name: "John Le Voi",
        craft: "Mandolin-family instruments (also Selmer-style guitar)",
        note: "Alford, Lincolnshire. Building since 1970 — Selmer-Maccaferri guitars plus flat-tops, archtops and mandolin-family instruments. One of the first UK makers in the style.",
        href: "https://www.johnlevoiguitars.co.uk/",
        city: "Alford",
        country: "United Kingdom",
      },
    ],
    makersLead:
      "Mandolin-family makers already on this hub. John Le Voi builds mandolin-family instruments alongside Selmer-style guitars.",
    charts: SHARED_CHARTS,
    ampNotes: [
      {
        title: "Clip or piezo",
        body: "A KNA or a clip mic into the acoustic combo. Mandolin is a lead voice — keep it acoustic in a café.",
      },
      {
        title: "Same book as the guitar",
        body: "Minor Swing, All of Me, Dark Eyes. The pompe is still the guitar’s job.",
      },
    ],
  },
  {
    slug: "piano",
    family: "Piano",
    schoolSlugs: ["patil-zakarian"],
    appSlugs: ["ireal-pro", "la-pompe-live"],
    showShops: false,
    players: [
      { slug: "patil-zakarian", name: "Patil Zakarian", note: "Piano manouche — Django and Tchan-Tchou for solo piano" },
      { slug: "bastien-brison", name: "Bastien Brison", note: "Fanou Torracinta — Gipsy Guitar From Corsica" },
      { slug: "ming-hsuan-mao", name: "Ming-Hsuan Mao", note: "Taipei — with Yen-Hua Wang and Seifarth" },
    ],
    resources: [
      { label: "Charts & backing", to: "/learn/charts", note: "Same changes as the guitar — different voicings" },
      { label: "Amplification", to: "/learn/amplification", note: "A café piano, or a small keyboard into the combo" },
    ],
    teacherNeedles: ["piano", "pianist", "keyboard"],
    videos: [
      {
        title: "La Gitane — Tchan-Tchou, piano manouche (PDF available)",
        url: "https://www.youtube.com/watch?v=20voNa6lwEY",
        by: "Patil Zakarian",
      },
      {
        title: "Swing Gitan — piano manouche",
        url: "https://www.youtube.com/watch?v=kKldMQeQacQ",
        by: "Patil Zakarian",
      },
    ],
    makers: [],
    makersLead:
      "This hub does not list piano techs yet. A café piano is a café piano — write if you tune for jams.",
    charts: [
      ...SHARED_CHARTS,
      {
        name: "Patil Zakarian — La Gitane (piano)",
        note: "Tchan-Tchou arranged for solo piano. Sheet via her channel.",
        href: "https://www.youtube.com/watch?v=20voNa6lwEY",
      },
    ],
    ampNotes: [
      {
        title: "The room’s piano first",
        body: "If the café has a piano that is in tune, use it. A stage keyboard into an AER is the fallback, not the default.",
      },
      {
        title: "Leave the pompe to the guitar",
        body: "Comping that doubles the two-and-four fights the rhythm guitar. Play melody or light harmony, then lay out.",
      },
    ],
  },
  {
    slug: "harmonica",
    family: "Harmonica",
    schoolSlugs: ["yen-hua-wang"],
    appSlugs: ["la-pompe-live", "ireal-pro"],
    showShops: false,
    players: [
      { slug: "yen-hua-wang", name: "Yen-Hua Wang", note: "Taipei chromatic — Piracicaba and Taipei festivals" },
      { slug: "finn-hauge", name: "Finn Hauge", note: "Hot Club de Norvège — violin and harmonica" },
      { slug: "rory-hoffman", name: "Rory Hoffman", note: "Joscho Stephan’s Transatlantic Guitar Trio" },
    ],
    resources: [
      { label: "Charts & backing", to: "/learn/charts", note: "Django recorded with Larry Adler — those tunes are on the list" },
      { label: "Amplification", to: "/learn/amplification", note: "A vocal mic or a clip, never a blues harp stack" },
    ],
    teacherNeedles: ["harmonica", "chromatic harmonica", "mondharmonica"],
    videos: [
      {
        title: "Learn Minor Swing on harmonica — gypsy jazz",
        url: "https://www.youtube.com/watch?v=A4ej2qJeVeQ",
        by: "Jason Ricci — G Hohner Marine Band",
      },
      {
        title: "What is this thing called love — Hot Club de Norvège (Finn Hauge, harmonica)",
        url: "https://www.youtube.com/watch?v=Q6suzB4cSGQ",
        by: "Finn Hauge / Hot Club de Norvège",
      },
    ],
    makers: [
      {
        name: "Hohner",
        craft: "Harmonica maker",
        note: "Marine Band and chromatic models. The Jason Ricci Minor Swing lesson uses a G Marine Band. Not a gypsy-guitar workshop.",
        href: "https://www.hohner.de/",
        city: "Trossingen",
        country: "Germany",
      },
      {
        name: "Seydel 1847",
        craft: "Harmonica maker",
        note: "German harmonica house. Chromatic and diatonic. Take repairs to a harmonica tech, not a guitar luthier.",
        href: "https://www.seydel1847.com/",
        city: "Klingenthal",
        country: "Germany",
      },
    ],
    makersLead: "Harmonica makers — Hohner and Seydel. Not gypsy-guitar luthiers.",
    charts: SHARED_CHARTS,
    ampNotes: [
      {
        title: "A vocal mic is enough",
        body: "Cup a handheld into the same combo as the singer, or play acoustic in a small room. A blues-harp stack fights the pompe.",
      },
      {
        title: "Chromatic or diatonic",
        body: "Yen-Hua Wang plays chromatic. The Ricci Minor Swing lesson is a G Marine Band. Know which harp the tune wants before you sit in.",
      },
    ],
  },
];

export const EN_INSTRUMENT_COPY: Record<InstrumentSlug, InstrumentCopy> = {
  "solo-guitar": {
    name: "Solo guitar",
    role: "Lead",
    blurb: "The singing line over the pompe.",
    intro:
      "In gypsy jazz the lead guitar is the horn. Django wrote the language with two fingers on a Selmer — rest-stroke, arpeggios, a melody that can sit still or take fire. Today the chair is Stochelo, Biréli, Joscho, Tchavolo, Mozes: different schools, same job. You take the theme, you take choruses, you hand it back.",
    techniques: [
      {
        title: "Rest-stroke",
        body: "The pick rests on the next string after each downstroke. That is the gypsy sound: fat, percussive, singing. Speed without this attack is just notes.",
      },
      {
        title: "Arpeggios over the changes",
        body: "Minor Swing is not a scale workout. Outline the chord, then decorate. One chorus of Django, then one of Stochelo — do not mix the schools until you can hear them.",
      },
      {
        title: "The Selmer voice",
        body: "A heavy pick, downstrokes on the strong notes, and air between phrases. The room should still hear the pompe under you.",
      },
    ],
    tips: [
      "Learn the pompe first, even if you want to solo. A lead player who cannot keep time will not be asked back.",
      "Three tunes to sit in: Minor Swing, All of Me, Dark Eyes. Then Nuages, slow.",
      "Copy one chorus, then close the video. The jam will not wait for a transcription.",
    ],
  },
  "rhythm-guitar": {
    name: "Rhythm guitar",
    role: "La pompe",
    blurb: "The engine of the quintet — two and four, every bar.",
    intro:
      "La pompe is the drums of gypsy jazz. Without it there is no room. Joseph Reinhardt set the model; Nous'che Rosenberg still drives the Rosenberg Trio with it. The job is time, not decoration: bass note, chord, mute, repeat — a pump the soloist can lean on.",
    techniques: [
      {
        title: "The pump",
        body: "Bass on one and three (often muted), chord on two and four with a sharp, percussive attack. The right hand is a drummer's wrist, not a strummer's arm.",
      },
      {
        title: "Three-note grips",
        body: "Closed voicings, no extra strings ringing. Clarity over stretch. The bass already has the root — you add the crack of the snare.",
      },
      {
        title: "Lock with the bass",
        body: "If the bass walks, you stay in two-feel. If you rush, the whole room rushes. Record yourself. Listen for the hole after each chord.",
      },
    ],
    tips: [
      "Practise with La Pompe Live or a metronome on two and four. The app is on this hub.",
      "You may take a chorus later. First nights: hold the time and leave chairs for someone newer.",
      "Watch Nous'che, Hono Winterstein, Ninine Garcia. Copy the right hand before the left.",
    ],
  },
  violin: {
    name: "Violin",
    role: "Melody",
    blurb: "Grappelli's chair — the other half of the Hot Club.",
    intro:
      "Stéphane Grappelli made the violin the twin of Django's guitar: salon elegance, dance-floor swing, a melody that floats. The chair is still open. Florin Niculescu, Tcha Limberger, Tim Kliphuis, Costel Nitescu, Christiaan van Hemert, Roby Lakatos — each with a different accent, all sitting in the same book.",
    techniques: [
      {
        title: "Swing bow",
        body: "Not classical détaché. The bow speaks in phrases, with a slight bite on the off-beat. Grappelli floated; Schnuckenack dug in. Know which room you are in.",
      },
      {
        title: "Ornaments",
        body: "Slides, grace notes, a vibrato that starts after the note, not on it. The guitar already has rest-stroke. You need air, not more attack.",
      },
      {
        title: "Sharing the theme",
        body: "Unison with the guitar, then a chorus, then you lay out so the guitar can sing. Two melodies at once is a traffic jam.",
      },
    ],
    tips: [
      "Know the guitar changes. A violin that only knows the melody gets lost after the theme.",
      "Sit in after the first tune. Watch the host. When they nod, take eight bars, then twenty-four.",
      "A quiet pickup, never a rock sound. The amplification page on this hub is written for this chair too.",
    ],
  },
  "double-bass": {
    name: "Double bass",
    role: "The floor",
    blurb: "Time underneath the pompe — walking or two-feel.",
    intro:
      "Louis Vola held the original Quintette to the floor. Today the chair is Nonnie Rosenberg, Sébastien Girardot, Diego Imbert and the first-call players who travel with the guitar stars. You lock with the pompe, you walk when the soloist needs air, and you never get in the way of the two-and-four.",
    techniques: [
      {
        title: "Two-feel and walking",
        body: "Two-feel with the pompe for the theme; walking choruses when the guitar takes fire. Come back to two for the last theme. That is the whole arrangement.",
      },
      {
        title: "Short notes",
        body: "Manouche bass is percussive. Let the guitar's chord speak in the hole you leave. A long, singing bass turns the quintet into a different band.",
      },
      {
        title: "Pitch of the room",
        body: "You are the note the violin tunes to. Be there before the first downbeat, and stay in the middle of the chord — not under it, not on top.",
      },
    ],
    tips: [
      "Know the roots of Minor Swing, All of Me, Dark Eyes, Nuages. That is enough for a first sit-in.",
      "See the amplification page for how to hear a bass in a café without turning it into rock — Realist, David Gage, AER.",
      "If there is already a bass, wait. Two basses in a jam is a traffic jam.",
    ],
  },
  clarinet: {
    name: "Clarinet",
    role: "Horn",
    blurb: "The Hot Club reed — a singing chorus, then space.",
    intro:
      "After Grappelli left for England, Django's Quintette often carried a clarinet — Hubert Rostaing first among them. The reed is still welcome: Giacomo Smith opposite Mozes Rosenberg, Jean François Foliez with Dance of Joy, Tomás Bobrowicky on an Argentine jam. You take a chorus like a horn, you leave space, you do not become a second violin.",
    techniques: [
      {
        title: "Swing tongue",
        body: "Light, on the beat, not a wind-band etude. Think Rostaing: a singing line that can also bite. Saxophone is the cousin — same book, same manners.",
      },
      {
        title: "One chorus, then air",
        body: "The guitar and violin already fill the top. Your job is colour and a story, not constant lines. Play, then listen as hard as you played.",
      },
      {
        title: "Melody first",
        body: "Nuages and Minor Swing as songs, then the changes. If you cannot sing the theme, do not take the chorus yet.",
      },
    ],
    tips: [
      "Ask the host before you unpack. Sit in after the theme, not on top of it.",
      "Listen to Mozes Rosenberg & Giacomo Smith — the record Manouche is a living model. Rostaing is the old one.",
      "A quiet clip-on, never a stage stack. The amplification page is for this chair too.",
    ],
  },
  saxophone: {
    name: "Saxophone",
    role: "Horn",
    blurb: "Cousin of the clarinet — same book, same manners.",
    intro:
      "Alto and tenor sit in the same rooms as the clarinet. Giacomo Smith plays both opposite Mozes Rosenberg. Koen De Cauter carries sax and clarinet in the Waso family. Tomás Bobrowicky does the same in Buenos Aires. You are not a second violin. One chorus, then air, same book as the guitar.",
    techniques: [
      {
        title: "Same book as the clarinet",
        body: "Minor Swing, Nuages, All of Me. Light tongue, singing line. Think Rostaing on clarinet, then Giacomo on alto.",
      },
      {
        title: "One chorus, then air",
        body: "The guitar already fills the top. Colour and a story, not constant lines.",
      },
      {
        title: "Ask before you unpack",
        body: "A sax in a café is loud. Check with the host. Clip-on into the band amp, never a horn stack.",
      },
    ],
    tips: [
      "If there is already a clarinet, wait — two reeds on a small jam is a traffic jam.",
      "Listen to Mozes Rosenberg & Giacomo Smith, and to Koen De Cauter with the Waso family.",
      "Pads and corks go to a woodwind tech, not a guitar luthier.",
    ],
  },
  vocals: {
    name: "Vocals",
    role: "Voice",
    blurb: "Chanson in front of the pompe — a singer the room can walk into.",
    intro:
      "Gypsy jazz is not only instrumental. Cyrille Aimée grew up in Samois and took the voice around the world. Marcia Bamberg put a singer back in front of a Dutch quartet so a new public could walk into the music. The chair is a front line: French and English songs, swing time, and a band that knows when to play and when to listen.",
    techniques: [
      {
        title: "Time over vibrato",
        body: "Sit on the pompe. The guitar will answer you if you leave holes. A singer who rushes is a different tempo from the room.",
      },
      {
        title: "The book",
        body: "Nuages, Si tu savais, Coquette, All of Me. Know the lyric and the form — where the bridge is, where the tag is, when to stop.",
      },
      {
        title: "Front, not on top",
        body: "You are another horn. Do not out-sing the room. One chorus, a rest, then the theme back to the guitar.",
      },
    ],
    tips: [
      "Start with one song the jam already calls. Ask the host for the key before you start — rooms usually call these in G or C.",
      "Marcia Bamberg teaches voice in Noord-Holland. Lessons exist. Use them.",
      "Pin a note on the board if you want a guitar for a Sunday afternoon.",
    ],
  },
  accordion: {
    name: "Accordion",
    role: "Box",
    blurb: "Musette and swing beside the pompe — Loeffler and Paats chairs.",
    intro:
      "The accordion is not in Django’s original quintet, but it sits in a lot of rooms: Marcel Loeffler on the Alsatian stages, Dominique Paats beside Paulus Schäfer and with Dance of Joy, Julien Labro with the Hot Club of Detroit, Onno Kuipers with Centre Ville, Vincent Tsai holding Taipei. Waltz, musette, swing — then you leave air for the guitar.",
    techniques: [
      {
        title: "Musette, then swing",
        body: "A waltz can open the night. When the pompe starts, you become another horn: melody, a chorus, then out.",
      },
      {
        title: "Bellows like bow",
        body: "Phrases, not a wall of treble. The guitar already has rest-stroke. You need air.",
      },
      {
        title: "Leave the two-and-four",
        body: "Do not pump with the rhythm guitar. That fight lives in the same midrange. Play the line, then drop out.",
      },
    ],
    tips: [
      "Ask the host. An accordion in a small café is loud without trying.",
      "Listen to Marcel Loeffler for the Alsatian chair, Dominique Paats for the Dutch/German one.",
      "Repair and teaching: Vincent’s Accordion Studio in Taipei is on this hub. No fake European accordion luthiers.",
    ],
  },
  mandolin: {
    name: "Mandolin",
    role: "Lead",
    blurb: "A lead chair in some rooms — mandolin in the Django book.",
    intro:
      "Mandolin sits in Brazilian Hot Club rooms and a few American ones. Victor Angeleas holds the lead chair of Gypsy Jazz Club in Brasília — mandolin and tenor guitar in the Django book, cavaquinho next door. Same changes as the guitar, a different attack. You take the theme, you take a chorus, you hand it back.",
    techniques: [
      {
        title: "Pick like a horn",
        body: "Downstrokes on the strong notes, air between phrases. Tremolo is a colour, not the whole language.",
      },
      {
        title: "Same book",
        body: "Minor Swing, All of Me, Dark Eyes. If you cannot sing the theme, do not take the chorus yet.",
      },
      {
        title: "The pompe is still the guitar",
        body: "Mandolin is a lead voice here, not a bluegrass chop. Leave two-and-four to the rhythm guitar.",
      },
    ],
    tips: [
      "Sit in after the first tune. Watch the host.",
      "Victor Angeleas with Gypsy Jazz Club is the living model on this hub.",
      "John Le Voi in Lincolnshire builds mandolin-family instruments as well as Selmer-style guitars.",
    ],
  },
  piano: {
    name: "Piano",
    role: "Harmony",
    blurb: "Not in the original quintet — a café piano that knows the book.",
    intro:
      "Gypsy jazz is a string music. A piano still sits in some rooms: Patil Zakarian arranging Django and Tchan-Tchou for solo piano, Bastien Brison with Fanou Torracinta, Ming-Hsuan Mao in Taipei next to harmonica. You are extra harmony, not a second pompe. If the guitar is already pumping, play melody or lay out.",
    techniques: [
      {
        title: "Do not double the pompe",
        body: "Left-hand two-and-four against a rhythm guitar is a traffic jam. Light comping, or melody, or silence.",
      },
      {
        title: "Guitar voicings, piano hands",
        body: "The changes are the same. Patil Zakarian’s La Gitane and Swing Gitan show how a waltz sits on the keys.",
      },
      {
        title: "The room’s piano first",
        body: "If it is in tune, use it. A stage keyboard is the fallback.",
      },
    ],
    tips: [
      "Ask the host. Many jams have no piano chair on purpose.",
      "Patil Zakarian teaches and posts piano-manouche arrangements — start there.",
      "This hub does not list piano techs yet. Write if you tune for jams.",
    ],
  },
  harmonica: {
    name: "Harmonica",
    role: "Horn",
    blurb: "A pocket reed — Django recorded with Larry Adler.",
    intro:
      "Django recorded with Larry Adler; those tunes still turn up on jam lists. Today the chair is chromatic and diatonic: Yen-Hua Wang on the Taiwanese and Brazilian festival bills, Finn Hauge with Hot Club de Norvège, Rory Hoffman on Joscho Stephan’s Transatlantic dates. You take a chorus like a horn, you leave space, you do not become a blues band.",
    techniques: [
      {
        title: "Melody first",
        body: "Minor Swing as a song, then the changes. Chromatic for the Django book; diatonic if you know which harp the key wants.",
      },
      {
        title: "One chorus, then air",
        body: "Same manners as the clarinet. The guitar already fills the top.",
      },
      {
        title: "A vocal mic is enough",
        body: "Cup a handheld into the band combo, or play acoustic. A blues-harp stack fights the pompe.",
      },
    ],
    tips: [
      "Ask the host. A harmonica is small and easy to miss — and easy to overplay.",
      "Yen-Hua Wang is a full-time harmonica teacher in Taipei. Jason Ricci’s Minor Swing lesson is a way into the book on a G Marine Band.",
      "Hohner and Seydel make the instruments. Repairs are harmonica techs, not guitar luthiers.",
    ],
  },
};

export function getInstrument(slug: string) {
  return INSTRUMENTS.find((item) => item.slug === slug);
}

export function isInstrumentSlug(slug: string): slug is InstrumentSlug {
  return (INSTRUMENT_SLUGS as readonly string[]).includes(slug);
}

export function schoolsForInstrument(inst: Instrument) {
  if (inst.schoolSlugs.length === 0) return [];
  return SCHOOLS.filter(
    (school) => !school.artistOnly && school.relatedSlugs.some((slug) => inst.schoolSlugs.includes(slug)),
  );
}

export function appsForInstrument(inst: Instrument) {
  if (inst.appSlugs.length === 0) return [];
  return APPS.filter((app) => inst.appSlugs.includes(app.slug));
}

export function teacherMatchesInstrument(instruments: string, note: string, inst: Instrument) {
  const hay = `${instruments} ${note}`.toLowerCase();
  if (!hay.trim()) return false;
  return inst.teacherNeedles.some((needle) => hay.includes(needle));
}

export function topicsForInstrument<T extends { title: string; body: string; replies?: number }>(
  topics: T[],
  inst: Instrument,
  copy: InstrumentCopy,
) {
  const needles = [...inst.teacherNeedles, copy.name.toLowerCase(), copy.role.toLowerCase(), inst.slug.replace(/-/g, " ")];
  const hit = topics.filter((topic) => {
    if ((topic.replies ?? 0) <= 0) return false;
    const hay = `${topic.title} ${topic.body}`.toLowerCase();
    return needles.some((needle) => needle.length > 2 && hay.includes(needle));
  });
  return hit.slice(0, 6);
}
