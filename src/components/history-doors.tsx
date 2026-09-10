import { Link } from "@tanstack/react-router";
import { ROMANI_MUSIC_SITE } from "@/lib/romani-music";
import { cn } from "@/lib/utils";

const DOORS = [
  {
    to: "/django" as const,
    href: null,
    label: "Django",
    hint: "Django Reinhardt — the full life.",
    gold: false,
  },
  {
    to: "/grappelli" as const,
    href: null,
    label: "Grappelli",
    hint: "Stéphane Grappelli — the full life.",
    gold: false,
  },
  {
    to: null,
    href: ROMANI_MUSIC_SITE,
    label: "Romani Music",
    hint: "Opens www.romanimusic.com — families, orchestras, past chairs.",
    gold: true,
  },
];

export function HistoryDoors() {
  return (
    <nav aria-label="History doors" className="mt-8 grid gap-3 sm:grid-cols-3">
      {DOORS.map((door) => {
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
            {door.href || door.to?.includes("romani-music") ? (
              <p
                className={cn(
                  "mt-3 text-xs tracking-[0.12em] uppercase",
                  door.gold ? "opacity-80" : "text-faint",
                )}
              >
                Opens www.romanimusic.com
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
