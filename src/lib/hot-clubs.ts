export type HotClubKind = "foundation" | "society" | "band" | "venue";

export type HotClub = {
  slug: string;
  name: string;
  country: string;
  city: string;
  site: string;
  kind: HotClubKind;
  featured?: boolean;
  bio: string;
};

/** Hot Club = the old name for this music. Foundations, societies, and groups that put on Gypsy Jazz evenings. */
export const HOT_CLUBS: HotClub[] = [
  {
    slug: "hcdf-nederland",
    name: "Stichting Hot Club de France Nederland",
    country: "Netherlands",
    city: "Ophemert",
    site: "https://hcdf.nl/",
    kind: "foundation",
    featured: true,
    bio: "Dutch Gypsy Jazz foundation, founded 1983 by a handful of enthusiasts when live Hot Club music was almost gone (they count WASO in Belgium among the few bands then). First concert: the WASO Quartet; Django’s Nuages was on the radio at the founding meeting. They keep a quarterly magazine, De Quintette, a newsletter, and a donor list. For years they put on two concert afternoons a year (Schenkerij De Beurs, Geldermalsen, for about eleven years — that house ended the collaboration in 2026, so their own spring concert is paused). They point to jams in the big cities and report the scene: about 100 Hot Club bands and more than 100 jams a year in the Netherlands. Write them, join as a donor: hcdf.nl · contact@hcdf.nl · Facebook @hcdfnederland",
  },
  {
    slug: "hot-club-de-france",
    name: "Hot Club de France",
    country: "France",
    city: "Paris",
    site: "https://www.hot-club.asso.fr/",
    kind: "society",
    featured: true,
    bio: "The original jazz society (1932). Django’s quintet took this name. Today they promote authentic jazz, concerts and a bulletin — not only Gypsy Jazz, but the house the Hot Club name comes from. hot-club.asso.fr",
  },
  {
    slug: "hot-club-de-lyon",
    name: "Hot Club de Lyon",
    country: "France",
    city: "Lyon",
    site: "https://www.hotclubjazzlyon.com/",
    kind: "venue",
    bio: "Europe’s oldest jazz club still running (1948), vaulted cellar on the Presqu’île. All jazz including gypsy nights and weekly jams. A Hot Club evening here means live jazz — write them for a Manouche bill. hotclubjazzlyon.com",
  },
  {
    slug: "hot-club-de-norvege",
    name: "Hot Club de Norvège",
    country: "Norway",
    city: "Oslo",
    site: "https://hotclub.no/",
    kind: "band",
    bio: "Jon Larsen’s quartet since 1979 — Norway’s string-swing house. He left the performing chair in 2019; Ola Erlien and Gildas Le Pape play guitar now, with Finn Hauge and Svein Aarbostad. They built Djangofestivalen at Cosmopolite (next: 21–23 January 2027). Concerts, not a weekly open jam. hotclub.no",
  },
  {
    slug: "hot-club-of-san-francisco",
    name: "Hot Club of San Francisco",
    country: "United States of America",
    city: "San Francisco",
    site: "https://www.hotclubsf.com/",
    kind: "band",
    bio: "Paul Mehling’s West Coast Hot Club. Concerts and tours in the Django language. hotclubsf.com",
  },
  {
    slug: "hot-club-of-los-angeles",
    name: "Hot Club of Los Angeles",
    country: "United States of America",
    city: "Los Angeles",
    site: "https://www.hotclubofla.com/",
    kind: "band",
    bio: "LA gypsy jazz quintet — Django-style 1930s swing, French and Roma songs. Concerts and hotel/private evenings. hotclubofla.com",
  },
  {
    slug: "hot-club-of-detroit",
    name: "Hot Club of Detroit",
    country: "United States of America",
    city: "Detroit",
    site: "",
    kind: "band",
    bio: "Evan Perri’s Detroit Hot Club. Concerts in the Django language with accordion and reeds.",
  },
  {
    slug: "hot-club-srq",
    name: "Hot Club of SRQ",
    country: "United States of America",
    city: "Sarasota",
    site: "https://www.hotclubsrq.com/",
    kind: "band",
    bio: "Sarasota gypsy jazz — hotel and concert evenings in the Quintette language. hotclubsrq.com",
  },
  {
    slug: "hot-club-of-berlin",
    name: "Hot Club of Berlin",
    country: "Germany",
    city: "Berlin",
    site: "https://thehotclubofberlin.com/",
    kind: "band",
    bio: "Berlin acoustic Hot Club — Francisco Batista and Thomas Dekas. Concerts in the Django / Grappelli language. thehotclubofberlin.com",
  },
  {
    slug: "hot-club-of-valletta",
    name: "Hot Club of Valletta",
    country: "Malta",
    city: "Valletta",
    site: "https://www.facebook.com/hotclubofvalletta/",
    kind: "band",
    bio: "Malta’s Jazz Manouche group — George Curmi (il-Pusè) violin and sax. Concerts in Valletta theatres and festival midday sets. A Hot Club evening in the capital.",
  },
  {
    slug: "hot-club-de-finlande",
    name: "Hot Club de Finlande",
    country: "Finland",
    city: "Helsinki",
    site: "",
    kind: "band",
    bio: "Ari-Jukka Luomaranta (AJL Guitars) and Finnish soloists. Concerts in the Django language — Finland’s Hot Club chair.",
  },
  {
    slug: "hot-club-of-manila",
    name: "Hot Club of Manila",
    country: "Philippines",
    city: "Manila",
    site: "https://www.facebook.com/hotclubofmanila/",
    kind: "band",
    bio: "Manila gypsy jazz — Franz Morales, Kakoy Legaspi, Jing Reyna-Jorge. Concerts when posted (19 East, Malate). Facebook @hotclubofmanila",
  },
  {
    slug: "hot-club-de-hong-kong",
    name: "Hot Club de Hong Kong",
    country: "China",
    city: "Hong Kong",
    site: "https://www.makemusichk.com/programs/2025-edition/hot-club-de-hong-kong/",
    kind: "band",
    bio: "Simon Choi and Neil Lau — the city’s working gypsy jazz band. Allure Music Salon, Tai Hang, Fringe Club, Make Music Hong Kong. Instagram @hotclubdehk",
  },
  {
    slug: "hot-club-de-piracicaba",
    name: "Hot Club de Piracicaba",
    country: "Brazil",
    city: "Piracicaba",
    site: "",
    kind: "band",
    bio: "José Fernando Seifarth’s Brazilian Hot Club and the Festival Jazz Manouche de Piracicaba.",
  },
  {
    slug: "hot-club-de-frank",
    name: "Hot Club de Frank",
    country: "Netherlands",
    city: "Amsterdam",
    site: "",
    kind: "band",
    bio: "Frank Meester’s Amsterdam gypsy-swing quartet — North Sea Jazz, Montreux, Kaptein Zeppos. A Dutch Hot Club evening, not the foundation.",
  },
  {
    slug: "hot-club-of-buffalo",
    name: "Hot Club of Buffalo",
    country: "United States of America",
    city: "Buffalo",
    site: "https://www.hotclubofbuffalo.com/",
    kind: "band",
    bio: "Four-piece gypsy jazz from Buffalo, NY. Concerts, hotels and Pausa Art House. hotclubofbuffalo.com",
  },
  {
    slug: "hot-club-medellin",
    name: "Hot Club Medellín",
    country: "Colombia",
    city: "Medellín",
    site: "",
    kind: "band",
    bio: "Dorkis’s Colombian Hot Club and Django Festival Colombia. Concerts when posted.",
  },
  {
    slug: "hot-club-of-belgrade",
    name: "Hot Club of Belgrade",
    country: "Serbia",
    city: "Belgrade",
    site: "",
    kind: "band",
    bio: "Dejan Krsmanović and the Belgrade Django group. Nights at Gypsy Jazz Club, Kičevska 21.",
  },
  {
    slug: "hot-clube-de-portugal",
    name: "Hot Clube de Portugal",
    country: "Portugal",
    city: "Lisbon",
    site: "https://www.hcp.pt/",
    kind: "venue",
    bio: "Lisbon’s historic jazz club. All jazz, including gypsy bills — a house that already books the music.",
  },
];

export function hotClubsForCountry(country: string) {
  const key = country.trim().toLowerCase();
  return HOT_CLUBS.filter((club) => club.country.toLowerCase() === key);
}
