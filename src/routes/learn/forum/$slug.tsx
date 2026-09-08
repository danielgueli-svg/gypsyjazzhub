import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addForumPost, getForumTopic } from "@/lib/forum-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatConcertWhen } from "@/lib/utils";

export const Route = createFileRoute("/learn/forum/$slug")({
  loader: async ({ params }) => {
    const topic = await getForumTopic({ data: params.slug });
    if (!topic) throw notFound();
    return { topic };
  },
  component: ForumTopicPage,
});

function ForumTopicPage() {
  const { topic } = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await addForumPost({ data: { slug: topic.slug, body } });
      setBody("");
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not reply.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Link to="/learn/forum" className="text-sm text-muted hover:text-fg">
        ← Forum
      </Link>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">{topic.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {topic.authorName} · {formatConcertWhen(topic.createdAt)}
      </p>
      <article className="mt-8 whitespace-pre-wrap rounded-2xl bg-surface p-6 text-base leading-relaxed text-muted shadow-border">
        {topic.body}
      </article>

      <ul className="mt-8 space-y-4">
        {topic.posts.map((post) => (
          <li key={post.id} className="rounded-2xl bg-surface p-5 shadow-border">
            <p className="text-sm text-faint">
              {post.authorName} · {formatConcertWhen(post.createdAt)}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {post.body}
            </p>
          </li>
        ))}
      </ul>

      {isPending ? null : !user ? (
        <div className="mt-10 rounded-2xl bg-surface p-6 shadow-border">
          <p className="text-sm text-muted">Log in to reply.</p>
          <Button asChild className="mt-4">
            <Link to="/join">Join the hub</Link>
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(event) => void onSubmit(event)}
          className="mt-10 space-y-3 rounded-2xl bg-surface p-6 shadow-border"
        >
          <h2 className="font-display text-2xl font-semibold">Reply</h2>
          <Textarea
            required
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Your answer…"
          />
          {status ? <p className="text-sm text-danger">{status}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "Posting…" : "Post reply"}
          </Button>
        </form>
      )}
    </main>
  );
}
