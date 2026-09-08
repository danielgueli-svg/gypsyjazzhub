import { createFileRoute, Link } from "@tanstack/react-router";
import { LearnJump } from "@/components/learn-jump";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Button } from "@/components/ui/button";
import { APPS } from "@/lib/scene-guide";

export const Route = createFileRoute("/learn/apps")({
  component: AppsPage,
});

function AppsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <LearnJump />
      <Link to="/learn" className="text-sm text-muted hover:text-fg">
        ← Learn gypsy jazz
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">Practice</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Apps</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Two rooms in the phone: iReal Pro for charts and a band, La Pompe Live
        for Christiaan van Hemert’s tracks. Download, then watch his tutorial
        if you are new to La Pompe.
      </p>

      <div className="mt-10 space-y-16">
        {APPS.map((app) => (
          <article key={app.slug}>
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
              {app.maker}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">{app.name}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{app.bio}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {app.site ? (
                <Button asChild>
                  <a href={app.site} target="_blank" rel="noreferrer">
                    Website
                  </a>
                </Button>
              ) : null}
              {app.ios ? (
                <Button asChild variant="outline">
                  <a href={app.ios} target="_blank" rel="noreferrer">
                    iPhone
                  </a>
                </Button>
              ) : null}
              {app.android ? (
                <Button asChild variant="outline">
                  <a href={app.android} target="_blank" rel="noreferrer">
                    Android
                  </a>
                </Button>
              ) : null}
              {app.makerSlug ? (
                <Button asChild variant="outline">
                  <Link to="/musicians/$slug" params={{ slug: app.makerSlug }}>
                    {app.maker}
                  </Link>
                </Button>
              ) : null}
            </div>
            {app.youtube ? (
              <div className="mt-8 max-w-2xl">
                <YouTubeEmbed url={app.youtube.url} title={app.youtube.title} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
