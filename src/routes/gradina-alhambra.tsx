import { createFileRoute, Link } from "@tanstack/react-router";
import { ConcertRow } from "@/components/concert-row";
import { ShareBox } from "@/components/share-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listConcerts, listLegendConcerts, uniqueBills, type Concert } from "@/lib/api";
import { gradinaAlhambraCopy } from "@/lib/gradina-alhambra-copy";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

const SITE = "https://gradinaalhambra.ro/";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Gradina+Alhambra+Strada+Constantin+Mille+13+Bucharest";

function isGypsyJazzBill(concert: Concert) {
  const hay = `${concert.title} ${concert.description} ${concert.artistName}`.toLowerCase();
  return /django|manouche|gypsy jazz|lautaresc|lăutăresc|hot club|sinti|pana|mirea/.test(hay);
}

function atThisHouse(concert: Concert) {
  const hay = `${concert.venue} ${concert.city} ${concert.country}`.toLowerCase();
  if (/alkmaar|heiloo|netherlands|stichting/.test(hay)) return false;
  return /alhambra/.test(hay) && /bucharest|bucure|romania/.test(hay);
}

function uniqueConcerts(rows: Concert[]) {
  const seen = new Set<string>();
  const out: Concert[] = [];
  for (const concert of rows) {
    const key = `${concert.title}|${concert.startsAt}|${concert.city}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(concert);
  }
  return out;
}

export const Route = createFileRoute("/gradina-alhambra")({
  head: () =>
    pageHead({
      title: "Grădina Alhambra — gypsy jazz nights in Bucharest",
      description:
        "Gypsy jazz at Grădina Alhambra, Bucharest. Only Hot Club / manouche bills — Django Sound Quartet and Gypsy Jazz Lăutăresc. Not the venue’s full mixed programme.",
      path: "/gradina-alhambra",
    }),
  loader: async () => {
    const [all, ...members] = await Promise.all([
      listConcerts({ data: { filter: "all" } }),
      listLegendConcerts({ data: "constantin-mirea" }),
      listLegendConcerts({ data: "florin-pana" }),
      listLegendConcerts({ data: "cristian-mirea" }),
    ]);
    const here = uniqueBills(uniqueConcerts([...all, ...members.flat()])).filter(
      (concert) => atThisHouse(concert) && isGypsyJazzBill(concert),
    );
    const now = Date.now();
    const upcoming = here
      .filter((concert) => !concert.isHistoric && new Date(concert.startsAt).getTime() >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    const archive = here
      .filter((concert) => concert.isHistoric || new Date(concert.startsAt).getTime() < now)
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
    return { upcoming, archive };
  },
  component: GradinaAlhambraPage,
});

function GradinaAlhambraPage() {
  const { upcoming, archive } = Route.useLoaderData();
  const { locale } = useI18n();
  const copy = gradinaAlhambraCopy(locale);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{copy.kicker}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{copy.title}</h1>
      <p className="mt-3 text-muted">{copy.subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>Bucharest</Badge>
        <Badge>Romania</Badge>
        <Badge>Garden hall</Badge>
      </div>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{copy.lead}</p>
      <p className="mt-4 max-w-2xl rounded-2xl bg-surface p-5 text-sm leading-relaxed text-fg shadow-border">
        {copy.mixNote}
      </p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        {copy.siblingNote}{" "}
        <Link to="/stichting-alhambra" className="underline underline-offset-2 hover:text-fg">
          Stichting Alhambra
        </Link>
      </p>

      <div className="mt-8">
        <ShareBox
          compact
          url="/gradina-alhambra"
          title="Share Grădina Alhambra"
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

      {archive.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{copy.archiveTitle}</h2>
          <div className="mt-5 space-y-3">
            {archive.map((concert) => (
              <ConcertRow key={concert.id} concert={concert} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">{copy.groupTitle}</h2>
        <p className="mt-2 text-sm text-muted">{copy.groupLead}</p>
        <p className="mt-4">
          <Link to="/groups/$slug" params={{ slug: "django-sound-quartet" }} className="hover:underline">
            Django Sound Quartet
          </Link>
          {" · "}
          <Link to="/musicians/$slug" params={{ slug: "constantin-mirea" }} className="hover:underline">
            Constantin Mirea
          </Link>
          {" · "}
          <Link to="/musicians/$slug" params={{ slug: "florin-pana" }} className="hover:underline">
            Florin Pană
          </Link>
          {" · "}
          <Link to="/musicians/$slug" params={{ slug: "cristian-mirea" }} className="hover:underline">
            Cristian Mirea
          </Link>
        </p>
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">{copy.houseTitle}</h2>
        <p className="mt-3 text-muted">{copy.address}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <a href={SITE} target="_blank" rel="noreferrer">
              {copy.siteLabel}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={MAPS} target="_blank" rel="noreferrer">
              Open in maps
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/world/$slug" params={{ slug: "romania" }}>
              Romania
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
