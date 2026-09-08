/** Sinti / Manouche family houses. Facts already on the hub. No invented names. */

export type FamilyMember = { slug: string; name: string; role: string };

export type Family = {
  slug: string;
  country: string;
  countries?: string[];
  name: string;
  kicker: string;
  summary: string;
  href: string;
  members: FamilyMember[];
  sections: { heading: string; paragraphs: string[] }[];
  clip?: { title: string; url: string };
};

export const FAMILIES: Family[] = [
  {
    slug: "mirando",
    country: "Netherlands",
    name: "The Mirando family",
    kicker: "Tata Mirando",
    summary:
      "Joseph Weiss, Tata Mirando (1895–1967), and the Weiss family orchestra. Dutch Sinti house: violin first, Hungarian and Romanian song, and sometimes gypsy jazz.",
    href: "/tata-mirando",
    members: [
      { slug: "tata-mirando", name: "Tata Mirando (Joseph Weiss)", role: "Leader, bass, violin" },
      { slug: "kokalo-mirando", name: "Kokalo Mirando (Adolf Weiss)", role: "Piano; later Tata" },
      { slug: "nello-mirando-jr", name: "Nello Mirando Jr.", role: "Primas" },
      { slug: "nello-mirando-sr", name: "Nello Mirando Sr.", role: "Guitar" },
      { slug: "lupa-mirando", name: "Lupa Mirando", role: "Double bass" },
      { slug: "nello-mirando-3e", name: "Nello Mirando 3e", role: "Violin" },
      { slug: "loeila-mirando", name: "Loeila Mirando", role: "Loeila Magyara" },
      { slug: "meissel-mirando", name: "Meissel Weiss Mirando", role: "De zonen van Tata Mirando" },
      { slug: "roma-heina-mirando", name: "Roma Heina Mirando", role: "Violin; Koninklijk Zigeunerorkest" },
      { slug: "moro-heina-mirando", name: "Moro Heina Mirando", role: "Archive host; Orkest Moro Mirando" },
      { slug: "lupa-heina-mirando", name: "Lupa Heina Mirando", role: "Archive host" },
      { slug: "romano-weis-mirando", name: "Romano Weis Mirando Sr.", role: "Violin, vocal" },
      { slug: "bokkie-vink", name: "Bokkie Vink", role: "Cimbalom" },
      { slug: "joedo-mirando", name: "Joedo Mirando Jr.", role: "Violin" },
      { slug: "pauli-weiss-mirando", name: "Pauli Weiss Mirando", role: "Family chair, 1955" },
      { slug: "spatso-weis-mirando", name: "Spatso Weis Mirando", role: "Family chair" },
      { slug: "hannes-weis", name: "Hannes Weis", role: "Violin; Tata orchestra" },
      { slug: "la-sonrisa", name: "La Sonrisa", role: "Vocal" },
      { slug: "lala-weiss", name: "Lala Weiss", role: "Vocal; Oedoer Drom" },
    ],
    clip: { title: "Een zwaar hart — Tata Mirando family", url: "https://www.youtube.com/watch?v=SpK9cMg_LdQ" },
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "Joseph Weiss was born on 6 March 1895 in Opfikon, Switzerland, son of Johann Weiss, a travelling musician. He learned violin making from his father, and played bass and violin in the family kapelle that had worked in Germany since about 1900. With Balwina Georg, a harpist, he raised a large family — twelve sons and three daughters, among them Meissel, Loeila, Morschy, Roma, Nello, Adolf (Kokalo), Lupa and Moro.",
          "In 1937, as people around them began to disappear under the Nazi laws, Joseph, Balwina and the children left for the Netherlands. Relatives did not all make that road. They first lived in caravans, then in houses, at Cruquius and later on the Trekweg in The Hague. The stage name Mirando, the family says, was coined by circus director Toni Boltini. Tata means father: every leader of the family orchestra is called Tata.",
        ],
      },
      {
        heading: "The orchestra",
        paragraphs: [
          "Tata Mirando en zijn Zigeunerorkest was not a Hot Club quintet. Several violins, viola, piano, bass, two-neck guitars, Balwina’s harp. Kurhaus Scheveningen, private houses, nights for the Dutch royal household. The book was Hungarian csárdás, Romanian pieces such as Ciocârlia, Russian songs, and sometimes a swing chorus. Joseph died in Dieren on 1 January 1967. He is buried at Moscowa in Arnhem. The orchestra did not stop.",
          "The sons took the name in different directions: Meissel’s De zonen van Tata Mirando (Stamping Ground, Kralingen, 1970), Loeila Magyara, Morschy’s own orchestra, Roma Heina’s Koninklijk Zigeunerorkest from 1996, Kokalo later carrying the Tata name himself (1933–2025). Moro and Lupa Heina Mirando host The International Archive for Sinti & Gypsy Music — hundreds of family and primas nights.",
        ],
      },
    ],
  },
  {
    slug: "rosenberg",
    country: "Netherlands",
    name: "The Rosenberg family",
    kicker: "Helmond",
    summary:
      "Dutch Sinti guitar from Helmond. Stochelo, Nous’che and Nonnie made the Rosenberg Trio; Mozes, Jimmy and the next chairs keep the same language.",
    href: "/families/rosenberg",
    members: [
      { slug: "stochelo-rosenberg", name: "Stochelo Rosenberg", role: "Lead guitar" },
      { slug: "nousche-rosenberg", name: "Nous’che Rosenberg", role: "Rhythm guitar" },
      { slug: "nonnie-rosenberg", name: "Nonnie Rosenberg", role: "Double bass" },
      { slug: "mozes-rosenberg", name: "Mozes Rosenberg", role: "Lead guitar" },
      { slug: "jimmy-rosenberg", name: "Jimmy Rosenberg", role: "Lead guitar" },
      { slug: "django-rosenberg", name: "Django Rosenberg", role: "Lead guitar" },
      { slug: "nomy-rosenberg", name: "Nomy Rosenberg", role: "Guitar" },
      { slug: "daniel-rosenberg", name: "Daniel Rosenberg", role: "Rhythm guitar" },
      { slug: "bakkero-rosenberg", name: "Bakkero Rosenberg", role: "Violin" },
    ],
    clip: { title: "Rosenberg Trio — Seresta", url: "https://www.youtube.com/watch?v=OWOL45TSweo" },
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "The Rosenbergs are Dutch Sinti from the Helmond side of the Brabant network — the same world as the Schäfers around Gerwen and Nuenen. They trace themselves to German Sinti lineages, unlike the Basily family of the same Dutch scene, who trace their roots to French Sinti (Manouche).",
          "The guitar was learned by ear. Wasso (Waso) Grünholz, a largely unrecorded Sinti guitarist from the Netherlands, taught a whole generation here: Stochelo, Jimmy, Paulus Schäfer, Fapy Lafertin, Tcha Limberger and others. Fathers, uncles, cousins. No conservatory name on the door.",
        ],
      },
      {
        heading: "The trio and after",
        paragraphs: [
          "Stochelo Rosenberg was born on 19 February 1968 in Helmond. He started guitar at ten, from his father Mimer and from Wasso. In 1989 he formed the Rosenberg Trio with cousins Nous’che on rhythm and Nonnie on bass. Carnegie Hall, the Concertgebouw, North Sea Jazz, Samois, Marciac, the Duc des Lombards: the fat, singing vibrato became the Dutch school in public. Sinti Music still books the family name as the working trio.",
          "Mozes Rosenberg, born 1981, Stochelo’s brother, started at six and was already on Dutch television with the trio at seven. He leads his own trio (Daniel Rosenberg, Matheus Nicolaiewsky) and shares bills with Stochelo. Jimmy Rosenberg, born 1980, a cousin, was the child prodigy whose early records still stop guitarists. Django Rosenberg and Nomy Rosenberg keep the same family guitar on the current Dutch rooms.",
          "This is not a museum. The camps, the jams, the festival woods at Tilburg — the Rosenbergs still sit in the same chairs they learned in. The International Archive keeps a three-part guitar documentary on the trio, and a film on Jimmy — the father, the son and the talent. Bakkero Rosenberg, the Sinti violin, sits with Paulus Schäfer’s band on the same channel.",
        ],
      },
    ],
  },
  {
    slug: "schafer",
    country: "Netherlands",
    name: "The Schäfer family",
    kicker: "Gerwen · Nuenen",
    summary:
      "Dutch Sinti guitar from the same Brabant camp as the Rosenbergs. German Sinti lineage. Paulus is the public chair; Sendelo, Noah, Pupa and Ollie keep the house.",
    href: "/families/schafer",
    members: [
      { slug: "paulus-schafer", name: "Paulus Schäfer", role: "Lead guitar" },
      { slug: "sendelo-schafer", name: "Sendelo Schäfer", role: "Rhythm guitar" },
      { slug: "noah-schafer", name: "Noah Schäfer", role: "Double bass" },
      { slug: "pupa-schafer", name: "Pupa Schäfer", role: "Mother; Gerwen house" },
      { slug: "ollie-schafer", name: "Ollie Schäfer", role: "Brother; camp" },
    ],
    clip: {
      title: "Paulus Schäfer and his mother Pupa Schäfer",
      url: "https://www.youtube.com/watch?v=LdV8irtL7RY",
    },
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "The Schäfers are Dutch Sinti from Gerwen and Nuenen — the same Brabant camp as Stochelo, Jimmy and Mozes Rosenberg. They trace themselves to German Sinti lineages, like the Rosenbergs; the Basily family of the same Dutch scene traces to French Sinti (Manouche).",
          "The guitar was learned by ear. Wasso (Waso) Grünholz, largely unrecorded, taught this generation. Paulus has said Stochelo lived at the same camp, ten years older, and that Waso told him at thirteen to find his own sound. Fathers, uncles, cousins. No conservatory name on the door.",
        ],
      },
      {
        heading: "Paulus and the band",
        paragraphs: [
          "Paulus Schäfer was born on 31 March 1978 in Gerwen. He started guitar at five. After Jimmy Rosenberg left, he took the lead chair in the Gipsy Kids. In 2001 he formed the Paulus Schäfer Gipsy Band with Sendelo Schäfer on rhythm and Jozua Rosenberg on bass. Albums on file: Into the Light (2002), Desert Fire (2006), Twelfth Year (2012), Rock Django with Tim Kliphuis (2012), Letter to Van Gogh (2015). The working trio now is Paulus, Romino Grünholz on rhythm, Noah Schäfer on bass. paulusschafer.com.",
          "Sendelo holds the pompe beside Feigeli Prisor as well — Café Wilhelmina, the family nights. Ollie, Paulus’s brother, helps run the Sinti Jazz Guitar Camp in Gerwen, the camp Paulus hosts with Stochelo Rosenberg. Pupa, Paulus’s mother, is on the International Archive documentary about life, religion and the music of that house. Bakkero Rosenberg’s Sinti violin has sat with the Paulus Schäfer Band on the same channel.",
          "This is a living house, not a museum. The camps, the Gerwen rooms, the festival bills — Kings of Strings with Stochelo and Mozes, Shrewsbury, Samois. Open a name for the player. The Netherlands country page keeps the current jams; this archive page is the family.",
        ],
      },
    ],
  },
  {
    slug: "basily",
    country: "Netherlands",
    name: "The Basily family",
    kicker: "Dutch Sinti · Manouche roots",
    summary:
      "Five generations of Dutch Sinti who trace their roots to French Sinti (Manouche). Popy Basily’s band, then The Basily Boys.",
    href: "/families/basily",
    members: [
      { slug: "popy-basily", name: "Popy (Johannes) Basily", role: "Solo guitar" },
      { slug: "tucsi-basily", name: "Tucsi Basily", role: "Violin" },
      { slug: "gino-basily", name: "Gino Basily", role: "Rhythm guitar" },
      { slug: "zonzo-basily", name: "Zonzo Basily", role: "Rhythm guitar" },
      { slug: "noekie-basily", name: "Noekie Basily", role: "Guitar" },
      { slug: "raklo-basily", name: "Raklo Basily", role: "Guitar" },
      { slug: "morice-basily", name: "Morice Basily", role: "Guitar" },
      { slug: "noekie-basily", name: "Noekie Basily", role: "Guitar" },
    ],
    clip: { title: "Basily Gipsy Band — Swing for the Gipsies", url: "https://www.youtube.com/watch?v=ZsC7VaUl3dU" },
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "The Basily family is a Dutch Sinti musical family, active for at least five generations, from the same broad Dutch network that also produced the Rosenbergs and Schäfers. They trace themselves to French Sinti (Manouche). Rosenberg and Schäfer, of the same Dutch scene, come from German Sinti lineages.",
          "The playing stays in the oral tradition: learned by ear inside the family, not from sheet music. The public band is the Basily Gipsy Band. Core chairs are usually Popy (Johannes) Basily on solo guitar, Tucsi on violin, Gino and Zonzo on rhythm — often joined by Martin Limberger on rhythm and Sani van Mullem on double bass.",
        ],
      },
      {
        heading: "The bands",
        paragraphs: [
          "They started closer to Hot Club de France style, then mixed Balkan, Spanish and flamenco colours while keeping a strong swing. North Sea Jazz, the Django Reinhardt Festival at Samois, Copenhagen Jazz Festival, Birdland in New York, and a night with Stéphane Grappelli sit on the book. Albums include Antara (1991), Swing for the Gipsies, Gipsy Moments (2003) and Gipsy Jazz Memories (2005).",
          "The sons and nephews — Zonzo, Noekie, Raklo, Morice and others — formed The Basily Boys around 2007–2009, recorded young, and reached the semi-finals of Holland’s Got Talent. They keep the family tradition with a slightly more modern edge. Respected in the Netherlands and Scandinavia, especially Denmark, where Popy helped popularise the style; less of a world-stage name than the Rosenberg Trio, and still a house you hear on Dutch bills.",
        ],
      },
    ],
  },
  {
    slug: "reinhardt",
    country: "France",
    name: "The Reinhardt family",
    kicker: "Django",
    summary:
      "Django Reinhardt and the Manouche house that gave the music its public name. Joseph, Lousson, Babik — the family did not stop at the grave.",
    href: "/families/reinhardt",
    members: [
      { slug: "django-reinhardt", name: "Django Reinhardt", role: "Solo guitar" },
      { slug: "joseph-reinhardt", name: "Joseph Reinhardt", role: "Rhythm guitar" },
      { slug: "babik-reinhardt", name: "Babik Reinhardt", role: "Guitar" },
    ],
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "Jean “Django” Reinhardt was born on 23 January 1910 in a caravan at Liberchies, Belgium, into a Manouche family, and grew up on the road between Belgium and France. After the 1928 caravan fire he built a guitar language with two fingers of the left hand. With Stéphane Grappelli, from 1934, the Quintette du Hot Club de France made that family music a name the wider world would use: gypsy jazz.",
          "Joseph “Nin-Nin” Reinhardt, Django’s younger brother, held the pompe — the two-and-four that is still the engine. The records (Minor Swing, Djangology, Nuages) are the public face. Django died near Fontainebleau on 16 May 1953 and is buried at Samois-sur-Seine.",
        ],
      },
      {
        heading: "After Django",
        paragraphs: [
          "The name did not stop. Henri “Lousson” Reinhardt (1929–1992), Django’s first son, kept the travelling life and left few records. Jean-Jacques “Babik” Reinhardt (1944–2001), Django and Naguine’s son, played a more modern jazz and did not try to be a copy; his son David still leads a trio.",
          "The French page is for this house. The full life is on Django’s own page. Grappelli has his. The family here is the line that still answers to Reinhardt when a French room wants the source.",
        ],
      },
    ],
  },
  {
    slug: "gipsy-kings",
    country: "France",
    name: "Gipsy Kings — Reyes and Baliardo",
    kicker: "Arles · family rumba",
    summary:
      "Two Gitano families from Arles and Montpellier: Reyes and Baliardo. Not Django’s quintet — like Tata Mirando, family music that overlaps this hub. Nicolas Reyes and Tonino Baliardo still carry the name.",
    href: "/families/gipsy-kings",
    members: [
      { slug: "jose-reyes", name: "José Reyes", role: "Vocal; Los Reyes" },
      { slug: "manitas-de-plata", name: "Manitas de Plata", role: "Guitar; Baliardo father" },
      { slug: "nicolas-reyes", name: "Nicolas Reyes", role: "Lead vocal" },
      { slug: "tonino-baliardo", name: "Tonino Baliardo", role: "Lead guitar" },
      { slug: "andre-reyes", name: "André Reyes", role: "Guitar, vocal" },
      { slug: "canut-reyes", name: "Canut Reyes", role: "Guitar, vocal" },
      { slug: "patchai-reyes", name: "Patchaï Reyes", role: "Guitar, vocal" },
      { slug: "pablo-reyes", name: "Pablo Reyes", role: "Guitar, vocal" },
      { slug: "diego-baliardo", name: "Diego Baliardo", role: "Guitar" },
      { slug: "paco-baliardo", name: "Paco Baliardo", role: "Guitar" },
      { slug: "chico-bouchikhi", name: "Chico Bouchikhi", role: "Guitar, vocal (to 1989)" },
    ],
    clip: { title: "Kings of the World — The Gypsy Kings Story", url: "https://www.youtube.com/watch?v=C3JnDa-ezP0" },
    sections: [
      {
        heading: "Family music",
        paragraphs: [
          "The Gipsy Kings are not Django. They do not sit in the Hot Club jam book. That is the same kind of line as Tata Mirando: not gypsy jazz, still the music of the families. Tata is Sinti orchestra from The Hague — violin, csárdás, Ciocârlia. The Reyes and Baliardo houses are Catalan Gitano from Arles and Montpellier — palmas, nylon guitar, rumba. Different book, same world. We overlap.",
          "Gitano Kings around Rein Mercha in Brabant is a different Dutch group. This page is the Arles house. The archive posted Kings of the World — The Gypsy Kings Story.",
        ],
      },
      {
        heading: "Two houses",
        paragraphs: [
          "The Reyes brothers — Nicolas, André, Canut, Patchaï, Pablo — are sons of José Reyes, the Arles singer who worked with Manitas de Plata (Ricardo Baliardo, 1921–2014). After that pair split, José led José et Los Reyes with his sons. Reyes means kings. José died in 1979.",
          "The Baliardo brothers — Tonino, Diego, Paco — are sons of Manitas. The two houses met again at Saintes-Maries-de-la-Mer. Reyes sang; Baliardo played guitar. From that they became the Gipsy Kings, from Arles, in the late 1970s. Chico Bouchikhi was in the first public lineup; he left in 1989 and formed Chico & The Gypsies.",
        ],
      },
      {
        heading: "The records",
        paragraphs: [
          "The 1987 album Gipsy Kings put Bamboleo and Djobi Djoba on the radio — rumba catalana with a pop mix, not la pompe. Nicolas Reyes and Tonino Baliardo still tour under the name. André Reyes later billed Gipsy Kings by André Reyes with the next family chairs. Official site gipsykings.com. Open a name for the player. The France country page keeps the Django rooms; this archive page is the family.",
          "The International Archive for Sinti & Gypsy Music posted Kings of the World — The Gypsy Kings Story. Open a name for the player. The France country page keeps the Django rooms separate.",
        ],
      },
    ],
  },
  {
    slug: "schmitt",
    country: "France",
    name: "The Schmitt family",
    kicker: "Alsace · Forbach",
    summary:
      "Dorado, Tchavolo, Samson, Amati, Bronson. Alsatian Manouche guitar and violin — the family that did not wait for a café label.",
    href: "/families/schmitt",
    members: [
      { slug: "dorado-schmitt", name: "Dorado Schmitt", role: "Guitar, violin" },
      { slug: "tchavolo-schmitt", name: "Tchavolo Schmitt", role: "Guitar" },
      { slug: "samson-schmitt", name: "Samson Schmitt", role: "Guitar" },
      { slug: "amati-schmitt", name: "Amati Schmitt", role: "Guitar" },
      { slug: "bronson-schmitt", name: "Bronson Schmitt", role: "Guitar" },
    ],
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "The Schmitts are the Alsatian Manouche house. Forbach, on the Moselle against the German line, is part of the same world: Winterstein rhythm, Schmitt lead, family time before a festival poster. This is not a lighter café swing.",
          "Dorado Schmitt was born in 1957. Guitar and violin, same singing line, a large musical family. Tchavolo Schmitt, born 1954, is the harder, older bite — family music that did not wait for a festival poster, one of the players who made the 1980s loud again. Festival Django Reinhardt still books the name. Latcho Drom filmed Tchavolo and Dorado on Kali Sara and Tchavolo Swing — that clip sits on the International Archive.",
        ],
      },
      {
        heading: "The next chairs",
        paragraphs: [
          "Samson Schmitt, born 1979, Dorado’s son, carries the violin-and-guitar world onto the current circuit with a harder contemporary edge. Amati and Bronson are the other guitar chairs of this generation — Forbach, Samois, the Family records. Hono Winterstein held time for Dorado, Tchavolo and Samson; from 2001 he held it for Biréli Lagrène.",
          "Open a name for the player page. The Forbach chapter on History is the town story. This page is the family. The Lorier house — Favino, Ringo, Sandro, Renardo — is the other Forbach guitar family; they have their own page.",
        ],
      },
    ],
  },
  {
    slug: "lorier",
    country: "France",
    name: "The Lorier family",
    kicker: "Forbach",
    summary:
      "Forbach Manouche guitar. Favino Lorier is the public chair — not the Paris Favino luthiers. Ringo, Sandro and Renardo keep the house. Same town as Schmitt and Winterstein.",
    href: "/families/lorier",
    members: [
      { slug: "favino-lorier", name: "Favino Lorier", role: "Guitar, violin" },
      { slug: "ringo-lorier", name: "Ringo Lorier", role: "Guitar" },
      { slug: "sandro-lorier", name: "Sandro Lorier", role: "Guitar, vocal" },
      { slug: "renardo-lorier", name: "Renardo Lorier", role: "Community; ensemble" },
    ],
    clip: { title: "Favino Lorier — Minor Swing", url: "https://www.youtube.com/watch?v=M6kLztKSyoY" },
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "The Loriers are a Forbach Manouche family — Moselle, on the German line, not Arles. INA names them with Winterstein, Reinhardt and Schmitt as the dynasties that still play in that town. Favino Lorier is a given name; the Paris workshop of Jacques and Jean-Pierre Favino is a different house.",
          "Favino grew up with Ringo and Sandro Lorier, and in the rooms of Dorado, Samson and Amati Schmitt, Brady Winterstein and Pansch Weiss. Guitar and violin. The sound he hunts is the old one, not the modern fusion chair. Sandro also sings rumba and flamenco colours; he and Favino have shared a Forbach bill at 105db. Ringo sits beside Favino on guitar — Mirecourt, the Moselle nights.",
        ],
      },
      {
        heading: "The town",
        paragraphs: [
          "Renardo Lorier speaks for the Forbach Manouche community and has sat on the town council. France 3 billed him with ensemble Favino when Forbach called itself capitale du jazz manouche. With Roberto Lorier he gave the Manouche-culture talk at the town festival. The guitar chairs are the family; the festival is the Winterstein house. Both belong here.",
          "Open a name for the player. History has the Forbach chapter. Schmitt and Winterstein have their pages. This page is the Lorier house.",
        ],
      },
    ],
  },
  {
    slug: "felix",
    country: "France",
    name: "The Félix family",
    kicker: "Bourg-en-Bresse",
    summary:
      "Manouche guitar from Ain, near Geneva. Sébastien Félix (b. 1971) and his brother Youri; Esteban, Sébastien’s son, holds the bass.",
    href: "/families/felix",
    members: [
      { slug: "sebastien-felix", name: "Sébastien Félix", role: "Guitar" },
      { slug: "youri-felix", name: "Youri Félix", role: "Guitar" },
      { slug: "esteban-felix", name: "Esteban Félix", role: "Double bass" },
    ],
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "The Félix family are Manouche from Bourg-en-Bresse, in the Ain, on the road to Geneva. Sébastien Félix was born in 1971. He and his brother Youri learned guitar young, from a cousin of their parents, by ear — Django’s book. This is not Forbach and not Arles. It is the Sinti swing of the Lyon–Geneva belt.",
          "In 1994 they formed a trio with Bernard Chalon on bass. Terno Sinto (1995) sat them with Mito and Dorno Loeffler. Sinti Swing, with violinist John Intrator, made Vinta in 2001. The 2003 trio record still has Youri on guitar, Chalon on bass, Intrator on violin, and Tchavolo Schmitt as guest.",
        ],
      },
      {
        heading: "Esteban",
        paragraphs: [
          "Esteban Félix is Sébastien’s son. Bass. In 2017, at sixteen, he was billed with his father as Esteban Familia at Jazz en Revermont. He holds bass on Sébastien’s quintet Django Tradition (2018) and on Latcho Mentcho (2023) with Nitcho Reinhardt, Mathieu Chatelain and Jean-Baptiste Baudin. The Paris rooms know him with Hugo Guezbar and Benji Winterstein — 38Riv, Django In London.",
          "Open a name for the player. The France archive is the family list. This page is the Bourg-en-Bresse house.",
        ],
      },
    ],
  },
  {
    slug: "schnuckenack",
    country: "Germany",
    name: "Schnuckenack Reinhardt",
    kicker: "German Sinti violin",
    summary:
      "Franz “Schnuckenack” Reinhardt (1921–2006) put Sinti music on German concert stages after the war. The violin chair of the German revival.",
    href: "/families/schnuckenack",
    members: [
      { slug: "schnuckenack-reinhardt", name: "Schnuckenack Reinhardt", role: "Violin" },
      { slug: "hansche-weiss", name: "Häns’che Weiss", role: "Guitar" },
      { slug: "titi-winterstein", name: "Titi Winterstein", role: "Violin" },
      { slug: "holzmanno-winterstein", name: "Holzmano Winterstein", role: "Rhythm guitar" },
    ],
    clip: { title: "Schnuckenack Reinhardt — Strasbourg 2001", url: "https://www.youtube.com/watch?v=-fqWzXRXP7M" },
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "Franz “Schnuckenack” Reinhardt (1921–2006) was the German Sinti violinist who kept and revitalised the style in Germany after the war. The nickname is Sinti: a nice nose. He never met Django, though the families connect. After 1945 he put Sinti music on German concert stages and kept a great many family tunes on record that would otherwise have stayed unwritten.",
          "The guitar chairs around him were the German-French Sinti house: Häns’che Weiss, Titi Winterstein (violin, 1956–2008 — Häns’che took him into the quintet at fifteen), Holzmano and Ziroli Winterstein. The 1970s German records — Schnuckenack, Häns’che, Titi — belong together. Forbach, on the French-Moselle side, is the same Sinti world seen from the other border.",
        ],
      },
      {
        heading: "Later",
        paragraphs: [
          "The Weiss name runs through this story on both sides of the Rhine. Placement of a single Weiss family page can wait: the name is in the Netherlands (Tata Mirando / Joseph Weiss), in Alsace and Forbach, and here in the German quintets. This page is the German violin house that made the postwar concert public.",
          "Open Schnuckenack, Häns’che or Titi for the player pages. The records are the document.",
        ],
      },
    ],
  },
  {
    slug: "winterstein",
    country: "France",
    countries: ["France", "Germany"],
    name: "The Winterstein family",
    kicker: "Forbach · Alsace · Germany",
    summary:
      "The pompe across the Rhine. Titi’s German violin, Holzmano’s rhythm, Hono and Popots in Forbach, Benji and Brady on the current circuit.",
    href: "/families/winterstein",
    members: [
      { slug: "titi-winterstein", name: "Titi Winterstein", role: "Violin" },
      { slug: "holzmanno-winterstein", name: "Holzmano Winterstein", role: "Rhythm guitar" },
      { slug: "hono-winterstein", name: "Hono Winterstein", role: "Rhythm guitar" },
      { slug: "popots-winterstein", name: "Popots Winterstein", role: "Rhythm guitar" },
      { slug: "benji-winterstein", name: "Benji Winterstein", role: "Rhythm guitar" },
      { slug: "brady-winterstein", name: "Brady Winterstein", role: "Lead guitar" },
      { slug: "moreno-winterstein", name: "Moreno Winterstein", role: "Guitar" },
    ],
    clip: { title: "Titi Winterstein Quintett", url: "https://www.youtube.com/watch?v=yG45rZeNtsM" },
    sections: [
      {
        heading: "Two sides of the border",
        paragraphs: [
          "Winterstein is one name on both sides of the Rhine. In Germany, Titi Winterstein (1956–2008) was the violin of the postwar Sinti revival: Häns’che Weiss took him into the quintet at fifteen; from 1978 he led his own quintet, six records, Django Reinhardt prize 2003. He died in Offenburg. Holzmano Winterstein, born 1952 in Molsheim, Alsace, held rhythm for Schnuckenack from 1969, then Häns’che, then Titi, Biréli Lagrène and Wawau Adler. His brother Ziroli took the solo chair after Lulu Reinhardt left Titi’s band.",
          "On the French-Moselle side the same house sits in Forbach. Hono Winterstein (born 1962) held time for Dorado Schmitt, Tchavolo Schmitt, Samson Schmitt, and from 2001 for Biréli, including tours in the United States and Japan. His brother Popots (Jean-Louis, born 1964) started with Dorado in Metz in 1980 and co-founded Festival de jazz manouche de Forbach in 2018. Popots’s son Benji (born 1991) is the pompe of Fanou Torracinta and the Dario Napoli Trio. Brady, Hono’s nephew, plays lead in Hono’s trio. Moreno Winterstein (born 1963, Alsace) carried the raw Sinti lead onto Samois stages in the 1990s and 2000s.",
        ],
      },
      {
        heading: "The chair",
        paragraphs: [
          "People say Forbach style when they mean a heavy pompe: family rhythm, lead on top. The German 1970s records — Schnuckenack, Häns’che, Titi — belong with that story. This page is the family. Open a name for the player. The Forbach chapter on History is the town.",
        ],
      },
    ],
  },
  {
    slug: "lakatos",
    country: "Hungary",
    name: "The Lakatos family",
    kicker: "Budapest violin",
    summary:
      "Hungarian Roma violin house. Uncle Sándor was the famous primas; Roby Lakatos walks the same line into jazz, classical and Django’s book.",
    href: "/families/lakatos",
    members: [
      { slug: "sandor-lakatos", name: "Sándor Lakatos", role: "Violin" },
      { slug: "roby-lakatos", name: "Roby Lakatos", role: "Violin" },
      { slug: "vilmos-lakatos", name: "Vilmos Lakatos", role: "Guitar" },
      { slug: "lakatos-vilmos", name: "Lakatos Vilmos", role: "Violin, primas" },
      { slug: "lakatos-miklos", name: "Lakatos Miklós", role: "Violin, primas" },
    ],
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "The Lakatos family is one of Hungary’s Roma violin houses. Roby Lakatos was born in 1965. He learned in his uncle Sándor’s band and his father Antal’s — Sándor Lakatos (17 December 1924 — 24 May 1994, Budapest) was the famous primas of that generation, radio folk orchestra 1950–52. The family traces itself to János Bihari, the nineteenth-century “king of gypsy violinists.” Café gypsy, classical rooms and jazz sit in the same right hand.",
          "Roby is the one who walks into Django’s book: nights with Christiaan van Hemert, mentor to Budapest’s Gypsy Jazz Band (Róbert Kárpáti), and a guest on Valami Swing’s Hungarian Django Tales with Vilmos Lakatos on guitar. The restaurant orchestras of Budapest and the Hot Club bills are not two worlds here. They are two rooms of the same house.",
        ],
      },
    ],
  },
  {
    slug: "sarkozy",
    country: "Hungary",
    name: "The Sárközy family",
    kicker: "Százéves Étterem",
    summary:
      "Seven generations of Hungarian Roma violin. Lajos Sárközy Jr — classical prizes, then the restaurant chair, and nights with the Rosenbergs.",
    href: "/families/sarkozy",
    members: [{ slug: "lajos-sarkozy-jr", name: "Lajos Sárközy Jr", role: "Violin" }],
    clip: {
      title: "Lajos Sárközy Jr",
      url: "https://www.youtube.com/watch?v=xtmWqQbZ6_c",
    },
    sections: [
      {
        heading: "The house",
        paragraphs: [
          "Lajos Sárközy Jr comes from seven generations of musicians. He started violin at five with his father, then Józsefváros music school and the Liszt Academy (Eszter Perényi). Ede Zathureczky Hungarian Violin Competition, first prize, 2003 and 2008. He learned Hungarian gypsy music as auxiliary primas beside his father at Kárpátia Restaurant, then formed Lajos Sárközi Jr and his Band: himself first violin, Lajos Sárközi Sr second violin, Gyula Bóni viola, Rudolf Sárközi bass, Gyula Csík cimbalom.",
          "Evenings since 2011 at Százéves Étterem, Pest’s oldest restaurant (1831) — also billed Sárközy Gipsy Fever. That is a restaurant orchestra, not a weekly Django jam. Book the table. The Sárközy Collective (violin, bass, cimbalom, piano) is the concert-hall chair. He has stood with Stochelo and Mozes Rosenberg. In 2015 the music society elected him head and chief primas of the Gipsy Philharmonic Orchestra. sarkozycollective.com.",
        ],
      },
    ],
  },
  {
    slug: "hungarian-primas",
    country: "Hungary",
    name: "Hungarian primas orchestras",
    kicker: "Járóka · Boross · Veres · Toki",
    summary:
      "The café and restaurant violin of Budapest: Sándor Járóka father and son, Lajos Boross, Veres Lajos, Toki Horváth, Lajos Kiss. Names the Mirando family still play.",
    href: "/families/hungarian-primas",
    members: [
      { slug: "sandor-jaroka", name: "Sándor Járóka", role: "Violin" },
      { slug: "sandor-jaroka-jr", name: "Sándor Járóka Jr", role: "Violin" },
      { slug: "lajos-boross", name: "Lajos Boross", role: "Violin" },
      { slug: "toki-horvath", name: "Toki Horváth", role: "Violin" },
      { slug: "veres-lajos", name: "Veres Lajos", role: "Violin" },
      { slug: "lajos-kiss", name: "Lajos Kiss", role: "Violin" },
      { slug: "buffo-rigo", name: "Sándor “Buffo” Rigó", role: "Violin" },
      { slug: "gabora-lajos", name: "Gabora Lajos", role: "Violin" },
      { slug: "erno-kallai-kiss", name: "Ernő Kállai Kiss", role: "Clarinet" },
      { slug: "youri-farkas", name: "Youri Farkas", role: "Violin" },
      { slug: "kis-tyutyu", name: "Kis Tyutyu", role: "Violin" },
      { slug: "bango-margit", name: "Bangó Margit", role: "Vocal" },
      { slug: "tonte-andras", name: "Tonté András", role: "Violin" },
      { slug: "puporka-geza", name: "Puporka Géza", role: "Clarinet" },
      { slug: "horvath-gyula", name: "Horváth Gyula", role: "Violin" },
      { slug: "santa-ferenc", name: "Sánta Ferenc", role: "Violin" },
    ],
    clip: {
      title: "Hungarian gypsy orchestra — clip from the Mirando circle",
      url: "https://www.youtube.com/watch?v=-RINm0oACWA",
    },
    sections: [
      {
        heading: "The primas chair",
        paragraphs: [
          "A primas is first violin and leader of a Hungarian gypsy orchestra: csárdás, nóta, restaurant time. This is not a Hot Club quintet. The Mirando family in the Netherlands played the same book — Hungarian and Romanian song beside the swing chorus — and still name these players.",
          "Sándor Járóka (16 February 1922, Kisvárda — 11 April 1984, Budapest) was called the primas of kings. At his funeral in 1984 the Roma musicians of Budapest gathered; from that serenade the Budapest Gypsy Symphony Orchestra (100 Tagú Cigányzenekar) was born. His son, Sándor Járóka Jr (30 September 1954 — 18 September 2007), carried the orchestra. Lajos Boross (7 January 1925 — 8 July 2014, Budapest) led Lajos Boross and His Gypsy Band. Gyula “Toki” Horváth (17 September 1920, Kaposvár — 13 October 1971, Munich) was billed King of the Gypsies; first violin of the Rajkó Orchestra from 1931. Veres Lajos (1912–1981) and his orchestra recorded Gipsy Souvenirs (1953) for the French labels that later sat in the BnF collection — Hungarian, Romanian and Russian gypsy melodies. Lajos Kiss (Debrecen 1902 — Budapest 20 January 1951) was a violinist from his father’s orchestra, on the same primas lists.",
        ],
      },
      {
        heading: "How to hear it in Budapest",
        paragraphs: [
          "The living chair is often a restaurant, not a jazz club. Százéves Étterem still puts a Sárközy orchestra on in the evening. Kárpátia is the historic room where that line learned the job. For Django’s language in the same city, open the Gypsy Jazz Band, Canarro, Swing à la Django and the jams on the Hungary page. Both belong on the globe.",
        ],
      },
    ],
  },
];

