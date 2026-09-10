import { Link } from "@tanstack/react-router";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { ShareBox } from "@/components/share-page";
import {
  artistPageHref,
  getAlbum,
  newsExcerpt,
  newsThumb,
  type NewsItem,
} from "@/lib/music";
import { useI18n } from "@/lib/i18n";
import { formatConcertDay, formatConcertYear } from "@/lib/utils";

export function NewsBanner({ item }: { item: NewsItem }) {
  const { t } = useI18n();
  const title = t(`news.item.${item.slug}.title`);
  const body = t(`news.item.${item.slug}.body`);
  const cover = newsThumb(item);
  const inner = (
    <>
      {cover ? (
        <img
          src={cover}
          alt=""
          className="size-16 shrink-0 rounded-lg object-cover sm:size-[4.5rem]"
        />
      ) : (
        <div className="w-[4.5rem] shrink-0 text-center">
          <div className="font-display text-base font-semibold leading-none text-fg">
            {formatConcertDay(item.date)}
          </div>
          <div className="mt-0.5 text-[11px] tracking-wide text-faint">
            {formatConcertYear(item.date)}
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1">
        {cover ? (
          <p className="text-[11px] tracking-wide text-faint">
            {formatConcertDay(item.date)} {formatConcertYear(item.date)}
          </p>
        ) : null}
        <h3 className="font-display text-base font-semibold leading-tight">{title}</h3>
        <p className="mt-0.5 truncate text-xs text-muted">{newsExcerpt(body)}</p>
      </div>
    </>
  );
  const className = "flex items-center gap-3 py-2 hover:underline";
  if (item.href?.startsWith("/")) {
    return (
      <Link to={item.href as "/learn/apps"} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to="/news/$slug" params={{ slug: item.slug }} className={className}>
      {inner}
    </Link>
  );
}

export function NewsStory({ item }: { item: NewsItem }) {
  const { t } = useI18n();
  const album = item.albumSlug ? getAlbum(item.albumSlug) : null;
  const cover = newsThumb(item);
  const title = t(`news.item.${item.slug}.title`);

  return (
    <article className="overflow-hidden rounded-2xl bg-surface shadow-border">
      {cover ? (
        <img
          src={cover}
          alt=""
          className="aspect-[16/9] w-full object-cover sm:aspect-[2/1]"
        />
      ) : null}
      <div className="p-5 sm:p-8">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
          {item.date}
          {item.kind === "album" ? ` · ${t("news.albumRelease")}` : ` · ${t("news.scene")}`}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {t(`news.item.${item.slug}.body`)}
        </p>
        {item.youtubeUrl ? (
          <div className="mt-5">
            <YouTubeEmbed url={item.youtubeUrl} title={title} />
          </div>
        ) : null}
        <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {item.href ? (
            <a
              href={item.href}
              className="text-fg hover:underline"
              {...(item.href.startsWith("http")
                ? { target: "_blank" as const, rel: "noreferrer" }
                : {})}
            >
              {item.href === "/learn/apps"
                ? t("news.openApps")
                : item.hrefLabel?.startsWith("news.")
                  ? t(item.hrefLabel)
                  : (item.hrefLabel ?? item.href)}
            </a>
          ) : null}
          {item.artistSlugs.map((slug) => (
            <a key={slug} href={artistPageHref(slug)} className="text-muted hover:text-fg">
              {slug.replace(/-/g, " ")}
            </a>
          ))}
          {album ? (
            <>
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(`${album.billed} ${album.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-fg"
              >
                Spotify
              </a>
              <a
                href={`https://music.apple.com/us/search?term=${encodeURIComponent(`${album.billed} ${album.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-fg"
              >
                iTunes
              </a>
            </>
          ) : null}
        </p>
        <div className="mt-6">
          <ShareBox
            compact
            url={`/news/${item.slug}`}
            title={title}
            text={t(`news.item.${item.slug}.body`)}
          />
        </div>
      </div>
    </article>
  );
}