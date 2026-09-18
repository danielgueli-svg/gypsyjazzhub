export type TickerStat = {
  id: string;
  href: string;
  hash?: string;
  key: "ticker.jams" | "ticker.camps" | "ticker.concerts" | "ticker.artists";
  n: number;
};

export type TickerNews = {
  id: string;
  href: string;
  slug?: string;
  name?: string;
  kind: "news" | "weekend";
};

export type TickerPayload = {
  stats: TickerStat[];
  news: TickerNews[];
};
