import { LEGENDS } from "@/lib/seed-data";
import { BANDS } from "@/lib/scene";
import { FESTIVALS } from "@/lib/festivals";
import { JAMS } from "@/lib/jams";
import { VENUES } from "@/lib/venues";
import { LUTHIERS } from "@/lib/luthiers";
import { SHOPS } from "@/lib/shops";
import { CAMPS } from "@/lib/camps";
import { ALBUMS, NEWS } from "@/lib/music";
import { CHANNEL_VIDEOS } from "@/lib/channel-videos";
import { displayCountry, isPastLegend } from "@/lib/geo";

export type SearchKind =
  | "musician"
  | "legend"
  | "group"
  | "festival"
  | "jam"
  | "venue"
  | "luthier"
  | "shop"
  | "camp"
  | "news"
  | "album"
  | "youtube"
  | "page";

export type SearchHit = {
  kind: SearchKind;
  name: string;
  country: string;
  href: string;
  blurb: string;
  score: number;
};

function artistHref(slug: string) {
  if (slug === "django-reinhardt") return "/django";
  if (slug === "stephane-grappelli") return "/grappelli";
  if (slug === "tata-mirando") return "/tata-mirando";
  if (slug === "denis-chang") return "/denis-chang";
  return `/musicians/${slug}`;
}

function hay(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function scoreMatch(q: string, name: string, extra: string) {
  const n = name.toLowerCase();
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(q)) return 60;
  if (extra.includes(q)) return 30;
  return 0;
}

