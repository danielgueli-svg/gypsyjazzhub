/** Titles and bodies for news items, keyed as news.item.{slug}.title / .body */
export type NewsDict = Record<string, string>;

function pack(
  rows: Record<string, { title: string; body: string }>,
): NewsDict {
  const out: NewsDict = {};
  for (const [slug, row] of Object.entries(rows)) {
    out[`news.item.${slug}.title`] = row.title;
    out[`news.item.${slug}.body`] = row.body;
  }
  return out;
}

export const NEWS_EN = pack({
  "angelo-debarre-ulule": {
    title: "Crowdfund for Angelo Debarre",
    body: "Denis Chang passed on a message from Angelo Debarre: he is having health difficulties and is in need of help. A crowdfunding page is open on Ulule — Soutien au guitariste Angelo Debarre. The link is on this page.",
  },
  "pgc-steven-reinhardt": {
    title: "Paris Guitar Connection sits with Steven Reinhardt",
    body: "The Paris podcast — six guitarists, two sofas — put Saint-Ouen’s Steven Reinhardt on the couch. Gypsy Jazz with a Gypsy: family time, the pompe, Swing Lâg shop guitars, then Blues en mineur and What Is This Thing Called Love. PGC is not a weekly jam. The public jam is still La Chope des Puces, weekends on rue des Rosiers. The hosts are Aurélien Robert, Guillaume Muschalle, François Thouvenot, Ghali Hadefi, Nicolas Lestoquoy and Yoann Kempst. Ghali’s pompe shorts are the ones players send each other. Watch the episode on the channel.",
  },
  "shrewsbury-django-fest-2026": {
    title: "Shrewsbury Django Fest 2026 line-up is up",
    body: "23–25 October in Shrewsbury. Friday: John Wheatcroft Trio featuring Olivia Frances Brown, then the Mozes Rosenberg Trio with Christiaan van Hemert. Saturday: Marion & Sobo Band, then Paulus Schäfer and Olli Soikkeli. Sunday: the Gypsy Jazz Retreat concert, Marion & Sobo again, and the all-star jam. Free daytime DJams Saturday and Sunday at Glou Glou, The Bull Inn and The Nags Head. Tickets from shrewsburydjangofest.co.uk.",
  },
  "midwest-django-fest-2026": {
    title: "Midwest Django Fest — Madison this weekend",
    body: "11–12 September at William G. Lunney Lake Farm County Park, Madison. Gonzalo Bergara Trio, Dario Napoli Trio, Alfonso Ponticelli, Hot Club of Baltimore, Harmonious Wail. Campfire djam both nights. Schedule: midwestdjangofestival.com.",
  },
  "djangofest-northwest-2026": {
    title: "DjangoFest Northwest — Gismo Graf, Pearl Django, Bergara",
    body: "26th year at WICA, Langley, 15–20 September 2026. Six days: 3 Parts Bourbon, Pearl Django, Eric Vanderbilt-Mathews, John Jorgenson Trio, Gonzalo Bergara Quintet, Gismo Graf Quintet, then the Nick Lehr Memorial djam. Free second-stage sets. BroadwayWorld posted the bill 3 September.",
  },
  "moignard-miroirs-sunset": {
    title: "Adrien Moignard Quartet + guests — Miroirs at Sunset, 11 September",
    body: "Friday 11 September 2026, 20:30, Sunset in Paris, for the album Miroirs (Label Ouest). Adrien Moignard Quartet + guests — Benji Winterstein and Julien Cattiaux on rhythm, Fabricio Nicolas-Garcia on bass. Tickets from Sunset-Sunside.",
  },
  "weekly-scan-2026-08-23": {
    title: "This week on the globe — Paris, Madison, Chicago, Langley",
    body: "Tonight and Friday: Olli Soikkeli with the Finnish Air Force Big Band (Kuopio, Tampere). Friday in Paris: Adrien Moignard’s Miroirs at Sunset. Weekend: Midwest Django Fest in Madison (Bergara, Napoli, Ponticelli). Next week: DjangoFest Northwest (15–20 Sep, Whidbey Island — Gismo Graf, Gonzalo Bergara, Pearl Django), Chicago Gypsy Jazz Fest from 15 Sep (SPACE, Green Mill), Django In London 17–19 Sep. Rosenberg brothers in Viljandi, 9 October.",
  },
  "latin-america-manouche-2026": {
    title: "South & Central America — jams and festivals on the globe",
    body: "Buenos Aires: Swing Medical’s monthly jam at Bar de Fondo (Julián Álvarez 1200). Argentina Django Festival returns each May. Curitiba: Festival Manouche, 20–25 October 2026. Brasília Gypsy Jazz Club, Piracicaba, Hot Club Medellín, Hot Club de San Miguel, Festival Django CL in Santiago. Uruguay has no standing jam posted.",
  },
  "africa-manouche-2026": {
    title: "Africa — Gypsy Jazz is rare; South Africa holds the chairs",
    body: "Dedicated Gypsy Jazz open jams are essentially nonexistent across Africa. The style stays niche and European. South Africa has the only standing scene: Hot Club d’Afrique in Johannesburg (all-acoustic, founded 2008), Hot Club of Cape Town, Tarabu in the Winelands, and Manouche in Cape Town — performance groups for venues, festivals and hire, not open jams. Morocco has seen occasional Django homage concerts (Royal Symphony Orchestra Jazz Band, Casablanca and Rabat, 2024). Egypt, Senegal, Nigeria, Kenya, Ghana and Ethiopia have no posted Manouche jam. General jazz jams in Cape Town, Johannesburg, Cairo and Dakar are not Hot Club nights.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert released La Pompe",
    body: "The Dutch violinist and teacher released La Pompe Live in August 2026 — charts, setlists and the pompe in your pocket. iPhone and Android. Beginner guide on YouTube from 10 August.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — first Saturday in Utrecht",
    body: "Jazz Manouche at The Music Space XL, Australiëlaan 24. First Saturday of the month, 19:00–23:00. First night 5 September 2026: Chris’ Collective opens. WhatsApp community on the jam page.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — second Wednesday in Amsterdam",
    body: "Acoustic gypsy jazz jam at Café Insulinde, Sumatrastraat 24 (Insulindeweg). Second Wednesday of the month from 19:00. Open to all. Next: 14 October 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 April–2 May 2027",
    body: "Nuno Marinho and Marian Yanchyk’s gypsy jazz camp in the Alentejo. Rhythm in the morning, soloing after lunch, jams after dinner. Festival Django Portugal is the touring sister.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "The Corsican guitarist’s second album with Benji Winterstein, William Brunard and Bastien Brison. One of the main current French groups.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "The Finnish guitarist’s new record returns to gypsy jazz. Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg and Matheus Nicolaiewsky are on it.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Napoli’s seventh album. The title track came first; the full record is on the platforms now. Benji Winterstein holds rhythm.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "A new Django book from Helmond. Stochelo’s Celebration series is on Spotify; the live Django Celebration nights keep touring.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "The German trio’s YouTube book, on record. California Dreamin’ opens it. Highwire followed the same year.",
  },
  "joscho-highwire": {
    title: "Joscho Stephan — Highwire",
    body: "Joscho Stephan with Cornelius Claudio Kreusch — the 2025 guitar record.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "The German trio’s album with Costel Nitescu — thirteen pieces, recorded in a day and a half.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène plays Loulou Gasté",
    body: "Lagrène reads the French songwriter who wrote Feelings. A guitar record that is still gypsy jazz in the left hand.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre and Adrien Moignard — New Viaggio",
    body: "Two French lead guitars on one date. Debarre’s sound, Moignard’s fire.",
  },
  "denis-chang-japan-tour": {
    title: "Denis Chang — first leader mini-tour in Japan",
    body: "October 2026: Tokyo 8th (u-ma Kagurazaka), Osaka 9th (Piano Bar Kiyomi), then Setouchi Django Street in Yashima, Kagawa, 10–11. Reilly Farrell on violin, Alison Zhen on rhythm, Hanaoka Toshio on bass. Live and session both club nights, 19:30.",
  },
  "gypsy-jazz-band-klebelsberg": {
    title: "Gypsy Jazz Band — Klebelsberg Kultúrkúria, 30 August",
    body: "Budapest, Sunday 30 August 2026, 19:30. Róbert Kárpáti’s Gypsy Jazz Band with Roby Lakatos, guests Charlie Horváth and Csondor Kata. Templom utca 2–10. For chairs to sit in, Manuska posts Django jams in Gypsy Jazz Jams Budapest — not a fixed weekly night.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub is open",
    body: "A worldwide circle for the music: jams, concerts, groups, camps, luthiers, and the pages of the players. Join and put a date on the calendar.",
  },
});

