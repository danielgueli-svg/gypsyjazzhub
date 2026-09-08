import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/language-switch";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  key: string;
  hint: string;
  hash?: string;
  exact?: boolean;
  href?: string;
};

type TopItem =
  | { kind: "link"; key: string; to: string }
  | { kind: "menu"; key: string; to: string; items: NavItem[] };

const TOP: TopItem[] = [
  { kind: "link", key: "nav.home", to: "/" },
  {
    kind: "menu",
    key: "nav.community",
    to: "/jams",
    items: [
      { to: "/jams", key: "nav.jams", hint: "nav.hint.jams" },
      { to: "/learn", key: "nav.camps", hint: "nav.hint.camps", hash: "camps" },
      { to: "/board", key: "nav.board", hint: "nav.hint.board" },
      { to: "/musicians", key: "nav.musicians", hint: "nav.hint.musicians" },
      { to: "/groups", key: "nav.groups", hint: "nav.hint.groups" },
    ],
  },
  {
    kind: "menu",
    key: "nav.events",
    to: "/concerts",
    items: [
      { to: "/concerts", key: "nav.concerts", hint: "nav.hint.concerts" },
      { to: "/festivals", key: "nav.festivals", hint: "nav.hint.festivals" },
    ],
  },
  {
    kind: "menu",
    key: "nav.learnShort",
    to: "/learn",
    items: [
      { to: "/learn", key: "learn.overview", hint: "nav.hint.learnHome" },
      { to: "/learn", key: "nav.campsShort", hint: "nav.hint.camps", hash: "camps" },
      { to: "/learn", key: "learn.schools", hint: "nav.hint.schools", hash: "schools" },
      { to: "/instruments", key: "nav.instruments", hint: "nav.hint.instruments" },
      { to: "/learn/teachers", key: "nav.teachers", hint: "nav.hint.teachers" },
      { to: "/learn/apps", key: "nav.apps", hint: "nav.hint.apps" },
    ],
  },
  {
    kind: "menu",
    key: "nav.history",
    to: "/history",
    items: [
      { to: "/history", key: "nav.history", hint: "nav.hint.history" },
      {
        to: "/romani-music",
        href: "https://romanimusic.com",
        key: "nav.archiveRomani",
        hint: "nav.hint.archiveRomani",
      },
    ],
  },
  { kind: "link", key: "nav.news", to: "/news" },
];

function itemKey(link: { to: string; hash?: string; key: string; href?: string }) {
  return link.href ?? (link.hash ? `${link.to}#${link.hash}` : link.key);
}

