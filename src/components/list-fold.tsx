import { useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

export function FoldMore({
  hidden,
  open,
  onToggle,
}: {
  hidden: number;
  open: boolean;
  onToggle: () => void;
}) {
  const { t } = useI18n();
  if (hidden <= 0) return null;
  return (
    <button type="button" onClick={onToggle} className="mt-3 text-sm text-muted hover:text-fg">
      {open ? t("country.showLess") : `${t("country.seeMore")} (${hidden})`}
    </button>
  );
}

export function useFold<T>(items: T[], limit = 5) {
  const [open, setOpen] = useState(false);
  const shown = open ? items : items.slice(0, limit);
  const hidden = Math.max(0, items.length - limit);
  return {
    shown,
    hidden,
    open,
    toggle: () => setOpen((value) => !value),
  };
}

export function ListFold<T>({
  items,
  limit = 5,
  children,
}: {
  items: T[];
  limit?: number;
  children: (shown: T[]) => ReactNode;
}) {
  const fold = useFold(items, limit);
  return (
    <>
      {children(fold.shown)}
      <FoldMore hidden={fold.hidden} open={fold.open} onToggle={fold.toggle} />
    </>
  );
}
