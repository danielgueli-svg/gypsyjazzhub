import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ConcertNightPanel } from "@/components/i-was-there";
import { GoingRsvp } from "@/components/going-rsvp";
import { CountryLabel } from "@/components/country-label";
import { listingSource } from "@/components/concert-row";
import { ShareBox } from "@/components/share-page";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/subscribe-button";
import { getConcert, listConcerts } from "@/lib/api";
import { listConcertReviews } from "@/lib/concert-reviews";
import { festivalForConcert, festivalTicketUrl } from "@/lib/festivals";
import { pageHead } from "@/lib/seo";
import { bandForBill } from "@/lib/scene";
import { useI18n } from "@/lib/i18n";
import { concertAgendaText, concertShareLine, formatConcertWhen } from "@/lib/utils";

export const Route = createFileRoute("/concerts/$id")({
  loader: async ({ params }) => {
    const concert = await getConcert({ data: params.id });
    if (!concert) throw notFound();
    const [reviews, upcoming] = await Promise.all([
      listConcertReviews({ data: concert.id }),
      listConcerts({ data: { filter: "upcoming" } }),
    ]);
    const rest = upcoming.filter((row) => row.id !== concert.id).slice(0, 4);
    return { concert, reviews, agenda: [concert, ...rest].slice(0, 5) };
  },
  head: ({ loaderData }) => {
    const concert = loaderData?.concert;
    if (!concert) return pageHead({ title: "Concert", description: "A gypsy jazz night on Gypsy Jazz Hub." });
    const bill = concert.title?.trim() || concert.artistName;
    return pageHead({
      title: `${bill} — ${concert.city || concert.country}`,
      description: `${bill} in ${[concert.venue, concert.city, concert.country].filter(Boolean).join(", ")}. Reviews and photos from people who were there.`,
    });
  },
  component: ConcertNightPage,
});

function ArtistButton({ slug, kind, name }: { slug: string; kind: "legend" | "community"; name: string }) {
  if (slug === "django-reinhardt") {
    return (
      <Button asChild variant="outline">
        <Link to="/django">{name}</Link>
      </Button>
    );
  }
  if (slug === "stephane-grappelli") {
    return (
      <Button asChild variant="outline">
        <Link to="/grappelli">{name}</Link>
      </Button>
    );
  }
  if (slug === "denis-chang") {
    return (
      <Button asChild variant="outline">
        <Link to="/denis-chang">{name}</Link>
      </Button>
    );
  }
  if (kind === "community") {
    return (
      <Button asChild variant="outline">
        <Link to="/musicians/$slug" params={{ slug }}>
          {name}
        </Link>
      </Button>
    );
  }
  return (
    <Button asChild variant="outline">
      <Link to="/musicians/$slug" params={{ slug }}>
        {name}
      </Link>
    </Button>
  );
}

function ArtistTextLink({ slug, kind, name }: { slug: string; kind: "legend" | "community"; name: string }) {
  const className = "text-fg hover:underline";
  if (slug === "django-reinhardt") return <Link to="/django" className={className}>{name}</Link>;
  if (slug === "stephane-grappelli") return <Link to="/grappelli" className={className}>{name}</Link>;
  if (slug === "denis-chang") return <Link to="/denis-chang" className={className}>{name}</Link>;
  if (kind === "community") {
    return (
      <Link to="/musicians/$slug" params={{ slug }} className={className}>
        {name}
      </Link>
    );
  }
  return (
    <Link to="/musicians/$slug" params={{ slug }} className={className}>
      {name}
    </Link>
  );
}

function ConcertNightPage() {
  const { concert, reviews, agenda } = Route.useLoaderData();
  const { t } = useI18n();
  const bill = concert.title?.trim() || concert.artistName;
  const band = bandForBill(concert.title);
  const festival = festivalForConcert(concert);
  const bits = [concert.venue, concert.city].filter(Boolean);
  const tickets =
    (concert.ticketUrl.startsWith("http") &&
    !concert.ticketUrl.includes("facebook.com") &&
    !concert.ticketUrl.includes("djangobooks.com")
      ? concert.ticketUrl
      : "") || (festival ? festivalTicketUrl(festival) : "");
  const official = festival?.site ?? "";
  const facebook = listingSource(concert);
  const showSource =
    facebook &&
    facebook.label !== "Tickets" &&
    facebook.url !== tickets &&
    facebook.url !== official;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Concert</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{bill}</h1>
      <p className="mt-3 text-lg text-muted">{formatConcertWhen(concert.startsAt)}</p>
      {concert.country || bits.length > 0 ? (
        <p className="mt-2 text-sm text-muted">
          {concert.country ? <CountryLabel name={concert.country} className="inline-flex" /> : null}
          {concert.country && bits.length > 0 ? " · " : null}
          {bits.join(" · ")}
        </p>
      ) : null}

      <GoingRsvp kind="concert" targetId={concert.id} returnTo={`/concerts/${concert.id}`} />

      <div className="mt-6 flex flex-wrap gap-2">
        <SubscribeButton
          kind="concert"
          targetId={concert.id}
          targetName={bill}
          label="Notify me"
        />
        <ArtistButton slug={concert.artistSlug} kind={concert.kind} name={concert.artistName} />
        {band ? (
          <Button asChild variant="outline">
            <Link to="/groups/$slug" params={{ slug: band.slug }}>
              {band.name}
            </Link>
          </Button>
        ) : null}
        {festival ? (
          <Button asChild variant="outline">
            <Link to="/festivals/$slug" params={{ slug: festival.slug }}>
              {festival.name}
            </Link>
          </Button>
        ) : null}
      </div>

      {concert.description ? (
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">{concert.description}</p>
      ) : null}

      {official || tickets || showSource ? (
        <p className="mt-4 flex flex-col items-start gap-1 text-sm">
          {official ? (
            <a href={official} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
              Official website
            </a>
          ) : null}
          {tickets ? (
            <a href={tickets} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
              Tickets
            </a>
          ) : null}
          {showSource && facebook ? (
            <a href={facebook.url} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
              From {facebook.label}
            </a>
          ) : null}
        </p>
      ) : null}

      <ConcertNightPanel concert={concert} initialReviews={reviews} />

      <div className="mt-10">
        <ShareBox
          url={`/concerts/${concert.id}`}
          title={t("share.night")}
          lead={t("share.nightLead")}
          text={concertAgendaText(agenda.slice(1), concertShareLine(concert))}
        />
      </div>

      <p className="mt-12 text-sm text-muted">
        <Link to="/concerts" className="text-fg hover:underline">
          All concerts
        </Link>
        {" · "}
        <ArtistTextLink slug={concert.artistSlug} kind={concert.kind} name={concert.artistName} />
      </p>
    </main>
  );
}
