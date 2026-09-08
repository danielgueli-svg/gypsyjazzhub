import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { INSTRUMENTS, luthierCraftForInstrument } from "@/lib/instruments";
import { instrumentChrome, instrumentCopy } from "@/lib/instruments-copy";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function InstrumentPicker() {
  const { locale, t } = useI18n();
  const chrome = instrumentChrome(locale);

  return (
    <details className="group mt-8 rounded-xl bg-surface shadow-border">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-[11px] tracking-[0.16em] text-faint uppercase">
            {t("learn.byInstrument")}
          </span>
          <span className="mt-1 block font-display text-xl font-semibold leading-tight">
            {t("learn.choose")}
          </span>
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-faint transition-transform duration-150 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul className="divide-y divide-border border-t border-border">
        {INSTRUMENTS.map((inst) => {
          const copy = instrumentCopy(inst.slug, locale);
          const craft = luthierCraftForInstrument(inst.slug);
          return (
            <li key={inst.slug}>
              <Link
                to="/learn/instruments/$slug"
                params={{ slug: inst.slug }}
                className="flex min-h-11 items-baseline justify-between gap-4 px-4 py-3 hover:bg-raised"
              >
                <span className="font-display text-lg font-semibold leading-tight">{copy.name}</span>
                <span className="shrink-0 text-[11px] tracking-[0.14em] text-faint uppercase">
                  {copy.role}
                </span>
              </Link>
              {craft ? (
                <Link
                  to="/learn/instruments/$slug"
                  params={{ slug: inst.slug }}
                  hash="luthiers"
                  className="flex min-h-11 items-center px-4 pb-3 pl-8 text-sm text-muted hover:bg-raised hover:text-fg"
                >
                  {chrome.luthiers}
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export function InstrumentCards({ compact = false }: { compact?: boolean }) {
  const { locale } = useI18n();

  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {INSTRUMENTS.map((inst) => {
        const copy = instrumentCopy(inst.slug, locale);
        return (
          <li key={inst.slug}>
            <Link
              to="/learn/instruments/$slug"
              params={{ slug: inst.slug }}
              className={cn(
                "block h-full rounded-2xl bg-surface shadow-border transition-[background-color] duration-150 hover:bg-raised",
                compact ? "px-4 py-4" : "p-6",
              )}
            >
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{copy.role}</p>
              <p
                className={cn(
                  "mt-1.5 font-display font-semibold leading-tight",
                  compact ? "text-2xl" : "text-3xl",
                )}
              >
                {copy.name}
              </p>
              {compact ? null : (
                <p className="mt-2 text-sm leading-relaxed text-muted">{copy.blurb}</p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
