import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";

export function SignInGate({
  children,
  lead,
  cta,
}: {
  children: ReactNode;
  lead?: string;
  cta?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  if (isPending) {
    return <div className="mt-4 h-24 animate-pulse rounded-xl bg-raised" />;
  }
  if (!user) {
    return (
      <div className="mt-4">
        <p className="text-sm leading-relaxed text-muted">{lead ?? t("contribute.signInLead")}</p>
        <Button asChild className="mt-4">
          <Link to="/login">{cta ?? t("contribute.signInCta")}</Link>
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}
