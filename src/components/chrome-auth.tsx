import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Header + footer auth chrome. Never renders Log in while a session exists or is still loading. */
export function ChromeAuth({
  className,
  sheet,
  tone = "header",
  onPick,
}: {
  className?: string;
  sheet?: boolean;
  tone?: "header" | "wood";
  onPick?: () => void;
}) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0, bottom: 0, up: false });
  const wood = tone === "wood";

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

  if (isPending) {
    return (
      <div
        className={cn(
          "h-11 w-24 animate-pulse rounded-md bg-black/10",
          wood && "h-11 w-24 bg-[#2a1c10]/20 sm:h-12",
          className,
        )}
      />
    );
  }
  if (!user) {
    return (
      <Button
        asChild
        className={cn(
          "h-9 px-2.5 text-xs sm:h-11 sm:px-4 sm:text-sm",
          sheet && "w-full justify-center",
          wood &&
            "h-11 bg-[#2a1c10] px-3 text-sm text-[#efe3b6] hover:opacity-90 sm:h-12 sm:px-8 sm:text-base",
          className,
        )}
      >
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
        to="/studio/owner"
        onClick={() => {
          setOpen(false);
          onPick?.();
        }}
        className="flex h-12 items-center rounded-lg px-3 text-base text-fg hover:bg-raised"
      >
        Owner desk
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
              bottom: Math.max(8, window.innerHeight - rect.top + 8),
              up: wood,
            });
          }
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex h-9 items-center gap-0.5 rounded-md border border-black/20 bg-black/10 px-2 text-xs font-semibold text-inherit hover:bg-black/15 sm:h-11 sm:gap-1 sm:px-3 sm:text-sm",
          wood &&
            "h-11 border-transparent bg-[#2a1c10] px-3 text-sm text-[#efe3b6] hover:opacity-90 sm:h-12 sm:px-8 sm:text-base",
        )}
      >
        {t("nav.desk")}
        <ChevronDown className={cn("size-4 shrink-0", open && "rotate-180")} />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menu}
              role="menu"
              style={
                pos.up
                  ? { bottom: pos.bottom, right: pos.right }
                  : { top: pos.top, right: pos.right }
              }
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
