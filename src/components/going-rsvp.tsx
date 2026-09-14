import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { NameWithJoin } from "@/components/joined-mark";
import { Button } from "@/components/ui/button";
import { setPendingRsvp, setReturnTo, peekPendingRsvp, takePendingRsvp } from "@/lib/auth/return-to";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { nightKey } from "@/lib/jam-going";
import { listRsvps, toggleRsvp, type RsvpKind, type RsvpPerson } from "@/lib/rsvp";
import { getSubscriptionState, toggleSubscription } from "@/lib/subscriptions";

export function GoingRsvp({
  kind,
  targetId,
  returnTo,
  night,
  jamName,
}: {
  kind: RsvpKind;
  targetId: string;
  returnTo: string;
  night?: string;
  jamName?: string;
}) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [people, setPeople] = useState<RsvpPerson[]>([]);
  const [mine, setMine] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [remindOn, setRemindOn] = useState(false);
  const [remindReady, setRemindReady] = useState(kind !== "jam");
  const [remindBusy, setRemindBusy] = useState(false);
  const nightStamp = nightKey(night ?? "");
  const canGo = kind !== "jam" || Boolean(nightStamp);

  async function load() {
    const list = canGo
      ? await listRsvps({ data: { kind, targetId, night: nightStamp || undefined } })
      : [];
    setPeople(list);
    setMine(Boolean(user && list.some((row) => row.userId === user.id)));
    setReady(true);
  }

  useEffect(() => {
    void load().catch(() => {
      setPeople([]);
      setMine(false);
      setReady(true);
    });
  }, [kind, targetId, nightStamp, user?.id, canGo]);

  useEffect(() => {
    if (kind !== "jam") return;
    if (!user) {
      setRemindOn(false);
      setRemindReady(true);
      return;
    }
    void getSubscriptionState({ data: { kind: "jam", targetId } })
      .then(setRemindOn)
      .catch(() => setRemindOn(false))
      .finally(() => setRemindReady(true));
  }, [kind, targetId, user?.id]);

  useEffect(() => {
    if (!user || isPending || !ready || !canGo) return;
    const pending = peekPendingRsvp();
    if (!pending || pending.kind !== kind || pending.targetId !== targetId) return;
    if (kind === "jam" && (pending.night ?? "") !== nightStamp) return;
    takePendingRsvp();
    if (mine) return;
    setBusy(true);
    void toggleRsvp({ data: { kind, targetId, going: true, night: nightStamp || undefined } })
      .then((res) => {
        setPeople(res.people);
        setMine(res.going);
      })
      .catch(() => undefined)
      .finally(() => setBusy(false));
  }, [user, isPending, ready, kind, targetId, nightStamp, mine, canGo]);

  const count = people.length;

  function goLogin(intent: "going" | "remind") {
    setReturnTo(returnTo);
    if (intent === "going") setPendingRsvp(kind, targetId, nightStamp || undefined);
  }

  function toggleGoing() {
    setBusy(true);
    void toggleRsvp({ data: { kind, targetId, going: !mine, night: nightStamp || undefined } })
      .then((res) => {
        setPeople(res.people);
        setMine(res.going);
      })
      .catch(() => undefined)
      .finally(() => setBusy(false));
  }

  function toggleRemind() {
    setRemindBusy(true);
    void toggleSubscription({ data: { kind: "jam", targetId, targetName: jamName } })
      .then((res) => setRemindOn(res.subscribed))
      .catch(() => undefined)
      .finally(() => setRemindBusy(false));
  }

  return (
    <div className="mt-4 space-y-5">
      <div>
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
          {kind === "jam" ? t("jam.goingKicker") : t("jam.going")}
        </p>
        {!canGo ? (
          <p className="mt-1 text-sm text-muted">{t("jam.goingNoNight")}</p>
        ) : count === 0 ? (
          <p className="mt-1 text-sm text-muted">{t("jam.goingEmpty")}</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-fg">{t("jam.goingCount").replace("{n}", String(count))}</p>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {people.slice(0, 16).map((person) => (
                <li key={person.userId} className="text-sm text-muted">
                  <NameWithJoin name={person.name} joined />
                </li>
              ))}
            </ul>
          </>
        )}
        {kind === "jam" ? <p className="mt-2 text-xs text-muted">{t("jam.goingLead")}</p> : null}
        {canGo ? (
          <div className="mt-3">
            {isPending || !ready ? (
              <div className="h-11 w-28 animate-pulse rounded-md bg-raised" />
            ) : !user ? (
              <Button asChild size="sm">
                <Link to="/login" search={{ next: returnTo }} onClick={() => goLogin("going")}>
                  {t("jam.going")}
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant={mine ? "outline" : "default"}
                disabled={busy}
                onClick={toggleGoing}
              >
                {mine ? t("jam.goingNot") : t("jam.going")}
              </Button>
            )}
            {!user && !isPending && ready ? (
              <p className="mt-2 text-xs text-muted">{t("jam.goingSignin")}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {kind === "jam" ? (
        <div>
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("jam.remind")}</p>
          <p className="mt-1 text-sm text-muted">{t("jam.remindLead")}</p>
          <div className="mt-3">
            {isPending || !remindReady ? (
              <div className="h-11 w-44 animate-pulse rounded-md bg-raised" />
            ) : !user ? (
              <>
                <Button asChild size="sm" variant="outline" className="gap-1.5">
                  <Link to="/login" search={{ next: returnTo }} onClick={() => goLogin("remind")}>
                    <Bell className="size-4" />
                    {t("jam.remind")}
                  </Link>
                </Button>
                <p className="mt-2 text-xs text-muted">{t("jam.remindSignin")}</p>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                variant={remindOn ? "outline" : "default"}
                className="gap-1.5"
                disabled={remindBusy}
                onClick={toggleRemind}
              >
                <Bell className="size-4" />
                {remindOn ? t("jam.remindOn") : t("jam.remind")}
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
