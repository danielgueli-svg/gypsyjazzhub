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
  homeRoom: string;
  siteLabel: string;
  facebookLabel: string;
  groupTitle: string;
  groupLead: string;
};

const EN: Copy = {
  kicker: "Dutch organisation",
  title: "Stichting Alhambra",
  subtitle: "Alkmaar concert series — gypsy jazz nights only on this hub.",
  lead: "Stichting Alhambra is a Dutch concert organisation based in Alkmaar. For more than twenty years they have booked guitar nights, mostly in the Remonstrantse kerk (Schuilkerkje) on Fnidsen. Their own site is a mixed classical-guitar series. This page lists only the gypsy jazz / jazz manouche bills.",
  mixNote:
    "Not every name on stichting-alhambra.nl is gypsy jazz. Recitals such as Sebastian Swiedrych (Dowland, Scarlatti, Villa-Lobos, Rodrigo) stay off this hub. Only Hot Club / manouche nights are listed.",
  aboutTitle: "The organisation",
  about: [
    "Home room: Remonstrantse kerk, also called the Schuilkerkje, Fnidsen 37, Alkmaar. Larger gypsy jazz nights have been booked at Cultuurkoepel Heiloo, Kennemerstraatweg 464. Tickets and dates: stichting-alhambra.nl (the site was down when last checked) and Facebook AlhambraGuitaar. Info from their series: 06-51511995.",
    "Marcia Bamberg Swing Quartet name Stichting Alhambra as a client. The confirmed manouche night on file is 27 April 2025 in Heiloo, with Mozes Rosenberg and Tim Kliphuis. That is not a weekly jam, and it is not a standing Hot Club house.",
  ],
  nightsTitle: "Gypsy jazz nights",
  nightsLead: "Only Hot Club / manouche bills they posted. Ask the foundation before you travel — the rest of their calendar is classical guitar.",
  noneUpcoming:
    "No gypsy jazz night is posted for Stichting Alhambra after the last confirmed date. Watch stichting-alhambra.nl and their Facebook — do not assume a weekly session.",
  archiveTitle: "Last confirmed night",
  houseTitle: "Find the door",
  address: "Cultuurkoepel Heiloo, Kennemerstraatweg 464, Heiloo (gypsy jazz night 27 Apr 2025)",
  homeRoom: "Home series: Remonstrantse kerk / Schuilkerkje, Fnidsen 37, Alkmaar",
  siteLabel: "stichting-alhambra.nl",
  facebookLabel: "Facebook",
  groupTitle: "Who played the manouche bill",
  groupLead: "Marcia Bamberg Swing Quartet with Mozes Rosenberg and Tim Kliphuis — billed Beleef de magie van Gipsy Jazz!",
};

const NL: Copy = {
  ...EN,
  kicker: "Nederlandse stichting",
  title: "Stichting Alhambra",
  subtitle: "Alkmaarse concertserie — op deze hub alleen gypsy-jazzavonden.",
  lead: "Stichting Alhambra is een Nederlandse concertorganisatie in Alkmaar. Al meer dan twintig jaar boeken ze gitaaravonden, meestal in de Remonstrantse kerk (het Schuilkerkje) aan het Fnidsen. Hun eigen site is een gemengde klassieke-gitaarserie. Deze pagina toont alleen gypsy jazz / jazz manouche.",
  mixNote:
    "Niet elke naam op stichting-alhambra.nl is gypsy jazz. Recitals zoals Sebastian Swiedrych (Dowland, Scarlatti, Villa-Lobos, Rodrigo) blijven van deze hub af. Alleen Hot Club- / manouche-avonden staan hier.",
  aboutTitle: "De stichting",
  about: [
    "Thuiszaal: Remonstrantse kerk, ook het Schuilkerkje, Fnidsen 37, Alkmaar. Grotere gypsy-jazzavonden zijn geboekt in de Cultuurkoepel Heiloo, Kennemerstraatweg 464. Kaarten en data: stichting-alhambra.nl (de site was offline bij de laatste check) en Facebook AlhambraGuitaar. Info uit hun serie: 06-51511995.",
    "Het Marcia Bamberg Swing Quartet noemt Stichting Alhambra als opdrachtgever. De bevestigde manouche-avond op file is 27 april 2025 in Heiloo, met Mozes Rosenberg en Tim Kliphuis. Geen wekelijkse jam, geen vast Hot Club-huis.",
  ],
  nightsTitle: "Gypsy-jazzavonden",
  nightsLead: "Alleen Hot Club / manouche die zij zelf zetten. Vraag de stichting voor je reist — de rest van de agenda is klassieke gitaar.",
  noneUpcoming:
    "Er staat geen gypsy-jazzavond meer van Stichting Alhambra na de laatst bevestigde datum. Volg stichting-alhambra.nl en hun Facebook — dit is geen wekelijkse sessie.",
  archiveTitle: "Laatst bevestigde avond",
  houseTitle: "De deur",
  address: "Cultuurkoepel Heiloo, Kennemerstraatweg 464, Heiloo (gypsy-jazzavond 27 apr 2025)",
  homeRoom: "Thuisserie: Remonstrantse kerk / Schuilkerkje, Fnidsen 37, Alkmaar",
  groupTitle: "Wie de manouche-avond speelde",
  groupLead: "Marcia Bamberg Swing Quartet met Mozes Rosenberg en Tim Kliphuis — aangekondigd als Beleef de magie van Gipsy Jazz!",
};

