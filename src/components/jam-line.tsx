import { Link } from "@tanstack/react-router";
import { CountryLabel } from "@/components/country-label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { Jam } from "@/lib/jams";
import { jamHours, jamPlace } from "@/lib/jams";
import { jamHoursLabel, jamWhen } from "@/lib/jam-copy";
import { useI18n } from "@/lib/i18n";

export function JamLine({ jam, showCountry = true }: { jam: Jam; showCountry?: boolean }) {
  const { t, locale } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const when = jam.kind === "meetup" ? t("jam.meetup") : jamWhen(jam.when, locale);
  const hours = jamHoursLabel(jamHours(jam), locale);
  const place = jamPlace(jam);
  const forum = jam.site?.includes("djangobooks.com") ? jam.site : null;
  return (
    <li className="min-w-0 break-inside-avoid py-2">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/jams/$slug" params={{ slug: jam.slug }} className="block min-w-0 hover:underline">
            {showCountry && jam.country ? (
              <>
                <CountryLabel name={jam.country} className="inline-flex max-w-full" />
                <span className="mx-1.5 text-faint">·</span>
              </>
            ) : null}
            <span className="font-display text-lg font-semibold leading-snug">{jam.name}</span>
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
            {jam.inviteEmail ? (
              <>
                <span className="mx-1.5 text-faint">·</span>
                <span className="text-sm text-muted">
                  {t("jam.byInvite").replace("{email}", jam.inviteEmail)}
                </span>
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
              {t("jam.fromDjangoBooks")}
            </a>
          ) : null}
        </div>
        {!isPending && user ? (
          <Link
            to="/jams/$slug"
            params={{ slug: jam.slug }}
            search={{ edit: true }}
            className="mt-0.5 shrink-0 text-sm font-medium text-accent hover:underline"
          >
            {t("jam.edit")}
          </Link>
        ) : null}
      </div>
    </li>
  );
}
