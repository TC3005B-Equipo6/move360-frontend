export type IndicatorTone = "direct" | "inverse";


export interface IndicatorProps {
  value: number;
  tone: IndicatorTone;
  label: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isMenuOpen: boolean;
  className?: string;
}

const tones: Record<IndicatorTone, string> = {
  direct: "bg-[#dcfce7] text-[#166534]",
  inverse: "bg-[#ffd5d5] text-[#a42020]",
};

export const Indicator = ({
  value,
  tone,
  label,
  name: _name,
  startDate: _startDate,
  endDate: _endDate,
  isMenuOpen: _isMenuOpen,
  className = "",
}: IndicatorProps) => {
  const classes = [
    "group relative flex flex-col items-center justify-center gap-1 w-[180px] h-[180px] px-3 py-[14px] rounded-2xl text-center font-[Inter,sans-serif] overflow-visible",
    tones[tone],
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <p className="m-0 text-[36px] font-bold leading-none">{value}</p>
      <p className="m-0 text-base font-bold uppercase leading-snug">{label}</p>
    </div>
  );
};
