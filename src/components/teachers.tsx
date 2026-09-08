import { Link } from "@tanstack/react-router";
import { TeacherForm } from "@/components/contribute";
import { ListFold } from "@/components/list-fold";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { HubTeacher } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { contactHref } from "@/lib/utils";

function placeLine(teacher: HubTeacher) {
  return [teacher.region, teacher.city].filter(Boolean).join(" · ");
}

export function Teachers({
  countrySlug,
  countryName,
  teachers,
}: {
  countrySlug: string;
  countryName: string;
  teachers: HubTeacher[];
}) {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();

  return (
    <section id="teachers" className="mt-12 scroll-mt-40">
      <h2 className="font-display text-3xl font-semibold">
        {t("country.teachers")}
        {teachers.length > 5 ? (
          <span className="ml-2 text-lg font-normal text-muted">({teachers.length})</span>
        ) : null}
      </h2>
      <p className="mt-2 max-w-2xl font-display text-xl text-fg">
        {t("country.teachersLead").replace("{country}", countryName)}
      </p>
      <p className="mt-2 max-w-2xl text-sm text-muted">{t("country.teachersBody")}</p>

      {teachers.length === 0 ? (
        <p className="mt-5 text-sm text-faint">{t("country.teachersEmpty")}</p>
      ) : (
        <ListFold items={teachers} limit={5}>
          {(shown) => (
            <ul className="mt-5 space-y-3">
              {shown.map((teacher) => {
                const href = contactHref(teacher.contact);
                const place = placeLine(teacher);
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
                      {[place, teacher.instruments].filter(Boolean).join(" · ")}
                    </p>
                    {teacher.note ? (
                      <p className="mt-2 text-sm leading-relaxed text-muted">{teacher.note}</p>
                    ) : null}
                    {href ? (
                      <a href={href} className="mt-3 inline-block text-sm text-fg hover:underline">
                        {t("country.contact")}
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </ListFold>
      )}

      {isPending ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-surface" />
      ) : !user ? (
        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-sm text-muted">{t("country.teachersSignin")}</p>
          <Button asChild className="mt-4">
            <Link to="/login">{t("nav.login")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-border">
          <p className="mb-4 font-display text-xl font-semibold">{t("country.teachersAdd")}</p>
          <TeacherForm countrySlug={countrySlug} />
        </div>
      )}
    </section>
  );
}
