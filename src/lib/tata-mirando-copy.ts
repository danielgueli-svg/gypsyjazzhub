/** Original house copy for the Tata Mirando orchestra page. Facts from public
 *  records (NL Wikipedia, Discogs, Dutch press). No invented dates. */

export type TataLocale = "en" | "nl";

export type TataCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  born: [string, string];
  instrument: [string, string];
  settled: [string, string];
  lead: string;
  sections: { heading: string; paragraphs: string[] }[];
  laterTitle: string;
  later: { name: string; note: string }[];
  chairsTitle: string;
  chairsLead: string;
  chairs: { slug: string; name: string; role: string }[];
  filmGroupsTitle: string;
  filmGroupsLead: string;
  filmGroups: { country: string; countrySlug: string; note?: string; groups: { slug: string; name: string; note: string }[] }[];
  listenTitle: string;
  documentary: { title: string; url: string; note: string };
  clips: { title: string; url: string }[];
  archiveTitle: string;
  archiveLead: string;
  archiveUrl: string;
  archiveHandle: string;
  netherlands: string;
};

const EN: TataCopy = {
  kicker: "Netherlands · Sinti orchestra",
  title: "Tata Mirando",
  subtitle: "Joseph Weiss and the family orchestra",
  born: ["Born", "Opfikon, Switzerland · 6 March 1895 — 1 January 1967, Dieren"],
  instrument: ["Chairs", "Violin, double bass, harp — family gypsy orchestra"],
  settled: ["Netherlands", "Arrived 1937 · Cruquius, The Hague, Arnhem"],
  lead:
    "The Weiss family are Dutch Sinti who took the stage name Mirando. Tata means father: every leader of the family orchestra is called Tata. The public name on the records is Tata Mirando en zijn Zigeunerorkest.",
  sections: [
    {
      heading: "The family",
      paragraphs: [
        "Joseph Weiss was born on 6 March 1895 in Opfikon, Switzerland, son of Johann Weiss, a travelling musician. He learned violin making and repair from his father, and played double bass and violin in the family kapelle that had been working in Germany since about 1900. With his wife Balwina Georg, a harpist, he raised a large family — twelve sons and three daughters, among them Meissel, Loeila, Morschy, Roma, Nello, Adolf (Kokalo), Lupa and Moro.",
        "In 1937, as people around them began to disappear under the Nazi laws, Joseph, Balwina and the children left for the Netherlands, almost empty-handed. Relatives did not all make that road. The family first lived in caravans, then in houses, at Cruquius in the Haarlemmermeer and later on the Trekweg in The Hague. Joseph earned a living as a violin maker and with the orchestra.",
        "The name Mirando, according to the family, was coined by the circus director Toni Boltini. Another telling is that Morschy bought it from an Italian circus. Tata stayed. Each son who later led a band could be Tata in his turn.",
      ],
    },
    {
      heading: "The orchestra",
      paragraphs: [
        "The Tata Mirando orchestra was not a Hot Club quintet. It was a family gypsy orchestra: several violins, viola, piano, bass, two-neck guitars, Balwina’s harp. They played the Kurhaus in Scheveningen, private houses, and nights for the Dutch royal household. The book was Hungarian csárdás (Cserebogár, Egy cica), Romanian pieces such as Ciocârlia, Russian songs (Two Guitars, Dark Eyes), and tunes of their own.",
        "They also played swing. A night could open a Hungarian csárdás, drop into a Romanian doina, and come back to the dance — and sometimes put a piece of gypsy jazz on the stand. Dutch listeners who knew only the salon orchestras of Gregor Serban or Lakatos heard a different Sinti house: mixed, travelling, and not written down.",
        "Joseph died in Dieren on 1 January 1967. He is buried at Moscowa in Arnhem. The orchestra did not stop with him.",
      ],
    },
    {
      heading: "After Tata",
      paragraphs: [
        "The sons took the name in different directions. Meissel led De zonen van Tata Mirando — they played the Stamping Ground festival at Kralingen in 1970. Loeila had Loeila Magyara. Morschy kept a Mirando orchestra of his own. Roma Heina, Meissel’s son, went on from 1996 as Koninklijk Zigeunerorkest Roma Mirando. Adolf Kokalo Weiss (1933–2025), Joseph’s son, later carried the Tata Mirando name himself.",
        "The records kept circulating: Zigeuner romance (1977), Sinto Gilia’s (1980), the 1994 orchestra albums, Gipsy Festival (2001), Dadesko Wazst with Nello Mirando (2004). Nello was a violin chair of the house. The billed name Tata Mirando en zijn Zigeunerorkest is still the one on Spotify and iTunes.",
        "A later family group, the Jaroka Mirando Band, still plays the Dutch Sinti rooms. They were on the Gypsy Festival Tilburg bill at Cultuurbos Bosvreugd on 22 August 2026, in the same woods as the Rosenberg and Basily chairs. The orchestra is not a weekly jam. It is the older Dutch Sinti house — violin first, family time, and a swing chorus when the night wants it.",
      ],
    },
  ],
  laterTitle: "Houses that kept the name",
  later: [
    { name: "De zonen van Tata Mirando", note: "Meissel Weiss. Stamping Ground, Kralingen, 1970." },
    { name: "Loeila Magyara", note: "Loeila Weiss’s orchestra." },
    { name: "Morschy Mirando", note: "Morschy’s own Mirando orchestra." },
    { name: "Koninklijk Zigeunerorkest Roma Mirando", note: "Roma Heina, from 1996." },
    { name: "Adolf Kokalo Weiss", note: "Joseph’s son (1933–2025). Carried the Tata Mirando name." },
    { name: "Jaroka Mirando Band", note: "Later family band. Gypsy Festival Tilburg, 22 August 2026." },
    { name: "Joedo Mirando Jr.", note: "Violin. Royal Tata Mirando Orchestra theatre tour, on the archive." },
    { name: "La Sonrisa", note: "Singer in the family circle. Television debut June 2022. Bills with Romano Weis and Gitano Kings." },
    { name: "Hannes Weis", note: "Violin on the Tata orchestra bill (Roermond pilgrimage; Een zwaar hart)." },
    { name: "Lala Weiss", note: "Vocal. Oedoer Drom, on the archive." },
    { name: "Pauli Weiss Mirando", note: "Family chair, billed 1955 with Jhonny Kokaljoo." },
    { name: "Spatso Weis Mirando", note: "Family chair, named beside Romano Weis Mirando Sr." },
  ],
  chairsTitle: "On the film — Tata Mirando orchestra",
  chairsLead:
    "Een zwaar hart (2001) bills this Dutch lineup. Names and chairs as they appear on the credits. Bokkie Vink is the cimbalom chair, not a Weiss.",
  chairs: [
    { slug: "nello-mirando-jr", name: "Nello Mirando Jr.", role: "Primas" },
    { slug: "kokalo-mirando", name: "Kokalo Mirando", role: "Piano" },
    { slug: "nello-mirando-sr", name: "Nello Mirando Sr.", role: "Guitar" },
    { slug: "lupa-mirando", name: "Lupa Mirando", role: "Double bass" },
    { slug: "nello-mirando-3e", name: "Nello Mirando 3e", role: "Violin" },
    { slug: "bokkie-vink", name: "Bokkie Vink", role: "Cimbalom" },
  ],
  filmGroupsTitle: "Other orchestras on the film",
  filmGroupsLead:
    "The same credits name village and restaurant orchestras the family sat with. Traced to country. Urszui Kálmán appears twice — Romania guest and Mera Gypsy Band. Sándor Járóka was already on the hub; Buffo Rigó is the other Hungarian name in the thanks.",
  filmGroups: [
    {
      country: "Netherlands",
      countrySlug: "netherlands",
      groups: [
        {
          slug: "the-gypsy-boys",
          name: "The Gypsy Boys",
          note: "Billed Orkest The Gypsy Boys in the thanks.",
        },
        {
          slug: "ocho-gadje",
          name: "Ocho Gadje",
          note: "Billed Orkest Ocho Gadje in the thanks.",
        },
      ],
    },
    {
      country: "Romania",
      countrySlug: "romania",
      note: "Overlap: Urszui Kálmán sits on the Romania card with Lako Aladar, and in Mera Gypsy Band.",
      groups: [
        {
          slug: "mera-gypsy-band",
          name: "Mera Gypsy Band",
          note: "Méra, Kalotaszeg. Fodor Sándor “Neti” primas, Fodor Jr. violin, Urszui Kálmán viola, Pusztái Aladár bass.",
        },
        {
          slug: "taraful-palatca",
          name: "Taraful Palatca",
          note: "Pălatca, Cluj. Florin Codoba primas, Martin Codoba violin, Laurenţiu Codoba and Ştefan Moldovan viola, Covaci Puchi bass.",
        },
      ],
    },
    {
      country: "Hungary",
      countrySlug: "hungary",
      groups: [
        {
          slug: "sandor-jaroka-orchestra",
          name: "Sándor Járóka and His Orchestra",
          note: "Thanked as Jaroka Sandor. Already on the hub.",
        },
        {
          slug: "buffo-rigo-gypsy-band",
          name: "Sándor Buffo Rigó and His Hungarian Gypsy Band",
          note: "Thanked as Buffo Rigo Sandor.",
        },
      ],
    },
  ],
  listenTitle: "Watch and listen",
  documentary: {
    title: "Een zwaar hart (2001)",
    url: "https://www.youtube.com/watch?v=SpK9cMg_LdQ",
    note: "Hans Fels and Shuchen Tan. VPRO Dokwerk, 70 minutes. The Tata Mirando family — music, war, and the orchestra that kept going.",
  },
  clips: [
    {
      title: "Tata Mirando Orkest — Csárdás Taverne, 1985",
      url: "https://www.youtube.com/watch?v=1aPVACDHK-c",
    },
    {
      title: "The Royal Tata Mirando Orchestra — theatre tour",
      url: "https://www.youtube.com/watch?v=gVGQXlfFD4k",
    },
  ],
  archiveTitle: "The International Archive for Sinti & Gypsy Music",
  archiveLead:
    "Family YouTube channel, hosted by Moro and Lupa Heina Mirando. Orchestra nights, primas chairs and Dutch Sinti rooms — Tata Mirando, Hungarian zenekarok, Romanian taraf, Rinaldo Oláh. We put those names on the country pages. Subscribe there for the tapes.",
  archiveUrl: "https://www.youtube.com/@theinternationalarchivefor9731",
  archiveHandle: "@theinternationalarchivefor9731",
  netherlands: "Netherlands country page",
};

