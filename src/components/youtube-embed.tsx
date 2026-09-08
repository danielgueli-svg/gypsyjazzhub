import { youtubeVideoId } from "@/lib/utils";

export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const id = youtubeVideoId(url);
  if (!id) {
    if (!url.trim()) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex text-sm text-muted hover:text-fg"
      >
        Watch on YouTube
      </a>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-border">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          className="absolute inset-0 size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