const FR: Copy = {
  ...EN,
  kicker: "Fondation néerlandaise",
  subtitle: "Série de concerts à Alkmaar — sur ce hub, uniquement les soirs gypsy jazz.",
  lead: "Stichting Alhambra est une organisation de concerts basée à Alkmaar. Depuis plus de vingt ans elle programme des soirées guitare, surtout à l’église rémonstrante (Schuilkerkje) sur Fnidsen. Leur site mélange surtout la guitare classique. Cette page ne liste que le jazz manouche.",
  mixNote:
    "Tous les noms de stichting-alhambra.nl ne sont pas du gypsy jazz. Les recitals classiques (Sebastian Swiedrych, Dowland, Scarlatti, Villa-Lobos, Rodrigo) restent hors de ce hub.",
  aboutTitle: "La fondation",
  nightsTitle: "Soirs gypsy jazz",
  nightsLead: "Uniquement les plateaux manouche / Hot Club. Demandez à la fondation avant de voyager.",
  noneUpcoming:
    "Aucune soirée gypsy jazz n’est affichée après la dernière date confirmée. Suivez le site et Facebook — ce n’est pas une session fixe.",
  archiveTitle: "Dernière soirée confirmée",
  houseTitle: "L’adresse",
  groupTitle: "Le plateau manouche",
  groupLead: "Marcia Bamberg Swing Quartet avec Mozes Rosenberg et Tim Kliphuis — annoncé Beleef de magie van Gipsy Jazz!",
};

const DE: Copy = {
  ...EN,
  kicker: "Niederländische Stiftung",
  subtitle: "Alkmaarer Konzertreihe — hier nur Gypsy-Jazz-Abende.",
  lead: "Stichting Alhambra ist eine niederländische Konzertorganisation in Alkmaar. Seit über zwanzig Jahren bucht sie Gitarrenabende, meist in der Remonstrantse kerk (Schuilkerkje) am Fnidsen. Die eigene Website ist eine gemischte Klassik-Gitarrenserie. Diese Seite zeigt nur Gypsy Jazz / Jazz Manouche.",
  mixNote:
    "Nicht jeder Name auf stichting-alhambra.nl ist Gypsy Jazz. Klassik-Recitals (Sebastian Swiedrych, Dowland, Scarlatti, Villa-Lobos, Rodrigo) bleiben von diesem Hub fern.",
  aboutTitle: "Die Stiftung",
  nightsTitle: "Gypsy-Jazz-Abende",
  nightsLead: "Nur Hot Club / Manouche. Vor der Reise bei der Stiftung nachfragen.",
  noneUpcoming:
    "Kein Gypsy-Jazz-Abend nach dem letzten bestätigten Datum. Website und Facebook folgen — keine wöchentliche Session.",
  archiveTitle: "Letzter bestätigter Abend",
  houseTitle: "Die Tür",
  groupTitle: "Wer den Manouche-Abend spielte",
  groupLead: "Marcia Bamberg Swing Quartet mit Mozes Rosenberg und Tim Kliphuis — angekündigt als Beleef de magie van Gipsy Jazz!",
};

const ES: Copy = {
  ...EN,
  kicker: "Organización neerlandesa",
  subtitle: "Serie de conciertos en Alkmaar — en este hub solo noches de gypsy jazz.",
  lead: "Stichting Alhambra es una organización de conciertos en Alkmaar. Lleva más de veinte años programando noches de guitarra, sobre todo en la iglesia remonstrante (Schuilkerkje) de Fnidsen. Su web es una serie mixta de guitarra clásica. Esta página lista solo gypsy jazz / jazz manouche.",
  mixNote:
    "No todos los nombres de stichting-alhambra.nl son gypsy jazz. Los recitals clásicos (Sebastian Swiedrych, Dowland, Scarlatti, Villa-Lobos, Rodrigo) no entran en este hub.",
  aboutTitle: "La fundación",
  nightsTitle: "Noches de gypsy jazz",
  nightsLead: "Solo Hot Club / manouche. Pregunta a la fundación antes de viajar.",
  noneUpcoming:
    "No hay noche de gypsy jazz anunciada después de la última fecha confirmada. Sigue la web y Facebook — no es una sesión fija.",
  archiveTitle: "Última noche confirmada",
  houseTitle: "La puerta",
  groupTitle: "Quién tocó el cartel manouche",
  groupLead: "Marcia Bamberg Swing Quartet con Mozes Rosenberg y Tim Kliphuis — anunciado como Beleef de magie van Gipsy Jazz!",
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
