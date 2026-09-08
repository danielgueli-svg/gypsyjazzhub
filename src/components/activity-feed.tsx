import type { ActivityItem } from "@/lib/activity";
import { formatConcertWhen } from "@/lib/utils";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="mt-4 text-sm text-muted">The room is quiet. Add a jam or a date.</p>;
  }
  return (
    <ol className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <a href={item.href} className="block rounded-2xl bg-surface px-4 py-3 shadow-border hover:bg-raised">
            <p className="text-sm leading-relaxed">
              <span className="font-medium text-fg">{item.who}</span>
              <span className="text-muted"> {item.title}</span>
            </p>
            <p className="mt-1 text-[11px] tracking-[0.14em] text-faint uppercase">
              {item.kind} · {formatConcertWhen(item.when)}
            </p>
          </a>
        </li>
      ))}
    </ol>
  );
}
