import { createFileRoute, Link } from "@tanstack/react-router";
import { Nightbook } from "@/components/i-was-there";
import { ArtistMusic } from "@/components/artist-music";
import { LineageLinks } from "@/components/lineage-links";
import { PlaysWith } from "@/components/plays-with";
import { Portrait } from "@/components/portrait";
import { Badge } from "@/components/ui/badge";
import { Contribute } from "@/components/contribute";
import { FestivalLinks } from "@/components/festival-links";
import { Guestbook } from "@/components/guestbook";
import { HubExtras } from "@/components/hub-extras";
import { loadArtistExtras } from "@/lib/directory-artist";
import { djangoCopy } from "@/lib/django-copy";
import { festivalsForArtist } from "@/lib/festivals";
import { useI18n } from "@/lib/i18n";
import { artistPhoto } from "@/lib/photos";
import { bandsFor } from "@/lib/scene";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/django")({
  head: () =>
    pageHead({
      title: "Django Reinhardt — gypsy jazz guitar",
      description:
        "Django Reinhardt invented gypsy jazz. Bio, recordings, lineage and dates for the guitarist of the Quintette du Hot Club de France.",
      path: "/django",
    }),
  loader: async () => {
    const extras = await loadArtistExtras("django-reinhardt");
    return {
      concerts: extras.concerts,
      collaborators: extras.collaborators,
      clips: extras.clips,
      notes: extras.notes,
      shoutouts: extras.shoutouts,
      reports: extras.reports,
      bands: bandsFor("django-reinhardt"),
      festivals: festivalsForArtist("django-reinhardt", true),
    };
  },
  component: DjangoPage,
});

function DjangoPage() {
  const { concerts, collaborators, bands, festivals, clips, notes, shoutouts, reports } = Route.useLoaderData();
  const { locale } = useI18n();
  const copy = djangoCopy(locale);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
            {copy.kicker}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
            Django Reinhardt
          </h1>
          <p className="mt-3 text-muted">
            {copy.based}
          </p>
          <p className="mt-1 text-sm text-faint">
            {copy.bornLine}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge>Quintette du Hot Club de France</Badge>
            <Badge>Samois-sur-Seine</Badge>
          </div>
          <div className="mt-8">
            <LineageLinks current="/django" />
          </div>
        </div>
        <Portrait
          src={artistPhoto("django-reinhardt")?.src ?? "/artists/django-reinhardt.jpg"}
          alt="Django Reinhardt"
          credit={artistPhoto("django-reinhardt")?.credit}
          creditHref={artistPhoto("django-reinhardt")?.href}
          className="h-auto w-full max-h-[28rem] rounded-2xl object-contain object-top shadow-border"
        />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[copy.born, copy.instrument, copy.buried].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-surface p-5 shadow-border">
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{label}</p>
            <p className="mt-2 font-display text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <article className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">{copy.bioTitle}</h2>
        {copy.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </article>

      <ArtistMusic slug="django-reinhardt" name="Django Reinhardt" />

      <PlaysWith artists={collaborators} bands={bands} />
      <FestivalLinks festivals={festivals} />

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{copy.listenTitle}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {copy.listen.map(([title, note]) => (
            <li key={title} className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="font-display text-xl font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{note}</p>
            </li>
          ))}
        </ul>
      </section>

      <Nightbook artistName="Django Reinhardt" concerts={concerts} initialReviews={reports} />

      <Guestbook slug="django-reinhardt" name="Django Reinhardt" initial={shoutouts} />

      <HubExtras clips={clips} notes={notes} />
      <Contribute
        presetSlug="django-reinhardt"
        presetName="Django Reinhardt"
        heading={copy.addHeading}
      />

      <p className="mt-12 text-sm text-muted">
        {copy.next}{" "}
        <Link to="/grappelli" className="text-fg hover:underline">
          Stéphane Grappelli
        </Link>
        {" · "}
        <Link to="/history" className="text-fg hover:underline">
          {copy.historyLink}
        </Link>
      </p>
    </main>
  );
}
