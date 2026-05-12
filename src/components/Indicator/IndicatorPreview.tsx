interface Props {
  value: number;
  label: string;
  isPositive: boolean;
  backgroundColor: string;
  textColor: string;
}

export const IndicatorPreview = ({
  value,
  label,
  isPositive,
  backgroundColor,
  textColor,
}: Props) => {
  return (
    <div
      className="w-[200px] h-[200px] rounded-[32px] flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor, color: textColor}}
    >
      <span className="text-[45px] font-bold leading-none">
        {isPositive ? "+" : "-"}
        {value}%
      </span>

      <span className="mt-4 text-[22px] font-bold uppercase leading-tight">
        {label}
      </span>
    </div>
  );
};