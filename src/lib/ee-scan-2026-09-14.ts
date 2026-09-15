import type { Venue } from "@/lib/venues";
import type { Jam } from "@/lib/jams";

type ConcertSeed = {
  legend_slug: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  starts_at: string;
  is_historic: boolean;
  note: string;
};

export const EE_SCAN_CONCERTS: ConcertSeed[] = [
  {
    legend_slug: "angelo-debarre",
    title: "Django Donegal — Angelo Debarre Trio with Alexandre Cavaliere",
    venue: "Regional Cultural Centre",
    city: "Letterkenny",
    country: "Ireland",
    starts_at: "2026-10-03T19:00:00.000Z",
    is_historic: false,
    note: "Saturday 3 October 20:00. Tickets https://regionalculturalcentre.com/events/django-donegal-angelo-debarre-trio-with-alexandre-cavaliere/",
  },
  {
    legend_slug: "alexandre-cavaliere",
    title: "Django Donegal — Angelo Debarre Trio with Alexandre Cavaliere",
    venue: "Regional Cultural Centre",
    city: "Letterkenny",
    country: "Ireland",
    starts_at: "2026-10-03T19:00:00.000Z",
    is_historic: false,
    note: "Saturday 3 October 20:00. Tickets https://regionalculturalcentre.com/events/django-donegal-angelo-debarre-trio-with-alexandre-cavaliere/",
  },
  {
    legend_slug: "robert-karpati",
    title: "Roby Lakatos & Gypsy Jazz Band",
    venue: "Hangvilla",
    city: "Veszprém",
    country: "Hungary",
    starts_at: "2026-10-10T17:00:00.000Z",
    is_historic: false,
    note: "Saturday 10 October 2026, 19:00. Hangvilla, Brusznyai Árpád utca 2. Guests Myriam Lakatos, Hernádi Judit, Tarján Zsófi. veszpreminfo.hu / megegykort.com",
  },
  {
    legend_slug: "roby-lakatos",
    title: "Roby Lakatos & Gypsy Jazz Band",
    venue: "Hangvilla",
    city: "Veszprém",
    country: "Hungary",
    starts_at: "2026-10-10T17:00:00.000Z",
    is_historic: false,
    note: "19:00. Hangvilla, Veszprém. Guests Myriam Lakatos, Hernádi Judit, Tarján Zsófi.",
  },
  {
    legend_slug: "georgiy-yashagashvili",
    title: "Django Friends",
    venue: "Kozlov Club Unplugged",
    city: "Moscow",
    country: "Russia",
    starts_at: "2026-09-18T15:00:00.000Z",
    is_historic: false,
    note: "Friday 18 September 2026, 18:00. Kozlov Club Unplugged, Myasnitskaya 15.",
  },
  {
    legend_slug: "lu-golovina",
    title: "Django Friends",
    venue: "Kozlov Club Unplugged",
    city: "Moscow",
    country: "Russia",
    starts_at: "2026-09-18T15:00:00.000Z",
    is_historic: false,
    note: "18:00. Same night as Georgiy Yashagashvili’s Django Friends bill.",
  },
  {
    legend_slug: "tamas-szakal",
    title: "Canarro trio — Nyúlon túl session",
    venue: "Kristály Színtér — Nyulam Udvar",
    city: "Budapest",
    country: "Hungary",
    starts_at: "2026-09-14T18:00:00.000Z",
    is_historic: false,
    note: "Monday 14 September 2026, 20:00. canarro.hu",
  },
  {
    legend_slug: "tamas-szakal",
    title: "Tanár úr swingben — Canarro és Hevér Gábor",
    venue: "Győr",
    city: "Győr",
    country: "Hungary",
    starts_at: "2026-11-07T18:00:00.000Z",
    is_historic: false,
    note: "Saturday 7 November 2026, 19:00. canarro.hu",
  },
];
