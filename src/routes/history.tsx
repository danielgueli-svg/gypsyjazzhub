import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CircleNotes } from "@/components/history-circle";
import { HistoryDoors } from "@/components/history-doors";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { listHistoryCircleNotes, type HistoryCircleNote } from "@/lib/hub-api";
import { artistItunes, artistSpotify } from "@/lib/music";
import { artistPhoto, groupPhoto } from "@/lib/photos";
import { ROMANI_MUSIC_SITE } from "@/lib/romani-music";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/history")({
  head: () => pageHead(SEO.history),
  loader: async () => ({ notes: await listHistoryCircleNotes() }),
  component: HistoryPage,
});

const FILMS = [
  {
    year: "1939",
    title: "J'attendrai Swing",
    note: "The only known sound film of Django and Grappelli playing together — Quintette du Hot Club de France, short film Le Jazz Hot.",
    url: "https://www.youtube.com/watch?v=fBBqsgicUeQ",
  },
  {
    year: "1937",
    title: "Minor Swing",
    note: "The first recording. Django, Grappelli, Joseph Reinhardt — the record every jam still starts from.",
    url: "https://www.youtube.com/watch?v=uTlo809EIlo",
  },
  {
    year: "1940",
    title: "Nuages",
    note: "Django in occupied Paris. Grappelli was already in London. The ballad that became the anthem.",
    url: "https://www.youtube.com/watch?v=PcgI-dNGvIY",
  },
  {
    year: "1949",
    title: "I Got Rhythm — Rome",
    note: "After the war they found each other again. Rome, January 1949 — Grappelli's violin back over Django's guitar.",
    url: "https://www.youtube.com/watch?v=6JFqD47fKUQ",
  },
] as const;

const SECTIONS = [
  {
    title: "Origins and the long road",
    body: [
      "Linguistic and genetic research points to an origin in northwestern India more than a thousand years ago. Groups moved slowly westward through Persia, Armenia, and the Byzantine world, reaching the Balkans by the late Middle Ages. From the early fifteenth century, written records appear in Western Europe. In 1417 a group is mentioned in Hildesheim. In 1420 they are recorded in the Netherlands and Belgium. In 1427 a larger party arrives near Paris. These travellers were often called “Egyptians” in the chronicles. Among themselves they later became known as Sinti in the German-speaking lands and Manouche in France.",
    ],
  },
  {
    title: "Life in Western Europe",
    body: [
      "Over the centuries the Sinti established a continuous presence in Germany, France, the Netherlands, and Belgium. Many remained mobile, working as craftsmen, horse traders, and musicians. Others settled while keeping strong family networks that crossed borders. Music was central. Small string ensembles — violins, later guitars, and double bass — played for dances, fairs, and private gatherings. The repertoire absorbed local colours: Hungarian-influenced scales, French musette waltzes, German and Dutch folk tunes. Yet the core style remained recognisably Sinti, passed from parent to child by ear.",
    ],
  },
  {
    title: "Music before Django",
    body: [
      "By the nineteenth and early twentieth centuries these musical families were firmly rooted in the countries that would become the heartland of Gypsy jazz. In Germany the name Sinti had become the preferred self-designation. In France the related Manouche families lived around Paris and in the east. In the Netherlands and Belgium smaller but continuous groups maintained the same traditions of travel, craft, and music. The sound that later became known as Gypsy jazz already existed in embryo: strong rhythm, emotional melody, and an oral way of learning.",
    ],
  },
  {
    title: "What to call it",
    body: [
      "The families did not wait for a critic to name the music. Records later said gypsy jazz, or jazz manouche. Gypsy is the outside word. Sinti, in the German-speaking lands, and Manouche, in France, are the words many of the families use for themselves. This house is not Balkan brass, not flamenco, not the Hungarian restaurant orchestra, even when those colours pass through the same hands. It is a Sinti and Manouche music, built in the 1930s on older family playing, and still lived in.",
    ],
  },
  {
    title: "Django and the birth of a style",
    body: [
      "In the 1930s one of those musicians changed everything. Jean “Django” Reinhardt, born into a Manouche family with roots linking Belgium, France, and the wider Sinti world, fused the old family style with the new American jazz he heard in Paris. With the Quintette du Hot Club de France he created a sound that was both modern and deeply rooted: the driving “la pompe” rhythm, the fiery single-note lines, the emotional depth that came from generations of oral tradition. Django did not invent Sinti music. He carried it into a new century and gave it a name the wider world would recognise.",
    ],
  },
  {
    title: "The Claridge and the Club",
    body: [
      "In the summer of 1934 Django and Grappelli were already in Louis Vola’s band at the Hôtel Claridge on the Champs-Élysées. After the paid set they kept playing in a side room. Pierre Nourry and Charles Delaunay, from the Hot Club de France — a listeners’ society around Hugues Panassié — heard it and pushed them to become a group. The first sides that winter sometimes went out as “Delaunay’s Jazz.” The musicians made the music. The Club gave it a door and, later, the Swing label that carried the records.",
    ],
  },
  {
    title: "The guitar and the pompe",
    body: [
      "The style has a body you can hold. In the early 1930s Mario Maccaferri drew a steel-string guitar for the Selmer shop in Paris: a cutaway, an internal resonator, first a wide D-shaped soundhole, later a smaller oval. Maccaferri left the firm in 1933. Selmer kept the oval-hole model. Django played it. The guitar was loud enough for a dance room with no pickup. Players of this music still look for that shape, or an honest copy of it.",
      "The rhythm guitar’s right hand is la pompe. A down-stroke that lands like a bass drum, a light catch like a snare, no drummer required. Nobody learns it from a page. You watch an uncle until the room locks, then the violin and the lead guitar can leave the ground.",
    ],
  },
  {
    title: "The war against the Sinti",
    body: [
      "The music did not pass through the 1940s unharmed. Across German-speaking Europe the Nazi state hunted Sinti and Roma. Families were registered, deported, and murdered. At Auschwitz-Birkenau a family camp held about twenty-three thousand; almost none of them came home. The total killed across Europe is counted in the hundreds of thousands. This is not a side note to the records. It is why so many German Sinti players of the next generation treated Django’s tunes as survival, not nostalgia.",
      "Django remained in occupied France. Fame, patrons, and luck kept him alive in a country that was sending Romani people to their deaths. Grappelli was in London. The Quintette as it had been was over.",
      "Franz “Schnuckenack” Reinhardt, a German Sinti violinist and a relative of Django’s line, never met him. In 1938 his family was driven east. They lived in Częstochowa under a false paper, always moving. He escaped shooting more than once. A younger brother did not: Auschwitz. After the war Schnuckenack put the music on German stages so a public that had tried to erase it would have to hear it.",
    ],
  },
  {
    title: "After Django — a living tradition",
    body: [
      "After his death the music did not disappear. In the 1960s and 1970s a new generation of German Sinti musicians — Schnuckenack Reinhardt, Häns’che Weiss, Titi Winterstein and others — revived and strengthened the style, treating Django’s legacy as part of their own living heritage. The same pattern held in France and the Low Countries: fathers teaching sons, uncles teaching nephews, the repertoire expanding while the core feeling remained.",
      "Today the music still travels the same roads. The jam sessions in Paris, the camps in the Netherlands, the festivals in Germany, the family gatherings that keep the old tunes alive — all sit on a foundation older than any recording. For many Sinti families, Gypsy jazz is not only a style. It is also a way of remembering where they have been and who they are.",
      "In the Netherlands a small association took the old Paris name. Stichting Hot Club de France Nederland was founded in 1983 to keep Django and Grappelli’s style heard when almost nobody was playing it live. Their first concert was the WASO Quartet. Forty years on they still list the jams, print De Quintette, and count about a hundred Hot Club bands in the country. That is the amateur and professional circle around the Rosenberg, Schäfer and Basily families — not a replacement for them.",
    ],
  },
  {
    title: "Paris besides Django",
    body: [
      "Django was not the only guitar in those rooms. The Ferret brothers — Baro, Sarane, and Matelo — came from Rouen to Paris and sat beside him, and sometimes in his place. They played musette, the Russian cabarets, and the Quintette sides. When Django’s records went quiet, that Paris line did not. Matelo lived long enough to put on disc waltzes Django had never recorded. Matelo’s sons Boulou and Elios Ferré kept a later Paris guitar on stage.",
    ],
  },
  {
    title: "Forbach",
    body: [
      "Forbach is a Moselle town on the German border. A lot of the Sinti guitar from eastern France comes from the families there — Winterstein, Schmitt, Reinhardt, Mehrstein.",
      "People say Forbach style when they mean a heavy pompe: family rhythm, lead on top, not a café pickup band. Hono Winterstein was born in Forbach in 1962. He played that rhythm for Dorado Schmitt, Tchavolo Schmitt, and from 2001 for Biréli Lagrène, including tours in the United States and Japan. His brother Popots (Jean-Louis, born 1964) started with Dorado in Metz in 1980. Popots’s son Benji plays rhythm. Brady, Hono’s nephew, plays lead in Hono’s trio.",
      "In 2018 Popots and Daniel Fioriti started a jazz manouche festival at the Burghof in town. Afternoon is free. Nights are ticketed. It is Forbach’s own festival, not a small Samois.",
      "Titi Winterstein, the German violinist (1956–2008), is the same name from the other side of the border. Häns’che Weiss took him into the quintet at fifteen. His cousins Holzmanno and Ziroli played guitar. The 1970s German records — Schnuckenack, Häns’che, Titi — belong with this story. Forbach is the French-Moselle house of that Sinti world.",
    ],
  },
  {
    title: "Django’s house",
    body: [
      "The famous name had a house around it. Joseph “Nin-Nin” Reinhardt, the younger brother, held the pompe on the pre-war records. Naguine kept the household in Samois, where Django fished and painted and died. Lousson, the first son, stayed on the road and left few records. Babik, the second, played a more modern jazz and refused to be a copy. They are buried, with Joseph, at Samois. The line still plays.",
    ],
  },
  {
    title: "The unrecorded",
    body: [
      "Most of this music never saw a microphone. Waso Grünholz is the famous case on this page. There were others: an uncle on rhythm, a cousin who knew a waltz that never got a title, a singer who never left the family circle. The archive is the family. The records are what leaked out.",
      "This history does not end in the past. It continues every time a young player picks up a guitar or a violin and learns the rhythm the way it has always been learned: by ear, by heart, and from the people who came before.",
    ],
  },
] as const;

