import type { ScanFind, ScanVenue } from "@/lib/discovery";

/**
 * Daily scan drops finds here. The hub imports them:
 * two sources → calendar / venues page; one source → owner desk (held).
 * Do not invent dates or rooms. Every source URL must be real.
 */
export const SCAN_QUEUE: ScanFind[] = [
  {
    title: "Mozes Rosenberg Trio",
    artistName: "Mozes Rosenberg",
    artistSlug: "mozes-rosenberg",
    venue: "Podium 't Beest",
    city: "Goes",
    country: "Netherlands",
    startsAt: "2026-09-27T14:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
      {
        kind: "venue",
        url: "https://muziekpodiumzeeland.nl/evenement/mozes-rosenberg-trio/",
        label: "Muziekpodium Zeeland",
      },
    ],
  },
  {
    title: "The Chaplin Project by the Stochelo & Mozes Rosenberg Trio",
    artistName: "Stochelo & Mozes Rosenberg Trio",
    artistSlug: "stochelo-rosenberg",
    venue: "Pärimusmuusika Ait",
    city: "Viljandi",
    country: "Estonia",
    startsAt: "2026-10-09T15:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
      {
        kind: "festival_official",
        url: "https://viljandiguitar.ee/event/thechaplinproject/",
        label: "Viljandi Guitar Festival",
      },
    ],
  },
  {
    title: "Gismo Graf Trio feat. Stochelo Rosenberg",
    artistName: "Gismo Graf Trio",
    artistSlug: "gismo-graf",
    venue: "Jazzinitiative Schwetzingen",
    city: "Schwetzingen",
    country: "Germany",
    startsAt: "2026-10-31T19:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
      {
        kind: "venue",
        url: "https://jazzinitiative-schwetzingen.de/kalender/",
        label: "Jazzinitiative Schwetzingen",
      },
    ],
  },
  {
    title: "Mozes Rosenberg Trio",
    artistName: "Mozes Rosenberg",
    artistSlug: "mozes-rosenberg",
    venue: "Cultuurhuis Heerlen",
    city: "Heerlen",
    country: "Netherlands",
    startsAt: "2026-11-26T19:30:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
      {
        kind: "venue",
        url: "https://www.cultuurhuisheerlen.nl/programma/mozes-rosenberg-trio",
        label: "Cultuurhuis Heerlen",
      },
    ],
  },
  {
    title: "The Stochelo & Mozes Rosenberg Trio",
    artistName: "Stochelo & Mozes Rosenberg Trio",
    artistSlug: "stochelo-rosenberg",
    venue: "Cube 521",
    city: "Clervaux",
    country: "Luxembourg",
    startsAt: "2026-11-27T19:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
      {
        kind: "venue",
        url: "https://www.cube521.lu/fr/event/stochelo-rosenberg-trio/1182",
        label: "Cube 521",
      },
    ],
  },
  {
    title: "Het Stochelo & Mozes Rosenberg Trio",
    artistName: "Stochelo & Mozes Rosenberg Trio",
    artistSlug: "stochelo-rosenberg",
    venue: "Rabo Cultuurzaal",
    city: "Deurne",
    country: "Netherlands",
    startsAt: "2026-12-04T19:30:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
      {
        kind: "venue",
        url: "https://www.ccdeurne.nl/programma/het-stochelo-mozes-rosenberg-trio/",
        label: "Cultuurcentrum Deurne",
      },
    ],
  },
  {
    title: "Djangofest Northwest",
    artistName: "Djangofest Northwest",
    artistSlug: "",
    venue: "Whidbey Island Center for the Arts",
    city: "Langley",
    country: "United States of America",
    startsAt: "2026-09-15T19:00:00.000Z",
    festivalSlug: "djangofest-northwest",
    sources: [
      {
        kind: "festival_official",
        url: "https://www.djangofest.com/",
        label: "Djangofest Northwest",
      },
    ],
  },
  {
    title: "Paulus Schäfer",
    artistName: "Paulus Schäfer",
    artistSlug: "paulus-schafer",
    venue: "The Dance Hall",
    city: "Kittery",
    country: "United States of America",
    startsAt: "2026-10-02T23:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    title: "Paulus Schäfer",
    artistName: "Paulus Schäfer",
    artistSlug: "paulus-schafer",
    venue: "Shrewsbury Django Fest",
    city: "Shrewsbury",
    country: "United Kingdom",
    startsAt: "2026-10-23T18:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    title: "Mozes Rosenberg Trio",
    artistName: "Mozes Rosenberg",
    artistSlug: "mozes-rosenberg",
    venue: "Podium Kunst",
    city: "Sint Tunnis",
    country: "Netherlands",
    startsAt: "2026-10-18T14:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    title: "Mozes Rosenberg Trio",
    artistName: "Mozes Rosenberg",
    artistSlug: "mozes-rosenberg",
    venue: "Kunstmaand Ameland",
    city: "Nes",
    country: "Netherlands",
    startsAt: "2026-11-07T18:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    title: "Mozes Rosenberg Trio",
    artistName: "Mozes Rosenberg",
    artistSlug: "mozes-rosenberg",
    venue: "Espace George Sand",
    city: "Checy",
    country: "France",
    startsAt: "2026-12-17T18:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    title: "Stochelo & Mozes Rosenberg Trio feat. Ludovic Beier",
    artistName: "Stochelo & Mozes Rosenberg Trio",
    artistSlug: "stochelo-rosenberg",
    venue: "Catharinakapel",
    city: "Harderwijk",
    country: "Netherlands",
    startsAt: "2026-10-15T18:00:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
      {
        kind: "venue",
        url: "https://catharinakapel.nl/productie/stochelo-mozes-rosenberg-trio/",
        label: "Catharinakapel",
      },
    ],
  },
  {
    title: "Stéphane Wrembel — Django L'Impressionniste",
    artistName: "Stéphane Wrembel",
    artistSlug: "stephane-wrembel",
    venue: "Guarneri Hall",
    city: "Chicago",
    country: "United States of America",
    startsAt: "2026-09-24T23:30:00.000Z",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.stephanewrembel.com/",
        label: "Stéphane Wrembel",
      },
    ],
  },
  {
    title: "Dario Napoli Trio",
    artistName: "Dario Napoli",
    artistSlug: "dario-napoli",
    venue: "William G. Lunney Lake Farm County Park",
    city: "Madison",
    country: "United States of America",
    startsAt: "2026-09-13T01:00:00.000Z",
    festivalSlug: "midwest-gypsy-swing-fest",
    sources: [
      {
        kind: "festival_official",
        url: "https://midwestdjangofestival.com/",
        label: "Midwest Django Fest",
      },
      {
        kind: "artist_site",
        url: "https://www.facebook.com/DarioNapoliGuitar/posts/1732876258453602/",
        label: "Dario Napoli",
      },
    ],
  },
  {
    title: "Asheville Djangofest",
    artistName: "Stéphane Wrembel",
    artistSlug: "stephane-wrembel",
    venue: "Kittredge Theatre",
    city: "Swannanoa",
    country: "United States of America",
    startsAt: "2026-10-24T23:00:00.000Z",
    festivalSlug: "asheville-djangofest",
    sources: [
      {
        kind: "artist_site",
        url: "https://www.stephanewrembel.com/",
        label: "Stéphane Wrembel",
      },
      {
        kind: "listing",
        url: "https://www.eventbrite.com/e/asheville-djangofest-tickets-1992387859722",
        label: "Eventbrite",
      },
    ],
  },
];

