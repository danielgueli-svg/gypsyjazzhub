export type ArtistClip = {
  title: string;
  url: string;
};

const CLIPS: Record<string, ArtistClip[]> = {
  "jimmy-rosenberg": [
    {
      title: "Caravan — Jimmy Rosenberg & friends (Irene Ypenburg)",
      url: "https://www.youtube.com/watch?v=qce-fwLB4BY",
    },
    {
      title: "Jimmy Rosenberg back in Oslo 2024",
      url: "https://www.youtube.com/watch?v=QI74stbG5Rs",
    },
  ],
  "joscho-stephan": [
    {
      title: "Joscho Stephan Trio — full concert, BIMHUIS",
      url: "https://www.youtube.com/watch?v=jBEDrUXCHxM",
    },
  ],
  "adrien-moignard": [
    {
      title: "Valse d'Augustine — Festival Django Reinhardt 2026",
      url: "https://www.youtube.com/watch?v=RglgAgwtmpA",
    },
  ],
  "steven-reinhardt": [
    {
      title: "Gypsy Jazz with a Gypsy — Paris Guitar Connection",
      url: "https://www.youtube.com/watch?v=4cK5mZdbNqM",
    },
  ],
  "amati-schmitt": [
    {
      title: "La Lumière de Dieu — Festival Django Reinhardt 2024",
      url: "https://www.youtube.com/watch?v=KehhO7B6pq4",
    },
    {
      title: "All Stars — full concert, Festival Django Reinhardt 2024",
      url: "https://www.youtube.com/watch?v=CW7_iD1OZdg",
    },
  ],
  "benji-winterstein": [
    {
      title: "Jam at Benji Winterstein — Django's Tiger, Samoreau",
      url: "https://www.youtube.com/watch?v=Mfnt6UQXeFc",
    },
  ],
  "fanou-torracinta": [
    {
      title: "How High the Moon — Gipsy Guitar From Corsica Vol. 1",
      url: "https://www.youtube.com/watch?v=nCgdH2pqUPw",
    },
  ],
  "paulus-schafer": [
    {
      title: "Meet Paulus Schäfer — documentary by Irene Ypenburg",
      url: "https://www.youtube.com/watch?v=zinueLOxeuk",
    },
    {
      title: "Made for Wesley — with Olli Soikkeli, Tim Kliphuis, Arnoud van den Berg",
      url: "https://www.youtube.com/watch?v=ebBKly2OlSo",
    },
  ],
  "fapy-lafertin": [
    {
      title: "I Found a New Baby — Bridge Guitar Festival",
      url: "https://www.youtube.com/watch?v=nR83NwNbiTA",
    },
    {
      title: "Autumn Leaves — Bridge Guitar Festival",
      url: "https://www.youtube.com/watch?v=B1mXaGot_OY",
    },
  ],
  "marcia-bamberg": [
    {
      title: "Festival Django Reinhardt 2026 — Samoreau",
      url: "https://www.youtube.com/watch?v=pzVEwzl8tP4",
    },
    {
      title: "Caravan",
      url: "https://www.youtube.com/watch?v=6qBVWc3R-gI",
    },
  ],
  "john-ligthart": [
    {
      title: "Festival Django Reinhardt 2026 — Samoreau",
      url: "https://www.youtube.com/watch?v=pzVEwzl8tP4",
    },
    {
      title: "Caravan",
      url: "https://www.youtube.com/watch?v=6qBVWc3R-gI",
    },
  ],
  "ronald-weel": [
    {
      title: "Festival Django Reinhardt 2026 — Samoreau",
      url: "https://www.youtube.com/watch?v=pzVEwzl8tP4",
    },
    {
      title: "Caravan",
      url: "https://www.youtube.com/watch?v=6qBVWc3R-gI",
    },
  ],
  "gismo-graf": [
    {
      title: "Gismo Graf Trio — Rotterburg, set 1",
      url: "https://www.youtube.com/watch?v=B38HuEZseQA",
    },
    {
      title: "Exactly Like You — Oslo 2026",
      url: "https://www.youtube.com/watch?v=VP_PiQxI5xU",
    },
  ],
  "tim-kliphuis": [
    {
      title: "Exactly Like You — Oslo 2026",
      url: "https://www.youtube.com/watch?v=VP_PiQxI5xU",
    },
    {
      title: "David's Swing — Oslo 2026",
      url: "https://www.youtube.com/watch?v=Kb0t3TquVYc",
    },
  ],
  "brady-winterstein": [
    {
      title: "Exactly Like You — Oslo 2026",
      url: "https://www.youtube.com/watch?v=VP_PiQxI5xU",
    },
    {
      title: "David's Swing — Oslo 2026",
      url: "https://www.youtube.com/watch?v=Kb0t3TquVYc",
    },
  ],
  "tcha-limberger": [
    {
      title: "A Primas Story",
      url: "https://www.youtube.com/watch?v=m-udMtde9o4",
    },
    {
      title: "Paulus Schäfer invites Tcha Limberger",
      url: "https://www.youtube.com/watch?v=6uDBQpd8NCs",
    },
  ],
  "wawau-adler": [
    {
      title: "Jam 5 — Samoreau 2026",
      url: "https://www.youtube.com/watch?v=Lp_8r-tq2D8",
    },
    {
      title: "Jam 4 — Samoreau 2026",
      url: "https://www.youtube.com/watch?v=K74XtDLYcYo",
    },
  ],
  "christiaan-van-hemert": [
    {
      title: "Festival Django Reinhardt 2026 — with Marcia Bamberg",
      url: "https://www.youtube.com/watch?v=pzVEwzl8tP4",
    },
    {
      title: "Gypsy jazz workshop 2025",
      url: "https://www.youtube.com/watch?v=QW-DJn3SJaQ",
    },
  ],
  "wattie-rosenberg": [
    {
      title: "Les Yeux Noirs — Bakermat Gypsy Festival",
      url: "https://www.youtube.com/watch?v=q5cq9Cyt9PQ",
    },
  ],
  "django-rosenberg": [
    {
      title: "Jam at Marcia Bamberg — Samoreau 2025, with Gismo Graf",
      url: "https://www.youtube.com/watch?v=WBdMCVFtTBg",
    },
  ],
  "daniel-gueli": [
    {
      title: "Exactly Like You — Oslo 2026",
      url: "https://www.youtube.com/watch?v=VP_PiQxI5xU",
    },
    {
      title: "Les Yeux Noirs — Bakermat Gypsy Festival",
      url: "https://www.youtube.com/watch?v=q5cq9Cyt9PQ",
    },
  ],
  "denis-chang": [
    {
      title: "Setouchi Django Street 2025 — Yashima",
      url: "https://www.youtube.com/watch?v=QWT0U7Rtls8",
    },
    {
      title: "It's OK to not be talented — Denis Chang",
      url: "https://www.youtube.com/watch?v=qJrcOR7vW5k",
    },
    {
      title: "Early Jazz Guitar — All Of Me (DC Music School)",
      url: "https://www.youtube.com/watch?v=agTtheaY2b4",
    },
  ],
  "patil-zakarian": [
    {
      title: "La Gitane — Tchan-Tchou, piano manouche",
      url: "https://www.youtube.com/watch?v=20voNa6lwEY",
    },
    {
      title: "Swing Gitan — piano manouche",
      url: "https://www.youtube.com/watch?v=kKldMQeQacQ",
    },
  ],
  "irene-ypenburg": [
    {
      title: "Caravan — Jimmy Rosenberg & friends",
      url: "https://www.youtube.com/watch?v=qce-fwLB4BY",
    },
    {
      title: "Meet Paulus Schäfer — documentary",
      url: "https://www.youtube.com/watch?v=zinueLOxeuk",
    },
    {
      title: "Made for Wesley — Paulus, Olli, Tim, Arnoud",
      url: "https://www.youtube.com/watch?v=ebBKly2OlSo",
    },
    {
      title: "Joseph Joseph — Paulus Schäfer invites Joscho Stephan",
      url: "https://www.youtube.com/watch?v=5o7f-magZcY",
    },
    {
      title: "Meet Feigeli Prisor",
      url: "https://www.youtube.com/watch?v=Mz_KpVIM9wU",
    },
    {
      title: "Girl from Ipanema — Karin & Irene",
      url: "https://www.youtube.com/watch?v=kO-221ghciU",
    },
  ],
  "feigeli-prisor": [
    {
      title: "Meet Feigeli Prisor — Irene Ypenburg",
      url: "https://www.youtube.com/watch?v=Mz_KpVIM9wU",
    },
  ],
  "john-rijsdijk": [
    {
      title: "Out of Nowhere — with Irene Ypenburg",
      url: "https://www.youtube.com/watch?v=1p-ZNE6wSdc",
    },
  ],
  "hari-maharjan": [
    {
      title: "Teesa — Hari Maharjan Project",
      url: "https://www.youtube.com/watch?v=NSonyoyvgHs",
    },
  ],
  "hagen-horn": [
    {
      title: "Hagen Horn & Friends — Agnes-Klause, Cologne",
      url: "https://www.youtube.com/watch?v=62FcOMDjv6E",
    },
    {
      title: "Hagen Horn & Friends — Re-Opening Party",
      url: "https://www.youtube.com/watch?v=r96e6yqvQ6I",
    },
  ],
};

export function clipsForArtist(slug: string): ArtistClip[] {
  const all = CLIPS[slug] ?? [];
  return slug === "irene-ypenburg" ? all.slice(0, 6) : all.slice(0, 2);
}
