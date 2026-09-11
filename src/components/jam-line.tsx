import { Link } from "@tanstack/react-router";
import { CountryLabel } from "@/components/country-label";
import type { Jam } from "@/lib/jams";
import { jamHours, jamPlace } from "@/lib/jams";

export function JamLine({ jam, showCountry = true }: { jam: Jam; showCountry?: boolean }) {
  const when = jam.kind === "meetup" ? "Meetup" : jam.when;
  const hours = jamHours(jam);
  const place = jamPlace(jam);
  const forum = jam.site?.includes("djangobooks.com") ? jam.site : null;
  return (
    <li className="break-inside-avoid py-2">
      <Link to="/jams/$slug" params={{ slug: jam.slug }} className="block hover:underline">
        {showCountry && jam.country ? (
          <>
            <CountryLabel name={jam.country} className="inline-flex" />
            <span className="mx-1.5 text-faint">·</span>
          </>
        ) : null}
        <span className="font-display text-lg font-semibold">{jam.name}</span>
        {hours ? (
          <>
            <span className="mx-1.5 text-faint">·</span>
            <span className="text-sm text-fg">{hours}</span>
          </>
        ) : null}
        {when ? (
          <>
            <span className="mx-1.5 text-faint">·</span>
            <span className="text-sm text-muted">{when}</span>
          </>
        ) : null}
      </Link>
      {place ? <p className="text-sm text-muted">{place}</p> : null}
      {forum ? (
        <a
          href={forum}
          target="_blank"
          rel="noreferrer"
          className="mt-0.5 inline-block text-xs text-faint hover:text-fg"
        >
          From DjangoBooks
        </a>
      ) : null}
    </li>
  );
}