export const NEWS_NL = pack({
  "angelo-debarre-ulule": {
    title: "Crowdfunding voor Angelo Debarre",
    body: "Denis Chang gaf een bericht van Angelo Debarre door: hij heeft gezondheidsproblemen en heeft hulp nodig. Op Ulule staat een collecte — Soutien au guitariste Angelo Debarre. De link staat op deze pagina.",
  },
  "pgc-steven-reinhardt": {
    title: "Paris Guitar Connection met Steven Reinhardt",
    body: "De Parijse podcast — zes gitaristen, twee banken — zette Steven Reinhardt uit Saint-Ouen op de sofa. Gypsy Jazz with a Gypsy: familietijd, de pompe, Swing Lâg-gitaren, daarna Blues en mineur en What Is This Thing Called Love. PGC is geen wekelijkse jam. De openbare jam blijft La Chope des Puces, in het weekend op de rue des Rosiers. De hosts: Aurélien Robert, Guillaume Muschalle, François Thouvenot, Ghali Hadefi, Nicolas Lestoquoy en Yoann Kempst. De pompe-shorts van Ghali sturen spelers elkaar door. Aflevering op het kanaal.",
  },
  "shrewsbury-django-fest-2026": {
    title: "Shrewsbury Django Fest 2026 — het programma is er",
    body: "23–25 oktober in Shrewsbury. Vrijdag: John Wheatcroft Trio met Olivia Frances Brown, daarna het Mozes Rosenberg Trio met Christiaan van Hemert. Zaterdag: Marion & Sobo Band, daarna Paulus Schäfer en Olli Soikkeli. Zondag: het Gypsy Jazz Retreat-concert, opnieuw Marion & Sobo, en de all-star jam. Overdag vrije DJams op zaterdag en zondag bij Glou Glou, The Bull Inn en The Nags Head. Kaarten: shrewsburydjangofest.co.uk.",
  },
  "midwest-django-fest-2026": {
    title: "Midwest Django Fest — dit weekend in Madison",
    body: "11–12 september op William G. Lunney Lake Farm County Park, Madison. Gonzalo Bergara Trio, Dario Napoli Trio, Alfonso Ponticelli, Hot Club of Baltimore, Harmonious Wail. Kampvuur-djam beide avonden. Programma: midwestdjangofestival.com.",
  },
  "djangofest-northwest-2026": {
    title: "DjangoFest Northwest — Gismo Graf, Pearl Django, Bergara",
    body: "26e jaar in WICA, Langley, 15–20 september 2026. Zes dagen: 3 Parts Bourbon, Pearl Django, Eric Vanderbilt-Mathews, John Jorgenson Trio, Gonzalo Bergara Quintet, Gismo Graf Quintet, daarna de Nick Lehr Memorial-djam. Gratis second-stage sets. BroadwayWorld zette de bill op 3 september.",
  },
  "weekly-scan-2026-08-23": {
    title: "Deze week op de globe — Parijs, Madison, Chicago, Langley",
    body: "Vanavond en vrijdag: Olli Soikkeli met de Finnish Air Force Big Band (Kuopio, Tampere). Vrijdag in Parijs: Adrien Moignard’s Miroirs in Sunset. Weekend: Midwest Django Fest in Madison (Bergara, Napoli, Ponticelli). Volgende week: DjangoFest Northwest (15–20 sep, Whidbey Island — Gismo Graf, Gonzalo Bergara, Pearl Django), Chicago Gypsy Jazz Fest vanaf 15 sep (SPACE, Green Mill), Django In London 17–19 sep. Gebroeders Rosenberg in Viljandi, 9 oktober.",
  },
  "latin-america-manouche-2026": {
    title: "Zuid- en Midden-Amerika — jams en festivals op de globe",
    body: "Buenos Aires: de maandelijkse jam van Swing Medical in Bar de Fondo (Julián Álvarez 1200). Festival Django Argentina elke mei. Curitiba: Festival Manouche, 20–25 oktober 2026. Gypsy Jazz Club Brasília, Piracicaba, Hot Club Medellín, Hot Club de San Miguel, Festival Django CL in Santiago. Uruguay: geen vaste jam bekend.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert brengt La Pompe uit",
    body: "De Nederlandse violist en leraar bracht La Pompe Live in augustus 2026 uit — akkoordenschema’s, setlists en de pompe in je zak. iPhone en Android. Beginnerstutorial op YouTube sinds 10 augustus.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — eerste zaterdag in Utrecht",
    body: "Jazz Manouche bij The Music Space XL, Australiëlaan 24. Elke eerste zaterdag van de maand, 19:00–23:00. Eerste avond 5 september 2026: Chris’ Collective opent. WhatsApp-groep op de jam-pagina.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — tweede woensdag in Amsterdam",
    body: "Akoestische gypsy-jazzjam in Café Insulinde, Sumatrastraat 24 (Insulindeweg). Elke tweede woensdag van de maand vanaf 19:00. Iedereen welkom. Volgende: 14 oktober 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 april–2 mei 2027",
    body: "Gypsy-jazzkamp van Nuno Marinho en Marian Yanchyk in de Alentejo. ’s Ochtends ritme, na de lunch solo, ’s avonds jams. Festival Django Portugal is de tournee-zus.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Het tweede album van de Corsicaanse gitarist met Benji Winterstein, William Brunard en Bastien Brison. Een van de belangrijkste Franse groepen van nu.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "De nieuwe plaat van de Finse gitarist gaat terug naar gypsy jazz. Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg en Matheus Nicolaiewsky spelen mee.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Napoli’s zevende album. Eerst de titelsong, nu de hele plaat. Benji Winterstein op ritme.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Een nieuw Django-boek uit Helmond. De Celebration-serie staat op Spotify; de live Django Celebration-avonden toeren door.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "Het YouTube-boek van het Duitse trio, op plaat. California Dreamin’ opent. Highwire volgde hetzelfde jaar.",
  },
  "joscho-highwire": {
    title: "Joscho Stephan — Highwire",
    body: "Joscho Stephan met Cornelius Claudio Kreusch — de gitaarplaat van 2025.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "Het album van het Duitse trio met Costel Nitescu — dertien stukken, in anderhalve dag opgenomen.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène speelt Loulou Gasté",
    body: "Lagrène speelt de Franse songwriter van Feelings. Een gitaarplaat die in de linkerhand gypsy jazz blijft.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre en Adrien Moignard — New Viaggio",
    body: "Twee Franse leadgitaren op één plaat. Debarre’s geluid, Moignard’s vuur.",
  },
  "denis-chang-japan-tour": {
    title: "Denis Chang — eerste mini-tour als leader in Japan",
    body: "Oktober 2026: Tokio 8 (u-ma Kagurazaka), Osaka 9 (Piano Bar Kiyomi), daarna Setouchi Django Street in Yashima, Kagawa, 10–11. Reilly Farrell viool, Alison Zhen ritme, Hanaoka Toshio bas. Live én sessie op beide clubavonden, 19:30.",
  },
  "gypsy-jazz-band-klebelsberg": {
    title: "Gypsy Jazz Band — Klebelsberg Kultúrkúria, 30 augustus",
    body: "Boedapest, zondag 30 augustus 2026, 19:30. Gypsy Jazz Band van Róbert Kárpáti met Roby Lakatos, gasten Charlie Horváth en Csondor Kata. Templom utca 2–10. Meespelen: Manuska zet Django-jams in Gypsy Jazz Jams Budapest — geen vaste wekelijkse avond.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub is open",
    body: "Een wereldwijde kring voor de muziek: jams, concerten, groepen, kampen, gitaarbouwers en de pagina’s van de spelers. Word lid en zet een datum in de agenda.",
  },
});

