/** Stichting Alhambra (Alkmaar). Site is stichtingalhambra.nl — no hyphen. */

export const ALHAMBRA_SITE = "https://stichtingalhambra.nl/";
export const ALHAMBRA_FACEBOOK = "https://www.facebook.com/AlhambraGuitaar";
export const ALHAMBRA_HREF = "/stichting-alhambra" as const;
export const ALHAMBRA_LOGO = "/orgs/stichting-alhambra.png";
export const ALHAMBRA_PHONE = "06-51511995";

export type AlhambraOtherNight = {
  id: string;
  title: string;
  kind: "classical" | "flamenco";
  startsAt: string;
  venue: string;
  city: string;
  href: string;
};

/** Classical / flamenco recitals from their 2026–27 season. Stay off the hub calendar. */
export const ALHAMBRA_OTHER_NIGHTS: AlhambraOtherNight[] = [
  {
    id: "krisna-pijloo",
    title: "Krisna Pijloo",
    kind: "classical",
    startsAt: "2026-10-25T15:00:00.000Z",
    venue: "Remonstrantse kerk",
    city: "Alkmaar",
    href: "https://stichtingalhambra.nl/evenement/krisna-pijloo/",
  },
  {
    id: "kambiz-afshari",
    title: "Kambiz Afshari",
    kind: "flamenco",
    startsAt: "2026-11-22T15:00:00.000Z",
    venue: "Remonstrantse kerk",
    city: "Alkmaar",
    href: "https://stichtingalhambra.nl/evenement/kambiz-afshari-2/",
  },
  {
    id: "laura-rouy",
    title: "Laura Rouy",
    kind: "classical",
    startsAt: "2027-01-24T15:00:00.000Z",
    venue: "Remonstrantse kerk",
    city: "Alkmaar",
    href: "https://stichtingalhambra.nl/evenement/laura-rouy/",
  },
  {
    id: "izhar-elias",
    title: "Izhar Elias",
    kind: "classical",
    startsAt: "2027-03-14T15:00:00.000Z",
    venue: "Remonstrantse kerk",
    city: "Alkmaar",
    href: "https://stichtingalhambra.nl/evenement/izhar-elias-2/",
  },
];

export function isAlhambraOrgConcert(concert: {
  title: string;
  description?: string;
  venue: string;
  city?: string;
  ticketUrl?: string;
}) {
  const hay = `${concert.title} ${concert.description ?? ""} ${concert.ticketUrl ?? ""}`.toLowerCase();
  if (/gradina|bucharest|bucure/.test(hay)) return false;
  if (/stichting[\s-]?alhambra|stichtingalhambra/.test(hay)) return true;
  const venue = concert.venue.toLowerCase();
  const title = concert.title.toLowerCase();
  if (/django a paris/.test(title) && /gasfabriek/.test(venue)) return true;
  if (/amati schmitt/.test(title) && /victorie|vuctorie/.test(venue)) return true;
  return false;
}

export function upcomingAlhambraOther(now = Date.now()) {
  return ALHAMBRA_OTHER_NIGHTS.filter((night) => new Date(night.startsAt).getTime() >= now).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}
