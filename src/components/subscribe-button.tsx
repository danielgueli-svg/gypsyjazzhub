import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  getSubscriptionState,
  toggleSubscription,
  type SubscriptionKind,
} from "@/lib/subscriptions";

export function SubscribeButton({
  kind,
  targetId,
  targetName,
  label,
}: {
  kind: SubscriptionKind;
  targetId: string;
  targetName: string;
  label?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setOn(false);
      setReady(true);
      return;
    }
    void getSubscriptionState({ data: { kind, targetId } })
      .then(setOn)
      .catch(() => setOn(false))
      .finally(() => setReady(true));
  }, [user, kind, targetId]);

  if (isPending || !ready) {
    return <div className="h-11 w-36 animate-pulse rounded-md bg-raised" />;
  }
  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/login">{label ?? "Notify me"}</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={on ? "outline" : "default"}
      size="sm"
      className="gap-1.5"
      onClick={() => {
        void toggleSubscription({ data: { kind, targetId, targetName } })
          .then((res) => setOn(res.subscribed))
          .catch(() => undefined);
      }}
    >
      <Bell className="size-4" />
      {on ? "Alerts on" : (label ?? "Notify me")}
    </Button>
  );
}
