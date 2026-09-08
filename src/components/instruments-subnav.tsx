import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/instruments", key: "instruments.overview", exact: true },
  { to: "/instruments/guitars", key: "instruments.guitars" },
  { to: "/instruments/double-bass", key: "instruments.bass" },
  { to: "/instruments/other", key: "instruments.other" },
  { to: "/instruments/luthiers", key: "country.makers" },
] as const;

function active(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === to || pathname === `${to}/`;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function InstrumentsSubnav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useI18n();

  return (
    <nav
      aria-label={t("nav.instruments")}
      className="mt-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            "inline-flex h-11 shrink-0 items-center rounded-md px-3 text-sm",
            active(pathname, item.to, "exact" in item && item.exact)
              ? "bg-raised text-fg"
              : "text-muted hover:bg-raised hover:text-fg",
          )}
        >
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
}