const SUMMARY_NL: Record<string, { name: string; kicker: string; summary: string }> = {
  mirando: {
    name: "De familie Mirando",
    kicker: "Tata Mirando",
    summary:
      "Joseph Weiss, Tata Mirando (1895–1967), en het familie-orkest. Nederlands Sinti-huis: eerst viool, Hongaarse en Roemeense zang, en soms gypsy jazz.",
  },
  rosenberg: {
    name: "De familie Rosenberg",
    kicker: "Helmond",
    summary:
      "Nederlandse Sinti-gitaar uit Helmond. Stochelo, Nous’che en Nonnie maakten het Rosenberg Trio; Mozes, Jimmy en de volgende stoelen houden dezelfde taal.",
  },
  schafer: {
    name: "De familie Schäfer",
    kicker: "Gerwen · Nuenen",
    summary:
      "Nederlandse Sinti-gitaar uit hetzelfde Brabantse kamp als de Rosenbergs. Duitse Sinti-lijn. Paulus is de publieke stoel; Sendelo, Noah, Pupa en Ollie houden het huis.",
  },
  lorier: {
    name: "De familie Lorier",
    kicker: "Forbach",
    summary:
      "Forbach Manouche-gitaar. Favino Lorier is de publieke stoel — niet de Parijse Favino-bouwers. Ringo, Sandro en Renardo houden het huis. Zelfde stad als Schmitt en Winterstein.",
  },
  felix: {
    name: "De familie Félix",
    kicker: "Bourg-en-Bresse",
    summary:
      "Manouche-gitaar uit de Ain, richting Genève. Sébastien Félix (geb. 1971) en zijn broer Youri; Esteban, de zoon van Sébastien, houdt de bas.",
  },
  basily: {
    name: "De familie Basily",
    kicker: "Nederlandse Sinti · Manouche-wortels",
    summary:
      "Vijf generaties Nederlandse Sinti die hun wortels bij Franse Sinti (Manouche) leggen. De band van Popy Basily, daarna The Basily Boys.",
  },
  "gipsy-kings": {
    name: "Gipsy Kings — Reyes en Baliardo",
    kicker: "Arles · familiemuziek",
    summary:
      "Twee Gitano-huizen uit Arles en Montpellier: Reyes en Baliardo. Geen Django-kwintet — zoals Tata Mirando: familiemuziek die op deze hub overlapt. Nicolas Reyes en Tonino Baliardo dragen de naam nog.",
  },
  winterstein: {
    name: "De familie Winterstein",
    kicker: "Forbach · Elzas · Duitsland",
    summary:
      "De pompe aan twee kanten van de Rijn. Titi’s Duitse viool, Holzmano’s rhythm, Hono en Popots in Forbach, Benji en Brady nu.",
  },
  lakatos: {
    name: "De familie Lakatos",
    kicker: "Boedapest viool",
    summary:
      "Hongaarse Roma-viool. Oom Sándor was de beroemde primas; Roby Lakatos loopt dezelfde lijn de jazz, de klassiek en Django’s boek in.",
  },
  sarkozy: {
    name: "De familie Sárközy",
    kicker: "Százéves Étterem",
    summary:
      "Zeven generaties Hongaarse Roma-viool. Lajos Sárközy Jr — klassieke prijzen, de restaurantstoel, en avonden met de Rosenbergs.",
  },
  "hungarian-primas": {
    name: "Hongaarse primas-orkesten",
    kicker: "Járóka · Boross · Veres · Toki",
    summary:
      "De café- en restaurantviool van Boedapest: Sándor Járóka vader en zoon, Lajos Boross, Veres Lajos, Toki Horváth, Lajos Kiss. Namen die de familie Mirando nog speelt.",
  },
};

