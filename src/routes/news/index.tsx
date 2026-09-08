import { createFileRoute } from "@tanstack/react-router";
import { AlbumCard } from "@/components/artist-music";
import { NewsBanner } from "@/components/news-story";
import { latestAlbums, latestNews } from "@/lib/music";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/news/")({
  head: () => pageHead(SEO.news),
  component: NewsPage,
});

function NewsPage() {
  const { t } = useI18n();
  const news = latestNews(24).filter((item) => item.kind !== "album");
  const albums = latestAlbums(24);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("news.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{t("news.title")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {t("news.lead")}
      </p>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{t("news.latest")}</h2>
        <ol className="mt-5 space-y-2">
          {news.map((item) => (
            <li key={item.slug}>
              <NewsBanner item={item} />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-semibold">{t("news.albums")}</h2>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {albums.map((album) => (
            <AlbumCard key={album.slug} album={album} compact />
          ))}
        </div>
      </section>
    </main>
  );
}
