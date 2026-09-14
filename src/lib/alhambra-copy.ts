type Copy = {
  kicker: string;
  title: string;
  subtitle: string;
  lead: string;
  mixNote: string;
  siblingNote: string;
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
  siblingNote: "Not Grădina Alhambra in Bucharest — that garden hall has its own page.",
  aboutTitle: "The organisation",
  about: [
    "Home room: Remonstrantse kerk, also called the Schuilkerkje, Fnidsen 37, Alkmaar. Larger nights have also been booked at Gasfabriek Alkmaar and Theater Victorie. Tickets and dates: stichting-alhambra.nl and Facebook AlhambraGuitaar. Info from their series: 06-51511995.",
    "This page lists only upcoming gypsy jazz / jazz manouche nights they posted. Not a weekly jam, and not a standing Hot Club house. The rest of their calendar is classical guitar.",
  ],
  nightsTitle: "Upcoming gypsy jazz nights",
  nightsLead: "Only Hot Club / manouche bills still to come. Ask the foundation before you travel — the rest of their calendar is classical guitar.",
  noneUpcoming:
    "No upcoming gypsy jazz night is posted for Stichting Alhambra. Watch stichting-alhambra.nl and their Facebook — do not assume a weekly session.",
  archiveTitle: "Last confirmed night",
  houseTitle: "Find the door",
  address: "Remonstrantse kerk / Schuilkerkje, Fnidsen 37, Alkmaar",
  homeRoom: "Also Gasfabriek Alkmaar and Theater Victorie when they book a larger night",
  siteLabel: "stichting-alhambra.nl",
  facebookLabel: "Facebook",
  groupTitle: "On the upcoming bills",
  groupLead: "Django a Paris; Marcia Bamberg Swing Quartet; Amati Schmitt and Angelo Debarre.",
};

const NL: Copy = {
  ...EN,
  kicker: "Nederlandse stichting",
  title: "Stichting Alhambra",
  subtitle: "Alkmaarse concertserie — op deze hub alleen gypsy-jazzavonden.",
  lead: "Stichting Alhambra is een Nederlandse concertorganisatie in Alkmaar. Al meer dan twintig jaar boeken ze gitaaravonden, meestal in de Remonstrantse kerk (het Schuilkerkje) aan het Fnidsen. Hun eigen site is een gemengde klassieke-gitaarserie. Deze pagina toont alleen gypsy jazz / jazz manouche.",
  mixNote:
    "Niet elke naam op stichting-alhambra.nl is gypsy jazz. Recitals zoals Sebastian Swiedrych (Dowland, Scarlatti, Villa-Lobos, Rodrigo) blijven van deze hub af. Alleen Hot Club- / manouche-avonden staan hier.",
  siblingNote: "Niet Grădina Alhambra in Boekarest — die tuinzal heeft een eigen pagina.",
  aboutTitle: "De stichting",
  about: [
    "Thuiszaal: Remonstrantse kerk, ook het Schuilkerkje, Fnidsen 37, Alkmaar. Grotere avonden zijn ook geboekt in de Gasfabriek Alkmaar en Theater Victorie. Kaarten en data: stichting-alhambra.nl en Facebook AlhambraGuitaar. Info uit hun serie: 06-51511995.",
    "Deze pagina toont alleen komende gypsy-jazz- / jazz-manouche-avonden. Geen wekelijkse jam, geen vast Hot Club-huis. De rest van de agenda is klassieke gitaar.",
  ],
  nightsTitle: "Komende gypsy-jazzavonden",
  nightsLead: "Alleen Hot Club / manouche die nog moet komen. Vraag de stichting voor je reist — de rest van de agenda is klassieke gitaar.",
  noneUpcoming:
    "Er staat geen komende gypsy-jazzavond van Stichting Alhambra. Volg stichting-alhambra.nl en hun Facebook — dit is geen wekelijkse sessie.",
  archiveTitle: "Laatst bevestigde avond",
  houseTitle: "De deur",
  address: "Remonstrantse kerk / Schuilkerkje, Fnidsen 37, Alkmaar",
  homeRoom: "Ook Gasfabriek Alkmaar en Theater Victorie als ze een grotere avond boeken",
  groupTitle: "Op de komende avonden",
  groupLead: "Django a Paris; Marcia Bamberg Swing Quartet; Amati Schmitt en Angelo Debarre.",
};

