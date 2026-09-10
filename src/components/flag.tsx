import { countryIso } from "@/lib/geo";
import { cn } from "@/lib/utils";

export function Flag({
  name,
  iso,
  className,
  eager = false,
}: {
  name?: string;
  iso?: string;
  className?: string;
  eager?: boolean;
}) {
  const code = (iso || (name ? countryIso(name) : "")).toLowerCase();
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 1x, https://flagcdn.com/w160/${code}.png 2x`}
      width={24}
      height={16}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn(
        "inline-block h-4 w-6 shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgb(0_0_0/0.25)]",
        className,
      )}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}
