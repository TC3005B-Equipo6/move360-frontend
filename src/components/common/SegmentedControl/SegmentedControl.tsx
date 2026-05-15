import { useState, type ReactNode } from "react";

type Option = {
  label: string;
  value: string;
  icon?: ReactNode;
};

export interface SegmentedControlProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
}

const SegmentedControl = ({ options, value, onChange, label = "Tipo" }: SegmentedControlProps) => {
  const [selected, setSelected] = useState<string | undefined>(value);
  const currentValue = value ?? selected;

  const selectedIndex = options.findIndex((o) => o.value === currentValue);

  const handleSelect = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className="font-sans">
      <span className="mb-2 block text-body-sm font-semibold text-content-primary">{label}</span>

      <div className="relative flex w-fit rounded-lg bg-surface-sunken p-1 shadow-xs">
        {selectedIndex >= 0 && (
          <div
            className="absolute bottom-1 left-1 top-1 z-0 rounded-md bg-surface-raised shadow-sm transition-transform duration-200 ease-out"
            style={{
              width: `${100 / options.length}%`,
              transform: `translateX(${selectedIndex * 100}%)`,
            }}
          />
        )}

        {options.map((option) => (
          <button
            key={option.value}
            className={[
              "relative z-10 flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 bg-transparent px-4 py-2 text-body-sm text-content-secondary",
              "transition-[color,transform] duration-200 ease-out hover:text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]",
              currentValue === option.value ? "font-semibold text-primary" : "font-medium",
            ].filter(Boolean).join(" ")}
            onClick={() => handleSelect(option.value)}
            type="button"
          >
            {option.icon && <span className="flex items-center">{option.icon}</span>}
            <span className="whitespace-nowrap">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