const SUMMARY_FR: Record<string, { name: string; kicker: string; summary: string }> = {
  reinhardt: {
    name: "La famille Reinhardt",
    kicker: "Django",
    summary:
      "Django Reinhardt et la maison manouche qui a donné son nom public à la musique. Joseph, Lousson, Babik — la famille ne s’arrête pas à la tombe.",
  },
  schafer: {
    name: "La famille Schäfer",
    kicker: "Gerwen · Nuenen",
    summary:
      "Guitare Sinti néerlandaise du même camp brabançon que les Rosenberg. Lignée Sinti allemande. Paulus est la chaise publique ; Sendelo, Noah, Pupa et Ollie tiennent la maison.",
  },
  "gipsy-kings": {
    name: "Gipsy Kings — Reyes et Baliardo",
    kicker: "Arles · musique de famille",
    summary:
      "Deux maisons gitanes d’Arles et Montpellier : Reyes et Baliardo. Pas le quintette de Django — comme Tata Mirando : musique de famille qui se recoupe ici. Nicolas Reyes et Tonino Baliardo portent encore le nom.",
  },
  schmitt: {
    name: "La famille Schmitt",
    kicker: "Alsace · Forbach",
    summary:
      "Dorado, Tchavolo, Samson, Amati, Bronson. Guitare et violon manouche d’Alsace — la famille qui n’a pas attendu une enseigne de café.",
  },
  lorier: {
    name: "La famille Lorier",
    kicker: "Forbach",
    summary:
      "Guitare manouche de Forbach. Favino Lorier est la chaise publique — pas l’atelier Favino de Paris. Ringo, Sandro et Renardo tiennent la maison. Même ville que Schmitt et Winterstein.",
  },
  felix: {
    name: "La famille Félix",
    kicker: "Bourg-en-Bresse",
    summary:
      "Guitare manouche de l’Ain, vers Genève. Sébastien Félix (né en 1971) et son frère Youri ; Esteban, le fils de Sébastien, tient la contrebasse.",
  },
  winterstein: {
    name: "La famille Winterstein",
    kicker: "Forbach · Alsace · Allemagne",
    summary:
      "La pompe des deux côtés du Rhin. Le violon allemand de Titi, le rythme de Holzmano, Hono et Popots à Forbach, Benji et Brady aujourd’hui.",
  },
};

