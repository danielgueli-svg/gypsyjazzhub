import { Link } from "@tanstack/react-router";
import type { Legend } from "@/lib/api";
import type { Band } from "@/lib/scene";
import { Badge } from "@/components/ui/badge";

function artistTo(legend: Legend) {
  if (legend.slug === "django-reinhardt") return "/django" as const;
  if (legend.slug === "stephane-grappelli") return "/grappelli" as const;
  if (legend.slug === "denis-chang") return "/denis-chang" as const;
  return null;
}

export function PlaysWith({
  artists,
  bands,
}: {
  artists: Legend[];
  bands: Band[];
}) {
  if (artists.length === 0 && bands.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold">Plays with</h2>
      {bands.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {bands.map((band) => (
            <li key={band.slug}>
              <Link
                to="/groups/$slug"
                params={{ slug: band.slug }}
                className="inline-flex h-9 items-center rounded-md bg-raised px-3 text-sm text-muted hover:text-fg"
              >
                {band.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {artists.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {artists.map((artist) => {
            const dedicated = artistTo(artist);
            const body = (
              <>
                <p className="font-display text-xl font-semibold leading-tight">
                  {artist.name}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {artist.instruments}
                  {artist.origin ? ` · ${artist.origin}` : ""}
                </p>
                <div className="mt-3">
                  <Badge>{artist.era}</Badge>
                </div>
              </>
            );
            const className =
              "block rounded-2xl bg-surface p-5 shadow-border transition-colors duration-150 hover:bg-raised";
            if (dedicated) {
              return (
                <Link key={artist.slug} to={dedicated} className={className}>
                  {body}
                </Link>
              );
            }
            return (
              <Link
                key={artist.slug}
                to="/musicians/$slug"
                params={{ slug: artist.slug }}
                className={className}
              >
                {body}
              </Link>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
