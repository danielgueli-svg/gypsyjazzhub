import { Facebook, Instagram, Share2 } from "lucide-react";
import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SITE = "https://www.gypsyjazzhub.com";

function resolveUrl(url?: string) {
  if (url) {
    if (url.startsWith("http")) return url;
    return `${SITE}${url.startsWith("/") ? url : `/${url}`}`;
  }
  if (typeof window === "undefined") return SITE;
  return window.location.href;
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.16 2c.7 0 4.3.14 6.05 3.28.7 1.25.54 3.4.4 4.78.3.1.7.1 1.02.05.4-.07.78-.3 1.06-.3.5 0 .86.34.86.67 0 .7-1.18 1.3-1.55 1.48-.1.05-.13.1-.1.2.4 1.3 2.3 2.3 2.58 2.52.16.13.22.25.22.4 0 .3-.28.56-.74.7-2.3.7-3.1 2.36-3.3 2.9-.2.5-.35.86-.92.86-.4 0-.86-.2-1.5-.4-.7-.23-1.4-.34-2.16-.34s-1.46.11-2.16.34c-.64.2-1.1.4-1.5.4-.57 0-.72-.36-.92-.86-.2-.54-1-2.2-3.3-2.9-.46-.14-.74-.4-.74-.7 0-.15.06-.27.22-.4.28-.22 2.18-1.22 2.58-2.52.03-.1 0-.15-.1-.2-.37-.18-1.55-.78-1.55-1.48 0-.33.36-.67.86-.67.28 0 .66.23 1.06.3.32.05.72.05 1.02-.05-.14-1.38-.3-3.53.4-4.78C7.86 2.14 11.46 2 12.16 2z" />
    </svg>
  );
}

function clip(text: string, url: string) {
  const trimmed = text.trim();
  if (!trimmed) return url;
  return trimmed.includes(url) ? trimmed : `${trimmed}\n\n${url}`;
}

export function ShareBox({
  url,
  text = "",
  title,
  lead,
  compact = false,
  onDark = false,
  className,
}: {
  url?: string;
  text?: string;
  title?: string;
  lead?: string;
  compact?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [note, setNote] = useState("");
  const href = resolveUrl(url);
  const payload = clip(text, href);

  async function copyText(message: string) {
    try {
      await navigator.clipboard.writeText(payload);
      setNote(message);
      window.setTimeout(() => setNote(""), 4000);
    } catch {
      setNote(href);
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: title ?? "Gypsy Jazz Hub",
          text: text.trim() || title || "Gypsy Jazz Hub",
          url: href,
        });
        return;
      } catch {
        /* cancelled */
      }
    }
    await copyText(t("share.copiedText"));
  }

  function facebook() {
    const share = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href)}&quote=${encodeURIComponent(payload)}`;
    window.open(share, "share-facebook", "noopener,noreferrer,width=640,height=540");
  }

  async function copyOpen(openUrl: string, message: string, name: string) {
    await copyText(message);
    window.open(openUrl, `share-${name}`, "noopener,noreferrer");
  }

  const btn = onDark
    ? "inline-flex size-10 items-center justify-center gap-1 rounded-md text-white hover:bg-white/10 sm:h-6 sm:w-auto sm:px-1.5 sm:text-[11px] sm:font-medium sm:leading-none"
    : "inline-flex h-10 items-center gap-1 rounded-md bg-raised px-2.5 text-sm font-medium leading-none text-fg hover:bg-surface sm:h-6 sm:rounded-sm sm:px-1.5 sm:text-[11px]";

  const label = "hidden sm:inline";

  const buttons = (
    <div className="flex flex-nowrap items-center gap-0.5 sm:flex-wrap sm:gap-1">
      <button
        type="button"
        onClick={() => void nativeShare()}
        aria-label={t("share.native")}
        className={
          onDark
            ? "inline-flex size-10 items-center justify-center gap-1 rounded-md text-white hover:bg-white/10 sm:h-6 sm:w-auto sm:px-1.5 sm:text-[11px] sm:font-medium sm:leading-none"
            : "inline-flex h-10 items-center gap-1 rounded-md bg-accent px-2.5 text-sm font-medium leading-none text-accent-fg hover:opacity-90 sm:h-6 sm:rounded-sm sm:px-1.5 sm:text-[11px]"
        }
      >
        <Share2 className="size-4 sm:size-2.5" />
        <span className={onDark ? label : undefined}>{t("share.native")}</span>
      </button>
      <button type="button" onClick={facebook} className={cn(btn, "hidden sm:inline-flex")} aria-label={t("share.facebook")}>
        <Facebook className="size-4 sm:size-2.5" />
        <span className={onDark ? label : undefined}>{t("share.facebook")}</span>
      </button>
      <button
        type="button"
        onClick={() => void copyOpen("https://www.instagram.com/", t("share.copiedIg"), "instagram")}
        className={cn(btn, "hidden sm:inline-flex")}
        aria-label={t("share.instagram")}
      >
        <Instagram className="size-4 sm:size-2.5" />
        <span className={onDark ? label : undefined}>{t("share.instagram")}</span>
      </button>
      <button
        type="button"
        onClick={() => void copyOpen("https://www.tiktok.com/", t("share.copiedTiktok"), "tiktok")}
        className={cn(btn, "hidden sm:inline-flex")}
        aria-label={t("share.tiktok")}
      >
        <TikTokIcon className="size-4 sm:size-2.5" />
        <span className={onDark ? label : undefined}>{t("share.tiktok")}</span>
      </button>
      <button
        type="button"
        onClick={() => void copyOpen("https://www.snapchat.com/", t("share.copiedSnap"), "snapchat")}
        className={cn(btn, "hidden sm:inline-flex")}
        aria-label={t("share.snapchat")}
      >
        <SnapchatIcon className="size-4 sm:size-2.5" />
        <span className={onDark ? label : undefined}>{t("share.snapchat")}</span>
      </button>
    </div>
  );

  if (compact) {
    return (
      <div className={cn("flex flex-col gap-2", className)} key={`${pathname}-${href}`}>
        {buttons}
        {note ? <p className={cn("text-xs", onDark ? "text-white/70" : "text-muted")}>{note}</p> : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface p-5 shadow-border sm:p-6">
      <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
        {title ?? t("share.label")}
      </p>
      {lead ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{lead}</p> : null}
      {text ? (
        <textarea
          readOnly
          value={payload}
          rows={Math.min(5, payload.split("\n").length + 1)}
          className="mt-3 max-h-36 w-full resize-none overflow-y-auto rounded-xl bg-raised px-3 py-3 text-sm leading-relaxed text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_14%,transparent)] sm:mt-4 sm:max-h-none"
        />
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-1">
        {text ? (
          <button
            type="button"
            onClick={() => void copyText(t("share.copiedText"))}
            className="inline-flex h-10 items-center rounded-md bg-raised px-3 text-sm font-medium leading-none text-fg hover:bg-surface sm:h-6 sm:rounded-sm sm:px-2 sm:text-[11px]"
          >
            {t("share.copy")}
          </button>
        ) : null}
        {buttons}
      </div>
      {note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
    </div>
  );
}

export function SharePage({ compact = false, onDark = false }: { compact?: boolean; onDark?: boolean }) {
  return (
    <ShareBox
      compact={compact}
      onDark={onDark}
      className={compact ? (onDark ? "items-center" : "items-end") : undefined}
    />
  );
}
