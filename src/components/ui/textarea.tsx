import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md bg-raised px-3 py-2.5 text-sm text-fg placeholder:text-faint",
        "shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_14%,transparent)]",
        "outline-none transition-[box-shadow] duration-150",
        "focus-visible:shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}
