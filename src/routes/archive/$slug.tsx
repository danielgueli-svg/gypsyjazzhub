import { createFileRoute, Link } from "@tanstack/react-router";
import { ArchiveSuggest } from "@/components/archive-suggest";
import { ArchiveClips } from "@/components/archive-clips";
import { ArtistNameLink } from "@/components/artist-name-link";
import { Flag } from "@/components/flag";
import { LineageLinks } from "@/components/lineage-links";
import { listLegends, type Legend } from "@/lib/api";
import {
  archiveBandsForCountry,
  archiveSourcesForCountry,
} from "@/lib/archive";
import { archiveVideosForCountry } from "@/lib/archive-videos";
import { familiesForCountry, familyCard } from "@/lib/families";
import { countriesFromText, countryFromSlug, countrySlug, displayCountry, isPastLegend } from "@/lib/geo";
import { listArchiveNotes, type ArchiveCircleNote } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { romaniMusicCountryUrl } from "@/lib/romani-music";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/archive/$slug")({
  head: ({ params }) => {
    const country = countryFromSlug(params.slug) ?? params.slug.replace(/-/g, " ");
    return pageHead({
      title: `Archive — ${country}`,
      description: `Older orchestras, family houses and past chairs in ${country}. The country archive on Gypsy Jazz Hub.`,
      path: `/archive/${params.slug}`,
    });
  },
  loader: async ({ params }): Promise<{
    country: string;
    notes: ArchiveCircleNote[];
    past: Legend[];
  }> => {
    const country = countryFromSlug(params.slug) ?? params.slug.replace(/-/g, " ");
    const [legends, notes] = await Promise.all([
      listLegends(),
      listArchiveNotes({ data: { countrySlug: params.slug } }),
    ]);
    const past = legends.filter((legend) => {
      if (!isPastLegend(legend.years)) return false;
      return countriesFromText(legend.origin).some((place) => countrySlug(place) === params.slug);
    });
    return { country, notes, past };
  },
  component: ArchiveCountryPage,
});

function ArchiveCountryPage() {
  const { slug } = Route.useParams();
  const { country, notes, past } = Route.useLoaderData() as {
    country: string;
    notes: ArchiveCircleNote[];
    past: Legend[];
  };
  const { t, locale } = useI18n();
  const name = displayCountry(country, locale);
  const families = familiesForCountry(country).map((family) => familyCard(family, locale));
  const orchestras = archiveBandsForCountry(country);
  const sources = archiveSourcesForCountry(country);
  const clips = archiveVideosForCountry(country);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-sm">
        <Link to="/archive" className="text-muted hover:text-fg">
          {t("archive.backIndex")}
        </Link>
        {" · "}
        <Link to="/world/$slug" params={{ slug }} className="text-muted hover:text-fg">
          {t("archive.toCountry")}
        </Link>
        {" · "}
        <a href={romaniMusicCountryUrl(slug)} className="text-muted hover:text-fg" rel="noreferrer">
          {t("archive.romaniOpen")}
        </a>
      </p>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">{t("archive.kicker")}</p>
      <h1 className="mt-3 inline-flex items-center gap-3 font-display text-4xl font-semibold sm:text-5xl">
        <Flag name={country} className="h-8 w-11" />
        {name}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{t("archive.countryLead")}</p>
      <div className="mt-6">
        <LineageLinks current="/archive" />
      </div>

      {sources.length > 0 ? (
        <section className="mt-10 max-w-2xl rounded-2xl bg-surface p-5 shadow-border">
          {sources.map((source) => (
            <div key={source.url}>
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("archive.source")}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{source.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{source.lead}</p>
              <p className="mt-3">
                <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-accent hover:underline">
                  YouTube →
                </a>
              </p>
            </div>
          ))}
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{t("archive.families")}</h2>
        {families.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("archive.emptyFamilies")}</p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {families.map((family) => (
              <a
                key={family.slug}
                href={family.href}
                className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
              >
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{family.kicker}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">{family.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{family.summary}</p>
                <p className="mt-3 text-sm font-medium text-accent">{t("country.familyOpen")} →</p>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">
          {t("archive.orchestras")}
          {orchestras.length ? (
            <span className="ml-2 text-lg font-normal text-muted">({orchestras.length})</span>
          ) : null}
        </h2>
        {orchestras.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("archive.emptyOrchestras")}</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {orchestras.map((band) => (
              <li key={band.slug} className="rounded-2xl bg-surface p-5 shadow-border">
                <Link
                  to="/groups/$slug"
                  params={{ slug: band.slug }}
                  className="font-display text-2xl font-semibold hover:underline"
                >
                  {band.name}
                </Link>
                {band.origin ? <p className="mt-1 text-sm text-muted">{band.origin}</p> : null}
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{band.bio}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">
          {t("archive.players")}
          {past.length ? (
            <span className="ml-2 text-lg font-normal text-muted">({past.length})</span>
          ) : null}
        </h2>
        {past.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t("archive.emptyPlayers")}</p>
        ) : (
          <ul className="mt-4 columns-1 gap-x-10 sm:columns-2">
            {past.map((legend) => (
              <li key={legend.slug} className="break-inside-avoid py-1.5">
                <ArtistNameLink slug={legend.slug} name={legend.name} className="font-display text-xl font-semibold" />
                {legend.years ? <span className="text-sm text-muted"> · {legend.years}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ArchiveClips videos={clips} />

      {notes.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{t("archive.fromCircle")}</h2>
          <ul className="mt-4 space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="rounded-2xl bg-surface p-5 shadow-border">
                <p className="font-display text-xl font-semibold">{note.name}</p>
                {note.year ? <p className="mt-1 text-xs text-faint">{note.year}</p> : null}
                <p className="mt-2 text-sm leading-relaxed text-muted">{note.text}</p>
                <p className="mt-2 text-xs text-faint">{note.submittedName}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ArchiveSuggest country={country} countrySlug={slug} />
    </main>
  );
}
