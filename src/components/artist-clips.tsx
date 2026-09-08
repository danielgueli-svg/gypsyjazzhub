import { YouTubeEmbed } from "@/components/youtube-embed";
import { clipsForArtist } from "@/lib/artist-clips";

export function ArtistClips({ slug }: { slug: string }) {
  const clips = clipsForArtist(slug);
  if (clips.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold">Watch</h2>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        {clips.map((clip) => (
          <figure key={clip.url} className="space-y-3">
            <YouTubeEmbed url={clip.url} title={clip.title} />
            <figcaption className="font-display text-xl font-semibold">
              {clip.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
