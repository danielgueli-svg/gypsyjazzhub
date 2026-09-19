import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { contactHref } from "@/lib/utils";

export function BookButton({
  href,
  kind = "artist",
}: {
  href: string;
  kind?: "artist" | "group";
}) {
  const { t } = useI18n();
  const link = contactHref(href);
  if (!link) return null;
  const external = /^https?:\/\//i.test(link);
  return (
    <Button asChild>
      <a href={link} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {kind === "group" ? t("book.group") : t("book.title")}
      </a>
    </Button>
  );
}