const FR: Copy = {
  ...EN,
  kicker: "Fondation néerlandaise",
  subtitle: "Série de concerts à Alkmaar — sur ce hub, uniquement les soirs gypsy jazz.",
  lead: "Stichting Alhambra est une organisation de concerts basée à Alkmaar. Depuis plus de vingt ans elle programme des soirées guitare, surtout à l’église rémonstrante (Schuilkerkje) sur Fnidsen. Leur site mélange surtout la guitare classique. Cette page ne liste que le jazz manouche.",
  mixNote:
    "Tous les noms de stichting-alhambra.nl ne sont pas du gypsy jazz. Les recitals classiques (Sebastian Swiedrych, Dowland, Scarlatti, Villa-Lobos, Rodrigo) restent hors de ce hub.",
  siblingNote: "Ce n’est pas Grădina Alhambra à Bucarest — cette salle a sa propre page.",
  aboutTitle: "La fondation",
  nightsTitle: "Prochains soirs gypsy jazz",
  nightsLead: "Uniquement les plateaux manouche / Hot Club à venir. Demandez à la fondation avant de voyager.",
  noneUpcoming:
    "Aucune soirée gypsy jazz n’est affichée. Suivez le site et Facebook — ce n’est pas une session fixe.",
  archiveTitle: "Dernière soirée confirmée",
  houseTitle: "L’adresse",
  groupTitle: "Sur les prochains plateaux",
  groupLead: "Django a Paris ; Marcia Bamberg Swing Quartet ; Amati Schmitt et Angelo Debarre.",
};

const DE: Copy = {
  ...EN,
  kicker: "Niederländische Stiftung",
  subtitle: "Alkmaarer Konzertreihe — hier nur Gypsy-Jazz-Abende.",
  lead: "Stichting Alhambra ist eine niederländische Konzertorganisation in Alkmaar. Seit über zwanzig Jahren bucht sie Gitarrenabende, meist in der Remonstrantse kerk (Schuilkerkje) am Fnidsen. Die eigene Website ist eine gemischte Klassik-Gitarrenserie. Diese Seite zeigt nur Gypsy Jazz / Jazz Manouche.",
  mixNote:
    "Nicht jeder Name auf stichting-alhambra.nl ist Gypsy Jazz. Klassik-Recitals (Sebastian Swiedrych, Dowland, Scarlatti, Villa-Lobos, Rodrigo) bleiben von diesem Hub fern.",
  siblingNote: "Nicht Grădina Alhambra in Bukarest — dieser Gartensaal hat eine eigene Seite.",
  aboutTitle: "Die Stiftung",
  nightsTitle: "Kommende Gypsy-Jazz-Abende",
  nightsLead: "Nur Hot Club / Manouche, die noch kommen. Vor der Reise bei der Stiftung nachfragen.",
  noneUpcoming:
    "Kein kommender Gypsy-Jazz-Abend. Website und Facebook folgen — keine wöchentliche Session.",
  archiveTitle: "Letzter bestätigter Abend",
  houseTitle: "Die Tür",
  groupTitle: "Auf den kommenden Abenden",
  groupLead: "Django a Paris; Marcia Bamberg Swing Quartet; Amati Schmitt und Angelo Debarre.",
};

const ES: Copy = {
  ...EN,
  kicker: "Organización neerlandesa",
  subtitle: "Serie de conciertos en Alkmaar — en este hub solo noches de gypsy jazz.",
  lead: "Stichting Alhambra es una organización de conciertos en Alkmaar. Lleva más de veinte años programando noches de guitarra, sobre todo en la iglesia remonstrante (Schuilkerkje) de Fnidsen. Su web es una serie mixta de guitarra clásica. Esta página lista solo gypsy jazz / jazz manouche.",
  mixNote:
    "No todos los nombres de stichting-alhambra.nl son gypsy jazz. Los recitals clásicos (Sebastian Swiedrych, Dowland, Scarlatti, Villa-Lobos, Rodrigo) no entran en este hub.",
  siblingNote: "No es Grădina Alhambra en Bucarest — esa sala tiene su propia página.",
  aboutTitle: "La fundación",
  nightsTitle: "Próximas noches de gypsy jazz",
  nightsLead: "Solo Hot Club / manouche que aún está por venir. Pregunta a la fundación antes de viajar.",
  noneUpcoming:
    "No hay noche de gypsy jazz anunciada. Sigue la web y Facebook — no es una sesión fija.",
  archiveTitle: "Última noche confirmada",
  houseTitle: "La puerta",
  groupTitle: "En las próximas noches",
  groupLead: "Django a Paris; Marcia Bamberg Swing Quartet; Amati Schmitt y Angelo Debarre.",
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