export const NEWS_DE = pack({
  "angelo-debarre-ulule": {
    title: "Crowdfunding für Angelo Debarre",
    body: "Denis Chang gab eine Nachricht von Angelo Debarre weiter: er hat gesundheitliche Schwierigkeiten und braucht Hilfe. Auf Ulule läuft eine Sammlung — Soutien au guitariste Angelo Debarre. Der Link steht auf dieser Seite.",
  },
  "weekly-scan-2026-08-23": {
    title: "Diese Woche auf dem Globus — Barcelona, London, Madison, Langley",
    body: "Neue wöchentliche Jam in Barcelona: Martes Manouche, jeden Dienstag im Soda Acústic, Gràcia. Heute in Chicago die La-Tosca-Jam bei Cara Cara. Die nächsten Wochen: Midwest Django Fest (11.–12. Sep, Madison), DjangoFest Northwest (15.–20. Sep, Whidbey Island — Gismo Graf, Gonzalo Bergara, Tim Kliphuis), Django In London (17.–19. Sep, St Mary’s — Hugo Guezbar, Angelo Debarre, London Django Collective), Stéphane Wrembel in Chicago, Rochester und Asheville, Dario Napoli auf der US-Tour, und die Rosenberg-Brüder in Viljandi, Estland, 9. Oktober.",
  },
  "latin-america-manouche-2026": {
    title: "Süd- und Mittelamerika — Jams und Festivals auf dem Globus",
    body: "Buenos Aires: monatliche Jam von Swing Medical im Bar de Fondo (Julián Álvarez 1200). Festival Django Argentina jedes Mai. Curitiba: Festival Manouche, 20.–25. Oktober 2026. Gypsy Jazz Club Brasília, Piracicaba, Hot Club Medellín, Hot Club de San Miguel, Festival Django CL in Santiago. Uruguay: keine feste Jam veröffentlicht.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert veröffentlicht La Pompe Live",
    body: "Der niederländische Geiger und Lehrer hat La Pompe Live im August 2026 herausgebracht — Charts, Setlists und die Pompe in der Tasche. iPhone und Android. Einsteiger-Tutorial auf YouTube seit dem 10. August.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — erster Samstag in Utrecht",
    body: "Jazz Manouche im The Music Space XL, Australiëlaan 24. Jeder erste Samstag im Monat, 19:00–23:00. Erste Nacht 5. September 2026: Chris’ Collective eröffnet.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — zweiter Mittwoch in Amsterdam",
    body: "Akustische Gypsy-Jazz-Jam im Café Insulinde, Sumatrastraat 24. Jeder zweite Mittwoch ab 19:00. Offen für alle. Nächster Termin: 14. Oktober 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28. April–2. Mai 2027",
    body: "Gypsy-Jazz-Camp von Nuno Marinho und Marian Yanchyk im Alentejo. Morgens Rhythmus, nach dem Mittag Solo, abends Jams.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Zweites Album des korsischen Gitarristen mit Benji Winterstein, William Brunard und Bastien Brison.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "Die neue Platte des finnischen Gitarristen kehrt zum Gypsy Jazz zurück. Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg und Matheus Nicolaiewsky sind dabei.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Napoli’s siebtes Album. Zuerst der Titelsong, jetzt die ganze Platte. Benji Winterstein an der Rhythmusgitarre.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Ein neues Django-Buch aus Helmond. Die Celebration-Serie ist auf Spotify; die Live-Abende touren weiter.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "Das YouTube-Buch des deutschen Trios auf Platte. California Dreamin’ eröffnet. Highwire folgte im selben Jahr.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "Das Album des deutschen Trios mit Costel Nitescu — dreizehn Stücke, in anderthalb Tagen aufgenommen.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène spielt Loulou Gasté",
    body: "Lagrène liest den französischen Songwriter von Feelings. Eine Gitarrenplatte, die in der linken Hand Gypsy Jazz bleibt.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre und Adrien Moignard — New Viaggio",
    body: "Zwei französische Leadgitarren auf einem Termin. Debarres Klang, Moignards Feuer.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub ist offen",
    body: "Ein weltweiter Kreis für die Musik: Jams, Konzerte, Gruppen, Camps, Gitarrenbauer und die Seiten der Spieler. Mitmachen und ein Datum in den Kalender setzen.",
  },
});

export const NEWS_FR = pack({
  "angelo-debarre-ulule": {
    title: "Soutien au guitariste Angelo Debarre",
    body: "Denis Chang relaie un message d’Angelo Debarre : il traverse des difficultés de santé et a besoin d’aide. Une collecte est ouverte sur Ulule. Le lien est sur cette page.",
  },
  "pgc-steven-reinhardt": {
    title: "Paris Guitar Connection reçoit Steven Reinhardt",
    body: "Le podcast parisien — six guitaristes, deux canapés — a assis Steven Reinhardt, de Saint-Ouen, sur le sofa. Gypsy Jazz with a Gypsy : le temps de la famille, la pompe, les guitares Swing Lâg, puis Blues en mineur et What Is This Thing Called Love. PGC n’est pas un jam hebdomadaire. Le jam public reste La Chope des Puces, le week-end, rue des Rosiers. Les hôtes : Aurélien Robert, Guillaume Muschalle, François Thouvenot, Ghali Hadefi, Nicolas Lestoquoy et Yoann Kempst. Les shorts pompe de Ghali circulent entre les joueurs. L’épisode est sur la chaîne.",
  },
  "moignard-miroirs-sunset": {
    title: "Adrien Moignard Quartet + guests — Miroirs, le 11 septembre au Sunset",
    body: "Vendredi 11 septembre 2026, 20h30, au Sunset à Paris, pour l’album Miroirs (Label Ouest). Adrien Moignard Quartet + guests — Benji Winterstein et Julien Cattiaux aux guitares, Fabricio Nicolas-Garcia à la contrebasse. Billetterie Sunset-Sunside.",
  },
  "weekly-scan-2026-08-23": {
    title: "Cette semaine sur le globe — Barcelone, Londres, Madison, Langley",
    body: "Nouveau jam hebdomadaire à Barcelone : Martes Manouche, chaque mardi au Soda Acústic, Gràcia. Aujourd’hui à Chicago, le jam La Tosca chez Cara Cara. Les semaines qui viennent : Midwest Django Fest (11–12 sep, Madison), DjangoFest Northwest (15–20 sep, Whidbey Island — Gismo Graf, Gonzalo Bergara, Tim Kliphuis), Django In London (17–19 sep, St Mary’s — Hugo Guezbar, Angelo Debarre, London Django Collective), Stéphane Wrembel à Chicago, Rochester et Asheville, Dario Napoli aux États-Unis, et les frères Rosenberg à Viljandi, Estonie, le 9 octobre.",
  },
  "latin-america-manouche-2026": {
    title: "Amérique du Sud et centrale — jams et festivals sur le globe",
    body: "Buenos Aires : jam mensuelle de Swing Medical au Bar de Fondo (Julián Álvarez 1200). Festival Django Argentina chaque mai. Curitiba : Festival Manouche, 20–25 octobre 2026. Gypsy Jazz Club de Brasília, Piracicaba, Hot Club Medellín, Hot Club de San Miguel, Festival Django CL à Santiago. Uruguay : pas de jam fixe publiée.",
  },
  "africa-manouche-2026": {
    title: "Afrique — le jazz manouche est rare ; l’Afrique du Sud tient la scène",
    body: "Les jams ouvertes de jazz manouche n’existent pratiquement pas en Afrique. Le style reste européen. L’Afrique du Sud a la seule scène suivie : Hot Club d’Afrique à Johannesburg (acoustique, 2008), Hot Club of Cape Town, Tarabu dans le Winelands, Manouche au Cap — des groupes de concert, pas des jams ouvertes. Au Maroc, hommages Django ponctuels (Jazz Band de l’Orchestre symphonique royal, Casablanca et Rabat, 2024). Égypte, Sénégal, Nigeria, Kenya, Ghana, Éthiopie : aucune jam manouche publiée. Les jams jazz générales du Cap, de Johannesburg, du Caire et de Dakar ne sont pas des nuits Hot Club.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert sort La Pompe Live",
    body: "Le violoniste et prof néerlandais a publié La Pompe Live en août 2026 — grilles, setlists et la pompe dans la poche. iPhone et Android. Tuto débutant sur YouTube depuis le 10 août.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — premier samedi à Utrecht",
    body: "Jazz manouche au The Music Space XL, Australiëlaan 24. Premier samedi du mois, 19h–23h. Première soirée le 5 septembre 2026 : Chris’ Collective ouvre.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — deuxième mercredi à Amsterdam",
    body: "Jam acoustique au Café Insulinde, Sumatrastraat 24. Deuxième mercredi du mois dès 19h. Ouvert à tous. Prochaine : 14 octobre 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 avril–2 mai 2027",
    body: "Stage de Nuno Marinho et Marian Yanchyk dans l’Alentejo. Rythme le matin, solo l’après-midi, jams le soir.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Deuxième album du guitariste corse avec Benji Winterstein, William Brunard et Bastien Brison. Un des groupes français du moment.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "Le nouveau disque du guitariste finlandais revient au gypsy jazz. Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg et Matheus Nicolaiewsky sont dessus.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Septième album de Napoli. D’abord le titre, maintenant le disque. Benji Winterstein à la rythme.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Un nouveau livre Django depuis Helmond. La série Celebration est sur Spotify ; les soirées live continuent de tourner.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "Le livre YouTube du trio allemand, sur disque. California Dreamin’ ouvre. Highwire a suivi la même année.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "L’album du trio allemand avec Costel Nitescu — treize morceaux, enregistrés en un jour et demi.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène joue Loulou Gasté",
    body: "Lagrène lit l’auteur de Feelings. Un disque de guitare qui reste gypsy jazz dans la main gauche.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre et Adrien Moignard — New Viaggio",
    body: "Deux leads français sur une date. Le son de Debarre, le feu de Moignard.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub est ouvert",
    body: "Un cercle mondial pour la musique : jams, concerts, groupes, stages, luthiers et les pages des musiciens. Rejoins et pose une date au calendrier.",
  },
});

