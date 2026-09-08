/** Original profile copy, written from official sites, booking pages and
 *  public records. Facts only — no lifted sentences, no invented dates. */
import { REST_ARTIST_BIOS, REST_GROUP_BIOS } from "@/lib/profile-bios-rest";

type BioBand = {
  slug: string;
  name: string;
  origin: string;
  country: string;
  members: string[];
  roles?: Record<string, string | undefined>;
  bio: string;
  clips?: { title: string; url: string }[];
};

const FEATURED_ARTIST_BIOS: Record<string, string> = {
  "tata-mirando":
    "Joseph Weiss, Tata Mirando (6 March 1895, Opfikon — 1 January 1967, Dieren), was a Sinti musician, violin maker and leader of the family gypsy orchestra that took the name Mirando. He brought the Weiss family to the Netherlands in 1937. The orchestra played the Kurhaus in Scheveningen, private houses and the Dutch royal household: Hungarian csárdás, Romanian song, and sometimes gypsy jazz. The sons kept the name on Dutch stages.",
  "kokalo-mirando":
    "Adolf Kokalo Weiss (1933–2025), son of Joseph Weiss, billed Kokalo Mirando. Piano in the Tata Mirando orchestra — Een zwaar hart (2001) lists him on that chair. He later carried the Tata Mirando name himself. Died in Arnhem, October 2025.",
  "nello-mirando-jr":
    "Primas of the Tata Mirando orchestra. Een zwaar hart (2001) bills Nello Mirando Jr. first violin of the Dutch Weiss family band. He also appears on Dadesko Wazst (2004).",
  "bokkie-vink":
    "Dutch cimbalom player, long-time chair of the Tata Mirando orchestra. Een zwaar hart (2001) lists him on cymbaal. Later with Sintiromarus.",
  "urszui-kalman":
    "Transylvanian viola. Een zwaar hart (2001) bills Urszui Kálmán twice: under Romania with Lako Aladar, and in Mera Gypsy Band. He also recorded in the Ardealul trio with Emil Mihaiu and Pusztái Aladár.",
  "fodor-sandor-neti":
    "Transylvanian Roma primas, born 2 April 1922 in Gilău, died 20 October 2004. Leader of Mera Gypsy Band from Méra, Kalotaszeg. Een zwaar hart bills the band beside Tata Mirando.",
  "florin-codoba":
    "Primas of Taraful Palatca from Pălatca, Cluj County. Martin Codoba, born 1977, billed Codoba Florin on Een zwaar hart (2001). Fifth generation of the Palatca Roma musician house.",
  "buffo-rigo":
    "Hungarian gypsy primas Sándor “Buffo” Rigó. Records as Sandor Buggo Rigo and His Hungarian Gypsy Band, including The Best of Tradition (1993). Een zwaar hart thanks him beside Sándor Járóka.",
  "hansche-weiss":
    "Häns’che Weiss (1951–2016) was a German Sinti guitarist, born in Berlin. His quintet carried the postwar German house; he took Titi Winterstein into the band at fifteen. The 1970s records with Schnuckenack Reinhardt and Titi are the German document.",
  "titi-winterstein":
    "Titi Winterstein (1956–2008) was a German Sinti violinist. Father Tokeli survived the Nazi years when much of the family did not. First stage: Sinti pilgrimage, Illingen, 1965. Häns’che Weiss took him at fifteen. Own quintet from 1978, six records, Django Reinhardt prize 2003. Died in Offenburg.",
  "veres-lajos":
    "Veres Lajos (1912–1981) was a Hungarian Roma primas. Veres Lajos et son orchestre recorded Gipsy Souvenirs in 1953 — Hungarian, Romanian and Russian gypsy melodies — for the French labels that later sat in the BnF collection (World Europe). The same book the Mirando orchestra played in the Netherlands.",
  "sandor-lakatos":
    "Sándor Lakatos (17 December 1924 — 24 May 1994, Budapest) was a Hungarian Roma primas, uncle of Roby Lakatos. Roby learned in Sándor’s band and in his father Antal’s. Sándor led the Hungarian state radio folk orchestra 1950–52 and took the café violin around the world.",
  "sandor-jaroka":
    "Sándor Járóka (16 February 1922, Kisvárda — 11 April 1984, Budapest) was the Hungarian Roma primas called the primas of kings. At his funeral the Roma musicians of Budapest gathered; from that serenade the Budapest Gypsy Symphony Orchestra was born.",
  "sandor-jaroka-jr":
    "Sándor Járóka Jr (30 September 1954 — 18 September 2007) carried his father’s Budapest gypsy orchestra. Married to singer Bangó Margit.",
  "lajos-boross":
    "Lajos Boross (7 January 1925 — 8 July 2014, Budapest) was a Hungarian gypsy violinist and conductor. Leader of Lajos Boross and His Gypsy Band — the restaurant and concert primas chair.",
  "toki-horvath":
    "Gyula “Toki” Horváth (17 September 1920, Kaposvár — 13 October 1971, Munich) was a Hungarian primas, first violin of the Rajkó Orchestra from 1931. Records billed him King of the Gypsies.",
  "lajos-kiss":
    "Lajos Kiss (Debrecen 1902 — Budapest 20 January 1951) was a Hungarian violinist. He played in his father’s orchestra from the age of eight, then led his own band. One of the primas names the Mirando family still keep.",
  "georges-boulanger":
    "Gheorghe Pantazi, billed Georges Boulanger (18 April 1893, Tulcea — 3 June 1958). Romanian violinist, conductor and composer — gypsy colour with Viennese light music. The Great Gypsy Violinist records, 1934–1939. A Romanian chair the Mirando family name beside the Hungarian orchestras.",
  "stephane-grappelli":
    "Stéphane Grappelli (26 January 1908 – 1 December 1997) was the violin of the Quintette du Hot Club de France. Born in Paris, he met Django Reinhardt in the early 1930s; their 1934 records made an all-string swing group famous without drums or brass. War split the Quintette — Grappelli stayed in London — and he spent the next six decades carrying that singing violin onto concert stages, including duets with Yehudi Menuhin. The bow never hurries. Players still learn time from his records.",
  "joseph-reinhardt":
    "Joseph “Nin-Nin” Reinhardt (1912–1982) was Django’s younger brother and the rhythm guitar of the original Quintette. His pompe — the two-and-four that drives the style — is the chair every rhythm player still studies. He stayed in the family groups after the war and kept the engine of the music on the Paris floors.",
  "baro-ferret":
    "Pierre “Baro” Ferret (1908–1976) was a Paris guitarist of the same generation as Django, a fierce soloist and one of the three Ferret brothers who defined the musette-and-manouche guitar of the 1930s. The family line — Matelot, Sarane, later Boulou and Elios Ferré — remains one of the great French dynasties of the music.",
  "tchan-tchou-vidal":
    "Tchan Tchou Vidal (1923–1999), from Aix-en-Provence, kept a southern French guitar close to Django’s tone without copying him. La Gitane and the Provençal rooms are his mark: time, song, and a right hand that never shows off. In the decades when the music was still mostly a family affair, he was one of the players who kept it public.",
  "babik-reinhardt":
    "Babik Reinhardt (1944–2001) was Django’s son. He took bebop and later fusion into the family guitar without dropping the manouche right hand, and became the bridge between the golden-age book and a more modern harmonic language. Festival stages still programme his name next to his father’s.",
  "fapy-lafertin":
    "Fapy Lafertin was born in 1950 in Kortrijk, Belgium, into the Sinti Limberger/Lafertin world. Lead guitar of the Waso Quartet, he is the living reference for Django’s actual sound — vibrato, ballad tone, and a right hand that does not race. Players who want the old language rather than later virtuoso flash still start here.",
  "tchavolo-schmitt":
    "Tchavolo Schmitt was born in 1954 in Alsace. His guitar is raw, singing, and built for the dance floor as much as the festival stage — the Alsatian Sinti swing that prefers feel to flash. He has been a regular on Festival Django Reinhardt bills and in films that needed the real sound of the camp and the hall.",
  "dorado-schmitt":
    "Dorado Schmitt was born in 1957 in Alsace. Violin and guitar, same singing line. Patriarch of a family that now includes Samson on the current circuit, he moves between the two instruments without changing the phrasing. Samois and the Alsatian rooms have had him for decades.",
  "angelo-debarre":
    "Angelo Debarre was born in 1962 in Saint-Denis, of Romani family, and grew up into the Paris club guitar. Technique and deep swing in the same right hand: he is a fixture of the French rooms and of Festival Django Reinhardt, and a model for the modern lead chair. The club circuit still books him as the player who can fill a night without a programme.",
  "bireli-lagrene":
    "Biréli Lagrène was born on 4 September 1966 in Soufflenheim, Alsace, into a Romani family of guitarists. He started as a child, was pointed toward Django by his father and by Matelot Ferret, and recorded Routes to Django in 1980 while still a teenager. From there he walked into fusion, Jaco Pastorius, Stéphane Grappelli, John McLaughlin, Paco de Lucía — and back again to swing, including the Gipsy Project records of the early 2000s. Victoires de la Musique in 2001; Chevalier des Arts et des Lettres in 2012. The living master of the Alsatian guitar.",
  "stochelo-rosenberg":
    "Stochelo Rosenberg was born on 19 February 1968 in Helmond, Netherlands, into a Sinti family. He started guitar at ten, learning from his father Mimer and his uncle Wasso Grünholz. In 1989 he formed the Rosenberg Trio with cousins Nous’che (rhythm) and Nonnie (bass); Carnegie Hall, the Concertgebouw, North Sea Jazz, Samois, Marciac and the Duc des Lombards followed. The fat, singing vibrato is the Dutch school in public. Sinti Music still books the family name as the essence of the working trio.",
  "romane":
    "Patrick Leguidecoq, known as Romane, was born in 1959 in Paris. Composer and teacher as much as soloist: his original themes and guitar books have been how a generation learns the style on the French concert stage. Festival Django Reinhardt has had him as both player and writer of the current book.",
  "jimmy-rosenberg":
    "Jimmy Rosenberg was born in 1980 in Helmond, cousin to Stochelo. A child prodigy whose early records still stop guitarists — facility, time, and the family language at full speed. The story is also the cost of growing up inside a dynasty. He remains one of the names younger players measure themselves against.",
  "mozes-rosenberg":
    "Mozes Rosenberg was born in 1981 in Helmond, brother of Stochelo. He started guitar at six with his father Mimer, his brother, and uncle Wasso Grünholz, and was already on Dutch television with the Rosenberg Trio at seven. He leads the Mozes Rosenberg Trio (Daniel Rosenberg, Matheus Nicolaiewsky), plays in The Rosenbergs, and shares bills with Stochelo. Sinti Music lists him as a complete lead — tone, time, and the Dutch family book.",
  "samson-schmitt":
    "Samson Schmitt was born in 1979 in Alsace, son of Dorado. He carries the family violin-and-guitar world onto the current festival circuit with a harder contemporary edge. Samois books him as the Schmitt name of this generation — a link between the Alsatian camp tradition and younger leads.",
  "joscho-stephan":
    "Joscho Stephan was born on 23 June 1979 in Mönchengladbach. He started guitar at six (his father played in a cover band), found Django on an uncle’s tape at thirteen, and released Swinging Strings at nineteen — Guitar Player’s CD of the month. He works a wide book, from strict manouche to concert-hall standards, has shared stages with Biréli Lagrène, Tommy Emmanuel and Martin Taylor, and has run GypsyGuitarAcademy since 2012. Official site: joscho-stephan.de.",
  "adrien-moignard":
    "Adrien Moignard was born in 1985 in France. Lead guitar of the current French generation: high-register fire, deep time, and a first-call name from Paris clubs to Festival Django Reinhardt. Quartets under his own name sit on the same bills as the older Alsatian chairs.",
  "steven-reinhardt":
    "Steven Reinhardt was born in 1990 and plays manouche guitar out of Saint-Ouen, on the north edge of Paris. The public jam is La Chope des Puces, 122 rue des Rosiers: Saturday and Sunday afternoons, amateurs sitting in, the regulars holding the pompe. In June 2026 Paris Guitar Connection filmed Gypsy Jazz with a Gypsy with him — family time, the Swing Lâg shop guitars, Blues en mineur and What Is This Thing Called Love. He records as a composer (stevenreinhardt.bandcamp.com) and posts as @stevenreinhardt77.",
  "paulus-schafer":
    "Paulus Schäfer was born in 1978 in the Dutch Sinti community and learned guitar early from Wasso Grünholz. He tours as a duo with Dominique Paats, in Five Great Guitars, and in quartets with Joost Zoeteman; guests have included Tcha Limberger, Stochelo Rosenberg, Biréli Lagrène, Fapy Lafertin and Martin Taylor. Letter to Vincent Van Gogh is his own writing, played with Limberger and Peter Beets. In 2013 the World of Guitar festival marked his place in the contemporary Dutch school. Sinti Music books the name.",
  "stephane-wrembel":
    "Stéphane Wrembel was born in 1974 in France and has long been based in New York. Guitarist, composer and the writer of Bistro Fada — the guitar theme of Woody Allen’s Midnight in Paris, which took a Grammy. He runs Django in June in the United States, a gathering that has become a pilgrimage for players on that side of the Atlantic, and records Django New Orleans projects that put manouche guitar against brass. Official site: stephanewrembel.com.",
  "costel-nitescu":
    "Costel Nitescu was born in 1970 in Romania. Violin on the current circuit: Eastern lyricism inside Hot Club swing, a fixture from Samois to New York. When a festival needs the violin chair of this generation, his name is on the list.",
  "tim-kliphuis":
    "Tim Kliphuis was born in 1974 in the Netherlands. Violin between Grappelli’s language, folk and classical rooms, and a dedicated teacher. His groups mix line-ups that are not family bands, and he turns up on bills from Piracicaba to Festival Django Portugal. Official site: timkliphuis.com.",
  "gonzalo-bergara":
    "Gonzalo Bergara was born in 1980 in Buenos Aires. Argentine guitar that spent years in Los Angeles and helped make a serious American scene — original writing that still sits on pompe in 4/4. Official site: gonzalobergara.com.",
  "rocky-gresset":
    "Rocky Gresset was born in 1980 in France. Guitar of rare touch: as convincing on a ballad as on an uptempo stomp, and a regular partner for the current generation of French leads. Festival Django Reinhardt has had him as both leader and guest.",
  "lulo-reinhardt":
    "Lulo Reinhardt was born in 1961 in Koblenz, a grandnephew of Django. German Sinti guitar with Latin colours as well as the straight book, decades on the road under the family name. The surname is a tradition as much as a billing.",
  "wawau-adler":
    "Josef “Wawau” Adler was born in 1967 in Karlsruhe, into a Sinti family, and took up guitar young under Django’s records. German concert and festival guitar: albums from With Body and Soul (1991) through Here’s to Django, Expressions, Happy Birthday Django 110 and I Play With You (2022). He has worked with Biréli Lagrène, Didier Lockwood, Noé Reinhardt and Joel Locher, and teaches the style in workshops. Official bio: wawau-adler.com.",
  "andreas-oberg":
    "Andreas Öberg was born in 1978 in Stockholm. Swedish guitar that treats manouche as one dialect among several — bebop, fusion, and the Django book — with the technique to sit in any of them. A frequent guest on the gypsy jazz circuit and a bridge to the wider jazz guitar world.",
  "hono-winterstein":
    "Hono Winterstein (Paul) was born on 27 February 1962 in Forbach, France. Rhythm guitar: the Forbach chair. He held time for Dorado Schmitt, Tchavolo Schmitt and Samson Schmitt, and from 2001 for Biréli Lagrène, including tours in the United States and Japan. Trio with nephew Brady Winterstein. Album Horizons (2019).",
  "ninine-garcia":
    "Ninine Garcia was born in 1956 in France. Guitar of the working Hot Club — clubs, dances and festivals rather than virtuoso showcase alone. Equally at home leading and accompanying, he is the French circuit musician the younger leads grew up hearing.",
  "daniel-gueli":
    "Daniel Gueli is a Netherlands double bass on the living circuit, and the person who built Gypsy Jazz Hub. On stage he holds the low end for the Marcia Bamberg Swing Quartet, the Django Rosenberg Trio with Noekie Basily, and Gismo Graf. The site is the other instrument: dates, rooms and people in one place.",
  "matelo-ferret":
    "Jean “Matelo” Ferret (1918–1989), youngest of the Ferret brothers from Rouen, played with Django and kept Parisian musette-and-manouche guitar alive after the war. He is the father of Boulou and Elios Ferré. The waltz and the swing sit in the same right hand.",
  "sarane-ferret":
    "Guillaume “Sarane” Ferret (1912–1970) was brother to Baro and Matelo. Swing guitar of the 1930s–50s Paris scene, often beside Django and in the family Hot Club rooms. The Ferret name on a bill still means that Paris guitar.",
  "louis-vola":
    "Louis Vola (1902–1990), from La Seyne-sur-Mer, was the double bass of the original Quintette du Hot Club de France. Two-and-four, walking when the soloist needs air: the records that still teach the music have his floor under them.",
  "roger-chaput":
    "Roger Chaput (1909–1995) was rhythm guitar of the early Quintette, beside Joseph Reinhardt. His pompe is on the first Hot Club sides — the chair every rhythm player still opens when they want to hear how it began.",

  "yorgui-loeffler":
    "Yorgui Loeffler was born in 1979 in Alsace. Sinti guitar, a pillar of Festival Django Reinhardt: drive, tone, and those unaccompanied introductions that are a Samois signature. The current French manouche stage still takes its time from this right hand.",
  "marcel-loeffler":
    "Marcel Loeffler was born in 1956 in Alsace. Accordion of the Loeffler family — waltz, musette and swing on the Samois stages for decades, often beside Yorgui and the Alsatian clans. The left-hand pump is as much the music as the guitar.",
  "gigi-loeffler":
    "Gigi Loeffler is guitar from the same Alsatian family: rhythm and lead on Festival Django Reinhardt bills and in the ensembles that define the Samois week. A Loeffler on the programme means the pompe will not drift.",
  "raphael-fays":
    "Raphaël Faÿs was born in 1959 in Paris. Guitar that studied the classical right hand and kept a manouche one: a bridge Festival Django Reinhardt has booked for years. The concert hall and the Hot Club sit in the same player.",
  "boulou-ferre":
    "Boulou Ferré was born in 1951 in Paris, son of Matelo Ferret. Child prodigy of the Ferret line, later a duo with his brother Elios. Bebop vocabulary inside a family right hand — Samois still prints the accent on the é.",
  "elios-ferre":
    "Elios Ferré was born in 1956 in Paris, brother of Boulou, son of Matelo. The Ferré duo is how the family guitar left the 1950s rooms and walked onto the festival stage. Two brothers, one phrasing.",
  "patrick-saussois":
    "Patrick Saussois (1954–1995) was a French guitarist of the 1980s scene, a name Festival Django Reinhardt still lists among the players who carried the music between the old family bands and the nouvelle vague. His records are short; the circuit remembers the touch.",
  "sebastien-giniaux":
    "Sébastien Giniaux was born in 1983 in France. Guitar and cello on the same bills — a rare double on Festival Django Reinhardt programmes. The cello writing is his, not a gimmick; the guitar remains manouche.",
  "noe-reinhardt":
    "Noé Reinhardt was born in 1982 in France, of the Reinhardt family. Guitar on Festival Django Reinhardt stages, a living surname that still has to prove the right hand every night. The family book and a contemporary ear.",
  "david-reinhardt":
    "David Reinhardt was born in 1986 in France, son of Babik, grandson of Django. Guitar that grew up inside the name and then had to find a personal sound. Samois books him as the third generation on the same grass.",
  "mandino-reinhardt":
    "Mandino Reinhardt was born in 1956 in Alsace. Guitar and teacher of the Alsatian Reinhardt line — Festival Django Reinhardt and the workshops that send younger players back onto the stage. The surname here means a school as well as a family.",
  "simba-baumgartner":
    "Simba Baumgartner is a French guitarist of the 1990s generation, a great-grandson of Django. Festival Django Reinhardt has put the youngest Reinhardt line on the bill so the public can hear the name in a living right hand.",
  "gismo-graf":
    "Gismo Graf was born in 1992 in Germany, Sinti guitar of the current German school. He leads the Gismo Graf Trio on the festival circuit, including Festival Django Reinhardt. Official pages: gismograf.de.",
  "titi-bamberger":
    "Titi Bamberger is a guitarist on the French–German circuit and a Festival Django Reinhardt name. The Bamberger billing is the working Alsatian/German guitar, not a showcase act.",
  "lollo-meier":
    "Lollo Meier was born in 1963 in Limburg, Netherlands. Dutch Sinti guitar, a quiet master of the old language — less flash, more song. Samois and the Dutch rooms book him for players who want to hear Django’s vocabulary spoken slowly and in time.",
  "ritary-gaguenetti":
    "Ritary Gaguenetti is a French gypsy jazz guitarist, a Festival Django Reinhardt regular. Lead of the French festival circuit rather than a conservatory name — the right hand you hear when a Samois afternoon needs a soloist.",
  "moreno-winterstein":
    "Moreno Winterstein was born in 1963 in Alsace, of the Winterstein family. Sinti guitar on Festival Django Reinhardt stages, cousin-world to Hono’s rhythm chair. The family pompe and a lead that still sounds like Alsace.",
  "doudou-cuillerier":
    "Doudou Cuillerier is a French guitarist and singer of the manouche scene. Voice and guitar on Festival Django Reinhardt bills — the song sitting on pompe, not in front of it.",
  "fanou-garcia":
    "Fanou Garcia is Paris guitar of the Garcia family, a Festival Django Reinhardt name. The working French lead: clubs, family bills, and the Samois week.",
  "richard-manetti":
    "Richard Manetti is one of the Manetti brothers — French lead guitar, Festival Django Reinhardt. Two brothers who share a family pompe and split the solo chair.",
  "pierre-manetti":
    "Pierre Manetti is the other Manetti brother: the same family guitar, the same Samois bills. Together they are the Manetti sound — French lead with a shared engine.",
  "nousche-rosenberg":
    "Nous’che Rosenberg was born in 1965 in Helmond. Rhythm guitar of the Rosenberg Trio from the start in 1989 — the pompe under Stochelo’s lead and Nonnie’s bass. Carnegie Hall and Samois were built on this chair.",
  "nonnie-rosenberg":
    "Nonnie Rosenberg was born in 1970 in Helmond. Double bass of the Rosenberg Trio, cousin to Stochelo and Nous’che. The low end of the Dutch family band that took the language around the world.",
  "diknu-schneeberger":
    "Diknu Schneeberger was born in 1990 in Vienna. Austrian Sinti guitar, Festival Django Reinhardt and the Central European rooms. A younger school that still speaks the family language.",
  "robin-nolan":
    "Robin Nolan was born in 1970 in the United Kingdom. Guitarist, teacher and author of widely used gypsy jazz books — the British player who put the pedagogy on paper and then went on the road. Festival Django Reinhardt and the international workshop circuit. Official site: robinnolan.com.",
  "john-jorgenson":
    "John Jorgenson was born in 1956 in the United States. American guitar that took the Hot Club instrumentation seriously — the US scene’s long-standing lead, a Festival Django Reinhardt guest, and a player who also walks into country and gypsy swing without dropping time.",
  "frank-vignola":
    "Frank Vignola was born in 1965 in the United States. New York swing guitar with a deep Django book, Festival Django Reinhardt and the American club circuit. The right hand is jazz guitar first; the manouche repertoire is home territory.",
  "olli-soikkeli":
    "Olli Soikkeli was born in 1991 in Nurmes, Finland, started guitar at twelve, and made Django his main work soon after. He toured Europe with Paulus Schäfer, moved to New York in 2014, and has played Birdland, Blue Note, Iridium, Lincoln Center and Town Hall. Guests and bills have included Stochelo Rosenberg, Bucky Pizzarelli, Tommy Emmanuel, Andreas Öberg and Cyrille Aimée. Official site: ollisoikkeli.com.",
  "antoine-boyer":
    "Antoine Boyer was born in 1995 in France. Guitar of the prodigy generation: Festival Django Reinhardt while still young, a French lead who already sits beside the older chairs. Technique in service of time, not the other way around.",
  "samy-daussat":
    "Samy Daussat is a French guitarist of the Faÿs and Reinhardt circles, a Festival Django Reinhardt regular. Rhythm and lead as needed — the Paris player you call when the bill needs a sure chair.",
  "florin-niculescu":
    "Florin Niculescu was born in 1967 in Romania. Violin of the current European circuit, Festival Django Reinhardt and the festival halls that still want a Grappelli chair with Eastern fire. The bow is the other half of the Hot Club picture.",
  "tcha-limberger":
    "Tcha Limberger was born in 1977 into a Belgian Manouche family. Violin, guitar and voice — Festival Django Reinhardt, the Waso/Limberger rooms, and the stages that still want song, not only chops. His father Vivi held rhythm in Waso; his grandfather Piotto led the family violin; Fapy Lafertin is next door in the same house.",
  "pierre-blanchard":
    "Pierre Blanchard was born in 1956 in France. Violin of the French school, a Festival Django Reinhardt name, often beside Angelo Debarre. The lyrical chair of the Paris and festival bills.",
  "alexandre-cavaliere":
    "Alexandre Cavaliere was born in 1987 in Belgium. Violin of the Belgian school, Festival Django Reinhardt. A younger bow that still phrases like the Hot Club records.",
  "aurore-voilque":
    "Aurore Voilqué is a French violinist, a Festival Django Reinhardt name. One of the women who hold the violin chair on a circuit that used to print only the old men’s names.",
  "ludovic-beier":
    "Ludovic Beier was born in 1978 in France. Accordion on Festival Django Reinhardt stages — musette and swing in the left hand, the other engine beside the pompe.",
  "claudius-dupont":
    "Claudius Dupont is a French double bass, a Festival Django Reinhardt chair. The floor under French festival leads.",
  "diego-imbert":
    "Diego Imbert was born in 1975 in France. Double bass of the current French circuit, including Biréli Lagrène’s Gipsy Trio with Hono Winterstein. Festival Django Reinhardt books the name as a sure low end.",
  "sebastien-girardot":
    "Sébastien Girardot is a double bass between France and the United Kingdom, heard with Rosenberg and Dave Kelbie groups and at Festival Django Reinhardt. The Anglo-French bass chair of the current circuit.",
  "dave-kelbie":
    "Dave Kelbie was born in 1967 in the United Kingdom. Rhythm guitar — British pompe at Festival Django Reinhardt and on records that taught a generation outside France how the engine works. Fapy, the Rosenberg world, and the UK rooms.",
  "benji-winterstein":
    "Benji Winterstein was born in 1991 in Forbach. Rhythm guitar, Popots’s son. First concert at the Carreau de Forbach; he holds time with his father and has sat with Samson Schmitt. He also holds pompe for Fanou Torracinta and for Dario Napoli’s trio, and co-runs the Gypsy Jazz Full Immersion camps.",
  "brady-winterstein":
    "Brady Winterstein is lead guitar from Forbach / Alsace, nephew of Hono Winterstein. He plays the trio with Hono, and sat the Forbach festival archive night of 9 May 2026 with Sanseverino and Hervé Poulikin.",
  "popots-winterstein":
    "Jean-Louis “Popots” Winterstein was born on 29 May 1964 in Forbach. Rhythm guitar. Brother of Hono, father of Benji. First nights with Dorado Schmitt in Metz, 1980. Co-founded Festival de jazz manouche de Forbach in 2018 with Daniel Fioriti.",
  "holzmanno-winterstein":
    "Holzmano Winterstein (also Holzmano Lagrène) was born in 1952 in Molsheim, Alsace. Rhythm guitar: Schnuckenack Reinhardt Quintett from 1969, then Häns’che Weiss with his brother Ziroli. Later with Titi Winterstein, Biréli Lagrène and Wawau Adler.",
  "christian-escoude":
    "Christian Escoudé was born in 1947 in France, of Romani family. French jazz guitar that has walked in and out of the manouche book for half a century — Festival Django Reinhardt, the Paris clubs, and a touch that is jazz first.",
  "mike-reinhardt":
    "Mike Reinhardt is Alsatian guitar of the Reinhardt family, a Festival Django Reinhardt name. Another living branch of the surname on the Samois grass.",
  "kussi-weiss":
    "Kussi Weiss is German Sinti guitar, a Festival Django Reinhardt regular. The German family school on a French festival bill.",
  "olivier-kikteff":
    "Olivier Kikteff is a French guitarist and composer, a Festival Django Reinhardt regular. Original writing inside the manouche right hand — the French composer-guitarist chair.",
  "cyrille-aimee":
    "Cyrille Aimée was born in 1984 in Samois-sur-Seine, the village of Django’s grave and the festival. Singer and guitarist: she grew up on that grass and took the voice out onto the international jazz stage. Festival Django Reinhardt still prints the hometown name. Official site: cyrillemusic.com.",
  "schnuckenack-reinhardt":
    "Schnuckenack Reinhardt (1921–2006) was the German Sinti violinist who put the family music on German concert stages after the war. Festival Django Reinhardt lists him among the names that carried the violin when Grappelli was the only public face most people knew.",
  "waso-de-cauter":
    "Waso De Cauter is Belgian guitar of the Waso Quartet world, Ghent, Festival Django Reinhardt. The De Cauter family and Fapy Lafertin share that Belgian school.",
  "koen-de-cauter":
    "Koen De Cauter was born in 1950 in Belgium. Guitar, saxophone and clarinet of the Waso family — Festival Django Reinhardt and the Belgian rooms that never split jazz from the family band.",
  "mathias-levy":
    "Mathias Lévy is a French violinist and singer, a Festival Django Reinhardt name (including the Chant Song programmes). The violin chair that also writes songs.",
  "william-brunard":
    "William Brunard is a French double bass — Fanou Torracinta, Angelo Debarre, Adrien Moignard, Festival Django Reinhardt. First-call low end of the current French leads.",
  "fanou-torracinta":
    "Fanou Torracinta was born in 1996 in Corsica. As a teenager he toured island festivals with Tchavolo Schmitt; now he is one of the main gypsy jazz voices in France — Paris rooms, Festival Django Reinhardt, Django in June. Working band: Benji Winterstein, William Brunard, Bastien Brison. Records: Gipsy Guitar From Corsica Vol. 1 (2021) and Vol. 2 (2023).",
  "bastien-brison":
    "Bastien Brison is French jazz piano of Fanou Torracinta’s group. He is the piano chair on Gipsy Guitar From Corsica Vol. 1 and Vol. 2, beside Benji Winterstein and William Brunard — the unusual extra voice in a manouche band.",
  "rodolphe-raffalli":
    "Rodolphe Raffalli is Corsican-French guitar in Django’s language, a Festival Django Reinhardt name. The island time inside a manouche right hand.",
  "christophe-lartilleux":
    "Christophe Lartilleux is a French guitarist, Swing De Gitanes, Festival Django Reinhardt. The working French group leader of the festival circuit.",
  "sandro-roy":
    "Sandro Roy was born in 1994 in Germany. Violin of the German school, Festival Django Reinhardt. A younger bow on the Samois bills.",
  "django-rosenberg":
    "Django Rosenberg is Dutch Sinti guitar of the Rosenberg family. He leads a trio with Noekie Basily and Daniel Gueli — Gypsy Festival Tilburg and the Dutch rooms. The first name is a dedication; the right hand still has to earn it.",
  "holzmano-lagrene":
    "Holzmano Lagrène (also Holzmano Winterstein) was born in 1952 in Molsheim, Alsace. Rhythm guitar: Schnuckenack Reinhardt Quintett from 1969, then Häns’che Weiss, later Biréli Lagrène and Wawau Adler. The Gipsy Project pompe under Biréli, Florin Niculescu and Diego Imbert is the same chair.",
  "dario-napoli":
    "Dario Napoli is an Italian guitarist whose path started in New Orleans — blues, rock and modern jazz — and then turned to manouche. He leads a trio (often with Benji Winterstein on rhythm), has shared stages with Stochelo Rosenberg and Robin Nolan, runs Full Immersion camps with Benji, and released Sicilian Blood in 2026, his seventh album. Official bio: darionapoli.com/bio.",
  "marcia-bamberg":
    "Marcia Bamberg is a Dutch singer who put the voice back into gypsy jazz. The Marcia Bamberg Swing Quartet formed in 2018, took its cue from Festival Django Reinhardt, and has worked the Netherlands, Germany, Portugal, England and the Samois stages. She teaches in Obdam, Noord-Holland — private lessons and the workshop The Essence of the Voice. Official site: marciabamberg.nl.",
  "john-ligthart":
    "John Ligthart is lead guitar of the Marcia Bamberg Swing Quartet and of Centre Ville with violinist Koos Koopmans. A Favino, the singing Dutch school — authentic enough for Sinti guests, open enough for a singer out front. He has sat in with Paulus Schäfer, Robin Nolan, Koen De Cauter and Jelle van Tongeren.",
  "ronald-weel":
    "Ronald Weel is rhythm guitar of the Marcia Bamberg Swing Quartet and of Centre Ville. Pompe and time that let a singer and a lead sit still. He has also held rhythm for Paulus Schäfer and Mozes Rosenberg.",
  "christiaan-van-hemert":
    "Christiaan van Hemert is a Dutch violinist and guitarist, a first-call guest with the Rosenberg Trio and with Stochelo’s other groups. He teaches at Codarts (Rotterdam University of the Arts), runs The Rosenberg Academy online with Stochelo, and plays with the Marcia Bamberg Swing Quartet. Guests have included Mozes Rosenberg, Fapy Lafertin, Tchavolo Schmitt, Joscho Stephan, Paulus Schäfer and Roby Lakatos. Official site: christiaanvanhemert.com.",
  "christine-tassan":
    "Christine Tassan is a Québec guitarist, singer and composer, classically trained, who founded Christine Tassan et les Imposteures in 2003. The group has played hundreds of festivals — including Festival Django Reinhardt, DjangoFest Northwest and the Montreal International Jazz Festival — and has seven albums, among them Entre Félix et Django (Opus Prize, Jazz Album of the Year 2017), Django Belles (2018) and Sur la route (2024). Official biography: christinetassan.com.",
  "marion-lenfant-preus":
    "Marion Lenfant-Preus is a Franco-American singer, lyricist and scat improviser, raised in France in a bilingual family. Since 2011–12 she has toured with guitarist Alexander “Sobo” Sobocinski as Marion & Sobo Band, based around Bonn: original songs, chanson and folklore, in several languages including French and Romanes. Official page: marionandsobo.com.",
  "alexander-sobocinski":
    "Alexander “Sobo” Sobocinski is a Polish guitarist based in Germany. He met singer Marion Lenfant-Preus at a Bonn jazz session; together they have led Marion & Sobo Band since 2011–12 — vocal gypsy jazz, chanson and original writing, from duo to quintet. Official page: marionandsobo.com.",
  "nuno-marinho":
    "Nuno Marinho is a Portuguese guitarist of the current European circuit. Official site: nunomarinho.com. He shares festival bills with players such as Tim Kliphuis — Lisbon and Coimbra on the Django Portugal programme — and keeps a manouche right hand on a Portuguese stage.",
  "remi-harris":
    "Remi Harris is a British guitarist of the living circuit. Official site: remiharris.com. Gypsy jazz lead with a concert-hall presentation, on bills that also call Christiaan van Hemert and the Dutch school.",
  "denis-chang":
    "Denis Chang is a Taiwanese-Canadian guitarist, now based in Japan — musician and the teacher behind DC Music School. One of the few non-Roma players fluent in Romani. He returns each year to Taipei Gypsy Jazz Festival. Lived in Japan since 2021 (Tokyo). October 2026 leader mini-tour: Tokyo, Osaka, Setouchi Django Street, with Reilly Farrell, Alison Zhen and Hanaoka Toshio. YouTube @DenisChangMusic and the DC Music School channel, plus Django in June chairs, made the style readable for players who will never live next to a Sinti camp.",
  "paul-mehling":
    "Paul “Pazzo” Mehling, born in Denver and raised in what became Silicon Valley, founded the Hot Club of San Francisco in 1991 after years in traditional jazz bands. He started guitar at six, added violin and the mandolin family, and built an American Hot Club group that plays Reinhardt–Grappelli instrumentation, pop songs and his own writing. First album QHCSF, 1992. Official band site: hotclubsf.com.",
  "hugo-guezbar":
    "Hugo Guezbar is a French guitarist of the current generation, heard with Benji Winterstein and on festival bills beside Fanou Torracinta. Contemporary French lead, Winterstein pompe underneath.",
  "justin-geisler":
    "Justin Geisler is German Sinti guitar of the Geisler family. Festival Django Reinhardt with Hugo Guezbar, and the family record Gypsy Summit with his father Mogeli Geisler and Wawau Adler.",
  "giacomo-smith":
    "Giacomo Smith is a clarinettist who sits with Mozes Rosenberg and other Dutch leads. The reed chair inside a guitar music — swing clarinet on pompe.",
  "koos-koopmans":
    "Koos Koopmans is a Dutch violinist, leader of Centre Ville with John Ligthart and Ronald Weel. Official site: kooskoopmans.nl. The Dutch violin chair that also runs its own band.",
};

