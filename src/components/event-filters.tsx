import { weekdayOptions } from "@/lib/agenda";
import { countrySlug, displayCountry } from "@/lib/geo";

export function EventFilters({
  countries,
  cities,
  country,
  city,
  weekday,
  month,
  type,
  onCountry,
  onCity,
  onWeekday,
  onMonth,
  onType,
  showType,
  hideCountry,
  months,
  typeOptions,
}: {
  countries: string[];
  cities: string[];
  country?: string;
  city?: string;
  weekday?: string;
  month?: string;
  type?: string;
  onCountry: (value: string) => void;
  onCity: (value: string) => void;
  onWeekday: (value: string) => void;
  onMonth?: (value: string) => void;
  onType?: (value: string) => void;
  showType?: boolean;
  hideCountry?: boolean;
  months?: { value: string; label: string }[];
  typeOptions?: { value: string; label: string }[];
}) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {hideCountry ? null : (
        <FilterSelect label="Country" value={country ?? ""} onChange={onCountry}>
          <option value="">All countries</option>
          {countries.map((name) => (
            <option key={name} value={countrySlug(name)}>
              {displayCountry(name)}
            </option>
          ))}
        </FilterSelect>
      )}
      <FilterSelect label="City" value={city ?? ""} onChange={onCity}>
        <option value="">All cities</option>
        {cities.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect label="Day" value={weekday ?? ""} onChange={onWeekday}>
        <option value="">Any day</option>
        {weekdayOptions().map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </FilterSelect>
      {onMonth && months ? (
        <FilterSelect label="Month" value={month ?? ""} onChange={onMonth}>
          <option value="">Any month</option>
          {months.map((row) => (
            <option key={row.value} value={row.value}>
              {row.label}
            </option>
          ))}
        </FilterSelect>
      ) : null}
      {showType && onType ? (
        <FilterSelect label="Type" value={type ?? ""} onChange={onType}>
          {(typeOptions ?? [
            { value: "", label: "Open and sit-in" },
            { value: "open", label: "Open jam" },
            { value: "sit-in", label: "Sit-in / meetup" },
            { value: "concert", label: "Concert" },
          ]).map((row) => (
            <option key={row.value || "all"} value={row.value}>
              {row.label}
            </option>
          ))}
        </FilterSelect>
      ) : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.16em] text-faint uppercase">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-12 w-full rounded-xl bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_14%,transparent)] outline-none"
      >
        {children}
      </select>
    </label>
  );
}