const SUMMARY_DE: Record<string, { name: string; kicker: string; summary: string }> = {
  schnuckenack: {
    name: "Schnuckenack Reinhardt",
    kicker: "Deutscher Sinti-Geiger",
    summary:
      "Franz „Schnuckenack“ Reinhardt (1921–2006) brachte Sinti-Musik nach dem Krieg auf deutsche Konzertbühnen. Der Geigenstuhl der deutschen Wiederbelebung.",
  },
  winterstein: {
    name: "Die Familie Winterstein",
    kicker: "Forbach · Elsass · Deutschland",
    summary:
      "Die Pompe auf beiden Seiten des Rheins. Titis deutsche Geige, Holzmannos Rhythmus, Hono und Popots in Forbach, Benji und Brady jetzt.",
  },
};

export function familiesForCountry(country: string): Family[] {
  return FAMILIES.filter((family) => (family.countries ?? [family.country]).includes(country));
}

export function getFamily(slug: string): Family | undefined {
  return FAMILIES.find((family) => family.slug === slug);
}

export function familyCard(family: Family, locale: string) {
  const loc =
    locale === "nl"
      ? SUMMARY_NL[family.slug]
      : locale === "fr"
        ? SUMMARY_FR[family.slug]
        : locale === "de"
          ? SUMMARY_DE[family.slug]
          : undefined;
  return {
    ...family,
    name: loc?.name ?? family.name,
    kicker: loc?.kicker ?? family.kicker,
    summary: loc?.summary ?? family.summary,
  };
}

