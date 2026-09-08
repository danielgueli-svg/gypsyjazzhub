import { Flag } from "@/components/flag";
import { countryCode, displayCountry, globeCityForCountry } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function CountryLabel({
  name,
  flag = true,
  short = false,
  className,
}: {
  name: string;
  flag?: boolean;
  short?: boolean;
  className?: string;
}) {
  const { locale } = useI18n();
  const city = short ? "" : globeCityForCountry(name)?.city;
  const label = short ? countryCode(name) || displayCountry(name, locale) : displayCountry(name, locale);
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      title={short ? displayCountry(name, locale) : undefined}
    >
      {flag ? <Flag name={name} /> : null}
      <span>
        {label}
        {city ? ` · ${city}` : ""}
      </span>
    </span>
  );
}
