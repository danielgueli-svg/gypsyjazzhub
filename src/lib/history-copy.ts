/** History page chrome + Django sections. Follows the language switch. */

import {
  HISTORY_FOOTER,
  HISTORY_HOUSES,
  HISTORY_GAP_STORY,
  type HistoryFooter,
  type HistoryHouse,
} from "@/lib/history-story-i18n";
import { HISTORY_GAP_CHAPTERS, HISTORY_GAP_STORY_MORE } from "@/lib/history-story-rest";

export type HistoryChrome = {
  kicker: string;
  title: string;
  lead: string;
  chaptersNav: string;
  expand: string;
  collapse: string;
  expandAll: string;
  collapseAll: string;
  toc: { id: string; label: string }[];
  storyKicker: string;
  storyTitle: string;
  fullLife: string;
  housesKicker: string;
  housesTitle: string;
  photosKicker: string;
  photosTitle: string;
  photosLead: string;
  filmKicker: string;
  filmTitle: string;
  filmLead: string;
  aboutClip: string;
  timelineKicker: string;
  timelineTitle: string;
  opensRomani: string;
  sections: Record<string, { title: string; body: string[] }>;
  djangoBody: string;
  djangoYoutube: string;
  films: Record<string, string>;
  chapters: Record<string, { title: string; body: string[] }>;
  houses: Record<string, HistoryHouse>;
} & HistoryFooter;


const EN: HistoryChrome = {
  kicker: "Lineage",
  title: "History of Gypsy Jazz and the Sinti",
  lead: "Gypsy jazz did not begin in a studio or a conservatory. It grew out of a much older tradition carried by the Sinti across Europe.",
  chaptersNav: "Chapters",
  expand: "Expand",
  collapse: "Collapse",
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  toc: [
    { id: "story", label: "Story" },
    { id: "houses", label: "Houses" },
    { id: "photographs", label: "Photographs" },
    { id: "on-film", label: "On film" },
    { id: "timeline", label: "Timeline" },
  ],
  storyKicker: "The reading",
  storyTitle: "Story",
  fullLife: "Full life:",
  housesKicker: "The families",
  housesTitle: "Houses",
  photosKicker: "From the archives",
  photosTitle: "Photographs",
  photosLead:
    "Real scans — not generated pictures. William P. Gottlieb’s 1946 Aquarium session is public domain (Library of Congress). The later photographs are used under the licences named on each frame.",
  filmKicker: "On film, before 1960",
  filmTitle: "Django and Grappelli",
  filmLead:
    "Almost no camera found them. This is the old footage — the 1939 film of the two together, the 1937 record, Nuages from the war, and the 1949 reunion in Rome. Grappelli lived long enough to be filmed later; these clips stay before 1960.",
  aboutClip: "About this clip",
  timelineKicker: "The public music",
  timelineTitle: "From the bals musette to Samois",
  opensRomani: "Opens www.romanimusic.com",
  djangoBody:
    "The central figure. Born into a Manouche family, he created the style that became known worldwide as Gypsy jazz.",
  djangoYoutube: "Minor Swing",
  sections: {
    "Music before Django": {
      title: "Music before Django",
      body: [
        "By the nineteenth and early twentieth centuries these musical families were firmly rooted in the countries that would become the heartland of Gypsy jazz. In Germany the name Sinti had become the preferred self-designation. In France the related Manouche families lived around Paris and in the east. In the Netherlands and Belgium smaller but continuous groups maintained the same traditions of travel, craft, and music. The sound that later became known as Gypsy jazz already existed in embryo: strong rhythm, emotional melody, and an oral way of learning.",
      ],
    },
    "Django and the birth of a style": {
      title: "Django and the birth of a style",
      body: [
        "In the 1930s one of those musicians changed everything. Jean “Django” Reinhardt, born into a Manouche family with roots linking Belgium, France, and the wider Sinti world, fused the old family style with the new American jazz he heard in Paris. With the Quintette du Hot Club de France he created a sound that was both modern and deeply rooted: the driving “la pompe” rhythm, the fiery single-note lines, the emotional depth that came from generations of oral tradition. Django did not invent Sinti music. He carried it into a new century and gave it a name the wider world would recognise.",
      ],
    },
    "The Claridge and the Club": {
      title: "The Claridge and the Club",
      body: [
        "In the summer of 1934 Django and Grappelli were already in Louis Vola’s band at the Hôtel Claridge on the Champs-Élysées. After the paid set they kept playing in a side room. Pierre Nourry and Charles Delaunay, from the Hot Club de France — a listeners’ society around Hugues Panassié — heard it and pushed them to become a group. The first sides that winter sometimes went out as “Delaunay’s Jazz.” The musicians made the music. The Club gave it a door and, later, the Swing label that carried the records.",
      ],
    },
    "After Django — a living tradition": {
      title: "After Django — a living tradition",
      body: [
        "After his death the music did not disappear. In the 1960s and 1970s a new generation of German Sinti musicians — Schnuckenack Reinhardt, Häns’che Weiss, Titi Winterstein and others — revived and strengthened the style, treating Django’s legacy as part of their own living heritage. The same pattern held in France and the Low Countries: fathers teaching sons, uncles teaching nephews, the repertoire expanding while the core feeling remained.",
        "Today the music still travels the same roads. The jam sessions in Paris, the camps in the Netherlands, the festivals in Germany, the family gatherings that keep the old tunes alive — all sit on a foundation older than any recording. For many Sinti families, Gypsy jazz is not only a style. It is also a way of remembering where they have been and who they are.",
        "In the Netherlands a small association took the old Paris name. Stichting Hot Club de France Nederland was founded in 1983 to keep Django and Grappelli’s style heard when almost nobody was playing it live. Their first concert was the WASO Quartet. Forty years on they still list the jams, print De Quintette, and count about a hundred Hot Club bands in the country. That is the amateur and professional circle around the Rosenberg, Schäfer and Basily families — not a replacement for them.",
      ],
    },
    "Paris besides Django": {
      title: "Paris besides Django",
      body: [
        "Django was not the only guitar in those rooms. The Ferret brothers — Baro, Sarane, and Matelo — came from Rouen to Paris and sat beside him, and sometimes in his place. They played musette, the Russian cabarets, and the Quintette sides. When Django’s records went quiet, that Paris line did not. Matelo lived long enough to put on disc waltzes Django had never recorded. Matelo’s sons Boulou and Elios Ferré kept a later Paris guitar on stage.",
      ],
    },
    "Django’s house": {
      title: "Django’s house",
      body: [
        "The famous name had a house around it. Joseph “Nin-Nin” Reinhardt, the younger brother, held the pompe on the pre-war records. Naguine kept the household in Samois, where Django fished and painted and died. Lousson, the first son, stayed on the road and left few records. Babik, the second, played a more modern jazz and refused to be a copy. They are buried, with Joseph, at Samois. The line still plays.",
      ],
    },
  },
  films: {
    "https://www.youtube.com/watch?v=fBBqsgicUeQ":
      "The only known sound film of Django and Grappelli playing together — Quintette du Hot Club de France, short film Le Jazz Hot.",
    "https://www.youtube.com/watch?v=uTlo809EIlo":
      "The first recording. Django, Grappelli, Joseph Reinhardt — the record every jam still starts from.",
    "https://www.youtube.com/watch?v=PcgI-dNGvIY":
      "Django in occupied Paris. Grappelli was already in London. The ballad that became the anthem.",
    "https://www.youtube.com/watch?v=6JFqD47fKUQ":
      "After the war they found each other again. Rome, January 1949 — Grappelli's violin back over Django's guitar.",
  },
  chapters: {
    "Before 1934": {
      title: "Musette, caravans, and the banjo",
      body: [
        "Gypsy jazz did not begin in a conservatoire. It began in the bals musette of Paris and the caravan sites of northern France and Belgium, among Sinti and Manouche families who already played waltz, csárdás, and dance-band tunes.",
        "Jean Reinhardt — Django — was born in 1910 in Liberchies, Belgium, and grew up on the road. As a teenager he was a banjo-guitarist in musette bands, loud enough to cut through accordion and dancing feet. The guitar that would later define the music was still a rhythm instrument in those rooms.",
      ],
    },
    "1928": {
      title: "The fire",
      body: [
        "On the night of 26 October 1928, a fire destroyed the caravan Django shared with his first wife, Bella. He was eighteen. Burns cost him the use of two fingers on his left hand and nearly cost him the leg.",
        "The recovery took years. He rebuilt a technique around two working fingers on the fretboard — index and middle — and a right hand that still had all its attack. The gaps in the old chord shapes became a new language: octaves, diminished runs, and a singing lead line that no conservatory method would have invented.",
      ],
    },
    "1934": {
      title: "Quintette du Hot Club de France",
      body: [
        "Stéphane Grappelli, a Parisian violinist with a day job in dance orchestras, met Django in the early 1930s. In 1934, with the backing of the Hot Club de France, they recorded as an all-string group: two guitars, violin, and bass. Joseph Reinhardt, Django's brother, often held the rhythm. Roger Chaput or Baro Ferret took the other guitar chair. Louis Vola played bass.",
        "This was the public face of the music. No drums. No brass. A Selmer-Maccaferri guitar with an oval soundhole, a violin that floated, and a pompe — the boom-chick of the rhythm guitar — that made the whole thing dance. Minor Swing, Djangology, Nuages: the records travelled farther than the caravans ever had.",
      ],
    },
    "1939–45": {
      title: "War, Nuages, survival",
      body: [
        "When war broke out, Grappelli was in London and stayed there. Django remained in occupied France. Romani people were hunted. He survived through a mix of luck, patrons, and the strange protection that fame can give.",
        "Nuages, recorded in 1940, became something like an unofficial anthem — a ballad that French radio could play, and that still sits at the centre of the repertoire. In these years Django also touched electric guitar and big-band colours, never abandoning the string quintet that had made his name.",
      ],
    },
    "1946–53": {
      title: "America, return, Samois",
      body: [
        "In 1946 Django toured the United States with Duke Ellington, a meeting of two swing aristocracies that was uneven in the halls and legendary in the telling. He came home. The late records — sometimes electric, always lyrical — show a player still changing.",
        "He died on 16 May 1953, at forty-three, in Fontainebleau. He is buried in Samois-sur-Seine, the river village that later gave the music its summer pilgrimage.",
      ],
    },
  },
  houses: HISTORY_HOUSES.en,
  ...HISTORY_FOOTER.en,
};


