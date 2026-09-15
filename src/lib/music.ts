export type Album = {
  slug: string;
  title: string;
  year: number;
  billed: string;
  artists: string[];
  note?: string;
};

export type NewsItem = {
  slug: string;
  date: string;
  title: string;
  body: string;
  kind: "album" | "scene";
  artistSlugs: string[];
  albumSlug?: string;
  href?: string;
  hrefLabel?: string;
  image?: string;
  youtubeUrl?: string;
};
