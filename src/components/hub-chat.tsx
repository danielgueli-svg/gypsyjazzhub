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
import { useI18n } from "@/lib/i18n";
import { formatConcertWhen } from "@/lib/utils";

function stampNight(night: string, body: string, locale: string) {
  const text = body.trim();
  if (!night) return text;
  const [y, m, d] = night.split("-").map(Number);
  if (!y || !m || !d) return text;
  const label = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `On ${label}: ${text}`;
}

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
  const { t, locale } = useI18n();
  const router = useRouter();
  const isJam = kind === "jam";
  const [messages, setMessages] = useState(initial);
  const [chatName, setChatName] = useState("");
  const [body, setBody] = useState("");
  const [night, setNight] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [openNote, setOpenNote] = useState(isJam);

  useEffect(() => {
    setMessages(initial);
  }, [initial]);

  useEffect(() => {
    if (!user) return;
    void getMyChatName()
      .then(setChatName)
      .catch(() => setChatName(user.displayName ?? ""));
  }, [user?.id, user?.displayName]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const stamped = isJam ? stampNight(night, body, locale) : body.trim();
      await addHubChat({ data: { kind, slug, body: stamped, chatName } });
      setBody("");
      setNight("");
      const next = await listHubChat({ data: { kind, slug } });
      setMessages(next);
      setOpenNote(isJam);
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setBusy(false);
    }
  }

  const listed = isJam ? [...messages].reverse() : messages;
  const loginSearch = { next: isJam ? `/jams/${slug}#notes` : undefined };

  const form = user ? (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="mt-6 space-y-4 rounded-2xl bg-surface p-5 shadow-border"
    >
      <div className="space-y-1.5">
        <Label htmlFor={`chat-name-${slug}`}>{t("jam.noteName")}</Label>
        <Input
          id={`chat-name-${slug}`}
          required
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder={t("jam.noteNameHint")}
        />
      </div>
      {isJam ? (
        <div className="space-y-1.5">
          <Label htmlFor={`chat-night-${slug}`}>{t("jam.noteNight")}</Label>
          <Input
            id={`chat-night-${slug}`}
            type="date"
            value={night}
            onChange={(e) => setNight(e.target.value)}
          />
          <p className="text-xs text-muted">{t("jam.noteNightHint")}</p>
        </div>
      ) : null}
      <div className="space-y-1.5">
        <Label htmlFor={`chat-body-${slug}`}>{isJam ? t("jam.noteBody") : "Comment"}</Label>
        <Textarea
          id={`chat-body-${slug}`}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={isJam ? t("jam.notePlaceholder") : "I'm going. Who is sitting in?"}
        />
      </div>
      {status ? <p className="text-sm text-danger">{status}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? t("jam.notePosting") : isJam ? t("jam.notePost") : "Post to Hub Chat"}
      </Button>
    </form>
  ) : null;

  if (!isJam && messages.length === 0) {
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
    <section id={isJam ? "notes" : "chat"} className="mt-12 scroll-mt-40">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Gypsy Jazz Hub</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">
        {isJam ? t("jam.noteTitle") : "Hub Chat"}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {isJam ? t("jam.noteLead") : "Who is going, who is sitting in, what you heard — comments from people on the hub."}
      </p>

      {listed.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {listed.map((message) => (
            <li key={message.id} className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="font-display text-lg font-semibold">{message.chatName}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted whitespace-pre-wrap">{message.body}</p>
              <p className="mt-3 text-[11px] tracking-[0.16em] text-faint uppercase">
                {formatConcertWhen(message.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      ) : isJam ? (
        <p className="mt-5 text-sm text-muted">{t("jam.noteEmpty")}</p>
      ) : null}

      {isPending ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-surface" />
      ) : !user ? (
        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-sm text-muted">{isJam ? t("jam.noteSignin") : "Sign in to comment in Hub Chat."}</p>
          <Button asChild className="mt-4">
            <Link to="/login" search={loginSearch}>
              {t("login.submitIn")}
            </Link>
          </Button>
        </div>
      ) : (
        form
      )}
    </section>
  );
}
