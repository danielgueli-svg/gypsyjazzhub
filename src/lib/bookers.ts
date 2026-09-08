export type Booker = {
  name: string;
  role: string;
  url: string;
  email?: string;
};

export const BOOKERS_BY_ARTIST: Record<string, Booker> = {
  "stochelo-rosenberg": {
    name: "Sinti Music",
    role: "Booking — Jos Vesters",
    url: "https://www.sintimusic.nl/en/artists/stochelo-rosenberg/",
    email: "jos@sintimusic.nl",
  },
  "mozes-rosenberg": {
    name: "Sinti Music",
    role: "Booking — Jos Vesters",
    url: "https://www.sintimusic.nl/en/artists/mozes-rosenberg/",
    email: "jos@sintimusic.nl",
  },
  "paulus-schafer": {
    name: "Sinti Music",
    role: "Booking — Jos Vesters",
    url: "https://www.sintimusic.nl/en/artists/paulus-schafer/",
    email: "jos@sintimusic.nl",
  },
  "tchavolo-schmitt": {
    name: "Zaman Production",
    role: "Booking",
    url: "http://zamanproduction.com/",
    email: "booking@zamanproduction.com",
  },
  "amati-schmitt": {
    name: "MCM Marinella Colombo Management",
    role: "Booking",
    url: "https://www.facebook.com/Mcmbooking/",
  },
  "dorado-schmitt": {
    name: "MCM Marinella Colombo Management",
    role: "Booking",
    url: "https://www.facebook.com/Mcmbooking/",
  },
  "joscho-stephan": {
    name: "Joscho Stephan",
    role: "Official site",
    url: "https://joschostephan.com/",
  },
  "tim-kliphuis": {
    name: "Tim Kliphuis",
    role: "Official site",
    url: "https://timkliphuis.com/",
  },
  "marion-lenfant-preus": {
    name: "Marion & Sobo Band",
    role: "Booking",
    url: "https://marionandsobo.com/",
    email: "mail@alexandersobocinski.com",
  },
  "alexander-sobocinski": {
    name: "Marion & Sobo Band",
    role: "Booking",
    url: "https://marionandsobo.com/",
    email: "mail@alexandersobocinski.com",
  },
  "dario-napoli": {
    name: "Dario Napoli",
    role: "Official site",
    url: "https://darionapoli.com/",
  },
  "gismo-graf": {
    name: "Gismo Graf",
    role: "Official site",
    url: "https://www.gismo-graf.de/",
  },
};

export function bookerFor(slug: string) {
  return BOOKERS_BY_ARTIST[slug] ?? null;
}
