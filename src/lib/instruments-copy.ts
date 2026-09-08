import {
  EN_INSTRUMENT_COPY,
  type InstrumentCopy,
  type InstrumentSlug,
} from "@/lib/instruments";

export type InstrumentChrome = {
  kicker: string;
  hub: string;
  lead: string;
  later: string;
  language: string;
  start: string;
  listen: string;
  shelf: string;
  schools: string;
  videos: string;
  apps: string;
  teachers: string;
  teachersLead: string;
  teachersEmpty: string;
  teachersAdd: string;
  luthiers: string;
  luthiersGuitarLead: string;
  luthiersBassLead: string;
  luthiersViolinLead: string;
  luthiersAll: string;
  shops: string;
  shopsLead: string;
  shopsAll: string;
  charts: string;
  chartsLead: string;
  amp: string;
  ampLead: string;
  ampOpen: string;
  makers: string;
  makersEmpty: string;
  mics: string;
  micsLead: string;
  repertoire: string;
  schoolsEmpty: string;
  forum: string;
  forumLead: string;
  forumOpen: string;
  ctaTitle: string;
  ctaBody: string;
  ctaJams: string;
  ctaBoard: string;
  ctaDir: string;
  more: string;
  back: string;
  open: string;
  all: string;
};

const EN_CHROME: InstrumentChrome = {
  kicker: "The chairs",
  hub: "Instruments",
  lead: "The quintet is more than guitar. Lead, la pompe, violin, bass, clarinet, saxophone, accordion, mandolin, piano, harmonica, voice — each chair has its own language. Non-guitarists are not guests here. This is your door in.",
  later: "",
  language: "The language",
  start: "How to start",
  listen: "Players to listen to",
  shelf: "On this hub",
  schools: "Schools and lessons",
  videos: "Watch and learn",
  apps: "Apps",
  teachers: "Private teachers",
  teachersLead: "Teachers who joined the hub and play this chair. Message them if they have the soundhole mark.",
  teachersEmpty: "No private teacher listed for this chair yet. Add yourself if you teach it.",
  teachersAdd: "Add yourself as a teacher",
  luthiers: "Luthiers",
  luthiersGuitarLead:
    "Selmer-Maccaferri guitar makers. Open a name for the workshop. The same list lives on guitar and rhythm guitar.",
  luthiersBassLead:
    "Double bass is a core instrument in Gypsy Jazz. Makers, restorers and jazz-setup workshops, listed by country.",
  luthiersViolinLead:
    "Violin makers and workshops — new instruments, repairs and setup. Open a name for the workshop.",
  luthiersAll: "Browse all luthiers",
  shops: "Shops",
  shopsLead: "Shops that stock Selmer-Maccaferri style guitars. Open a name for address and hours.",
  shopsAll: "All guitar shops",
  charts: "Charts & books",
  chartsLead: "The shared jam book, plus methods for this chair.",
  amp: "Amplification",
  ampLead: "How to hear this chair in a café — not a rock stack.",
  ampOpen: "Open amplification",
  makers: "Makers / repair",
  makersEmpty: "No maker listed for this chair yet. Write if you repair or build for this room.",
  mics: "Microphones",
  micsLead: "Voice does not need a luthier. One mic into the same combo as the band.",
  repertoire: "Repertoire",
  schoolsEmpty: "No school listed for this chair yet.",
  forum: "Questions",
  forumLead: "Ask about this instrument. Anyone can read. Join the hub to post.",
  forumOpen: "Open the forum",
  ctaTitle: "This chair in the room",
  ctaBody: "Looking for players of this instrument? Find a jam, pin a note on the board, or open the directory.",
  ctaJams: "Find a jam",
  ctaBoard: "Ask the board",
  ctaDir: "Players of this instrument",
  more: "Other chairs",
  back: "← Learn gypsy jazz",
  open: "Open",
  all: "All instruments",
};

