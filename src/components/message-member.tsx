import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/lib/api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function MessageMember({
  toUserId,
  name,
  compact,
}: {
  toUserId: string;
  name: string;
  compact?: boolean;
}) {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(!compact);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return compact ? null : <div className="mt-8 h-32 animate-pulse rounded-2xl bg-surface" />;
  }
  if (!user) {
    if (compact) {
      return (
        <Link to="/join" className="mt-3 inline-block text-sm text-muted hover:text-fg">
          Log in to message
        </Link>
      );
    }
    return (
      <section className="mt-10 max-w-xl rounded-2xl bg-surface p-6 shadow-border">
        <h2 className="font-display text-2xl font-semibold">Private message</h2>
        <p className="mt-2 text-sm text-muted">
          {name} has joined the hub. Sign in to send a private note — a lesson,
          a booking, a jam.
        </p>
        <Button asChild className="mt-4">
          <Link to="/join">Log in</Link>
        </Button>
      </section>
    );
  }
  if (user.id === toUserId) return null;

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setOpen(true)}>
        Private message
      </Button>
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await sendMessage({ data: { toUserId, body } });
      setBody("");
      setStatus("Sent. They will see it in Hub Profile → Inbox.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10 max-w-xl rounded-2xl bg-surface p-6 shadow-border">
      <h2 className="font-display text-2xl font-semibold">Private message</h2>
      <p className="mt-2 text-sm text-muted">
        Instant note to {name}. Only the two of you see it.
      </p>
      <form onSubmit={(event) => void onSubmit(event)} className="mt-4 space-y-3">
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Ask for a lesson, a date, a jam…"
        />
        {status ? <p className="text-sm text-muted">{status}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send"}
        </Button>
      </form>
    </section>
  );
}
