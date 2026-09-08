import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const LEARN_JUMP = [
  { to: "/learn", key: "learn.overview", hash: "" },
  { to: "/learn", hash: "camps", key: "learn.camps" },
  { to: "/learn", hash: "schools", key: "learn.schools" },
  { to: "/learn/teachers", key: "learn.teachers" },
  { to: "/learn/apps", key: "learn.apps" },
  { to: "/learn/forum", key: "learn.forum" },
  { to: "/learn/instruments", key: "learn.instruments" },
] as const;

export function LearnJump() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mb-6">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-raised px-3.5 text-sm shadow-border hover:bg-surface"
      >
        {t("learn.overview")}
        <ChevronDown className={`size-4 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute z-30 mt-2 w-[min(100%,20rem)] rounded-xl bg-surface p-2 shadow-border">
          {LEARN_JUMP.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              hash={"hash" in item ? item.hash : undefined}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm hover:bg-raised"
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
