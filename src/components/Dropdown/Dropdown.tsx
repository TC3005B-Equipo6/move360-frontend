import { icons } from "../../icons";

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
      <label className="font-[Inter,sans-serif] text-lg font-normal tracking-[-0.5px] text-[#111111] uppercase m-0">
        {label}
      </label>

      <div className="relative w-full">
        <select
          className="w-full h-[35px] border border-[#cccccc] rounded-xl py-0 pl-4 pr-12 font-[Inter,sans-serif] text-base font-light tracking-[-0.4px] text-[#222222] bg-white appearance-none outline-none cursor-pointer focus:border-[#1f4e79] disabled:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-80"
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

        <span className="absolute top-1/2 right-6 -translate-y-1/2 pointer-events-none text-[#222222] flex items-center justify-center">
          <ChevronDown size={32} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
};
