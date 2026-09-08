import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt=""
      className={cn("h-9 w-auto sm:h-14", className)}
      aria-hidden="true"
    />
  );
}
