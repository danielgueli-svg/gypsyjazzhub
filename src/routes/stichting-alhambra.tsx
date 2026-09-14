import { createFileRoute, Link } from "@tanstack/react-router";
import { ConcertRow } from "@/components/concert-row";
import { ShareBox } from "@/components/share-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ALHAMBRA_FACEBOOK,
  ALHAMBRA_LOGO,
  ALHAMBRA_SITE,
  isAlhambraOrgConcert,
  upcomingAlhambraOther,
  type AlhambraOtherNight,
} from "@/lib/alhambra";
import { alhambraCopy } from "@/lib/alhambra-copy";
import { listConcerts, uniqueBills, type Concert } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";
import { formatConcertDay, formatConcertTime, formatConcertYear } from "@/lib/utils";

const HOME_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Remonstrantse+kerk+Fnidsen+37+Alkmaar";

function isGypsyJazzBill(concert: Concert) {
  const hay = `${concert.title} ${concert.description} ${concert.artistName}`.toLowerCase();
  return /django|manouche|gypsy jazz|gipsy jazz|gipsyjazz|hot club|sinti|bamberg|rosenberg|kliphuis|schmitt|debarre|de barre/.test(
    hay,
  );
}

function uniqueConcerts(rows: Concert[]) {
  const seen = new Map<string, Concert>();
  for (const concert of rows) {
    const key = `${concert.startsAt}|${concert.city.trim().toLowerCase()}|${concert.venue.trim().toLowerCase()}`;
    const prev = seen.get(key);
    if (!prev || concert.title.trim().length > prev.title.trim().length) {
      seen.set(key, concert);
    }
  }
  return [...seen.values()];
}

export const Route = createFileRoute("/stichting-alhambra")({
  head: () =>
    pageHead({
      title: "Stichting Alhambra — guitar nights in Alkmaar",
      description:
        "Stichting Alhambra, Alkmaar. Gypsy jazz nights on the hub, classical guitar and flamenco recitals only on this page.",
      path: "/stichting-alhambra",
    }),
  loader: async () => {
    const all = await listConcerts({ data: { filter: "all" } });
    const here = uniqueBills(uniqueConcerts(all)).filter(
      (concert) => isAlhambraOrgConcert(concert) && isGypsyJazzBill(concert),
    );
    const now = Date.now();
    const upcoming = here
      .filter((concert) => !concert.isHistoric && new Date(concert.startsAt).getTime() >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    return { upcoming, other: upcomingAlhambraOther(now) };
  },
  component: AlhambraPage,
});

function OtherNightRow({ night }: { night: AlhambraOtherNight }) {
  const { locale } = useI18n();
  const copy = alhambraCopy(locale);
  const clock = formatConcertTime(night.startsAt);
  const kind = night.kind === "flamenco" ? copy.kindFlamenco : copy.kindClassical;
  return (
    <article className="grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-2xl bg-surface/85 p-4 shadow-border sm:grid-cols-[5.5rem_1fr] sm:p-5">
      <div className="text-center">
        <div className="font-display text-xl font-semibold leading-none">
          {formatConcertDay(night.startsAt, locale)}
        </div>
        {clock ? (
          <div className="mt-0.5 text-sm font-medium tabular-nums tracking-wide">{clock}</div>
        ) : null}
        <div className="mt-0.5 text-xs tracking-wide text-faint">{formatConcertYear(night.startsAt)}</div>
      </div>
      <div className="min-w-0">
        <a href={night.href} target="_blank" rel="noreferrer" className="font-display text-lg font-semibold leading-tight hover:underline">
          {night.title}
        </a>
        <p className="mt-1 truncate text-sm text-muted">
          {kind} · {night.city} · {night.venue}
        </p>
        <p className="mt-1 text-xs text-faint">
          <a href={night.href} target="_blank" rel="noreferrer" className="hover:text-fg">
            {copy.ticketsOnSite}
          </a>
        </p>
      </div>
    </article>
  );
}

function AlhambraPage() {
  const { upcoming, other } = Route.useLoaderData();
  const { locale } = useI18n();
  const copy = alhambraCopy(locale);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start gap-5">
        <img
          src={ALHAMBRA_LOGO}
          alt="Stichting Alhambra"
          width={72}
          height={72}
          className="size-[72px] rounded-2xl bg-surface object-contain p-2 shadow-border"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{copy.kicker}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-6xl">{copy.title}</h1>
          <p className="mt-3 text-muted">{copy.subtitle}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>Alkmaar</Badge>
        <Badge>Netherlands</Badge>
        <Badge>Organisation</Badge>
      </div>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{copy.lead}</p>
      <p className="mt-4 max-w-2xl rounded-2xl bg-surface p-5 text-sm leading-relaxed text-fg shadow-border">
        {copy.mixNote}
      </p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        {copy.siblingNote}{" "}
        <Link to="/gradina-alhambra" className="underline underline-offset-2 hover:text-fg">
          Grădina Alhambra
        </Link>
      </p>

      <div className="mt-8">
        <ShareBox
          compact
          url="/stichting-alhambra"
          title="Share Stichting Alhambra"
          text={`${copy.title}\n${copy.subtitle}`}
        />
      </div>

      <article className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">{copy.aboutTitle}</h2>
        {copy.about.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </article>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{copy.nightsTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{copy.nightsLead}</p>
        {upcoming.length === 0 ? (
          <p className="mt-5 max-w-2xl text-sm text-muted">{copy.noneUpcoming}</p>
        ) : (
          <div className="mt-5 space-y-3">
            {upcoming.map((concert) => (
              <ConcertRow key={concert.id} concert={concert} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{copy.otherTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{copy.otherLead}</p>
        {other.length === 0 ? null : (
          <div className="mt-5 space-y-3">
            {other.map((night) => (
              <OtherNightRow key={night.id} night={night} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">{copy.groupTitle}</h2>
        <p className="mt-2 text-sm text-muted">{copy.groupLead}</p>
        <p className="mt-4">
          <Link to="/musicians/$slug" params={{ slug: "amati-schmitt" }} className="hover:underline">
            Amati Schmitt
          </Link>
          {" · "}
          <Link to="/musicians/$slug" params={{ slug: "angelo-debarre" }} className="hover:underline">
            Angelo Debarre
          </Link>
        </p>
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">{copy.houseTitle}</h2>
        <p className="mt-3 text-muted">{copy.address}</p>
        <p className="mt-2 text-sm text-muted">{copy.homeRoom}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <a href={ALHAMBRA_SITE} target="_blank" rel="noreferrer">
              {copy.siteLabel}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={ALHAMBRA_FACEBOOK} target="_blank" rel="noreferrer">
              {copy.facebookLabel}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={HOME_MAPS} target="_blank" rel="noreferrer">
              Alkmaar maps
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/world/$slug" params={{ slug: "netherlands" }}>
              Netherlands
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
