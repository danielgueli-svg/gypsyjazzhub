/** Django Reinhardt page copy. Follows the language switch. */

export type DjangoCopy = {
  kicker: string;
  based: string;
  bornLine: string;
  born: [string, string];
  instrument: [string, string];
  buried: [string, string];
  bioTitle: string;
  bio: string[];
  listenTitle: string;
  listen: [string, string][];
  addHeading: string;
  next: string;
  historyLink: string;
};

const EN: DjangoCopy = {
  kicker: "Solo guitar",
  based: "Based in France",
  bornLine: "Born Liberchies, Belgium · 23 January 1910 — 16 May 1953, Fontainebleau",
  born: ["Born", "Liberchies, Belgium"],
  instrument: ["Instrument", "Selmer-Maccaferri guitar"],
  buried: ["Buried", "Samois-sur-Seine"],
  bioTitle: "Biography",
  bio: [
    "Jean “Django” Reinhardt was born on 23 January 1910 in a caravan at Liberchies, Belgium, into a family of Manouche musicians. He grew up on the road between Belgium and France, and by his teens he was already working in the bals musette of Paris — banjo and guitar behind accordion, playing waltzes for dancers who did not need a conservatory name.",
    "On the night of 26 October 1928 a fire destroyed the caravan he shared with Bella, his first wife. He was eighteen. The burns took the use of the third and fourth fingers of his left hand. Doctors talked of amputation of a leg. He refused. The recovery was long. When he returned to the guitar he had to invent a technique around two functioning fingers: a new way to hold chords, a new way to run the fretboard, a sound that came out of limitation rather than despite it.",
    "In the early 1930s he met Stéphane Grappelli. In 1934 they recorded as the Quintette du Hot Club de France — an all-string swing group with no drums and no brass. Django’s brother Joseph often played rhythm. The Selmer-Maccaferri guitar, with its oval soundhole and projecting volume, became the instrument of the style. The records — Minor Swing, Djangology, Bricktop, Nuages — made a family music into an international language.",
    "War split the Quintette. Grappelli was in London and stayed. Django remained in occupied France, a Romani star in a country that was deporting Romani people. He survived. Nuages, from 1940, is the ballad of those years: still, singing, and played today wherever the music is taken seriously.",
    "In 1946 he toured the United States with Duke Ellington. The halls were mixed; the legend was not. Back in France he kept writing and recording, sometimes on electric guitar, always with that vocal lead line. He died of a brain haemorrhage on 16 May 1953, aged forty-three, near Fontainebleau. He is buried in Samois-sur-Seine, the village that later gave the music its festival.",
    "Every gypsy jazz guitarist since has had to decide what to do with those two fingers: copy them, extend them, or leave them behind. The pompe, the Selmer, the repertoire, the festival at Samois — they all run back to this life.",
  ],
  listenTitle: "Listen first",
  listen: [
    ["Minor Swing", "1937 · Quintette du Hot Club de France"],
    ["Nuages", "1940 · the wartime ballad"],
    ["Djangology", "1935 · the calling card"],
    ["Limehouse Blues", "with Grappelli, the fast ones"],
    ["Manoir de mes rêves", "late lyric Django"],
    ["I'll See You in My Dreams", "the two-finger run, full open"],
  ],
  addHeading: "Add to Django",
  next: "Next:",
  historyLink: "History of Gypsy Jazz and the Sinti",
};

const NL: DjangoCopy = {
  kicker: "Solgitaar",
  based: "Frankrijk",
  bornLine: "Geboren in Liberchies, België · 23 januari 1910 — 16 mei 1953, Fontainebleau",
  born: ["Geboren", "Liberchies, België"],
  instrument: ["Instrument", "Selmer-Maccaferri-gitaar"],
  buried: ["Begraven", "Samois-sur-Seine"],
  bioTitle: "Leven",
  bio: [
    "Jean “Django” Reinhardt werd geboren op 23 januari 1910 in een woonwagen in Liberchies, België, in een familie van Manouche-muzikanten. Hij groeide op onderweg tussen België en Frankrijk, en als tiener speelde hij al in de bals musette van Parijs — banjo en gitaar achter accordeon, walsen voor dansers die geen conservatoriumnaam nodig hadden.",
    "In de nacht van 26 oktober 1928 verwoestte een brand de woonwagen die hij deelde met Bella, zijn eerste vrouw. Hij was achttien. De brandwonden namen het gebruik van de derde en vierde vinger van zijn linkerhand. Artsen spraken over amputatie van een been. Hij weigerde. Het herstel duurde lang. Toen hij terugkwam bij de gitaar moest hij een techniek uitvinden rond twee werkende vingers: een nieuwe manier om akkoorden te houden, een nieuwe manier om over de toets te lopen, een geluid dat uit de beperking kwam, niet ondanks haar.",
    "In het begin van de jaren dertig ontmoette hij Stéphane Grappelli. In 1934 namen ze op als het Quintette du Hot Club de France — een swinggroep van alleen snaren, zonder drums en zonder koper. Django’s broer Joseph speelde vaak ritme. De Selmer-Maccaferri-gitaar, met ovale klankopening en groot volume, werd het instrument van de stijl. De platen — Minor Swing, Djangology, Bricktop, Nuages — maakten familiemuziek tot een internationale taal.",
    "De oorlog spleet het Quintette. Grappelli was in Londen en bleef. Django bleef in bezet Frankrijk, een Romani-ster in een land dat Romani-mensen deporteerde. Hij overleefde. Nuages, uit 1940, is de ballade van die jaren: stil, zingend, en gespeeld waar de muziek serieus genomen wordt.",
    "In 1946 toerde hij door de Verenigde Staten met Duke Ellington. De zalen waren wisselend; de legende niet. Terug in Frankrijk bleef hij schrijven en opnemen, soms op elektrische gitaar, altijd met die vocale leadlijn. Hij stierf aan een hersenbloeding op 16 mei 1953, drieënveertig jaar, bij Fontainebleau. Hij ligt begraven in Samois-sur-Seine, het dorp dat de muziek later haar festival gaf.",
    "Elke gypsy-jazzgitarist sindsdien heeft moeten beslissen wat hij met die twee vingers doet: ze kopiëren, ze verder tillen, of ze achterlaten. De pompe, de Selmer, het repertoire, het festival in Samois — ze lopen allemaal terug naar dit leven.",
  ],
  listenTitle: "Eerst luisteren",
  listen: [
    ["Minor Swing", "1937 · Quintette du Hot Club de France"],
    ["Nuages", "1940 · de oorlogsballade"],
    ["Djangology", "1935 · de visitekaart"],
    ["Limehouse Blues", "met Grappelli, de snelle"],
    ["Manoir de mes rêves", "late, lyrische Django"],
    ["I'll See You in My Dreams", "de twee-vinger-loop, wijd open"],
  ],
  addHeading: "Iets toevoegen bij Django",
  next: "Verder:",
  historyLink: "Geschiedenis van gypsy jazz en de Sinti",
};

const FR: DjangoCopy = {
  kicker: "Guitare solo",
  based: "En France",
  bornLine: "Né à Liberchies, Belgique · 23 janvier 1910 — 16 mai 1953, Fontainebleau",
  born: ["Né", "Liberchies, Belgique"],
  instrument: ["Instrument", "Guitare Selmer-Maccaferri"],
  buried: ["Inhumé", "Samois-sur-Seine"],
  bioTitle: "Biographie",
  bio: [
    "Jean « Django » Reinhardt naît le 23 janvier 1910 dans une roulotte à Liberchies, en Belgique, dans une famille de musiciens manouches. Il grandit sur les routes entre la Belgique et la France, et dès l’adolescence il joue dans les bals musette de Paris — banjo et guitare derrière l’accordéon, des valses pour des danseurs qui n’avaient pas besoin d’un nom de conservatoire.",
    "Dans la nuit du 26 octobre 1928, un incendie détruit la roulotte qu’il partage avec Bella, sa première femme. Il a dix-huit ans. Les brûlures lui prennent l’usage du troisième et du quatrième doigt de la main gauche. Les médecins parlent d’amputer une jambe. Il refuse. La convalescence est longue. Quand il revient à la guitare, il doit inventer une technique autour de deux doigts : une autre façon de tenir les accords, une autre façon de courir le manche, un son né de la limitation, pas malgré elle.",
    "Au début des années 1930 il rencontre Stéphane Grappelli. En 1934 ils enregistrent comme Quintette du Hot Club de France — un orchestre à cordes, sans batterie ni cuivres. Joseph, le frère de Django, tient souvent le rythme. La Selmer-Maccaferri, ouïe ovale et volume qui porte, devient l’instrument du style. Les disques — Minor Swing, Djangology, Bricktop, Nuages — font d’une musique de famille une langue internationale.",
    "La guerre sépare le Quintette. Grappelli est à Londres et y reste. Django reste en France occupée, une star romani dans un pays qui déporte les Romani. Il survit. Nuages, en 1940, est la ballade de ces années : calme, chantante, et jouée aujourd’hui partout où cette musique compte.",
    "En 1946 il tourne aux États-Unis avec Duke Ellington. Les salles sont inégales ; la légende ne l’est pas. De retour en France il continue d’écrire et d’enregistrer, parfois à la guitare électrique, toujours avec cette ligne vocale. Il meurt d’une hémorragie cérébrale le 16 mai 1953, à quarante-trois ans, près de Fontainebleau. Il est inhumé à Samois-sur-Seine, le village qui donnera plus tard son festival à la musique.",
    "Chaque guitariste de jazz manouche depuis a dû décider quoi faire de ces deux doigts : les copier, les prolonger, ou les laisser. La pompe, la Selmer, le répertoire, le festival de Samois — tout remonte à cette vie.",
  ],
  listenTitle: "Écouter d’abord",
  listen: [
    ["Minor Swing", "1937 · Quintette du Hot Club de France"],
    ["Nuages", "1940 · la ballade de guerre"],
    ["Djangology", "1935 · la carte de visite"],
    ["Limehouse Blues", "avec Grappelli, les morceaux rapides"],
    ["Manoir de mes rêves", "Django lyrique, plus tard"],
    ["I'll See You in My Dreams", "la course à deux doigts, grand ouvert"],
  ],
  addHeading: "Ajouter à Django",
  next: "Ensuite :",
  historyLink: "Histoire du gypsy jazz et des Sinti",
};

