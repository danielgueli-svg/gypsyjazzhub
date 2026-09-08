import { YouTubeEmbed } from "@/components/youtube-embed";
import type { HubClip, HubNote } from "@/lib/hub-api";
import { formatConcertWhen } from "@/lib/utils";

export function HubExtras({ clips, notes }: { clips: HubClip[]; notes: HubNote[] }) {
  if (clips.length === 0 && notes.length === 0) return null;
  return (
    <>
      {notes.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">From the hub</h2>
          <p className="mt-2 text-sm text-muted">Extra notes added by members.</p>
          <ul className="mt-5 space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="rounded-2xl bg-surface p-5 shadow-border">
                <p className="text-sm leading-relaxed text-muted">{note.body}</p>
                <p className="mt-3 text-[11px] tracking-[0.16em] text-faint uppercase">
                  {note.submittedName} · {formatConcertWhen(note.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {clips.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Shared YouTube</h2>
          <p className="mt-2 text-sm text-muted">Clips fans and players put on this page.</p>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {clips.map((clip) => (
              <div key={clip.id}>
                <YouTubeEmbed url={clip.youtubeUrl} title={clip.title || "YouTube"} />
                {clip.title ? (
                  <p className="mt-2 text-sm text-muted">{clip.title}</p>
                ) : null}
                <p className="mt-1 text-[11px] tracking-[0.16em] text-faint uppercase">
                  {clip.submittedName}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
