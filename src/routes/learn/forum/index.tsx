import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { LearnJump } from "@/components/learn-jump";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addForumTopic, listForumTopics } from "@/lib/forum-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatConcertWhen } from "@/lib/utils";

export const Route = createFileRoute("/learn/forum/")({
  loader: async () => ({ topics: await listForumTopics() }),
  component: ForumPage,
});

function ForumPage() {
  const { topics } = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await addForumTopic({ data: { title, body } });
      await router.navigate({ to: "/learn/forum/$slug", params: { slug: result.slug } });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <LearnJump />
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Learn</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Forum</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Ask about pompe, camps, charts, where to sit in. Anyone can read.
        To start a topic or reply, join the hub.
      </p>

      <ul className="mt-10 divide-y divide-border rounded-2xl bg-surface shadow-border">
        {topics.length === 0 ? (
          <li className="px-5 py-6 text-sm text-muted">No questions yet. Be the first.</li>
        ) : (
          topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                to="/learn/forum/$slug"
                params={{ slug: topic.slug }}
                className="block px-5 py-4 hover:bg-raised"
              >
                <p className="font-display text-xl font-semibold leading-tight">{topic.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {topic.authorName} · {formatConcertWhen(topic.createdAt)} · {topic.replies}{" "}
                  {topic.replies === 1 ? "reply" : "replies"}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>

      {isPending ? (
        <div className="mt-10 h-40 animate-pulse rounded-2xl bg-surface" />
      ) : !user ? (
        <div className="mt-10 rounded-2xl bg-surface p-6 shadow-border">
          <p className="text-sm text-muted">Log in to start a topic.</p>
          <Button asChild className="mt-4">
            <Link to="/join">Join the hub</Link>
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(event) => void onSubmit(event)}
          className="mt-10 space-y-4 rounded-2xl bg-surface p-6 shadow-border"
        >
          <h2 className="font-display text-2xl font-semibold">New question</h2>
          <Input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title — e.g. Rest-stroke at speed"
          />
          <Textarea
            required
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="The question itself…"
          />
          {status ? <p className="text-sm text-danger">{status}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "Posting…" : "Post topic"}
          </Button>
        </form>
      )}
    </main>
  );
}
