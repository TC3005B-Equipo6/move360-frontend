import { useEffect, useState } from "react";

// Cross-browser month picker. `<input type="month">` degrades to a plain text
// field in Firefox and Safari desktop, so we render two native `<select>`
// dropdowns (month + year) instead — supported everywhere. The value contract
// matches `type="month"`: a `"YYYY-MM"` string (or `""` when incomplete).
export interface MonthYearPickerProps {
  /** `"YYYY-MM"` or `""`. */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  /** Extra classes appended to each `<select>`. */
  className?: string;
  size?: "sm" | "lg";
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const VALUE_RE = /^(\d{4})-(\d{2})$/;

const parse = (value: string) => {
  const match = VALUE_RE.exec(value);
  return match ? { year: match[1], month: match[2] } : { year: "", month: "" };
};

const baseSelectClass =
  "flex-1 rounded-md border border-default bg-surface-raised text-content-primary outline-none transition-colors cursor-pointer focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed";

const SIZE_CLASS: Record<NonNullable<MonthYearPickerProps["size"]>, string> = {
  sm: "h-11 px-3 text-body-sm",
  lg: "h-[52px] px-4 text-body-lg",
};

export const MonthYearPicker = ({
  value,
  onChange,
  id,
  className = "",
  size = "lg",
  minYear = 2015,
  maxYear = new Date().getFullYear(),
  disabled = false,
}: MonthYearPickerProps) => {
  const parsed = parse(value);
  const [month, setMonth] = useState(parsed.month);
  const [year, setYear] = useState(parsed.year);

  // Resync local selects when the controlled value changes externally (edit
  // prefill, reset). A partial selection (one dropdown set) keeps `value` at ""
  // without re-running this, so it isn't wiped before the user picks the other.
  useEffect(() => {
    const next = parse(value);
    setMonth(next.month);
    setYear(next.year);
  }, [value]);

  // Emit a valid `YYYY-MM` only when both dropdowns are set; otherwise "".
  const emit = (nextMonth: string, nextYear: string) =>
    onChange(nextMonth && nextYear ? `${nextYear}-${nextMonth}` : "");

  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);

  const selectClass = `${baseSelectClass} ${SIZE_CLASS[size]} ${className}`.trim();

  return (
    <div className="flex gap-3">
      <select
        id={id}
        value={month}
        disabled={disabled}
        onChange={(e) => {
          setMonth(e.target.value);
          emit(e.target.value, year);
        }}
        className={selectClass}
        aria-label="Mes"
      >
        <option value="">Mes</option>
        {MONTHS.map((label, i) => {
          const monthValue = String(i + 1).padStart(2, "0");
          return (
            <option key={monthValue} value={monthValue}>
              {label}
            </option>
          );
        })}
      </select>
      <select
        value={year}
        disabled={disabled}
        onChange={(e) => {
          setYear(e.target.value);
          emit(month, e.target.value);
        }}
        className={selectClass}
        aria-label="Año"
      >
        <option value="">Año</option>
        {years.map((y) => (
          <option key={y} value={String(y)}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};