const NL: TataCopy = {
  kicker: "Nederland · Sinti-orkest",
  title: "Tata Mirando",
  subtitle: "Joseph Weiss en het familie-orkest",
  born: ["Geboren", "Opfikon, Zwitserland · 6 maart 1895 — 1 januari 1967, Dieren"],
  instrument: ["Bezetting", "Viool, contrabas, harp — familie-zigeunerorkest"],
  settled: ["Nederland", "Aangekomen 1937 · Cruquius, Den Haag, Arnhem"],
  lead:
    "De familie Weiss zijn Nederlandse Sinti die de artiestennaam Mirando aannamen. Tata betekent vader: iedere leider van het familie-orkest heet Tata. Op de platen staat Tata Mirando en zijn Zigeunerorkest.",
  sections: [
    {
      heading: "De familie",
      paragraphs: [
        "Joseph Weiss werd op 6 maart 1895 geboren in Opfikon, Zwitserland, als zoon van Johann Weiss, een reizend muzikant. Hij leerde vioolbouw en reparatie van zijn vader, en speelde contrabas en viool in de familiekapel die vanaf omstreeks 1900 in Duitsland werkte. Met zijn vrouw Balwina Georg, harpiste, kreeg hij een groot gezin — twaalf zonen en drie dochters, onder wie Meissel, Loeila, Morschy, Roma, Nello, Adolf (Kokalo), Lupa en Moro.",
        "In 1937, toen mensen om hen heen begonnen te verdwijnen, vertrokken Joseph, Balwina en de kinderen naar Nederland, bijna zonder bezit. Niet alle familie haalde die weg. Ze woonden eerst in woonwagens, later in huizen, in Cruquius in de Haarlemmermeer en daarna aan de Trekweg in Den Haag. Joseph verdiende als vioolbouwer en met het orkest.",
        "De naam Mirando is volgens de familie bedacht door circusdirecteur Toni Boltini. Een andere overlevering zegt dat Morschy hem van een Italiaans circus kocht. Tata bleef. Elke zoon die later een orkest leidde, kon op zijn beurt Tata zijn.",
      ],
    },
    {
      heading: "Het orkest",
      paragraphs: [
        "Het Tata Mirando-orkest was geen Hot Club-kwintet. Het was een familie-zigeunerorkest: meerdere violen, altviool, piano, bas, tweehalzige gitaren, de harp van Balwina. Ze speelden in het Kurhaus in Scheveningen, bij welgestelde families, en voor het Koninklijk Huis. Het repertoire was Hongaarse csárdás (Cserebogár, Egy cica), Roemeense stukken zoals Ciocârlia, Russische liederen (Twee gitaren, Zwarte ogen), en eigen werk.",
        "Ze speelden ook swing. Een avond kon een Hongaarse csárdás openen, naar een Roemeense doina zakken, en terug naar de dans — en soms een stuk zigeunerjazz op de lessenaar zetten. Nederlandse luisteraars die alleen de salonorkesten van Gregor Serban of Lakatos kenden, hoorden een ander Sinti-huis: gemengd, reizend, en niet van papier.",
        "Joseph stierf op 1 januari 1967 in Dieren. Hij ligt op Moscowa in Arnhem. Het orkest stopte niet met hem.",
      ],
    },
    {
      heading: "Na Tata",
      paragraphs: [
        "De zonen namen de naam verschillende kanten op. Meissel leidde De zonen van Tata Mirando — ze speelden in 1970 op Stamping Ground in Kralingen. Loeila had Loeila Magyara. Morschy hield een eigen Mirando-orkest. Roma Heina, de zoon van Meissel, ging vanaf 1996 verder als Koninklijk Zigeunerorkest Roma Mirando. Adolf Kokalo Weiss (1933–2025), zoon van Joseph, droeg later zelf de naam Tata Mirando.",
        "De platen bleven lopen: Zigeuner romance (1977), Sinto Gilia’s (1980), de orkestalbums van 1994, Gipsy Festival (2001), Dadesko Wazst met Nello Mirando (2004). Nello was een vioolstoel van het huis. De naam Tata Mirando en zijn Zigeunerorkest staat nog op Spotify en iTunes.",
        "Een later familiegroep, de Jaroka Mirando Band, speelt nog in de Nederlandse Sinti-zalen. Ze stonden op 22 augustus 2026 op Gypsy Festival Tilburg in Cultuurbos Bosvreugd, in hetzelfde bos als de Rosenberg- en Basily-stoelen. Het orkest is geen wekelijkse jam. Het is het oudere Nederlandse Sinti-huis — eerst viool, familiestijd, en een swing-couplet als de avond het vraagt.",
      ],
    },
  ],
  laterTitle: "Huizen die de naam hielden",
  later: [
    { name: "De zonen van Tata Mirando", note: "Meissel Weiss. Stamping Ground, Kralingen, 1970." },
    { name: "Loeila Magyara", note: "Het orkest van Loeila Weiss." },
    { name: "Morschy Mirando", note: "Het eigen Mirando-orkest van Morschy." },
    { name: "Koninklijk Zigeunerorkest Roma Mirando", note: "Roma Heina, vanaf 1996." },
    { name: "Adolf Kokalo Weiss", note: "Zoon van Joseph (1933–2025). Droeg de naam Tata Mirando." },
    { name: "Jaroka Mirando Band", note: "Later familieband. Gypsy Festival Tilburg, 22 augustus 2026." },
    { name: "Joedo Mirando Jr.", note: "Viool. Theatre tour van het Royal Tata Mirando Orchestra, op het archief." },
    { name: "La Sonrisa", note: "Zangeres in de familiekring. Televisiedebuut juni 2022. Avonden met Romano Weis en Gitano Kings." },
    { name: "Hannes Weis", note: "Viool op de Tata-orkestbezetting (bedevaart Roermond; Een zwaar hart)." },
    { name: "Lala Weiss", note: "Zang. Oedoer Drom, op het archief." },
    { name: "Pauli Weiss Mirando", note: "Familiestoel, 1955 met Jhonny Kokaljoo." },
    { name: "Spatso Weis Mirando", note: "Familiestoel, genoemd naast Romano Weis Mirando Sr." },
  ],
  chairsTitle: "Op de film — Tata Mirando-orkest",
  chairsLead:
    "Een zwaar hart (2001) zet deze Nederlandse bezetting op de credits. Namen en stoelen zoals ze daar staan. Bokkie Vink is de cymbaalstoel, geen Weiss.",
  chairs: EN.chairs,
  filmGroupsTitle: "Andere orkesten op de film",
  filmGroupsLead:
    "Dezefde titels noemen dorps- en restaurantorkesten waarmee de familie zat. Op land gezet. Urszui Kálmán staat twee keer: bij Roemenië met Lako Aladar, en in Mera Gypsy Band. Sándor Járóka stond al op de hub; Buffo Rigó is de andere Hongaarse naam in de dank.",
  filmGroups: [
    {
      country: "Nederland",
      countrySlug: "netherlands",
      groups: [
        {
          slug: "the-gypsy-boys",
          name: "The Gypsy Boys",
          note: "Op de credits: Orkest The Gypsy Boys, in de dank.",
        },
        {
          slug: "ocho-gadje",
          name: "Ocho Gadje",
          note: "Op de credits: Orkest Ocho Gadje, in de dank.",
        },
      ],
    },
    {
      country: "Roemenië",
      countrySlug: "romania",
      note: "Overlap: Urszui Kálmán staat op de Roemenië-kaart met Lako Aladar, én in Mera Gypsy Band.",
      groups: [
        {
          slug: "mera-gypsy-band",
          name: "Mera Gypsy Band",
          note: "Méra, Kalotaszeg. Fodor Sándor “Neti” primas, Fodor Jr. viool, Urszui Kálmán altviool, Pusztái Aladár bas.",
        },
        {
          slug: "taraful-palatca",
          name: "Taraful Palatca",
          note: "Pălatca, Cluj. Florin Codoba primas, Martin Codoba viool, Laurenţiu Codoba en Ştefan Moldovan altviool, Covaci Puchi bas.",
        },
      ],
    },
    {
      country: "Hongarije",
      countrySlug: "hungary",
      groups: [
        {
          slug: "sandor-jaroka-orchestra",
          name: "Sándor Járóka and His Orchestra",
          note: "In de dank als Jaroka Sandor. Stond al op de hub.",
        },
        {
          slug: "buffo-rigo-gypsy-band",
          name: "Sándor Buffo Rigó and His Hungarian Gypsy Band",
          note: "In de dank als Buffo Rigo Sandor.",
        },
      ],
    },
  ],
  listenTitle: "Kijken en luisteren",
  documentary: {
    title: "Een zwaar hart (2001)",
    url: "https://www.youtube.com/watch?v=SpK9cMg_LdQ",
    note: "Hans Fels en Shuchen Tan. VPRO Dokwerk, 70 minuten. De familie Tata Mirando — muziek, oorlog, en het orkest dat doorging.",
  },
  clips: EN.clips,
  archiveTitle: "The International Archive for Sinti & Gypsy Music",
  archiveLead:
    "Familiekanaal op YouTube, hosts Moro en Lupa Heina Mirando. Orkestavonden, primasstoelen en Nederlandse Sinti-zalen — Tata Mirando, Hongaarse zenekarok, Roemeense taraf, Rinaldo Oláh. Die namen staan nu op de landpagina’s. Abonneren voor de tapes.",
  archiveUrl: EN.archiveUrl,
  archiveHandle: EN.archiveHandle,
  netherlands: "Nederland-pagina",
};

export function tataCopy(locale: string): TataCopy {
  return locale === "nl" ? NL : EN;
}
