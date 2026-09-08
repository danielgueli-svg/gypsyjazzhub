import { Link } from "@tanstack/react-router";
import type { Legend } from "@/lib/api";
import { artistPhotoSrc, hasArtistPortrait } from "@/lib/photos";
import { basedInCountry } from "@/lib/geo";
import { Badge } from "@/components/ui/badge";
import { Portrait } from "@/components/portrait";

export function LegendCard({ legend, role }: { legend: Legend; role?: string }) {
  const dedicated =
    legend.slug === "django-reinhardt"
      ? "/django"
      : legend.slug === "stephane-grappelli"
        ? "/grappelli"
        : legend.slug === "denis-chang"
          ? "/denis-chang"
          : null;

  const className =
    "block overflow-hidden rounded-2xl bg-surface shadow-border transition-[transform,background-color] duration-150 hover:bg-raised";

  if (dedicated) {
    return (
      <Link to={dedicated} className={className}>
        <CardBody legend={legend} role={role} />
      </Link>
    );
  }

  return (
    <Link to="/musicians/$slug" params={{ slug: legend.slug }} className={className}>
      <CardBody legend={legend} role={role} />
    </Link>
  );
}

function CardBody({ legend, role }: { legend: Legend; role?: string }) {
  const photo = hasArtistPortrait(legend.slug)
    ? artistPhotoSrc(legend.slug, legend.instruments)
    : null;
  return (
    <>
      {photo ? (
        <Portrait src={photo} alt={legend.name} className="aspect-[16/10] w-full" />
      ) : null}
      <div className="p-5">
        <p className="text-[11px] tracking-[0.18em] text-faint uppercase">
          {role || legend.instruments}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
          {legend.name}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {basedInCountry(legend.origin)
            ? `Based in ${basedInCountry(legend.origin)}`
            : legend.years}
        </p>
        {legend.samois ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge>Samois</Badge>
          </div>
        ) : null}
      </div>
    </>
  );
}
