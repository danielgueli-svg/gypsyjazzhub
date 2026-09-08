import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md bg-raised px-3 text-base text-fg placeholder:text-faint sm:h-11 sm:text-sm",
        "shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_14%,transparent)]",
        "outline-none transition-[box-shadow] duration-150",
        "focus-visible:shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}
