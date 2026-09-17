import { Link } from "@tanstack/react-router";

export function RelatedPages({
  musicianSlug,
  luthierSlug,
  current,
}: {
  musicianSlug?: string | null;
  luthierSlug?: string | null;
  current: "musician" | "luthier";
}) {
  const musician = current !== "musician" && musicianSlug;
  const workshop = current !== "luthier" && luthierSlug;
  if (!musician && !workshop) return null;

  return (
    <p className="mt-4 flex flex-col items-start gap-1 text-sm">
      {musician ? (
        <Link
          to="/musicians/$slug"
          params={{ slug: musicianSlug! }}
          className="text-fg hover:underline"
        >
          Musician page
        </Link>
      ) : null}
      {workshop ? (
        <Link
          to="/luthiers/$slug"
          params={{ slug: luthierSlug! }}
          className="text-fg hover:underline"
        >
          Workshop page
        </Link>
      ) : null}
    </p>
  );
}