export const NEWS_IT = pack({
  "weekly-scan-2026-08-23": {
    title: "Questa settimana sul globo — Barcellona, Londra, Madison, Langley",
    body: "Nuova jam settimanale a Barcellona: Martes Manouche, ogni martedì al Soda Acústic, Gràcia. Oggi a Chicago la jam La Tosca da Cara Cara. Nelle settimane: Midwest Django Fest (11–12 set, Madison), DjangoFest Northwest (15–20 set, Whidbey Island — Gismo Graf, Gonzalo Bergara, Tim Kliphuis), Django In London (17–19 set, St Mary’s — Hugo Guezbar, Angelo Debarre, London Django Collective), Stéphane Wrembel a Chicago, Rochester e Asheville, Dario Napoli negli USA, e i fratelli Rosenberg a Viljandi, Estonia, 9 ottobre.",
  },
  "latin-america-manouche-2026": {
    title: "Sud e Centro America — jam e festival sul globo",
    body: "Buenos Aires: jam mensile di Swing Medical al Bar de Fondo (Julián Álvarez 1200). Festival Django Argentina ogni maggio. Curitiba: Festival Manouche, 20–25 ottobre 2026. Gypsy Jazz Club di Brasília, Piracicaba, Hot Club Medellín, Hot Club de San Miguel, Festival Django CL a Santiago. Uruguay: nessuna jam fissa pubblicata.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert pubblica La Pompe Live",
    body: "Il violinista e insegnante olandese ha pubblicato La Pompe Live in agosto 2026 — griglie, setlist e la pompe in tasca. iPhone e Android. Tutorial per principianti su YouTube dal 10 agosto.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — primo sabato a Utrecht",
    body: "Jazz manouche al The Music Space XL, Australiëlaan 24. Primo sabato del mese, 19:00–23:00. Prima serata 5 settembre 2026: apre Chris’ Collective.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — secondo mercoledì ad Amsterdam",
    body: "Jam acustica al Café Insulinde, Sumatrastraat 24. Secondo mercoledì del mese dalle 19:00. Aperta a tutti. Prossima: 14 ottobre 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 aprile–2 maggio 2027",
    body: "Campo di Nuno Marinho e Marian Yanchyk in Alentejo. Ritmo al mattino, solo dopo pranzo, jam la sera.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Secondo album del chitarrista corso con Benji Winterstein, William Brunard e Bastien Brison.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "Il nuovo disco del chitarrista finlandese torna al gypsy jazz. Con Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg e Matheus Nicolaiewsky.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Settimo album di Napoli. Prima il brano titolo, ora il disco. Benji Winterstein al ritmo.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Un nuovo libro Django da Helmond. La serie Celebration è su Spotify; le serate live continuano a girare.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "Il libro YouTube del trio tedesco, su disco. Apre California Dreamin’. Highwire è uscito lo stesso anno.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "L’album del trio tedesco con Costel Nitescu — tredici brani, registrati in un giorno e mezzo.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène suona Loulou Gasté",
    body: "Lagrène legge l’autore di Feelings. Un disco di chitarra che resta gypsy jazz nella mano sinistra.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre e Adrien Moignard — New Viaggio",
    body: "Due lead francesi su una data. Il suono di Debarre, il fuoco di Moignard.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub è aperto",
    body: "Un cerchio mondiale per la musica: jam, concerti, gruppi, stage, liutai e le pagine dei musicisti. Entra e metti una data in calendario.",
  },
});

export const NEWS_ES = pack({
  "weekly-scan-2026-08-23": {
    title: "Esta semana en el globo — Barcelona, Londres, Madison, Langley",
    body: "Nueva jam semanal en Barcelona: Martes Manouche, cada martes en Soda Acústic, Gràcia. Hoy en Chicago, la jam La Tosca en Cara Cara. Próximas semanas: Midwest Django Fest (11–12 sep, Madison), DjangoFest Northwest (15–20 sep, Whidbey Island — Gismo Graf, Gonzalo Bergara, Tim Kliphuis), Django In London (17–19 sep, St Mary’s — Hugo Guezbar, Angelo Debarre, London Django Collective), Stéphane Wrembel en Chicago, Rochester y Asheville, Dario Napoli en EE. UU., y los hermanos Rosenberg en Viljandi, Estonia, 9 de octubre.",
  },
  "latin-america-manouche-2026": {
    title: "Sudamérica y Centroamérica — jams y festivales en el globo",
    body: "Buenos Aires: jam mensual de Swing Medical en Bar de Fondo (Julián Álvarez 1200). Festival Django Argentina cada mayo. Curitiba: Festival Manouche, 20–25 de octubre de 2026. Gypsy Jazz Club de Brasília, Piracicaba, Hot Club Medellín, Hot Club de San Miguel, Festival Django CL en Santiago. Uruguay: no hay jam fijo publicado.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert publica La Pompe Live",
    body: "El violinista y profesor neerlandés publicó La Pompe Live en agosto de 2026 — cifrados, setlists y la pompe en el bolsillo. iPhone y Android. Tutorial de principiantes en YouTube desde el 10 de agosto.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — primer sábado en Utrecht",
    body: "Jazz manouche en The Music Space XL, Australiëlaan 24. Primer sábado del mes, 19:00–23:00. Primera noche 5 de septiembre de 2026: abre Chris’ Collective.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — segundo miércoles en Ámsterdam",
    body: "Jam acústica en Café Insulinde, Sumatrastraat 24. Segundo miércoles del mes desde las 19:00. Abierta a todos. Siguiente: 14 de octubre de 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 de abril–2 de mayo de 2027",
    body: "Campamento de Nuno Marinho y Marian Yanchyk en el Alentejo. Ritmo por la mañana, solo después de comer, jams por la noche.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Segundo álbum del guitarrista corso con Benji Winterstein, William Brunard y Bastien Brison.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "El nuevo disco del guitarrista finlandés vuelve al gypsy jazz. Con Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg y Matheus Nicolaiewsky.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Séptimo álbum de Napoli. Primero el tema título; ahora el disco. Benji Winterstein al ritmo.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Un nuevo libro Django desde Helmond. La serie Celebration está en Spotify; las noches en vivo siguen de gira.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "El libro de YouTube del trío alemán, en disco. Abre California Dreamin’. Highwire salió el mismo año.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "El álbum del trío alemán con Costel Nitescu — trece piezas, grabadas en un día y medio.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène toca a Loulou Gasté",
    body: "Lagrène lee al autor de Feelings. Un disco de guitarra que sigue siendo gypsy jazz en la mano izquierda.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre y Adrien Moignard — New Viaggio",
    body: "Dos leads franceses en una fecha. El sonido de Debarre, el fuego de Moignard.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub está abierto",
    body: "Un círculo mundial para la música: jams, conciertos, grupos, camps, luthiers y las páginas de los músicos. Únete y pon una fecha en el calendario.",
  },
});

