import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CountryLabel } from "@/components/country-label";
import type { Concert } from "@/lib/api";
import { FESTIVALS, festivalForConcert, festivalTicketUrl } from "@/lib/festivals";
import { useI18n } from "@/lib/i18n";
import { bandForBill } from "@/lib/scene";
import { formatConcertDay, formatConcertYear } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function listingSource(concert: Concert) {
  if (concert.ticketUrl.includes("facebook.com")) {
    const named =
      concert.description.match(
        /GYPSYJAZZGUITAR|Gypsy jazz uk|Gypsy Jazz Society|Gypsyjazz|Gypsy Jazz/i,
      )?.[0] ?? "Facebook";
    return { url: concert.ticketUrl, label: named };
  }
  const facebook = concert.description.match(/https?:\/\/[^\s]*facebook\.com[^\s]*/i)?.[0];
  if (facebook) {
    return { url: facebook, label: "Facebook" };
  }
  const forum = concert.description.match(/https?:\/\/[^\s]*djangobooks\.com[^\s]*/i)?.[0];
  if (forum) return { url: forum, label: "DjangoBooks" };
  if (concert.ticketUrl.includes("djangobooks.com")) {
    return { url: concert.ticketUrl, label: "DjangoBooks" };
  }
  if (concert.ticketUrl.startsWith("http")) {
    return { url: concert.ticketUrl, label: "Tickets" };
  }
  return null;
}

function concertHref(concert: Concert) {
  const band = bandForBill(concert.title);
  if (band) return { kind: "group" as const, slug: band.slug };
  const festival = FESTIVALS.find(
    (row) =>
      row.name.toLowerCase() === concert.title.trim().toLowerCase() ||
      row.slug === concert.artistSlug,
  );
  if (festival) return { kind: "festival" as const, slug: festival.slug };
  return {
    kind: concert.kind === "legend" ? ("legend" as const) : ("musician" as const),
    slug: concert.artistSlug,
  };
}

export function ConcertRow({
  concert,
  compact,
}: {
  concert: Concert;
  compact?: boolean;
}) {
  const href = concertHref(concert);
  const bill = concert.title?.trim() || concert.artistName;
  const bits = [concert.city, concert.venue].filter(Boolean);
  const festival = festivalForConcert(concert);
  const official = festival?.site ?? "";
  const tickets =
    (concert.ticketUrl.startsWith("http") &&
    !concert.ticketUrl.includes("facebook.com") &&
    !concert.ticketUrl.includes("djangobooks.com")
      ? concert.ticketUrl
      : "") || (festival ? festivalTicketUrl(festival) : "");
  const facebook = listingSource(concert);
  const showSource =
    facebook &&
    facebook.label !== "Tickets" &&
    facebook.url !== tickets &&
    facebook.url !== official;
  const className = cn(
    "grid grid-cols-[4.5rem_1fr] items-center",
    compact
      ? "gap-3 py-2"
      : "gap-4 rounded-2xl bg-surface/85 p-4 shadow-border sm:grid-cols-[5.5rem_1fr] sm:p-5",
  );

  const titleLink = cn(
    "font-display font-semibold leading-tight hover:underline",
    compact ? "text-base" : "text-lg",
  );

  const title =
    href.kind === "group" ? (
      <Link to="/groups/$slug" params={{ slug: href.slug }} className={titleLink}>
        {bill}
      </Link>
    ) : href.kind === "festival" ? (
      <Link to="/festivals/$slug" params={{ slug: href.slug }} className={titleLink}>
        {bill}
      </Link>
    ) : href.kind === "legend" ? (
      <Link to="/musicians/$slug" params={{ slug: href.slug }} className={titleLink}>
        {bill}
      </Link>
    ) : (
      <Link to="/musicians/$slug" params={{ slug: href.slug }} className={titleLink}>
        {bill}
      </Link>
    );

  return (
    <article className={className}>
      <Link to="/concerts/$id" params={{ id: concert.id }} className="text-center hover:text-accent">
        <div
          className={cn(
            "font-display font-semibold leading-none",
            compact ? "text-base" : "text-xl",
          )}
        >
          {formatConcertDay(concert.startsAt)}
        </div>
        <div className="mt-0.5 text-xs tracking-wide text-faint">
          {formatConcertYear(concert.startsAt)}
        </div>
      </Link>
      <div className="min-w-0">
        {title}
        {concert.country || bits.length > 0 ? (
          <p className={cn("truncate text-muted", compact ? "mt-0.5 text-sm" : "mt-1 text-sm")}>
            {concert.country ? <CountryLabel name={concert.country} className="inline-flex" /> : null}
            {concert.country && bits.length > 0 ? " · " : null}
            {bits.join(" · ")}
          </p>
        ) : null}
        {official || tickets || showSource ? (
          <p className="mt-1 flex flex-col items-start gap-0.5 text-xs text-faint">
            {official ? (
              <a href={official} target="_blank" rel="noreferrer" className="hover:text-fg">
                Official website
              </a>
            ) : null}
            {tickets ? (
              <a href={tickets} target="_blank" rel="noreferrer" className="hover:text-fg">
                Tickets
              </a>
            ) : null}
            {showSource && facebook ? (
              <a href={facebook.url} target="_blank" rel="noreferrer" className="hover:text-fg">
                From {facebook.label}
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function ConcertList({
  title,
  concerts,
  empty,
  compact,
  className,
  id,
  initial = 5,
}: {
  title: string;
  concerts: Concert[];
  empty?: string;
  compact?: boolean;
  className?: string;
  id?: string;
  initial?: number;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const shown = open ? concerts : concerts.slice(0, initial);
  const hidden = Math.max(0, concerts.length - initial);

  return (
    <section id={id} className={cn("mt-12 scroll-mt-40", className)}>
      <h2 className="font-display text-3xl font-semibold">
        {title}
        {concerts.length > 0 ? (
          <span className="font-sans text-lg font-normal tracking-normal text-faint">
            {" "}({concerts.length})
          </span>
        ) : null}
      </h2>
      {concerts.length === 0 ? (
        empty ? <p className="mt-4 text-sm text-faint">{empty}</p> : null
      ) : (
        <>
          <div className={cn("mt-4", compact ? "space-y-2" : "space-y-3")}>
            {shown.map((concert) => (
              <ConcertRow key={concert.id} concert={concert} compact={compact} />
            ))}
          </div>
          {hidden > 0 ? (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="mt-3 text-sm text-muted hover:text-fg"
            >
              {open ? t("concerts.showLess") : `${t("concerts.seeMore")} (${hidden})`}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}
