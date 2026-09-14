import { Link } from "@tanstack/react-router";
import { historyCopy } from "@/lib/history-copy";
import { useI18n } from "@/lib/i18n";
import { ROMANI_MUSIC_SITE } from "@/lib/romani-music";
import { cn } from "@/lib/utils";

export function HistoryDoors() {
  const { t, locale } = useI18n();
  const copy = historyCopy(locale);
  const doors = [
    {
      to: "/django" as const,
      href: null,
      label: t("nav.django"),
      hint: t("nav.hint.django"),
      gold: false,
    },
    {
      to: "/grappelli" as const,
      href: null,
      label: t("nav.grappelli"),
      hint: t("nav.hint.grappelli"),
      gold: false,
    },
    {
      to: null,
      href: ROMANI_MUSIC_SITE,
      label: t("nav.romaniMusic"),
      hint: t("nav.hint.archiveRomani"),
      gold: true,
    },
  ];

  return (
    <nav aria-label={copy.title} className="mt-8 grid gap-3 sm:grid-cols-3">
      {doors.map((door) => {
        const className = cn(
          "block min-h-28 rounded-2xl p-5 shadow-border",
          door.gold ? "bg-accent text-accent-fg hover:opacity-95" : "bg-surface hover:bg-raised",
        );
        const inner = (
          <>
            <p className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{door.label}</p>
            <p className={cn("mt-2 text-sm leading-relaxed", door.gold ? "opacity-90" : "text-muted")}>
              {door.hint}
            </p>
            {door.href ? (
              <p
                className={cn(
                  "mt-3 text-xs tracking-[0.12em] uppercase",
                  door.gold ? "opacity-80" : "text-faint",
                )}
              >
                {copy.opensRomani}
              </p>
            ) : null}
          </>
        );
        return door.href ? (
          <a key={door.label} href={door.href} className={className}>
            {inner}
          </a>
        ) : (
          <Link key={door.label} to={door.to!} className={className}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
