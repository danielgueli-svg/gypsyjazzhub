type Copy = {
  kicker: string;
  title: string;
  subtitle: string;
  lead: string;
  mixNote: string;
  aboutTitle: string;
  about: string[];
  nightsTitle: string;
  nightsLead: string;
  noneUpcoming: string;
  archiveTitle: string;
  houseTitle: string;
  address: string;
  siteLabel: string;
  groupTitle: string;
  groupLead: string;
};

const EN: Copy = {
  kicker: "Bucharest house",
  title: "Grădina Alhambra",
  subtitle: "Historic garden, 1916 — gypsy jazz nights only on this hub.",
  lead: "Grădina Alhambra is a restaurant and garden hall on Strada Constantin Mille 13. Django Sound Quartet have played Gypsy Jazz Lăutăresc here. It is not a weekly jam, and it is not a Hot Club house.",
  mixNote:
    "Their own calendar mixes cabaret, tribute nights and parties. This page lists only gypsy jazz / jazz manouche bills — not the rest of the programme.",
  aboutTitle: "The house",
  about: [
    "The garden opened in 1916 as a summer theatre. After a long closure it reopened as an eat-drink-dance room in the old building. Reservations: rezervari@gradinaalhambra.ro / +40 726 581 985.",
    "Bucharest’s working manouche stand is Django Sound Quartet — Constantin Mirea violin, Florin Pană accordion, Cristian Mirea bass. They also play Trattoria Monza and The Great Hill. Dates are posted with the band, not as a standing night here.",
  ],
  nightsTitle: "Gypsy jazz nights",
  nightsLead: "Only Hot Club / manouche / lăutăresc bills. Ask the quartet before you travel.",
  noneUpcoming: "No gypsy jazz night is posted for this house after the last confirmed date. Watch the quartet and gradinaalhambra.ro — do not assume a weekly session.",
  archiveTitle: "Last confirmed night",
  houseTitle: "Find the door",
  address: "Strada Constantin Mille 13, 030167 Bucharest, Romania",
  siteLabel: "gradinaalhambra.ro",
  groupTitle: "Who played the manouche bill",
  groupLead: "Django Sound Quartet — billed Gypsy Jazz Lăutăresc.",
};

const NL: Copy = {
  ...EN,
  kicker: "Huis in Boekarest",
  title: "Grădina Alhambra",
  subtitle: "Historische tuin, 1916 — op deze hub alleen gypsy-jazzavonden.",
  lead: "Grădina Alhambra is een restaurant en tuinzal op Strada Constantin Mille 13. Django Sound Quartet speelde hier Gypsy Jazz Lăutăresc. Geen wekelijkse jam, geen vast Hot Club-huis.",
  mixNote:
    "Hun eigen agenda mixt cabaret, tribute-avonden en feesten. Deze pagina toont alleen gypsy jazz / jazz manouche — niet de rest van het programma.",
  aboutTitle: "Het huis",
  about: [
    "De tuin opende in 1916 als zomertheater. Na een lange sluiting is het weer een eet-drink-danszaal in het oude gebouw. Reserveren: rezervari@gradinaalhambra.ro / +40 726 581 985.",
    "De werkende manouche-stand in Boekarest is Django Sound Quartet — Constantin Mirea viool, Florin Pană accordeon, Cristian Mirea bas. Ze spelen ook Trattoria Monza en The Great Hill. Data komen met de band, niet als vaste avond hier.",
  ],
  nightsTitle: "Gypsy-jazzavonden",
  nightsLead: "Alleen Hot Club / manouche / lăutăresc. Vraag het kwartet voor je reist.",
  noneUpcoming:
    "Er staat geen gypsy-jazzavond meer op deze zaal na de laatst bevestigde datum. Volg het kwartet en gradinaalhambra.ro — dit is geen wekelijkse sessie.",
  archiveTitle: "Laatst bevestigde avond",
  houseTitle: "De deur",
  groupTitle: "Wie de manouche-avond speelde",
  groupLead: "Django Sound Quartet — aangekondigd als Gypsy Jazz Lăutăresc.",
};

const FR: Copy = {
  ...EN,
  kicker: "Salle à Bucarest",
  subtitle: "Jardin historique, 1916 — sur ce hub, uniquement les soirs gypsy jazz.",
  lead: "Grădina Alhambra est un restaurant-jardin, Strada Constantin Mille 13. Django Sound Quartet y a joué Gypsy Jazz Lăutăresc. Pas de jam hebdomadaire.",
  mixNote:
    "Leur calendrier mélange cabaret, hommages et soirées. Cette page ne liste que le jazz manouche — pas le reste de la programmation.",
  aboutTitle: "La salle",
  nightsTitle: "Soirs gypsy jazz",
  nightsLead: "Uniquement manouche / Hot Club / lăutăresc. Demandez au quartette avant de voyager.",
  noneUpcoming:
    "Aucune soirée gypsy jazz n’est affichée après la dernière date confirmée. Suivez le quartette et le site — ce n’est pas une session fixe.",
  archiveTitle: "Dernière soirée confirmée",
  houseTitle: "L’adresse",
  groupTitle: "Le plateau manouche",
  groupLead: "Django Sound Quartet — annoncé Gypsy Jazz Lăutăresc.",
};

const DE: Copy = {
  ...EN,
  kicker: "Haus in Bukarest",
  subtitle: "Historischer Garten, 1916 — hier nur Gypsy-Jazz-Abende.",
  lead: "Grădina Alhambra ist Restaurant und Gartensaal, Strada Constantin Mille 13. Django Sound Quartet spielte hier Gypsy Jazz Lăutăresc. Kein wöchentlicher Jam.",
  mixNote:
    "Ihr eigener Kalender mischt Kabarett, Tribute und Partys. Diese Seite zeigt nur Gypsy Jazz / Jazz Manouche.",
  aboutTitle: "Das Haus",
  nightsTitle: "Gypsy-Jazz-Abende",
  nightsLead: "Nur Hot Club / Manouche / Lăutăresc. Vor der Reise beim Quartett nachfragen.",
  noneUpcoming:
    "Kein Gypsy-Jazz-Abend nach dem letzten bestätigten Datum. Quartett und Website folgen — keine wöchentliche Session.",
  archiveTitle: "Letzter bestätigter Abend",
  houseTitle: "Die Tür",
  groupTitle: "Wer den Manouche-Abend spielte",
  groupLead: "Django Sound Quartet — als Gypsy Jazz Lăutăresc angekündigt.",
};

const ES: Copy = {
  ...EN,
  kicker: "Casa en Bucarest",
  subtitle: "Jardín histórico, 1916 — en este hub solo noches de gypsy jazz.",
  lead: "Grădina Alhambra es restaurante y jardín en Strada Constantin Mille 13. Django Sound Quartet tocó aquí Gypsy Jazz Lăutăresc. No es una jam semanal.",
  mixNote:
    "Su calendario mezcla cabaré, tributos y fiestas. Esta página lista solo gypsy jazz / jazz manouche.",
  aboutTitle: "La casa",
  nightsTitle: "Noches de gypsy jazz",
  nightsLead: "Solo Hot Club / manouche / lăutăresc. Pregunta al cuarteto antes de viajar.",
  noneUpcoming:
    "No hay noche de gypsy jazz anunciada después de la última fecha confirmada. Sigue al cuarteto y la web — no es una sesión fija.",
  archiveTitle: "Última noche confirmada",
  houseTitle: "La puerta",
  groupTitle: "Quién tocó el cartel manouche",
  groupLead: "Django Sound Quartet — anunciado como Gypsy Jazz Lăutăresc.",
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