const FEATURED_GROUP_BIOS: Record<string, string> = {
  "rosenberg-trio":
    "The Rosenberg Trio formed in 1989 in Helmond: Stochelo Rosenberg on lead, Nous’che Rosenberg on rhythm, Nonnie Rosenberg on bass. Cousins, Sinti family, and the working unit that took Dutch gypsy jazz around the world — Carnegie Hall, the Concertgebouw, Samois, Marciac, North Sea Jazz. Sinti Music still books the name as the family trio.",
  "tata-mirando-orkest":
    "The Weiss family orchestra under Tata Mirando (Joseph Weiss, 1895–1967). Dutch Sinti house. Een zwaar hart (2001) bills Nello Mirando Jr. primas, Kokalo piano, Nello Sr. guitar, Lupa bass, Nello 3e violin, Bokkie Vink cimbalom. Hungarian csárdás, Romanian song, and sometimes gypsy jazz.",
  "mera-gypsy-band":
    "Village orchestra from Méra, Kalotaszeg, Cluj County, Romania. Fodor Sándor “Neti” (1922–2004) primas, Fodor Sándor Jr. violin, Urszui Kálmán viola, Pusztái Aladár bass. Een zwaar hart (2001) bills this lineup. Urszui also sits on the film’s Romania card with Lako Aladar.",
  "taraful-palatca":
    "Palatka Gypsy Band from Pălatca, Cluj County, Romania. Een zwaar hart (2001) bills Florin Codoba primas, Martin Codoba violin, Laurenţiu Codoba and Ştefan Moldovan viola, Covaci Puchi bass. Transylvanian village music, not a Hot Club quintet.",
  "the-gypsy-boys":
    "Dutch gypsy orchestra named in Een zwaar hart (2001) as Orkest The Gypsy Boys, in the thanks beside Tata Mirando. Same Dutch Sinti-orchestra world, not a weekly jam.",
  "ocho-gadje":
    "Dutch gypsy orchestra named in Een zwaar hart (2001) as Orkest Ocho Gadje. Gadje is the Romani word for non-Roma. Billed in the thanks beside The Gypsy Boys.",
  "buffo-rigo-gypsy-band":
    "Hungarian gypsy orchestra around primas Sándor “Buffo” Rigó. The Best of Tradition (1993). Een zwaar hart thanks him beside Sándor Járóka.",
  "jaroka-mirando-band":
    "Later Mirando family band. Hungarian and Romanian chairs in the Dutch Sinti rooms. Gypsy Festival Tilburg, Cultuurbos Bosvreugd, 22 August 2026 — same woods as the Rosenberg and Basily bills.",
  "veres-lajos-orchestre":
    "Hungarian gypsy orchestra under primas Veres Lajos (1912–1981). Gipsy Souvenirs (1953) — Hungarian, Romanian and Russian gypsy melodies — later in the BnF collection (World Europe).",
  "sandor-jaroka-orchestra":
    "Budapest primas orchestra. Sándor Járóka (1922–1984), then his son Sándor Járóka Jr (1954–2007). At the father’s funeral the Budapest Gypsy Symphony Orchestra was born.",
  "lajos-boross-gypsy-band":
    "Budapest primas Lajos Boross (1925–2014) and his gypsy orchestra.",
  "georges-boulanger-orchestra":
    "Gheorghe Pantazi (1893–1958), billed Georges Boulanger. Romanian violin orchestra — gypsy colour with Viennese light music. The Great Gypsy Violinist sides, 1934–1939.",
  "mozes-rosenberg-trio":
    "Mozes Rosenberg’s working trio: his lead, Daniel Rosenberg on rhythm, Matheus Nicolaiewsky on double bass. Helmond swing, bossa and original writing from the Dutch Rosenberg school. Sinti Music lists the group beside Stochelo’s.",
  "django-rosenberg-trio":
    "Django Rosenberg, Noekie Basily and Daniel Gueli. Dutch Sinti lead and guitar with Gueli on double bass — one band, not a pickup. Gypsy Festival Tilburg at Bosvreugd is on their book.",
  "stochelo-mozes-rosenberg-trio":
    "Stochelo and Mozes Rosenberg as a working trio — two Helmond chairs, one bill. Gypsy Festival Tilburg and the Dutch rooms. The brothers’ shared book, not a guest spot.",
  "kings-of-strings":
    "Stochelo Rosenberg, Paulus Schäfer and Mozes Rosenberg billed as Kings of Strings. Three Dutch Sinti leads, Sinti Music. A rare night when the family and Schäfer’s school sit as one group.",
  "quintette-du-hot-club-de-france":
    "The group Django Reinhardt and Stéphane Grappelli formed in 1934: all strings, no drums, no brass. Joseph Reinhardt and Roger Chaput on rhythm, Louis Vola on bass. The records — Minor Swing, Djangology, Nuages — are still the public face of this music.",
  "marcia-bamberg-swing-quartet":
    "Dutch singer Marcia Bamberg with John Ligthart on lead, Ronald Weel on rhythm, and a bass chair that has included Daniel Gueli; Christiaan van Hemert guests on violin. Formed in 2018 after years of playing together, they took Festival Django Reinhardt as a cue and work the Netherlands, Germany, Portugal, England and Samois. Official site: marciabamberg.nl.",
  "centre-ville":
    "Dutch group around violinist Koos Koopmans, with John Ligthart on lead and Ronald Weel on rhythm. The same pompe that holds the Marcia Bamberg nights, now with the violin out front. kooskoopmans.nl.",
  "dario-napoli-trio":
    "Italian guitarist Dario Napoli’s working trio — often Benji Winterstein on rhythm. Modern manouche: swing, bebop and original writing, from the Duc des Lombards to Django in June. Sicilian Blood (2026) is the current record. darionapoli.com.",
  "gismo-graf-trio":
    "German Sinti guitarist Gismo Graf’s trio, festival circuit including Festival Django Reinhardt. The current German school in working-band form. gismograf.de.",
  "paulus-schafer-dominique-paats":
    "Duo of Paulus Schäfer and Dominique Paats — Dutch Sinti guitar with a second chair that can take the lead. Tours such as Sous le Ciel de Paris. Sinti Music books the pair.",
  "tim-kliphuis-group":
    "Dutch violinist Tim Kliphuis’s groups: Grappelli language, folk and classical rooms, mixed line-ups rather than a family band. Education sits beside the concert book. timkliphuis.com.",
  "gonzalo-bergara-group":
    "Gonzalo Bergara’s working band — Argentine guitar, pompe in 4/4, original writing from the Los Angeles and Buenos Aires years. gonzalobergara.com.",
  "christine-tassan-et-les-imposteures":
    "Québec gypsy jazz and swing group founded in 2003 by guitarist-singer Christine Tassan. Hundreds of festivals (Samois, DjangoFest Northwest, Montreal Jazz), seven albums including the Opus-winning Entre Félix et Django (2017), Django Belles (2018) and Sur la route (2024). christinetassan.com.",
  "marion-and-sobo-band":
    "Franco-American singer Marion Lenfant-Preus and Polish guitarist Alexander “Sobo” Sobocinski, based around Bonn since 2011–12. Original songs, chanson and folklore in several languages, from duo to quintet. marionandsobo.com.",
  "hot-club-of-san-francisco":
    "American gypsy jazz band founded in 1991 by guitarist Paul “Pazzo” Mehling. Reinhardt–Grappelli instrumentation, pop songs and Mehling’s writing; first album QHCSF in 1992. Violin (Evan Price among the chairs), rhythm and bass. hotclubsf.com.",
  "the-lost-fingers":
    "Québec group that took manouche guitar into pop repertoire and back. A public face of gypsy jazz in French Canada, on bills that also know Christine Tassan. thelostfingers.com.",
  "dance-of-joy":
    "German gypsy jazz group around Dominique Paats — dance-floor swing as much as concert music. Official site: dance-of-joy.de.",
  "fanou-torracinta-quartet":
    "Fanou Torracinta’s working quartet — French lead, a band rather than a pickup. Festival Django Reinhardt and the Paris rooms.",
  "adrien-moignard-quartet":
    "Adrien Moignard’s quartet — current French lead guitar. The 2026 album Miroirs is the Gipsy 4tet with Benji Winterstein, Julien Cattiaux and Fabricio Nicolas-Garcia. Album night 11 September 2026 at Sunset, Paris.",
  "the-rosenbergs":
    "Mozes Rosenberg with Johnny Rosenberg and Sani van Mullem — another Helmond billing of the family name. Dutch Sinti guitar as a band, beside the Mozes Trio.",
  "mozes-rosenberg-giacomo-smith-quartet":
    "Mozes Rosenberg with clarinettist Giacomo Smith. Guitar and reed on pompe — the Dutch lead opening the book to swing clarinet.",
  "andreas-oberg-trio":
    "Andreas Öberg’s trio — Swedish guitar, Django to bebop. A small group for a player who treats manouche as one dialect among several.",
  "frank-vignola-group":
    "Frank Vignola’s group — New York swing guitar with a deep Django book. American club and festival nights under his own name.",
  "lollo-meier-trio":
    "Lollo Meier’s trio — Dutch Sinti guitar, the old language at conversational speed. Limburg time, not a virtuoso race.",
  "nomy-rosenberg-trio":
    "Nomy Rosenberg’s trio — Dutch Sinti guitar, classic Django from Holland. Another Rosenberg billing on the family circuit.",
  "raphael-fays-quartet":
    "Raphaël Faÿs’s quartet. Classical training inside a manouche right hand — the concert-hall guitar in working-band form.",
  "manetti-brothers":
    "Richard and Pierre Manetti — two French leads who share a family pompe and split the solos. Festival Django Reinhardt bills them as a pair.",
  "lulo-reinhardt-group":
    "Lulo Reinhardt’s group — German Sinti guitar, Latin colours and the straight book, festival circuit under the family name.",
};

