import { useState } from "react";

type Option = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

interface Props {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

const SegmentedControl: React.FC<Props> = ({ options, value, onChange }) => {
  const [selected, setSelected] = useState(value || options[0]?.value);

  const selectedIndex = options.findIndex((o) => o.value === selected);

  const handleSelect = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className="font-sans">
      <span className="block mb-2 text-sm font-semibold text-[#444]">TIPO</span>

      <div className="relative flex bg-[#f1f4f8] rounded-2xl p-1 w-fit">
        <div
          className="absolute top-1 bottom-1 left-1 bg-[#d6dee9] rounded-xl transition-transform duration-[250ms] z-0"
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
        />

        {options.map((option) => (
          <button
            key={option.value}
            className={[
              "relative z-10 border-0 bg-transparent px-5 py-3 flex gap-1.5 items-center justify-center cursor-pointer text-sm text-[#2c4a66] rounded-xl transition-colors duration-200 hover:text-[#1f344a]",
              selected === option.value ? "font-semibold" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => handleSelect(option.value)}
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
