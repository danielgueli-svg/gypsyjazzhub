import { countryIso } from "@/lib/geo";
import { cn } from "@/lib/utils";

export function Flag({
  name,
  iso,
  className,
}: {
  name?: string;
  iso?: string;
  className?: string;
}) {
  const code = (iso || (name ? countryIso(name) : "")).toLowerCase();
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={18}
      height={13}
      alt=""
      loading="lazy"
      decoding="async"
      className={cn(
        "inline-block h-[13px] w-[18px] shrink-0 rounded-[1px] object-cover",
        className,
      )}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}
