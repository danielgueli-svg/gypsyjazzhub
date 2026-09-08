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
import { listCollaborators, listLegendConcerts } from "@/lib/api";
import { festivalsForArtist } from "@/lib/festivals";
import { listHubClips, listHubNotes } from "@/lib/hub-api";
import { listGuestbook } from "@/lib/guestbook";
import { listArtistReviews } from "@/lib/concert-reviews";
import { artistPhoto } from "@/lib/photos";
import { bandsFor } from "@/lib/scene";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/django")({
  head: () =>
    pageHead({
      title: "Django Reinhardt — gypsy jazz guitar",
      description:
        "Django Reinhardt invented gypsy jazz. Bio, recordings, lineage and dates for the guitarist of the Quintette du Hot Club de France.",
    }),
  loader: async () => {
    const [concerts, collaborators, clips, notes, shoutouts, reports] = await Promise.all([
      listLegendConcerts({ data: "django-reinhardt" }),
      listCollaborators({ data: "django-reinhardt" }),
      listHubClips({ data: "django-reinhardt" }),
      listHubNotes({ data: "django-reinhardt" }),
      listGuestbook({ data: "django-reinhardt" }),
      listArtistReviews({ data: "django-reinhardt" }),
    ]);
    return {
      concerts,
      collaborators,
      clips,
      notes,
      shoutouts,
      reports,
      bands: bandsFor("django-reinhardt"),
      festivals: festivalsForArtist("django-reinhardt", true),
    };
  },
  component: DjangoPage,
});

function DjangoPage() {
  const { concerts, collaborators, bands, festivals, clips, notes, shoutouts, reports } = Route.useLoaderData();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
            Solo guitar
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
            Django Reinhardt
          </h1>
          <p className="mt-3 text-muted">
            Based in France
          </p>
          <p className="mt-1 text-sm text-faint">
            Born Liberchies, Belgium · 23 January 1910 — 16 May 1953, Fontainebleau
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
          className="aspect-[4/5] w-full rounded-2xl shadow-border"
        />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          ["Born", "Liberchies, Belgium"],
          ["Instrument", "Selmer-Maccaferri guitar"],
          ["Buried", "Samois-sur-Seine"],
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
          Jean “Django” Reinhardt was born on 23 January 1910 in a caravan at
          Liberchies, Belgium, into a family of Manouche musicians. He grew up
          on the road between Belgium and France, and by his teens he was
          already working in the bals musette of Paris — banjo and guitar
          behind accordion, playing waltzes for dancers who did not need a
          conservatory name.
        </p>
        <p>
          On the night of 26 October 1928 a fire destroyed the caravan he
          shared with Bella, his first wife. He was eighteen. The burns took
          the use of the third and fourth fingers of his left hand. Doctors
          talked of amputation of a leg. He refused. The recovery was long. When
          he returned to the guitar he had to invent a technique around two
          functioning fingers: a new way to hold chords, a new way to run the
          fretboard, a sound that came out of limitation rather than despite it.
        </p>
        <p>
          In the early 1930s he met Stéphane Grappelli. In 1934 they recorded
          as the Quintette du Hot Club de France — an all-string swing group
          with no drums and no brass. Django’s brother Joseph often played
          rhythm. The Selmer-Maccaferri guitar, with its oval soundhole and
          projecting volume, became the instrument of the style. The records
          — Minor Swing, Djangology, Bricktop, Nuages — made a family music
          into an international language.
        </p>
        <p>
          War split the Quintette. Grappelli was in London and stayed.
          Django remained in occupied France, a Romani star in a country that
          was deporting Romani people. He survived. Nuages, from 1940, is the
          ballad of those years: still, singing, and played today wherever the
          music is taken seriously.
        </p>
        <p>
          In 1946 he toured the United States with Duke Ellington. The halls
          were mixed; the legend was not. Back in France he kept writing and
          recording, sometimes on electric guitar, always with that vocal lead
          line. He died of a brain haemorrhage on 16 May 1953, aged forty-three,
          near Fontainebleau. He is buried in Samois-sur-Seine, the village
          that later gave the music its festival.
        </p>
        <p>
          Every gypsy jazz guitarist since has had to decide what to do with
          those two fingers: copy them, extend them, or leave them behind.
          The pompe, the Selmer, the repertoire, the festival at Samois — they
          all run back to this life.
        </p>
      </article>

      <ArtistMusic slug="django-reinhardt" name="Django Reinhardt" />

      <PlaysWith artists={collaborators} bands={bands} />
      <FestivalLinks festivals={festivals} />

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Listen first</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Minor Swing", "1937 · Quintette du Hot Club de France"],
            ["Nuages", "1940 · the wartime ballad"],
            ["Djangology", "1935 · the calling card"],
            ["Limehouse Blues", "with Grappelli, the fast ones"],
            ["Manoir de mes rêves", "late lyric Django"],
            ["I'll See You in My Dreams", "the two-finger run, full open"],
          ].map(([title, note]) => (
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
        heading="Add to Django"
      />

      <p className="mt-12 text-sm text-muted">
        Next:{" "}
        <Link to="/grappelli" className="text-fg hover:underline">
          Stéphane Grappelli
        </Link>
        {" · "}
        <Link to="/history" className="text-fg hover:underline">
          History of Gypsy Jazz and the Sinti
        </Link>
      </p>
    </main>
  );
}
