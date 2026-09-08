import { createFileRoute, Link } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

const KINDS = ["concert", "jam", "festival", "artist", "teacher"] as const;
type Kind = (typeof KINDS)[number];

export const Route = createFileRoute("/add")({
  head: () =>
    pageHead({
      title: "Add to the hub",
      description: "Add a concert, jam, festival, musician page or teacher to Gypsy Jazz Hub.",
      path: "/add",
    }),
  validateSearch: (search: Record<string, unknown>): { kind?: Kind } => {
    const kind = typeof search.kind === "string" ? search.kind : undefined;
    return { kind: KINDS.includes(kind as Kind) ? (kind as Kind) : undefined };
  },
  component: AddPage,
});

function AddPage() {
  const { kind } = Route.useSearch();
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10" />;
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("contribute.chooser")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("contribute.hubTitle")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        {t("contribute.hubLead")}
      </p>
      <p className="mt-4 text-sm text-muted">
        <Link to="/studio" className="hover:underline">
          {t("nav.hubProfile")}
        </Link>
      </p>
      <Contribute heading={t("contribute.chooser")} defaultKind={kind ?? "concert"} />
    </main>
  );
}
