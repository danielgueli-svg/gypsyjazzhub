import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Contribute } from "@/components/contribute";
import { Flag } from "@/components/flag";
import { LearnJump } from "@/components/learn-jump";
import { ListFold } from "@/components/list-fold";
import { MessageMember } from "@/components/message-member";
import { listAllHubTeachers, type HubTeacher } from "@/lib/hub-api";
import { countryFromSlug, displayCountry } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";
import { cn, contactHref, youtubeVideoId } from "@/lib/utils";

export const Route = createFileRoute("/learn/teachers")({
  head: () => pageHead(SEO.teachers),
  loader: async () => ({ teachers: await listAllHubTeachers() }),
  component: TeachersPage,
});

const INSTRUMENT_FILTERS = [
  { id: "all", key: "teachers.allInstruments", needles: [] as string[] },
  { id: "guitar", key: "teachers.guitar", needles: ["guitar", "lead", "rhythm", "pompe", "selmer"] },
  { id: "violin", key: "teachers.violin", needles: ["violin", "viola", "fiddle"] },
  { id: "bass", key: "teachers.bass", needles: ["bass", "contrebasse", "contrabass", "double bass"] },
  { id: "accordion", key: "teachers.accordion", needles: ["accordion", "accordeon"] },
  { id: "clarinet", key: "teachers.clarinet", needles: ["clarinet", "klarinet"] },
  { id: "saxophone", key: "teachers.saxophone", needles: ["sax", "saxophone"] },
  { id: "harmonica", key: "teachers.harmonica", needles: ["harmonica"] },
  { id: "piano", key: "teachers.piano", needles: ["piano", "keyboard"] },
  { id: "mandolin", key: "teachers.mandolin", needles: ["mandolin", "mandoline", "bandolim"] },
  { id: "vocal", key: "teachers.vocal", needles: ["vocal", "voice", "sing"] },
  { id: "other", key: "teachers.other", needles: [] as string[] },
] as const;

type InstrumentFilterId = (typeof INSTRUMENT_FILTERS)[number]["id"];

function haystack(teacher: HubTeacher) {
  return `${teacher.instruments} ${teacher.note}`.toLowerCase();
}

function namedNeedles() {
  return INSTRUMENT_FILTERS.flatMap((filter) => filter.needles);
}

function matchesInstrument(teacher: HubTeacher, filter: InstrumentFilterId) {
  if (filter === "all") return true;
  const hay = haystack(teacher);
  if (filter === "other") {
    return !namedNeedles().some((needle) => hay.includes(needle));
  }
  const row = INSTRUMENT_FILTERS.find((item) => item.id === filter);
  return row ? row.needles.some((needle) => hay.includes(needle)) : true;
}

function teacherLinks(teacher: HubTeacher, t: (key: string) => string) {
  const contact = teacher.contact.trim();
  if (!contact) return [];
  const href = contactHref(contact);
  const youtube = Boolean(youtubeVideoId(contact) || /youtube\.com|youtu\.be/i.test(contact));
  const email = contact.includes("@") && !contact.includes(" ");
  const label = youtube ? t("teachers.youtube") : email ? t("teachers.email") : t("teachers.website");
  return [{ label, href }];
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center rounded-md px-4 text-sm",
        active ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function TeachersPage() {
  const { teachers } = Route.useLoaderData();
  const { t } = useI18n();
  const [country, setCountry] = useState("all");
  const [instrument, setInstrument] = useState<InstrumentFilterId>("all");

  const countries = useMemo(
    () => [...new Set(teachers.map((row) => row.countrySlug))].sort(),
    [teachers],
  );

  const shown = useMemo(
    () =>
      teachers.filter((teacher) => {
        if (country !== "all" && teacher.countrySlug !== country) return false;
        return matchesInstrument(teacher, instrument);
      }),
    [teachers, country, instrument],
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <LearnJump />
      <Link to="/learn" className="text-sm text-muted hover:text-fg">
        {t("nav.learn")}
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">{t("teachers.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{t("teachers.title")}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{t("teachers.lead")}</p>

      <div className="mt-8">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("violin.fieldCountry")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={country === "all"} onClick={() => setCountry("all")}>
            {t("teachers.allCountries")}
          </FilterChip>
          {countries.map((slug) => {
            const place = countryFromSlug(slug) ?? slug.replace(/-/g, " ");
            return (
            <FilterChip key={slug} active={country === slug} onClick={() => setCountry(slug)}>
              <span className="inline-flex items-center gap-1.5">
                <Flag name={place} />
                {displayCountry(place)}
              </span>
            </FilterChip>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("nav.instruments")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {INSTRUMENT_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              active={instrument === filter.id}
              onClick={() => setInstrument(filter.id)}
            >
              {t(filter.key)}
            </FilterChip>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-8 text-sm text-faint">{t("teachers.empty")}</p>
      ) : (
        <ListFold items={shown} limit={5}>
          {(shownTeachers) => (
        <ul className="mt-8 space-y-3">
          {shownTeachers.map((teacher) => {
            const links = teacherLinks(teacher, t);
            const place = [teacher.region, teacher.city].filter(Boolean).join(" · ");
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
                  {displayCountry(countryFromSlug(teacher.countrySlug) ?? teacher.countrySlug.replace(/-/g, " "))}
                  {place ? ` · ${place}` : ""}
                  {teacher.instruments ? ` · ${teacher.instruments}` : ""}
                </p>
                {teacher.note ? (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{teacher.note}</p>
                ) : null}
                {links.length > 0 ? (
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-fg hover:underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </p>
                ) : null}
                {teacher.userId ? (
                  <div className="mt-3">
                    <MessageMember toUserId={teacher.userId} name={teacher.name} compact />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
          )}
        </ListFold>
      )}

      <div className="mt-10">
        <Contribute heading={t("country.teachersAdd")} defaultKind="teacher" />
      </div>
    </main>
  );
}
