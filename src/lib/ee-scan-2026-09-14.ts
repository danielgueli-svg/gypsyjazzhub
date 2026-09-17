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
    legend_slug: "roby-lakatos",
    title: "Roby Lakatos Ensemble",
    venue: "Casino de Beaulieu",
    city: "Beaulieu-sur-Mer",
    country: "France",
    starts_at: "2026-09-19T17:30:00.000Z",
    is_historic: false,
    note: "Saturday 19 September 2026, 19:30. Beaulieu Classic Festival. Antal Lisztès cymbalum, Róbert Szakcsi Lakatos piano, Guillaume Chevalier bass. Tickets https://www.beaulieuclassicfestival.com/roby-lakatos-ensemble/",
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

export const EE_SCAN_VENUES: Venue[] = [
  {
    slug: "kozlov-club-unplugged",
    name: "Kozlov Club Unplugged",
    city: "Moscow",
    country: "Russia",
    kind: "Club",
    site: "https://kozlovclub.ru/",
    contact: "",
    scene: "gypsy",
    bio: "ul. Myasnitskaya 15. Django Friends billed Friday 18 September 2026, 18:00.",
  },
  {
    slug: "hangvilla-veszprem",
    name: "Hangvilla",
    city: "Veszprém",
    country: "Hungary",
    kind: "Hall",
    site: "https://www.hangvilla.com/",
    contact: "jegy@veszpremiprogramiroda.hu",
    scene: "gypsy",
    bio: "Brusznyai Árpád utca 2. Roby Lakatos & Gypsy Jazz Band, Saturday 10 October 2026, 19:00.",
  },
  {
    slug: "casino-de-beaulieu",
    name: "Casino de Beaulieu",
    city: "Beaulieu-sur-Mer",
    country: "France",
    kind: "Hall",
    site: "https://www.beaulieuclassicfestival.com/",
    contact: "",
    scene: "gypsy",
    bio: "4 Avenue Fernand Dunan, 06310. Roby Lakatos Ensemble, Saturday 19 September 2026, 19:30 — Beaulieu Classic Festival closing concert.",
  },
  {
    slug: "kristaly-szinter",
    name: "Kristály Színtér",
    city: "Budapest",
    country: "Hungary",
    kind: "Hall",
    site: "",
    contact: "",
    scene: "gypsy",
    bio: "Canarro trio session 14 September 2026, 20:00.",
  },
];

export function archivePastEeConcert<T extends { starts_at: string; city: string; is_historic: boolean }>(concert: T): T {
  if (concert.city === "Budapest" && concert.starts_at.startsWith("2026-08-30")) {
    return { ...concert, is_historic: true };
  }
  return concert;
}

export function applyEeJamScan(jams: Jam[]): Jam[] {
  return jams.map((jam) => {
    if (jam.slug === "moscow-manouche-jam") {
      return {
        ...jam,
        when: "Meetup — when posted",
        nextStartsAt: "2026-09-18T15:00:00.000Z",
        bio: "Moscow jazz-manouche around Georgiy Yashagashvili (Django Friends) and Dmitry Kuptsov. Rooms: Kozlov Club, Maroseyka 9/2, and Unplugged, Myasnitskaya 15. Next billed: Django Friends, Friday 18 September 2026, 18:00, Unplugged. kozlovclub.ru",
      };
    }
    if (jam.slug === "petersburg-jfc-jam") {
      return {
        ...jam,
        when: "Meetup — concerts when posted",
        nextStartsAt: "2026-09-21T16:00:00.000Z",
        bio: "Hot Club of Saint-Petersburg at JFC, Shpalernaya 33. No Hot Club date on the mid-September board. The Hot Club Project (21 Sep / 19 Oct) is a different bill. jfc-club.spb.ru",
      };
    }
    if (jam.slug === "manuska-jam-club") {
      return { ...jam, when: "Weekly — venue posted", nextStartsAt: "2026-09-16T17:00:00.000Z" };
    }
    if (jam.slug === "gypsy-jazz-club-belgrade") {
      return { ...jam, nextStartsAt: "2026-09-16T20:00:00.000Z" };
    }
    if (jam.slug === "prague-manouche-jam") {
      return { ...jam, nextStartsAt: "2026-09-20T18:30:00.000Z" };
    }
    return jam;
  });
}
