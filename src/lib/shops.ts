export type Shop = {
  slug: string;
  name: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  site: string;
  hours: string;
  bio: string;
  luthierSlug?: string;
};

export const SHOPS: Shop[] = [
  {
    slug: "tfoa",
    name: "The Fellowship of Acoustics (TFOA)",
    city: "Dedemsvaart",
    country: "Netherlands",
    address: "Moerheimstraat 144, 7701 CJ Dedemsvaart",
    phone: "+31 523 232 205",
    email: "info@tfoa.eu",
    site: "https://www.tfoa.eu",
    hours: "Mon–Fri 10:00–18:00 · Sat 10:00–17:00 · first Sunday of the month 11:00–17:00",
    bio: "Large acoustic specialist with a dedicated Gypsy Jazz section and regular stock of Selmer-style instruments. One of the best-known rooms in Europe for this.",
  },
  {
    slug: "django-guitars",
    name: "Django Guitars",
    city: "Laguna Beach",
    country: "United States",
    address: "1390 S Coast Highway, Suite A, Laguna Beach, CA 92651",
    phone: "+1 949 415 6172",
    email: "Tommy@DjangoGuitars.com",
    site: "https://djangoguitars.com",
    hours: "By appointment only — call or write first",
    bio: "Dedicated Gypsy jazz guitar shop on the California coast. New and vintage European instruments — Dupont, Favino, Busato and more — plus expert setups.",
  },
  {
    slug: "galerie-casanova",
    name: "Galerie Casanova",
    city: "Paris",
    country: "France",
    address: "17 Galerie Véro-Dodat, 75001 Paris",
    phone: "+33 1 42 33 38 93",
    email: "contact@galerie-casanova.com",
    site: "https://www.galerie-casanova.com",
    hours: "Wed–Sat 14:00–18:00, by appointment",
    bio: "Formerly R & F Charle. Legendary Paris shop in Galerie Véro-Dodat — one of the most important rooms in the world for original Selmer-Maccaferri and high-end Gypsy jazz guitars.",
  },
  {
    slug: "castelluccia-shop",
    name: "J. Castelluccia",
    city: "Paris",
    country: "France",
    address: "3 Rue de Constantinople, 75008 Paris",
    phone: "+33 1 43 87 39 50",
    email: "",
    site: "https://www.castelluccia.fr",
    hours: "Tue–Sat 14:30–18:30, by appointment",
    bio: "Historic family workshop specialising in Selmer-style Gypsy jazz guitars. Instruments can be viewed by appointment in Paris; the workshop also works from Honfleur.",
    luthierSlug: "castelluccia",
  },
  {
    slug: "gypsyguitar",
    name: "Gypsyguitar",
    city: "Kirchheim",
    country: "Germany",
    address: "Burkard 13, 97268 Kirchheim",
    phone: "+49 9366 99443",
    email: "info@gypsyguitar.de",
    site: "https://gypsyguitar.de",
    hours: "By appointment — write or call first",
    bio: "Norman Ort’s specialist shop for Gypsy jazz guitars — focused stock, setups and the Selmer-Maccaferri line.",
  },
  {
    slug: "musik-heckmann",
    name: "Musik Heckmann",
    city: "Karlsfeld",
    country: "Germany",
    address: "Südenstraße 20, 85757 Karlsfeld",
    phone: "+49 8131 96583",
    email: "info@musik-heckmann.de",
    site: "https://www.musik-heckmann.de",
    hours: "Mon, Thu, Fri 10:00–12:00 & 14:30–18:00 · Sat 10:00–13:00 · also by appointment",
    bio: "Near Munich. Regularly stocks Geronimo Mateos and other Gypsy jazz models — a working shop, not only a workshop.",
  },
  {
    slug: "london-guitar-studio",
    name: "London Guitar Studio",
    city: "London",
    country: "United Kingdom",
    address: "62 Duke Street, London W1K 6JT",
    phone: "+44 20 7493 1157",
    email: "info@londonguitarstudio.com",
    site: "https://www.londonguitarstudio.com",
    hours: "Mon–Thu 10:00–17:00 · Fri 10:00–16:00 · Sat 10:00–17:00 · Sun 10:00–16:00",
    bio: "Stocks a range of Selmer-style Gypsy jazz guitars, including Geronimo Mateos and others, in central London.",
  },
  {
    slug: "the-guitar-bar",
    name: "The Guitar Bar",
    city: "Antwerp",
    country: "Belgium",
    address: "Lange Koepoortstraat 63, 2000 Antwerp",
    phone: "+32 3 232 00 29",
    email: "info@theguitarbar.be",
    site: "https://www.theguitarbar.be",
    hours: "Tue, Thu–Sat 11:00–18:00 · Wed 11:00–19:00 · closed Sun–Mon",
    bio: "Antwerp shop known for Gypsy jazz related instruments and accessories.",
  },
];

const COUNTRY_ORDER = [
  "Netherlands",
  "United States",
  "France",
  "Germany",
  "United Kingdom",
  "Belgium",
];

export function getShop(slug: string) {
  return SHOPS.find((row) => row.slug === slug);
}

export function shopsByCountry() {
  const present = [...new Set(SHOPS.map((row) => row.country))];
  const lead = COUNTRY_ORDER.filter((name) => present.includes(name));
  const rest = present.filter((name) => !lead.includes(name)).sort((a, b) => a.localeCompare(b));
  return [...lead, ...rest].map((country) => ({
    country,
    shops: SHOPS.filter((row) => row.country === country).sort((a, b) => a.name.localeCompare(b.name)),
  }));
}
