export type CampKind = "camp" | "workshop";

export type Camp = {
  slug: string;
  name: string;
  city: string;
  country: string;
  when: string;
  nextStartsAt: string;
  site: string;
  hostSlugs: string[];
  teacherSlugs: string[];
  bio: string;
  kind?: CampKind;
};

export function campKind(camp: Camp): CampKind {
  return camp.kind ?? "camp";
}

export const CAMPS: Camp[] = [
  {
    slug: "grappelli-django-summer-camp",
    name: "Grappelli-Django Summer Camp",
    city: "Biezenmortel",
    country: "Netherlands",
    when: "20–23 August 2026",
    nextStartsAt: "2026-08-20T09:00:00.000Z",
    site: "https://www.grappellidjangocamp.com/summercamp/",
    hostSlugs: ["tim-kliphuis"],
    teacherSlugs: ["tim-kliphuis", "gismo-graf"],
    bio: "Tim Kliphuis's camp — Europe's leading gypsy jazz workshop week for violin, guitar and bass. This summer Gismo Graf is the Sinti guitar chair, with Aurélien Guyot on violin. All levels. De Beukenhof, Biezenmortel.",
  },
  {
    slug: "full-immersion-camp",
    name: "Gypsy Jazz Full Immersion",
    city: "Abbiategrasso",
    country: "Italy",
    when: "25–27 September 2026",
    nextStartsAt: "2026-09-25T09:00:00.000Z",
    site: "https://darionapoli.com/gypsy-jazz-full-immersion-weekend/",
    hostSlugs: ["dario-napoli", "benji-winterstein"],
    teacherSlugs: ["dario-napoli", "benji-winterstein"],
    bio: "Dario Napoli and Benji Winterstein's three-day camp near Milan. Classes by day, jam after — guitar students sitting with the trio.",
  },
  {
    slug: "under-the-tuscan-sun",
    name: "Under the Tuscan Sun Gypsy Jazz Camp",
    city: "Tuscany",
    country: "Italy",
    when: "11–14 June 2026",
    nextStartsAt: "2027-06-11T08:00:00.000Z",
    site: "https://www.darionapolicamp.com/",
    hostSlugs: ["dario-napoli"],
    teacherSlugs: ["dario-napoli"],
    bio: "Dario Napoli’s gypsy jazz camp in Tuscany. 11th edition 11–14 June 2026. Next June.",
  },
  {
    slug: "camp-django",
    name: "Camp Django",
    city: "United States",
    country: "United States of America",
    when: "October 2026",
    nextStartsAt: "2026-10-09T14:00:00.000Z",
    site: "https://learngypsyjazz.com/camp-django",
    hostSlugs: ["paulus-schafer", "tim-kliphuis"],
    teacherSlugs: ["paulus-schafer", "tim-kliphuis"],
    bio: "A student camp built around Django and Grappelli's language. Paulus Schäfer on guitar, Tim Kliphuis on violin — workshops, jams and a concert night.",
  },
  {
    slug: "grappelli-django-winter-jam",
    name: "Grappelli-Django Winter Jam",
    city: "Biezenmortel",
    country: "Netherlands",
    when: "7–10 January 2027",
    nextStartsAt: "2027-01-07T09:00:00.000Z",
    site: "https://www.grappellidjangocamp.com/winter-jam/",
    hostSlugs: ["tim-kliphuis"],
    teacherSlugs: ["tim-kliphuis"],
    bio: "Tim Kliphuis's smaller winter course. Intermediate and advanced violin, guitar and bass — ensemble playing in De Beukenhof.",
  },
  {
    slug: "django-a-gogo-camp",
    name: "Django à Gogo guitar camp",
    city: "New York",
    country: "United States of America",
    when: "Spring 2027",
    nextStartsAt: "2027-03-12T14:00:00.000Z",
    site: "http://www.djangoagogo.com/",
    hostSlugs: ["stephane-wrembel"],
    teacherSlugs: ["stephane-wrembel", "gismo-graf", "angelo-debarre"],
    bio: "Stéphane Wrembel's guitar camp. Gismo Graf, Angelo Debarre and the American school in the classrooms — concert night, then the camp stays up.",
  },
  {
    slug: "django-in-june-workshops",
    name: "Django in June workshops",
    city: "Northampton, Massachusetts",
    country: "United States of America",
    when: "June 2027",
    nextStartsAt: "2027-06-08T14:00:00.000Z",
    site: "https://djangoinjune.com/",
    hostSlugs: ["denis-chang"],
    teacherSlugs: ["denis-chang", "dario-napoli", "stephane-wrembel", "nuno-marinho"],
    kind: "workshop",
    bio: "The American amateur week. Workshops by day, jams by night. Denis Chang's school and visiting European chairs.",
  },
  {
    slug: "sinti-jazz-guitar-camp",
    name: "Sinti Jazz Guitar Camp",
    city: "Gerwen",
    country: "Netherlands",
    when: "June 2027",
    nextStartsAt: "2027-06-15T09:00:00.000Z",
    site: "http://www.paulusschafer.com/",
    hostSlugs: ["paulus-schafer", "stochelo-rosenberg"],
    teacherSlugs: [
      "paulus-schafer",
      "stochelo-rosenberg",
      "mozes-rosenberg",
      "romino-grunholz",
      "christiaan-van-hemert",
    ],
    bio: "Paulus Schäfer and Stochelo Rosenberg's camp in Gerwen — learn from the Dutch Sinti at the capital of gypsy jazz. Workshops, one-to-one lessons, jams. Bring a guitar. Caravan, camper or tent.",
  },
  {
    slug: "django-portugal-camp",
    name: "Django Portugal Camp",
    city: "Vila Viçosa",
    country: "Portugal",
    when: "28 April – 2 May 2027",
    nextStartsAt: "2027-04-28T09:00:00.000Z",
    site: "https://festivaldjangoportugal.pt/gypsyjazzcamp/",
    hostSlugs: ["nuno-marinho", "marian-yanchyk"],
    teacherSlugs: ["nuno-marinho", "marian-yanchyk"],
    bio: "The first gypsy jazz camp in Portugal. Nuno Marinho (guitar) and Marian Yanchyk (violin) in Vila Viçosa — rhythm in the morning, soloing after lunch, one-to-one, jams after dinner. All instruments. Pool, olive trees, Alentejo. Suites, shared rooms or camping.",
  },
  {
    slug: "shrewsbury-django-workshops",
    name: "Shrewsbury Django Fest workshops",
    city: "Shrewsbury",
    country: "United Kingdom",
    when: "21–26 October 2026",
    nextStartsAt: "2026-10-21T08:00:00.000Z",
    site: "https://www.gypsyjazzretreats.com/sign-up-earlybird2026",
    hostSlugs: ["paulus-schafer", "olli-soikkeli", "christiaan-van-hemert"],
    teacherSlugs: ["paulus-schafer", "olli-soikkeli", "christiaan-van-hemert", "john-wheatcroft", "chris-quinn"],
    kind: "workshop",
    bio: "Gypsy Jazz Retreats running with Shrewsbury Django Fest. Paulus Schäfer, Olli Soikkeli, Christiaan van Hemert, Chris Quinn and John Wheatcroft — small groups by day, festival nights after.",
  },
  {
    slug: "djangofest-northwest-workshops",
    name: "Djangofest Northwest workshops",
    city: "Langley",
    country: "United States of America",
    when: "15–20 September 2026",
    nextStartsAt: "2026-09-15T16:00:00.000Z",
    site: "https://www.djangofest.com/",
    hostSlugs: ["paulus-schafer"],
    teacherSlugs: ["paulus-schafer"],
    kind: "workshop",
    bio: "Workshops all week at Djangofest Northwest on Whidbey Island. Classes by day, concerts at night — the American west-coast amateur week.",
  },
  {
    slug: "djangofest-mill-valley-workshops",
    name: "DjangoFest Mill Valley workshops",
    city: "Mill Valley",
    country: "United States of America",
    when: "24–27 September 2026",
    nextStartsAt: "2026-09-24T16:00:00.000Z",
    site: "https://www.throckmortontheatre.org/djangofest-mill-valley",
    hostSlugs: ["gismo-graf", "tim-kliphuis"],
    teacherSlugs: ["gismo-graf", "tim-kliphuis"],
    kind: "workshop",
    bio: "Workshops at 142 Throckmorton. Gismo Graf, Tim Kliphuis, Jimmy Grant and the billed players — students in the room by day, the theatre at night.",
  },
  {
    slug: "nuno-marinho-saturday-workshops",
    name: "Nuno Marinho Saturday workshops",
    city: "Online",
    country: "Portugal",
    when: "Every Saturday, 15:00 UTC",
    nextStartsAt: "2026-08-22T15:00:00.000Z",
    site: "https://www.nunomarinho.com/gypsy-jazz-workshops/",
    hostSlugs: ["nuno-marinho"],
    teacherSlugs: ["nuno-marinho"],
    kind: "workshop",
    bio: "Live Zoom sessions with Nuno Marinho every Saturday at 15:00 UTC. Ninety minutes on the guitar and the music. Patreon and Discord for the room.",
  },
  {
    slug: "gismo-graf-gypsy-guitar-weekend",
    name: "Gypsy Guitar Weekend",
    city: "Stuttgart",
    country: "Germany",
    when: "June 2027",
    nextStartsAt: "2027-06-05T08:00:00.000Z",
    site: "https://www.gypsyguitar-weekend.de/",
    hostSlugs: ["gismo-graf"],
    teacherSlugs: ["gismo-graf"],
    kind: "workshop",
    bio: "Gismo Graf's guitar weekend in Stuttgart — the German Sinti school in the room. Two days of workshops, then the concert.",
  },
  {
    slug: "malaga-manouche-djangocamp",
    name: "Málaga Manouche DjangoCamp",
    city: "Frigiliana",
    country: "Spain",
    when: "23–25 October 2026",
    nextStartsAt: "2026-10-23T07:00:00.000Z",
    site: "https://frigiliana.es/malaga-manouche/",
    hostSlugs: ["tim-kliphuis", "adrien-tarraga", "eva-slongo", "jimmy-grant"],
    teacherSlugs: ["tim-kliphuis", "adrien-tarraga", "eva-slongo", "jimmy-grant"],
    kind: "camp",
    bio: "Three days in Frigiliana (Málaga): workshops, masterclasses, combos, jams and concerts at Casa del Apero. Tim Kliphuis, Adrien Tarraga, Eva Slongo, Jimmy Grant. malaga_manouche / frigiliana.es.",
  },
];

export function getCamp(slug: string) {
  return CAMPS.find((camp) => camp.slug === slug);
}

export function upcomingCamps(now = Date.now()) {
  return CAMPS.filter((camp) => new Date(camp.nextStartsAt).getTime() >= now - 86_400_000).sort(
    (a, b) => new Date(a.nextStartsAt).getTime() - new Date(b.nextStartsAt).getTime(),
  );
}

export function campsForArtist(slug: string) {
  return upcomingCamps().filter(
    (camp) => camp.hostSlugs.includes(slug) || camp.teacherSlugs.includes(slug),
  );
}
