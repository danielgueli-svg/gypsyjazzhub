import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { JoinForm } from "@/components/join-form";
import { setReturnTo } from "@/lib/auth/return-to";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { error?: string; next?: string } => {
    const error = typeof search.error === "string" ? search.error : undefined;
    const next = typeof search.next === "string" ? search.next : undefined;
    return { ...(error ? { error } : {}), ...(next ? { next } : {}) };
  },
  component: Login,
});

function Login() {
  const { error, next } = Route.useSearch();
  const { t } = useI18n();

  useEffect(() => {
    if (next) setReturnTo(next);
  }, [next]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-surface p-6 shadow-border sm:p-8">
        <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("join.kicker")}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">{t("login.title")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t("login.lead")}{" "}
          <Link to="/join" className="text-fg hover:underline">
            {t("login.joinLink")}
          </Link>
        </p>
        {error ? <p className="mt-4 text-sm text-danger">{t("login.errorOauth")}</p> : null}
        <div className="mt-8">
          <JoinForm defaultMode="in" />
        </div>
      </div>
    </main>
  );
}
