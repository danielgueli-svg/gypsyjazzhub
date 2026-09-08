import { cn } from "@/lib/utils";

function Soundhole({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-3.5 text-accent", className)}
      aria-hidden="true"
    >
      <ellipse cx="16" cy="16" rx="12" ry="9.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="16" cy="16" rx="7" ry="5.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="16" cy="16" rx="2.1" ry="1.6" fill="currentColor" />
    </svg>
  );
}

export function JoinedMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex translate-y-px items-center", className)}
      title="Joined the hub"
    >
      <Soundhole />
      <span className="sr-only">Joined the hub</span>
    </span>
  );
}

export function NameWithJoin({
  name,
  joined,
}: {
  name: string;
  joined?: boolean;
}) {
  if (!joined) return name;
  return (
    <span className="inline-flex items-baseline gap-1.5">
      {name}
      <JoinedMark />
    </span>
  );
}