function overlay(locale: Partial<HistoryChrome>): HistoryChrome {
  return {
    ...EN,
    ...locale,
    toc: locale.toc ?? EN.toc,
    sections: { ...EN.sections, ...(locale.sections ?? {}) },
    films: { ...EN.films, ...(locale.films ?? {}) },
    chapters: { ...EN.chapters, ...(locale.chapters ?? {}) },
  };
}

const NL = overlay({
  kicker: "Lijn",
  title: "Geschiedenis van gypsy jazz en de Sinti",
  lead: "Gypsy jazz begon niet in een studio of een conservatorium. Het groeide uit een veel oudere traditie die de Sinti door Europa droegen.",
  chaptersNav: "Hoofdstukken",
  expand: "Open",
  collapse: "Dicht",
  expandAll: "Alles open",
  collapseAll: "Alles dicht",
  toc: [
    { id: "story", label: "Verhaal" },
    { id: "houses", label: "Huizen" },
    { id: "photographs", label: "Foto’s" },
    { id: "on-film", label: "Op film" },
    { id: "timeline", label: "Tijdlijn" },
  ],
  storyKicker: "Het lezen",
  storyTitle: "Verhaal",
  fullLife: "Het hele leven:",
  housesKicker: "De families",
  housesTitle: "Huizen",
  photosKicker: "Uit de archieven",
  photosTitle: "Foto’s",
  photosLead:
    "Echte scans — geen gegenereerde beelden. De Aquarium-sessie van William P. Gottlieb uit 1946 is publiek domein (Library of Congress). Latere foto’s staan onder de licentie op elk kader.",
  filmKicker: "Op film, vóór 1960",
  filmTitle: "Django en Grappelli",
  filmLead:
    "Bijna geen camera vond hen. Dit is het oude beeld — de film uit 1939 van de twee samen, de plaat uit 1937, Nuages uit de oorlog, en de hereniging in Rome in 1949. Grappelli leefde lang genoeg om later gefilmd te worden; deze clips blijven vóór 1960.",
  aboutClip: "Over deze clip",
  timelineKicker: "De publieke muziek",
  timelineTitle: "Van de bals musette naar Samois",
  opensRomani: "Opent www.romanimusic.com",
  djangoBody:
    "De centrale figuur. Geboren in een Manouche-familie, hij maakte de stijl die wereldwijd gypsy jazz ging heten.",
  djangoYoutube: "Minor Swing",
  sections: {
    "Music before Django": {
      title: "Muziek vóór Django",
      body: [
        "In de negentiende en vroege twintigste eeuw zaten deze muzikale families stevig in de landen die het hart van gypsy jazz zouden worden. In Duitsland werd Sinti de naam die ze zelf kozen. In Frankrijk woonden de verwante Manouche-families rond Parijs en in het oosten. In Nederland en België hielden kleinere, doorlopende groepen dezelfde traditie van reizen, ambacht en muziek. Het geluid dat later gypsy jazz ging heten, zat er al in kiem: sterke ritme, melodische gevoeligheid, en leren op het gehoor.",
      ],
    },
    "Django and the birth of a style": {
      title: "Django en de geboorte van een stijl",
      body: [
        "In de jaren dertig veranderde één van die muzikanten alles. Jean “Django” Reinhardt, geboren in een Manouche-familie met wortels in België, Frankrijk en de bredere Sinti-wereld, voegde de oude familiestijl samen met de nieuwe Amerikaanse jazz die hij in Parijs hoorde. Met het Quintette du Hot Club de France maakte hij een geluid dat modern was én diep geworteld: de drijvende “la pompe”, de felle eenstemmige lijnen, de diepte van generaties mondelinge traditie. Django vond Sinti-muziek niet uit. Hij droeg haar een nieuwe eeuw in en gaf haar een naam die de wereld herkende.",
      ],
    },
    "The Claridge and the Club": {
      title: "De Claridge en de Club",
      body: [
        "In de zomer van 1934 zaten Django en Grappelli al in de band van Louis Vola in Hôtel Claridge op de Champs-Élysées. Na de betaalde set speelden ze door in een zijzaal. Pierre Nourry en Charles Delaunay, van de Hot Club de France — een luistervereniging rond Hugues Panassié — hoorden het en duwden hen tot een groep. De eerste kanten die winter gingen soms uit als “Delaunay’s Jazz.” De muzikanten maakten de muziek. De Club gaf een deur, en later het label Swing dat de platen droeg.",
      ],
    },
    "After Django — a living tradition": {
      title: "Na Django — een levende traditie",
      body: [
        "Na zijn dood verdween de muziek niet. In de jaren zestig en zeventig blies een nieuwe generatie Duitse Sinti — Schnuckenack Reinhardt, Häns’che Weiss, Titi Winterstein en anderen — de stijl nieuw leven in, en nam Django’s nalatenschap als eigen levend erfgoed. Hetzelfde patroon in Frankrijk en de Lage Landen: vaders leerden zonen, ooms neven, het repertoire groeide terwijl de kern bleef.",
        "Vandaag reist de muziek dezelfde wegen. De jams in Parijs, de kampen in Nederland, de festivals in Duitsland, de familiebijeenkomsten die de oude deuntjes levend houden — alles rust op een fundament ouder dan elke opname. Voor veel Sinti-families is gypsy jazz niet alleen een stijl. Het is ook een manier om te onthouden waar ze zijn geweest en wie ze zijn.",
        "In Nederland nam een kleine vereniging de oude Parijse naam. Stichting Hot Club de France Nederland werd in 1983 opgericht om de stijl van Django en Grappelli te laten horen toen bijna niemand het live speelde. Hun eerste concert was het WASO Quartet. Veertig jaar later zetten ze nog de jams op de lijst, drukken ze De Quintette, en tellen ze ongeveer honderd Hot Club-bands in het land. Dat is de kring van amateurs en professionals rond de families Rosenberg, Schäfer en Basily — geen vervanging van hen.",
      ],
    },
    "Paris besides Django": {
      title: "Parijs naast Django",
      body: [
        "Django was niet de enige gitaar in die zalen. De gebroeders Ferret — Baro, Sarane en Matelo — kwamen van Rouen naar Parijs en zaten naast hem, soms in zijn plaats. Ze speelden musette, de Russische cabarets, en de kanten van het Quintette. Toen Django’s platen stil werden, die Parijse lijn niet. Matelo leefde lang genoeg om walsen op schijf te zetten die Django nooit had opgenomen. Matelo’s zonen Boulou en Elios Ferré hielden later een Parijse gitaar op het podium.",
      ],
    },
    "Django’s house": {
      title: "Django’s huis",
      body: [
        "De beroemde naam had een huis eromheen. Joseph “Nin-Nin” Reinhardt, de jongere broer, hield de pompe op de vooroorlogse platen. Naguine hield het huishouden in Samois, waar Django viste, schilderde en stierf. Lousson, de eerste zoon, bleef op de weg en liet weinig platen na. Babik, de tweede, speelde een moderner jazz en weigerde een kopie te zijn. Ze liggen, met Joseph, in Samois begraven. De lijn speelt nog.",
      ],
    },
  },
  films: {
    "https://www.youtube.com/watch?v=fBBqsgicUeQ":
      "De enige bekende geluidsfilm van Django en Grappelli samen — Quintette du Hot Club de France, korte film Le Jazz Hot.",
    "https://www.youtube.com/watch?v=uTlo809EIlo":
      "De eerste opname. Django, Grappelli, Joseph Reinhardt — de plaat waar elke jam nog mee begint.",
    "https://www.youtube.com/watch?v=PcgI-dNGvIY":
      "Django in bezet Parijs. Grappelli was al in Londen. De ballade die het volkslied werd.",
    "https://www.youtube.com/watch?v=6JFqD47fKUQ":
      "Na de oorlog vonden ze elkaar weer. Rome, januari 1949 — de viool van Grappelli weer over Django’s gitaar.",
  },
  chapters: {
    "Before 1934": {
      title: "Musette, woonwagens en de banjo",
      body: [
        "Gypsy jazz begon niet in een conservatorium. Het begon in de bals musette van Parijs en de woonwagenkampen van Noord-Frankrijk en België, bij Sinti- en Manouche-families die al wals, csárdás en dansorkest speelden.",
        "Jean Reinhardt — Django — werd in 1910 geboren in Liberchies, België, en groeide op onderweg. Als tiener was hij banjo-gitarist in musettebands, luid genoeg om door accordeon en dansvoeten heen te snijden. De gitaar die later de muziek zou bepalen, was in die zalen nog een ritme-instrument.",
      ],
    },
    "1928": {
      title: "De brand",
      body: [
        "In de nacht van 26 oktober 1928 verwoestte een brand de woonwagen die Django deelde met zijn eerste vrouw, Bella. Hij was achttien. Brandwonden namen het gebruik van twee vingers van zijn linkerhand, en bijna het been.",
        "Het herstel duurde jaren. Hij bouwde een techniek rond twee werkende vingers op de toets — wijs- en middelvinger — en een rechterhand die al haar aanslag behield. De gaten in de oude akkoordvormen werden een nieuwe taal: octaven, verminderde lopen, en een zingende leadlijn die geen conservatoriummethode zou hebben uitgevonden.",
      ],
    },
    "1934": {
      title: "Quintette du Hot Club de France",
      body: [
        "Stéphane Grappelli, een Parijse violist met een dagbaan in dansorkesten, ontmoette Django begin jaren dertig. In 1934, met steun van de Hot Club de France, namen ze op als een groep van alleen snaren: twee gitaren, viool en bas. Joseph Reinhardt, Django’s broer, hield vaak het ritme. Roger Chaput of Baro Ferret nam de andere gitaarstoel. Louis Vola speelde bas.",
        "Dit was het publieke gezicht van de muziek. Geen drums. Geen koper. Een Selmer-Maccaferri met ovale klankopening, een viool die zweefde, en een pompe — de boom-chick van de ritmegitaar — die het geheel liet dansen. Minor Swing, Djangology, Nuages: de platen reisden verder dan de woonwagens ooit.",
      ],
    },
    "1939–45": {
      title: "Oorlog, Nuages, overleven",
      body: [
        "Toen de oorlog uitbrak, was Grappelli in Londen en bleef daar. Django bleef in bezet Frankrijk. Romani-mensen werden gejaagd. Hij overleefde door geluk, beschermers, en de vreemde bescherming die bekendheid kan geven.",
        "Nuages, opgenomen in 1940, werd zoiets als een onofficieel volkslied — een ballade die de Franse radio kon spelen, en die nog midden in het repertoire zit. In die jaren raakte Django ook elektrische gitaar en bigband-kleuren, zonder het strijkkwintet los te laten dat zijn naam had gemaakt.",
      ],
    },
    "1946–53": {
      title: "Amerika, terugkeer, Samois",
      body: [
        "In 1946 toerde Django door de Verenigde Staten met Duke Ellington, een ontmoeting van twee swing-aristocratieën die in de zalen ongelijk was en in het vertellen legendarisch. Hij kwam thuis. De late platen — soms elektrisch, altijd lyrisch — laten een speler horen die nog veranderde.",
        "Hij stierf op 16 mei 1953, drieënveertig jaar, in Fontainebleau. Hij ligt begraven in Samois-sur-Seine, het rivierdorp dat de muziek later haar zomerbedevaart gaf.",
      ],
    },
  },
});