const DE: DjangoCopy = {
  kicker: "Solo-Gitarre",
  based: "In Frankreich",
  bornLine: "Geboren in Liberchies, Belgien · 23. Januar 1910 — 16. Mai 1953, Fontainebleau",
  born: ["Geboren", "Liberchies, Belgien"],
  instrument: ["Instrument", "Selmer-Maccaferri-Gitarre"],
  buried: ["Begraben", "Samois-sur-Seine"],
  bioTitle: "Leben",
  bio: [
    "Jean „Django“ Reinhardt wurde am 23. Januar 1910 in einem Wohnwagen in Liberchies, Belgien, in eine Familie manouche Musiker geboren. Er wuchs unterwegs zwischen Belgien und Frankreich auf und spielte als Jugendlicher schon in den bals musette von Paris — Banjo und Gitarre hinter dem Akkordeon, Walzer für Tänzer, die keinen Konservatoriumsnamen brauchten.",
    "In der Nacht zum 26. Oktober 1928 zerstörte ein Feuer den Wohnwagen, den er mit Bella, seiner ersten Frau, teilte. Er war achtzehn. Die Verbrennungen nahmen ihm den Gebrauch des dritten und vierten Fingers der linken Hand. Ärzte sprachen von der Amputation eines Beins. Er lehnte ab. Die Genesung dauerte lange. Als er zur Gitarre zurückkam, musste er eine Technik um zwei funktionierende Finger erfinden: eine neue Art, Akkorde zu greifen, eine neue Art, über das Griffbrett zu laufen, ein Klang, der aus der Einschränkung kam, nicht trotz ihr.",
    "Anfang der 1930er traf er Stéphane Grappelli. 1934 nahmen sie als Quintette du Hot Club de France auf — eine Swinggruppe nur aus Saiten, ohne Schlagzeug und ohne Blech. Djangos Bruder Joseph spielte oft Rhythmus. Die Selmer-Maccaferri mit ovalem Schallloch und tragender Lautstärke wurde das Instrument des Stils. Die Platten — Minor Swing, Djangology, Bricktop, Nuages — machten aus Familienmusik eine internationale Sprache.",
    "Der Krieg trennte das Quintette. Grappelli war in London und blieb. Django blieb im besetzten Frankreich, ein Romani-Star in einem Land, das Romani-Menschen deportierte. Er überlebte. Nuages, 1940, ist die Ballade jener Jahre: still, singend, und heute gespielt, wo diese Musik ernst genommen wird.",
    "1946 tourte er mit Duke Ellington durch die Vereinigten Staaten. Die Säle waren gemischt; die Legende nicht. Zurück in Frankreich schrieb und nahm er weiter auf, manchmal elektrisch, immer mit dieser gesungenen Leadlinie. Er starb am 16. Mai 1953 an einer Hirnblutung, dreiundvierzig Jahre alt, bei Fontainebleau. Er liegt in Samois-sur-Seine begraben, dem Dorf, das der Musik später ihr Festival gab.",
    "Jeder Gypsy-Jazz-Gitarrist seither musste entscheiden, was er mit diesen zwei Fingern tut: sie kopieren, sie weiterführen oder sie hinter sich lassen. Die Pompe, die Selmer, das Repertoire, das Festival in Samois — alles führt auf dieses Leben zurück.",
  ],
  listenTitle: "Zuerst hören",
  listen: [
    ["Minor Swing", "1937 · Quintette du Hot Club de France"],
    ["Nuages", "1940 · die Kriegsballade"],
    ["Djangology", "1935 · die Visitenkarte"],
    ["Limehouse Blues", "mit Grappelli, die schnellen"],
    ["Manoir de mes rêves", "später, lyrischer Django"],
    ["I'll See You in My Dreams", "der Zwei-Finger-Lauf, weit offen"],
  ],
  addHeading: "Zu Django hinzufügen",
  next: "Weiter:",
  historyLink: "Geschichte des Gypsy Jazz und der Sinti",
};

const ES: DjangoCopy = {
  kicker: "Guitarra solo",
  based: "En Francia",
  bornLine: "Nacido en Liberchies, Bélgica · 23 de enero de 1910 — 16 de mayo de 1953, Fontainebleau",
  born: ["Nacido", "Liberchies, Bélgica"],
  instrument: ["Instrumento", "Guitarra Selmer-Maccaferri"],
  buried: ["Enterrado", "Samois-sur-Seine"],
  bioTitle: "Biografía",
  bio: [
    "Jean “Django” Reinhardt nació el 23 de enero de 1910 en una caravana en Liberchies, Bélgica, en una familia de músicos manouches. Creció en la carretera entre Bélgica y Francia, y de adolescente ya tocaba en los bals musette de París — banjo y guitarra detrás del acordeón, valses para bailarines que no necesitaban un nombre de conservatorio.",
    "En la noche del 26 de octubre de 1928 un incendio destruyó la caravana que compartía con Bella, su primera mujer. Tenía dieciocho años. Las quemaduras le quitaron el uso del tercer y cuarto dedo de la mano izquierda. Los médicos hablaron de amputar una pierna. Él se negó. La recuperación fue larga. Cuando volvió a la guitarra tuvo que inventar una técnica alrededor de dos dedos: otra forma de sujetar los acordes, otra forma de recorrer el mástil, un sonido nacido de la limitación, no a pesar de ella.",
    "A principios de los años treinta conoció a Stéphane Grappelli. En 1934 grabaron como Quintette du Hot Club de France — un grupo de swing solo de cuerdas, sin batería ni metales. El hermano de Django, Joseph, tocaba a menudo el ritmo. La Selmer-Maccaferri, con boca oval y volumen que lleva, se convirtió en el instrumento del estilo. Los discos — Minor Swing, Djangology, Bricktop, Nuages — hicieron de una música de familia un idioma internacional.",
    "La guerra partió el Quintette. Grappelli estaba en Londres y se quedó. Django permaneció en la Francia ocupada, una estrella romaní en un país que deportaba a los romaníes. Sobrevivió. Nuages, de 1940, es la balada de aquellos años: quieta, cantada, y tocada hoy donde esta música se toma en serio.",
    "En 1946 recorrió Estados Unidos con Duke Ellington. Las salas fueron irregulares; la leyenda no. De vuelta en Francia siguió escribiendo y grabando, a veces con guitarra eléctrica, siempre con esa línea vocal. Murió de una hemorragia cerebral el 16 de mayo de 1953, a los cuarenta y tres años, cerca de Fontainebleau. Está enterrado en Samois-sur-Seine, el pueblo que más tarde dio a la música su festival.",
    "Cada guitarrista de gypsy jazz desde entonces ha tenido que decidir qué hacer con esos dos dedos: copiarlos, alargarlos o dejarlos atrás. La pompe, la Selmer, el repertorio, el festival de Samois — todo vuelve a esta vida.",
  ],
  listenTitle: "Escuchar primero",
  listen: [
    ["Minor Swing", "1937 · Quintette du Hot Club de France"],
    ["Nuages", "1940 · la balada de guerra"],
    ["Djangology", "1935 · la tarjeta de visita"],
    ["Limehouse Blues", "con Grappelli, los rápidos"],
    ["Manoir de mes rêves", "Django lírico, más tarde"],
    ["I'll See You in My Dreams", "la carrera de dos dedos, abierta"],
  ],
  addHeading: "Añadir a Django",
  next: "Siguiente:",
  historyLink: "Historia del gypsy jazz y los Sinti",
};

