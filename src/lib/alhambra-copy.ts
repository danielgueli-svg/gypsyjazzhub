type Copy = {
  kicker: string;
  title: string;
  subtitle: string;
  lead: string;
  aboutTitle: string;
  about: string[];
  nightsTitle: string;
  nightsLead: string;
  noneUpcoming: string;
  otherTitle: string;
  otherLead: string;
  kindClassical: string;
  kindFlamenco: string;
  ticketsOnSite: string;
  organisedBy: string;
  archiveTitle: string;
  houseTitle: string;
  address: string;
  homeRoom: string;
  siteLabel: string;
  facebookLabel: string;
  groupTitle: string;
  groupLead: string;
};

const EN: Copy = {
  kicker: "Dutch organisation",
  title: "Stichting Alhambra",
  subtitle: "Alkmaar guitar series — different rooms, one organiser.",
  lead: "Stichting Alhambra is a cultural foundation in Alkmaar. Since 12 February 1991 they have booked guitar nights — first in theatre De Vigilantie, later in the Remonstrantse kerk (Schuilkerkje) on Fnidsen, and now also at Gasfabriek Alkmaar and Theater Victorie when the bill needs a larger venue. Chair: Hans de Weerd.",
  aboutTitle: "The organisation",
  about: [
    "From their own site: they work for live guitar at a high level, in a small venue, for both long-time listeners and people new to the instrument. After De Vigilantie closed they paused, then returned in 2017 with culinary concerts at D’Moriaan in Warmenhuizen. That house closed in 2019. The series started again in 2023, and they added Django’s gipsy jazz to the programme.",
    "Main venue: Remonstrantse kerk / Schuilkerkje, Fnidsen 37, Alkmaar. Larger gypsy jazz nights: Gasfabriek Alkmaar and Theater Victorie. Tickets: stichtingalhambra.nl. Series phone: 06-51511995.",
  ],
  nightsTitle: "Gypsy jazz nights",
  nightsLead: "Hot Club / manouche bills they posted — also on the hub calendar, marked as organised by Stichting Alhambra.",
  noneUpcoming: "No upcoming gypsy jazz night is posted. Watch stichtingalhambra.nl — this is not a weekly session.",
  otherTitle: "Other concerts on their series",
  otherLead: "Classical guitar and flamenco from their site. Only listed here.",
  kindClassical: "Classical guitar",
  kindFlamenco: "Flamenco",
  ticketsOnSite: "Tickets on their site",
  organisedBy: "Organised by Stichting Alhambra",
  archiveTitle: "Last confirmed night",
  houseTitle: "Address",
  address: "Remonstrantse kerk / Schuilkerkje, Fnidsen 37, Alkmaar",
  homeRoom: "Also Gasfabriek Alkmaar and Theater Victorie when they book a larger night",
  siteLabel: "stichtingalhambra.nl",
  facebookLabel: "Facebook",
  groupTitle: "On the gypsy jazz bills",
  groupLead: "Django a Paris; Amati Schmitt and Angelo Debarre.",
};

const NL: Copy = {
  ...EN,
  kicker: "Nederlandse stichting",
  title: "Stichting Alhambra",
  subtitle: "Alkmaarse gitaarserie — verschillende zalen, één organisator.",
  lead: "Stichting Alhambra is een culturele stichting in Alkmaar. Sinds 12 februari 1991 organiseren ze gitaaravonden — eerst in theater De Vigilantie, later in de Remonstrantse kerk (het Schuilkerkje) aan het Fnidsen, en nu ook in de Gasfabriek Alkmaar en Theater Victorie als de avond een grotere zaal nodig heeft. Voorzitter: Hans de Weerd.",
  aboutTitle: "De stichting",
  about: [
    "Van hun eigen site: ze werken voor live gitaar op hoog niveau, in een kleine zaal, voor vaste luisteraars én nieuwkomers. Na de sluiting van De Vigilantie was er een pauze, daarna culinaire concerten bij D’Moriaan in Warmenhuizen tot 2019. In 2023 is de serie hervat, en namen ze de gipsy jazz van Django Reinhardt op in de programmering.",
    "Thuiszaal: Remonstrantse kerk / Schuilkerkje, Fnidsen 37, Alkmaar. Grotere gypsy-jazzavonden: Gasfabriek Alkmaar en Theater Victorie. Kaarten: stichtingalhambra.nl. Serie: 06-51511995.",
  ],
  nightsTitle: "Gypsy-jazzavonden",
  nightsLead: "De Hot Club- / manouche-avonden die zij zetten. Die staan ook in de hub-agenda, met georganiseerd door Stichting Alhambra.",
  noneUpcoming: "Er staat geen komende gypsy-jazzavond. Volg stichtingalhambra.nl — dit is geen wekelijkse sessie.",
  otherTitle: "Overige concerten in hun serie",
  otherLead: "Klassieke gitaar en flamenco van hun site. Alleen op deze pagina.",
  kindClassical: "Klassieke gitaar",
  kindFlamenco: "Flamenco",
  ticketsOnSite: "Kaarten op hun site",
  organisedBy: "Georganiseerd door Stichting Alhambra",
  houseTitle: "Adres",
  homeRoom: "Ook Gasfabriek Alkmaar en Theater Victorie als ze een grotere avond boeken",
  groupTitle: "Op de gypsy-jazzavonden",
  groupLead: "Django a Paris; Amati Schmitt en Angelo Debarre.",
};

