import { icons } from "../../../icons";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const SelectField = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  className = "",
}: SelectFieldProps) => {
  const ChevronDown = icons.chevronDown;

  const classes = ["flex flex-col gap-4 w-full", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <label className="m-0 font-sans text-body-sm font-semibold uppercase text-content-primary">
        {label}
      </label>

      <div className="relative w-full">
        <select
          className={[
            "min-h-11 w-full appearance-none rounded-md border-0 bg-surface-raised py-2.5 pl-3.5 pr-11 font-sans text-body text-content-primary shadow-xs ring-1 ring-inset ring-border outline-none",
            "transition-[background-color,box-shadow,color] duration-200 ease-out focus:ring-2 focus:ring-primary",
            "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-content-muted",
          ].join(" ")}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-content-secondary">
          <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
};