export const NEWS_JA = pack({
  "angelo-debarre-ulule": {
    title: "アンジェロ・デバール支援のクラウドファンディング",
    body: "Denis ChangがAngelo Debarreからのメッセージを伝えた。体調が優れず支援が必要だという。Ululeでクラウドファンディングが行われている。リンクはこのページに。",
  },
  "la-pompe-live-app": {
    title: "クリスティアーン・ファン・ヘーメルトが La Pompe Live を公開",
    body: "オランダのバイオリニスト兼講師が La Pompe Live を 2026年8月に発売。コード譜、セットリスト、ポンプをポケットに。iPhone と Android。YouTube の初心者ガイドは 8月10日。",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — ユトレヒト、毎月第一土曜",
    body: "The Music Space XL（Australiëlaan 24）でジャズ・マヌーシュ。毎月第一土曜 19:00–23:00。初回は 2026年9月5日、Chris’ Collective がオープニング。",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — アムステルダム、毎月第二水曜",
    body: "Café Insulinde（Sumatrastraat 24）のアコースティック・ジャム。毎月第二水曜 19:00 から。誰でも参加可。次回は 2026年10月14日。",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — ヴィラ・ヴィソサ、2027年4月28日–5月2日",
    body: "ヌノ・マリーニョとマリアン・ヤンチクのキャンプ。朝はリズム、午後はソロ、夜はジャム。",
  },
  "fanou-vol-2-out": {
    title: "ファヌ・トラシンタ — Gipsy Guitar From Corsica Vol. 2",
    body: "コルシカのギタリストの2作目。ベンジ・ウィンターシュタイン、ウィリアム・ブリュナール、バスティアン・ブリソン。",
  },
  "olli-soikkeli-comeback-out": {
    title: "オリ・ソイッケリ — Comeback",
    body: "フィンランドのギタリストの新作。ジプシー・ジャズへ回帰。ストチェロ、パウルス、ヌーシェ、マテウスが参加。",
  },
  "dario-napoli-sicilian-blood": {
    title: "ダリオ・ナポリ — Sicilian Blood",
    body: "7作目。先にタイトル曲、いまフルアルバム。リズムはベンジ・ウィンターシュタイン。",
  },
  "stochelo-django-celebration": {
    title: "ストチェロ・ローゼンバーグ — Django Celebration #01",
    body: "ヘルモントからの新しいジャンゴ作品。Spotify でシリーズを、ツアーでライヴを。",
  },
  "joscho-playlist": {
    title: "ヨッショ・シュテファン・トリオ — Playlist",
    body: "ドイツのトリオの YouTube 曲集をレコードに。California Dreamin’ で始まり、同年に Highwire。",
  },
  "joscho-four-of-a-kind": {
    title: "ヨッショ・シュテファン・トリオ — Four Of A Kind",
    body: "コステル・ニテスクを迎えたアルバム。13曲を1日半で録音。",
  },
  "bireli-loulou-gaste": {
    title: "ビレリ・ラグレンがルル・ガステを弾く",
    body: "Feelings の作者をラグレンが読む。左手はジプシー・ジャズのまま。",
  },
  "angelo-adrien-viaggio": {
    title: "アンジェロ・ドバールとアドリアン・モワニャール — New Viaggio",
    body: "フランスのリードギター二人。ドバールの音、モワニャールの火。",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub がオープン",
    body: "世界の輪：ジャム、コンサート、グループ、キャンプ、ルシアー、演奏者のページ。参加して日程をカレンダーへ。",
  },
});

export const NEWS_KO = pack({
  "la-pompe-live-app": {
    title: "크리스티안 반 헤메르트, La Pompe Live 출시",
    body: "네덜란드 바이올리니스트이자 선생님이 La Pompe Live를 2026년 8월에 냈습니다. 코드차트, 셋리스트, 라 폼프를 주머니에. iPhone과 Android. YouTube 초보 가이드는 8월 10일.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — 위트레흐트 매월 첫째 토요일",
    body: "The Music Space XL, Australiëlaan 24. 매월 첫째 토요일 19:00–23:00. 첫 밤 2026년 9월 5일, Chris’ Collective 오프닝.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — 암스테르담 매월 둘째 수요일",
    body: "Café Insulinde, Sumatrastraat 24. 매월 둘째 수요일 19:00부터. 누구나. 다음: 2026년 10월 14일.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — 빌라 비소사, 2027년 4월 28일–5월 2일",
    body: "누노 마리뉴와 마리안 얀칙의 캠프. 아침 리듬, 점심 후 솔로, 저녁 잼.",
  },
  "fanou-vol-2-out": {
    title: "파누 토라신타 — Gipsy Guitar From Corsica Vol. 2",
    body: "코르시카 기타리스트의 두 번째 앨범. 벤지, 윌리엄, 바스티앙.",
  },
  "olli-soikkeli-comeback-out": {
    title: "올리 소이켈리 — Comeback",
    body: "핀란드 기타리스트의 새 음반. 집시 재즈로 돌아온다. 스토첼로, 파울루스, 누셰, 마테우스 참여.",
  },
  "dario-napoli-sicilian-blood": {
    title: "다리오 나폴리 — Sicilian Blood",
    body: "일곱 번째 앨범. 타이틀곡에 이어 풀 앨범. 리듬은 벤지 윈터슈타인.",
  },
  "stochelo-django-celebration": {
    title: "스토첼로 로젠버그 — Django Celebration #01",
    body: "헬몬트의 새 장고 작품. 스포티파이의 Celebration 시리즈, 라이브는 투어 중.",
  },
  "joscho-playlist": {
    title: "요쇼 슈테판 트리오 — Playlist",
    body: "독일 트리오의 유튜브 곡집. California Dreamin’으로 시작, 같은 해 Highwire.",
  },
  "joscho-four-of-a-kind": {
    title: "요쇼 슈테판 트리오 — Four Of A Kind",
    body: "코스텔 니테스쿠와 함께한 앨범. 13곡을 하루 반 만에 녹음.",
  },
  "bireli-loulou-gaste": {
    title: "비렐리 라그렌, 룰루 가스테를 연주하다",
    body: "Feelings의 작곡가를 라그렌이 읽는다. 왼손은 집시 재즈.",
  },
  "angelo-adrien-viaggio": {
    title: "안젤로 드바르와 아드리앙 무아냐르 — New Viaggio",
    body: "프랑스 리드 기타 둘. 드바르의 소리, 무아냐르의 불.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub 오픈",
    body: "전 세계 서클: 잼, 콘서트, 그룹, 캠프, 루티에, 연주자 페이지. 가입하고 날짜를 올리세요.",
  },
});

export const NEWS_ZH = pack({
  "la-pompe-live-app": {
    title: "Christiaan van Hemert 发布 La Pompe Live",
    body: "荷兰小提琴家兼老师于 2026年8月推出 La Pompe Live：谱、歌单和 pompe 装进口袋。iPhone 与 Android。YouTube 入门教程为 8月10日。",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — 乌得勒支每月第一个周六",
    body: "The Music Space XL，Australiëlaan 24。每月第一个周六 19:00–23:00。首场 2026年9月5日，Chris’ Collective 开场。",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — 阿姆斯特丹每月第二个周三",
    body: "Café Insulinde，Sumatrastraat 24。每月第二个周三 19:00 起。欢迎所有人。下一场：2026年10月14日。",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — 维拉维索萨，2027年4月28日–5月2日",
    body: "Nuno Marinho 与 Marian Yanchyk 的训练营。上午节奏，午饭后独奏，晚上即兴。",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "科西嘉吉他手第二张专辑，与 Benji Winterstein、William Brunard、Bastien Brison。",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "芬兰吉他手新作回到吉普赛爵士。Stochelo、Paulus、Nous’che、Matheus 参与。",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "第七张专辑。先出标题曲，现已整张上线。节奏吉他 Benji Winterstein。",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "来自 Helmond 的新 Django 作品。Celebration 系列在 Spotify；现场继续巡演。",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "德国三重奏的 YouTube 曲集做成唱片。California Dreamin’ 开场，同年还有 Highwire。",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "与 Costel Nitescu 合作的专辑。十三首曲子，一天半录完。",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène 演奏 Loulou Gasté",
    body: "Lagrène 演绎 Feelings 的作者。左手仍是吉普赛爵士。",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre 与 Adrien Moignard — New Viaggio",
    body: "两位法国主音吉他。Debarre 的声音，Moignard 的火。",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub 已开放",
    body: "全球圈子：即兴、演出、乐队、训练营、制琴师与乐手页面。加入并把日期放进日历。",
  },
});