const CHROME: Record<string, Partial<InstrumentChrome>> = {
  nl: {
    kicker: "De partijen",
    hub: "Instrumenten",
    lead: "Het kwintet is meer dan gitaar. Lead, la pompe, viool, bas, klarinet, stem — elke partij heeft een eigen taal. Wie geen gitaar speelt is hier geen gast. Dit is de deur naar binnen.",
    later: "",
    language: "De taal",
    start: "Hoe je begint",
    listen: "Spelers om naar te luisteren",
    shelf: "Op deze hub",
    schools: "Scholen en lessen",
    videos: "Kijken en leren",
    apps: "Apps",
    teachers: "Privéleraren",
    teachersLead: "Leraren die de hub hebben gejoin en deze partij spelen. Stuur een bericht als het klankgat op hun naam staat.",
    teachersEmpty: "Nog geen privéleraar voor deze partij.",
    teachersAdd: "Zet jezelf als leraar",
    luthiers: "Gitaarbouwers",
    luthiersGuitarLead:
      "Selmer-Maccaferri gitaarbouwers. Open een naam voor de werkplaats.",
    luthiersBassLead:
      "Contrabas hoort bij gypsy jazz. Bouwers, restaurateurs en jazz-setup, per land.",
    luthiersViolinLead:
      "Vioolbouwers en ateliers — nieuwe instrumenten, reparatie en setup.",
    luthiersAll: "Alle bouwers",
    forum: "Vragen",
    forumLead: "Vraag over dit instrument. Iedereen mag lezen. Word lid om te schrijven.",
    forumOpen: "Open het forum",
    ctaTitle: "Deze partij in de kamer",
    ctaBody: "Zoek je spelers van dit instrument? Vind een jam, prik een briefje op het bord, of open de namenlijst.",
    ctaJams: "Vind een jam",
    ctaBoard: "Vraag het bord",
    ctaDir: "Spelers van dit instrument",
    more: "Andere partijen",
    back: "← Gypsy jazz leren",
    open: "Open",
    all: "Alle instrumenten",
  },
  fr: {
    kicker: "Les pupitres",
    hub: "Instruments",
    lead: "Le quintette, ce n’est pas que la guitare. Le lead, la pompe, le violon, la basse, la clarinette, la voix — chaque pupitre a sa langue. Les non-guitaristes ne sont pas des invités ici. C’est votre porte d’entrée.",
    later: "",
    language: "La langue",
    start: "Par où commencer",
    listen: "Des musiciens à écouter",
    shelf: "Sur ce hub",
    schools: "Écoles et cours",
    videos: "Regarder et apprendre",
    apps: "Applis",
    teachers: "Profs particuliers",
    teachersLead: "Les profs qui ont rejoint le hub et tiennent ce pupitre.",
    teachersEmpty: "Pas encore de prof particulier pour ce pupitre.",
    teachersAdd: "Ajoutez-vous comme prof",
    luthiers: "Luthiers",
    luthiersGuitarLead:
      "Facteurs de guitares Selmer-Maccaferri. Ouvre un nom pour l’atelier.",
    luthiersBassLead:
      "La contrebasse est au cœur du gypsy jazz. Facteurs, restaurateurs et setups jazz, par pays.",
    luthiersViolinLead:
      "Facteurs de violons et ateliers — instruments neufs, réparations et réglage.",
    luthiersAll: "Tous les luthiers",
    forum: "Questions",
    forumLead: "Posez une question sur cet instrument. Tout le monde peut lire.",
    forumOpen: "Ouvrir le forum",
    ctaTitle: "Ce pupitre dans la salle",
    ctaBody: "Vous cherchez des musiciens de cet instrument ? Trouvez un jam, épinglez un mot au tableau, ou ouvrez l’annuaire.",
    ctaJams: "Trouver un jam",
    ctaBoard: "Le tableau",
    ctaDir: "Musiciens de cet instrument",
    more: "Les autres pupitres",
    back: "← Apprendre le gypsy jazz",
    all: "Tous les instruments",
  },
  de: {
    kicker: "Die Stimmen",
    hub: "Instrumente",
    lead: "Das Quintett ist mehr als Gitarre. Lead, la pompe, Geige, Bass, Klarinette, Stimme — jede Stimme hat ihre Sprache. Wer keine Gitarre spielt, ist hier kein Gast. Das ist die Tür hinein.",
    later: "",
    language: "Die Sprache",
    start: "Wo du anfängst",
    listen: "Spieler zum Hören",
    shelf: "In diesem Hub",
    schools: "Schulen und Unterricht",
    videos: "Schauen und lernen",
    apps: "Apps",
    teachers: "Privatlehrer",
    teachersLead: "Lehrer, die dem Hub beigetreten sind und diesen Platz spielen.",
    teachersEmpty: "Noch kein Privatlehrer für diesen Platz.",
    teachersAdd: "Trag dich als Lehrer ein",
    forum: "Fragen",
    forumLead: "Frag zu diesem Instrument. Jeder darf lesen.",
    forumOpen: "Forum öffnen",
    ctaTitle: "Dieser Platz im Raum",
    ctaBody: "Suchst du Spieler dieses Instruments? Finde einen Jam, pinne einen Zettel ans Brett, oder öffne das Verzeichnis.",
    ctaJams: "Jam finden",
    ctaBoard: "Das Brett fragen",
    ctaDir: "Spieler dieses Instruments",
    more: "Die anderen Stimmen",
    back: "← Gypsy Jazz lernen",
    all: "Alle Instrumente",
  },
  es: {
    kicker: "Los atriles",
    hub: "Instrumentos",
    lead: "El quinteto es más que la guitarra. El lead, la pompe, el violín, el contrabajo, el clarinete, la voz — cada atril tiene su lengua. Quien no toca guitarra no es un invitado aquí. Esta es la puerta de entrada.",
    later: "",
    language: "El lenguaje",
    start: "Por dónde empezar",
    listen: "Músicos para escuchar",
    shelf: "En este hub",
    schools: "Escuelas y clases",
    ctaTitle: "Este atril en la sala",
    ctaBody: "¿Buscas músicos de este instrumento? Encuentra un jam, pincha una nota en el tablón, o abre el directorio.",
    ctaJams: "Buscar un jam",
    ctaBoard: "El tablón",
    ctaDir: "Músicos de este instrumento",
    more: "Los otros atriles",
    back: "← Aprender gypsy jazz",
    all: "Todos los instrumentos",
  },
  it: {
    kicker: "I leggii",
    hub: "Strumenti",
    lead: "Il quintetto non è solo chitarra. Lead, la pompe, violino, contrabbasso, clarinetto, voce — ogni leggio ha la sua lingua. Chi non suona la chitarra qui non è un ospite. Questa è la porta.",
    later: "",
    language: "Il linguaggio",
    start: "Da dove iniziare",
    listen: "Musicisti da ascoltare",
    shelf: "Su questo hub",
    schools: "Scuole e lezioni",
    ctaTitle: "Questo leggio in sala",
    ctaBody: "Cerchi musicisti di questo strumento? Trova un jam, attacca un biglietto alla bacheca, o apri l’elenco.",
    ctaJams: "Trova un jam",
    ctaBoard: "La bacheca",
    ctaDir: "Musicisti di questo strumento",
    more: "Gli altri leggii",
    back: "← Impara il gypsy jazz",
    all: "Tutti gli strumenti",
  },
  pt: {
    kicker: "Os naipes",
    hub: "Instrumentos",
    lead: "O quinteto é mais do que guitarra. Lead, la pompe, violino, contrabaixo, clarinete, voz — cada naipe tem a sua língua. Quem não toca guitarra não é visita aqui. Esta é a porta de entrada.",
    later: "",
    language: "A língua",
    start: "Por onde começar",
    listen: "Músicos para ouvir",
    shelf: "Neste hub",
    schools: "Escolas e aulas",
    ctaTitle: "Este naipe na sala",
    ctaBody: "Procuras músicos deste instrumento? Encontra um jam, põe um recado no quadro, ou abre o diretório.",
    ctaJams: "Encontrar um jam",
    ctaBoard: "O quadro",
    ctaDir: "Músicos deste instrumento",
    more: "Os outros naipes",
    back: "← Aprender gypsy jazz",
    all: "Todos os instrumentos",
  },
  hu: {
    kicker: "A szólamok",
    hub: "Hangszerek",
    lead: "A kvintett több, mint gitár. Lead, la pompe, hegedű, bőgő, klarinét, ének — minden szólamnak saját nyelve van. Aki nem gitározik, itt nem vendég. Ez a bejárat.",
    later: "",
    language: "A nyelv",
    start: "Hol kezdjed",
    listen: "Zenészek, akiket érdemes hallgatni",
    shelf: "Ezen a hubon",
    schools: "Iskolák és órák",
    ctaTitle: "Ez a szólam a teremben",
    ctaBody: "Ennek a hangszernek a játékosait keresed? Találj jamet, tűzz cetlit a táblára, vagy nyisd meg a névsort.",
    ctaJams: "Jam keresése",
    ctaBoard: "A tábla",
    ctaDir: "Ennek a hangszernek a játékosai",
    more: "A többi szólam",
    back: "← Tanulj gypsy jazzt",
    all: "Minden hangszer",
  },
  ro: {
    kicker: "Pupitrele",
    hub: "Instrumente",
    lead: "Cvintetul e mai mult decât chitara. Lead, la pompe, vioară, contrabas, clarinet, voce — fiecare pupitru are limba lui. Cine nu cântă la chitară nu e oaspete aici. Asta e ușa de intrare.",
    later: "",
    language: "Limba",
    start: "De unde începi",
    listen: "Muzicieni de ascultat",
    shelf: "Pe acest hub",
    schools: "Școli și lecții",
    ctaTitle: "Acest pupitru în sală",
    ctaBody: "Cauți muzicieni la acest instrument? Găsește un jam, pune un bilet pe tablă, sau deschide lista.",
    ctaJams: "Găsește un jam",
    ctaBoard: "Tabla",
    ctaDir: "Muzicieni la acest instrument",
    more: "Celelalte pupitre",
    back: "← Învață gypsy jazz",
    all: "Toate instrumentele",
  },
  sr: {
    kicker: "Pultovi",
    hub: "Instrumenti",
    lead: "Kvintet je više od gitare. Lead, la pompe, violina, bas, klarinet, glas — svaki pult ima svoj jezik. Ko ne svira gitaru ovde nije gost. Ovo su vrata unutra.",
    later: "",
    language: "Jezik",
    start: "Gde da počneš",
    listen: "Muzičari koje vredi slušati",
    shelf: "Na ovom hubu",
    schools: "Škole i časovi",
    ctaTitle: "Ovaj pult u sali",
    ctaBody: "Tražiš svirače ovog instrumenta? Nađi džem, zakači cedulju na tablu, ili otvori imenik.",
    ctaJams: "Nađi džem",
    ctaBoard: "Tabla",
    ctaDir: "Svirači ovog instrumenta",
    more: "Ostali pultovi",
    back: "← Uči gypsy jazz",
    all: "Svi instrumenti",
  },
  cs: {
    kicker: "Hlasy",
    hub: "Nástroje",
    lead: "Kvintet je víc než kytara. Lead, la pompe, housle, kontrabas, klarinet, hlas — každý hlas má svůj jazyk. Kdo nehraje na kytaru, tady není host. Tohle jsou dveře dovnitř.",
    later: "",
    language: "Jazyk",
    start: "Kde začít",
    listen: "Hráči k poslechu",
    shelf: "Na tomto hubu",
    schools: "Školy a hodiny",
    ctaTitle: "Tento hlas v sále",
    ctaBody: "Hledáš hráče tohoto nástroje? Najdi jam, připni lístek na nástěnku, nebo otevři adresář.",
    ctaJams: "Najít jam",
    ctaBoard: "Nástěnka",
    ctaDir: "Hráči tohoto nástroje",
    more: "Ostatní hlasy",
    back: "← Učit se gypsy jazz",
    all: "Všechny nástroje",
  },
  pl: {
    kicker: "Głosy",
    hub: "Instrumenty",
    lead: "Kwintet to więcej niż gitara. Lead, la pompe, skrzypce, kontrabas, klarnet, głos — każdy głos ma swój język. Kto nie gra na gitarze, tu nie jest gościem. To drzwi do środka.",
    later: "",
    language: "Język",
    start: "Od czego zacząć",
    listen: "Muzycy do słuchania",
    shelf: "Na tym hubie",
    schools: "Szkoły i lekcje",
    ctaTitle: "Ten głos w sali",
    ctaBody: "Szukasz muzyków tego instrumentu? Znajdź jam, przypnij kartkę na tablicy, albo otwórz spis.",
    ctaJams: "Znajdź jam",
    ctaBoard: "Tablica",
    ctaDir: "Muzycy tego instrumentu",
    more: "Pozostałe głosy",
    back: "← Ucz się gypsy jazzu",
    all: "Wszystkie instrumenty",
  },
};