/** Featured copy wins over rest-file research when both exist. */
export const ARTIST_BIOS: Record<string, string> = {
  ...REST_ARTIST_BIOS,
  ...FEATURED_ARTIST_BIOS,
};

export const GROUP_BIOS: Record<string, string> = {
  ...REST_GROUP_BIOS,
  ...FEATURED_GROUP_BIOS,
};

const STUB =
  /this page opened from a date|short bio will follow|on the gypsy jazz circuit\. this page/i;

function prettySlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function applyArtistBio<T extends { slug: string; bio: string; name?: string; origin?: string; instruments?: string; years?: string; notable?: string }>(
  row: T,
): T {
  const overlay = ARTIST_BIOS[row.slug];
  if (overlay) return { ...row, bio: overlay };
  if (row.bio && !STUB.test(row.bio) && row.bio.trim().length >= 100) return row;
  const name = row.name?.trim() || prettySlug(row.slug);
  const inst = (row.instruments || "gypsy jazz").trim();
  const origin = row.origin?.trim();
  const years = row.years?.trim();
  const notable = row.notable?.trim();
  const yearBit = years && years !== origin ? ` (${years})` : "";
  const from = origin ? ` from ${origin}` : "";
  const notableBit = notable ? ` ${notable.replace(/;\s*/g, " · ")}.` : "";
  const bio = `${name}${yearBit} plays ${inst.toLowerCase()}${from}.${notableBit} Dates, clips and shout-outs for this player live on this page.`.replace(
    /\.\./g,
    ".",
  );
  return { ...row, bio };
}

export function applyGroupBio<T extends BioBand>(band: T): T {
  const overlay = GROUP_BIOS[band.slug];
  if (overlay) return { ...band, bio: overlay };
  if (band.bio && band.bio.trim().length >= 90) return band;
  const names = band.members.map((slug) => {
    const name = prettySlug(slug);
    const role = band.roles?.[slug];
    return role ? `${name} on ${role.toLowerCase()}` : name;
  });
  let chairs = names[0] ?? "the current chairs";
  if (names.length === 2) chairs = `${names[0]} and ${names[1]}`;
  else if (names.length > 2) chairs = `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  const n = band.members.length;
  const kind = n <= 2 ? "group" : n === 3 ? "trio" : n === 4 ? "quartet" : n === 5 ? "quintet" : "ensemble";
  const place = band.origin || band.country;
  const bio = `${band.name} is a gypsy jazz ${kind} based in ${place}, with ${chairs}. Nights they play are collected on this page.`;
  return { ...band, bio };
}