const FR = overlay({
  kicker: "Lignée",
  title: "Histoire du gypsy jazz et des Sinti",
  lead: "Le gypsy jazz n’est pas né dans un studio ni un conservatoire. Il vient d’une tradition plus ancienne, portée par les Sinti à travers l’Europe.",
  chaptersNav: "Chapitres",
  expand: "Ouvrir",
  collapse: "Fermer",
  expandAll: "Tout ouvrir",
  collapseAll: "Tout fermer",
  toc: [
    { id: "story", label: "Récit" },
    { id: "houses", label: "Maisons" },
    { id: "photographs", label: "Photographies" },
    { id: "on-film", label: "À l’image" },
    { id: "timeline", label: "Chronologie" },
  ],
  storyKicker: "La lecture",
  storyTitle: "Récit",
  fullLife: "La vie entière :",
  housesKicker: "Les familles",
  housesTitle: "Maisons",
  photosKicker: "Des archives",
  photosTitle: "Photographies",
  photosLead:
    "De vrais scans — pas d’images générées. La séance Aquarium de William P. Gottlieb, 1946, est dans le domaine public (Library of Congress). Les photos plus tardives portent la licence indiquée sur chaque cadre.",
  filmKicker: "À l’image, avant 1960",
  filmTitle: "Django et Grappelli",
  filmLead:
    "Presque aucune caméra ne les a trouvés. Voici les images anciennes — le film de 1939 des deux ensemble, le disque de 1937, Nuages de la guerre, et les retrouvailles à Rome en 1949. Grappelli a vécu assez longtemps pour être filmé plus tard ; ces extraits restent avant 1960.",
  aboutClip: "À propos de cet extrait",
  timelineKicker: "La musique publique",
  timelineTitle: "Des bals musette à Samois",
  opensRomani: "Ouvre www.romanimusic.com",
  djangoBody:
    "La figure centrale. Né dans une famille manouche, il a créé le style que le monde a appelé gypsy jazz.",
  sections: {
    "Music before Django": {
      title: "La musique avant Django",
      body: [
        "Au XIXe et au début du XXe siècle, ces familles musicales étaient déjà enracinées dans les pays qui deviendraient le cœur du gypsy jazz. En Allemagne, Sinti était le nom qu’elles se donnaient. En France, les familles manouches apparentées vivaient autour de Paris et à l’est. Aux Pays-Bas et en Belgique, des groupes plus petits mais continus gardaient les mêmes traditions de voyage, de métier et de musique. Le son qu’on appellerait plus tard gypsy jazz existait déjà en germe : rythme fort, mélodie sensible, apprentissage à l’oreille.",
      ],
    },
    "Django and the birth of a style": {
      title: "Django et la naissance d’un style",
      body: [
        "Dans les années 1930, l’un de ces musiciens a tout changé. Jean « Django » Reinhardt, né dans une famille manouche aux racines belges, françaises et sinté, a fondu le vieux style de famille avec le jazz américain qu’il entendait à Paris. Avec le Quintette du Hot Club de France il a fait un son à la fois moderne et profondément enraciné : la pompe, les lignes en notes isolées, la profondeur de générations de tradition orale. Django n’a pas inventé la musique sinté. Il l’a portée dans un siècle nouveau et lui a donné un nom que le monde a reconnu.",
      ],
    },
    "The Claridge and the Club": {
      title: "Le Claridge et le Club",
      body: [
        "À l’été 1934, Django et Grappelli étaient déjà dans l’orchestre de Louis Vola à l’Hôtel Claridge, sur les Champs-Élysées. Après le set payé, ils continuaient dans une pièce à côté. Pierre Nourry et Charles Delaunay, du Hot Club de France — une société d’auditeurs autour d’Hugues Panassié — l’ont entendu et les ont poussés à devenir un groupe. Les premières faces de cet hiver sont parfois sorties sous « Delaunay’s Jazz ». Les musiciens ont fait la musique. Le Club a donné une porte et, plus tard, le label Swing qui a porté les disques.",
      ],
    },
    "After Django — a living tradition": {
      title: "Après Django — une tradition vivante",
      body: [
        "Après sa mort la musique n’a pas disparu. Dans les années 1960 et 1970, une nouvelle génération de Sinti allemands — Schnuckenack Reinhardt, Häns’che Weiss, Titi Winterstein et d’autres — a relancé le style, tenant l’héritage de Django comme le leur. Le même schéma en France et au Benelux : les pères enseignent aux fils, les oncles aux neveux, le répertoire s’élargit, le cœur reste.",
        "Aujourd’hui la musique reprend les mêmes routes. Les jams à Paris, les camps aux Pays-Bas, les festivals en Allemagne, les réunions de famille qui gardent les vieux airs — tout repose sur un fond plus ancien que n’importe quel disque. Pour beaucoup de familles sinté, le gypsy jazz n’est pas seulement un style. C’est aussi une façon de se souvenir d’où elles viennent et qui elles sont.",
        "Aux Pays-Bas une petite association a pris le vieux nom parisien. Stichting Hot Club de France Nederland a été fondée en 1983 pour faire entendre le style de Django et Grappelli quand presque personne ne le jouait en public. Leur premier concert fut le WASO Quartet. Quarante ans plus tard ils listent encore les jams, impriment De Quintette, et comptent environ cent orchestres Hot Club dans le pays. C’est le cercle amateur et professionnel autour des familles Rosenberg, Schäfer et Basily — pas un remplacement.",
      ],
    },
    "Paris besides Django": {
      title: "Paris à côté de Django",
      body: [
        "Django n’était pas la seule guitare de ces salles. Les frères Ferret — Baro, Sarane et Matelo — sont venus de Rouen à Paris et se sont assis à côté de lui, parfois à sa place. Ils jouaient le musette, les cabarets russes, et les faces du Quintette. Quand les disques de Django se sont tus, cette ligne parisienne non. Matelo a vécu assez longtemps pour graver des valses que Django n’avait jamais enregistrées. Ses fils Boulou et Elios Ferré ont tenu plus tard une guitare parisienne sur scène.",
      ],
    },
    "Django’s house": {
      title: "La maison de Django",
      body: [
        "Le nom célèbre avait une maison autour. Joseph « Nin-Nin » Reinhardt, le frère cadet, tenait la pompe sur les disques d’avant-guerre. Naguine tenait le foyer à Samois, où Django pêchait, peignait et est mort. Lousson, le premier fils, est resté sur la route et a laissé peu de disques. Babik, le second, jouait un jazz plus moderne et refusait d’être une copie. Ils sont enterrés, avec Joseph, à Samois. La lignée joue encore.",
      ],
    },
  },
  films: {
    "https://www.youtube.com/watch?v=fBBqsgicUeQ":
      "Le seul film sonore connu de Django et Grappelli ensemble — Quintette du Hot Club de France, court métrage Le Jazz Hot.",
    "https://www.youtube.com/watch?v=uTlo809EIlo":
      "Le premier enregistrement. Django, Grappelli, Joseph Reinhardt — le disque par lequel chaque jam commence encore.",
    "https://www.youtube.com/watch?v=PcgI-dNGvIY":
      "Django dans Paris occupé. Grappelli était déjà à Londres. La ballade devenue hymne.",
    "https://www.youtube.com/watch?v=6JFqD47fKUQ":
      "Après la guerre ils se sont retrouvés. Rome, janvier 1949 — le violon de Grappelli de nouveau sur la guitare de Django.",
  },
  chapters: {
    "Before 1934": {
      title: "Musette, roulottes et banjo",
      body: [
        "Le gypsy jazz n’est pas né dans un conservatoire. Il est né dans les bals musette de Paris et les terrains de roulottes du nord de la France et de la Belgique, chez des familles sinté et manouches qui jouaient déjà valse, csárdás et airs de dancing.",
        "Jean Reinhardt — Django — naît en 1910 à Liberchies, en Belgique, et grandit sur la route. Adolescent, il est banjo-guitariste dans des orchestres musette, assez fort pour passer à travers l’accordéon et les pieds qui dansent. La guitare qui définira plus tard la musique est encore, dans ces salles, un instrument de rythme.",
      ],
    },
    "1928": {
      title: "L’incendie",
      body: [
        "Dans la nuit du 26 octobre 1928, un incendie détruit la roulotte que Django partage avec Bella, sa première femme. Il a dix-huit ans. Les brûlures lui prennent deux doigts de la main gauche, et presque la jambe.",
        "La convalescence dure des années. Il reconstruit une technique autour de deux doigts — index et majeur — et d’une main droite qui a gardé toute son attaque. Les trous des vieux accords deviennent une langue nouvelle : octaves, gammes diminuées, une ligne chantante qu’aucune méthode de conservatoire n’aurait inventée.",
      ],
    },
    "1934": {
      title: "Quintette du Hot Club de France",
      body: [
        "Stéphane Grappelli, violoniste parisien qui gagne sa vie dans les orchestres de danse, rencontre Django au début des années 1930. En 1934, avec le Hot Club de France, ils enregistrent en formation à cordes : deux guitares, violon et contrebasse. Joseph Reinhardt, le frère de Django, tient souvent le rythme. Roger Chaput ou Baro Ferret prend l’autre chaise. Louis Vola joue de la basse.",
        "C’est le visage public de la musique. Pas de batterie. Pas de cuivres. Une Selmer-Maccaferri à ouïe ovale, un violon qui flotte, et une pompe — le boom-chick de la guitare rythme — qui fait danser le tout. Minor Swing, Djangology, Nuages : les disques ont voyagé plus loin que les roulottes.",
      ],
    },
    "1939–45": {
      title: "Guerre, Nuages, survie",
      body: [
        "Quand la guerre éclate, Grappelli est à Londres et y reste. Django reste en France occupée. Les Romani sont chassés. Il survit par un mélange de chance, de protecteurs, et de la protection étrange que la célébrité peut donner.",
        "Nuages, enregistré en 1940, devient une sorte d’hymne officieux — une ballade que la radio française pouvait passer, et qui est encore au centre du répertoire. Ces années-là Django touche aussi la guitare électrique et les couleurs de big band, sans abandonner le quintette à cordes qui a fait son nom.",
      ],
    },
    "1946–53": {
      title: "Amérique, retour, Samois",
      body: [
        "En 1946 Django tourne aux États-Unis avec Duke Ellington, rencontre de deux aristocraties du swing inégale dans les salles et légendaire dans le récit. Il rentre. Les derniers disques — parfois électriques, toujours lyriques — montrent un joueur qui change encore.",
        "Il meurt le 16 mai 1953, à quarante-trois ans, à Fontainebleau. Il est inhumé à Samois-sur-Seine, le village-rivière qui donnera plus tard à la musique son pèlerinage d’été.",
      ],
    },
  },
});

