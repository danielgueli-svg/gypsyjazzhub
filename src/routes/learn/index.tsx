import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageMember } from "@/components/message-member";
import { Contribute } from "@/components/contribute";
import { Button } from "@/components/ui/button";
import { upcomingCamps, campKind } from "@/lib/camps";
import { CountryLabel } from "@/components/country-label";
import { listAllHubTeachers } from "@/lib/hub-api";
import { listForumTopics } from "@/lib/forum-api";
import { onlineSchools } from "@/lib/scene-guide";
import { contactHref } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { whenLabel } from "@/lib/festival-copy";
import { pageHead, SEO } from "@/lib/seo";
import { InstrumentPicker } from "@/components/instrument-cards";
import { LearnJump } from "@/components/learn-jump";
import { ListFold } from "@/components/list-fold";
import { settle } from "@/lib/settle";

export const Route = createFileRoute("/learn/")({
  head: () => pageHead(SEO.learn),
  loader: async () => {
    const [teachers, topics] = await Promise.all([
      settle("teachers", [], () => listAllHubTeachers()),
      settle("forum", [], () => listForumTopics()),
    ]);
    return {
      teachers,
      topics: topics.filter((topic) => topic.replies > 0).slice(0, 6),
    };
  },
  component: LearnPage,
});

function LearnPage() {
  const { teachers, topics } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const camps = upcomingCamps();
  const schools = onlineSchools();
  const countries = useMemo(
    () => [...new Set(teachers.map((row) => row.countrySlug))].sort(),
    [teachers],
  );
  const [country, setCountry] = useState("all");
  const shown = country === "all" ? teachers : teachers.filter((row) => row.countrySlug === country);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <LearnJump />
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">The school</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
        {t("learn.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        {t("learn.lead")}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-3">
        <a href="#camps" className="rounded-xl bg-surface px-4 py-3 shadow-border hover:bg-raised">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("learn.workshops")}</p>
          <p className="mt-1 font-display text-xl font-semibold leading-tight">{t("learn.camps")}</p>
        </a>
        <a href="#schools" className="rounded-xl bg-surface px-4 py-3 shadow-border hover:bg-raised">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("learn.practice")}</p>
          <p className="mt-1 font-display text-xl font-semibold leading-tight">{t("learn.schools")}</p>
        </a>
        <a href="#teachers" className="rounded-xl bg-surface px-4 py-3 shadow-border hover:bg-raised">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("learn.private")}</p>
          <p className="mt-1 font-display text-xl font-semibold leading-tight">{t("learn.teachers")}</p>
        </a>
        <Link to="/learn/forum" className="rounded-xl bg-surface px-4 py-3 shadow-border hover:bg-raised">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("learn.questions")}</p>
          <p className="mt-1 font-display text-xl font-semibold leading-tight">{t("learn.forum")}</p>
        </Link>
        <Link to="/learn/apps" className="rounded-xl bg-surface px-4 py-3 shadow-border hover:bg-raised">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("learn.practice")}</p>
          <p className="mt-1 font-display text-xl font-semibold leading-tight">{t("learn.apps")}</p>
        </Link>
        <Link to="/learn/instruments" className="rounded-xl bg-surface px-4 py-3 shadow-border hover:bg-raised">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("learn.byInstrument")}</p>
          <p className="mt-1 font-display text-xl font-semibold leading-tight">{t("learn.instruments")}</p>
        </Link>
      </div>

      <InstrumentPicker />

      <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <Link to="/learn/charts" className="hover:text-fg hover:underline">
          Charts & backing
        </Link>
        <Link to="/learn/start-jam" className="hover:text-fg hover:underline">
          Start a jam
        </Link>
        <Link to="/instruments" className="hover:text-fg hover:underline">
          {t("nav.instruments")}
        </Link>
        <Link to="/luthiers" className="hover:text-fg hover:underline">
          {t("learn.luthiers")}
        </Link>
        <Link to="/shops" className="hover:text-fg hover:underline">
          {t("learn.shops")}
        </Link>
        <Link to="/learn/amplification" className="hover:text-fg hover:underline">
          {t("learn.amp")}
        </Link>
      </p>

      <section id="camps" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-3xl font-semibold">{t("learn.camps")}</h2>
        <ListFold items={camps} limit={5}>
          {(shownCamps) => (
            <div className="mt-5 space-y-1">
              {shownCamps.map((camp) => (
                <p key={camp.slug}>
                  <Link
                    to="/learn/$slug"
                    params={{ slug: camp.slug }}
                    className="hover:underline"
                  >
                    <CountryLabel name={camp.country} short className="inline-flex" />
                    <span className="mx-1.5 text-faint">·</span>
                    <span className="font-display text-lg font-semibold">{camp.name}</span>
                    <span className="mx-1.5 text-faint">·</span>
                    <span className="text-sm text-muted">
                      {campKind(camp) === "workshop" ? "Workshop" : "Camp"}
                    </span>
                    <span className="mx-1.5 text-faint">·</span>
                    <span className="text-sm text-muted">{camp.city}</span>
                    <span className="mx-1.5 text-faint">·</span>
                    <span className="text-sm text-muted">{whenLabel(camp.when, locale)}</span>
                  </Link>
                </p>
              ))}
            </div>
          )}
        </ListFold>
      </section>

      <section id="schools" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-3xl font-semibold">{t("learn.schools")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {t("learn.schoolsLead")}
        </p>
        <ListFold items={schools} limit={5}>
          {(shownSchools) => (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {shownSchools.map((school) => (
                <a
                  key={school.name}
                  href={school.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
                >
                  <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                    {school.place}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{school.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{school.bio}</p>
                </a>
              ))}
            </div>
          )}
        </ListFold>
      </section>

      <section id="teachers" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-3xl font-semibold">{t("learn.teachers")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Filter by country. After you join, add yourself: country, region, city
          and a way to contact you.
        </p>
        {countries.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCountry("all")}
              className={
                country === "all"
                  ? "h-11 rounded-md bg-accent px-4 text-sm text-accent-fg"
                  : "h-11 rounded-md bg-raised px-4 text-sm text-muted hover:text-fg"
              }
            >
              All
            </button>
            {countries.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setCountry(slug)}
                className={
                  country === slug
                    ? "h-11 rounded-md bg-accent px-4 text-sm text-accent-fg"
                    : "h-11 rounded-md bg-raised px-4 text-sm text-muted hover:text-fg"
                }
              >
                <CountryLabel name={slug.replace(/-/g, " ")} />
              </button>
            ))}
          </div>
        ) : null}
        {shown.length === 0 ? (
          <p className="mt-5 text-sm text-faint">
            No private teachers listed yet. Join and add yourself below.
          </p>
        ) : (
          <ListFold items={shown} limit={5}>
            {(shownTeachers) => (
              <ul className="mt-5 space-y-3">
                {shownTeachers.map((teacher) => {
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
          </ListFold>
        )}
        <Contribute heading="Add yourself as a teacher" defaultKind="teacher" />
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-semibold">{t("learn.forum")}</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/learn/forum">Open the forum</Link>
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted">Anyone can read. Log in to ask or reply.</p>
        {topics.length === 0 ? null : (
          <ul className="mt-5 divide-y divide-border rounded-2xl bg-surface shadow-border">
            {topics.map((topic) => (
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
        )}
      </section>
    </main>
  );
}