const PT: DjangoCopy = {
  kicker: "Guitarra solo",
  based: "Em França",
  bornLine: "Nascido em Liberchies, Bélgica · 23 de janeiro de 1910 — 16 de maio de 1953, Fontainebleau",
  born: ["Nascido", "Liberchies, Bélgica"],
  instrument: ["Instrumento", "Guitarra Selmer-Maccaferri"],
  buried: ["Enterrado", "Samois-sur-Seine"],
  bioTitle: "Biografia",
  bio: [
    "Jean “Django” Reinhardt nasceu a 23 de janeiro de 1910 numa roulotte em Liberchies, Bélgica, numa família de músicos manouches. Cresceu na estrada entre a Bélgica e a França, e na adolescência já tocava nos bals musette de Paris — banjo e guitarra atrás do acordeão, valsas para dançarinos que não precisavam de um nome de conservatório.",
    "Na noite de 26 de outubro de 1928 um incêndio destruiu a roulotte que partilhava com Bella, a primeira mulher. Tinha dezoito anos. As queimaduras tiraram-lhe o uso do terceiro e quarto dedos da mão esquerda. Os médicos falaram em amputar uma perna. Ele recusou. A recuperação foi longa. Quando voltou à guitarra teve de inventar uma técnica à volta de dois dedos: outra forma de segurar os acordes, outra forma de correr o braço, um som nascido da limitação, não apesar dela.",
    "No início dos anos 1930 encontrou Stéphane Grappelli. Em 1934 gravaram como Quintette du Hot Club de France — um grupo de swing só de cordas, sem bateria nem metais. O irmão de Django, Joseph, tocava muitas vezes o ritmo. A Selmer-Maccaferri, com boca oval e volume que leva, tornou-se o instrumento do estilo. Os discos — Minor Swing, Djangology, Bricktop, Nuages — fizeram de uma música de família uma língua internacional.",
    "A guerra partiu o Quintette. Grappelli estava em Londres e ficou. Django ficou na França ocupada, uma estrela romani num país que deportava romani. Sobreviveu. Nuages, de 1940, é a balada daqueles anos: quieta, cantada, e tocada hoje onde esta música é levada a sério.",
    "Em 1946 percorreu os Estados Unidos com Duke Ellington. As salas foram desiguais; a lenda não. De volta a França continuou a escrever e a gravar, por vezes na guitarra eléctrica, sempre com essa linha vocal. Morreu de uma hemorragia cerebral a 16 de maio de 1953, aos quarenta e três anos, perto de Fontainebleau. Está enterrado em Samois-sur-Seine, a aldeia que mais tarde deu à música o seu festival.",
    "Cada guitarrista de gypsy jazz desde então teve de decidir o que fazer com esses dois dedos: copiá-los, prolongá-los ou deixá-los. A pompe, a Selmer, o repertório, o festival de Samois — tudo volta a esta vida.",
  ],
  listenTitle: "Ouvir primeiro",
  listen: [
    ["Minor Swing", "1937 · Quintette du Hot Club de France"],
    ["Nuages", "1940 · a balada de guerra"],
    ["Djangology", "1935 · o cartão de visita"],
    ["Limehouse Blues", "com Grappelli, os rápidos"],
    ["Manoir de mes rêves", "Django lírico, mais tarde"],
    ["I'll See You in My Dreams", "a corrida de dois dedos, aberta"],
  ],
  addHeading: "Acrescentar a Django",
  next: "A seguir:",
  historyLink: "História do gypsy jazz e dos Sinti",
};

const IT: DjangoCopy = {
  kicker: "Chitarra solo",
  based: "In Francia",
  bornLine: "Nato a Liberchies, Belgio · 23 gennaio 1910 — 16 maggio 1953, Fontainebleau",
  born: ["Nato", "Liberchies, Belgio"],
  instrument: ["Strumento", "Chitarra Selmer-Maccaferri"],
  buried: ["Sepolto", "Samois-sur-Seine"],
  bioTitle: "Biografia",
  bio: [
    "Jean “Django” Reinhardt nasce il 23 gennaio 1910 in una roulotte a Liberchies, in Belgio, in una famiglia di musicisti manouches. Cresce sulla strada tra Belgio e Francia, e da adolescente suona già nei bals musette di Parigi — banjo e chitarra dietro la fisarmonica, valzer per ballerini che non avevano bisogno di un nome da conservatorio.",
    "Nella notte del 26 ottobre 1928 un incendio distrugge la roulotte che condivideva con Bella, la prima moglie. Ha diciotto anni. Le ustioni gli tolgono l’uso del terzo e quarto dito della mano sinistra. I medici parlano di amputare una gamba. Lui rifiuta. La convalescenza è lunga. Quando torna alla chitarra deve inventare una tecnica intorno a due dita: un altro modo di tenere gli accordi, un altro modo di correre la tastiera, un suono nato dal limite, non nonostante esso.",
    "All’inizio degli anni Trenta incontra Stéphane Grappelli. Nel 1934 registrano come Quintette du Hot Club de France — un gruppo swing di sole corde, senza batteria né ottoni. Il fratello Joseph tiene spesso il ritmo. La Selmer-Maccaferri, buca ovale e volume che porta, diventa lo strumento dello stile. I dischi — Minor Swing, Djangology, Bricktop, Nuages — fanno di una musica di famiglia una lingua internazionale.",
    "La guerra spezza il Quintette. Grappelli è a Londra e resta. Django resta nella Francia occupata, una star romanì in un paese che deporta i romanì. Sopravvive. Nuages, del 1940, è la ballata di quegli anni: ferma, cantata, e suonata oggi ovunque questa musica conta.",
    "Nel 1946 gira gli Stati Uniti con Duke Ellington. Le sale sono diseguali; la leggenda no. Tornato in Francia continua a scrivere e a registrare, a volte con la chitarra elettrica, sempre con quella linea vocale. Muore di emorragia cerebrale il 16 maggio 1953, a quarantatré anni, vicino a Fontainebleau. È sepolto a Samois-sur-Seine, il villaggio che più tardi darà alla musica il suo festival.",
    "Ogni chitarrista di gypsy jazz da allora ha dovuto decidere cosa fare di quelle due dita: copiarle, allungarle o lasciarle. La pompe, la Selmer, il repertorio, il festival di Samois — tutto torna a questa vita.",
  ],
  listenTitle: "Ascoltare prima",
  listen: [
    ["Minor Swing", "1937 · Quintette du Hot Club de France"],
    ["Nuages", "1940 · la ballata di guerra"],
    ["Djangology", "1935 · il biglietto da visita"],
    ["Limehouse Blues", "con Grappelli, i veloci"],
    ["Manoir de mes rêves", "Django lirico, più tardi"],
    ["I'll See You in My Dreams", "la corsa a due dita, aperta"],
  ],
  addHeading: "Aggiungere a Django",
  next: "Poi:",
  historyLink: "Storia del gypsy jazz e dei Sinti",
};

function listenNotes(
  nuages: string,
  djangology: string,
  limehouse: string,
  manoir: string,
  dreams: string,
): [string, string][] {
  return [
    ["Minor Swing", "1937 · Quintette du Hot Club de France"],
    ["Nuages", nuages],
    ["Djangology", djangology],
    ["Limehouse Blues", limehouse],
    ["Manoir de mes rêves", manoir],
    ["I'll See You in My Dreams", dreams],
  ];
}

