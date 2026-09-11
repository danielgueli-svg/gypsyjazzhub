import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Flag } from "@/components/flag";
import { LOCALES, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitch({
  compact = false,
  size,
  onDark = false,
  prominent = false,
}: {
  compact?: boolean;
  size?: "hero";
  onDark?: boolean;
  prominent?: boolean;
}) {
  const { locale, setLocale, t } = useI18n();

  if (size === "hero") {
    return (
      <div role="group" aria-label={t("lang.label")}>
        <p className="font-display text-center text-lg font-semibold tracking-tight sm:text-xl">
          {t("home.chooseLang")}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-0.5">
          {LOCALES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLocale(item.id)}
              aria-pressed={locale === item.id}
              aria-label={item.native}
              title={item.native}
              className={cn(
                "flex flex-col items-center rounded px-1 py-0.5 leading-none",
                locale === item.id
                  ? "bg-accent text-accent-fg"
                  : "text-fg hover:bg-raised",
              )}
            >
              <Flag iso={item.iso} className="h-4 w-6" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (compact) {
    return <LanguageMenu onDark={onDark} prominent={prominent} />;
  }

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className="flex flex-wrap items-center gap-1"
    >
      {LOCALES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setLocale(item.id)}
          aria-pressed={locale === item.id}
          aria-label={item.native}
          title={item.native}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm",
            locale === item.id
              ? "bg-accent text-accent-fg"
              : "text-muted hover:bg-raised hover:text-fg",
          )}
        >
          <Flag iso={item.iso} />
          <span>{item.native}</span>
        </button>
      ))}
    </div>
  );
}

function LanguageMenu({
  onDark = false,
  prominent = false,
}: {
  onDark?: boolean;
  prominent?: boolean;
}) {
  const { locale, setLocale, t } = useI18n();
  const current = LOCALES.find((item) => item.id === locale) ?? LOCALES[0];
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, bottom: 0, up: false, maxHeight: 320, width: 224 });

  function place() {
    const rect = btn.current?.getBoundingClientRect();
    if (!rect) return;
    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(224, vw - margin * 2);
    const spaceBelow = vh - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const up = onDark || (spaceBelow < 220 && spaceAbove > spaceBelow);
    let left = rect.right - width;
    if (left < margin) left = margin;
    if (left + width > vw - margin) left = Math.max(margin, vw - margin - width);
    setPos({
      up,
      left,
      top: rect.bottom + 8,
      bottom: Math.max(margin, vh - rect.top + 8),
      maxHeight: Math.max(160, Math.min(320, up ? spaceAbove : spaceBelow)),
      width,
    });
  }

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      const node = event.target as Node;
      if (btn.current?.contains(node) || menu.current?.contains(node)) return;
      setOpen(false);
    };
    const onMove = () => place();
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [open]);

  return (
    <div className="site-lang relative">
      <button
        ref={btn}
        type="button"
        onClick={() => {
          place();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-label={t("lang.label")}
        title={current.native}
        className={cn(
          "inline-flex items-center justify-center rounded-md",
          prominent
            ? "h-9 gap-1 px-1.5 text-inherit hover:bg-black/10 sm:h-14 sm:gap-1.5 sm:px-2.5"
            : onDark
              ? "size-10 gap-2 px-2 text-white hover:bg-white/10 sm:h-12 sm:w-auto sm:px-3"
              : "size-12 gap-2 px-2 text-inherit hover:bg-black/10 sm:h-12 sm:w-auto sm:px-3",
        )}
      >
        <Flag
          iso={current.iso}
          eager
          className={
            prominent
              ? "h-5 w-7 rounded-sm sm:h-8 sm:w-11"
              : "h-5 w-7 sm:h-6 sm:w-8"
          }
        />
        <ChevronDown
          className={cn(
            prominent ? "size-3.5 opacity-80 sm:size-6" : "hidden size-4 sm:block",
            onDark ? "text-white" : prominent ? "opacity-80" : "opacity-50",
            open && "rotate-180",
          )}
        />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menu}
              style={
                pos.up
                  ? { bottom: pos.bottom, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }
                  : { top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }
              }
              className="site-lang-menu fixed z-[400] overflow-y-auto rounded-xl bg-surface p-2 text-fg shadow-border"
            >
              <p className="px-2 py-1.5 text-[11px] tracking-[0.16em] text-faint uppercase">
                {t("lang.label")}
              </p>
              {LOCALES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setLocale(item.id);
                    setOpen(false);
                  }}
                  aria-pressed={locale === item.id}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left text-sm",
                    locale === item.id
                      ? "bg-accent text-accent-fg"
                      : "text-fg hover:bg-raised",
                  )}
                >
                  <Flag iso={item.iso} className="h-4 w-6" />
                  <span>{item.native}</span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