const ARCHIVE = [
  {
    src: "/archive/django-gottlieb-07301.jpg",
    alt: "Django Reinhardt at the Aquarium, New York, 1946",
    caption: "Django Reinhardt, Aquarium, 1946",
    credit: "William P. Gottlieb / Library of Congress",
    href: "https://www.loc.gov/pictures/item/gottlieb.07301/",
  },
  {
    src: "/archive/django-gottlieb-07311.jpg",
    alt: "Django Reinhardt playing guitar at the Aquarium, New York, 1946",
    caption: "Django at the Aquarium, 1946",
    credit: "William P. Gottlieb / Library of Congress",
    href: "https://commons.wikimedia.org/wiki/File:Django_Reinhardt,_Aquarium,_New_York,_N.Y.,_ca._Nov._1946_(William_P._Gottlieb_07311).jpg",
  },
  {
    src: "/archive/django-ellington.jpg",
    alt: "Django Reinhardt and Duke Ellington, Aquarium, New York, 1946",
    caption: "Django Reinhardt and Duke Ellington, 1946",
    credit: "William P. Gottlieb / Library of Congress",
    href: "https://www.loc.gov/pictures/item/gottlieb.07321/",
  },
  {
    src: "/archive/django-rose.jpg",
    alt: "Django Reinhardt and David Rose, Aquarium, New York, 1946",
    caption: "Django Reinhardt and David Rose, 1946",
    credit: "William P. Gottlieb / Library of Congress",
    href: "https://commons.wikimedia.org/wiki/File:Django_Reinhardt_and_David_Rose,_Aquarium,_New_York,_N.Y.,_ca._Nov._1946_(William_P._Gottlieb_07341).jpg",
  },
  {
    src: "/archive/quintette.jpg",
    alt: "Quintette du Hot Club de France",
    caption: "Quintette du Hot Club de France",
    credit: "Public domain (U.S., published without notice)",
    href: "https://commons.wikimedia.org/wiki/File:Quintette_du_hot_club_de_France.jpg",
  },
  {
    src: "/archive/grappelli-warren.jpg",
    alt: "Stéphane Grappelli",
    caption: "Stéphane Grappelli",
    credit: "William P. Gottlieb / Library of Congress",
    href: "https://www.loc.gov/pictures/collection/gottlieb/",
  },
  {
    src: "/archive/samois-2009.jpg",
    alt: "Festival Django Reinhardt, Samois-sur-Seine",
    caption: "Festival Django Reinhardt, Samois",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:30e_festival_Django_Reinhardt_Samois-sur-Seine.jpg",
  },
] as const;

