import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { pathAfterLogin } from "@/lib/auth/after-login";
import { takeReturnTo } from "@/lib/auth/return-to";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
});

function Welcome() {
  const { user, isPending } = useCurrentUserState();
  const [to, setTo] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setTo("/login");
      return;
    }
    const back = takeReturnTo();
    if (back) {
      window.location.assign(back);
      return;
    }
    void pathAfterLogin().then(setTo);
  }, [user, isPending]);

  if (!to) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16">
        <div className="h-12 w-48 animate-pulse rounded-md bg-raised" />
      </main>
    );
  }
  if (to === "/studio" || to === "/add" || to === "/" || to === "/login") {
    return <Navigate to={to} />;
  }
  window.location.assign(to);
  return null;
}
