import { cn } from "@/lib/utils";

export function Portrait({
  src,
  alt,
  credit,
  creditHref,
  className,
}: {
  src: string;
  alt: string;
  credit?: string;
  creditHref?: string;
  className?: string;
}) {
  return (
    <figure className="min-w-0">
      <img
        src={src}
        alt={alt}
        className={cn("bg-raised object-cover", className)}
      />
      {credit ? (
        <figcaption className="mt-2 text-[11px] leading-snug text-faint">
          {creditHref ? (
            <a
              href={creditHref}
              target="_blank"
              rel="noreferrer"
              className="hover:text-muted hover:underline"
            >
              Photo · {credit}
            </a>
          ) : (
            <>Photo · {credit}</>
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}
