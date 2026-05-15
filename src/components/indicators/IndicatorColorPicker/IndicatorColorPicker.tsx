import { colorOptions, type ColorKey } from "./colors";

interface Props {
  selectedColor: ColorKey;
  onSelect: (color: ColorKey) => void;
}

export const IndicatorColorPicker = ({ selectedColor, onSelect }: Props) => {
  return (
    <div className="flex gap-3">
      {Object.entries(colorOptions).map(([key, colors]) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key as ColorKey)}
          className={`w-10 h-10 rounded-full border-4 cursor-pointer transition-[border-color,scale] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
            selectedColor === key ? "border-primary" : "border-transparent hover:border-default"
          }`}
          style={{ background: colors.background }}
        />
      ))}
    </div>
  );
};