type PartialCopy = Partial<Omit<InstrumentCopy, "techniques" | "tips">> & {
  techniques?: InstrumentCopy["techniques"];
  tips?: string[];
};

const PACKS: Record<string, Partial<Record<InstrumentSlug, PartialCopy>>> = {
  nl: {
    "solo-guitar": {
      name: "Sologitaar",
      role: "Lead",
      blurb: "De zingende lijn boven de pompe.",
      intro:
        "In gypsy jazz is de leadgitaar de hoorn. Django schreef de taal met twee vingers op een Selmer — rest-stroke, arpeggio’s, een melodie die stil kan zitten of vlam kan vatten. De stoel is nu van Stochelo, Biréli, Joscho, Tchavolo, Mozes: andere scholen, dezelfde taak. Jij neemt het thema, jij neemt coupletten, jij geeft het terug.",
      techniques: [
        {
          title: "Rest-stroke",
          body: "De plectrum rust na elke downstroke op de volgende snaar. Dat is de gypsy-klank: dik, percussief, zingend. Snelheid zonder die aanslag zijn maar noten.",
        },
        {
          title: "Arpeggio’s over de akkoorden",
          body: "Minor Swing is geen toonladderoefening. Teken het akkoord, versier daarna. Eén couplet Django, dan één Stochelo — meng de scholen niet voordat je ze hoort.",
        },
        {
          title: "De Selmer-stem",
          body: "Een zware plectrum, downstrokes op de sterke noten, lucht tussen de zinnen. Onder jou moet de kamer de pompe nog horen.",
        },
      ],
      tips: [
        "Leer eerst de pompe, ook als je wilt soleren. Een leadspeler zonder tijd wordt niet teruggevraagd.",
        "Drie nummers om in te stappen: Minor Swing, All of Me, Dark Eyes. Daarna Nuages, langzaam.",
        "Kopieer één couplet, doe dan de video dicht. De jam wacht niet op een transcriptie.",
      ],
    },
    "rhythm-guitar": {
      name: "Ritmegitaar",
      role: "La pompe",
      blurb: "De motor van het kwintet — twee en vier, elke maat.",
      intro:
        "La pompe is de drums van gypsy jazz. Zonder pompe is er geen kamer. Joseph Reinhardt zette het model; Nous'che Rosenberg drijft er nog altijd het Rosenberg Trio mee. De taak is tijd, geen versiering: basnoot, akkoord, dempen, opnieuw — een pomp waar de soloist op kan leunen.",
      techniques: [
        {
          title: "De pomp",
          body: "Bas op één en drie (vaak gedempt), akkoord op twee en vier met een scherpe, percussieve aanslag. De rechterhand is een drumstelpols, geen strum-arm.",
        },
        {
          title: "Drieklanken",
          body: "Gesloten voicings, geen extra snaren die doorzingen. Helderheid boven stretch. De bas heeft de grondtoon al — jij zet de snare erbij.",
        },
        {
          title: "Op slot met de bas",
          body: "Als de bas loopt, blijf jij in two-feel. Als jij haast, haast de hele kamer. Neem jezelf op. Luister naar het gat na elk akkoord.",
        },
      ],
      tips: [
        "Oefen met La Pompe Live of een metronoom op twee en vier. De app staat op deze hub.",
        "Later mag je een couplet nemen. Eerste avonden: houd de tijd en laat ruimte voor iemand nieuwer.",
        "Kijk naar Nous'che, Hono Winterstein, Ninine Garcia. Kopieer de rechterhand vóór de linker.",
      ],
    },
    violin: {
      name: "Viool",
      role: "Melodie",
      blurb: "De stoel van Grappelli — de andere helft van de Hot Club.",
      intro:
        "Stéphane Grappelli maakte de viool tot tweeling van Django’s gitaar: salon-elegantie, dansvloerswing, een melodie die blijft zweven. De stoel is nog open. Florin Niculescu, Tcha Limberger, Tim Kliphuis, Costel Nitescu, Christiaan van Hemert, Roby Lakatos — ieder een ander accent, allemaal in hetzelfde boek.",
      techniques: [
        {
          title: "Swingstrijk",
          body: "Geen klassiek détaché. De stok spreekt in zinnen, met een lichte beet op de off-beat. Grappelli zweefde; Schnuckenack groef. Weet in welke kamer je zit.",
        },
        {
          title: "Versieringen",
          body: "Glissandi, voorslagen, een vibrato dat ná de noot begint, niet erop. De gitaar heeft al rest-stroke. Jij hebt lucht nodig, geen extra aanslag.",
        },
        {
          title: "Het thema delen",
          body: "Unisono met de gitaar, dan een couplet, dan laat je het aan de gitaar. Twee melodieën tegelijk is file.",
        },
      ],
      tips: [
        "Ken de gitaarakkoorden. Een viool die alleen de melodie kent, raakt na het thema kwijt.",
        "Stap in na het eerste nummer. Kijk naar de host. Als hij knikt, neem acht maten, dan vierentwintig.",
        "Een stille pickup, nooit een rockgeluid. De pagina over versterking op deze hub is ook voor deze stoel.",
      ],
    },
    "double-bass": {
      name: "Contrabas",
      role: "De vloer",
      blurb: "Tijd onder de pompe — walking of two-feel.",
      intro:
        "Louis Vola hield het oorspronkelijke kwintet op de vloer. De stoel is nu van Nonnie Rosenberg, Sébastien Girardot, Diego Imbert en de first-call spelers die met de gitaarsterren reizen. Jij sluit aan op de pompe, jij loopt als de soloist lucht nodig heeft, en jij gaat de twee-en-vier nooit in de weg.",
      techniques: [
        {
          title: "Two-feel en walking",
          body: "Two-feel met de pompe bij het thema; walking coupletten als de gitaar vlam vat. Terug naar two bij het laatste thema. Dat is het hele arrangement.",
        },
        {
          title: "Korte noten",
          body: "Manouche-bas is percussief. Laat het gitaarakkoord spreken in het gat dat jij laat. Een lange, zingende bas maakt van het kwintet een andere band.",
        },
        {
          title: "De toon van de kamer",
          body: "Jij bent de noot waarop de viool stemt. Wees er vóór de eerste downbeat, en blijf in het midden van het akkoord.",
        },
      ],
      tips: [
        "Ken de grondtonen van Minor Swing, All of Me, Dark Eyes, Nuages. Dat is genoeg voor een eerste sit-in.",
        "Zie de pagina over versterking: hoe je een bas in een café hoort zonder er rock van te maken.",
        "Als er al een bas is, wacht. Twee bassen op een jam is file.",
      ],
    },
    clarinet: {
      name: "Klarinet",
      role: "Hoorn",
      blurb: "Het riet van de Hot Club — een zingend couplet, dan ruimte.",
      intro:
        "Toen Grappelli naar Engeland vertrok, droeg Django’s kwintet vaak een klarinet — Hubert Rostaing voorop. Het riet is nog welkom: Giacomo Smith tegenover Mozes Rosenberg, Dominique Paats naast Paulus Schäfer, een klarinet op een Argentijnse jam. Jij neemt een couplet als een hoorn, jij laat ruimte, jij wordt geen tweede viool.",
      techniques: [
        {
          title: "Swing-tong",
          body: "Licht, op de tel, geen harmonieorkest. Denk Rostaing: een zingende lijn die ook kan bijten. Saxofoon is de neef — hetzelfde boek, dezelfde manieren.",
        },
        {
          title: "Eén couplet, dan lucht",
          body: "Gitaar en viool vullen de bovenkant al. Jouw werk is kleur en een verhaal, geen constante lijnen. Speel, luister daarna even hard.",
        },
        {
          title: "Eerst de melodie",
          body: "Nuages en Minor Swing als liederen, daarna de akkoorden. Kun je het thema niet zingen, neem dan het couplet nog niet.",
        },
      ],
      tips: [
        "Vraag de host voordat je uitpakt. Stap in na het thema, niet erbovenop.",
        "Luister naar Mozes Rosenberg & Giacomo Smith — de plaat Manouche is een levend model.",
        "Een stille clip-on, nooit een podiumstapel. De pagina over versterking is ook voor deze stoel.",
      ],
    },
    vocals: {
      name: "Zang",
      role: "Stem",
      blurb: "Chanson voor de pompe — een zanger waar de kamer in kan lopen.",
      intro:
        "Gypsy jazz is niet alleen instrumentaal. Cyrille Aimée groeide op in Samois en nam de stem de wereld rond. Marcia Bamberg zette een zangeres weer voor een Nederlands kwartet, zodat een nieuw publiek de muziek in kon lopen. De stoel is een frontlinie: Franse en Engelse liederen, swing, en een band die weet wanneer spelen en wanneer luisteren.",
      techniques: [
        {
          title: "Tijd boven vibrato",
          body: "Zit op de pompe. De gitaar antwoordt als jij gaten laat. Een zanger die haast is een ander tempo dan de kamer.",
        },
        {
          title: "Het boek",
          body: "Nuages, Si tu savais, Coquette, All of Me. Ken de tekst én de vorm — waar de bridge is, waar de tag is, wanneer je stopt.",
        },
        {
          title: "Voorop, niet erboven",
          body: "Jij bent een extra hoorn. Zing de kamer niet weg. Eén couplet, rust, dan het thema terug naar de gitaar.",
        },
      ],
      tips: [
        "Begin met één nummer dat de jam al roept. Vraag de host om de toonsoort vóór je start.",
        "Marcia Bamberg geeft zangles in Noord-Holland. Lessen bestaan. Gebruik ze.",
        "Prik een briefje op het bord als je een gitaar zoekt voor een zondagmiddag.",
      ],
    },
  },
  fr: {
    "solo-guitar": {
      name: "Guitare solo",
      role: "Lead",
      blurb: "La ligne qui chante au-dessus de la pompe.",
      intro:
        "En gypsy jazz, la guitare lead est le cuivre. Django a écrit la langue avec deux doigts sur une Selmer — rest-stroke, arpèges, une mélodie qui peut tenir ou prendre feu. Le pupitre est aujourd’hui celui de Stochelo, Biréli, Joscho, Tchavolo, Mozes : des écoles différentes, le même métier. Tu prends le thème, tu prends les chorus, tu rends la main.",
      techniques: [
        {
          title: "Le rest-stroke",
          body: "Le médiator se pose sur la corde suivante après chaque downstroke. C’est le son manouche : gras, percussif, chantant. La vitesse sans cette attaque, ce ne sont que des notes.",
        },
        {
          title: "Arpèges sur les changements",
          body: "Minor Swing n’est pas un exercice de gamme. Dessine l’accord, puis orne. Un chorus de Django, puis un de Stochelo — ne mélange pas les écoles avant de les entendre.",
        },
        {
          title: "La voix Selmer",
          body: "Un médiator lourd, des downstrokes sur les notes fortes, de l’air entre les phrases. La salle doit encore entendre la pompe sous toi.",
        },
      ],
      tips: [
        "Apprends d’abord la pompe, même si tu veux soler. Un lead qui n’a pas le tempo n’est pas rappelé.",
        "Trois morceaux pour s’asseoir : Minor Swing, All of Me, Dark Eyes. Ensuite Nuages, lent.",
        "Copie un chorus, puis ferme la vidéo. Le jam n’attendra pas une transcription.",
      ],
    },
    "rhythm-guitar": {
      name: "Guitare rythme",
      role: "La pompe",
      blurb: "Le moteur du quintette — deux et quatre, chaque mesure.",
      intro:
        "La pompe, c’est la batterie du gypsy jazz. Sans elle, il n’y a pas de salle. Joseph Reinhardt a posé le modèle ; Nous'che Rosenberg fait encore avancer le Rosenberg Trio avec. Le métier, c’est le tempo, pas l’ornement : basse, accord, étouffer, recommencer — une pompe sur laquelle le soliste peut s’appuyer.",
      techniques: [
        {
          title: "La pompe",
          body: "Basse sur un et trois (souvent étouffée), accord sur deux et quatre, attaque sèche et percussive. La main droite est un poignet de batteur, pas un bras de strummer.",
        },
        {
          title: "Accords à trois sons",
          body: "Voicings fermés, pas de cordes qui sonnent en trop. La clarté avant l’écartement. La basse a déjà la fondamentale — tu ajoutes le claquement de caisse claire.",
        },
        {
          title: "Collé à la basse",
          body: "Si la basse marche, tu restes en two-feel. Si tu te précipites, toute la salle se précipite. Enregistre-toi. Écoute le trou après chaque accord.",
        },
      ],
      tips: [
        "Travaille avec La Pompe Live ou un métronome sur deux et quatre. L’app est sur ce hub.",
        "Tu pourras prendre un chorus plus tard. Les premières soirées : tiens le tempo et laisse de la place aux plus nouveaux.",
        "Regarde Nous'che, Hono Winterstein, Ninine Garcia. Copie la main droite avant la gauche.",
      ],
    },
    violin: {
      name: "Violon",
      role: "Mélodie",
      blurb: "Le pupitre de Grappelli — l’autre moitié du Hot Club.",
      intro:
        "Stéphane Grappelli a fait du violon le jumeau de la guitare de Django : élégance de salon, swing de piste, une mélodie qui flotte. Le pupitre est encore ouvert. Florin Niculescu, Tcha Limberger, Tim Kliphuis, Costel Nitescu, Christiaan van Hemert, Roby Lakatos — chacun un accent, tous dans le même livre.",
    },
    "double-bass": {
      name: "Contrebasse",
      role: "Le plancher",
      blurb: "Le tempo sous la pompe — walking ou two-feel.",
      intro:
        "Louis Vola tenait le Quintette d’origine au plancher. Le pupitre est aujourd’hui celui de Nonnie Rosenberg, Sébastien Girardot, Diego Imbert et des bassistes first-call qui voyagent avec les guitaristes. Tu te colles à la pompe, tu marches quand le soliste a besoin d’air, et tu ne te mets jamais en travers du deux-et-quatre.",
    },
    clarinet: {
      name: "Clarinette",
      role: "Anche",
      blurb: "L’anche du Hot Club — un chorus qui chante, puis de l’air.",
      intro:
        "Après le départ de Grappelli pour l’Angleterre, le Quintette de Django portait souvent une clarinette — Hubert Rostaing le premier. L’anche est encore la bienvenue : Giacomo Smith face à Mozes Rosenberg, Dominique Paats à côté de Paulus Schäfer, une clarinette sur un jam argentin. Tu prends un chorus comme un cuivre, tu laisses de l’air, tu ne deviens pas un second violon.",
    },
    vocals: {
      name: "Voix",
      role: "Chant",
      blurb: "La chanson devant la pompe — une voix où la salle peut entrer.",
      intro:
        "Le gypsy jazz n’est pas seulement instrumental. Cyrille Aimée a grandi à Samois et a emmené la voix autour du monde. Marcia Bamberg a remis une chanteuse devant un quartet néerlandais pour qu’un public nouveau puisse entrer dans la musique. Le pupitre est une première ligne : chansons françaises et anglaises, le swing, et un groupe qui sait quand jouer et quand écouter.",
    },
  },
  de: {
    "solo-guitar": {
      name: "Sologitarre",
      role: "Lead",
      blurb: "Die singende Linie über der Pompe.",
      intro:
        "Im Gypsy Jazz ist die Leadgitarre das Horn. Django hat die Sprache mit zwei Fingern auf einer Selmer geschrieben — Rest-Stroke, Arpeggien, eine Melodie, die stillsitzen oder Feuer fangen kann. Der Platz gehört heute Stochelo, Biréli, Joscho, Tchavolo, Mozes: andere Schulen, dieselbe Aufgabe. Du nimmst das Thema, du nimmst Chorusse, du gibst ab.",
    },
    "rhythm-guitar": {
      name: "Rhythmusgitarre",
      role: "La pompe",
      blurb: "Der Motor des Quintetts — zwei und vier, in jedem Takt.",
      intro:
        "La pompe ist das Schlagzeug des Gypsy Jazz. Ohne sie gibt es keinen Raum. Joseph Reinhardt hat das Modell gesetzt; Nous'che Rosenberg treibt damit noch immer das Rosenberg Trio. Die Aufgabe ist Zeit, keine Verzierung: Bassnote, Akkord, dämpfen, von vorn — eine Pumpe, an der der Solist sich anlehnen kann.",
    },
    violin: {
      name: "Geige",
      role: "Melodie",
      blurb: "Grappellis Platz — die andere Hälfte des Hot Club.",
      intro:
        "Stéphane Grappelli hat die Geige zur Zwillingsschwester von Djangos Gitarre gemacht: Salon-Eleganz, Tanzflächen-Swing, eine Melodie, die schwebt. Der Platz ist noch offen. Florin Niculescu, Tcha Limberger, Tim Kliphuis, Costel Nitescu, Christiaan van Hemert, Roby Lakatos — jeder mit anderem Akzent, alle im selben Buch.",
    },
    "double-bass": {
      name: "Kontrabass",
      role: "Der Boden",
      blurb: "Zeit unter der Pompe — Walking oder Two-Feel.",
      intro:
        "Louis Vola hielt das ursprüngliche Quintett auf dem Boden. Heute sitzen Nonnie Rosenberg, Sébastien Girardot, Diego Imbert und die First-Call-Spieler, die mit den Gitarrenstars reisen. Du rastest an der Pompe ein, du gehst, wenn der Solist Luft braucht, und du gehst dem Zwei-und-Vier nie in die Quere.",
    },
    clarinet: {
      name: "Klarinette",
      role: "Horn",
      blurb: "Das Rohrblatt des Hot Club — ein singender Chorus, dann Luft.",
      intro:
        "Als Grappelli nach England ging, trug Djangos Quintett oft eine Klarinette — Hubert Rostaing vorneweg. Das Blatt ist noch willkommen: Giacomo Smith gegenüber Mozes Rosenberg, Dominique Paats neben Paulus Schäfer, eine Klarinette auf einem argentinischen Jam. Du nimmst einen Chorus wie ein Horn, du lässt Luft, du wirst keine zweite Geige.",
    },
    vocals: {
      name: "Gesang",
      role: "Stimme",
      blurb: "Chanson vor der Pompe — eine Stimme, in die der Raum hineingehen kann.",
      intro:
        "Gypsy Jazz ist nicht nur instrumental. Cyrille Aimée ist in Samois aufgewachsen und hat die Stimme um die Welt genommen. Marcia Bamberg hat eine Sängerin wieder vor ein niederländisches Quartett gestellt, damit ein neues Publikum in die Musik hineingehen kann. Der Platz ist eine Frontlinie: französische und englische Songs, Swing, und eine Band, die weiß, wann sie spielt und wann sie hört.",
    },
  },
  es: {
    "solo-guitar": {
      name: "Guitarra solista",
      role: "Lead",
      blurb: "La línea que canta sobre la pompe.",
      intro:
        "En el gypsy jazz la guitarra lead es el viento. Django escribió la lengua con dos dedos sobre una Selmer — rest-stroke, arpegios, una melodía que puede quedarse quieta o prenderse. El atril es hoy el de Stochelo, Biréli, Joscho, Tchavolo, Mozes: escuelas distintas, el mismo oficio. Tomas el tema, tomas los chorus, lo devuelves.",
    },
    "rhythm-guitar": {
      name: "Guitarra rítmica",
      role: "La pompe",
      blurb: "El motor del quinteto — dos y cuatro, cada compás.",
      intro:
        "La pompe es la batería del gypsy jazz. Sin ella no hay sala. Joseph Reinhardt puso el modelo; Nous'che Rosenberg sigue empujando con ella el Rosenberg Trio. El oficio es el tiempo, no el adorno: nota de bajo, acorde, apagar, otra vez — una bomba en la que el solista puede apoyarse.",
    },
    violin: {
      name: "Violín",
      role: "Melodía",
      blurb: "El atril de Grappelli — la otra mitad del Hot Club.",
      intro:
        "Stéphane Grappelli hizo del violín el gemelo de la guitarra de Django: elegancia de salón, swing de pista, una melodía que flota. El atril sigue abierto. Florin Niculescu, Tcha Limberger, Tim Kliphuis, Costel Nitescu, Christiaan van Hemert, Roby Lakatos — cada uno un acento, todos en el mismo libro.",
    },
    "double-bass": {
      name: "Contrabajo",
      role: "El suelo",
      blurb: "El tiempo debajo de la pompe — walking o two-feel.",
      intro:
        "Louis Vola sujetaba el Quinteto original al suelo. Hoy el atril es el de Nonnie Rosenberg, Sébastien Girardot, Diego Imbert y los contrabajistas de primera llamada que viajan con las estrellas de guitarra. Te pegas a la pompe, caminas cuando el solista necesita aire, y nunca te pones en medio del dos y el cuatro.",
    },
    clarinet: {
      name: "Clarinete",
      role: "Viento",
      blurb: "La caña del Hot Club — un chorus que canta, luego aire.",
      intro:
        "Cuando Grappelli se fue a Inglaterra, el Quinteto de Django llevaba a menudo un clarinete — Hubert Rostaing el primero. La caña sigue siendo bienvenida: Giacomo Smith frente a Mozes Rosenberg, Dominique Paats junto a Paulus Schäfer, un clarinete en un jam argentino. Tomas un chorus como un viento, dejas aire, no te conviertes en un segundo violín.",
    },
    vocals: {
      name: "Voz",
      role: "Canto",
      blurb: "La chanson delante de la pompe — una voz por la que la sala puede entrar.",
      intro:
        "El gypsy jazz no es solo instrumental. Cyrille Aimée creció en Samois y llevó la voz por el mundo. Marcia Bamberg volvió a poner a una cantante delante de un cuarteto neerlandés para que un público nuevo pudiera entrar en la música. El atril es una primera línea: canciones francesas e inglesas, swing, y una banda que sabe cuándo tocar y cuándo escuchar.",
    },
  },
  hu: {
    "solo-guitar": {
      name: "Szólógitár",
      role: "Lead",
      blurb: "A daloló szólam a pompe fölött.",
      intro:
        "A gypsy jazzben a leadgitár a fúvós. Django két ujjal írta a nyelvet egy Selmeren — rest-stroke, arpeggio, dallam, ami tud csendben maradni, és tud lángra kapni. A szólam ma Stocheloé, Birélié, Joschoé, Tchavolóé, Mozesé: más iskolák, ugyanaz a munka. Te viszed a témát, te viszed a chorusokat, te adod vissza.",
    },
    "rhythm-guitar": {
      name: "Ritmusgitár",
      role: "La pompe",
      blurb: "A kvintett motorja — kettő és négy, minden ütemben.",
      intro:
        "A la pompe a gypsy jazz dobja. Nélküle nincs terem. Joseph Reinhardt tette le a mintát; Nous'che Rosenberg még mindig ezzel hajtja a Rosenberg Triót. A munka az idő, nem a díszítés: basszus, akkord, tompítás, újra — egy pumpa, amire a szólista ráhajolhat.",
    },
    violin: {
      name: "Hegedű",
      role: "Dallam",
      blurb: "Grappelli széke — a Hot Club másik fele.",
      intro:
        "Stéphane Grappelli a hegedűt Django gitárjának ikrévé tette: szalon-elegancia, tánctéri swing, dallam, ami lebeg. A szólam még nyitva. Florin Niculescu, Tcha Limberger, Tim Kliphuis, Costel Nitescu, Christiaan van Hemert, Roby Lakatos — más-más hangsúly, ugyanaz a könyv.",
    },
    "double-bass": {
      name: "Nagybőgő",
      role: "A padló",
      blurb: "Idő a pompe alatt — walking vagy two-feel.",
      intro:
        "Louis Vola tartotta a padlón az eredeti kvintettet. Ma Nonnie Rosenberg, Sébastien Girardot, Diego Imbert és a gitárcsillagokkal utazó first-call bőgősök ülnek itt. Te zárkózol a pompéhez, te sétálsz, ha a szólistának levegő kell, és soha nem állsz a kettő-és-négy útjába.",
    },
    clarinet: {
      name: "Klarinét",
      role: "Fúvós",
      blurb: "A Hot Club nádja — egy daloló chorus, aztán levegő.",
      intro:
        "Amikor Grappelli Angliába ment, Django kvintettje gyakran klarinéttal ment — Hubert Rostaing az elsők között. A nád ma is vendég: Giacomo Smith Mozes Rosenberggel szemben, Dominique Paats Paulus Schäfer mellett, klarinét egy argentin jamon. Chorus, mint egy fúvós, aztán tér, és nem leszel második hegedű.",
    },
    vocals: {
      name: "Ének",
      role: "Hang",
      blurb: "Chanson a pompe előtt — énekes, akibe a terem bele tud sétálni.",
      intro:
        "A gypsy jazz nem csak hangszeres. Cyrille Aimée Samois-ban nőtt fel, és a hangot a világ köré vitte. Marcia Bamberg újra énekest ültetett egy holland kvartett elé, hogy új közönség sétálhasson be a zenébe. A szólam frontvonal: francia és angol dalok, swing, és egy zenekar, amely tudja, mikor játsszon, és mikor hallgasson.",
    },
  },
  it: {
    "solo-guitar": { name: "Chitarra solista", role: "Lead", blurb: "La linea che canta sopra la pompe." },
    "rhythm-guitar": { name: "Chitarra ritmica", role: "La pompe", blurb: "Il motore del quintetto — due e quattro, ogni battuta." },
    violin: { name: "Violino", role: "Melodia", blurb: "Il leggio di Grappelli — l’altra metà dell’Hot Club." },
    "double-bass": { name: "Contrabbasso", role: "Il pavimento", blurb: "Il tempo sotto la pompe — walking o two-feel." },
    clarinet: { name: "Clarinetto", role: "Fiati", blurb: "L’ancia dell’Hot Club — un chorus che canta, poi aria." },
    vocals: { name: "Voce", role: "Canto", blurb: "La chanson davanti alla pompe — una voce in cui la sala può entrare." },
  },
  pt: {
    "solo-guitar": { name: "Guitarra solo", role: "Lead", blurb: "A linha que canta por cima da pompe." },
    "rhythm-guitar": { name: "Guitarra ritmo", role: "La pompe", blurb: "O motor do quinteto — dois e quatro, em cada compasso." },
    violin: { name: "Violino", role: "Melodia", blurb: "O naipe de Grappelli — a outra metade do Hot Club." },
    "double-bass": { name: "Contrabaixo", role: "O chão", blurb: "O tempo debaixo da pompe — walking ou two-feel." },
    clarinet: { name: "Clarinete", role: "Sopro", blurb: "A palheta do Hot Club — um chorus que canta, depois ar." },
    vocals: { name: "Voz", role: "Canto", blurb: "A chanson à frente da pompe — uma voz por onde a sala pode entrar." },
  },
  ro: {
    "solo-guitar": { name: "Chitară solo", role: "Lead", blurb: "Linia care cântă deasupra pompe." },
    "rhythm-guitar": { name: "Chitară ritm", role: "La pompe", blurb: "Motorul cvintetului — doi și patru, în fiecare măsură." },
    violin: { name: "Vioară", role: "Melodie", blurb: "Pupitrul lui Grappelli — cealaltă jumătate a Hot Club." },
    "double-bass": { name: "Contrabas", role: "Pardoseala", blurb: "Timpul sub pompe — walking sau two-feel." },
    clarinet: { name: "Clarinet", role: "Suflător", blurb: "Ancina Hot Club — un chorus care cântă, apoi aer." },
    vocals: { name: "Voce", role: "Cânt", blurb: "Chanson în fața pompe — o voce în care sala poate intra." },
  },
  sr: {
    "solo-guitar": { name: "Solo gitara", role: "Lead", blurb: "Linija koja peva iznad pompe." },
    "rhythm-guitar": { name: "Ritam gitara", role: "La pompe", blurb: "Motor kvinteta — dva i četiri, u svakom taktu." },
    violin: { name: "Violina", role: "Melodija", blurb: "Grappellijev pult — druga polovina Hot Cluba." },
    "double-bass": { name: "Kontrabas", role: "Pod", blurb: "Vreme ispod pompe — walking ili two-feel." },
    clarinet: { name: "Klarinet", role: "Duvacki", blurb: "Jezičak Hot Cluba — chorus koji peva, pa vazduh." },
    vocals: { name: "Vokal", role: "Glas", blurb: "Šansona ispred pompe — glas u koji sala može da uđe." },
  },
  cs: {
    "solo-guitar": { name: "Solová kytara", role: "Lead", blurb: "Zpívající linka nad pompe." },
    "rhythm-guitar": { name: "Rytmická kytara", role: "La pompe", blurb: "Motor kvintetu — dvě a čtyři, v každém taktu." },
    violin: { name: "Housle", role: "Melodie", blurb: "Grappelliho pult — druhá polovina Hot Clubu." },
    "double-bass": { name: "Kontrabas", role: "Podlaha", blurb: "Čas pod pompe — walking nebo two-feel." },
    clarinet: { name: "Klarinet", role: "Dech", blurb: "Plátek Hot Clubu — zpívající chorus, pak vzduch." },
    vocals: { name: "Zpěv", role: "Hlas", blurb: "Šanson před pompe — hlas, do kterého sál může vejít." },
  },
  pl: {
    "solo-guitar": { name: "Gitara solowa", role: "Lead", blurb: "Śpiewająca linia nad pompe." },
    "rhythm-guitar": { name: "Gitara rytmiczna", role: "La pompe", blurb: "Silnik kwintetu — dwa i cztery, w każdym takcie." },
    violin: { name: "Skrzypce", role: "Melodia", blurb: "Pult Grappelliego — druga połowa Hot Clubu." },
    "double-bass": { name: "Kontrabas", role: "Podłoga", blurb: "Czas pod pompe — walking albo two-feel." },
    clarinet: { name: "Klarnet", role: "Dęty", blurb: "Stroik Hot Clubu — śpiewający chorus, potem powietrze." },
    vocals: { name: "Wokal", role: "Głos", blurb: "Szanson przed pompe — głos, w który sala może wejść." },
  },
};

export function instrumentChrome(locale: string): InstrumentChrome {
  return { ...EN_CHROME, ...(CHROME[locale] ?? {}) };
}

export function instrumentCopy(slug: InstrumentSlug, locale: string): InstrumentCopy {
  const en = EN_INSTRUMENT_COPY[slug];
  const loc = PACKS[locale]?.[slug];
  if (!loc) return en;
  return {
    name: loc.name ?? en.name,
    role: loc.role ?? en.role,
    blurb: loc.blurb ?? en.blurb,
    intro: loc.intro ?? en.intro,
    techniques: loc.techniques ?? en.techniques,
    tips: loc.tips ?? en.tips,
  };
}
