interface Props {
  isPositive: boolean;
  onChange: (value: boolean) => void;
}

export const IndicatorTypeToggle = ({ isPositive, onChange }: Props) => {
  const base =
    "min-h-10 px-4 py-2 rounded-md border text-body-sm font-semibold cursor-pointer transition-[background-color,border-color,color,scale] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`${base} ${
          isPositive
            ? "bg-success text-content-on-primary border-success"
            : "bg-surface-raised text-content-secondary border-default hover:border-strong"
        }`}
      >
        Positivo
      </button>

      <button
        type="button"
        onClick={() => onChange(false)}
        className={`${base} ${
          !isPositive
            ? "bg-danger text-content-on-primary border-danger"
            : "bg-surface-raised text-content-secondary border-default hover:border-strong"
        }`}
      >
        Negativo
      </button>
    </div>
  );
};
