import { useState } from "react";
import { YouTubeEmbed } from "@/components/youtube-embed";
import type { ArchiveVideo } from "@/lib/archive-videos";
import { useI18n } from "@/lib/i18n";

export function ArchiveClips({
  videos,
  title,
}: {
  videos: ArchiveVideo[];
  title?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  if (videos.length === 0) return null;
  const featured = videos.slice(0, 2);
  const rest = videos.slice(2);
  const listed = open ? rest : rest.slice(0, 10);
  const hidden = Math.max(0, rest.length - 10);

  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold">
        {title ?? t("archive.clips")}
        <span className="ml-2 text-lg font-normal text-muted">({videos.length})</span>
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{t("archive.clipsLead")}</p>
      {featured.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {featured.map((video) => (
            <div key={video.id} className="min-w-0 max-w-sm">
              <YouTubeEmbed url={`https://www.youtube.com/watch?v=${video.id}`} title={video.title} />
              <p className="mt-2 text-sm text-muted">{video.title}</p>
            </div>
          ))}
        </div>
      ) : null}
      {rest.length > 0 ? (
        <>
          <ul className="mt-5 columns-1 gap-x-10 sm:columns-2">
            {listed.map((video) => (
              <li key={video.id} className="break-inside-avoid py-1">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted hover:text-fg hover:underline"
                >
                  {video.title}
                </a>
              </li>
            ))}
          </ul>
          {hidden > 0 || open ? (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="mt-4 text-sm font-medium text-accent hover:underline"
            >
              {open ? t("archive.clipsLess") : `${t("archive.clipsMore")} (${hidden})`}
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
