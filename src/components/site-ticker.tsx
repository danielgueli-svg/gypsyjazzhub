import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import type { TickerNews, TickerPayload, TickerStat } from "@/lib/ticker";

function fill(template: string, vars: Record<string, string | number>) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{${key}}`, String(value));
  }
  return out;
}

function StatLink({ item }: { item: TickerStat }) {
  const { t } = useI18n();
  return (
    <Link to={item.href as never} hash={item.hash ?? ""} className="hub-ticker-item">
      {fill(t(item.key), { n: item.n })}
    </Link>
  );
}

function NewsLink({ item }: { item: TickerNews }) {
  const { t } = useI18n();
  const label =
    item.kind === "weekend" && item.name
      ? fill(t("ticker.thisWeekend"), { name: item.name })
      : item.slug
        ? t(`news.item.${item.slug}.title`)
        : item.name ?? "";
  if (!label || label.startsWith("news.item.")) return null;
  if (/^https?:\/\//i.test(item.href)) {
    return (
      <a href={item.href} className="hub-ticker-item" rel="noreferrer">
        {label}
      </a>
    );
  }
  return (
    <Link to={item.href as never} className="hub-ticker-item">
      {label}
    </Link>
  );
}

function Tape({ data }: { data: TickerPayload }) {
  return (
    <>
      {data.stats.map((item) => (
        <StatLink key={item.id} item={item} />
      ))}
      {data.news.map((item) => (
        <NewsLink key={item.id} item={item} />
      ))}
    </>
  );
}

export function SiteTicker({ data }: { data: TickerPayload }) {
  const { t } = useI18n();
  if (!data.stats.length) return null;
  return (
    <div className="hub-ticker" aria-label={t("ticker.label")}>
      <div className="hub-ticker-track">
        <div className="hub-ticker-copy">
          <Tape data={data} />
        </div>
        <div className="hub-ticker-copy" aria-hidden="true">
          <Tape data={data} />
        </div>
      </div>
    </div>
  );
}