const FAMILY_ARCHIVE_TERMS: Record<string, string[]> = {
  mirando: ["mirando", "tata ", "weiss mirando", "loeila", "morschy", "meizel", "kokalo", "sonrisa"],
  rosenberg: ["rosenberg"],
  schafer: ["schafer", "schäfer", "shaffer", "pupa"],
  basily: ["basily"],
  reinhardt: ["django", "reinhardt"],
  "gipsy-kings": ["gipsy kings", "gypsy kings", "reyes", "baliardo", "manitas"],
  schmitt: ["schmitt", "latcho drom", "kali sara"],
  lorier: ["lorier", "favino lorier"],
  felix: ["sébastien félix", "sebastien felix", "esteban félix", "sinti swing", "youri félix"],
  schnuckenack: ["schnuckenack"],
  winterstein: ["winterstein"],
  lakatos: ["lakatos"],
  sarkozy: ["sarkozy", "sárközi", "sarkozi"],
  "hungarian-primas": [
    "jaroka",
    "járóka",
    "boros",
    "boross",
    "veres",
    "buffo",
    "gabora",
    "kallai",
    "youri farkas",
    "kis tyutyu",
    "toki",
    "lajos kiss",
    "tonte",
    "puporka",
    "horvath gyula",
    "santa ferenc",
  ],
};

export function familyArchiveTerms(slug: string): string[] {
  return FAMILY_ARCHIVE_TERMS[slug] ?? [slug];
}
