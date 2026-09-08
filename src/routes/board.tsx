import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { addBoardPost, listBoard, type BoardKind } from "@/lib/board";
import { useRouter } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { cn, formatConcertWhen } from "@/lib/utils";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/board")({
  head: () => pageHead(SEO.board),
  loader: async () => ({ posts: await listBoard() }),
  component: BoardPage,
});

const KIND_KEYS: { id: BoardKind; labelKey: string }[] = [
  { id: "looking", labelKey: "board.kind.looking" },
  { id: "charts", labelKey: "board.kind.charts" },
  { id: "venue", labelKey: "board.kind.venue" },
  { id: "other", labelKey: "board.kind.other" },
];

function BoardPage() {
  const { posts } = Route.useLoaderData();
  const { t } = useI18n();
  const kinds = KIND_KEYS.map((item) => ({ ...item, label: t(item.labelKey) }));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("board.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("board.title")}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{t("board.lead")}</p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("board.purpose")}</p>
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link to="/learn/forum" className="inline-flex h-11 items-center rounded-md bg-raised px-4 hover:bg-surface">
          {t("board.forum")}
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {posts.length === 0 ? (
          <li className="text-sm text-muted">{t("board.empty")}</li>
        ) : (
          posts.map((post) => (
            <li key={post.id} className="rounded-2xl bg-surface px-5 py-4 shadow-border">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                {kinds.find((k) => k.id === post.kind)?.label} · {post.authorName}
                {post.city ? ` · ${post.city}` : ""}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{post.title}</h2>
              {post.body ? <p className="mt-2 text-sm leading-relaxed text-muted">{post.body}</p> : null}
              <p className="mt-2 text-xs text-faint">{formatConcertWhen(post.createdAt)}</p>
            </li>
          ))
        )}
      </ul>

      <section className="mt-12 rounded-2xl bg-surface p-6 shadow-border">
        <h2 className="font-display text-2xl font-semibold">Pin a note</h2>
        <BoardGate />
      </section>
    </main>
  );
}

function BoardGate() {
  const { user, isPending } = useCurrentUserState();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  if (!ready || isPending) {
    return <div className="mt-4 h-24 animate-pulse rounded-xl bg-raised" />;
  }
  if (!user) {
    return (
      <>
        <p className="mt-2 text-sm text-muted">Sign in to post on the board.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Sign in</Link>
        </Button>
      </>
    );
  }
  return <BoardForm />;
}

function BoardForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [kind, setKind] = useState<BoardKind>("looking");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await addBoardPost({ data: { kind, title, body, city, country } });
      setTitle("");
      setBody("");
      setStatus("Posted.");
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mt-5 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 flex flex-wrap gap-2">
        {KIND_KEYS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setKind(item.id)}
            className={cn(
              "h-11 rounded-md px-4 text-sm",
              kind === item.id ? "bg-accent text-accent-fg" : "bg-raised text-muted",
            )}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>
      <div className="sm:col-span-2 space-y-1.5">
        <Label htmlFor="board-title">Title</Label>
        <Input id="board-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="board-city">City</Label>
        <Input id="board-city" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="board-country">Country</Label>
        <Input id="board-country" value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>
      <div className="sm:col-span-2 space-y-1.5">
        <Label htmlFor="board-body">Note</Label>
        <Textarea id="board-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Posting…" : "Post"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}
