import { cn } from "@/lib/utils";

export function GoldMedal({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex translate-y-px items-center", className)}
      title="Gold member"
    >
      <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
        <circle cx="16" cy="17" r="9" fill="#d4a017" />
        <circle cx="16" cy="17" r="7" fill="none" stroke="#f5e6a3" strokeWidth="1.4" />
        <path d="M16 11.2 17.4 14.6 21 15l-2.6 2.4.8 3.5L16 19.2 12.8 20.9l.8-3.5L11 15l3.6-.4Z" fill="#7a5a08" />
        <path d="M11 6.5 16 10l5-3.5v4.2l-5 2.2-5-2.2Z" fill="#b42318" />
      </svg>
      <span className="sr-only">Gold member</span>
    </span>
  );
}