const FR: Copy = {
  ...EN,
  kicker: "Fondation néerlandaise",
  subtitle: "Série de guitare à Alkmaar — plusieurs salles, un organisateur.",
  lead: "Stichting Alhambra est une fondation culturelle à Alkmaar. Depuis le 12 février 1991 elle programme des soirées guitare — d’abord au théâtre De Vigilantie, puis à l’église rémonstrante (Schuilkerkje) sur Fnidsen, et aussi à la Gasfabriek et au Theater Victorie quand la salle doit être plus grande. Président : Hans de Weerd.",
  aboutTitle: "La fondation",
  nightsTitle: "Soirs gypsy jazz",
  nightsLead: "Les plateaux Hot Club / manouche. Ils portent aussi la mention organisé par Stichting Alhambra.",
  noneUpcoming: "Aucune soirée gypsy jazz n’est affichée. Suivez stichtingalhambra.nl.",
  otherTitle: "Autres concerts de leur série",
  otherLead: "Guitare classique et flamenco. Uniquement sur cette page.",
  kindClassical: "Guitare classique",
  kindFlamenco: "Flamenco",
  ticketsOnSite: "Billets sur leur site",
  organisedBy: "Organisé par Stichting Alhambra",
  houseTitle: "L’adresse",
  groupTitle: "Sur les soirs gypsy jazz",
  groupLead: "Django a Paris ; Amati Schmitt et Angelo Debarre.",
};

const DE: Copy = {
  ...EN,
  kicker: "Niederländische Stiftung",
  subtitle: "Alkmaarer Gitarrenreihe — verschiedene Säle, ein Veranstalter.",
  lead: "Stichting Alhambra ist eine Kulturstiftung in Alkmaar. Seit dem 12. Februar 1991 bucht sie Gitarrenabende — zuerst im Theater De Vigilantie, später in der Remonstrantse kerk (Schuilkerkje) am Fnidsen, und bei größeren Abenden in der Gasfabriek und im Theater Victorie. Vorsitz: Hans de Weerd.",
  aboutTitle: "Die Stiftung",
  nightsTitle: "Gypsy-Jazz-Abende",
  nightsLead: "Die Hot-Club- / Manouche-Abende. Immer mit organisiert von Stichting Alhambra.",
  noneUpcoming: "Kein kommender Gypsy-Jazz-Abend. stichtingalhambra.nl folgen.",
  otherTitle: "Weitere Konzerte ihrer Reihe",
  otherLead: "Klassische Gitarre und Flamenco. Nur auf dieser Seite.",
  kindClassical: "Klassische Gitarre",
  kindFlamenco: "Flamenco",
  ticketsOnSite: "Karten auf ihrer Website",
  organisedBy: "Organisiert von Stichting Alhambra",
  houseTitle: "Die Tür",
  groupTitle: "Auf den Gypsy-Jazz-Abenden",
  groupLead: "Django a Paris; Amati Schmitt und Angelo Debarre.",
};

const ES: Copy = {
  ...EN,
  kicker: "Organización neerlandesa",
  subtitle: "Serie de guitarra en Alkmaar — varias salas, un organizador.",
  lead: "Stichting Alhambra es una fundación cultural en Alkmaar. Desde el 12 de febrero de 1991 programa noches de guitarra — primero en el teatro De Vigilantie, luego en la iglesia remonstrante (Schuilkerkje) de Fnidsen, y en Gasfabriek y Theater Victorie cuando hace falta una sala mayor. Presidente: Hans de Weerd.",
  aboutTitle: "La fundación",
  nightsTitle: "Noches de gypsy jazz",
  nightsLead: "Los carteles Hot Club / manouche. También llevan organizado por Stichting Alhambra.",
  noneUpcoming: "No hay noche de gypsy jazz anunciada. Sigue stichtingalhambra.nl.",
  otherTitle: "Otros conciertos de su serie",
  otherLead: "Guitarra clásica y flamenco. Solo en esta página.",
  kindClassical: "Guitarra clásica",
  kindFlamenco: "Flamenco",
  ticketsOnSite: "Entradas en su web",
  organisedBy: "Organizado por Stichting Alhambra",
  houseTitle: "La puerta",
  groupTitle: "En las noches de gypsy jazz",
  groupLead: "Django a Paris; Amati Schmitt y Angelo Debarre.",
};

const BY_LOCALE: Record<string, Copy> = {
  en: EN,
  nl: NL,
  fr: FR,
  de: DE,
  es: ES,
};

export function alhambraCopy(locale: string): Copy {
  return BY_LOCALE[locale] ?? EN;
}
