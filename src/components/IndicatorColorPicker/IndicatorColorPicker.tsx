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
          className={`w-10 h-10 rounded-full border-4 ${
            selectedColor === key ? "border-[#1F4E79]" : "border-transparent"
          }`}
          style={{ background: colors.background }}
        />
      ))}
    </div>
  );
};