const HU: DjangoCopy = {
  kicker: "Szólógitár",
  based: "Franciaország",
  bornLine: "Született Liberchies, Belgium · 1910. január 23. — 1953. május 16., Fontainebleau",
  born: ["Született", "Liberchies, Belgium"],
  instrument: ["Hangszer", "Selmer-Maccaferri gitár"],
  buried: ["Sírhely", "Samois-sur-Seine"],
  bioTitle: "Élete",
  bio: [
    "Jean „Django” Reinhardt 1910. január 23-án született egy kocsiban Liberchies-ben, Belgiumban, manouche zenészcsaládban. Belgium és Franciaország között nőtt fel az úton, és tinédzserként már a párizsi bals musette-ekben játszott — bendzsó és gitár az harmonika mögött, keringőknek táncosoknak, akiknek nem kellett konzervatóriumi név.",
    "1928. október 26-án éjjel tűz pusztította el a kocsit, amelyet Bellával, első feleségével osztott. Tizennyolc éves volt. Az égési sérülések elvették a bal kéz harmadik és negyedik ujjának használatát. Az orvosok egy láb amputációjáról beszéltek. Ő nemet mondott. A felépülés hosszú volt. Amikor visszatért a gitárhoz, két működő ujjra kellett technikát kitalálnia: más akkordfogás, más futás a fogólapon, egy hang, amely a korlátból jött, nem annak ellenére.",
    "Az 1930-as évek elején találkozott Stéphane Grappellivel. 1934-ben a Quintette du Hot Club de France-ként vettek fel — csupa húros swingegyüttes, dob és rézfúvó nélkül. Django öccse, Joseph gyakran tartotta a ritmust. A Selmer-Maccaferri, ovális hanglyukkal és hordozó hangerővel, a stílus hangszere lett. A lemezek — Minor Swing, Djangology, Bricktop, Nuages — családi zenéből nemzetközi nyelvet csináltak.",
    "A háború szétválasztotta a Quintette-et. Grappelli Londonban volt, és ott maradt. Django a megszállt Franciaországban maradt, romani sztár egy országban, amely romani embereket deportált. Túlélte. A Nuages, 1940-ből, azoknak az éveknek a balladája: csendes, éneklő, és ma is játsszák, ahol ezt a zenét komolyan veszik.",
    "1946-ban Duke Ellingtonnal turnézott az Egyesült Államokban. A termek vegyesek voltak; a legenda nem. Visszatérve Franciaországba tovább írt és felvett, néha elektromos gitáron, mindig azzal az énekes szólammal. 1953. május 16-án agyvérzésben halt meg, negyvenhárom évesen, Fontainebleau közelében. Samois-sur-Seine-ben nyugszik, a faluban, amely később a zenének a fesztiválját adta.",
    "Minden gypsy-jazz gitáros azóta eldöntötte, mit kezd azokkal a két ujjal: másolja, továbbviszi, vagy maga mögött hagyja. A pompe, a Selmer, a repertoár, a samois-i fesztivál — mind ehhez az élethez vezet vissza.",
  ],
  listenTitle: "Először hallgasd",
  listen: listenNotes("1940 · a háborús ballada", "1935 · a névjegykártya", "Grappellivel, a gyorsak", "késői, lírai Django", "a kétujjas futás, tágra nyitva"),
  addHeading: "Hozzáadás Djangóhoz",
  next: "Tovább:",
  historyLink: "A gypsy jazz és a Sinti története",
};

const PL: DjangoCopy = {
  kicker: "Gitara solo",
  based: "We Francji",
  bornLine: "Urodzony w Liberchies, Belgia · 23 stycznia 1910 — 16 maja 1953, Fontainebleau",
  born: ["Urodzony", "Liberchies, Belgia"],
  instrument: ["Instrument", "Gitara Selmer-Maccaferri"],
  buried: ["Pochowany", "Samois-sur-Seine"],
  bioTitle: "Życiorys",
  bio: [
    "Jean „Django” Reinhardt urodził się 23 stycznia 1910 w wozie w Liberchies w Belgii, w rodzinie muzyków manouche. Dorastał w drodze między Belgią a Francją i jako nastolatek grał już w bals musette Paryża — banjo i gitara za akordeonem, walce dla tancerzy, którzy nie potrzebowali nazwy konserwatorium.",
    "W nocy 26 października 1928 pożar zniszczył wóz, który dzielił z Bellą, pierwszą żoną. Miał osiemnaście lat. Oparzenia zabrały mu użycie trzeciego i czwartego palca lewej ręki. Lekarze mówili o amputacji nogi. Odmówił. Dochodzenie do siebie trwało długo. Gdy wrócił do gitary, musiał wymyślić technikę wokół dwóch palców: inny sposób trzymania akordów, inny bieg po gryfie, dźwięk z ograniczenia, nie mimo niego.",
    "Na początku lat 30. poznał Stéphane’a Grappelliego. W 1934 nagrali jako Quintette du Hot Club de France — swingowy zespół samych strun, bez perkusji i blachy. Brat Django, Joseph, często trzymał rytm. Selmer-Maccaferri z owalnym otworem i nośną głośnością stała się instrumentem stylu. Płyty — Minor Swing, Djangology, Bricktop, Nuages — zrobiły z muzyki rodzinnej język międzynarodowy.",
    "Wojna rozdzieliła Quintette. Grappelli był w Londynie i został. Django został w okupowanej Francji, romską gwiazdą w kraju, który deportował Romów. Przetrwał. Nuages z 1940 to ballada tamtych lat: cicha, śpiewająca, grana dziś tam, gdzie tę muzykę traktuje się poważnie.",
    "W 1946 tournée po Stanach z Duke’em Ellingtonem. Sale były nierówne; legenda nie. We Francji pisał i nagrywał dalej, czasem na gitarze elektrycznej, zawsze z tamtą wokalną linią. Zmarł na wylew 16 maja 1953, w wieku czterdziestu trzech lat, koło Fontainebleau. Leży w Samois-sur-Seine, wsi, która później dała muzyce festiwal.",
    "Każdy gitarzysta gypsy jazz od tamtej pory musiał zdecydować, co zrobić z tymi dwoma palcami: skopiować, rozwinąć albo zostawić. Pompe, Selmer, repertuar, festiwal w Samois — wszystko wraca do tego życia.",
  ],
  listenTitle: "Najpierw posłuchaj",
  listen: listenNotes("1940 · wojenna ballada", "1935 · wizytówka", "z Grappellim, szybkie", "późny, liryczny Django", "bieg dwoma palcami, szeroko"),
  addHeading: "Dodaj do Djangą",
  next: "Dalej:",
  historyLink: "Historia gypsy jazzu i Sinti",
};

const CS: DjangoCopy = {
  kicker: "Sólo kytara",
  based: "Ve Francii",
  bornLine: "Narozen v Liberchies, Belgie · 23. ledna 1910 — 16. května 1953, Fontainebleau",
  born: ["Narozen", "Liberchies, Belgie"],
  instrument: ["Nástroj", "Kytara Selmer-Maccaferri"],
  buried: ["Pohřben", "Samois-sur-Seine"],
  bioTitle: "Život",
  bio: [
    "Jean „Django“ Reinhardt se narodil 23. ledna 1910 ve voze v Liberchies v Belgii, v rodině manouche hudebníků. Vyrostl na cestě mezi Belgií a Francií a jako teenager už hrál v pařížských bals musette — banjo a kytara za akordeonem, valčíky pro tanečníky, kteří nepotřebovali jméno konzervatoře.",
    "V noci 26. října 1928 oheň zničil vůz, který sdílel s Bellou, první ženou. Bylo mu osmnáct. Popáleniny mu vzaly použití třetího a čtvrtého prstu levé ruky. Lékaři mluvili o amputaci nohy. Odmítl. Zotavení trvalo dlouho. Když se vrátil ke kytaře, musel vymyslet techniku kolem dvou prstů: jiný způsob akordů, jiný běh po hmatníku, zvuk z omezení, ne navzdory němu.",
    "Začátkem třicátých let potkal Stéphana Grappelliho. V roce 1934 nahráli jako Quintette du Hot Club de France — swingová skupina jen ze strun, bez bicích a žesťů. Bratr Joseph často držel rytmus. Selmer-Maccaferri s oválným otvorem se stala nástrojem stylu. Desky — Minor Swing, Djangology, Bricktop, Nuages — udělaly z rodinné hudby mezinárodní jazyk.",
    "Válka rozdělila Quintette. Grappelli byl v Londýně a zůstal. Django zůstal v okupované Francii, romská hvězda v zemi, která Romy deportovala. Přežil. Nuages z roku 1940 je balada těch let: tichá, zpívající, hraná dnes tam, kde se tahle hudba bere vážně.",
    "V roce 1946 jel s Duke Ellingtonem po Spojených státech. Sály byly různé; legenda ne. Ve Francii psal a nahrával dál, někdy na elektrickou kytaru, vždy s tou zpívanou linkou. Zemřel na krvácení do mozku 16. května 1953, ve třiačtyřiceti, u Fontainebleau. Leží v Samois-sur-Seine, vesnici, která hudbě později dala festival.",
    "Každý kytarista gypsy jazzu od té doby musel rozhodnout, co s těmi dvěma prsty: kopírovat, protáhnout, nebo nechat. Pompe, Selmer, repertoár, festival v Samois — všechno se vrací k tomuto životu.",
  ],
  listenTitle: "Nejdřív poslechnout",
  listen: listenNotes("1940 · válečná balada", "1935 · vizitka", "s Grappellim, rychlé", "pozdní, lyrický Django", "běh dvěma prsty, otevřeně"),
  addHeading: "Přidat k Djangovi",
  next: "Dál:",
  historyLink: "Dějiny gypsy jazzu a Sintů",
};