const FIGURES: {
  name: string;
  years?: string;
  role?: string;
  body: string;
  to?: "/django" | "/grappelli" | "/musicians/$slug" | "/groups/$slug" | "/families/$slug";
  slug?: string;
  youtube?: string;
  youtubeNote?: string;
  spotifySlug?: string;
  itunesName?: string;
  appleId?: string;
}[] = [
  {
    name: "Django Reinhardt",
    years: "1910–1953",
    body: "The central figure. Born into a Manouche family, he created the style that became known worldwide as Gypsy jazz.",
    to: "/django",
    youtube: "https://www.youtube.com/watch?v=uTlo809EIlo",
    youtubeNote: "Minor Swing",
    spotifySlug: "django-reinhardt",
    itunesName: "Django Reinhardt",
  },
  {
    name: "Stéphane Grappelli",
    years: "1908–1997",
    body: "Django’s long-time musical partner. The violinist of the Quintette du Hot Club de France, he brought classical precision and swing to the partnership.",
    to: "/grappelli",
    youtube: "https://www.youtube.com/watch?v=fBBqsgicUeQ",
    youtubeNote: "J'attendrai Swing",
    spotifySlug: "stephane-grappelli",
    itunesName: "Stéphane Grappelli",
  },
  {
    name: "Joseph “Nin-Nin” Reinhardt",
    years: "1912–1982",
    role: "Django’s brother. The pompe under the famous line.",
    body: "Django’s younger brother. Rhythm guitar on most of the pre-war Quintette records. After Django died he put the guitar down, then picked it up again. He is buried at Samois beside his brother. The nights were more than the sleeves.",
    to: "/musicians/$slug",
    slug: "joseph-reinhardt",
  },
  {
    name: "Pierre “Baro” Ferret",
    years: "1908–1976",
    role: "Eldest Ferret brother. Friend and rival of Django.",
    body: "The eldest of the Ferret brothers from Rouen. Friend and rival of Django. He sat on a great many Quintette sides. During the Occupation he stepped away from the stage and into other work in Paris. His waltzes stayed in the book. The next Paris guitar often runs through this family.",
    to: "/musicians/$slug",
    slug: "baro-ferret",
  },
  {
    name: "Étienne “Sarane” Ferret",
    role: "Middle Ferret brother. Paris rhythm and lead.",
    body: "Middle brother. Paris rooms, rhythm and lead, often the one holding time while Baro or Django took the chorus. Part of the same Ferret line that made the Quintette possible on nights when Joseph was not in the chair.",
    to: "/musicians/$slug",
    slug: "sarane-ferret",
  },
  {
    name: "Jean “Matelo” Ferret",
    years: "1918–1989",
    role: "Youngest Ferret. The waltzes Django never recorded.",
    body: "The youngest. Musette first — accordion bands, then the Russian cabarets in Paris. He kept Hungarian and Russian colours that Django had set down. In 1960 and 1961 he recorded waltzes Django himself never put on disc, among them Montagne Sainte-Geneviève, Gagoug, Chez Jacquet and Choti. Without those sessions the tunes would have stayed inside the caravans. His sons Boulou and Elios Ferré carry a later Paris guitar.",
    to: "/musicians/$slug",
    slug: "matelo-ferret",
  },
  {
    name: "Schnuckenack Reinhardt",
    years: "1921–2006",
    body: "German Sinti violinist who played a major role in keeping and revitalising the style in Germany after the war. Franz “Schnuckenack” Reinhardt, 1921–2006. The nickname is Sinti: a nice nose. He never met Django, though the families connect. After the war he put Sinti music on German concert stages and kept a great many family tunes on record that would otherwise have stayed unwritten.",
    to: "/musicians/$slug",
    slug: "schnuckenack-reinhardt",
    youtube: "https://www.youtube.com/watch?v=-fqWzXRXP7M",
    youtubeNote: "Strasbourg 2001",
    spotifySlug: "schnuckenack-reinhardt",
    itunesName: "Schnuckenack Reinhardt",
  },
  {
    name: "Häns’che Weiss",
    body: "Influential German Sinti guitarist whose work helped carry the tradition forward in the post-war decades.",
    youtube: "https://www.youtube.com/watch?v=gfdgNK1RXYs",
    youtubeNote: "Tut Hi Tschi Man Hi Tschi",
    spotifySlug: "hansche-weiss",
    itunesName: "Häns'che Weiss",
  },
  {
    name: "Titi Winterstein",
    years: "1956–2008",
    body: "Another key figure in the German Sinti revival, known for his strong rhythmic playing and commitment to the family style. 1956–2008. Violin. German Sinti. Father Tokeli survived the Nazi years when much of the family did not. First stage: Sinti pilgrimage, Illingen, 1965. Häns’che Weiss took him at fifteen. Own quintet from 1978, six records, Django Reinhardt prize 2003. Died in Offenburg.",
    youtube: "https://www.youtube.com/watch?v=yG45rZeNtsM",
    youtubeNote: "Bonn 1987",
    spotifySlug: "titi-winterstein",
    itunesName: "Titi Winterstein",
  },
  {
    name: "Ziroli Winterstein",
    role: "Rhythm, then lead. Titi’s band, then the solo chair.",
    body: "Brother of Holzmanno. Father Prinzo. Häns’che Weiss Quintett from 1972, then Titi’s band; after Lulu Reinhardt left, Ziroli took the solo chair. Played duo with cousin Biréli Lagrène and opened nights for Paco de Lucía, Al Di Meola and John McLaughlin.",
  },
  {
    name: "Holzmanno Winterstein (also Holzmanno Lagrène)",
    years: "Born 1952, Molsheim, Alsace",
    role: "Rhythm guitar. Schnuckenack, then Häns’che, then Biréli.",
    body: "Rhythm guitar. Schnuckenack Reinhardt Quintett from 1969, then Häns’che Weiss with his brother Ziroli. Later with Titi, Biréli Lagrène and Wawau Adler. One of the German-French Sinti chairs that taught the next rooms how the pompe should feel.",
  },
  {
    name: "Hono Winterstein (Paul)",
    years: "Born 27 February 1962, Forbach",
    role: "The Forbach rhythm chair. Dorado, Tchavolo, Biréli.",
    body: "Rhythm guitar. The Forbach chair. Dorado Schmitt, Tchavolo Schmitt, Samson Schmitt, then Biréli Lagrène from 2001 (United States and Japan). Own trio with nephew Brady. Album Horizons (2019).",
    to: "/musicians/$slug",
    slug: "hono-winterstein",
  },
  {
    name: "Popots Winterstein (Jean-Louis)",
    years: "Born 29 May 1964, Forbach",
    role: "Hono’s brother. Co-founded the Forbach festival.",
    body: "Rhythm guitar. First nights with Dorado Schmitt, Metz, 1980. Father of Benji. Co-founded Festival de jazz manouche de Forbach in 2018 with Daniel Fioriti.",
  },
  {
    name: "Brady Winterstein",
    role: "Lead guitar. Hono’s nephew. Forbach / Alsace.",
    body: "Lead guitar. Trio with Hono. Played the Forbach festival (including 9 May 2026 with Sanseverino and Hervé Poulikin).",
    to: "/musicians/$slug",
    slug: "brady-winterstein",
  },
  {
    name: "Benji Winterstein",
    years: "Born 1991",
    role: "Rhythm. Popots’s son. Forbach.",
    body: "Rhythm guitar. First concert at the Carreau de Forbach. Holds time with his father; has sat with Samson Schmitt.",
    to: "/musicians/$slug",
    slug: "benji-winterstein",
  },
  {
    name: "Waso (Wasso) Grünholz",
    body: "A legendary, largely unrecorded Sinti guitarist from the Netherlands. He never made commercial records, yet he taught and deeply influenced a whole generation, including Stochelo Rosenberg, Jimmy Rosenberg, Paulus Schäfer, Fapy Lafertin, Tcha Limberger and many others. His waltzes and style still circulate inside the community.",
    youtube: "https://www.youtube.com/watch?v=IXwL8IgrChQ",
    youtubeNote: "With Stochelo Rosenberg",
  },
  {
    name: "Bamboula (Edouard) Ferret",
    years: "1919–2008",
    body: "Belgian Manouche musician, uncle of Fapy Lafertin. He played guitar, violin and sang, travelling between Flanders and France. He performed with the older generation (including Piotto Limberger and Latcheben Grünholz) and later recorded rare songs in Romanes with his nephew Fapy. His waltz “Valse de Bamboula” is still played today.",
    youtube: "https://www.youtube.com/watch?v=o9gxuTHWATU",
    youtubeNote: "With Fapy Lafertin",
    spotifySlug: "bamboula-ferret",
    itunesName: "Bamboula Ferret Fapy Lafertin",
    appleId: "bamboula-ferret-fapy-lafertin/440515141",
  },
  {
    name: "Tchan Tchou (Paul) Vidal",
    years: "1923–1999",
    body: "Major figure of the southern French school. Born near Aix-en-Provence, he stayed mostly in the Midi rather than moving to Paris. Known for a strong, melodic style that mixed swing with Mediterranean colours (boleros, rumbas, Corsican influences). His composition “La Gitane” became a test piece for guitarists.",
    to: "/musicians/$slug",
    slug: "tchan-tchou-vidal",
    youtube: "https://www.youtube.com/watch?v=jzZDeZngB5g",
    youtubeNote: "La Gitane",
    spotifySlug: "tchan-tchou-vidal",
    itunesName: "Tchan Tchou Vidal",
  },
  {
    name: "Fapy Lafertin",
    years: "Born 1950",
    body: "Belgian Manouche guitarist, widely regarded as one of the purest and most elegant modern heirs of Django’s style. He started in family bands, played with Piotto Limberger, then became lead guitarist of the influential Waso Quartet in the 1970s and 1980s. Later led his own groups and worked with many international musicians. Still active and highly respected.",
    to: "/musicians/$slug",
    slug: "fapy-lafertin",
    youtube: "https://www.youtube.com/watch?v=dbcWp1cxf20",
    youtubeNote: "London 2023",
    spotifySlug: "fapy-lafertin",
    itunesName: "Fapy Lafertin",
  },
  {
    name: "Henri “Lousson” Reinhardt",
    years: "1929–1992",
    role: "Django’s first son. Few records, the travelling life.",
    body: "Django’s first son, known as Lousson Reinhardt; papers also called him Henri Baumgartner. He kept the travelling life and a modern ear. Few records, little patience for the press. He is buried at Samois with his father and his uncle Joseph. The public barely saw him. The families did.",
  },
  {
    name: "Babik Reinhardt",
    years: "1944–2001",
    role: "Django and Naguine’s son. A later jazz, not a copy.",
    body: "Jean-Jacques “Babik” Reinhardt, Django and Naguine’s son. His father died when he was nine. Uncles taught him guitar; Django had wanted piano for him, thinking there would be more work. He played a more modern jazz and did not try to be a copy. His son David Reinhardt still leads a trio. The name did not stop at the grave.",
    to: "/musicians/$slug",
    slug: "babik-reinhardt",
  },
  {
    name: "The Rosenberg family",
    body: "Dutch Sinti family that became one of the most important forces in contemporary Gypsy jazz. Stochelo Rosenberg (lead guitar), with cousins Nous’che (rhythm) and Nonnie (bass), formed the Rosenberg Trio, which brought the style to major stages worldwide. Later generations (including Mozes Rosenberg) continue the line. They learned in the traditional way from family elders, including Waso Grünholz.",
    to: "/musicians/$slug",
    slug: "stochelo-rosenberg",
    youtube: "https://www.youtube.com/watch?v=OWOL45TSweo",
    youtubeNote: "Seresta",
    spotifySlug: "rosenberg-trio",
    itunesName: "The Rosenberg Trio",
  },
  {
    name: "The Limberger family",
    body: "Belgian Manouche family with deep roots in the music. Piotto Limberger led earlier ensembles. His son Vivi Limberger was long-time rhythm guitarist and singer with Waso. Grandson Tcha Limberger (violin, guitar, clarinet, voice) is a major contemporary figure who moves between Gypsy jazz, Hungarian Magyar nóta, and other Romani traditions.",
    to: "/musicians/$slug",
    slug: "tcha-limberger",
    youtube: "https://www.youtube.com/watch?v=CIW0Op0sJ8w",
    youtubeNote: "Dui dui",
    spotifySlug: "tcha-limberger",
    itunesName: "Tcha Limberger",
  },
  {
    name: "Paulus Schäfer",
    years: "Born 1978",
    body: "Dutch Sinti guitarist from the same community as the Rosenbergs. He learned from Waso Grünholz and Stochelo Rosenberg, briefly took over lead guitar in the Gipsy Kids after Jimmy Rosenberg, then formed his own successful groups. Known for a warm, swinging sound and for organising Sinti jazz guitar camps that pass the tradition on.",
    to: "/musicians/$slug",
    slug: "paulus-schafer",
    youtube: "https://www.youtube.com/watch?v=Q0l0vB9uNWY",
    youtubeNote: "You'd Be So Nice",
    spotifySlug: "paulus-schafer",
    itunesName: "Paulus Schäfer",
    appleId: "paulus-schafer/410145518",
  },
  {
    name: "The Schäfer family",
    body: "Part of the same Dutch Sinti network around Gerwen/Nuenen. Several family members play, and Paulus has become the best-known representative of this branch. Family page: Gerwen house, Sendelo, Noah, Pupa, Ollie, and the Sinti Jazz Guitar Camp.",
    to: "/families/$slug",
    slug: "schafer",
  },
  {
    name: "The Basily family",
    body: "Dutch Sinti family, active for at least five generations, from the same network as the Rosenbergs and Schäfers. The Basily family are Dutch Sinti who trace their roots to French Sinti (Manouche). In contrast, the Rosenberg and Schäfer families of the same Dutch scene come from German Sinti lineages. Popy (Johannes) Basily leads the Basily Gipsy Band with Tucsi on violin and Gino and Zonzo on rhythm — later joined by Martin Limberger and Sani van Mullem. They started closer to Hot Club de France style, then mixed Balkan, Spanish and flamenco colours while keeping a strong swing. North Sea Jazz, Samois, Copenhagen, Birdland in New York, and a night with Stéphane Grappelli sit on the book. Albums include Antara (1991), Swing for the Gipsies, Gipsy Moments (2003) and Gipsy Jazz Memories (2005). The sons and nephews — Zonzo, Noekie, Raklo, Morice — formed The Basily Boys around 2007–2009 and reached the Holland’s Got Talent semi-finals. Respected in the Netherlands and Scandinavia, especially Denmark; learned by ear inside the family, not from sheet music.",
    to: "/groups/$slug",
    slug: "basily-gipsy-band",
    youtube: "https://www.youtube.com/watch?v=ZsC7VaUl3dU",
    youtubeNote: "Swing for the Gipsies",
    spotifySlug: "basily-gipsy-band",
    itunesName: "Basily Gipsy Band",
    appleId: "basily-gipsy-band/1785000043",
  },
  {
    name: "Biréli Lagrène",
    years: "Born 1966, Alsace",
    role: "The child who already had the language.",
    body: "A child who already had Django’s language in his hands. Rooms went quiet, then he walked into American jazz and came back. The revival of the late 1970s and 1980s has his name on it.",
    to: "/musicians/$slug",
    slug: "bireli-lagrene",
  },
  {
    name: "Tchavolo Schmitt",
    role: "Alsatian Manouche guitar. The older bite.",
    body: "Alsatian Manouche guitar. A harder, older bite. Family music that did not wait for a festival poster. One of the players who made the 1980s loud again.",
    to: "/musicians/$slug",
    slug: "tchavolo-schmitt",
  },
  {
    name: "Dorado Schmitt",
    years: "Born 1957",
    role: "Alsace. Guitar, violin, a large musical family.",
    body: "Alsace, same world. Guitar and violin in a large musical family. The line continues through children and cousins who still take the stage.",
    to: "/musicians/$slug",
    slug: "dorado-schmitt",
  },
  {
    name: "Boulou Ferré and Elios Ferré",
    years: "Born 1951 and 1956",
    role: "Sons of Matelo. Paris guitar after Django.",
    body: "Sons of Matelo Ferret. Paris after Django: more modern, still in the house. They kept the Ferret name on stage when the 1930s records had gone quiet.",
    to: "/groups/$slug",
    slug: "boulou-elios-ferre",
  },
  {
    name: "Jan de Jong",
    years: "1946–2025",
    body: "Dutch Hot Club guitarist, from the Haarlem jazz rooms of the 1970s. He learned Django from his brother Henk’s records. Rhythm guitar with Fapy Lafertin’s quartet from 1986 (Flip Krajenbrink, Simon Planting), Limehouse Jazz Band, Orkest Polytour with Jean-Pierre Guiran, and a late session with Nick Sansone and Duved Dunayevsky. Colleagues called him a gifted player who got more recognition from other musicians than from the wider public. Stichting Hot Club de France Nederland published his memorial.",
  },
];