export function searchCatalog(raw: string, limit = 40): SearchHit[] {
  const q = raw.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];

  for (const legend of LEGENDS) {
    const extra = hay(legend.origin, legend.instruments, legend.bio, legend.notable);
    const score = scoreMatch(q, legend.name, extra);
    if (!score) continue;
    const past = isPastLegend(legend.years);
    hits.push({
      kind: past ? "legend" : "musician",
      name: legend.name,
      country: displayCountry(legend.origin),
      href: artistHref(legend.slug),
      blurb: legend.instruments || legend.origin,
      score,
    });
  }

  for (const band of BANDS) {
    const extra = hay(band.origin, band.country, band.bio, ...band.members);
    const score = scoreMatch(q, band.name, extra);
    if (!score) continue;
    hits.push({
      kind: "group",
      name: band.name,
      country: displayCountry(band.country || band.origin),
      href: `/groups/${band.slug}`,
      blurb: band.origin,
      score,
    });
  }

  for (const festival of FESTIVALS) {
    const extra = hay(festival.city, festival.country, festival.bio);
    const score = scoreMatch(q, festival.name, extra);
    if (!score) continue;
    hits.push({
      kind: "festival",
      name: festival.name,
      country: displayCountry(festival.country),
      href: `/festivals/${festival.slug}`,
      blurb: `${festival.city} · ${festival.when}`,
      score,
    });
  }

  for (const jam of JAMS) {
    const extra = hay(jam.city, jam.country, jam.venue, jam.bio, jam.when);
    const score = scoreMatch(q, jam.name, extra);
    if (!score) continue;
    hits.push({
      kind: "jam",
      name: jam.name,
      country: displayCountry(jam.country),
      href: `/jams/${jam.slug}`,
      blurb: `${jam.when} · ${jam.city}`,
      score,
    });
  }

  for (const venue of VENUES) {
    const extra = hay(venue.city, venue.country, venue.bio, venue.kind);
    const score = scoreMatch(q, venue.name, extra);
    if (!score) continue;
    hits.push({
      kind: "venue",
      name: venue.name,
      country: displayCountry(venue.country),
      href: `/venues/${venue.slug}`,
      blurb: `${venue.city} · ${venue.kind}`,
      score,
    });
  }

  for (const luthier of LUTHIERS) {
    const extra = hay(luthier.city, luthier.country, luthier.bio, luthier.note);
    const score = scoreMatch(q, luthier.name, extra);
    if (!score) continue;
    hits.push({
      kind: "luthier",
      name: luthier.name,
      country: displayCountry(luthier.country),
      href: `/luthiers/${luthier.slug}`,
      blurb: [
        luthier.city,
        luthier.craft === "bass" ? "double bass" : luthier.craft === "violin" ? "violin" : "guitar",
        luthier.note,
      ]
        .filter(Boolean)
        .join(" · "),
      score,
    });
  }

  for (const shop of SHOPS) {
    const extra = hay(shop.city, shop.country, shop.bio, shop.address);
    const score = scoreMatch(q, shop.name, extra);
    if (!score) continue;
    hits.push({
      kind: "shop",
      name: shop.name,
      country: displayCountry(shop.country),
      href: `/shops/${shop.slug}`,
      blurb: shop.city,
      score,
    });
  }

  for (const camp of CAMPS) {
    const extra = hay(camp.city, camp.country, camp.bio);
    const score = scoreMatch(q, camp.name, extra);
    if (!score) continue;
    hits.push({
      kind: "camp",
      name: camp.name,
      country: displayCountry(camp.country),
      href: `/learn/${camp.slug}`,
      blurb: `${camp.when} · ${camp.city}`,
      score,
    });
  }

  for (const item of NEWS) {
    const extra = hay(item.body, item.title);
    const score = scoreMatch(q, item.title, extra);
    if (!score) continue;
    hits.push({
      kind: "news",
      name: item.title,
      country: "",
      href: "/news",
      blurb: item.date,
      score: score - 5,
    });
  }

  for (const album of ALBUMS) {
    const extra = hay(album.billed, album.note, ...album.artists);
    const score = scoreMatch(q, album.title, extra);
    if (!score) continue;
    hits.push({
      kind: "album",
      name: `${album.billed} — ${album.title}`,
      country: String(album.year),
      href: album.artists[0] ? artistHref(album.artists[0]) : "/news",
      blurb: String(album.year),
      score: score - 8,
    });
  }

  const pages: Array<Omit<SearchHit, "score"> & { score?: number }> = [
    { kind: "page", name: "The board", country: "", href: "/board", blurb: "Looking for a player, charts, venue tips" },
    { kind: "page", name: "Charts and backing tracks", country: "", href: "/learn/charts", blurb: "Minor Swing, iReal Pro, La Pompe Live" },
    { kind: "page", name: "How to start a jam", country: "", href: "/learn/start-jam", blurb: "A room, a night, a host" },
    { kind: "page", name: "Musicians directory", country: "", href: "/musicians", blurb: "Search players by country and instrument" },
    { kind: "page", name: "Learn by instrument", country: "", href: "/learn/instruments", blurb: "Solo guitar, la pompe, violin, bass, clarinet, vocals" },
    { kind: "page", name: "Instruments", country: "", href: "/instruments", blurb: "Guitars, violins, double bass, shops and luthiers" },
    { kind: "page", name: "Luthiers & shops by country", country: "", href: "/instruments/luthiers", blurb: "Guitar shops, violin luthiers and double bass workshops for every country" },
    { kind: "page", name: "Solo guitar", country: "", href: "/learn/instruments/solo-guitar", blurb: "Lead guitar — rest-stroke, arpeggios, the Selmer voice" },
    { kind: "page", name: "Rhythm guitar", country: "", href: "/learn/instruments/rhythm-guitar", blurb: "La pompe — the engine of the quintet" },
    { kind: "page", name: "Violin", country: "", href: "/learn/instruments/violin", blurb: "Grappelli's chair — melody over the pompe" },
    { kind: "page", name: "Double bass", country: "", href: "/learn/instruments/double-bass", blurb: "The floor under the pompe" },
    { kind: "page", name: "Clarinet", country: "", href: "/learn/instruments/clarinet", blurb: "The Hot Club reed — a chorus, then space" },
    { kind: "page", name: "Vocals", country: "", href: "/learn/instruments/vocals", blurb: "Chanson in front of the pompe" },
    { kind: "page", name: "La pompe", country: "", href: "/learn/instruments/rhythm-guitar", blurb: "Rhythm guitar — two and four, every bar" },
    { kind: "page", name: "Luthiers", country: "", href: "/luthiers", blurb: "Makers of Selmer-style guitars, violins and basses" },
    { kind: "page", name: "Guitar shops", country: "", href: "/shops", blurb: "Shops that stock Gypsy jazz guitars" },
    { kind: "page", name: "Violin luthiers", country: "", href: "/luthiers/violin", blurb: "Violin makers and workshops by country" },
    { kind: "page", name: "Double bass luthiers", country: "", href: "/luthiers/bass", blurb: "Bass workshops and jazz setup by country" },
  ];
  for (const page of pages) {
    const extra = hay(page.name, page.blurb, page.href);
    const score = scoreMatch(q, page.name, extra);
    if (!score) continue;
    hits.push({ ...page, score: score - 4 });
  }

  for (const video of CHANNEL_VIDEOS) {
    const extra = hay(video.clip, "youtube", "daniel gueli");
    const score = scoreMatch(q, video.name, extra);
    if (!score) continue;
    hits.push({
      kind: "youtube",
      name: video.name,
      country: "",
      href: video.url,
      blurb: video.clip,
      score: score - 2,
    });
  }

  hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const seen = new Set<string>();
  const out: SearchHit[] = [];
  for (const hit of hits) {
    const key = `${hit.kind}|${hit.href}|${hit.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(hit);
    if (out.length >= limit) break;
  }
  return out;
}

export const KIND_LABEL: Record<SearchKind, string> = {
  musician: "Musician",
  legend: "Legend",
  group: "Group",
  festival: "Festival",
  jam: "Jam",
  venue: "Venue",
  luthier: "Luthier",
  shop: "Shop",
  camp: "Camp",
  news: "News",
  album: "Album",
  youtube: "YouTube",
  page: "Page",
};