export const NEWS_ZH_TW = pack({
  "la-pompe-live-app": {
    title: "Christiaan van Hemert 發布 La Pompe Live",
    body: "荷蘭小提琴家兼老師於 2026年8月推出 La Pompe Live：譜、歌單和 pompe 裝進口袋。iPhone 與 Android。YouTube 入門教學為 8月10日。",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — 烏得勒支每月第一個週六",
    body: "The Music Space XL，Australiëlaan 24。每月第一個週六 19:00–23:00。首場 2026年9月5日，Chris’ Collective 開場。",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — 阿姆斯特丹每月第二個週三",
    body: "Café Insulinde，Sumatrastraat 24。每月第二個週三 19:00 起。歡迎所有人。下一場：2026年10月14日。",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — 維拉維索薩，2027年4月28日–5月2日",
    body: "Nuno Marinho 與 Marian Yanchyk 的訓練營。上午節奏，午飯後獨奏，晚上即興。",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "科西嘉吉他手第二張專輯，與 Benji Winterstein、William Brunard、Bastien Brison。",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "芬蘭吉他手新作回到吉普賽爵士。Stochelo、Paulus、Nous’che、Matheus 參與。",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "第七張專輯。先出標題曲，現已整張上線。節奏吉他 Benji Winterstein。",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "來自 Helmond 的新 Django 作品。Celebration 系列在 Spotify；現場繼續巡演。",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "德國三重奏的 YouTube 曲集做成唱片。California Dreamin’ 開場，同年還有 Highwire。",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "與 Costel Nitescu 合作的專輯。十三首曲子，一天半錄完。",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène 演奏 Loulou Gasté",
    body: "Lagrène 演繹 Feelings 的作者。左手仍是吉普賽爵士。",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre 與 Adrien Moignard — New Viaggio",
    body: "兩位法國主音吉他。Debarre 的聲音，Moignard 的火。",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub 已開放",
    body: "全球圈子：即興、演出、樂團、訓練營、製琴師與樂手頁面。加入並把日期放進日曆。",
  },
});

export const NEWS_ID = pack({
  "la-pompe-live-app": {
    title: "Christiaan van Hemert merilis La Pompe Live",
    body: "Pemain biola dan guru Belanda merilis La Pompe Live pada Agustus 2026 — chord, setlist, dan la pompe di saku. iPhone dan Android. Tutorial pemula di YouTube sejak 10 Agustus.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — Sabtu pertama di Utrecht",
    body: "Jazz manouche di The Music Space XL, Australiëlaan 24. Sabtu pertama setiap bulan, 19:00–23:00. Malam pertama 5 September 2026: Chris’ Collective membuka.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — Rabu kedua di Amsterdam",
    body: "Jam akustik di Café Insulinde, Sumatrastraat 24. Rabu kedua setiap bulan dari 19:00. Terbuka untuk semua. Berikutnya: 14 Oktober 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 April–2 Mei 2027",
    body: "Kamp Nuno Marinho dan Marian Yanchyk di Alentejo. Pagi ritme, setelah makan siang solo, malam jam.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Album kedua gitaris Korsika bersama Benji Winterstein, William Brunard, dan Bastien Brison.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "Rekaman baru gitaris Finlandia kembali ke gypsy jazz. Stochelo, Paulus, Nous’che, dan Matheus ikut.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Album ketujuh Napoli. Dulu judul lagunya, sekarang album penuh. Benji Winterstein di ritme.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Buku Django baru dari Helmond. Serial Celebration di Spotify; malam live terus tur.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "Buku YouTube trio Jerman dalam piringan. California Dreamin’ membuka. Highwire menyusul tahun yang sama.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "Album trio Jerman bersama Costel Nitescu — tiga belas lagu, direkam dalam sehari setengah.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène memainkan Loulou Gasté",
    body: "Lagrène membaca penulis Feelings. Piringan gitar yang di tangan kiri tetap gypsy jazz.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre dan Adrien Moignard — New Viaggio",
    body: "Dua gitar lead Prancis. Suara Debarre, api Moignard.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub sudah buka",
    body: "Lingkaran dunia untuk musik: jam, konser, grup, kamp, pembuat gitar, dan halaman pemain. Gabung dan taruh tanggal di kalender.",
  },
});

export const NEWS_TH = pack({
  "la-pompe-live-app": {
    title: "Christiaan van Hemert เปิดตัว La Pompe Live",
    body: "นักไวโอลินและครูชาวดัตช์ออก La Pompe Live ในเดือนสิงหาคม 2026 — คอร์ด เซ็ตลิสต์ และลาปอมป์ในกระเป๋า iPhone และ Android บทสอนมือใหม่บน YouTube ตั้งแต่วันที่ 10 สิงหาคม",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — เสาร์แรกที่ยูเทรคท์",
    body: "แจ๊ส มานูช ที่ The Music Space XL ถนน Australiëlaan 24 เสาร์แรกของเดือน 19:00–23:00 คืนแรก 5 กันยายน 2026 Chris’ Collective เปิด",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — พุธที่สองที่อัมสเตอร์ดัม",
    body: "แจมกีตาร์ที่ Café Insulinde Sumatrastraat 24 พุธที่สองของเดือนตั้งแต่ 19:00 เปิดสำหรับทุกคน ครั้งหน้า: 14 ตุลาคม 2026",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa 28 เม.ย.–2 พ.ค. 2027",
    body: "ค่ายของ Nuno Marinho และ Marian Yanchyk ที่อาเลนเตฌู เช้าจังหวะ บ่ายโซโล ดึกแจม",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "อัลบั้มที่สองของกีตาร์คอร์ซิกากับ Benji Winterstein, William Brunard และ Bastien Brison",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "แผ่นใหม่ของกีตาร์ฟินแลนด์กลับสู่ยิปซีแจ๊ส มี Stochelo, Paulus, Nous’che และ Matheus",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "อัลบั้มที่เจ็ด ออกเพลงชื่อก่อน ตอนนี้ทั้งแผ่น ริทึ่มคือ Benji Winterstein",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "ผลงาน Django ใหม่จาก Helmond ซีรีส์ Celebration บน Spotify คอนเสิร์ตยังทัวร์ต่อ",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "หนังสือ YouTube ของทริโอเยอรมันลงแผ่น เปิดด้วย California Dreamin’ ปีเดียวกันมี Highwire",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "อัลบั้มทริโอเยอรมันกับ Costel Nitescu สิบสามเพลง อัดในวันครึ่ง",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène เล่น Loulou Gasté",
    body: "Lagrène อ่านนักแต่ง Feelings มือซ้ายยังเป็นยิปซีแจ๊ส",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre และ Adrien Moignard — New Viaggio",
    body: "ลีดกีตาร์ฝรั่งเศสสองคน เสียง Debarre ไฟ Moignard",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub เปิดแล้ว",
    body: "วงกลมทั่วโลก: แจม คอนเสิร์ต วง ค่าย ช่างกีตาร์ และหน้าผู้เล่น สมัครแล้วใส่วันที่ในปฏิทิน",
  },
});

export const NEWS_HU = pack({
  "weekly-scan-2026-08-23": {
    title: "Ezen a héten a földgömbön — Barcelona, London, Madison, Langley",
    body: "Új heti jam Barcelonában: Martes Manouche, minden kedden a Soda Acústicban, Gràcia. Ma Chicagóban a La Tosca jam a Cara Carában. Következő hetek: Midwest Django Fest (szept. 11–12, Madison), DjangoFest Northwest (szept. 15–20, Whidbey Island — Gismo Graf, Gonzalo Bergara, Tim Kliphuis), Django In London (szept. 17–19, St Mary’s — Hugo Guezbar, Angelo Debarre, London Django Collective), Stéphane Wrembel Chicagóban, Rochesterben és Asheville-ben, Dario Napoli amerikai körútja, és a Rosenberg fivérek Viljandiban, Észtország, október 9.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert kiadta a La Pompe Live-ot",
    body: "A holland hegedűs és tanár 2026 augusztusában megjelentette a La Pompe Live-ot — akkordok, setlist és a pompe a zsebedben. iPhone és Android. A YouTube-kezdőtutorial augusztus 10-től.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — első szombat Utrechtben",
    body: "Jazz Manouche a The Music Space XL-ben, Australiëlaan 24. A hónap első szombatja, 19:00–23:00. Első este 2026. szeptember 5.: a Chris’ Collective nyit. WhatsApp a jam oldalon.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — második szerda Amszterdamban",
    body: "Akusztikus gypsy jazz jam a Café Insulindében, Sumatrastraat 24. A hónap második szerdája 19:00-tól. Mindenki jöhet. Következő: 2026. október 14.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 2027. április 28.–május 2.",
    body: "Nuno Marinho és Marian Yanchyk gypsy jazz tábora az Alentejóban. Reggel ritmus, ebéd után szóló, este jam.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "A korzikai gitáros második lemeze Benji Wintersteinnel, William Brunard-dal és Bastien Brisonnal. Az egyik fő mai francia formáció.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "A finn gitáros új lemeze visszatér a gypsy jazzhez. Rajta Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg és Matheus Nicolaiewsky.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Napoli hetedik albuma. A címadó dal jött először; a teljes lemez már a platformokon van. A ritmusgitár Benji Winterstein.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Új Django-könyv Helmondból. A Celebration sorozat Spotifyon van; a koncertek tovább turnéznak.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "A német trió YouTube-könyve lemezen. A California Dreamin’ nyitja. Ugyanabban az évben jött a Highwire.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "A német trió lemeze Costel Nitescuval — tizenhárom darab, másfél nap alatt felvéve.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène Loulou Gastét játszik",
    body: "Lagrène a Feelings szerzőjét olvassa. Gitárlemez, a bal kéz még mindig gypsy jazz.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre és Adrien Moignard — New Viaggio",
    body: "Két francia szólógitár egy napon. Debarre hangja, Moignard tüze.",
  },
  "hub-opens": {
    title: "A Gypsy Jazz Hub nyitva",
    body: "Világkör a zenének: jam, koncert, zenekar, tábor, hangszerész, a játékosok oldalai. Csatlakozz, és tedd fel a dátumot a naptárra.",
  },
});

