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
    "Bucharest’s living Django chair is Django Sound Quartet — manouche with lăutărească, nights at Trattoria Monza and The Great Hill when they post them. Grădina Alhambra has hosted them (Gypsy Jazz Lăutăresc, 26 Oct 2025) — mixed house, so the hub only lists the manouche bills. The older Romanian violin the Mirando family still name is Georges Boulanger (Gheorghe Pantazi, 1893–1958, Tulcea): gypsy colour with Viennese light music, The Great Gypsy Violinist sides 1934–1939. Historic records, not a current jam.",
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

/** Featured clip + house note at the top of a country page. Facts only. */
export const COUNTRY_FEATURED: Record<string, CountryFeatured> = {
  France: {
    kicker: "Paris",
    title: "Paris Guitar Connection",
    body: "A Paris podcast: six guitarists, two sofas, and a long sit about the guitar. Lives and tutorials after each episode — not a weekly public jam. The house is YouTube @ParisGuitarConnection. The six: Aurélien Robert, Guillaume Muschalle, François Thouvenot, Ghali Hadefi, Nicolas Lestoquoy, Yoann Kempst. Ghali’s pompe shorts are the ones players send each other. The episode on this page is Gypsy Jazz with a Gypsy, with Steven Reinhardt from Saint-Ouen. If you want to jam in Paris after you watch, La Chope des Puces still runs weekends on rue des Rosiers.",
    youtubeUrl: "https://www.youtube.com/watch?v=4cK5mZdbNqM",
    videoTitle: "Gypsy Jazz with a Gypsy: Steven Reinhardt — Paris Guitar Connection",
    site: "https://www.youtube.com/@ParisGuitarConnection",
    siteLabel: "youtube.com/@ParisGuitarConnection",
  },
  Norway: {
    kicker: "Oslo",
    title: "Djangofestivalen",
    body: "January in Oslo since 1980. Cosmopolite, Torshov. Jon Larsen hosts; Hot Club de Norvège is the house band. Last edition 22–24 January 2026. Next: 21–23 January 2027. Line-up not posted yet. A smaller one-day Djangofest sat at Vespa og Humla on 29 August 2026 — not the same festival.",
    site: "https://cosmopolite.no/",
    siteLabel: "cosmopolite.no",
    pageHref: "/festivals/djangofestivalen-oslo",
    pageLabel: "Djangofestivalen Oslo",
  },
  Finland: {
    kicker: "Finland",
    title: "Olli Soikkeli — Comeback tour",
    body: "Nurmes guitar, New York now. Comeback fall tour 2026: Air Force Big Band in Jyväskylä (9 Sep), Kuopio (10) and Tampere-talo (11), then the trio through Loimaa, Helsinki, Vantaa, Kotka, Flame Jazz Cruise (4 Oct) and Raisio (5 Oct, free). Official site ollisoikkeli.com. No weekly Finnish jam on file.",
    site: "https://www.ollisoikkeli.com/",
    siteLabel: "ollisoikkeli.com",
    pageHref: "/musicians/olli-soikkeli",
    pageLabel: "Olli Soikkeli",
  },
};

const FEATURED_COPY: Record<string, Record<string, Partial<CountryFeatured>>> = {
  fr: { France: { kicker: "Paris", title: "Paris Guitar Connection", body: "Un podcast parisien : six guitaristes, deux canapés, et une longue conversation sur la guitare. Lives et tutos après chaque épisode — ce n’est pas un jam public hebdomadaire. La maison, c’est YouTube @ParisGuitarConnection.", videoTitle: "Gypsy Jazz with a Gypsy : Steven Reinhardt — Paris Guitar Connection" } },
  nl: { France: { kicker: "Parijs", title: "Paris Guitar Connection", body: "Een Parijse podcast: zes gitaristen, twee banken, en een lang gesprek over de gitaar. Lives en tutos na elke aflevering — geen wekelijkse open jam.", videoTitle: "Gypsy Jazz with a Gypsy: Steven Reinhardt — Paris Guitar Connection" } },
  de: { France: { kicker: "Paris", title: "Paris Guitar Connection", body: "Ein Pariser Podcast: sechs Gitarristen, zwei Sofas, und ein langes Gespräch über die Gitarre. Lives und Tutorials nach jeder Folge — kein wöchentlicher öffentlicher Jam.", videoTitle: "Gypsy Jazz with a Gypsy: Steven Reinhardt — Paris Guitar Connection" } },
  es: { France: { kicker: "París", title: "Paris Guitar Connection", body: "Un podcast parisino: seis guitarristas, dos sofás y una larga conversación sobre la guitarra. Directos y tutoriales después de cada episodio — no es un jam público semanal.", videoTitle: "Gypsy Jazz with a Gypsy: Steven Reinhardt — Paris Guitar Connection" } },
  it: { France: { kicker: "Parigi", title: "Paris Guitar Connection", body: "Un podcast parigino: sei chitarristi, due divani e una lunga chiacchierata sulla chitarra. Live e tutorial dopo ogni puntata — non è un jam pubblico settimanale.", videoTitle: "Gypsy Jazz with a Gypsy: Steven Reinhardt — Paris Guitar Connection" } },
  pt: { France: { kicker: "Paris", title: "Paris Guitar Connection", body: "Um podcast parisiense: seis guitarristas, dois sofás e uma longa conversa sobre a guitarra. Lives e tutoriais depois de cada episódio — não é um jam público semanal.", videoTitle: "Gypsy Jazz with a Gypsy: Steven Reinhardt — Paris Guitar Connection" } },
};

export function countryFeatured(country: string, locale: string): CountryFeatured | null {
  const base = COUNTRY_FEATURED[country];
  if (!base) return null;
  const loc = FEATURED_COPY[locale]?.[country];
  return loc ? { ...base, ...loc } : base;
}
