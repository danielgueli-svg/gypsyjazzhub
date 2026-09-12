import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Gypsy Jazz Hub"
      className={cn("pointer-events-none h-12 w-auto object-contain sm:h-14", className)}
    />
  );
}
