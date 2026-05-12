interface Props {
  isPositive: boolean;

  onChange: (value: boolean) => void;
}

export const IndicatorTypeToggle = ({
  isPositive,
  onChange,
}: Props) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange(true)}
        className={`
          px-4 py-2 rounded-xl
          ${
            isPositive
              ? "bg-green-700 text-white"
              : "bg-white"
          }
        `}
      >
        Positivo
      </button>

      <button
        onClick={() => onChange(false)}
        className={`
          px-4 py-2 rounded-xl
          ${
            !isPositive
              ? "bg-red-700 text-white"
              : "bg-white"
          }
        `}
      >
        Negativo
      </button>
    </div>
  );
};