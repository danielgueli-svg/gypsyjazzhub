import { useMemo, useState } from "react";
import { itemsForDay, monthGrid, weekdayName, type AgendaItem } from "@/lib/agenda";
import { cn } from "@/lib/utils";

export function AgendaCalendar({ items }: { items: AgendaItem[] }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [picked, setPicked] = useState<string | null>(null);
  const cells = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor]);
  const label = new Date(cursor.year, cursor.month, 1).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const dayItems = picked ? itemsForDay(items, picked) : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="h-11 rounded-md bg-raised px-3 text-sm"
          onClick={() =>
            setCursor((c) =>
              c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 },
            )
          }
        >
          Previous
        </button>
        <p className="font-display text-xl font-semibold">{label}</p>
        <button
          type="button"
          className="h-11 rounded-md bg-raised px-3 text-sm"
          onClick={() =>
            setCursor((c) =>
              c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 },
            )
          }
        >
          Next
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] tracking-[0.12em] text-faint uppercase">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const count = cell.date ? itemsForDay(items, cell.date).length : 0;
          return (
            <button
              key={cell.date ?? `e-${i}`}
              type="button"
              disabled={!cell.date}
              onClick={() => cell.date && setPicked(cell.date)}
              className={cn(
                "min-h-16 rounded-xl p-2 text-left text-sm",
                cell.date ? "bg-surface hover:bg-raised" : "bg-transparent",
                picked === cell.date && "shadow-[0_0_0_1px_var(--color-accent)]",
              )}
            >
              {cell.day ? <span className="text-muted">{cell.day}</span> : null}
              {count > 0 ? (
                <span className="mt-1 block font-display text-lg leading-none text-accent">{count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className="mt-6">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
            {picked} · {weekdayName(`${picked}T12:00:00`)}
          </p>
          {dayItems.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing on this night yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dayItems.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="block rounded-xl bg-surface px-4 py-3 hover:bg-raised">
                    <p className="font-display text-lg font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {item.kind} · {item.city}
                      {item.venue ? ` · ${item.venue}` : ""}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Tap a day with a number to open that night.</p>
      )}
    </div>
  );
}