export const NEWS_PL = pack({
  "weekly-scan-2026-08-23": {
    title: "W tym tygodniu na globie — Barcelona, Londyn, Madison, Langley",
    body: "Nowy cotygodniowy jam w Barcelonie: Martes Manouche, każdy wtorek w Soda Acústic, Gràcia. Dziś w Chicago jam La Tosca w Cara Cara. Kolejne tygodnie: Midwest Django Fest (11–12 wrz, Madison), DjangoFest Northwest (15–20 wrz, Whidbey Island — Gismo Graf, Gonzalo Bergara, Tim Kliphuis), Django In London (17–19 wrz, St Mary’s — Hugo Guezbar, Angelo Debarre, London Django Collective), Stéphane Wrembel w Chicago, Rochester i Asheville, Dario Napoli w USA, bracia Rosenberg w Viljandi, Estonia, 9 października.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert wydał La Pompe Live",
    body: "Holenderski skrzypek i nauczyciel wypuścił La Pompe Live w sierpniu 2026 — siatki, setlisty i pompe w kieszeni. iPhone i Android. Tutorial na YouTube od 10 sierpnia.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — pierwsza sobota w Utrechcie",
    body: "Jazz Manouche w The Music Space XL, Australiëlaan 24. Pierwsza sobota miesiąca, 19:00–23:00. Pierwszy wieczór 5 września 2026: otwiera Chris’ Collective. WhatsApp na stronie jamu.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — druga środa w Amsterdamie",
    body: "Akustyczny jam gypsy jazz w Café Insulinde, Sumatrastraat 24. Druga środa miesiąca od 19:00. Dla wszystkich. Następny: 14 października 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 kwietnia–2 maja 2027",
    body: "Obóz gypsy jazz Nuno Marinho i Mariana Yanchyka w Alentejo. Rano rytm, po obiedzie solo, wieczorem jam.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Druga płyta korsykańskiego gitarzysty z Benjim Wintersteinem, Williamem Brunardem i Bastienem Brisonem. Jeden z głównych obecnych francuskich składów.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "Nowa płyta fińskiego gitarzysty wraca do gypsy jazzu. Są na niej Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg i Matheus Nicolaiewsky.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Siódmy album Napoli. Tytułowy utwór był pierwszy; cała płyta jest już na platformach. Rytm trzyma Benji Winterstein.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Nowa książka Django z Helmond. Seria Celebration jest na Spotify; koncerty dalej jeżdżą.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "YouTube-owa książka niemieckiego tria na płycie. Otwiera California Dreamin’. W tym samym roku wyszedł Highwire.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "Płyta niemieckiego tria z Costelem Nitescu — trzynaście utworów, nagrane w półtora dnia.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène gra Loulou Gasté",
    body: "Lagrène czyta francuskiego autora Feelings. Gitara, lewa ręka nadal gypsy jazz.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre i Adrien Moignard — New Viaggio",
    body: "Dwie francuskie gitary solowe jednego dnia. Dźwięk Debarre’a, ogień Moignarda.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub jest otwarty",
    body: "Światowe koło dla muzyki: jamy, koncerty, zespoły, obozy, lutnicy i strony muzyków. Dołącz i wpisz datę do kalendarza.",
  },
});

export const NEWS_SR = pack({
  "weekly-scan-2026-08-23": {
    title: "Ove nedelje na globusu — Barselona, London, Madison, Langley",
    body: "Novi nedeljni džem u Barseloni: Martes Manouche, svakog utorka u Soda Acústic, Gràcia. Danas u Čikagu La Tosca džem u Cara Cara. Naredne nedelje: Midwest Django Fest (11–12. sep, Madison), DjangoFest Northwest (15–20. sep, Whidbey Island — Gismo Graf, Gonzalo Bergara, Tim Kliphuis), Django In London (17–19. sep, St Mary’s — Hugo Guezbar, Angelo Debarre, London Django Collective), Stéphane Wrembel u Čikagu, Rochesteru i Ashevilleu, Dario Napoli u SAD, braća Rosenberg u Viljandiju, Estonija, 9. oktobar.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert objavio La Pompe Live",
    body: "Holandski violinista i učitelj objavio je La Pompe Live u avgustu 2026 — šeme, setliste i pompa u džepu. iPhone i Android. Tutorial na YouTube-u od 10. avgusta.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — prva subota u Utrechtu",
    body: "Jazz Manouche u The Music Space XL, Australiëlaan 24. Prva subota u mesecu, 19:00–23:00. Prva noć 5. septembar 2026: otvara Chris’ Collective. WhatsApp na stranici jama.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — druga sreda u Amsterdamu",
    body: "Akustični gypsy jazz jam u Café Insulinde, Sumatrastraat 24. Druga sreda u mesecu od 19:00. Svi su dobrodošli. Sledeći: 14. oktobar 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28. april–2. maj 2027",
    body: "Kamp gypsy jazza Nuna Marinha i Mariana Jančika u Alentežu. Ujutru ritam, posle ručka solo, uveče jam.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Drugi album korzikanskog gitariste sa Benji Wintersteinom, Williamom Brunardom i Bastienom Brisonom. Jedna od glavnih današnjih francuskih grupa.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "Novi album finskog gitariste vraća se gypsy jazzu. Na njemu su Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg i Matheus Nicolaiewsky.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Napolijev sedmi album. Naslovna pesma je izašla prva; ceo album je na platformama. Ritam drži Benji Winterstein.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Nova Django knjiga iz Helmonda. Serija Celebration je na Spotifyju; koncerti i dalje idu na turneju.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "YouTube knjiga nemačkog tria na ploči. Otvara je California Dreamin’. Iste godine je izašao Highwire.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "Album nemačkog tria sa Costelom Nitescuom — trinaest komada, snimljeno za dan i po.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène svira Loulou Gastéa",
    body: "Lagrène čita francuskog autora pesme Feelings. Gitara, leva ruka i dalje gypsy jazz.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre i Adrien Moignard — New Viaggio",
    body: "Dve francuske solo gitare u jednoj noći. Debarreov zvuk, Moignardova vatra.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub je otvoren",
    body: "Svetski krug za muziku: jamovi, koncerti, grupe, kampovi, lutijeri i stranice svirača. Pridruži se i stavi datum u kalendar.",
  },
});