const CHAPTERS = [
  {
    year: "Before 1934",
    title: "Musette, caravans, and the banjo",
    body: [
      "Gypsy jazz did not begin in a conservatoire. It began in the bals musette of Paris and the caravan sites of northern France and Belgium, among Sinti and Manouche families who already played waltz, csárdás, and dance-band tunes.",
      "Jean Reinhardt — Django — was born in 1910 in Liberchies, Belgium, and grew up on the road. As a teenager he was a banjo-guitarist in musette bands, loud enough to cut through accordion and dancing feet. The guitar that would later define the music was still a rhythm instrument in those rooms.",
    ],
  },
  {
    year: "1928",
    title: "The fire",
    body: [
      "On the night of 26 October 1928, a fire destroyed the caravan Django shared with his first wife, Bella. He was eighteen. Burns cost him the use of two fingers on his left hand and nearly cost him the leg.",
      "The recovery took years. He rebuilt a technique around two working fingers on the fretboard — index and middle — and a right hand that still had all its attack. The gaps in the old chord shapes became a new language: octaves, diminished runs, and a singing lead line that no conservatory method would have invented.",
    ],
  },
  {
    year: "1934",
    title: "Quintette du Hot Club de France",
    body: [
      "Stéphane Grappelli, a Parisian violinist with a day job in dance orchestras, met Django in the early 1930s. In 1934, with the backing of the Hot Club de France, they recorded as an all-string group: two guitars, violin, and bass. Joseph Reinhardt, Django's brother, often held the rhythm. Roger Chaput or Baro Ferret took the other guitar chair. Louis Vola played bass.",
      "This was the public face of the music. No drums. No brass. A Selmer-Maccaferri guitar with an oval soundhole, a violin that floated, and a pompe — the boom-chick of the rhythm guitar — that made the whole thing dance. Minor Swing, Djangology, Nuages: the records travelled farther than the caravans ever had.",
    ],
  },
  {
    year: "1939–45",
    title: "War, Nuages, survival",
    body: [
      "When war broke out, Grappelli was in London and stayed there. Django remained in occupied France. Romani people were hunted. He survived through a mix of luck, patrons, and the strange protection that fame can give.",
      "Nuages, recorded in 1940, became something like an unofficial anthem — a ballad that French radio could play, and that still sits at the centre of the repertoire. In these years Django also touched electric guitar and big-band colours, never abandoning the string quintet that had made his name.",
    ],
  },
  {
    year: "1946–53",
    title: "America, return, Samois",
    body: [
      "In 1946 Django toured the United States with Duke Ellington, a meeting of two swing aristocracies that was uneven in the halls and legendary in the telling. He came home. The late records — sometimes electric, always lyrical — show a player still changing.",
      "He died on 16 May 1953, at forty-three, in Fontainebleau. He is buried in Samois-sur-Seine, the river village that later gave the music its summer pilgrimage.",
    ],
  },
  {
    year: "1953–80s",
    title: "After Django",
    body: [
      "Grappelli kept the music on the world's stages for another forty-four years, playing with everyone from Yehudi Menuhin to younger Manouche guitarists. In Germany, Schnuckenack Reinhardt led Sinti groups with a rawer swing. In France, Joseph Reinhardt, the Ferret brothers, Tchan Tchou Vidal, and later Babik Reinhardt carried the repertoire through the lean decades.",
      "The revival came from the families as much as from the records. In the 1970s and 80s, a new generation of Sinti and Manouche guitarists — Biréli Lagrène as a child prodigy, the Rosenberg Trio in the Netherlands, Tchavolo and Dorado Schmitt in Alsace — made the music loud again.",
    ],
  },
  {
    year: "1968 →",
    title: "Samois, then the world",
    body: [
      "Festival Django Reinhardt began as a single evening in Samois-sur-Seine in 1968 and became the annual gathering from 1983. The Île du Berceau, and later the park of the Château de Fontainebleau, turned late June into a meeting of clans, students, and famous names. The campsite sessions have always been as important as the billed stages.",
      "From there the circuit spread: Django in June in Massachusetts, clubs in Paris, Amsterdam, New York, Buenos Aires. The pompe travelled. The names on this site — Loeffler, Rosenberg, Schmitt, Ferré, Lagrène, Debarre — are the living proof.",
      "The first public evening in Samois was 19 May 1968, fifteen years after Django’s death. Jean-François Robinet, who lived in the village, helped put a camera there; it was still the spring of the strikes. Friends of Samois came back in 1973 and 1978. In 1983 Robinet and Maurice Cullaz made it yearly. In 2016 the Seine took the Île du Berceau and the billed stages moved to the park of the Château de Fontainebleau. The village still opens the week. The campsite sessions did not wait for a stage.",
    ],
  },
  {
    year: "1983",
    title: "Hot Club de France Nederland",
    body: [
      "A handful of Dutch listeners founded Stichting Hot Club de France Nederland in 1983. Live Hot Club music was scarce; they later remembered only a few bands worldwide, among them the WASO Quartet in Belgium. At the founding meeting Django’s Nuages came on the radio. WASO played the first concert. The association later invited Stéphane Grappelli, printed a quarterly magazine (De Quintette), and organised concert afternoons so the public would not age out of the music the way some dixieland rooms had.",
      "By the 2020s they counted about a hundred Hot Club bands in the Netherlands and more than a hundred jams a year. The Sinti families — Rosenberg, Schäfer, Basily — are the living core. The foundation is the listeners’ and amateur players’ house around them. In 2023 WASO returned for the 40th anniversary, with Fapy Lafertin and Koen de Cauter, and founding chairman Georg Lankester in the room. In 2026 the foundation paused its own concert series after losing Schenkerij De Beurs in Geldermalsen; the scene around it did not pause.",
    ],
  },
  {
    year: "Now",
    title: "A circle, not a museum",
    body: [
      "Gypsy jazz is still a family music and a festival music. It is also a worldwide practice: players who learned from records in Tokyo or Oslo sit in with Sinti guitarists at Samois. The Daniel Gueli Gypsy Jazz Channel films the sessions. Gypsy Jazz Hub is the circle around that — pages, concerts, and the lineage in one place.",
      "The music remains what it was in 1934: strings, swing, and a guitar that sings in spite of what the hand can no longer do.",
    ],
  },
] as const;