const RO: DjangoCopy = {
  kicker: "Chitară solo",
  based: "În Franța",
  bornLine: "Născut la Liberchies, Belgia · 23 ianuarie 1910 — 16 mai 1953, Fontainebleau",
  born: ["Născut", "Liberchies, Belgia"],
  instrument: ["Instrument", "Chitară Selmer-Maccaferri"],
  buried: ["Înmormântat", "Samois-sur-Seine"],
  bioTitle: "Viața",
  bio: [
    "Jean „Django” Reinhardt s-a născut pe 23 ianuarie 1910 într-o rulotă la Liberchies, Belgia, într-o familie de muzicieni manouche. A crescut pe drum între Belgia și Franța și ca adolescent cânta deja în bals musette din Paris — banjo și chitară după acordeon, valsuri pentru dansatori care nu aveau nevoie de un nume de conservator.",
    "În noaptea de 26 octombrie 1928 un incendiu a distrus rulota pe care o împărțea cu Bella, prima soție. Avea optsprezece ani. Arsurile i-au luat folosirea degetului trei și patru de la mâna stângă. Medicii vorbeau de amputarea unui picior. A refuzat. Recăpătarea a durat mult. Când s-a întors la chitară a trebuit să inventeze o tehnică în jurul a două degete: alt fel de a ține acordurile, alt fel de a alerga pe grif, un sunet născut din limită, nu în ciuda ei.",
    "La începutul anilor 1930 l-a întâlnit pe Stéphane Grappelli. În 1934 au înregistrat ca Quintette du Hot Club de France — un grup de swing numai din corzi, fără tobe și fără alămuri. Fratele Joseph ținea adesea ritmul. Selmer-Maccaferri, cu gură ovală, a devenit instrumentul stilului. Discurile — Minor Swing, Djangology, Bricktop, Nuages — au făcut dintr-o muzică de familie o limbă internațională.",
    "Războiul a despărțit Quintette-ul. Grappelli era la Londra și a rămas. Django a rămas în Franța ocupată, o stea romani într-o țară care deporta romani. A supraviețuit. Nuages, din 1940, e balada acelor ani: liniștită, cântată, și cântată azi unde muzica aceasta e luată în serios.",
    "În 1946 a turnat Statele Unite cu Duke Ellington. Sălile au fost inegale; legenda nu. Înapoi în Franța a scris și a înregistrat mai departe, uneori pe chitară electrică, mereu cu acea linie vocală. A murit de o hemoragie cerebrală pe 16 mai 1953, la patruzeci și trei de ani, lângă Fontainebleau. E înmormântat la Samois-sur-Seine, satul care mai târziu a dat muzicii festivalul.",
    "Fiecare chitarist de gypsy jazz de atunci a trebuit să decidă ce face cu cele două degete: să le copieze, să le prelungească sau să le lase. Pompe, Selmer, repertoriul, festivalul de la Samois — totul se întoarce la viața aceasta.",
  ],
  listenTitle: "Ascultă întâi",
  listen: listenNotes("1940 · balada de război", "1935 · cartea de vizită", "cu Grappelli, cele rapide", "Django liric, mai târziu", "cursa cu două degete, deschisă"),
  addHeading: "Adaugă la Django",
  next: "Apoi:",
  historyLink: "Istoria gypsy jazz-ului și a Sinti",
};

const SR: DjangoCopy = {
  kicker: "Solo gitara",
  based: "U Francuskoj",
  bornLine: "Rođen u Liberchiesu, Belgija · 23. januar 1910 — 16. maj 1953, Fontainebleau",
  born: ["Rođen", "Liberchies, Belgija"],
  instrument: ["Instrument", "Gitara Selmer-Maccaferri"],
  buried: ["Sahranjen", "Samois-sur-Seine"],
  bioTitle: "Život",
  bio: [
    "Jean „Django” Reinhardt rođen je 23. januara 1910. u kolima u Liberchiesu u Belgiji, u porodici manouche muzičara. Odrastao je na putu između Belgije i Francuske i kao tinejdžer već je svirao u pariskim bals musette — bendžo i gitara iza harmonike, valceri za plesače kojima nije trebalo ime konzervatorijuma.",
    "U noći 26. oktobra 1928. požar je uništio kola koja je delio sa Bellom, prvom ženom. Imao je osamnaest godina. Opekotine su mu oduzele treći i četvrti prst leve ruke. Lekari su govorili o amputaciji noge. Odbio je. Oporavak je bio dug. Kad se vratio gitari, morao je da izmisliti tehniku oko dva prsta: drugi način akorda, drugi trk po vratu, zvuk iz ograničenja, ne uprkos njemu.",
    "Početkom tridesetih sreo je Stéphanea Grappellija. 1934. snimili su kao Quintette du Hot Club de France — sving grupa samo od žica, bez bubnjeva i lima. Brat Joseph često je držao ritam. Selmer-Maccaferri s ovalnim otvorom postala je instrument stila. Ploče — Minor Swing, Djangology, Bricktop, Nuages — od porodične muzike napravile su međunarodni jezik.",
    "Rat je razdvojio Quintette. Grappelli je bio u Londonu i ostao. Django je ostao u okupiranoj Francuskoj, romska zvezda u zemlji koja je deportovala Rome. Preživeo je. Nuages iz 1940. je balada tih godina: tiha, pevana, i svira se danas gde se ova muzika uzima ozbiljno.",
    "1946. je s Duke Ellingtonom išao po Sjedinjenim Državama. Sale su bile različite; legenda nije. U Francuskoj je pisao i snimao dalje, ponekad na električnoj gitari, uvek s tom vokalnom linijom. Umro je od moždanog krvarenja 16. maja 1953, u četrdeset trećoj, kod Fontainebleaua. Leži u Samois-sur-Seine, selu koje je muzici kasnije dalo festival.",
    "Svaki gitarista gypsy džeza od tada mora da odluči šta s ta dva prsta: da ih kopira, produži ili ostavi. Pompe, Selmer, repertoar, festival u Samoau — sve se vraća na ovaj život.",
  ],
  listenTitle: "Prvo poslušaj",
  listen: listenNotes("1940 · ratna balada", "1935 · vizit karta", "sa Grappellijem, brzi", "kasni, lirski Django", "trk s dva prsta, otvoreno"),
  addHeading: "Dodaj Djangou",
  next: "Dalje:",
  historyLink: "Istorija gypsy džeza i Sintija",
};

const HR: DjangoCopy = {
  ...SR,
  kicker: "Solo gitara",
  based: "U Francuskoj",
  bornLine: "Rođen u Liberchiesu, Belgija · 23. siječnja 1910. — 16. svibnja 1953., Fontainebleau",
  born: ["Rođen", "Liberchies, Belgija"],
  bioTitle: "Život",
  bio: [
    "Jean „Django” Reinhardt rođen je 23. siječnja 1910. u kolima u Liberchiesu u Belgiji, u obitelji manouche glazbenika. Odrastao je na putu između Belgije i Francuske i kao tinejdžer već je svirao u pariškim bals musette — bendžo i gitara iza harmonike, valceri za plesače kojima nije trebalo ime konzervatorija.",
    "U noći 26. listopada 1928. požar je uništio kola koja je dijelio s Bellom, prvom ženom. Imao je osamnaest godina. Opekline su mu oduzele treći i četvrti prst lijeve ruke. Liječnici su govorili o amputaciji noge. Odbio je. Oporavak je bio dug. Kad se vratio gitari, morao je izmisliti tehniku oko dva prsta: drugi način akorda, drugi trk po vratu, zvuk iz ograničenja, ne usprkos njemu.",
    "Početkom tridesetih sreo je Stéphanea Grappellija. 1934. snimili su kao Quintette du Hot Club de France — swing grupa samo od žica, bez bubnjeva i lima. Brat Joseph često je držao ritam. Selmer-Maccaferri s ovalnim otvorom postala je instrument stila. Ploče — Minor Swing, Djangology, Bricktop, Nuages — od obiteljske glazbe napravile su međunarodni jezik.",
    "Rat je razdvojio Quintette. Grappelli je bio u Londonu i ostao. Django je ostao u okupiranoj Francuskoj, romska zvijezda u zemlji koja je deportirala Rome. Preživio je. Nuages iz 1940. je balada tih godina: tiha, pjevana, i svira se danas gdje se ova glazba uzima ozbiljno.",
    "1946. je s Duke Ellingtonom išao po Sjedinjenim Državama. Dvorane su bile različite; legenda nije. U Francuskoj je pisao i snimao dalje, ponekad na električnoj gitari, uvijek s tom vokalnom linijom. Umro je od moždanog krvarenja 16. svibnja 1953., u četrdeset trećoj, kod Fontainebleaua. Leži u Samois-sur-Seine, selu koje je glazbi kasnije dalo festival.",
    "Svaki gitarist gypsy jazza od tada mora odlučiti što s ta dva prsta: kopirati ih, produžiti ili ostaviti. Pompe, Selmer, repertoar, festival u Samoisu — sve se vraća na ovaj život.",
  ],
  listenTitle: "Prvo poslušaj",
  listen: listenNotes("1940 · ratna balada", "1935 · vizitka", "s Grappellijem, brzi", "kasni, lirski Django", "trk s dva prsta, otvoreno"),
  addHeading: "Dodaj Djangou",
  next: "Dalje:",
  historyLink: "Povijest gypsy jazza i Sintija",
};

