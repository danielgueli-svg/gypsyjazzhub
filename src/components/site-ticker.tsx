import { Link } from "@tanstack/react-router";
import { Flag } from "@/components/flag";
import { useI18n } from "@/lib/i18n";
import type { TickerNews, TickerPayload, TickerStat } from "@/lib/ticker";

function StatLink({ item }: { item: TickerStat }) {
  const { t } = useI18n();
  const [before, after] = t(item.key).split("{n}");
  return (
    <Link to={item.href as never} hash={item.hash ?? ""} className="hub-ticker-item">
      {before}
      <span className="hub-ticker-n">{item.n}</span>
      {after}
    </Link>
  );
}

function NewsLink({ item }: { item: TickerNews }) {
  const { t } = useI18n();
  const label = item.slug ? t(`news.item.${item.slug}.title`) : item.name ?? "";
  if (!label || label.startsWith("news.item.")) return null;
  const flag = item.country ? <Flag name={item.country} className="hub-ticker-flag" eager /> : null;
  if (/^https?:\/\//i.test(item.href)) {
    return (
      <a href={item.href} className="hub-ticker-item" rel="noreferrer">
        {label}
        {flag}
      </a>
    );
  }
  return (
    <Link to={item.href as never} className="hub-ticker-item">
      {label}
      {flag}
    </Link>
  );
}

function WeekendLink({ item }: { item: TickerNews }) {
  if (!item.name) return null;
  return (
    <Link to={item.href as never} className="hub-ticker-item">
      <span>{item.name}</span>
      {item.country ? <Flag name={item.country} className="hub-ticker-flag" eager /> : null}
    </Link>
  );
}

function Tape({ data }: { data: TickerPayload }) {
  const { t } = useI18n();
  const weekend = data.news.filter((item) => item.kind === "weekend");
  const news = data.news.filter((item) => item.kind === "news");
  return (
    <>
      {data.stats.map((item) => (
        <StatLink key={item.id} item={item} />
      ))}
      {weekend.length ? (
        <>
          <span className="hub-ticker-item hub-ticker-kicker">{t("ticker.thisWeekend")}</span>
          {weekend.map((item) => (
            <WeekendLink key={item.id} item={item} />
          ))}
        </>
      ) : null}
      {news.map((item) => (
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
