/** Short original notes for thin country pages. Do not treat as jams. */
export const COUNTRY_NOTES: Record<string, string> = {
  Israel:
    "Gypsy jazz in Israel is a small circle, mostly Tel Aviv, not a festival country. The first local manouche band, Swing de Gitanes, started in 2007. The public jam, when it happens, is a table session: a set, then the table opens. There is no weekly listing on file. Teachers and a luthier are here. Sign in to post the next night.",
  Hungary:
    "Budapest has two rooms. One is Django: Canarro, Swing à la Django, the Gypsy Jazz Band around Roby Lakatos, jams when Manuska posts them. Next posted: Canarro at Kristály Színtér, 14 September 2026, 20:00; Roby Lakatos & Gypsy Jazz Band at Hangvilla, Veszprém, 10 October 2026, 19:00. The other is the primas orchestra — csárdás and nóta in restaurants. That is not a weekly Hot Club jam.",
  Russia:
    "Moscow chairs: Georgiy Yashagashvili / Django Friends, Dmitry Kuptsov, Lu Golovina, Ilya Delizonas — Kozlov Club, Maroseyka 9/2 and Unplugged on Myasnitskaya 15. Next billed: Django Friends, 18 September 2026, 18:00, Unplugged. No printed weekly jam. Saint Petersburg: Hot Club of Saint-Petersburg at JFC, Shpalernaya 33 — concerts when posted; mid-September board has no Hot Club night. Perm, Yekaterinburg, Samara and Tyumen bands exist; they post city by city.",
  Norway:
    "Oslo is the Nordic Django capital in January: Djangofestivalen at Cosmopolite, since 1980, hosted by Jon Larsen / Hot Club de Norvège. Next: 21–23 January 2027. A smaller one-day Djangofest sat at Vespa og Humla (29 August 2026). Concerts, not a weekly open jam — the late Cosmopolite jam is festival week only.",
  Finland:
    "Olli Soikkeli (Nurmes, now New York) is the Finnish chair the festivals book. Comeback fall tour September 2026: Jyväskylä, Kuopio, Tampere with the Air Force Big Band, then Loimaa, Helsinki, Vantaa, Kotka. Hot Club de Finlande (Ari-Jukka Luomaranta / AJL) plays when posted. No weekly open jam on file.",
  Sweden:
    "Malmö has the weekly room: Dame Ginette, every Wednesday, trio then sit-in. Stockholm’s jazz houses (Fasching, Glenn Miller Café) book Django nights when Gustav Lundgren or Andreas Öberg post them — not a weekly Hot Club jam.",
  Denmark:
    "Copenhagen: Django Jam at Christianshavns Beboerhus, last Tuesday from 20:00, free. Café Bartof takes Sinti bills (Paulus Schäfer). Jazzhus Montmartre and La Fontaine are the jazz houses to write for a gypsy night.",
  Romania:
    "Bucharest’s living Django chair is Django Sound Quartet — manouche with lăutărească, nights at Trattoria Monza and The Great Hill when they post them. The older Romanian violin the Mirando family still name is Georges Boulanger (Gheorghe Pantazi, 1893–1958, Tulcea): gypsy colour with Viennese light music, The Great Gypsy Violinist sides 1934–1939. Historic records, not a current jam.",
};

export const COUNTRY_LAST_JAM: Record<string, string> = {
  Israel:
    "Last table session on file: Ala Rampa, 12 Aug 2026. When they post the next night, it belongs here.",
};

export type CountryFeatured = {
  kicker: string;
  title: string;
  body: string;
  youtubeUrl?: string;
  videoTitle?: string;
  site?: string;
  siteLabel?: string;
  pageHref?: string;
  pageLabel?: string;
};
