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
import { festivalsForArtist } from "@/lib/festivals";
import { artistPhoto } from "@/lib/photos";
import { bandsFor } from "@/lib/scene";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/grappelli")({
  head: () =>
    pageHead({
      title: "Stéphane Grappelli — gypsy jazz violin",
      description:
        "Stéphane Grappelli, violin of the Quintette du Hot Club de France. Bio, recordings and the living gypsy jazz violin line.",
      path: "/grappelli",
    }),
  loader: async () => {
    const extras = await loadArtistExtras("stephane-grappelli");
    return {
      concerts: extras.concerts,
      collaborators: extras.collaborators,
      clips: extras.clips,
      notes: extras.notes,
      shoutouts: extras.shoutouts,
      reports: extras.reports,
      bands: bandsFor("stephane-grappelli"),
      festivals: festivalsForArtist("stephane-grappelli", true),
    };
  },
  component: GrappelliPage,
});

function GrappelliPage() {
  const { concerts, collaborators, bands, festivals, clips, notes, shoutouts, reports } = Route.useLoaderData();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
            Violin
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
            Stéphane Grappelli
          </h1>
          <p className="mt-3 text-muted">Based in France</p>
          <p className="mt-1 text-sm text-faint">
            26 January 1908, Paris — 1 December 1997, Paris
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge>Quintette du Hot Club de France</Badge>
            <Badge>Piano</Badge>
          </div>
          <div className="mt-8">
            <LineageLinks current="/grappelli" />
          </div>
        </div>
        <Portrait
          src={artistPhoto("stephane-grappelli")?.src ?? "/artists/stephane-grappelli.jpg"}
          alt="Stéphane Grappelli"
          credit={artistPhoto("stephane-grappelli")?.credit}
          creditHref={artistPhoto("stephane-grappelli")?.href}
          className="h-auto w-full max-h-[28rem] rounded-2xl object-contain object-top shadow-border"
        />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          ["Born", "Paris, France"],
          ["Instrument", "Violin — and piano"],
          ["Partner", "Django Reinhardt, 1934–39"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-surface p-5 shadow-border">
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{label}</p>
            <p className="mt-2 font-display text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <article className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">Biography</h2>
        <p>
          Stéphane Grappelli was born in Paris on 26 January 1908. His Italian
          father, a tailor, was often away; the boy learned piano in a pit
          orchestra and violin on his own terms, with a stretch at the
          Conservatoire that never quite made him an orthodox classical player.
          He earned a living in silent-cinema pits and dance bands. He had
          swing in the bow before he had a name for it.
        </p>
        <p>
          He met Django Reinhardt in the early 1930s, in the world of Paris
          studio dates and after-hours jams. The violin and the two-finger
          guitar fitted as if they had been waiting for each other: Grappelli
          airborne, Django earthy and incandescent. In 1934 the Quintette du
          Hot Club de France gave that partnership a public form — strings
          only, no drums — and the records that followed are still the core
          of the repertoire.
        </p>
        <p>
          Early labels sometimes spelled him Grappelly. The sound did not
          need the Y. He played with salon elegance and dance-floor time:
          vibrato used as a colour, not a habit; phrases that landed on the
          beat even when they seemed to drift above it.
        </p>
        <p>
          In 1939 the Quintette was in London when war broke out. Grappelli
          stayed in Britain. Django went back to France. They would record
          again after the war, but the first Quintette was over. In London
          Grappelli worked through the conflict, keeping a swing violin alive
          in a city under bombs.
        </p>
        <p>
          Django died in 1953. Grappelli lived another forty-four years, and
          he used them. He played with Duke Ellington’s world, with Oscar
          Peterson, with Yehudi Menuhin — the famous “crossover” records that
          introduced a new public to Hot Club violin — and with younger
          Manouche players who wanted the original chair beside them. He never
          became a museum. He kept touring into old age, violin case on the
          train, a professional to the last bar.
        </p>
        <p>
          He died in Paris on 1 December 1997, aged eighty-nine. If Django
          invented the guitar language, Grappelli invented how it should
          breathe. Every violinist on this site — Florin Niculescu, Costel
          Nitescu, Tcha Limberger, Tim Kliphuis — plays in a room he opened.
        </p>
      </article>

      <ArtistMusic slug="stephane-grappelli" name="Stéphane Grappelli" />

      <PlaysWith artists={collaborators} bands={bands} />
      <FestivalLinks festivals={festivals} />

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Listen first</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Minor Swing", "1937 · with Django, the dance"],
            ["Nuages", "the violin answering the guitar"],
            ["Limehouse Blues", "speed, still graceful"],
            ["Menuhin & Grappelli", "1970s · two violins, one public"],
            ["Sweet Chorus", "the late, unhurried tone"],
            ["Them There Eyes", "swing violin, no apology"],
          ].map(([title, note]) => (
            <li key={title} className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="font-display text-xl font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{note}</p>
            </li>
          ))}
        </ul>
      </section>

      <Nightbook artistName="Stéphane Grappelli" concerts={concerts} initialReviews={reports} />

      <Guestbook slug="stephane-grappelli" name="Stéphane Grappelli" initial={shoutouts} />

      <HubExtras clips={clips} notes={notes} />
      <Contribute
        presetSlug="stephane-grappelli"
        presetName="Stéphane Grappelli"
        heading="Add to Grappelli"
      />

      <p className="mt-12 text-sm text-muted">
        Next:{" "}
        <Link to="/django" className="text-fg hover:underline">
          Django Reinhardt
        </Link>
        {" · "}
        <Link to="/history" className="text-fg hover:underline">
          History of Gypsy Jazz and the Sinti
        </Link>
      </p>
    </main>
  );
}