const DE = overlay({
  kicker: "Linie",
  title: "Geschichte des Gypsy Jazz und der Sinti",
  lead: "Gypsy Jazz begann nicht in einem Studio oder Konservatorium. Er wuchs aus einer älteren Tradition, die die Sinti durch Europa trugen.",
  chaptersNav: "Kapitel",
  expand: "Öffnen",
  collapse: "Schließen",
  expandAll: "Alles öffnen",
  collapseAll: "Alles schließen",
  toc: [
    { id: "story", label: "Geschichte" },
    { id: "houses", label: "Häuser" },
    { id: "photographs", label: "Fotos" },
    { id: "on-film", label: "Auf Film" },
    { id: "timeline", label: "Zeittafel" },
  ],
  storyKicker: "Die Lektüre",
  storyTitle: "Geschichte",
  fullLife: "Das ganze Leben:",
  housesKicker: "Die Familien",
  housesTitle: "Häuser",
  photosKicker: "Aus den Archiven",
  photosTitle: "Fotos",
  photosLead:
    "Echte Scans — keine erzeugten Bilder. William P. Gottliebs Aquarium-Sitzung 1946 ist gemeinfrei (Library of Congress). Spätere Fotos stehen unter der Lizenz auf jedem Rahmen.",
  filmKicker: "Auf Film, vor 1960",
  filmTitle: "Django und Grappelli",
  filmLead:
    "Kaum eine Kamera fand sie. Das ist das alte Material — der Film von 1939 der beiden zusammen, die Platte von 1937, Nuages aus dem Krieg, und das Wiedersehen in Rom 1949. Grappelli lebte lang genug, später gefilmt zu werden; diese Clips bleiben vor 1960.",
  aboutClip: "Zu diesem Clip",
  timelineKicker: "Die öffentliche Musik",
  timelineTitle: "Von den Bals musette nach Samois",
  opensRomani: "Öffnet www.romanimusic.com",
  djangoBody:
    "Die zentrale Figur. Geboren in einer Manouche-Familie, schuf er den Stil, den die Welt Gypsy Jazz nannte.",
  sections: {
    "Music before Django": {
      title: "Musik vor Django",
      body: [
        "Im 19. und frühen 20. Jahrhundert saßen diese musikalischen Familien fest in den Ländern, die das Herzland des Gypsy Jazz werden sollten. In Deutschland wurde Sinti der eigene Name. In Frankreich lebten die verwandten Manouche-Familien um Paris und im Osten. In den Niederlanden und Belgien hielten kleinere, durchgehende Gruppen dieselbe Tradition von Reise, Handwerk und Musik. Der Klang, der später Gypsy Jazz hieß, war schon im Keim da: starker Rhythmus, empfindsame Melodie, Lernen nach Gehör.",
      ],
    },
    "Django and the birth of a style": {
      title: "Django und die Geburt eines Stils",
      body: [
        "In den 1930ern veränderte einer dieser Musiker alles. Jean „Django“ Reinhardt, geboren in eine Manouche-Familie mit Wurzeln in Belgien, Frankreich und der weiteren Sinti-Welt, verband den alten Familienstil mit dem neuen amerikanischen Jazz, den er in Paris hörte. Mit dem Quintette du Hot Club de France schuf er einen Klang, der modern und tief verwurzelt war: die treibende „la pompe“, die feurigen Einzeltonlinien, die Tiefe mündlicher Tradition. Django hat Sinti-Musik nicht erfunden. Er trug sie in ein neues Jahrhundert und gab ihr einen Namen, den die Welt erkannte.",
      ],
    },
    "The Claridge and the Club": {
      title: "Das Claridge und der Club",
      body: [
        "Im Sommer 1934 saßen Django und Grappelli schon in Louis Volas Band im Hôtel Claridge an den Champs-Élysées. Nach dem bezahlten Satz spielten sie in einem Nebenraum weiter. Pierre Nourry und Charles Delaunay vom Hot Club de France — einer Hörergesellschaft um Hugues Panassié — hörten es und drängten sie zu einer Gruppe. Die ersten Seiten jenes Winters gingen manchmal als „Delaunay’s Jazz“ raus. Die Musiker machten die Musik. Der Club gab eine Tür und später das Label Swing, das die Platten trug.",
      ],
    },
    "After Django — a living tradition": {
      title: "Nach Django — eine lebendige Tradition",
      body: [
        "Nach seinem Tod verschwand die Musik nicht. In den 1960ern und 1970ern belebte eine neue Generation deutscher Sinti — Schnuckenack Reinhardt, Häns’che Weiss, Titi Winterstein und andere — den Stil, und nahm Djangos Erbe als eigenes lebendiges Gut. Dasselbe Muster in Frankreich und den Niederlanden: Väter lehren Söhne, Onkel Neffen, das Repertoire wächst, der Kern bleibt.",
        "Heute reist die Musik dieselben Straßen. Die Jams in Paris, die Camps in den Niederlanden, die Festivals in Deutschland, die Familientreffen, die die alten Weisen lebendig halten — alles sitzt auf einem Fundament älter als jede Aufnahme. Für viele Sinti-Familien ist Gypsy Jazz nicht nur ein Stil. Es ist auch eine Art, sich zu erinnern, woher sie kommen und wer sie sind.",
        "In den Niederlanden nahm ein kleiner Verein den alten Pariser Namen. Stichting Hot Club de France Nederland wurde 1983 gegründet, um Djangos und Grappellis Stil zu Gehör zu bringen, als fast niemand ihn live spielte. Ihr erstes Konzert war das WASO Quartet. Vierzig Jahre später listen sie noch die Jams, drucken De Quintette und zählen etwa hundert Hot-Club-Bands im Land. Das ist der Kreis von Amateuren und Profis um die Familien Rosenberg, Schäfer und Basily — kein Ersatz für sie.",
      ],
    },
    "Paris besides Django": {
      title: "Paris neben Django",
      body: [
        "Django war nicht die einzige Gitarre in diesen Räumen. Die Brüder Ferret — Baro, Sarane und Matelo — kamen von Rouen nach Paris und saßen neben ihm, manchmal an seiner Stelle. Sie spielten Musette, die russischen Kabaretts und die Quintette-Seiten. Als Djangos Platten still wurden, diese Pariser Linie nicht. Matelo lebte lang genug, Walzer auf Platte zu bringen, die Django nie aufgenommen hatte. Matelos Söhne Boulou und Elios Ferré hielten später eine Pariser Gitarre auf der Bühne.",
      ],
    },
    "Django’s house": {
      title: "Djangos Haus",
      body: [
        "Der berühmte Name hatte ein Haus um sich. Joseph „Nin-Nin“ Reinhardt, der jüngere Bruder, hielt die Pompe auf den Vorkriegsplatten. Naguine führte den Haushalt in Samois, wo Django angelte, malte und starb. Lousson, der erste Sohn, blieb auf der Straße und hinterließ wenige Platten. Babik, der zweite, spielte einen moderneren Jazz und weigerte sich, eine Kopie zu sein. Sie liegen, mit Joseph, in Samois. Die Linie spielt noch.",
      ],
    },
  },
  films: {
    "https://www.youtube.com/watch?v=fBBqsgicUeQ":
      "Der einzige bekannte Tonfilm von Django und Grappelli zusammen — Quintette du Hot Club de France, Kurzfilm Le Jazz Hot.",
    "https://www.youtube.com/watch?v=uTlo809EIlo":
      "Die erste Aufnahme. Django, Grappelli, Joseph Reinhardt — die Platte, mit der jeder Jam noch beginnt.",
    "https://www.youtube.com/watch?v=PcgI-dNGvIY":
      "Django im besetzten Paris. Grappelli war schon in London. Die Ballade, die zur Hymne wurde.",
    "https://www.youtube.com/watch?v=6JFqD47fKUQ":
      "Nach dem Krieg fanden sie einander wieder. Rom, Januar 1949 — Grappellis Geige wieder über Djangos Gitarre.",
  },
  chapters: {
    "Before 1934": {
      title: "Musette, Wagen und Banjo",
      body: [
        "Gypsy Jazz begann nicht in einem Konservatorium. Er begann in den Bals musette von Paris und auf den Wagenplätzen Nordfrankreichs und Belgiens, bei Sinti- und Manouche-Familien, die schon Walzer, Csárdás und Tanzkapellen spielten.",
        "Jean Reinhardt — Django — wurde 1910 in Liberchies, Belgien, geboren und wuchs unterwegs auf. Als Teenager war er Banjo-Gitarrist in Musettebands, laut genug, durch Akkordeon und tanzende Füße zu schneiden. Die Gitarre, die später die Musik prägen würde, war in diesen Räumen noch ein Rhythmusinstrument.",
      ],
    },
    "1928": {
      title: "Das Feuer",
      body: [
        "In der Nacht zum 26. Oktober 1928 zerstörte ein Feuer den Wagen, den Django mit seiner ersten Frau Bella teilte. Er war achtzehn. Verbrennungen nahmen ihm zwei Finger der linken Hand und beinahe das Bein.",
        "Die Genesung dauerte Jahre. Er baute eine Technik um zwei Finger auf dem Griffbrett — Zeige- und Mittelfinger — und eine rechte Hand, die ihren gesamten Anschlag behielt. Die Lücken der alten Akkordformen wurden eine neue Sprache: Oktaven, verminderte Läufe, eine singende Leadlinie, die keine Konservatoriumsmethode erfunden hätte.",
      ],
    },
    "1934": {
      title: "Quintette du Hot Club de France",
      body: [
        "Stéphane Grappelli, ein Pariser Geiger mit Tagesjob in Tanzorchestern, traf Django Anfang der 1930er. 1934 nahmen sie mit dem Hot Club de France als reine Streichergruppe auf: zwei Gitarren, Geige und Bass. Joseph Reinhardt, Djangos Bruder, hielt oft den Rhythmus. Roger Chaput oder Baro Ferret nahm den anderen Stuhl. Louis Vola spielte Bass.",
        "Das war das öffentliche Gesicht der Musik. Kein Schlagzeug. Kein Blech. Eine Selmer-Maccaferri mit ovalem Schallloch, eine Geige, die schwebte, und eine Pompe — das Boom-Chick der Rhythmusgitarre — die das Ganze tanzen ließ. Minor Swing, Djangology, Nuages: die Platten reisten weiter als die Wagen je.",
      ],
    },
    "1939–45": {
      title: "Krieg, Nuages, Überleben",
      body: [
        "Als der Krieg ausbrach, war Grappelli in London und blieb. Django blieb im besetzten Frankreich. Romani-Menschen wurden gejagt. Er überlebte durch Glück, Gönner und den seltsamen Schutz, den Ruhm geben kann.",
        "Nuages, 1940 aufgenommen, wurde so etwas wie eine inoffizielle Hymne — eine Ballade, die das französische Radio spielen konnte, und die noch in der Mitte des Repertoires sitzt. In diesen Jahren berührte Django auch E-Gitarre und Bigband-Farben, ohne das Streichquintett aufzugeben, das seinen Namen gemacht hatte.",
      ],
    },
    "1946–53": {
      title: "Amerika, Rückkehr, Samois",
      body: [
        "1946 tourte Django mit Duke Ellington durch die Vereinigten Staaten, Begegnung zweier Swing-Aristokratien, ungleich in den Sälen und legendär in der Erzählung. Er kam nach Hause. Die späten Platten — manchmal elektrisch, immer lyrisch — zeigen einen Spieler, der sich noch änderte.",
        "Er starb am 16. Mai 1953, dreiundvierzig Jahre, in Fontainebleau. Er liegt in Samois-sur-Seine, dem Flussdorf, das der Musik später ihre Sommerwallfahrt gab.",
      ],
    },
  },
});

