import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NameWithJoin } from "@/components/joined-mark";
import { Button } from "@/components/ui/button";
import { setPendingRsvp, setReturnTo, peekPendingRsvp, takePendingRsvp } from "@/lib/auth/return-to";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listRsvps, toggleRsvp, type RsvpKind, type RsvpPerson } from "@/lib/rsvp";

export function GoingRsvp({
  kind,
  targetId,
  returnTo,
}: {
  kind: RsvpKind;
  targetId: string;
  returnTo: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const [people, setPeople] = useState<RsvpPerson[]>([]);
  const [mine, setMine] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    const list = await listRsvps({ data: { kind, targetId } });
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
  }, [kind, targetId, user?.id]);

  useEffect(() => {
    if (!user || isPending || !ready) return;
    const pending = peekPendingRsvp();
    if (!pending || pending.kind !== kind || pending.targetId !== targetId) return;
    takePendingRsvp();
    if (mine) return;
    setBusy(true);
    void toggleRsvp({ data: { kind, targetId, going: true } })
      .then((res) => {
        setPeople(res.people);
        setMine(res.going);
      })
      .catch(() => undefined)
      .finally(() => setBusy(false));
  }, [user, isPending, ready, kind, targetId, mine]);

  const count = people.length;

  return (
    <div className="mt-4">
      <p className="text-[11px] tracking-[0.16em] text-faint uppercase">I'm going</p>
      {count === 0 ? (
        <p className="mt-1 text-sm text-muted">Be the first to say you're going.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-fg">
            {count} going
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {people.slice(0, 16).map((person) => (
              <li key={person.userId} className="text-sm text-muted">
                <NameWithJoin name={person.name} joined />
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-3">
        {isPending || !ready ? (
          <div className="h-11 w-28 animate-pulse rounded-md bg-raised" />
        ) : !user ? (
          <Button asChild size="sm">
            <Link
              to="/login"
              search={{ next: returnTo }}
              onClick={() => {
                setReturnTo(returnTo);
                setPendingRsvp(kind, targetId);
              }}
            >
              I'm going
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant={mine ? "outline" : "default"}
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void toggleRsvp({ data: { kind, targetId, going: !mine } })
                .then((res) => {
                  setPeople(res.people);
                  setMine(res.going);
                })
                .catch(() => undefined)
                .finally(() => setBusy(false));
            }}
          >
            {mine ? "Not going" : "I'm going"}
          </Button>
        )}
      </div>
    </div>
  );
}