const RU: DjangoCopy = {
  kicker: "Соло-гитара",
  based: "Франция",
  bornLine: "Родился в Либерши, Бельгия · 23 января 1910 — 16 мая 1953, Фонтенбло",
  born: ["Родился", "Либерши, Бельгия"],
  instrument: ["Инструмент", "Гитара Selmer-Maccaferri"],
  buried: ["Похоронен", "Samois-sur-Seine"],
  bioTitle: "Жизнь",
  bio: [
    "Жан «Джанго» Рейнхардт родился 23 января 1910 года в кибитке в Либерши, Бельгия, в семье музыкантов-мануш. Он вырос в дороге между Бельгией и Францией и подростком уже играл в парижских bals musette — банджо и гитара за аккордеоном, вальсы для танцоров, которым не нужно было имя консерватории.",
    "В ночь на 26 октября 1928 пожар уничтожил кибитку, которую он делил с Беллой, первой женой. Ему было восемнадцать. Ожоги отняли третий и четвёртый пальцы левой руки. Врачи говорили об ампутации ноги. Он отказался. Восстановление было долгим. Вернувшись к гитаре, он выдумал технику вокруг двух пальцев: другой хват аккордов, другой бег по грифу, звук из ограничения, а не вопреки ему.",
    "В начале 1930-х он встретил Стефана Граппелли. В 1934 они записались как Quintette du Hot Club de France — свинговый ансамбль одних струн, без ударных и меди. Брат Жозеф часто держал ритм. Selmer-Maccaferri с овальной розеткой стала инструментом стиля. Пластинки — Minor Swing, Djangology, Bricktop, Nuages — сделали семейную музыку международным языком.",
    "Война разделила квинтет. Граппелли был в Лондоне и остался. Джанго остался в оккупированной Франции, цыганская звезда в стране, которая депортировала рома. Он выжил. Nuages 1940 года — баллада тех лет: тихая, поющая, и её играют сегодня там, где эту музыку принимают всерьёз.",
    "В 1946 он ездил по США с Дюком Эллингтоном. Залы были разными; легенда — нет. Во Франции он писал и записывался дальше, иногда на электрогитаре, всегда с той вокальной линией. Умер от кровоизлияния в мозг 16 мая 1953, в сорок три года, близ Фонтенбло. Похоронен в Самуа-сюр-Сен, деревне, которая позже дала музыке фестиваль.",
    "Каждый гитарист gypsy jazz с тех пор решает, что делать с этими двумя пальцами: копировать, продолжать или оставить. Помпа, Selmer, репертуар, фестиваль в Самуа — всё ведёт к этой жизни.",
  ],
  listenTitle: "Сначала послушать",
  listen: listenNotes("1940 · военная баллада", "1935 · визитная карточка", "с Граппелли, быстрые", "поздний лирический Джанго", "пробег двумя пальцами, нараспашку"),
  addHeading: "Добавить к Джанго",
  next: "Дальше:",
  historyLink: "История gypsy jazz и синти",
};

const JA: DjangoCopy = {
  kicker: "ソロギター",
  based: "フランス",
  bornLine: "ベルギー・リベルシ生まれ · 1910年1月23日 — 1953年5月16日、フォンテーヌブロー",
  born: ["誕生", "ベルギー、リベルシ"],
  instrument: ["楽器", "セルマー＝マッカフェリ・ギター"],
  buried: ["埋葬", "サモア＝シュル＝セーヌ"],
  bioTitle: "生涯",
  bio: [
    "ジャン「ジャンゴ」ラインハルトは1910年1月23日、ベルギーのリベルシの荷車で、マヌーシュの音楽家の家に生まれた。ベルギーとフランスのあいだの路上で育ち、十代ですでにパリのバル・ミュゼットで弾いていた——アコーディオンの後ろのバンジョーとギター、音楽院の名前を必要としない踊り手のためのワルツ。",
    "1928年10月26日の夜、最初の妻ベラと暮らしていた荷車が火事で焼けた。十八歳。火傷で左手の薬指と小指が使えなくなった。医者は脚の切断を話した。彼は拒んだ。回復は長かった。ギターに戻ったとき、動く二本の指のまわりに技法を発明しなければならなかった。コードの押さえ方、指板の走り方、制約から出た音——制約にもかかわらずではない。",
    "1930年代初頭、ステファン・グラッペリに会う。1934年、カンテット・デュ・ホット・クラブ・ド・フランスとして録音する——ドラムも金管もない弦だけのスウィング。弟ジョゼフがしばしばリズムを支えた。楕円のサウンドホールを持つセルマー＝マッカフェリがこの流儀の楽器になった。Minor Swing、Djangology、Bricktop、Nuages——家族の音楽を国際語にしたレコード。",
    "戦争がカンテットを裂いた。グラッペリはロンドンにいて、そこに残った。ジャンゴは占領下のフランスに残った。ロマを追放する国のロマのスター。彼は生き延びた。1940年のNuagesは、その年のバラードだ。静かで、歌い、今もこの音楽が真剣に扱われるところで弾かれる。",
    "1946年、デューク・エリントンとアメリカを回った。ホールはまちまちだった。伝説はそうではなかった。フランスに戻り、書き、録音し続けた。時にはエレキで、いつもあの歌うリードで。1953年5月16日、脳出血で死んだ。四十三歳、フォンテーヌブローの近く。サモア＝シュル＝セーヌに葬られている。のちにこの音楽に祭りを与えた村だ。",
    "それ以来、すべてのジプシージャズ・ギタリストは、その二本の指をどうするか決めなければならなかった。写すか、伸ばすか、置いていくか。ポンプ、セルマー、レパートリー、サモアの祭り——すべてこの生涯に戻る。",
  ],
  listenTitle: "まず聴く",
  listen: listenNotes("1940 · 戦時のバラード", "1935 · 名刺", "グラッペリと、速い曲", "晩年の抒情的ジャンゴ", "二本指の走り、大きく開いて"),
  addHeading: "ジャンゴに追加",
  next: "次:",
  historyLink: "ジプシージャズとシンティの歴史",
};

const KO: DjangoCopy = {
  kicker: "솔로 기타",
  based: "프랑스",
  bornLine: "벨기에 리베르시 출생 · 1910년 1월 23일 — 1953년 5월 16일, 퐁텐블로",
  born: ["출생", "벨기에 리베르시"],
  instrument: ["악기", "셀머-마카페리 기타"],
  buried: ["묘", "사모아쉬르센"],
  bioTitle: "생애",
  bio: [
    "장 “장고” 라인하르트는 1910년 1월 23일 벨기에 리베르시의 마차에서 마누슈 음악가 집안에 태어났다. 벨기에와 프랑스 사이 길 위에서 자랐고, 십대에 이미 파리의 발 뮤제트에서 연주했다 — 아코디언 뒤의 밴조와 기타, 음악원 이름이 필요 없는 춤꾼들을 위한 왈츠.",
    "1928년 10월 26일 밤, 첫 아내 벨라와 쓰던 마차가 불에 탔다. 열여덟이었다. 화상으로 왼손 약지와 새끼손가락을 쓰지 못하게 됐다. 의사들은 다리 절단을 말했다. 그는 거절했다. 회복은 길었다. 기타로 돌아왔을 때 움직이는 두 손가락을 중심으로 기법을 만들어야 했다. 코드를 잡는 법, 지판을 달리는 법, 한계에서 나온 소리 — 한계에도 불구하고가 아니라.",
    "1930년대 초 스테판 그라펠리를 만났다. 1934년 캥테트 뒤 오 클럽 드 프랑스라는 이름으로 녹음했다 — 드럼도 금관도 없는 현만의 스윙. 동생 조제프가 자주 리듬을 잡았다. 타원 사운드홀의 셀머-마카페리가 이 스타일의 악기가 됐다. Minor Swing, Djangology, Bricktop, Nuages — 가족 음악을 국제 언어로 만든 음반.",
    "전쟁이 캥테트를 갈랐다. 그라펠리는 런던에 있었고 그곳에 남았다. 장고는 점령된 프랑스에 남았다. 로마를 추방하는 나라의 로마 스타. 그는 살아남았다. 1940년의 Nuages는 그 시절의 발라드다. 고요하고, 노래하고, 이 음악을 진지하게 여기는 곳에서 오늘도 연주된다.",
    "1946년 듀크 엘링턴과 미국을 돌았다. 홀은 들쑥날쑥했다. 전설은 아니었다. 프랑스로 돌아와 쓰고 녹음했다. 가끔은 일렉트릭으로, 언제나 그 노래하는 리드로. 1953년 5월 16일 뇌출혈로 죽었다. 마흔셋, 퐁텐블로 근처. 사모아쉬르센에 묻혀 있다. 나중에 이 음악에 축제를 준 마을이다.",
    "그 뒤로 모든 집시 재즈 기타리스트는 그 두 손가락을 어떻게 할지 정해야 했다. 베낄지, 이을지, 둘지. 폼프, 셀머, 레퍼토리, 사모아 축제 — 모두 이 삶으로 돌아간다.",
  ],
  listenTitle: "먼저 듣기",
  listen: listenNotes("1940 · 전시 발라드", "1935 · 명함", "그라펠리와, 빠른 곡", "만년의 서정 장고", "두 손가락 런, 활짝"),
  addHeading: "장고에 더하기",
  next: "다음:",
  historyLink: "집시 재즈와 신티의 역사",
};

