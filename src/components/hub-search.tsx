import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function HubSearch({ compact, tone }: { compact?: boolean; tone?: "wood" }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const wood = tone === "wood";

  return (
    <form
      className={cn("relative", compact ? "w-44 xl:w-56" : "w-full")}
      onSubmit={(event) => {
        event.preventDefault();
        const next = q.trim();
        if (next.length < 2) {
          void navigate({ to: "/search" });
          return;
        }
        void navigate({ to: "/search", search: { q: next } });
      }}
    >
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2",
          wood ? "text-[#2a1c10]/50" : "text-faint",
        )}
      />
      <input
        type="search"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder={t("search.placeholder")}
        aria-label={t("nav.search")}
        className={cn(
          "w-full rounded-md border pl-8 outline-none",
          compact ? "h-9 pr-2 text-xs" : "h-11 pr-3 text-sm",
          wood
            ? "border-black/15 bg-[#f3e6cf] text-[#2a1c10] placeholder:text-[#2a1c10]/45 focus:border-[#2a1c10]/40"
            : "border-border bg-raised/70 text-fg placeholder:text-faint focus:border-accent",
        )}
        suppressHydrationWarning
      />
    </form>
  );
}