export const NEWS_HR = pack({
  "la-pompe-live-app": {
    title: "Christiaan van Hemert objavio La Pompe Live",
    body: "Nizozemski violinist i učitelj objavio je La Pompe Live u kolovozu 2026 — sheme, setliste i pompa u džepu. iPhone i Android. Tutorial na YouTubeu od 10. kolovoza.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — prva subota u Utrechtu",
    body: "Jazz Manouche u The Music Space XL, Australiëlaan 24. Prva subota u mjesecu, 19:00–23:00. Prva noć 5. rujna 2026.: otvara Chris’ Collective. WhatsApp na stranici jama.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — druga srijeda u Amsterdamu",
    body: "Akustični gypsy jazz jam u Café Insulinde, Sumatrastraat 24. Druga srijeda u mjesecu od 19:00. Svi su dobrodošli. Sljedeći: 14. listopada 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28. travnja–2. svibnja 2027.",
    body: "Kamp gypsy jazza Nuna Marinha i Mariana Yanchyka u Alenteju. Ujutro ritam, poslije ručka solo, navečer jam.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Drugi album korzikanskog gitarista s Benji Wintersteinom, Williamom Brunardom i Bastienom Brisonom. Jedna od glavnih današnjih francuskih grupa.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "Novi album finskog gitarista vraća se gypsy jazzu. Na njemu su Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg i Matheus Nicolaiewsky.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Napolijev sedmi album. Naslovna pjesma izašla je prva; cijeli album je na platformama. Ritam drži Benji Winterstein.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Nova Django knjiga iz Helmonda. Serija Celebration je na Spotifyju; koncerti i dalje idu na turneju.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "YouTube knjiga njemačkog tria na ploči. Otvara je California Dreamin’. Iste godine izašao je Highwire.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "Album njemačkog tria s Costelom Nitescuom — trinaest komada, snimljeno u dan i pol.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène svira Loulou Gastéa",
    body: "Lagrène čita francuskog autora pjesme Feelings. Gitara, lijeva ruka i dalje gypsy jazz.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre i Adrien Moignard — New Viaggio",
    body: "Dvije francuske solo gitare u jednoj noći. Debarreov zvuk, Moignardova vatra.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub je otvoren",
    body: "Svjetski krug za glazbu: jamovi, koncerti, grupe, kampovi, lutnjari i stranice svirača. Pridruži se i stavi datum u kalendar.",
  },
});

export const NEWS_PT = pack({
  "weekly-scan-2026-08-23": {
    title: "Esta semana no globo — Barcelona, Londres, Madison, Langley",
    body: "Novo jam semanal em Barcelona: Martes Manouche, todas as terças no Soda Acústic, Gràcia. Hoje em Chicago, o jam La Tosca no Cara Cara. Próximas semanas: Midwest Django Fest (11–12 set, Madison), DjangoFest Northwest (15–20 set, Whidbey Island — Gismo Graf, Gonzalo Bergara, Tim Kliphuis), Django In London (17–19 set, St Mary’s — Hugo Guezbar, Angelo Debarre, London Django Collective), Stéphane Wrembel em Chicago, Rochester e Asheville, Dario Napoli nos EUA, e os irmãos Rosenberg em Viljandi, Estónia, 9 de outubro.",
  },
  "latin-america-manouche-2026": {
    title: "América do Sul e Central — jams e festivais no globo",
    body: "Buenos Aires: jam mensal do Swing Medical no Bar de Fondo (Julián Álvarez 1200). Festival Django Argentina em maio. Curitiba: Festival Manouche, 20–25 de outubro de 2026. Gypsy Jazz Club de Brasília, Piracicaba, Hot Club Medellín, Hot Club de San Miguel, Festival Django CL em Santiago. Uruguai: sem jam fixo publicado.",
  },
  "la-pompe-live-app": {
    title: "Christiaan van Hemert lançou o La Pompe Live",
    body: "O violinista e professor neerlandês publicou o La Pompe Live em agosto de 2026 — grelhas, setlists e a pompe no bolso. iPhone e Android. Tutorial no YouTube desde 10 de agosto.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — primeiro sábado em Utrecht",
    body: "Jazz Manouche no The Music Space XL, Australiëlaan 24. Primeiro sábado do mês, 19:00–23:00. Primeira noite 5 de setembro de 2026: Chris’ Collective abre. WhatsApp na página do jam.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — segunda quarta-feira em Amesterdão",
    body: "Jam acústico de gypsy jazz no Café Insulinde, Sumatrastraat 24. Segunda quarta-feira do mês a partir das 19:00. Aberto a todos. Próximo: 14 de outubro de 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 de abril–2 de maio de 2027",
    body: "O campo de gypsy jazz de Nuno Marinho e Marian Yanchyk no Alentejo. Ritmo de manhã, solo depois do almoço, jams à noite. O Festival Django Portugal é o irmão em digressão.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "O segundo álbum do guitarrista corso com Benji Winterstein, William Brunard e Bastien Brison. Um dos principais grupos franceses de agora.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "O novo disco do guitarrista finlandês volta ao gypsy jazz. Estão Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg e Matheus Nicolaiewsky.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "O sétimo álbum de Napoli. O tema-título saiu primeiro; o disco completo está nas plataformas. O ritmo é Benji Winterstein.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Um novo livro de Django a partir de Helmond. A série Celebration está no Spotify; os concertos continuam em digressão.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "O livro de YouTube do trio alemão, em disco. Abre com California Dreamin’. No mesmo ano saiu Highwire.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "O álbum do trio alemão com Costel Nitescu — treze peças, gravadas num dia e meio.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène toca Loulou Gasté",
    body: "Lagrène lê o autor francês de Feelings. Um disco de guitarra em que a mão esquerda ainda é gypsy jazz.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre e Adrien Moignard — New Viaggio",
    body: "Duas guitarras solistas francesas numa noite. O som de Debarre, o fogo de Moignard.",
  },
  "hub-opens": {
    title: "O Gypsy Jazz Hub está aberto",
    body: "Um círculo mundial para a música: jams, concertos, grupos, campos, luthiers e as páginas dos músicos. Junta-te e põe uma data no calendário.",
  },
});

export const NEWS_RU = pack({
  "la-pompe-live-app": {
    title: "Christiaan van Hemert выпустил La Pompe Live",
    body: "Голландский скрипач и педагог выпустил La Pompe Live в августе 2026 — сетки, сет-листы и помпа в кармане. iPhone и Android. Урок на YouTube с 10 августа.",
  },
  "hot-club-de-tms": {
    title: "Hot Club de TMS — первая суббота в Утрехте",
    body: "Jazz Manouche в The Music Space XL, Australiëlaan 24. Первая суббота месяца, 19:00–23:00. Первая ночь 5 сентября 2026: открывает Chris’ Collective. WhatsApp на странице джема.",
  },
  "hot-club-insulinde": {
    title: "Hot Club Insulinde — вторая среда в Амстердаме",
    body: "Акустический gypsy jazz джем в Café Insulinde, Sumatrastraat 24. Вторая среда месяца с 19:00. Для всех. Следующий: 14 октября 2026.",
  },
  "django-portugal-camp-2027": {
    title: "Django Portugal Camp — Vila Viçosa, 28 апреля–2 мая 2027",
    body: "Лагерь gypsy jazz Нуну Маринью и Мариана Янчика в Алентежу. Утром ритм, после обеда соло, вечером джем. Festival Django Portugal — гастрольный брат.",
  },
  "fanou-vol-2-out": {
    title: "Fanou Torracinta — Gipsy Guitar From Corsica Vol. 2",
    body: "Второй альбом корсиканского гитариста с Benji Winterstein, William Brunard и Bastien Brison. Одна из главных нынешних французских групп.",
  },
  "olli-soikkeli-comeback-out": {
    title: "Olli Soikkeli — Comeback",
    body: "Новый диск финского гитариста возвращается к gypsy jazz. На нём Stochelo Rosenberg, Paulus Schäfer, Nous’che Rosenberg и Matheus Nicolaiewsky.",
  },
  "dario-napoli-sicilian-blood": {
    title: "Dario Napoli — Sicilian Blood",
    body: "Седьмой альбом Наполи. Заглавный трек вышел первым; весь диск уже на платформах. Ритм — Benji Winterstein.",
  },
  "stochelo-django-celebration": {
    title: "Stochelo Rosenberg — Django Celebration #01",
    body: "Новая книга Django из Хелмонда. Серия Celebration на Spotify; концерты продолжают тур.",
  },
  "joscho-playlist": {
    title: "Joscho Stephan Trio — Playlist",
    body: "YouTube-книга немецкого трио на пластинке. Открывает California Dreamin’. В том же году вышел Highwire.",
  },
  "joscho-four-of-a-kind": {
    title: "Joscho Stephan Trio — Four Of A Kind",
    body: "Альбом немецкого трио с Costel Nitescu — тринадцать пьес, записанных за полтора дня.",
  },
  "bireli-loulou-gaste": {
    title: "Biréli Lagrène играет Loulou Gasté",
    body: "Lagrène читает французского автора Feelings. Гитарный диск, левая рука всё ещё gypsy jazz.",
  },
  "angelo-adrien-viaggio": {
    title: "Angelo Debarre и Adrien Moignard — New Viaggio",
    body: "Две французские соло-гитары за один вечер. Звук Debarre, огонь Moignard.",
  },
  "hub-opens": {
    title: "Gypsy Jazz Hub открыт",
    body: "Мировой круг для музыки: джемы, концерты, группы, лагеря, мастера гитар и страницы музыкантов. Присоединяйтесь и поставьте дату в календарь.",
  },
});