const ZH: DjangoCopy = {
  kicker: "独奏吉他",
  based: "法国",
  bornLine: "生于比利时利贝尔希 · 1910年1月23日 — 1953年5月16日，枫丹白露",
  born: ["出生", "比利时利贝尔希"],
  instrument: ["乐器", "Selmer-Maccaferri 吉他"],
  buried: ["安葬", "塞纳河畔萨穆瓦"],
  bioTitle: "生平",
  bio: [
    "让·“姜戈”·莱因哈特于1910年1月23日出生在比利时利贝尔希的一辆大篷车里，马努什乐手家庭。他在比利时与法国之间的路上长大，十几岁就在巴黎的 bals musette 里弹——手风琴后面的班卓和吉他，给不需要音乐学院名字的舞者跳华尔兹。",
    "1928年10月26日夜里，一场火烧毁了他与第一任妻子贝拉合住的大篷车。他十八岁。烧伤使他左手无名指和小指无法使用。医生谈到截肢。他拒绝了。恢复很长。回到吉他时，他必须围着两根能用的手指发明一套技法：另一种按和弦的方法，另一种跑指板的方法，从限制里出来的声音，而不是尽管有限制。",
    "1930年代初他遇见斯特凡·格拉佩利。1934年他们以法国热俱乐部五重奏录音——全是弦乐的摇摆，没有鼓，没有铜管。弟弟约瑟夫常弹节奏。椭圆音孔、声音能送出去的 Selmer-Maccaferri，成了这个风格的乐器。Minor Swing、Djangology、Bricktop、Nuages——把家族音乐变成了国际语言。",
    "战争拆开了五重奏。格拉佩利在伦敦，留下了。姜戈留在被占领的法国，一个驱逐罗姆人的国家里的罗姆明星。他活了下来。1940年的 Nuages 是那些年的叙事曲：静、唱，今天凡是认真对待这音乐的地方都在弹。",
    "1946年他与艾灵顿公爵在美国巡演。厅堂参差；传说不是。回法国后继续写、录，有时用电吉他，始终是那条会唱歌的主音线。1953年5月16日脑出血去世，四十三岁，枫丹白露附近。葬在塞纳河畔萨穆瓦，后来把节日给了这音乐的村子。",
    "此后每个吉普赛爵士吉他手都得决定拿那两根手指怎么办：模仿、延伸，还是放下。泵奏、Selmer、曲目、萨穆瓦音乐节——都回到这一生。",
  ],
  listenTitle: "先听这些",
  listen: listenNotes("1940 · 战时叙事曲", "1935 · 名片", "与格拉佩利，快的那些", "晚年抒情姜戈", "两指快跑，完全打开"),
  addHeading: "给姜戈添加",
  next: "接下来：",
  historyLink: "吉普赛爵士与辛提人的历史",
};

const ZH_TW: DjangoCopy = {
  kicker: "獨奏吉他",
  based: "法國",
  bornLine: "生於比利時利貝爾希 · 1910年1月23日 — 1953年5月16日，楓丹白露",
  born: ["出生", "比利時利貝爾希"],
  instrument: ["樂器", "Selmer-Maccaferri 吉他"],
  buried: ["安葬", "塞納河畔薩穆瓦"],
  bioTitle: "生平",
  bio: [
    "尚·「姜戈」·萊因哈特於1910年1月23日出生在比利時利貝爾希的一輛大篷車裡，馬努什樂手家庭。他在比利時與法國之間的路上長大，十幾歲就在巴黎的 bals musette 裡彈——手風琴後面的班卓與吉他，給不需要音樂院名字的舞者跳華爾滋。",
    "1928年10月26日夜裡，一場火燒毀了他與第一任妻子貝拉合住的大篷車。他十八歲。燒傷使他左手無名指與小指無法使用。醫生談到截肢。他拒絕了。恢復很長。回到吉他時，他必須圍著兩根能用的手指發明一套技法：另一種按和弦的方法，另一種跑指板的方法，從限制裡出來的聲音，而不是儘管有限制。",
    "1930年代初他遇見斯特凡·格拉佩利。1934年他們以法國熱俱樂部五重奏錄音——全是弦樂的搖擺，沒有鼓，沒有銅管。弟弟約瑟夫常彈吉他節奏。橢圓音孔、聲音能送出去的 Selmer-Maccaferri，成了這個風格的樂器。Minor Swing、Djangology、Bricktop、Nuages——把家族音樂變成了國際語言。",
    "戰爭拆開了五重奏。格拉佩利在倫敦，留下了。姜戈留在被占領的法國，一個驅逐羅姆人的國家裡的羅姆明星。他活了下來。1940年的 Nuages 是那些年的敘事曲：靜、唱，今天凡是認真對待這音樂的地方都在彈。",
    "1946年他與艾靈頓公爵在美國巡演。廳堂參差；傳說不是。回法國後繼續寫、錄，有時用電吉他，始終是那條會唱歌的主音線。1953年5月16日腦出血去世，四十三歲，楓丹白露附近。葬在塞納河畔薩穆瓦，後來把節日給了這音樂的村子。",
    "此後每個吉普賽爵士吉他手都得決定拿那兩根手指怎麼辦：模仿、延伸，還是放下。泵奏、Selmer、曲目、薩穆瓦音樂節——都回到這一生。",
  ],
  listenTitle: "先聽這些",
  listen: listenNotes("1940 · 戰時敘事曲", "1935 · 名片", "與格拉佩利，快的那些", "晚年抒情姜戈", "兩指快跑，完全打開"),
  addHeading: "為姜戈新增",
  next: "接下來：",
  historyLink: "吉普賽爵士與辛提人的歷史",
};

const ID: DjangoCopy = {
  kicker: "Gitar solo",
  based: "Di Prancis",
  bornLine: "Lahir di Liberchies, Belgia · 23 Januari 1910 — 16 Mei 1953, Fontainebleau",
  born: ["Lahir", "Liberchies, Belgia"],
  instrument: ["Instrumen", "Gitar Selmer-Maccaferri"],
  buried: ["Dimakamkan", "Samois-sur-Seine"],
  bioTitle: "Riwayat",
  bio: [
    "Jean “Django” Reinhardt lahir 23 Januari 1910 di sebuah gerobak di Liberchies, Belgia, dalam keluarga musisi Manouche. Ia tumbuh di jalan antara Belgia dan Prancis, dan saat remaja sudah main di bals musette Paris — banjo dan gitar di belakang akordeon, waltz untuk penari yang tidak butuh nama konservatorium.",
    "Pada malam 26 Oktober 1928 api merusak gerobak yang ia bagi dengan Bella, istri pertamanya. Ia berusia delapan belas. Luka bakar mengambil jari ketiga dan keempat tangan kiri. Dokter bicara amputasi kaki. Ia menolak. Pemulihan lama. Ketika kembali ke gitar ia harus menemukan teknik di sekitar dua jari: cara lain memegang kord, cara lain berlari di fingerboard, bunyi yang lahir dari batas, bukan meskipun ada batas.",
    "Awal 1930-an ia bertemu Stéphane Grappelli. Tahun 1934 mereka merekam sebagai Quintette du Hot Club de France — grup swing hanya senar, tanpa drum dan kuningan. Adik Django, Joseph, sering memegang irama. Selmer-Maccaferri dengan lubang oval menjadi instrumen gaya ini. Piringan — Minor Swing, Djangology, Bricktop, Nuages — membuat musik keluarga menjadi bahasa internasional.",
    "Perang membelah Quintette. Grappelli di London dan tinggal. Django tinggal di Prancis pendudukan, bintang Romani di negeri yang mendeportasi orang Romani. Ia selamat. Nuages, 1940, adalah balada tahun-tahun itu: tenang, bernyanyi, dan dimainkan hari ini di mana musik ini dianggap serius.",
    "Tahun 1946 ia keliling Amerika Serikat dengan Duke Ellington. Aulanya campur; legendanya tidak. Kembali di Prancis ia terus menulis dan merekam, kadang gitar listrik, selalu dengan garis vokal itu. Ia meninggal karena pendarahan otak 16 Mei 1953, usia empat puluh tiga, dekat Fontainebleau. Dimakamkan di Samois-sur-Seine, desa yang kemudian memberi musik ini festivalnya.",
    "Setiap gitaris gypsy jazz sejak itu harus memutuskan apa yang dilakukan dengan dua jari itu: meniru, memperpanjang, atau meninggalkan. Pompe, Selmer, repertoar, festival Samois — semuanya kembali ke hidup ini.",
  ],
  listenTitle: "Dengar dulu",
  listen: listenNotes("1940 · balada masa perang", "1935 · kartu nama", "dengan Grappelli, yang cepat", "Django liris, belakangan", "lari dua jari, terbuka"),
  addHeading: "Tambah ke Django",
  next: "Lanjut:",
  historyLink: "Sejarah gypsy jazz dan Sinti",
};

