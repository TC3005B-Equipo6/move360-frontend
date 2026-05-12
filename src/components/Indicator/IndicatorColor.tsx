export const colorOptions = {
  green: {
    background: "#DDF3E4",
    text: "#166534",
  },
  red: {
    background: "#F8D7DA",
    text: "#B42318",
  },
  yellow: {
    background: "#FCEFC7",
    text: "#B7791F",
  },
};

interface Props {
  selectedColor: keyof typeof colorOptions;
  onSelect: (
    color: keyof typeof colorOptions
  ) => void;
}

export const IndicatorColorPicker = ({
  selectedColor,
  onSelect,
}: Props) => {
  return (
    <div className="flex gap-3">
      {Object.entries(colorOptions).map(
        ([key, colors]) => (
          <button
            key={key}
            type="button"
            onClick={() =>
              onSelect(
                key as keyof typeof colorOptions
              )
            }
            className={`w-10 h-10 rounded-full border-4${selectedColor === key ? "border-[#1F4E79]": "border-transparent"}`}
            style={{ background: colors.background }}
          />
        )
      )}
    </div>
  );
};