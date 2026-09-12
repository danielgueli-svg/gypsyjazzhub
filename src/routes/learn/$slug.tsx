import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LegendCard } from "@/components/legend-card";
import { LearnJump } from "@/components/learn-jump";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listLegends } from "@/lib/api";
import { getCamp, campKind } from "@/lib/camps";
import { CountryLabel } from "@/components/country-label";
import { formatConcertWhen } from "@/lib/utils";
import { whenLabel } from "@/lib/festival-copy";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/learn/$slug")({
  loader: async ({ params }) => {
    const camp = getCamp(params.slug);
    if (!camp) throw notFound();
    const legends = await listLegends();
    const hosts = camp.hostSlugs
      .map((slug) => legends.find((legend) => legend.slug === slug))
      .filter((legend) => Boolean(legend));
    const teachers = camp.teacherSlugs
      .map((slug) => legends.find((legend) => legend.slug === slug))
      .filter((legend) => Boolean(legend));
    return { camp, hosts, teachers };
  },
  component: CampPage,
});

function CampPage() {
  const { camp, hosts, teachers } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const kind = campKind(camp);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <LearnJump />
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
        {kind === "workshop" ? "Gypsy jazz workshop" : "Gypsy camp"}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{camp.name}</h1>
      <p className="mt-3 text-muted">
        {camp.city} · <CountryLabel name={camp.country} />
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>{whenLabel(camp.when, locale)}</Badge>
        <Badge>{kind === "workshop" ? "Workshop" : "Camp"}</Badge>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("page.next")}</p>
          <p className="mt-2 font-display text-xl font-semibold">
            {formatConcertWhen(camp.nextStartsAt, locale)}
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("page.where")}</p>
          <p className="mt-2 font-display text-xl font-semibold">{camp.city}</p>
        </div>
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("festival.country")}</p>
          <p className="mt-2 font-display text-xl font-semibold">
            <CountryLabel name={camp.country} />
          </p>
        </div>
      </div>

      {camp.site ? (
        <div className="mt-6">
          <Button asChild>
            <a href={camp.site} target="_blank" rel="noreferrer">
              Official camp site
            </a>
          </Button>
        </div>
      ) : null}

      <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted">{camp.bio}</p>

      {hosts.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Host</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hosts.map((legend) =>
              legend ? <LegendCard key={legend.slug} legend={legend} /> : null,
            )}
          </div>
        </section>
      ) : null}

      {teachers.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Teaching</h2>
          <p className="mt-2 text-sm text-muted">
            Who is on the chairs this edition — open a name for their page.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((legend) =>
              legend ? <LegendCard key={legend.slug} legend={legend} /> : null,
            )}
          </div>
        </section>
      ) : null}

      <p className="mt-12 text-sm text-muted">
        <Link to="/learn" className="text-fg hover:underline">
          All gypsy camps
        </Link>
      </p>
    </main>
  );
}
