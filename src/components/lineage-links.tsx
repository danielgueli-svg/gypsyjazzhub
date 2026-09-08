import { Link } from "@tanstack/react-router";
import { ROMANI_MUSIC_SITE } from "@/lib/romani-music";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/history" as const, label: "History" },
  { to: "/django" as const, label: "Django" },
  { to: "/grappelli" as const, label: "Grappelli" },
  { href: ROMANI_MUSIC_SITE, label: "Romani Music" },
];

export function LineageLinks({
  current,
}: {
  current?: "/history" | "/django" | "/grappelli" | "/archive";
}) {
  return (
    <nav className="flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const active = "to" in link && Boolean(link.to) && current === link.to;
        const className = cn(
          "h-11 rounded-md px-4 text-sm leading-[2.75rem]",
          active ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
        );
        if ("href" in link && link.href) {
          return (
            <a key={link.label} href={link.href} className={className}>
              {link.label}
            </a>
          );
        }
        return (
          <Link key={link.to} to={link.to!} className={className}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
