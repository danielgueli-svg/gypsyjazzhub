import { Link } from "@tanstack/react-router";
import { CountryLabel } from "@/components/country-label";
import type { Camp } from "@/lib/camps";
import type { School } from "@/lib/scene-guide";

export function LearnLinks({
  schools,
  camps,
}: {
  schools: School[];
  camps: Camp[];
}) {
  if (schools.length === 0 && camps.length === 0) return null;

  return (
    <section className="mt-6 max-w-md">
      <h2 className="font-display text-xl font-semibold">Learn Gypsy Jazz</h2>
      <ul className="mt-2 space-y-1.5 text-sm">
        {schools.map((school) => (
          <li key={school.url}>
            <a
              href={school.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-fg hover:underline"
            >
              {school.name}
            </a>
          </li>
        ))}
        {camps.map((camp) => (
          <li key={camp.slug}>
            <Link
              to="/learn/$slug"
              params={{ slug: camp.slug }}
              className="text-muted hover:text-fg hover:underline"
            >
              <CountryLabel name={camp.country} short className="inline-flex" />
              <span className="mx-1.5 text-faint">·</span>
              {camp.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
