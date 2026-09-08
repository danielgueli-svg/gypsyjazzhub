import type { Booker } from "@/lib/bookers";
import { useI18n } from "@/lib/i18n";

export function BookerLinks({ booker }: { booker: Booker | null }) {
  const { t } = useI18n();
  if (!booker) return null;
  return (
    <section className="mt-8 max-w-md">
      <h2 className="font-display text-xl font-semibold">{t("book.title")}</h2>
      <p className="mt-2 text-sm text-muted">{booker.role}</p>
      <p className="mt-1">
        <a
          href={booker.url}
          target="_blank"
          rel="noreferrer"
          className="font-display text-lg font-semibold hover:underline"
        >
          {booker.name}
        </a>
      </p>
      {booker.email ? (
        <p className="mt-1 text-sm">
          <a href={`mailto:${booker.email}`} className="text-muted hover:underline">
            {booker.email}
          </a>
        </p>
      ) : null}
    </section>
  );
}
