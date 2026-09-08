import { Link } from "@tanstack/react-router";
import { JoinedMark } from "@/components/joined-mark";

export function ArtistNameLink({
  slug,
  name,
  className,
  joined,
}: {
  slug: string;
  name: string;
  className?: string;
  joined?: boolean;
}) {
  const label = joined ? (
    <span className="inline-flex items-baseline gap-1.5">
      {name}
      <JoinedMark />
    </span>
  ) : (
    name
  );
  if (slug === "django-reinhardt") {
    return (
      <Link to="/django" className={className}>
        {label}
      </Link>
    );
  }
  if (slug === "stephane-grappelli") {
    return (
      <Link to="/grappelli" className={className}>
        {label}
      </Link>
    );
  }
  if (slug === "tata-mirando") {
    return (
      <Link to="/tata-mirando" className={className}>
        {label}
      </Link>
    );
  }
  if (slug === "denis-chang") {
    return (
      <Link to="/denis-chang" className={className}>
        {label}
      </Link>
    );
  }
  return (
    <Link to="/musicians/$slug" params={{ slug }} className={className}>
      {label}
    </Link>
  );
}