function pathActive(
  pathname: string,
  to: string,
  itemHash?: string,
  currentHash = "",
  exact?: boolean,
) {
  if (to === "/") return pathname === "/";
  if (exact) return pathname === to;
  if (itemHash) return pathname === to && currentHash.replace(/^#/, "") === itemHash;
  if (pathname === to) return true;
  return pathname.startsWith(`${to}/`);
}

function historyActive(pathname: string) {
  return (
    pathActive(pathname, "/history") ||
    pathActive(pathname, "/archive") ||
    pathActive(pathname, "/romani-music") ||
    pathname === "/django" ||
    pathname === "/grappelli"
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash.replace(/^#/, "") });
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenKey(null);
    setSheetOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!openKey && !sheetOpen) return;
    const onDoc = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpenKey(null);
        setSheetOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenKey(null);
        setSheetOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [openKey, sheetOpen]);

  const openMenu = TOP.find((item) => item.kind === "menu" && item.key === openKey) as
    | Extract<TopItem, { kind: "menu" }>
    | undefined;

  return (
    <header ref={root} className="spruce-bar sticky top-0 z-50 border-b border-black/15">
      <div className="relative z-[90] mx-auto flex h-14 max-w-6xl items-center gap-1.5 px-2 sm:h-20 sm:gap-3 sm:px-6">
        <Link to="/" aria-label="Gypsy Jazz Hub" className="flex min-w-0 shrink items-center gap-1.5 text-inherit sm:gap-3">
          <BrandMark className="h-10 w-auto shrink-0 sm:h-14" />
          <span className="hidden min-w-0 font-display text-lg font-semibold leading-tight tracking-tight sm:inline sm:text-3xl">
            Gypsy Jazz Hub
          </span>
        </Link>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitch compact prominent />
          <Link
            to="/search"
            className="hidden size-11 items-center justify-center rounded-md text-inherit hover:bg-black/10 md:inline-flex"
            aria-label={t("nav.search")}
          >
            <Search className="size-5" />
          </Link>
          <AuthSlot />
          <Link
            to="/history"
            className="inline-flex h-9 items-center rounded-md bg-[#d9a24e] px-2.5 text-xs font-semibold text-[#2a1c10] hover:bg-[#e4b05a] md:hidden"
          >
            {t("nav.history")}
          </Link>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded-md bg-[#d9a24e] px-2.5 text-xs font-semibold text-[#2a1c10] hover:bg-[#e4b05a] md:hidden"
            onClick={() => {
              setSheetOpen((v) => !v);
              setOpenKey(null);
            }}
            aria-expanded={sheetOpen}
            aria-label={sheetOpen ? t("nav.close") : t("nav.menu")}
          >
            {sheetOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            {t("nav.menu")}
          </button>
        </div>
      </div>

      {sheetOpen ? (
        <div className="border-t border-black/10 bg-[#c39452]/55 px-3 py-4 md:hidden">
          <SheetMenu pathname={pathname} hash={hash} onPick={() => setSheetOpen(false)} />
        </div>
      ) : (
        <div className="hidden border-t border-black/10 bg-[#c39452]/45 md:block">
          <nav
            className="site-topics mx-auto grid h-auto w-full max-w-6xl grid-cols-6 items-stretch gap-0.5 px-0.5 py-0.5 sm:flex sm:h-12 sm:justify-evenly sm:gap-0 sm:px-4 sm:py-0"
            aria-label="Main"
          >
            {TOP.map((item) =>
              item.kind === "link" ? (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={() => setOpenKey(null)}
                  className={cn(
                    "inline-flex min-w-0 flex-col items-center justify-center rounded-md px-0.5 py-1.5 text-center font-semibold leading-tight text-[#2a1c10] sm:flex-row sm:rounded-none sm:px-4 sm:text-sm sm:font-medium",
                    (item.key === "nav.history" ? historyActive(pathname) : pathActive(pathname, item.to))
                      ? "bg-[#2a1c10] text-[#f4e6c8] sm:bg-black/10 sm:text-[#2a1c10]"
                      : "bg-[#d9a24e] text-[#2a1c10] hover:bg-[#e4b05a] sm:bg-transparent sm:hover:bg-black/10",
                  )}
                >
                  {t(item.key)}
                </Link>
              ) : (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setOpenKey((key) => (key === item.key ? null : item.key))}
                  aria-expanded={openKey === item.key}
                  className={cn(
                    "inline-flex min-w-0 flex-col items-center justify-center gap-0 rounded-md px-0.5 py-1.5 text-center font-semibold leading-tight text-[#2a1c10] sm:flex-row sm:gap-1 sm:rounded-none sm:px-4 sm:text-sm sm:font-medium",
                    openKey === item.key ||
                    (item.key === "nav.history" ? historyActive(pathname) : pathActive(pathname, item.to))
                      ? "bg-[#2a1c10] text-[#f4e6c8] sm:bg-black/10 sm:text-[#2a1c10]"
                      : "bg-[#d9a24e] text-[#2a1c10] hover:bg-[#e4b05a] sm:bg-transparent sm:hover:bg-black/10",
                  )}
                >
                  <span className="max-w-full">{t(item.key)}</span>
                  <ChevronDown className={cn("size-2.5 sm:size-3.5", openKey === item.key && "rotate-180")} />
                </button>
              ),
            )}
          </nav>
          {openMenu ? (
            <MegaPanel menu={openMenu} pathname={pathname} hash={hash} onPick={() => setOpenKey(null)} />
          ) : null}
        </div>
      )}
    </header>
  );
}

function MegaPanel({
  menu,
  pathname,
  hash,
  onPick,
}: {
  menu: Extract<TopItem, { kind: "menu" }>;
  pathname: string;
  hash: string;
  onPick: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="border-t border-black/10 bg-[#e8c48a]">
      <div className="mx-auto grid max-w-6xl gap-1 px-3 py-3 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
        {menu.items.map((link) =>
          link.href ? (
            <a
              key={itemKey(link)}
              href={link.href}
              onClick={onPick}
              className="rounded-xl px-3 py-2 text-[#2a1c10] hover:bg-[#d9a24e]"
            >
              <span className="block text-sm font-medium leading-tight">{t(link.key)}</span>
              <span className="mt-0.5 block text-xs leading-snug opacity-80">{t(link.hint)}</span>
            </a>
          ) : (
            <Link
              key={itemKey(link)}
              to={link.to}
              hash={link.hash ?? ""}
              onClick={onPick}
              className={cn(
                "rounded-xl px-3 py-2 text-[#2a1c10] hover:bg-[#d9a24e]",
                pathActive(pathname, link.to, link.hash, hash, link.exact) && "bg-[#d9a24e]",
              )}
            >
              <span className="block text-sm font-medium leading-tight">{t(link.key)}</span>
              <span className="mt-0.5 block text-xs leading-snug opacity-80">{t(link.hint)}</span>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

function SheetMenu({
  pathname,
  hash,
  onPick,
}: {
  pathname: string;
  hash: string;
  onPick: () => void;
}) {
  const { t } = useI18n();
  const menus = TOP.filter((item) => item.kind === "menu");

  return (
    <div className="space-y-3 text-[#2a1c10]">
      <Link
        to="/search"
        onClick={onPick}
        className="block rounded-xl bg-[#d9a24e] px-3 py-2.5 text-sm font-medium hover:bg-[#e4b05a]"
      >
        {t("nav.search")}
      </Link>
      <div className="grid grid-cols-3 gap-1">
        <Link
          to="/"
          onClick={onPick}
          className={cn(
            "rounded-xl px-3 py-2 text-center text-sm font-medium",
            pathActive(pathname, "/") ? "bg-[#2a1c10] text-[#f4e6c8]" : "bg-[#d9a24e] hover:bg-[#e4b05a]",
          )}
        >
          {t("nav.home")}
        </Link>
        <Link
          to="/history"
          onClick={onPick}
          className={cn(
            "rounded-xl px-3 py-2 text-center text-sm font-medium",
            historyActive(pathname) ? "bg-[#2a1c10] text-[#f4e6c8]" : "bg-[#d9a24e] hover:bg-[#e4b05a]",
          )}
        >
          {t("nav.history")}
        </Link>
        <Link
          to="/news"
          onClick={onPick}
          className={cn(
            "rounded-xl px-3 py-2 text-center text-sm font-medium",
            pathActive(pathname, "/news") ? "bg-[#2a1c10] text-[#f4e6c8]" : "bg-[#d9a24e] hover:bg-[#e4b05a]",
          )}
        >
          {t("nav.news")}
        </Link>
      </div>
      {menus.map((menu) => (
        <div key={menu.key}>
          <p className="px-1 pb-1 text-[11px] tracking-[0.16em] text-[#5c4630] uppercase">{t(menu.key)}</p>
          <div className="grid grid-cols-1 gap-1">
            {menu.items.map((link) =>
              link.href ? (
                <a
                  key={itemKey(link)}
                  href={link.href}
                  onClick={onPick}
                  className="rounded-xl bg-[#d9a24e] px-3 py-2 hover:bg-[#e4b05a]"
                >
                  <span className="block text-base font-medium leading-tight">{t(link.key)}</span>
                  <span className="mt-0.5 block text-sm leading-snug opacity-75">{t(link.hint)}</span>
                </a>
              ) : (
                <Link
                  key={itemKey(link)}
                  to={link.to}
                  hash={link.hash ?? ""}
                  onClick={onPick}
                  className={cn(
                    "rounded-xl px-3 py-2",
                    pathActive(pathname, link.to, link.hash, hash, link.exact)
                      ? "bg-[#2a1c10] text-[#f4e6c8]"
                      : "bg-[#d9a24e] hover:bg-[#e4b05a]",
                  )}
                >
                  <span className="block text-base font-medium leading-tight">{t(link.key)}</span>
                  <span className="mt-0.5 block text-sm leading-snug opacity-75">{t(link.hint)}</span>
                </Link>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AuthSlot({
  className,
  sheet,
  onPick,
}: {
  className?: string;
  sheet?: boolean;
  onPick?: () => void;
}) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      const node = event.target as Node;
      if (btn.current?.contains(node) || menu.current?.contains(node)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isPending) return <div className={cn("h-11 w-24 animate-pulse rounded-md bg-black/10", className)} />;
  if (!user) {
    return (
      <Button asChild className={cn("h-11", sheet && "w-full justify-center", className)}>
        <Link to="/login" onClick={onPick}>
          {t("nav.login")}
        </Link>
      </Button>
    );
  }

  const items = (
    <>
      <Link
        to="/studio"
        onClick={() => {
          setOpen(false);
          onPick?.();
        }}
        className="flex h-12 items-center rounded-lg px-3 text-base text-fg hover:bg-raised"
      >
        {t("nav.hubProfile")}
      </Link>
      <Link
        to="/studio"
        search={{ tab: "alerts" }}
        onClick={() => {
          setOpen(false);
          onPick?.();
        }}
        className="flex h-12 items-center rounded-lg px-3 text-base text-fg hover:bg-raised"
      >
        {t("nav.myAlerts")}
      </Link>
      <button
        type="button"
        className="flex h-12 w-full items-center rounded-lg px-3 text-left text-base text-fg hover:bg-raised"
        onClick={() => {
          setOpen(false);
          onPick?.();
          void signOut("/");
        }}
      >
        {t("nav.logout")}
      </button>
    </>
  );

  if (sheet) {
    return (
      <div className="rounded-xl bg-raised/70 p-1">
        <p className="px-3 pt-2 text-[11px] tracking-[0.16em] text-faint uppercase">{t("nav.desk")}</p>
        {items}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <button
        ref={btn}
        type="button"
        onClick={() => {
          const rect = btn.current?.getBoundingClientRect();
          if (rect) {
            setPos({
              top: rect.bottom + 8,
              right: Math.max(8, window.innerWidth - rect.right),
            });
          }
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-9 items-center gap-0.5 rounded-md border border-black/20 bg-black/10 px-2 text-xs font-semibold text-inherit hover:bg-black/15 sm:h-11 sm:gap-1 sm:px-3 sm:text-sm"
      >
        {t("nav.desk")}
        <ChevronDown className={cn("size-4 shrink-0", open && "rotate-180")} />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menu}
              role="menu"
              style={{ top: pos.top, right: pos.right }}
              className="fixed z-[400] min-w-[15rem] rounded-xl border border-border bg-surface p-1.5 text-fg shadow-border"
            >
              {items}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
