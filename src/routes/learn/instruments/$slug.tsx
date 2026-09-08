import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Contribute } from "@/components/contribute";
import { CountryLabel } from "@/components/country-label";
import { LearnJump } from "@/components/learn-jump";
import { MessageMember } from "@/components/message-member";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { BassLuthiersDirectory, SuggestBassLuthier } from "@/components/bass-luthiers";
import { ViolinLuthiersDirectory, SuggestViolinLuthier } from "@/components/violin-luthiers";
import { GuitarLuthiersDirectory } from "@/components/luthier-list";
import { ShopsDirectory } from "@/components/shops-directory";
import {
  appsForInstrument,
  getInstrument,
  isInstrumentSlug,
  luthierCraftForInstrument,
  schoolsForInstrument,
  teacherMatchesInstrument,
  topicsForInstrument,
  INSTRUMENTS,
} from "@/lib/instruments";
import { instrumentChrome, instrumentCopy } from "@/lib/instruments-copy";
import { listForumTopics } from "@/lib/forum-api";
import { listAllHubTeachers, listHubLuthiers } from "@/lib/hub-api";
import { AMP_PRODUCTS } from "@/lib/amplification";
import { contactHref } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/learn/instruments/$slug")({
  loader: async ({ params }) => {
    if (!isInstrumentSlug(params.slug)) throw notFound();
    const inst = getInstrument(params.slug);
    if (!inst) throw notFound();
    const [teachers, topics, extraLuthiers] = await Promise.all([
      listAllHubTeachers(),
      listForumTopics(),
      listHubLuthiers(),
    ]);
    return { inst, teachers, topics, extraLuthiers };
  },
  component: InstrumentPage,
});

