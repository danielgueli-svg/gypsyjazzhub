import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  addHubChat,
  getMyChatName,
  listHubChat,
  type ChatKind,
  type HubChatMessage,
} from "@/lib/hub-api";
import { formatConcertWhen } from "@/lib/utils";

export function HubChat({
  kind,
  slug,
  initial,
}: {
  kind: ChatKind;
  slug: string;
  initial: HubChatMessage[];
}) {
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [chatName, setChatName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  useEffect(() => {
    setMessages(initial);
  }, [initial]);

  useEffect(() => {
    if (!user) return;
    void getMyChatName()
      .then(setChatName)
      .catch(() => setChatName(user.displayName ?? ""));
  }, [user]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await addHubChat({ data: { kind, slug, body, chatName } });
      setBody("");
      const next = await listHubChat({ data: { kind, slug } });
      setMessages(next);
      setOpenNote(false);
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setBusy(false);
    }
  }

  const form = user ? (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="mt-6 space-y-4 rounded-2xl bg-surface p-5 shadow-border"
    >
      <div className="space-y-1.5">
        <Label htmlFor={`chat-name-${slug}`}>Your name</Label>
        <Input
          id={`chat-name-${slug}`}
          required
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder="The name others will see"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`chat-body-${slug}`}>Comment</Label>
        <Textarea
          id={`chat-body-${slug}`}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="I'm going. Who is sitting in?"
        />
      </div>
      {status ? <p className="text-sm text-danger">{status}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Posting…" : "Post to Hub Chat"}
      </Button>
    </form>
  ) : null;

  if (messages.length === 0) {
    return (
      <section id="chat" className="mt-6 scroll-mt-24">
        {isPending ? null : user ? (
          openNote ? (
            form
          ) : (
            <button
              type="button"
              className="text-sm text-muted hover:text-fg hover:underline"
              onClick={() => setOpenNote(true)}
            >
              Leave a note
            </button>
          )
        ) : (
          <Link to="/login" className="text-sm text-muted hover:text-fg hover:underline">
            Leave a note
          </Link>
        )}
      </section>
    );
  }

  return (
    <section id="chat" className="mt-12 scroll-mt-40">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Gypsy Jazz Hub</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">Hub Chat</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Who is going, who is sitting in, what you heard — comments from people
        on the hub.
      </p>

      <ul className="mt-5 space-y-3">
        {messages.map((message) => (
          <li key={message.id} className="rounded-2xl bg-surface p-5 shadow-border">
            <p className="font-display text-lg font-semibold">{message.chatName}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{message.body}</p>
            <p className="mt-3 text-[11px] tracking-[0.16em] text-faint uppercase">
              {formatConcertWhen(message.createdAt)}
            </p>
          </li>
        ))}
      </ul>

      {isPending ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-surface" />
      ) : !user ? (
        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-sm text-muted">Sign in to comment in Hub Chat.</p>
          <Button asChild className="mt-4">
            <Link to="/join">Sign in</Link>
          </Button>
        </div>
      ) : (
        form
      )}
    </section>
  );
}
