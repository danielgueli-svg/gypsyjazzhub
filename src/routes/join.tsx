import { createFileRoute } from "@tanstack/react-router";
import { JoinForm } from "@/components/join-form";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/join")({
  head: () => pageHead(SEO.join),
  component: JoinPage,
});

function JoinPage() {
  const { t } = useI18n();
  const items = [
    { title: t("join.1t"), body: t("join.1b") },
    { title: t("join.2t"), body: t("join.2b") },
    { title: t("join.3t"), body: t("join.3b") },
    { title: t("join.4t"), body: t("join.4b") },
    { title: t("join.5t"), body: t("join.5b") },
    { title: t("join.6t"), body: t("join.6b") },
    { title: t("join.7t"), body: t("join.7b") },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("join.kicker")}</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-6xl">
        {t("join.title")}
      </h1>
      <p className="mt-2 text-lg text-muted">{t("join.free")}</p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {t("join.lead1")}
      </p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {t("join.lead2")}
      </p>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ol className="space-y-6">
          {items.map((item, index) => (
            <li key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
              <span className="font-display text-2xl text-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold leading-tight">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="rounded-2xl bg-surface p-6 shadow-border lg:sticky lg:top-24">
          <p className="font-display text-2xl font-semibold">{t("join.asideTitle")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t("join.asideBody")}</p>
          <div className="mt-6">
            <JoinForm defaultMode="up" />
          </div>
        </aside>
      </div>
    </main>
  );
}
