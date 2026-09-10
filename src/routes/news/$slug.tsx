import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { NewsStory } from "@/components/news-story";
import { getNews } from "@/lib/music";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const item = getNews(params.slug);
    if (!item) throw notFound();
    if (item.href?.startsWith("/")) {
      throw redirect({ href: item.href });
    }
    return { item };
  },
  head: ({ loaderData }) => {
    const item = loaderData?.item;
    if (!item) return pageHead({ title: "News", description: "Gypsy jazz news." });
    return pageHead({
      title: item.title,
      description: item.body,
      path: `/news/${item.slug}`,
    });
  },
  component: NewsItemPage,
});

function NewsItemPage() {
  const { item } = Route.useLoaderData();
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Link to="/news" className="text-sm text-muted hover:text-fg">
        ← {t("news.title")}
      </Link>
      <div className="mt-6">
        <NewsStory item={item} />
      </div>
    </main>
  );
}