const TH: DjangoCopy = {
  kicker: "กีตาร์โซโล",
  based: "ฝรั่งเศส",
  bornLine: "เกิดที่ลิแบร์ชี เบลเยียม · 23 มกราคม 1910 — 16 พฤษภาคม 1953 ฟงแตนโบล",
  born: ["เกิด", "ลิแบร์ชี เบลเยียม"],
  instrument: ["เครื่องดนตรี", "กีตาร์ Selmer-Maccaferri"],
  buried: ["ฝัง", "ซามัวซ์-ซูร์-แซน"],
  bioTitle: "ชีวประวัติ",
  bio: [
    "ฌอง “จังโก” ไรน์ฮาร์ตเกิด 23 มกราคม 1910 ในรถบ้านที่ลิแบร์ชี เบลเยียม ในครอบครัวนักดนตรีมานูช เขาโตบนทางระหว่างเบลเยียมกับฝรั่งเศส และวัยรุ่นก็เล่นใน bals musette ของปารีสแล้ว — แบนโจและกีตาร์หลังแอคคอร์เดียน วอลทซ์ให้คนเต้นที่ไม่ต้องการชื่อดนตรีศึกษา",
    "คืน 26 ตุลาคม 1928 ไฟไหม้รถบ้านที่เขาอยู่กับเบลลา ภรรยาคนแรก อายุสิบแปด แผลไฟไหม้ทำให้ใช้นิ้วกลางกับก้อยมือซ้ายไม่ได้ แพทย์พูดถึงตัดขา เขาปฏิเสธ การฟื้นตัวยาวนาน เมื่อกลับมากีตาร์เขาต้องคิดเทคนิครอบนิ้วที่ใช้ได้สองนิ้ว วิธีจับคอร์ดใหม่ วิ่งเฟรตบอร์ดใหม่ เสียงที่ออกจากข้อจำกัด ไม่ใช่ทั้งๆ ที่มีข้อจำกัด",
    "ต้นทศวรรษ 1930 เขาพบ สเตฟาน กรัปเปลลี ปี 1934 พวกเขาอัดเป็น Quintette du Hot Club de France — สวิงมีแต่สาย ไม่มีกลอง ไม่มีทองเหลือง พี่ชายโจเซฟมักจังหวะ กีตาร์ Selmer-Maccaferri รูเสียงรีกลายเป็นเครื่องของสไตล์ แผ่น — Minor Swing, Djangology, Bricktop, Nuages — ทำให้เพลงครอบครัวเป็นภาษาสากล",
    "สงครามแยกควินเท็ต กรัปเปลลีอยู่ลอนดอนและอยู่ต่อ จังโกอยู่ในฝรั่งเศสยึดครอง ดาวโรมานีในประเทศที่เนรเทศโรมานี เขารอด Nuages ปี 1940 คือบัลลาดของปีเหล่านั้น นิ่ง ร้อง และเล่นวันนี้ทุกที่ที่เพลงนี้ถูกรับจริงจัง",
    "ปี 1946 เขาทัวร์สหรัฐกับดยุก เอลลิงตัน ห้องโถงไม่สม่ำเสมอ ตำนานไม่ใช่ กลับฝรั่งเศสเขายังเขียนและอัด บางครั้งกีตาร์ไฟฟ้า เสมอด้วยไลน์ร้องนั้น เขาเสียด้วยเลือดออกในสมอง 16 พฤษภาคม 1953 อายุสี่สิบสาม ใกล้ฟงแตนโบล ฝังที่ซามัวซ์-ซูร์-แซน หมู่บ้านที่ต่อมาให้เทศกาลแก่เพลงนี้",
    "กีตาร์ริสต์ยิปซีแจ๊สทุกคนตั้งแต่นั้นต้องตัดสินใจว่าจะทำอะไรกับสองนิ้ว คัดลอก ต่อ หรือวาง ปอมป์ เซลแมร์ รายเพลง เทศกาลซามัวซ์ — ทั้งหมดย้อนมาชีวิตนี้",
  ],
  listenTitle: "ฟังก่อน",
  listen: listenNotes("1940 · บัลลาดสงคราม", "1935 · นามบัตร", "กับกรัปเปลลี เพลงเร็ว", "จังโกบทกวีช่วงหลัง", "วิ่งสองนิ้ว เปิดกว้าง"),
  addHeading: "เพิ่มให้จังโก",
  next: "ถัดไป:",
  historyLink: "ประวัติยิปซีแจ๊สและซินติ",
};

const HE: DjangoCopy = {
  kicker: "גיטרה סולו",
  based: "בצרפת",
  bornLine: "נולד בליברשי, בלגיה · 23 בינואר 1910 — 16 במאי 1953, פונטנבלו",
  born: ["נולד", "ליברשי, בלגיה"],
  instrument: ["כלי", "גיטרת Selmer-Maccaferri"],
  buried: ["קבור", "סמואה-סור-סן"],
  bioTitle: "חיים",
  bio: [
    "ז׳אן ״ג׳אנגו״ ריינהארט נולד ב־23 בינואר 1910 בקרוואן בליברשי, בלגיה, למשפחת מוזיקאים מנוּש. הוא גדל בדרך בין בלגיה לצרפת, וכבר בגיל הנעורים ניגן ב־bals musette של פריז — בנג׳ו וגיטרה מאחורי אקורדיון, ואלסים לרקדנים שלא היו זקוקים לשם של קונסרבטוריון.",
    "בליל 26 באוקטובר 1928 שרפה כילתה את הקרוואן שחלק עם בלה, אשתו הראשונה. הוא היה בן שמונה־עשרה. הכוויות לקחו את השימוש באצבע השלישית והרביעית של יד שמאל. רופאים דיברו על כריתת רגל. הוא סירב. ההחלמה הייתה ארוכה. כשחזר לגיטרה היה עליו להמציא טכניקה סביב שתי אצבעות: דרך אחרת לאחוז אקורדים, דרך אחרת לרוץ על הלוח, צליל שיצא מן ההגבלה ולא למרותה.",
    "בראשית שנות השלושים פגש את סטפאן גראפלי. ב־1934 הקליטו כ־Quintette du Hot Club de France — הרכב סווינג של מיתרים בלבד, בלי תופים ובלי פליז. אחיו ז׳וזף החזיק לעיתים קרובות את הקצב. ה־Selmer-Maccaferri עם חור סגלגל הפכה לכלי של הסגנון. התקליטים — Minor Swing, Djangology, Bricktop, Nuages — עשו ממוזיקה משפחתית שפה בינלאומית.",
    "המלחמה קרעה את הקווינטט. גראפלי היה בלונדון ונשאר. ג׳אנגו נשאר בצרפת הכבושה, כוכב רומאני במדינה שגירושה רומאנים. הוא שרד. Nuages מ־1940 היא הבלדה של השנים האלה: שקטה, שרה, ומנוגנת היום בכל מקום שלוקחים את המוזיקה הזאת ברצינות.",
    "ב־1946 סייר בארצות הברית עם דיוק אלינגטון. האולמות היו מעורבים; האגדה לא. בחזרה בצרפת המשיך לכתוב ולהקליט, לפעמים בגיטרה חשמלית, תמיד עם קו השירה הזה. הוא מת מדימום מוחי ב־16 במאי 1953, בן ארבעים ושלוש, ליד פונטנבלו. קבור בסמואה-סור-סן, הכפר שנתן אחר כך למוזיקה את הפסטיבל.",
    "כל גיטריסט של ג׳יפסי ג׳אז מאז היה צריך להחליט מה לעשות עם שתי האצבעות: להעתיק, להאריך, או להשאיר מאחור. הפומפ, הסלמר, הרפרטואר, הפסטיבל בסמואה — הכול חוזר לחיים האלה.",
  ],
  listenTitle: "קודם לשמוע",
  listen: listenNotes("1940 · בלדת המלחמה", "1935 · כרטיס הביקור", "עם גראפלי, המהירים", "ג׳אנגו גלי, מאוחר", "ריצת שתי האצבעות, פתוח"),
  addHeading: "להוסיף לג׳אנגו",
  next: "הבא:",
  historyLink: "היסטוריה של ג׳יפסי ג׳אז והסינטי",
};

const COPIES: Record<string, DjangoCopy> = {
  en: EN,
  nl: NL,
  fr: FR,
  de: DE,
  es: ES,
  pt: PT,
  it: IT,
  hu: HU,
  pl: PL,
  cs: CS,
  ro: RO,
  sr: SR,
  hr: HR,
  ru: RU,
  ja: JA,
  ko: KO,
  zh: ZH,
  "zh-tw": ZH_TW,
  id: ID,
  th: TH,
  he: HE,
};

export function djangoCopy(locale: string): DjangoCopy {
  return COPIES[locale] ?? EN;
}
