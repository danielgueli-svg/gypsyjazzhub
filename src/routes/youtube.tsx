import { createFileRoute } from "@tanstack/react-router";
import {
  CHANNEL_URL,
  CHANNEL_VIDEOS,
  youtubeThumb,
  type ChannelLink,
  type ChannelVideo,
} from "@/lib/channel-videos";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/youtube")({
  head: () => pageHead(SEO.youtube),
  component: YoutubePage,
});

function YoutubePage() {
  const featured = CHANNEL_VIDEOS.filter((row) => row.featured);
  const concerts = CHANNEL_VIDEOS.filter((row) => row.place === "concert" && !row.featured);
  const jams = CHANNEL_VIDEOS.filter((row) => row.place === "samoreau");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Videos</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
        Gypsy jazz on YouTube
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        From the Daniel Gueli Gypsy Jazz Channel. The billed name once — click
        the picture or the title for the video. Names underneath go to the hub
        page.
      </p>
      <p className="mt-3">
        <a href={CHANNEL_URL} target="_blank" rel="noreferrer" className="text-sm hover:underline">
          @danielgueli on YouTube
        </a>
      </p>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Full concerts</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {featured.map((row) => (
            <li key={row.url}>
              <FeaturedCard row={row} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">Concert videos</h2>
        <p className="mt-2 text-sm text-muted">Stage, festival, club.</p>
        <ul className="mt-5 space-y-3">
          {concerts.map((row) => (
            <li key={row.url}>
              <VideoRow row={row} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">Samoreau jams</h2>
        <p className="mt-2 text-sm text-muted">
          Night jams around the festival — Benji, Marcia, Mathieu, the camping.
        </p>
        <ul className="mt-5 space-y-3">
          {jams.map((row) => (
            <li key={row.url}>
              <VideoRow row={row} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function FeaturedCard({ row }: { row: ChannelVideo }) {
  const thumb = youtubeThumb(row.url);
  return (
    <article className="overflow-hidden rounded-2xl bg-surface shadow-border">
      <a href={row.url} target="_blank" rel="noreferrer" className="block">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="aspect-video w-full object-cover"
          />
        ) : null}
        <div className="p-4">
          <h3 className="font-display text-xl font-semibold leading-tight">{row.name}</h3>
          <p className="mt-1 text-sm text-muted">{row.clip}</p>
        </div>
      </a>
      <div className="border-t border-border px-4 py-3">
        <People row={row} />
      </div>
    </article>
  );
}

function VideoRow({ row }: { row: ChannelVideo }) {
  const thumb = youtubeThumb(row.url);
  return (
    <article className="flex gap-3 rounded-2xl bg-surface p-3 shadow-border sm:gap-4 sm:p-4">
      <a href={row.url} target="_blank" rel="noreferrer" className="shrink-0">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="h-16 w-28 rounded-lg object-cover sm:h-20 sm:w-36"
          />
        ) : (
          <span className="flex h-16 w-28 items-center justify-center rounded-lg bg-raised text-xs text-faint sm:h-20 sm:w-36">
            Video
          </span>
        )}
      </a>
      <div className="min-w-0">
        <a href={row.url} target="_blank" rel="noreferrer" className="hover:underline">
          <h3 className="font-display text-lg font-semibold leading-tight">{row.name}</h3>
        </a>
        <p className="mt-1 text-sm text-muted">{row.clip}</p>
        <div className="mt-1.5">
          <People row={row} />
        </div>
      </div>
    </article>
  );
}

function People({ row }: { row: ChannelVideo }) {
  const links = [row.hub, ...(row.with ?? [])].filter((item): item is ChannelLink =>
    Boolean(item),
  );
  if (links.length === 0) return null;
  return (
    <p className="text-sm text-muted">
      {links.map((item, index) => (
        <span key={`${item.name}-${index}`}>
          {index > 0 ? <span className="text-faint"> · </span> : null}
          {item.href ? (
            <a href={item.href} className="hover:text-fg hover:underline">
              {item.name}
            </a>
          ) : (
            item.name
          )}
        </span>
      ))}
    </p>
  );
}
