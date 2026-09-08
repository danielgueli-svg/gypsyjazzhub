import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import { ContactBoardButton } from "@/components/contact-board";
import { HubSearch } from "@/components/hub-search";
import { LanguageSwitch } from "@/components/language-switch";
import { SharePage } from "@/components/share-page";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const COMMUNITY = [
  { to: "/jams", key: "nav.jams" },
  { to: "/learn", key: "nav.camps", hash: "camps" },
  { to: "/board", key: "nav.board" },
  { to: "/musicians", key: "nav.musicians" },
  { to: "/groups", key: "nav.groups" },
] as const;

const EVENTS = [
  { to: "/concerts", key: "nav.concerts" },
  { to: "/festivals", key: "nav.festivals" },
] as const;

const LEARN = [
  { to: "/learn", key: "learn.overview" },
  { to: "/learn", key: "nav.campsShort", hash: "camps" },
  { to: "/learn", key: "learn.schools", hash: "schools" },
  { to: "/instruments", key: "nav.instruments" },
  { to: "/learn/teachers", key: "nav.teachers" },
  { to: "/learn/apps", key: "nav.apps" },
] as const;

const MORE = [
  { to: "/history", key: "nav.history" },
  { to: "/romani-music", key: "nav.archiveRomani", href: "https://romanimusic.com" },
  { to: "/news", key: "nav.news" },
  { to: "/world", key: "nav.globe" },
  { to: "/join", key: "nav.join" },
] as const;

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: readonly { to: string; key: string; hash?: string; href?: string }[];
}) {
  const { t } = useI18n();
  return (
    <div>
      <p className="text-xs tracking-widest text-[#2a1c10]/70 uppercase">{title}</p>
      <ul className="mt-2 space-y-2 sm:mt-3">
        {items.map((item) => (
          <li key={item.href ?? (item.hash ? `${item.to}#${item.hash}` : item.to)}>
            {item.href ? (
              <a href={item.href} className="text-sm text-[#2a1c10] hover:underline">
                {t(item.key)}
              </a>
            ) : (
              <Link
                to={item.to}
                hash={item.hash ?? ""}
                className="text-sm text-[#2a1c10] hover:underline"
              >
                {t(item.key)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="spruce-flat mt-auto border-t border-black/15">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <HubSearch tone="wood" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <Button
              asChild
              className="h-11 bg-[#2a1c10] px-3 text-sm text-[#efe3b6] hover:opacity-90 sm:h-12 sm:px-8 sm:text-base"
            >
              <Link to="/login">{t("nav.login")}</Link>
            </Button>
            <ContactBoardButton className="h-11 w-full whitespace-nowrap bg-[#2a1c10] px-3 text-sm text-[#efe3b6] hover:opacity-90 sm:hidden" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-6 md:grid-cols-7 md:gap-10">
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <BrandMark className="h-10 w-auto shrink-0 sm:h-12" />
              <span className="font-display text-xl font-semibold text-[#2a1c10] sm:text-3xl">
                Gypsy Jazz Hub
              </span>
            </div>
            <p className="mt-2 text-sm text-[#2a1c10]/80">gypsyjazzhub.com</p>
            <p className="mt-1 text-sm text-[#2a1c10]/80">{t("footer.tagline")}</p>
            <div className="mt-4 hidden sm:block">
              <ContactBoardButton className="h-11 bg-[#2a1c10] px-4 text-sm text-[#efe3b6] hover:opacity-90 sm:h-12 sm:px-6 sm:text-base" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 md:col-span-4 md:contents">
            <FooterCol title={t("nav.community")} items={COMMUNITY} />
            <FooterCol title={t("nav.events")} items={EVENTS} />
            <FooterCol title={t("nav.learnShort")} items={LEARN} />
            <FooterCol title={t("footer.more")} items={MORE} />
          </div>
        </div>
        <p className="mt-6 rounded-md border border-[#2a1c10]/25 px-3 py-2 text-xs leading-snug text-[#2a1c10]/80">
          {t("footer.names")}
        </p>
      </div>

      <div>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-4">
          <LanguageSwitch compact prominent />
          <div className="flex min-w-0 items-center gap-2">
            <ContactBoardButton className="hidden h-9 bg-[#2a1c10] px-3 text-xs text-[#efe3b6] hover:opacity-90 sm:inline-flex" />
            <SharePage compact />
          </div>
        </div>
      </div>
    </footer>
  );
}