const TOC = [
  { id: "story", label: "Story" },
  { id: "houses", label: "Houses" },
  { id: "photographs", label: "Photographs" },
  { id: "on-film", label: "On film" },
  { id: "timeline", label: "Timeline" },
] as const;

const STORY_TITLES = [
  "Origins and the long road",
  "Life in Western Europe",
  "Music before Django",
  "What to call it",
  "Django and the birth of a style",
  "The Claridge and the Club",
  "The guitar and the pompe",
  "The war against the Sinti",
  "After Django — a living tradition",
  "The unrecorded",
] as const;

const HOUSES: {
  id: string;
  name: string;
  label: string;
  essays: string[];
  people: string[];
}[] = [
  {
    id: "paris",
    name: "Paris",
    label: "",
    essays: ["Paris besides Django", "Django’s house"],
    people: [
      "Pierre “Baro” Ferret",
      "Étienne “Sarane” Ferret",
      "Jean “Matelo” Ferret",
      "Boulou Ferré and Elios Ferré",
      "Joseph “Nin-Nin” Reinhardt",
      "Henri “Lousson” Reinhardt",
      "Babik Reinhardt",
    ],
  },
  {
    id: "forbach",
    name: "Forbach",
    label: "",
    essays: ["Forbach"],
    people: [
      "Hono Winterstein (Paul)",
      "Popots Winterstein (Jean-Louis)",
      "Brady Winterstein",
      "Benji Winterstein",
    ],
  },
  {
    id: "germany",
    name: "Germany",
    label: "German Sinti after the war — Schnuckenack, Häns’che, Titi.",
    essays: [],
    people: [
      "Schnuckenack Reinhardt",
      "Häns’che Weiss",
      "Titi Winterstein",
      "Ziroli Winterstein",
      "Holzmanno Winterstein (also Holzmanno Lagrène)",
    ],
  },
  {
    id: "low-countries",
    name: "Low Countries",
    label: "The Netherlands and Belgium — the Rosenberg, Schäfer, Basily, Limberger and Ferret-Lafertin lines.",
    essays: [],
    people: [
      "Waso (Wasso) Grünholz",
      "Bamboula (Edouard) Ferret",
      "Fapy Lafertin",
      "The Rosenberg family",
      "The Limberger family",
      "Paulus Schäfer",
      "The Schäfer family",
      "The Basily family",
      "Jan de Jong",
    ],
  },
  {
    id: "midi",
    name: "Midi and Alsace",
    label: "The southern French school, and the Alsatian Manouche guitar.",
    essays: [],
    people: ["Tchan Tchou (Paul) Vidal", "Biréli Lagrène", "Tchavolo Schmitt", "Dorado Schmitt"],
  },
];