const ES = overlay({
  kicker: "Linaje",
  title: "Historia del gypsy jazz y los Sinti",
  lead: "El gypsy jazz no nació en un estudio ni en un conservatorio. Creció de una tradición más antigua que los Sinti llevaron por Europa.",
  chaptersNav: "Capítulos",
  expand: "Abrir",
  collapse: "Cerrar",
  expandAll: "Abrir todo",
  collapseAll: "Cerrar todo",
  toc: [
    { id: "story", label: "Relato" },
    { id: "houses", label: "Casas" },
    { id: "photographs", label: "Fotografías" },
    { id: "on-film", label: "En cine" },
    { id: "timeline", label: "Cronología" },
  ],
  storyKicker: "La lectura",
  storyTitle: "Relato",
  fullLife: "La vida entera:",
  housesKicker: "Las familias",
  housesTitle: "Casas",
  photosKicker: "De los archivos",
  photosTitle: "Fotografías",
  photosLead:
    "Escaneos reales — no imágenes generadas. La sesión Aquarium de William P. Gottlieb de 1946 es dominio público (Library of Congress). Las fotos posteriores llevan la licencia de cada marco.",
  filmKicker: "En cine, antes de 1960",
  filmTitle: "Django y Grappelli",
  filmLead:
    "Casi ninguna cámara los encontró. Esto es el material viejo — la película de 1939 de los dos juntos, el disco de 1937, Nuages de la guerra, y el reencuentro en Roma en 1949. Grappelli vivió lo bastante para ser filmado después; estos clips se quedan antes de 1960.",
  aboutClip: "Sobre este clip",
  timelineKicker: "La música pública",
  timelineTitle: "De los bals musette a Samois",
  opensRomani: "Abre www.romanimusic.com",
  djangoBody:
    "La figura central. Nacido en una familia manouche, creó el estilo que el mundo llamó gypsy jazz.",
  sections: {
    "Music before Django": {
      title: "Música antes de Django",
      body: [
        "En el siglo XIX y principios del XX estas familias musicales ya estaban arraigadas en los países que serían el corazón del gypsy jazz. En Alemania, Sinti era el nombre que se daban. En Francia, las familias manouches emparentadas vivían alrededor de París y en el este. En los Países Bajos y Bélgica, grupos más pequeños pero continuos mantenían las mismas tradiciones de viaje, oficio y música. El sonido que más tarde se llamaría gypsy jazz ya existía en germen: ritmo fuerte, melodía sensible, aprendizaje de oído.",
      ],
    },
    "Django and the birth of a style": {
      title: "Django y el nacimiento de un estilo",
      body: [
        "En los años treinta uno de esos músicos lo cambió todo. Jean “Django” Reinhardt, nacido en una familia manouche con raíces en Bélgica, Francia y el mundo Sinti, fundió el viejo estilo de familia con el jazz americano que oía en París. Con el Quintette du Hot Club de France hizo un sonido moderno y profundamente arraigado: la pompe, las líneas de nota suelta, la profundidad de generaciones de tradición oral. Django no inventó la música Sinti. La llevó a un siglo nuevo y le dio un nombre que el mundo reconoció.",
      ],
    },
    "The Claridge and the Club": {
      title: "El Claridge y el Club",
      body: [
        "En el verano de 1934 Django y Grappelli ya estaban en la banda de Louis Vola en el Hôtel Claridge, en los Campos Elíseos. Tras el set pagado seguían tocando en una sala lateral. Pierre Nourry y Charles Delaunay, del Hot Club de France — una sociedad de oyentes alrededor de Hugues Panassié — lo oyeron y los empujaron a ser un grupo. Las primeras caras de aquel invierno salieron a veces como “Delaunay’s Jazz”. Los músicos hicieron la música. El Club dio una puerta y, más tarde, el sello Swing que llevó los discos.",
      ],
    },
    "After Django — a living tradition": {
      title: "Después de Django — una tradición viva",
      body: [
        "Tras su muerte la música no desapareció. En los sesenta y setenta una nueva generación de Sinti alemanes — Schnuckenack Reinhardt, Häns’che Weiss, Titi Winterstein y otros — reavivó el estilo, tomando el legado de Django como patrimonio vivo propio. El mismo patrón en Francia y los Países Bajos: padres enseñan a hijos, tíos a sobrinos, el repertorio crece, el núcleo queda.",
        "Hoy la música recorre los mismos caminos. Las jams en París, los campamentos en los Países Bajos, los festivales en Alemania, las reuniones de familia que mantienen vivos los viejos temas — todo se apoya en un cimiento más antiguo que cualquier grabación. Para muchas familias Sinti el gypsy jazz no es solo un estilo. Es también un modo de recordar de dónde vienen y quiénes son.",
        "En los Países Bajos una pequeña asociación tomó el viejo nombre parisino. Stichting Hot Club de France Nederland se fundó en 1983 para hacer oír el estilo de Django y Grappelli cuando casi nadie lo tocaba en vivo. Su primer concierto fue el WASO Quartet. Cuarenta años después siguen listando las jams, imprimen De Quintette y cuentan unas cien bandas Hot Club en el país. Ese es el círculo amateur y profesional alrededor de las familias Rosenberg, Schäfer y Basily — no un recambio.",
      ],
    },
    "Paris besides Django": {
      title: "París junto a Django",
      body: [
        "Django no era la única guitarra de aquellas salas. Los hermanos Ferret — Baro, Sarane y Matelo — vinieron de Ruan a París y se sentaron a su lado, a veces en su lugar. Tocaban musette, los cabarets rusos y las caras del Quintette. Cuando los discos de Django se callaron, esa línea parisina no. Matelo vivió lo bastante para grabar valses que Django nunca había registrado. Sus hijos Boulou y Elios Ferré mantuvieron después una guitarra parisina en el escenario.",
      ],
    },
    "Django’s house": {
      title: "La casa de Django",
      body: [
        "El nombre famoso tenía una casa alrededor. Joseph “Nin-Nin” Reinhardt, el hermano menor, sostenía la pompe en los discos de preguerra. Naguine llevaba la casa en Samois, donde Django pescaba, pintaba y murió. Lousson, el primer hijo, se quedó en la carretera y dejó pocos discos. Babik, el segundo, tocaba un jazz más moderno y se negó a ser una copia. Están enterrados, con Joseph, en Samois. La línea sigue tocando.",
      ],
    },
  },
  films: {
    "https://www.youtube.com/watch?v=fBBqsgicUeQ":
      "La única película sonora conocida de Django y Grappelli juntos — Quintette du Hot Club de France, cortometraje Le Jazz Hot.",
    "https://www.youtube.com/watch?v=uTlo809EIlo":
      "La primera grabación. Django, Grappelli, Joseph Reinhardt — el disco con el que cada jam sigue empezando.",
    "https://www.youtube.com/watch?v=PcgI-dNGvIY":
      "Django en el París ocupado. Grappelli ya estaba en Londres. La balada que se hizo himno.",
    "https://www.youtube.com/watch?v=6JFqD47fKUQ":
      "Después de la guerra se reencontraron. Roma, enero de 1949 — el violín de Grappelli otra vez sobre la guitarra de Django.",
  },
  chapters: {
    "Before 1934": {
      title: "Musette, caravanas y el banjo",
      body: [
        "El gypsy jazz no nació en un conservatorio. Nació en los bals musette de París y en los campamentos de caravanas del norte de Francia y Bélgica, entre familias Sinti y manouches que ya tocaban vals, csárdás y temas de orquesta de baile.",
        "Jean Reinhardt — Django — nació en 1910 en Liberchies, Bélgica, y creció en la carretera. De adolescente era banjo-guitarrista en bandas de musette, lo bastante fuerte para cortar acordeón y pies que bailan. La guitarra que más tarde definiría la música era aún, en aquellas salas, un instrumento de ritmo.",
      ],
    },
    "1928": {
      title: "El fuego",
      body: [
        "En la noche del 26 de octubre de 1928 un incendio destruyó la caravana que Django compartía con Bella, su primera mujer. Tenía dieciocho años. Las quemaduras le quitaron dos dedos de la mano izquierda y casi la pierna.",
        "La recuperación duró años. Reconstruyó una técnica alrededor de dos dedos en el diapasón — índice y corazón — y una mano derecha que conservaba todo su ataque. Los huecos de los acordes viejos se volvieron un lenguaje nuevo: octavas, escalas disminuidas, una línea cantada que ningún método de conservatorio habría inventado.",
      ],
    },
    "1934": {
      title: "Quintette du Hot Club de France",
      body: [
        "Stéphane Grappelli, violinista parisino con un trabajo diurno en orquestas de baile, conoció a Django a principios de los treinta. En 1934, con el Hot Club de France, grabaron como grupo de cuerdas: dos guitarras, violín y contrabajo. Joseph Reinhardt, hermano de Django, sostenía a menudo el ritmo. Roger Chaput o Baro Ferret tomaba la otra silla. Louis Vola tocaba el bajo.",
        "Esa era la cara pública de la música. Sin batería. Sin metales. Una Selmer-Maccaferri de boca oval, un violín que flotaba, y una pompe — el boom-chick de la guitarra rítmica — que hacía bailar el conjunto. Minor Swing, Djangology, Nuages: los discos viajaron más lejos que las caravanas.",
      ],
    },
    "1939–45": {
      title: "Guerra, Nuages, supervivencia",
      body: [
        "Cuando estalló la guerra, Grappelli estaba en Londres y se quedó. Django permaneció en la Francia ocupada. Se cazaba a los romaníes. Sobrevivió por suerte, protectores y la extraña protección que puede dar la fama.",
        "Nuages, grabada en 1940, se volvió algo así como un himno oficioso — una balada que la radio francesa podía poner, y que sigue en el centro del repertorio. En esos años Django tocó también la guitarra eléctrica y colores de big band, sin abandonar el quinteto de cuerdas que había hecho su nombre.",
      ],
    },
    "1946–53": {
      title: "América, vuelta, Samois",
      body: [
        "En 1946 Django recorrió Estados Unidos con Duke Ellington, encuentro de dos aristocracias del swing desigual en las salas y legendario en el relato. Volvió a casa. Los discos tardíos — a veces eléctricos, siempre líricos — muestran a un músico que aún cambiaba.",
        "Murió el 16 de mayo de 1953, a los cuarenta y tres, en Fontainebleau. Está enterrado en Samois-sur-Seine, el pueblo del río que más tarde dio a la música su peregrinación de verano.",
      ],
    },
  },
});

