import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
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
      {open ? (
        <div
          className={cn(
            "absolute z-[120] w-56 rounded-xl bg-surface p-2 shadow-border",
            onDark ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2",
          )}
        >
          <p className="px-2 py-1.5 text-[11px] tracking-[0.16em] text-faint uppercase">
            {t("lang.label")}
          </p>
          <div className="max-h-80 overflow-y-auto">
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
          </div>
        </div>
      ) : null}
    </div>
  );
}