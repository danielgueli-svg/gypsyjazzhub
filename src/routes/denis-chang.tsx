import { createFileRoute, Link } from "@tanstack/react-router";
import { ArtistClips } from "@/components/artist-clips";
import { ArtistMusic } from "@/components/artist-music";
import { Contribute } from "@/components/contribute";
import { FestivalLinks } from "@/components/festival-links";
import { FollowArtist } from "@/components/follow-artist";
import { Guestbook } from "@/components/guestbook";
import { HubExtras } from "@/components/hub-extras";
import { LearnLinks } from "@/components/learn-links";
import { PlaysWith } from "@/components/plays-with";
import { Portrait } from "@/components/portrait";
import { SaveButton } from "@/components/save-button";
import { ShareBox } from "@/components/share-page";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loadDirectoryArtist } from "@/lib/directory-artist";
import { artistPhoto } from "@/lib/photos";
import { pageHead } from "@/lib/seo";
import { concertShareLine } from "@/lib/utils";

const SCHOOL = "https://www.dc-musicschool.com/";
const YT_PLAYER = "https://www.youtube.com/@DenisChangMusic";
const YT_SCHOOL = "https://www.youtube.com/@DCMusicSchool";
const SITE = "https://www.denischang.com/";

export const Route = createFileRoute("/denis-chang")({
  head: () =>
    pageHead({
      title: "Denis Chang — gypsy jazz guitar, Japan, DC Music School",
      description:
        "Denis Chang is a gypsy jazz guitarist and teacher based in Japan. DC Music School, YouTube lessons, and the Japan circuit — Tokyo, Osaka, Setouchi Django Street.",
      path: "/denis-chang",
    }),
  loader: async () => {
    const directory = await loadDirectoryArtist("denis-chang");
    if (!directory) throw new Error("Denis Chang is missing from the hub.");
    return directory;
  },
  component: DenisChangPage,
});

function DenisChangPage() {
  const data = Route.useLoaderData();
  const { legend, concerts, collaborators, bands, festivals, clips, notes, shoutouts, reports, camps, schools } =
    data;
  const upcoming = concerts.filter((c) => !c.isHistoric && new Date(c.startsAt).getTime() >= Date.now());
  const photo = artistPhoto("denis-chang");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Musician & teacher</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">Denis Chang</h1>
          <p className="mt-3 text-muted">Based in Japan</p>
          <p className="mt-1 text-sm text-faint">Born Montreal · Taiwanese-Canadian · guitar</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge>DC Music School</Badge>
            <Badge>Japan</Badge>
            <Badge>Guitar</Badge>
            <Badge>Teacher</Badge>
          </div>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{legend.bio}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a href={SCHOOL} target="_blank" rel="noreferrer" className="text-fg hover:underline">
              DC Music School
            </a>
            <a href={YT_PLAYER} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
              YouTube
            </a>
            <a href={YT_SCHOOL} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
              DC Music School YouTube
            </a>
            <a href={SITE} target="_blank" rel="noreferrer" className="text-muted hover:text-fg hover:underline">
              denischang.com
            </a>
            {legend.instagramUrl ? (
              <a
                href={legend.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-fg hover:underline"
              >
                Instagram
              </a>
            ) : null}
            <Link to="/learn/teachers" className="text-muted hover:text-fg hover:underline">
              Teachers
            </Link>
          </p>
          <div className="mt-6">
            <FollowArtist
              artist={{ artistSlug: "denis-chang", artistKind: "legend", artistName: "Denis Chang" }}
            />
          </div>
          <div className="mt-3">
            <SaveButton kind="artist" slug="denis-chang" label="Save artist" />
          </div>
        </div>
        {photo ? (
          <Portrait
            src={photo.src}
            alt="Denis Chang"
            credit={photo.credit}
            creditHref={photo.href}
            className="h-auto w-full max-h-[28rem] rounded-2xl object-contain object-top shadow-border"
          />
        ) : null}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          ["Lives", "Japan · Tokyo"],
          ["School", "DC Music School — online worldwide"],
          ["Also", "Musician on the Japan and Taipei circuit"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-surface p-5 shadow-border">
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{label}</p>
            <p className="mt-2 font-display text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-12 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-surface p-6 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Learn</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">DC Music School</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Denis’s school: lessons, transcriptions and the library a lot of amateurs
            walk into first. He lives in Japan; the school is online worldwide.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href={SCHOOL} target="_blank" rel="noreferrer">
                Open the school
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={YT_SCHOOL} target="_blank" rel="noreferrer">
                School YouTube
              </a>
            </Button>
          </div>
        </article>
        <article className="rounded-2xl bg-surface p-6 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Watch</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">YouTube</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Player channel for concerts, Japan and lessons. School channel for the
            transcription library.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <a href={YT_PLAYER} target="_blank" rel="noreferrer">
                @DenisChangMusic
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={YT_SCHOOL} target="_blank" rel="noreferrer">
                @DCMusicSchool
              </a>
            </Button>
          </div>
        </article>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">From the channels</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <figure className="space-y-3">
            <YouTubeEmbed url="https://www.youtube.com/watch?v=qJrcOR7vW5k" title="It's OK to not be talented" />
            <figcaption className="font-display text-xl font-semibold">
              It’s OK to not be talented — Denis Chang
            </figcaption>
          </figure>
          <figure className="space-y-3">
            <YouTubeEmbed
              url="https://www.youtube.com/watch?v=agTtheaY2b4"
              title="Early Jazz Guitar — All Of Me"
            />
            <figcaption className="font-display text-xl font-semibold">
              Early Jazz Guitar — All Of Me (DC Music School)
            </figcaption>
          </figure>
        </div>
      </section>

      <ArtistMusic slug="denis-chang" name="Denis Chang" />

      <div className="mt-10 max-w-2xl">
        <ShareBox
          url="/denis-chang"
          title="Denis Chang"
          lead="Musician and teacher — Japan, DC Music School."
          text={[
            "Denis Chang — gypsy jazz guitar, Japan",
            "DC Music School: https://www.dc-musicschool.com/",
            "YouTube: https://www.youtube.com/@DenisChangMusic",
            upcoming.length
              ? `\nNext dates:\n${upcoming
                  .slice(0, 5)
                  .map((concert) => `• ${concertShareLine(concert)}`)
                  .join("\n")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n")}
        />
      </div>

      <LearnLinks schools={schools} camps={camps.filter((camp) => camp.hostSlugs.includes("denis-chang"))} />
      <ArtistClips slug="denis-chang" />
      <PlaysWith artists={collaborators} bands={bands} />
      <FestivalLinks festivals={festivals} />
      <Guestbook slug="denis-chang" name="Denis Chang" initial={shoutouts} />
      <HubExtras clips={clips} notes={notes} />
      <Contribute presetSlug="denis-chang" presetName="Denis Chang" heading="Add to Denis Chang" />

      <p className="mt-12 text-sm text-muted">
        <Link to="/learn/teachers" className="text-fg hover:underline">
          Teachers
        </Link>
        {" · "}
        <Link to="/musicians" className="text-fg hover:underline">
          Musicians
        </Link>
        {" · "}
        <Link to="/world/$slug" params={{ slug: "japan" }} className="text-fg hover:underline">
          Japan
        </Link>
      </p>
    </main>
  );
}