export const VENUE_QUEUE: ScanVenue[] = [
  {
    name: "Podium 't Beest",
    city: "Goes",
    country: "Netherlands",
    kind: "Hall",
    site: "https://muziekpodiumzeeland.nl/",
    bio: "Goes. Muziekpodium Zeeland — Mozes Rosenberg Trio and the Zeeland jazz run.",
    scene: "jazz",
    sources: [
      {
        kind: "venue",
        url: "https://muziekpodiumzeeland.nl/",
        label: "Muziekpodium Zeeland",
      },
      {
        kind: "listing",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    name: "Cultuurhuis Heerlen",
    city: "Heerlen",
    country: "Netherlands",
    kind: "Hall",
    site: "https://www.cultuurhuisheerlen.nl/",
    bio: "Heerlen. Parkstad hall — Mozes Rosenberg Trio on the Limburg run.",
    scene: "jazz",
    sources: [
      {
        kind: "venue",
        url: "https://www.cultuurhuisheerlen.nl/",
        label: "Cultuurhuis Heerlen",
      },
      {
        kind: "listing",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    name: "Cube 521",
    city: "Clervaux",
    country: "Luxembourg",
    kind: "Hall",
    site: "https://www.cube521.lu/",
    bio: "Clervaux. Luxembourg concert hall — Stochelo & Mozes Rosenberg Trio.",
    scene: "jazz",
    sources: [
      {
        kind: "venue",
        url: "https://www.cube521.lu/",
        label: "Cube 521",
      },
      {
        kind: "listing",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    name: "Cultuurcentrum Deurne",
    city: "Deurne",
    country: "Netherlands",
    kind: "Hall",
    site: "https://www.ccdeurne.nl/",
    bio: "Deurne. Rabo Cultuurzaal — Stochelo & Mozes Rosenberg Trio.",
    scene: "jazz",
    sources: [
      {
        kind: "venue",
        url: "https://www.ccdeurne.nl/",
        label: "Cultuurcentrum Deurne",
      },
      {
        kind: "listing",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    name: "Pärimusmuusika Ait",
    city: "Viljandi",
    country: "Estonia",
    kind: "Hall",
    site: "https://viljandiguitar.ee/",
    bio: "Viljandi. Home of Viljandi Guitar Festival — Chaplin Project with the Rosenberg brothers.",
    scene: "gypsy",
    sources: [
      {
        kind: "festival_official",
        url: "https://viljandiguitar.ee/",
        label: "Viljandi Guitar Festival",
      },
      {
        kind: "listing",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
  {
    name: "Jazzinitiative Schwetzingen",
    city: "Schwetzingen",
    country: "Germany",
    kind: "Club",
    site: "https://jazzinitiative-schwetzingen.de/",
    bio: "Schwetzingen. Jazztage — Gismo Graf Trio with Stochelo Rosenberg.",
    scene: "gypsy",
    sources: [
      {
        kind: "venue",
        url: "https://jazzinitiative-schwetzingen.de/",
        label: "Jazzinitiative Schwetzingen",
      },
      {
        kind: "listing",
        url: "https://www.sintimusic.nl/en/shows/",
        label: "Sinti Music",
      },
    ],
  },
];