function sectionByTitle(title: string) {
  return SECTIONS.find((section) => section.title === title);
}

function figureByName(name: string) {
  return FIGURES.find((figure) => figure.name === name);
}

export function historyStorySections() {
  return STORY_TITLES.map((title) => sectionByTitle(title)).filter(
    (section): section is (typeof SECTIONS)[number] => Boolean(section),
  );
}

export function historyFigureLine(name: string) {
  return figureByName(name)?.body ?? "";
}

function firstSentence(text: string) {
  const match = text.match(/^.+?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
}

function djangoHeavy(year: string) {
  return year === "Before 1934" || year === "1928" || year === "1934" || year === "1939–45" || year === "1946–53";
}

function grappelliHeavy(year: string) {
  return year === "1934" || year === "1939–45" || year === "1953–80s";
}

function figurePhoto(figure: (typeof FIGURES)[number]) {
  if (figure.to === "/django") return artistPhoto("django-reinhardt");
  if (figure.to === "/grappelli") return artistPhoto("stephane-grappelli");
  if (figure.to === "/musicians/$slug" && figure.slug) return artistPhoto(figure.slug);
  if (figure.to === "/groups/$slug" && figure.slug) return groupPhoto(figure.slug);
  if (figure.to === "/families/$slug" && figure.slug) return artistPhoto("paulus-schafer");
  return null;
}

function FigureRow({
  figure,
  open,
  onOpenChange,
}: {
  figure: (typeof FIGURES)[number];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const photo = figurePhoto(figure);
  const role = figure.role ?? firstSentence(figure.body);
  const nameClass = "mt-1 block font-display text-xl font-semibold hover:underline sm:text-2xl";
  const nameNode =
    figure.to === "/musicians/$slug" && figure.slug ? (
      <Link
        to="/musicians/$slug"
        params={{ slug: figure.slug }}
        className={nameClass}
        onClick={(e) => e.stopPropagation()}
      >
        {figure.name}
      </Link>
    ) : figure.to === "/groups/$slug" && figure.slug ? (
      <Link
        to="/groups/$slug"
        params={{ slug: figure.slug }}
        className={nameClass}
        onClick={(e) => e.stopPropagation()}
      >
        {figure.name}
      </Link>
    ) : figure.to === "/families/$slug" && figure.slug ? (
      <Link
        to="/families/$slug"
        params={{ slug: figure.slug }}
        className={nameClass}
        onClick={(e) => e.stopPropagation()}
      >
        {figure.name}
      </Link>
    ) : (
      <h4 className="mt-1 font-display text-xl font-semibold sm:text-2xl">{figure.name}</h4>
    );
  return (
    <Fold
      className="border-t border-border"
      open={open}
      onOpenChange={onOpenChange}
      summary={
        <div className="flex min-h-12 items-start gap-3 py-5">
          {photo ? (
            <img
              src={photo.src}
              alt=""
              className="mt-0.5 size-14 shrink-0 rounded-md bg-raised object-cover object-top"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            {figure.years ? (
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{figure.years}</p>
            ) : null}
            {nameNode}
            {open ? null : <p className="mt-2 text-sm leading-relaxed text-muted">{role}</p>}
          </div>
          <ChevronDown
            className={`mt-2 size-5 shrink-0 text-faint transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </div>
      }
    >
      <div className={photo ? "pb-5 pl-[4.25rem]" : "pb-5"}>
        <p className="text-sm leading-relaxed text-muted">{figure.body}</p>
        {figure.youtube || figure.spotifySlug || figure.itunesName ? (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {figure.youtube ? (
              <a href={figure.youtube} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
                YouTube
                {figure.youtubeNote ? <span className="text-faint"> · {figure.youtubeNote}</span> : null}
              </a>
            ) : null}
            {figure.spotifySlug ? (
              <a
                href={artistSpotify(figure.spotifySlug, figure.itunesName || figure.name)}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-fg"
              >
                Spotify
              </a>
            ) : null}
            {figure.itunesName ? (
              <a
                href={
                  figure.appleId
                    ? `https://music.apple.com/us/artist/${figure.appleId}`
                    : artistItunes(figure.itunesName)
                }
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-fg"
              >
                iTunes
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </Fold>
  );
}

function Fold({
  open,
  onOpenChange,
  className,
  summary,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <details
      className={className}
      open={open}
      onToggle={(event) => {
        event.preventDefault();
      }}
    >
      <summary
        className="cursor-pointer list-none [&::-webkit-details-marker]:hidden"
        onClick={(event) => {
          event.preventDefault();
          onOpenChange(!open);
        }}
      >
        {summary}
      </summary>
      {open ? children : null}
    </details>
  );
}

function initialOpen(): Record<string, boolean> {
  const next: Record<string, boolean> = {};
  for (const house of HOUSES) next[`house:${house.id}`] = false;
  for (const figure of FIGURES) next[`fig:${figure.name}`] = false;
  for (const chapter of CHAPTERS) next[`tl:${chapter.year}`] = chapter.year === "1934";
  for (const film of FILMS) next[`film:${film.url}`] = false;
  return next;
}

function HistoryPage() {
  const { notes } = Route.useLoaderData();
  const [open, setOpen] = useState(initialOpen);

  function setKey(key: string, value: boolean) {
    setOpen((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }

  function expandAll() {
    setOpen((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (key.startsWith("house:") || key.startsWith("fig:") || key.startsWith("tl:")) next[key] = true;
      }
      return next;
    });
  }

  function collapseAll() {
    setOpen((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (key.startsWith("house:") || key.startsWith("fig:") || key.startsWith("tl:")) next[key] = false;
      }
      return next;
    });
  }

  function goChapter(id: string) {
    if (id === "timeline") setKey("tl:1934", true);
  }

  function notesFor(house: string) {
    return notes.filter((note: HistoryCircleNote) => note.house === house);
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 scroll-pt-44 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Lineage</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
        History of Gypsy Jazz and the Sinti
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Gypsy jazz did not begin in a studio or a conservatory. It grew out of a
        much older tradition carried by the Sinti across Europe.
      </p>
      <div className="mt-8">
        <HistoryDoors />
      </div>

      <nav
        aria-label="History chapters"
        className="sticky top-[7.75rem] z-20 mt-8 -mx-4 border-y border-border bg-[#1a120e] px-4 py-1.5 sm:top-[9rem] sm:-mx-6 sm:px-6 sm:py-2"
      >
        <div className="flex items-center gap-3 sm:hidden">
          <details className="group min-w-0 flex-1">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm [&::-webkit-details-marker]:hidden">
              <span className="text-[11px] tracking-[0.18em] text-faint uppercase">Chapters</span>
              <ChevronDown className="size-5 text-faint transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-1 divide-y divide-border border-t border-border">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => goChapter(item.id)}
                    className="flex min-h-11 items-center text-sm text-muted hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
          <div className="flex shrink-0 items-center gap-x-1 text-xs">
            <button type="button" onClick={expandAll} className="min-h-11 px-1 text-muted hover:text-fg">
              Expand
            </button>
            <span className="text-faint" aria-hidden="true">
              /
            </span>
            <button type="button" onClick={collapseAll} className="min-h-11 px-1 text-muted hover:text-fg">
              Collapse
            </button>
          </div>
        </div>
        <ul className="hidden flex-wrap items-center gap-x-4 gap-y-1 sm:flex">
          {TOC.map((item, i) => (
            <li key={item.id} className="flex items-center gap-x-4">
              {i > 0 ? <span className="text-faint" aria-hidden="true">·</span> : null}
              <a
                href={`#${item.id}`}
                onClick={() => goChapter(item.id)}
                className="py-1.5 text-[13px] tracking-[0.04em] text-muted hover:text-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden flex-wrap items-center gap-x-2 text-sm sm:flex">
          <button type="button" onClick={expandAll} className="min-h-11 text-muted hover:text-fg">
            Expand all
          </button>
          <span className="text-faint" aria-hidden="true">
            /
          </span>
          <button type="button" onClick={collapseAll} className="min-h-11 text-muted hover:text-fg">
            Collapse all
          </button>
        </div>
      </nav>

      <section id="story" className="mt-14 scroll-mt-44">
        <p className="text-[11px] tracking-[0.18em] text-faint uppercase">The reading</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Story</h2>
        <div className="mt-8 max-w-2xl space-y-10">
          {historyStorySections().map((section) => (
            <article key={section.title} id={`story-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              <h3 className="font-display text-2xl font-semibold sm:text-3xl">{section.title}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-base leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
              {section.title === "Django and the birth of a style" ? (
                <p className="mt-3 text-sm text-muted">
                  Full life:{" "}
                  <Link to="/django" className="text-fg hover:underline">
                    Django Reinhardt
                  </Link>
                  {" · "}
                  <Link to="/grappelli" className="text-fg hover:underline">
                    Stéphane Grappelli
                  </Link>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section id="houses" className="mt-14 scroll-mt-44">
        <p className="text-[11px] tracking-[0.18em] text-faint uppercase">The families</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Houses</h2>
        <CircleNotes
          house="paris"
          notes={[]}
          chooseHouse
          cta="Add to a house"
        />
        <ul className="mt-8 space-y-2">
          {HOUSES.map((house) => {
            const key = `house:${house.id}`;
            const isOpen = Boolean(open[key]);
            return (
              <li key={house.id} id={`house-${house.id}`} className="scroll-mt-44">
                <Fold
                  className="border-t border-border"
                  open={isOpen}
                  onOpenChange={(next) => setKey(key, next)}
                  summary={
                    <div className="flex min-h-12 items-center justify-between gap-3 py-5">
                      <div>
                        <h3 className="font-display text-2xl font-semibold sm:text-3xl">{house.name}</h3>
                        {house.label && !isOpen ? (
                          <p className="mt-1 text-sm text-muted">{house.label}</p>
                        ) : null}
                      </div>
                      <ChevronDown
                        className={`size-5 shrink-0 text-faint transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </div>
                  }
                >
                  <div className="pb-8">
                    {house.label ? <p className="mb-5 text-sm leading-relaxed text-muted">{house.label}</p> : null}
                    {house.essays.map((title) => {
                      const essay = sectionByTitle(title);
                      if (!essay) return null;
                      return (
                        <article key={title} className="mb-8 max-w-2xl">
                          <h4 className="font-display text-xl font-semibold">{essay.title}</h4>
                          {essay.body.map((paragraph) => (
                            <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                              {paragraph}
                            </p>
                          ))}
                        </article>
                      );
                    })}
                    <ul>
                      {house.people.map((name) => {
                        const figure = figureByName(name);
                        if (!figure) return null;
                        return (
                          <li key={figure.name}>
                            <FigureRow
                              figure={figure}
                              open={Boolean(open[`fig:${figure.name}`])}
                              onOpenChange={(next) => setKey(`fig:${figure.name}`, next)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                    <CircleNotes
                      house={house.id}
                      notes={notesFor(house.id)}
                      cta="Add to this house"
                      empty="Add a name, a memory or a date."
                    />
                  </div>
                </Fold>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="photographs" className="mt-14 scroll-mt-44">
        <p className="text-[11px] tracking-[0.18em] text-faint uppercase">From the archives</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Photographs
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Real scans — not generated pictures. William P. Gottlieb’s 1946
          Aquarium session is public domain (Library of Congress). The later
          photographs are used under the licences named on each frame.
        </p>
        <ul className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0 lg:grid-cols-7">
          {ARCHIVE.map((shot) => (
            <li key={shot.src} className="w-28 shrink-0 sm:w-auto">
              <a href={shot.href} target="_blank" rel="noreferrer" className="block">
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className="aspect-square w-full rounded-lg bg-raised object-cover object-top"
                />
                <p className="mt-1.5 text-[11px] leading-snug text-muted">{shot.caption}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-faint">{shot.credit}</p>
              </a>
            </li>
          ))}
        </ul>
        <CircleNotes
          house="photographs"
          notes={notesFor("photographs")}
          cta="Suggest a photograph"
          defaultKind="Photograph"
        />
      </section>

      <section id="on-film" className="mt-14 scroll-mt-44">
        <p className="text-[11px] tracking-[0.18em] text-faint uppercase">On film, before 1960</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Django and Grappelli
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Almost no camera found them. This is the old footage — the 1939 film
          of the two together, the 1937 record, Nuages from the war, and the
          1949 reunion in Rome. Grappelli lived long enough to be filmed later;
          these clips stay before 1960.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {FILMS.map((film) => {
            const key = `film:${film.url}`;
            const isOpen = Boolean(open[key]);
            return (
              <figure key={film.url} className="space-y-3">
                <YouTubeEmbed url={film.url} title={`${film.title} (${film.year})`} />
                <figcaption>
                  <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                    {film.year}
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold">{film.title}</p>
                  <Fold
                    open={isOpen}
                    onOpenChange={(next) => setKey(key, next)}
                    summary={
                      <span className="flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg">
                        About this clip
                        <ChevronDown
                          className={`size-4 text-faint transition-transform ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </span>
                    }
                  >
                    <p className="pb-1 text-sm leading-relaxed text-muted">{film.note}</p>
                  </Fold>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      <section id="timeline" className="mt-14 scroll-mt-44">
        <p className="text-[11px] tracking-[0.18em] text-faint uppercase">The public music</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          From the bals musette to Samois
        </h2>
        <ol className="mt-10">
          {CHAPTERS.map((chapter) => {
            const key = `tl:${chapter.year}`;
            const isOpen = Boolean(open[key]);
            return (
              <li key={chapter.year} id={`timeline-${chapter.year.replace(/\s+/g, "-").toLowerCase()}`}>
                <Fold
                  className="border-t border-border"
                  open={isOpen}
                  onOpenChange={(next) => setKey(key, next)}
                  summary={
                    <div className="grid min-h-12 grid-cols-[7rem_1fr] items-start gap-4 py-6">
                      <p className="pt-1 text-[11px] tracking-[0.16em] text-faint uppercase">
                        {chapter.year}
                      </p>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-2xl font-semibold sm:text-3xl">
                          {chapter.title}
                        </h3>
                        <ChevronDown
                          className={`mt-2 size-5 shrink-0 text-faint transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  }
                >
                  <div className="grid grid-cols-[7rem_1fr] gap-4 pb-8">
                    <div />
                    <div>
                      {djangoHeavy(chapter.year) || grappelliHeavy(chapter.year) ? (
                        <p className="mb-3 text-sm text-muted">
                          {djangoHeavy(chapter.year) ? (
                            <>
                              Full life:{" "}
                              <Link to="/django" className="text-fg hover:underline">
                                Django Reinhardt
                              </Link>
                            </>
                          ) : null}
                          {djangoHeavy(chapter.year) && grappelliHeavy(chapter.year) ? " · " : null}
                          {grappelliHeavy(chapter.year) ? (
                            <>
                              {djangoHeavy(chapter.year) ? null : "Full life: "}
                              <Link to="/grappelli" className="text-fg hover:underline">
                                Stéphane Grappelli
                              </Link>
                            </>
                          ) : null}
                        </p>
                      ) : null}
                      {chapter.body.map((paragraph) => (
                        <p key={paragraph} className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </Fold>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-14 rounded-2xl bg-surface p-5 shadow-border sm:p-8">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Archive</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">The country archive</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          The essay stays here. The long lists — family houses, older orchestras, past chairs — live
          in the archive, one country at a time. Pick a country. Signed-in members can add a name;
          it waits on the owner desk.
        </p>
        <p className="mt-4">
          <a href={ROMANI_MUSIC_SITE} className="text-sm font-medium text-accent hover:underline">
            Romani Music → romanimusic.com
          </a>
        </p>
      </div>

      <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted">
        Want more history? Go to{" "}
        <a href={ROMANI_MUSIC_SITE} className="text-fg hover:underline" rel="noreferrer">
          romanimusic.com
        </a>
        .
      </p>

      <div className="mt-14 flex flex-wrap gap-3 text-sm">
        <Link to="/musicians" className="text-muted hover:text-fg">
          Festival artists
        </Link>
        <Link to="/legends" className="text-muted hover:text-fg">
          All legends
        </Link>
        <Link to="/concerts" className="text-muted hover:text-fg">
          Concerts
        </Link>
      </div>
    </main>
  );
}