const COPIES: Record<string, HistoryChrome> = {
  en: EN,
  nl: NL,
  fr: FR,
  de: DE,
  es: ES,
  pt: overlay({
    kicker: "Linha",
    title: "História do gypsy jazz e dos Sinti",
    lead: "O gypsy jazz não nasceu num estúdio nem num conservatório. Cresceu de uma tradição mais antiga que os Sinti levaram pela Europa.",
    chaptersNav: "Capítulos",
    expand: "Abrir",
    collapse: "Fechar",
    expandAll: "Abrir tudo",
    collapseAll: "Fechar tudo",
    toc: [
      { id: "story", label: "História" },
      { id: "houses", label: "Casas" },
      { id: "photographs", label: "Fotografias" },
      { id: "on-film", label: "Em filme" },
      { id: "timeline", label: "Cronologia" },
    ],
    storyKicker: "A leitura",
    storyTitle: "História",
    fullLife: "A vida inteira:",
    housesKicker: "As famílias",
    housesTitle: "Casas",
    photosKicker: "Dos arquivos",
    photosTitle: "Fotografias",
    filmKicker: "Em filme, antes de 1960",
    filmTitle: "Django e Grappelli",
    aboutClip: "Sobre este clip",
    timelineKicker: "A música pública",
    timelineTitle: "Dos bals musette a Samois",
    opensRomani: "Abre www.romanimusic.com",
    djangoBody: "A figura central. Nascido numa família manouche, criou o estilo que o mundo chamou gypsy jazz.",
    sections: {
      "Django and the birth of a style": {
        title: "Django e o nascimento de um estilo",
        body: [
          "Nos anos 1930 um desses músicos mudou tudo. Jean “Django” Reinhardt, nascido numa família manouche com raízes na Bélgica, França e no mundo Sinti, fundiu o velho estilo de família com o jazz americano que ouvia em Paris. Com o Quintette du Hot Club de France fez um som moderno e profundamente enraizado. Django não inventou a música Sinti. Levou-a a um século novo e deu-lhe um nome que o mundo reconheceu.",
        ],
      },
    },
  }),
  it: overlay({
    kicker: "Lignaggio",
    title: "Storia del gypsy jazz e dei Sinti",
    lead: "Il gypsy jazz non è nato in uno studio né in un conservatorio. È cresciuto da una tradizione più antica portata dai Sinti attraverso l’Europa.",
    chaptersNav: "Capitoli",
    expand: "Apri",
    collapse: "Chiudi",
    expandAll: "Apri tutto",
    collapseAll: "Chiudi tutto",
    toc: [
      { id: "story", label: "Racconto" },
      { id: "houses", label: "Case" },
      { id: "photographs", label: "Fotografie" },
      { id: "on-film", label: "In pellicola" },
      { id: "timeline", label: "Cronologia" },
    ],
    storyTitle: "Racconto",
    fullLife: "La vita intera:",
    housesTitle: "Case",
    photosTitle: "Fotografie",
    filmTitle: "Django e Grappelli",
    aboutClip: "Su questo clip",
    timelineTitle: "Dai bals musette a Samois",
    opensRomani: "Apre www.romanimusic.com",
    djangoBody: "La figura centrale. Nato in una famiglia manouche, ha creato lo stile che il mondo ha chiamato gypsy jazz.",
    sections: {
      "Django and the birth of a style": {
        title: "Django e la nascita di uno stile",
        body: [
          "Negli anni Trenta uno di quei musicisti cambiò tutto. Jean “Django” Reinhardt, nato in una famiglia manouche con radici in Belgio, Francia e nel mondo Sinti, fuse il vecchio stile di famiglia con il jazz americano che sentiva a Parigi. Con il Quintette du Hot Club de France fece un suono moderno e profondamente radicato. Django non ha inventato la musica Sinti. L’ha portata in un secolo nuovo e le ha dato un nome che il mondo ha riconosciuto.",
        ],
      },
    },
  }),
  hu: overlay({
    kicker: "Vonal",
    title: "A gypsy jazz és a Sinti története",
    lead: "A gypsy jazz nem stúdióban és nem konzervatóriumban született. Egy sokkal régebbi hagyományból nőtt, amelyet a Sinti vitt végig Európán.",
    chaptersNav: "Fejezetek",
    expand: "Nyit",
    collapse: "Zár",
    expandAll: "Mindet kinyit",
    collapseAll: "Mindet bezár",
    toc: [
      { id: "story", label: "Történet" },
      { id: "houses", label: "Házak" },
      { id: "photographs", label: "Fényképek" },
      { id: "on-film", label: "Filmen" },
      { id: "timeline", label: "Időrend" },
    ],
    storyTitle: "Történet",
    fullLife: "Az egész élet:",
    housesTitle: "Házak",
    photosTitle: "Fényképek",
    filmTitle: "Django és Grappelli",
    aboutClip: "Erről a klipről",
    timelineTitle: "A bals musette-től Samois-ig",
    opensRomani: "Megnyitja: www.romanimusic.com",
    djangoBody: "A központi alak. Manouche családban született, megteremtette a stílust, amelyet a világ gypsy jazznek hív.",
    sections: {
      "Django and the birth of a style": {
        title: "Django és egy stílus születése",
        body: [
          "Az 1930-as években ezek közül a zenészek közül egy mindent megváltoztatott. Jean „Django” Reinhardt, manouche családban született belga, francia és tágabb Sinti gyökerekkel, összeolvasztotta a régi családi stílust a párizsi amerikai jazz-dzsel. A Quintette du Hot Club de France-szal modern és mélyen gyökerező hangot hozott. Django nem találta fel a Sinti zenét. Egy új századba vitte, és nevet adott neki, amelyet a világ felismert.",
        ],
      },
    },
  }),
  pl: overlay({
    kicker: "Linia",
    title: "Historia gypsy jazzu i Sinti",
    lead: "Gypsy jazz nie zaczął się w studiu ani w konserwatorium. Wyrósł ze starszej tradycji, którą Sinti nieśli przez Europę.",
    chaptersNav: "Rozdziały",
    expand: "Otwórz",
    collapse: "Zamknij",
    expandAll: "Otwórz wszystko",
    collapseAll: "Zamknij wszystko",
    toc: [
      { id: "story", label: "Opowieść" },
      { id: "houses", label: "Domy" },
      { id: "photographs", label: "Zdjęcia" },
      { id: "on-film", label: "Na filmie" },
      { id: "timeline", label: "Oś czasu" },
    ],
    storyTitle: "Opowieść",
    fullLife: "Całe życie:",
    housesTitle: "Domy",
    photosTitle: "Zdjęcia",
    filmTitle: "Django i Grappelli",
    aboutClip: "O tym klipie",
    timelineTitle: "Od bals musette do Samois",
    opensRomani: "Otwiera www.romanimusic.com",
    djangoBody: "Postać centralna. Urodzony w rodzinie manouche, stworzył styl, który świat nazwał gypsy jazzem.",
    sections: {
      "Django and the birth of a style": {
        title: "Django i narodziny stylu",
        body: [
          "W latach 30. jeden z tych muzyków zmienił wszystko. Jean „Django” Reinhardt, urodzony w rodzinie manouche z korzeniami w Belgii, Francji i świecie Sinti, złączył stary styl rodzinny z amerykańskim jazzem, który słyszał w Paryżu. Z Quintette du Hot Club de France stworzył dźwięk nowoczesny i głęboko zakorzeniony. Django nie wymyślił muzyki Sinti. Wniósł ją w nowy wiek i dał jej imię, które świat rozpoznał.",
        ],
      },
    },
  }),
  cs: overlay({
    kicker: "Linie",
    title: "Dějiny gypsy jazzu a Sintů",
    lead: "Gypsy jazz nezačal ve studiu ani na konzervatoři. Vyrostl ze starší tradice, kterou Sinti nesli Evropou.",
    chaptersNav: "Kapitoly",
    expand: "Otevřít",
    collapse: "Zavřít",
    expandAll: "Otevřít vše",
    collapseAll: "Zavřít vše",
    toc: [
      { id: "story", label: "Příběh" },
      { id: "houses", label: "Domy" },
      { id: "photographs", label: "Fotografie" },
      { id: "on-film", label: "Na filmu" },
      { id: "timeline", label: "Časová osa" },
    ],
    storyTitle: "Příběh",
    fullLife: "Celý život:",
    housesTitle: "Domy",
    photosTitle: "Fotografie",
    filmTitle: "Django a Grappelli",
    aboutClip: "O tomto klipu",
    timelineTitle: "Od bals musette k Samois",
    opensRomani: "Otevře www.romanimusic.com",
    djangoBody: "Ústřední postava. Narodil se v manouche rodině a vytvořil styl, kterému svět říká gypsy jazz.",
    sections: {
      "Django and the birth of a style": {
        title: "Django a zrod stylu",
        body: [
          "Ve třicátých letech jeden z těch hudebníků změnil všechno. Jean „Django“ Reinhardt, narozený v manouche rodině s kořeny v Belgii, Francii a širším světě Sintů, spojil starý rodinný styl s americkým jazzem, který slýchal v Paříži. S Quintette du Hot Club de France vytvořil zvuk moderní a hluboce zakořeněný. Django nevynalezl hudbu Sintů. Vnesl ji do nového století a dal jí jméno, které svět poznal.",
        ],
      },
    },
  }),
  ro: overlay({
    kicker: "Linie",
    title: "Istoria gypsy jazz-ului și a Sinti",
    lead: "Gypsy jazz nu a început într-un studio sau un conservator. A crescut dintr-o tradiție mai veche pe care Sinti au purtat-o prin Europa.",
    chaptersNav: "Capitole",
    expand: "Deschide",
    collapse: "Închide",
    expandAll: "Deschide tot",
    collapseAll: "Închide tot",
    toc: [
      { id: "story", label: "Poveste" },
      { id: "houses", label: "Case" },
      { id: "photographs", label: "Fotografii" },
      { id: "on-film", label: "Pe film" },
      { id: "timeline", label: "Cronologie" },
    ],
    storyTitle: "Poveste",
    fullLife: "Viața întreagă:",
    housesTitle: "Case",
    photosTitle: "Fotografii",
    filmTitle: "Django și Grappelli",
    aboutClip: "Despre acest clip",
    timelineTitle: "De la bals musette la Samois",
    opensRomani: "Deschide www.romanimusic.com",
    djangoBody: "Figura centrală. Născut într-o familie manouche, a creat stilul pe care lumea l-a numit gypsy jazz.",
    sections: {
      "Django and the birth of a style": {
        title: "Django și nașterea unui stil",
        body: [
          "În anii 1930 unul dintre acești muzicieni a schimbat totul. Jean „Django” Reinhardt, născut într-o familie manouche cu rădăcini în Belgia, Franța și lumea Sinti, a unit vechiul stil de familie cu jazzul american pe care îl auzea la Paris. Cu Quintette du Hot Club de France a făcut un sunet modern și adânc înrădăcinat. Django nu a inventat muzica Sinti. A dus-o într-un secol nou și i-a dat un nume pe care lumea l-a recunoscut.",
        ],
      },
    },
  }),
  sr: overlay({
    kicker: "Linija",
    title: "Istorija gypsy džeza i Sintija",
    lead: "Gypsy džez nije počeo u studiju ni na konzervatorijumu. Izrastao je iz starije tradicije koju su Sinti nosili kroz Evropu.",
    chaptersNav: "Poglavlja",
    expand: "Otvori",
    collapse: "Zatvori",
    expandAll: "Otvori sve",
    collapseAll: "Zatvori sve",
    toc: [
      { id: "story", label: "Priča" },
      { id: "houses", label: "Kuće" },
      { id: "photographs", label: "Fotografije" },
      { id: "on-film", label: "Na filmu" },
      { id: "timeline", label: "Vremenska linija" },
    ],
    storyTitle: "Priča",
    fullLife: "Ceo život:",
    housesTitle: "Kuće",
    photosTitle: "Fotografije",
    filmTitle: "Django i Grappelli",
    aboutClip: "O ovom klipu",
    timelineTitle: "Od bals musette do Samoisa",
    opensRomani: "Otvara www.romanimusic.com",
    djangoBody: "Središnja figura. Rođen u manouche porodici, stvorio je stil koji je svet nazvao gypsy džezom.",
    sections: {
      "Django and the birth of a style": {
        title: "Django i rođenje stila",
        body: [
          "Tridesetih je jedan od tih muzičara promenio sve. Jean „Django” Reinhardt, rođen u manouche porodici sa korenima u Belgiji, Francuskoj i širem Sinti svetu, spojio je stari porodični stil sa američkim džezom koji je čuo u Parizu. Sa Quintette du Hot Club de France napravio je zvuk moderan i duboko ukorenjen. Django nije izmislio Sinti muziku. Uneo ju je u novi vek i dao joj ime koje je svet prepoznao.",
        ],
      },
    },
  }),
  hr: overlay({
    kicker: "Linija",
    title: "Povijest gypsy jazza i Sintija",
    lead: "Gypsy jazz nije počeo u studiju ni na konzervatoriju. Izrastao je iz starije tradicije koju su Sinti nosili Europom.",
    chaptersNav: "Poglavlja",
    expand: "Otvori",
    collapse: "Zatvori",
    expandAll: "Otvori sve",
    collapseAll: "Zatvori sve",
    toc: [
      { id: "story", label: "Priča" },
      { id: "houses", label: "Kuće" },
      { id: "photographs", label: "Fotografije" },
      { id: "on-film", label: "Na filmu" },
      { id: "timeline", label: "Vremenska crta" },
    ],
    storyTitle: "Priča",
    fullLife: "Cijeli život:",
    housesTitle: "Kuće",
    photosTitle: "Fotografije",
    filmTitle: "Django i Grappelli",
    aboutClip: "O ovom klipu",
    timelineTitle: "Od bals musette do Samoisa",
    opensRomani: "Otvara www.romanimusic.com",
    djangoBody: "Središnja figura. Rođen u manouche obitelji, stvorio je stil koji je svijet nazvao gypsy jazzom.",
    sections: {
      "Django and the birth of a style": {
        title: "Django i rođenje stila",
        body: [
          "Tridesetih je jedan od tih glazbenika promijenio sve. Jean „Django” Reinhardt, rođen u manouche obitelji s korijenima u Belgiji, Francuskoj i širem Sinti svijetu, spojio je stari obiteljski stil s američkim jazzom koji je čuo u Parizu. S Quintette du Hot Club de France napravio je zvuk moderan i duboko ukorijenjen. Django nije izmislio Sinti glazbu. Unio ju je u novo stoljeće i dao joj ime koje je svijet prepoznao.",
        ],
      },
    },
  }),
  ru: overlay({
    kicker: "Линия",
    title: "История gypsy jazz и синти",
    lead: "Gypsy jazz не начался в студии и не в консерватории. Он вырос из более старой традиции, которую синти несли по Европе.",
    chaptersNav: "Главы",
    expand: "Открыть",
    collapse: "Закрыть",
    expandAll: "Открыть всё",
    collapseAll: "Закрыть всё",
    toc: [
      { id: "story", label: "Рассказ" },
      { id: "houses", label: "Дома" },
      { id: "photographs", label: "Фотографии" },
      { id: "on-film", label: "На плёнке" },
      { id: "timeline", label: "Хроника" },
    ],
    storyTitle: "Рассказ",
    fullLife: "Вся жизнь:",
    housesTitle: "Дома",
    photosTitle: "Фотографии",
    filmTitle: "Джанго и Граппелли",
    aboutClip: "Об этом клипе",
    timelineTitle: "От bals musette к Самуа",
    opensRomani: "Открывает www.romanimusic.com",
    djangoBody: "Центральная фигура. Родился в семье мануш и создал стиль, который мир назвал gypsy jazz.",
    sections: {
      "Django and the birth of a style": {
        title: "Джанго и рождение стиля",
        body: [
          "В 1930-е один из этих музыкантов изменил всё. Жан «Джанго» Рейнхардт, родившийся в семье мануш с корнями в Бельгии, Франции и мире синти, соединил старый семейный стиль с американским джазом, который слышал в Париже. С Quintette du Hot Club de France он сделал звук современный и глубоко укоренённый. Джанго не изобрёл музыку синти. Он унёс её в новый век и дал имя, которое мир узнал.",
        ],
      },
    },
  }),
  ja: overlay({
    kicker: "系譜",
    title: "ジプシージャズとシンティの歴史",
    lead: "ジプシージャズはスタジオでも音楽院でも始まらなかった。シンティがヨーロッパを運んだ、もっと古い伝統から育った。",
    chaptersNav: "章",
    expand: "開く",
    collapse: "閉じる",
    expandAll: "すべて開く",
    collapseAll: "すべて閉じる",
    toc: [
      { id: "story", label: "物語" },
      { id: "houses", label: "家" },
      { id: "photographs", label: "写真" },
      { id: "on-film", label: "映像" },
      { id: "timeline", label: "年表" },
    ],
    storyTitle: "物語",
    fullLife: "生涯：",
    housesTitle: "家",
    photosTitle: "写真",
    filmTitle: "ジャンゴとグラッペリ",
    aboutClip: "このクリップについて",
    timelineTitle: "バル・ミュゼットからサモアへ",
    opensRomani: "www.romanimusic.com を開く",
    djangoBody: "中心の人物。マヌーシュの家に生まれ、世界がジプシージャズと呼ぶスタイルをつくった。",
    sections: {
      "Django and the birth of a style": {
        title: "ジャンゴとスタイルの誕生",
        body: [
          "1930年代、その音楽家の一人がすべてを変えた。ジャン「ジャンゴ」ラインハルトは、ベルギー・フランス・広いシンティ世界につながるマヌーシュの家に生まれ、古い家族の流儀とパリで聴いた新しいアメリカのジャズを一つにした。カンテット・デュ・ホット・クラブ・ド・フランスで、現代的であり深く根づいた音をつくった。ジャンゴはシンティの音楽を発明しなかった。新しい世紀へ運び、世界が認める名を与えた。",
        ],
      },
    },
  }),
  ko: overlay({
    kicker: "계보",
    title: "집시 재즈와 신티의 역사",
    lead: "집시 재즈는 스튜디오나 음악원에서 시작하지 않았다. 신티가 유럽을 건너 나른 더 오래된 전통에서 자랐다.",
    chaptersNav: "장",
    expand: "열기",
    collapse: "닫기",
    expandAll: "모두 열기",
    collapseAll: "모두 닫기",
    toc: [
      { id: "story", label: "이야기" },
      { id: "houses", label: "집" },
      { id: "photographs", label: "사진" },
      { id: "on-film", label: "영상" },
      { id: "timeline", label: "연표" },
    ],
    storyTitle: "이야기",
    fullLife: "생애:",
    housesTitle: "집",
    photosTitle: "사진",
    filmTitle: "장고와 그라펠리",
    aboutClip: "이 클립에 대해",
    timelineTitle: "발 뮤제트에서 사모아까지",
    opensRomani: "www.romanimusic.com 열기",
    djangoBody: "중심 인물. 마누슈 집안에서 태어나 세계가 집시 재즈라 부르는 스타일을 만들었다.",
    sections: {
      "Django and the birth of a style": {
        title: "장고와 스타일의 탄생",
        body: [
          "1930년대, 그 음악가 중 한 사람이 모든 것을 바꿨다. 장 “장고” 라인하르트는 벨기에·프랑스·더 넓은 신티 세계와 이어진 마누슈 집안에서 태어나, 옛 가족 스타일과 파리에서 들은 새 미국 재즈를 한데 섞었다. 캥테트 뒤 오 클럽 드 프랑스로 현대적이면서 깊게 뿌리내린 소리를 만들었다. 장고는 신티 음악을 발명하지 않았다. 새 세기로 가져가고, 세계가 알아보는 이름을 주었다.",
        ],
      },
    },
  }),
  zh: overlay({
    kicker: "谱系",
    title: "吉普赛爵士与辛提人的历史",
    lead: "吉普赛爵士不是从录音棚或音乐学院开始的。它从辛提人带过欧洲的更老传统里长出来。",
    chaptersNav: "章节",
    expand: "展开",
    collapse: "收起",
    expandAll: "全部展开",
    collapseAll: "全部收起",
    toc: [
      { id: "story", label: "故事" },
      { id: "houses", label: "家族" },
      { id: "photographs", label: "照片" },
      { id: "on-film", label: "影像" },
      { id: "timeline", label: "年表" },
    ],
    storyTitle: "故事",
    fullLife: "完整生平：",
    housesTitle: "家族",
    photosTitle: "照片",
    filmTitle: "姜戈与格拉佩利",
    aboutClip: "关于这段影像",
    timelineTitle: "从 bals musette 到萨穆瓦",
    opensRomani: "打开 www.romanimusic.com",
    djangoBody: "中心人物。生于马努什家庭，创造了世界称为吉普赛爵士的风格。",
    sections: {
      "Django and the birth of a style": {
        title: "姜戈与一种风格的诞生",
        body: [
          "1930年代，这些乐手里有一个人改变了一切。让·“姜戈”·莱因哈特生于马努什家庭，根连比利时、法国和更广的辛提世界，把旧的家族风格与他在巴黎听到的新美国爵士熔在一起。与法国热俱乐部五重奏，他做出既现代又深深扎根的声音。姜戈没有发明辛提音乐。他把它带进新的世纪，给了它世界认得的名字。",
        ],
      },
    },
  }),
  "zh-tw": overlay({
    kicker: "譜系",
    title: "吉普賽爵士與辛提人的歷史",
    lead: "吉普賽爵士不是從錄音室或音樂院開始的。它從辛提人帶過歐洲的更老傳統裡長出來。",
    chaptersNav: "章節",
    expand: "展開",
    collapse: "收合",
    expandAll: "全部展開",
    collapseAll: "全部收合",
    toc: [
      { id: "story", label: "故事" },
      { id: "houses", label: "家族" },
      { id: "photographs", label: "照片" },
      { id: "on-film", label: "影像" },
      { id: "timeline", label: "年表" },
    ],
    storyTitle: "故事",
    fullLife: "完整生平：",
    housesTitle: "家族",
    photosTitle: "照片",
    filmTitle: "姜戈與格拉佩利",
    aboutClip: "關於這段影像",
    timelineTitle: "從 bals musette 到薩穆瓦",
    opensRomani: "開啟 www.romanimusic.com",
    djangoBody: "中心人物。生於馬努什家庭，創造了世界稱為吉普賽爵士的風格。",
    sections: {
      "Django and the birth of a style": {
        title: "姜戈與一種風格的誕生",
        body: [
          "1930年代，這些樂手裡有一個人改變了一切。尚·「姜戈」·萊因哈特生於馬努什家庭，根連比利時、法國與更廣的辛提世界，把舊的家族風格與他在巴黎聽到的新美國爵士熔在一起。與法國熱俱樂部五重奏，他做出既現代又深深扎根的聲音。姜戈沒有發明辛提音樂。他把它帶進新的世紀，給了它世界認得的名字。",
        ],
      },
    },
  }),
  id: overlay({
    kicker: "Garis",
    title: "Sejarah gypsy jazz dan Sinti",
    lead: "Gypsy jazz tidak mulai di studio atau konservatorium. Ia tumbuh dari tradisi lebih tua yang dibawa Sinti menyeberangi Eropa.",
    chaptersNav: "Bab",
    expand: "Buka",
    collapse: "Tutup",
    expandAll: "Buka semua",
    collapseAll: "Tutup semua",
    toc: [
      { id: "story", label: "Cerita" },
      { id: "houses", label: "Rumah" },
      { id: "photographs", label: "Foto" },
      { id: "on-film", label: "Di film" },
      { id: "timeline", label: "Linimasa" },
    ],
    storyTitle: "Cerita",
    fullLife: "Seluruh hidup:",
    housesTitle: "Rumah",
    photosTitle: "Foto",
    filmTitle: "Django dan Grappelli",
    aboutClip: "Tentang klip ini",
    timelineTitle: "Dari bals musette ke Samois",
    opensRomani: "Membuka www.romanimusic.com",
    djangoBody: "Tokoh pusat. Lahir dalam keluarga Manouche, ia menciptakan gaya yang dunia sebut gypsy jazz.",
    sections: {
      "Django and the birth of a style": {
        title: "Django dan lahirnya sebuah gaya",
        body: [
          "Pada 1930-an salah satu musisi itu mengubah semuanya. Jean “Django” Reinhardt, lahir dalam keluarga Manouche dengan akar di Belgia, Prancis, dan dunia Sinti yang lebih luas, menyatukan gaya keluarga lama dengan jazz Amerika yang ia dengar di Paris. Dengan Quintette du Hot Club de France ia membuat bunyi yang modern dan berakar dalam. Django tidak menemukan musik Sinti. Ia membawanya ke abad baru dan memberinya nama yang dunia kenali.",
        ],
      },
    },
  }),
  th: overlay({
    kicker: "สาย",
    title: "ประวัติยิปซีแจ๊สและซินติ",
    lead: "ยิปซีแจ๊สไม่ได้เริ่มในสตูดิโอหรือวิทยาลัยดนตรี มันโตจากประเพณีเก่ากว่าที่ซินตินำข้ามยุโรป",
    chaptersNav: "บท",
    expand: "เปิด",
    collapse: "ปิด",
    expandAll: "เปิดทั้งหมด",
    collapseAll: "ปิดทั้งหมด",
    toc: [
      { id: "story", label: "เรื่อง" },
      { id: "houses", label: "บ้าน" },
      { id: "photographs", label: "ภาพ" },
      { id: "on-film", label: "ภาพยนตร์" },
      { id: "timeline", label: "เส้นเวลา" },
    ],
    storyTitle: "เรื่อง",
    fullLife: "ชีวิตทั้งหมด:",
    housesTitle: "บ้าน",
    photosTitle: "ภาพ",
    filmTitle: "จังโกและกรัปเปลลี",
    aboutClip: "เกี่ยวกับคลิปนี้",
    timelineTitle: "จาก bals musette ถึงซามัวซ์",
    opensRomani: "เปิด www.romanimusic.com",
    djangoBody: "ตัวละครกลาง เกิดในครอบครัวมานูช สร้างสไตล์ที่โลกเรียกยิปซีแจ๊ส",
    sections: {
      "Django and the birth of a style": {
        title: "จังโกและการเกิดของสไตล์",
        body: [
          "ทศวรรษ 1930 นักดนตรีคนหนึ่งในนั้นเปลี่ยนทุกอย่าง ฌอง “จังโก” ไรน์ฮาร์ตเกิดในครอบครัวมานูช รากในเบลเยียม ฝรั่งเศส และโลกซินติ ก่อสไตล์ครอบครัวเก่าเข้ากับแจ๊สอเมริกันที่เขาได้ยินในปารีส กับ Quintette du Hot Club de France เขาทำเสียงที่ทันสมัยและหยั่งรากลึก จังโกไม่ได้ประดิษฐ์ดนตรีซินติ เขานำมันเข้าศตวรรษใหม่และให้ชื่อที่โลกรู้จัก",
        ],
      },
    },
  }),
  he: overlay({
    kicker: "שושלת",
    title: "היסטוריה של ג׳יפסי ג׳אז והסינטי",
    lead: "ג׳יפסי ג׳אז לא התחיל באולפן ולא בקונסרבטוריון. הוא צמח ממסורת ישנה יותר שהסינטי נשאו ברחבי אירופה.",
    chaptersNav: "פרקים",
    expand: "לפתוח",
    collapse: "לסגור",
    expandAll: "לפתוח הכל",
    collapseAll: "לסגור הכל",
    toc: [
      { id: "story", label: "סיפור" },
      { id: "houses", label: "בתים" },
      { id: "photographs", label: "תצלומים" },
      { id: "on-film", label: "בסרט" },
      { id: "timeline", label: "ציר זמן" },
    ],
    storyTitle: "סיפור",
    fullLife: "כל החיים:",
    housesTitle: "בתים",
    photosTitle: "תצלומים",
    filmTitle: "ג׳אנגו וגראפלי",
    aboutClip: "על הקליפ הזה",
    timelineTitle: "מ־bals musette לסמואה",
    opensRomani: "פותח www.romanimusic.com",
    djangoBody: "הדמות המרכזית. נולד למשפחה מנוּש ויצר את הסגנון שהעולם קרא לו ג׳יפסי ג׳אז.",
    sections: {
      "Django and the birth of a style": {
        title: "ג׳אנגו ולידת סגנון",
        body: [
          "בשנות השלושים אחד מהמוזיקאים האלה שינה הכול. ז׳אן ״ג׳אנגו״ ריינהארט, שנולד למשפחה מנוּש עם שורשים בבלגיה, בצרפת ובעולם הסינטי, חיבר את סגנון המשפחה הישן עם הג׳אז האמריקאי ששמע בפריז. עם Quintette du Hot Club de France יצר צליל מודרני ומושרש עמוק. ג׳אנגו לא המציא את מוזיקת הסינטי. הוא נשא אותה למאה חדשה ונתן לה שם שהעולם הכיר.",
        ],
      },
    },
  }),
};

export function historyCopy(locale: string): HistoryChrome {
  const base = COPIES[locale] ?? EN;
  const footer = HISTORY_FOOTER[locale] ?? HISTORY_FOOTER.en;
  const houses = HISTORY_HOUSES[locale] ?? HISTORY_HOUSES.en;
  return {
    ...base,
    ...footer,
    houses,
    sections: {
      ...base.sections,
      ...(HISTORY_GAP_STORY[locale] ?? {}),
      ...(HISTORY_GAP_STORY_MORE[locale] ?? {}),
    },
    chapters: {
      ...base.chapters,
      ...(HISTORY_GAP_CHAPTERS[locale] ?? {}),
    },
  };
}