function PlayerLink({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: ReactNode;
}) {
  if (slug === "django-reinhardt") {
    return (
      <Link to="/django" className={className}>
        {children}
      </Link>
    );
  }
  if (slug === "stephane-grappelli") {
    return (
      <Link to="/grappelli" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/musicians/$slug" params={{ slug }} className={className}>
      {children}
    </Link>
  );
}

function InstrumentPage() {
  const { inst, teachers, topics, extraLuthiers } = Route.useLoaderData();
  const { locale } = useI18n();
  const copy = instrumentCopy(inst.slug, locale);
  const chrome = instrumentChrome(locale);
  const schools = schoolsForInstrument(inst);
  const apps = appsForInstrument(inst);
  const others = INSTRUMENTS.filter((item) => item.slug !== inst.slug);
  const chairTeachers = teachers.filter((row) =>
    teacherMatchesInstrument(row.instruments, row.note, inst),
  );
  const chairTopics = topicsForInstrument(topics, inst, copy);
  const craft = luthierCraftForInstrument(inst.slug);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <LearnJump />
      <Link to="/learn/instruments" className="text-sm text-muted hover:text-fg">
        ← {chrome.all}
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">{copy.role}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{copy.name}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{copy.intro}</p>

      {inst.videos.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{chrome.videos}</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {inst.videos.map((video) => (
              <article key={video.url}>
                <YouTubeEmbed url={video.url} title={video.title} />
                <p className="mt-3 font-display text-xl font-semibold leading-tight">{video.title}</p>
                <p className="mt-1 text-sm text-muted">{video.by}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {apps.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{chrome.apps}</h2>
          <div className="mt-6 space-y-10">
            {apps.map((app) => (
              <article key={app.slug} className="max-w-2xl">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{app.maker}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">{app.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{app.bio}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {app.site ? (
                    <Button asChild size="sm">
                      <a href={app.site} target="_blank" rel="noreferrer">
                        Website
                      </a>
                    </Button>
                  ) : null}
                  {app.ios ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={app.ios} target="_blank" rel="noreferrer">
                        iPhone
                      </a>
                    </Button>
                  ) : null}
                  {app.android ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={app.android} target="_blank" rel="noreferrer">
                        Android
                      </a>
                    </Button>
                  ) : null}
                  {app.makerSlug ? (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/musicians/$slug" params={{ slug: app.makerSlug }}>
                        {app.maker}
                      </Link>
                    </Button>
                  ) : null}
                </div>
                {app.youtube ? (
                  <div className="mt-5">
                    <YouTubeEmbed url={app.youtube.url} title={app.youtube.title} />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {schools.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{chrome.schools}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {schools.map((school) => (
              <li key={school.name}>
                <a
                  href={school.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
                >
                  <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{school.place}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{school.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{school.bio}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{chrome.schools}</h2>
          <p className="mt-3 text-sm text-faint">{chrome.schoolsEmpty}</p>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{chrome.teachers}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{chrome.teachersLead}</p>
        {chairTeachers.length === 0 ? (
          <p className="mt-5 text-sm text-faint">{chrome.teachersEmpty}</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {chairTeachers.map((teacher) => {
              const href = contactHref(teacher.contact);
              return (
                <li key={teacher.id} className="rounded-2xl bg-surface p-5 shadow-border">
                  {teacher.artistSlug ? (
                    <Link
                      to="/musicians/$slug"
                      params={{ slug: teacher.artistSlug }}
                      className="font-display text-xl font-semibold hover:underline"
                    >
                      {teacher.name}
                    </Link>
                  ) : (
                    <p className="font-display text-xl font-semibold">{teacher.name}</p>
                  )}
                  <p className="mt-1 text-sm text-muted">
                    <CountryLabel name={teacher.countrySlug.replace(/-/g, " ")} />
                    {teacher.region ? ` · ${teacher.region}` : ""}
                    {teacher.city ? ` · ${teacher.city}` : ""}
                    {teacher.instruments ? ` · ${teacher.instruments}` : ""}
                  </p>
                  {teacher.note ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">{teacher.note}</p>
                  ) : null}
                  {href ? (
                    <a href={href} className="mt-3 inline-block text-sm hover:underline">
                      Contact
                    </a>
                  ) : null}
                  {teacher.userId ? (
                    <MessageMember toUserId={teacher.userId} name={teacher.name} compact />
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
        <Contribute heading={chrome.teachersAdd} defaultKind="teacher" />
      </section>

      {craft ? (
        <section id="luthiers" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-3xl font-semibold">{chrome.luthiers}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {craft === "bass"
              ? chrome.luthiersBassLead
              : craft === "violin"
                ? chrome.luthiersViolinLead
                : chrome.luthiersGuitarLead}
          </p>
          <p className="mt-3">
            {craft === "bass" ? (
              <Link to="/luthiers/bass" className="text-sm text-fg hover:underline">
                {chrome.luthiersAll}
              </Link>
            ) : craft === "violin" ? (
              <Link to="/luthiers/violin" className="text-sm text-fg hover:underline">
                {chrome.luthiersAll}
              </Link>
            ) : (
              <Link to="/luthiers" className="text-sm text-fg hover:underline">
                {chrome.luthiersAll}
              </Link>
            )}
          </p>
          <div className="mt-8">
            {craft === "bass" ? (
              <BassLuthiersDirectory extra={extraLuthiers.filter((row) => row.craft === "bass")} />
            ) : craft === "violin" ? (
              <ViolinLuthiersDirectory extra={extraLuthiers.filter((row) => row.craft === "violin")} />
            ) : (
              <GuitarLuthiersDirectory extra={extraLuthiers.filter((row) => row.craft === "guitar")} />
            )}
          </div>
          {craft === "bass" ? (
            <SuggestBassLuthier />
          ) : craft === "violin" ? (
            <SuggestViolinLuthier />
          ) : (
            <Contribute heading="Add a luthier" defaultKind="luthier" />
          )}
        </section>
      ) : inst.slug === "vocals" ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{chrome.mics}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{chrome.micsLead}</p>
          <ul className="mt-5 space-y-3">
            {AMP_PRODUCTS.filter((item) => item.kind === "mic").map((item) => (
              <li key={`${item.maker}-${item.name}`} className="rounded-2xl bg-surface p-5 shadow-border">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                  {item.maker} · {item.for}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
                <a href={item.site} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm hover:underline">
                  Maker website
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section id="luthiers" className="mt-12 scroll-mt-24">
          <h2 className="font-display text-3xl font-semibold">{chrome.makers}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{inst.makersLead || chrome.makersEmpty}</p>
          {inst.makers.length === 0 ? (
            <p className="mt-5 text-sm text-faint">{chrome.makersEmpty}</p>
          ) : (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {inst.makers.map((maker) => (
                <li key={maker.name} className="rounded-2xl bg-surface p-5 shadow-border">
                  <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{maker.craft}</p>
                  {maker.href ? (
                    <a
                      href={maker.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block font-display text-2xl font-semibold hover:underline"
                    >
                      {maker.name}
                    </a>
                  ) : (
                    <p className="mt-1 font-display text-2xl font-semibold">{maker.name}</p>
                  )}
                  <p className="mt-1 text-sm text-muted">
                    {[maker.city, maker.country].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{maker.note}</p>
                </li>
              ))}
            </ul>
          )}
          <Contribute heading="Add a maker or repair shop" defaultKind="luthier" />
        </section>
      )}

      {inst.showShops ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{chrome.shops}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{chrome.shopsLead}</p>
          <p className="mt-3">
            <Link to="/shops" className="text-sm text-fg hover:underline">
              {chrome.shopsAll}
            </Link>
          </p>
          <div className="mt-8">
            <ShopsDirectory />
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{chrome.charts}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{chrome.chartsLead}</p>
        <ul className="mt-5 space-y-3">
          <li className="rounded-2xl bg-surface px-5 py-4 shadow-border">
            <Link to="/learn/charts" className="font-display text-2xl font-semibold hover:underline">
              Charts & backing
            </Link>
            <p className="mt-2 text-sm text-muted">The shared shelf — DjangoBooks, Bertino’s 420, La Pompe Live.</p>
          </li>
          {inst.charts.map((chart) => (
            <li key={chart.href} className="rounded-2xl bg-surface px-5 py-4 shadow-border">
              <a
                href={chart.href}
                target="_blank"
                rel="noreferrer"
                className="font-display text-2xl font-semibold hover:underline"
              >
                {chart.name}
              </a>
              <p className="mt-2 text-sm text-muted">{chart.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{chrome.amp}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{chrome.ampLead}</p>
        <ul className="mt-5 space-y-3">
          {inst.ampNotes.map((note) => (
            <li key={note.title} className="rounded-2xl bg-surface px-5 py-4 shadow-border">
              <p className="font-display text-xl font-semibold">{note.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{note.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link to="/learn/amplification" className="text-sm text-fg hover:underline">
            {chrome.ampOpen}
          </Link>
        </p>
      </section>

      {inst.repertoire?.length ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">{chrome.repertoire}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {inst.repertoire.map((tune) => (
              <li key={tune.title} className="rounded-2xl bg-surface p-5 shadow-border">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{tune.key}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">{tune.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{tune.note}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {chairTopics.length > 0 ? (
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-semibold">{chrome.forum}</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/learn/forum">{chrome.forumOpen}</Link>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted">{chrome.forumLead}</p>
        <ul className="mt-5 divide-y divide-border rounded-2xl bg-surface shadow-border">
            {chairTopics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  to="/learn/forum/$slug"
                  params={{ slug: topic.slug }}
                  className="block px-5 py-4 hover:bg-raised"
                >
                  <p className="font-display text-xl font-semibold leading-tight">{topic.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {topic.authorName} · {topic.replies} {topic.replies === 1 ? "reply" : "replies"}
                  </p>
                </Link>
              </li>
            ))}
        </ul>
      </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{chrome.language}</h2>
        <div className="mt-6 space-y-8">
          {copy.techniques.map((item) => (
            <article key={item.title} className="max-w-2xl">
              <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{chrome.start}</h2>
        <ul className="mt-5 max-w-2xl space-y-3">
          {copy.tips.map((line) => (
            <li key={line} className="rounded-2xl bg-surface px-5 py-4 text-sm leading-relaxed shadow-border">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{chrome.listen}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {inst.players.map((player) => (
            <li key={player.slug}>
              <PlayerLink
                slug={player.slug}
                className="block rounded-2xl bg-surface p-5 shadow-border transition-[background-color] duration-150 hover:bg-raised"
              >
                <p className="font-display text-2xl font-semibold leading-tight">{player.name}</p>
                <p className="mt-1 text-sm text-muted">{player.note}</p>
              </PlayerLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{chrome.shelf}</h2>
        <ul className="mt-5 space-y-3">
          {inst.resources.map((row) => (
            <li key={row.label} className="rounded-2xl bg-surface px-5 py-4 shadow-border">
              {row.to ? (
                <Link to={row.to} className="font-display text-2xl font-semibold hover:underline">
                  {row.label}
                </Link>
              ) : (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-2xl font-semibold hover:underline"
                >
                  {row.label}
                </a>
              )}
              <p className="mt-2 text-sm text-muted">{row.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-2xl bg-surface p-6 shadow-border sm:p-8">
        <h2 className="font-display text-3xl font-semibold">{chrome.ctaTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{chrome.ctaBody}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/jams">{chrome.ctaJams}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/board">{chrome.ctaBoard}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/musicians" search={{ instrument: inst.family }}>
              {chrome.ctaDir}
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-semibold">{chrome.more}</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {others.map((item) => {
            const other = instrumentCopy(item.slug, locale);
            return (
              <li key={item.slug}>
                <Link
                  to="/learn/instruments/$slug"
                  params={{ slug: item.slug }}
                  className="inline-flex h-11 items-center rounded-md bg-raised px-4 text-sm text-muted hover:text-fg"
                >
                  {other.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
