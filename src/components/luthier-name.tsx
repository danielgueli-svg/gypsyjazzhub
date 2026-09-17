import { Link } from "@tanstack/react-router";
import type { Luthier } from "@/lib/luthiers";
import { luthierPhotoSrc } from "@/lib/photos";

export function LuthierName({ luthier }: { luthier: Luthier }) {
  const photo = luthierPhotoSrc(luthier.slug);
  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-2">
      {photo && luthier.site ? (
        <a
          href={luthier.site}
          target="_blank"
          rel="noreferrer"
          title={`Open ${luthier.name}'s website`}
          className="shrink-0"
        >
          <img
            src={photo}
            alt=""
            className="size-8 rounded-md object-cover object-top shadow-border"
          />
        </a>
      ) : photo ? (
        <img src={photo} alt="" className="size-8 rounded-md object-cover object-top shadow-border" />
      ) : null}
      <Link
        to="/luthiers/$slug"
        params={{ slug: luthier.slug }}
        className="min-w-0 break-words font-display text-xl font-semibold hover:underline"
      >
        {luthier.name}
      </Link>
    </span>
  );
}
