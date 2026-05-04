import { icons } from "../../icons";

export type IndicatorTone = "positive" | "negative" | "neutral";

export interface IndicatorCardProps {
  value: string;
  label: string;
  tone: IndicatorTone;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
  className?: string;
}

const tones: Record<IndicatorTone, string> = {
  positive: "bg-[#dcfce7] text-[#166534]",
  negative: "bg-[#ffd5d5] text-[#a42020]",
  neutral: "bg-[#ffebaf] text-[#b46e0b]",
};

export const IndicatorCard = ({
  value,
  label,
  tone,
  onMenuClick,
  isMenuOpen = false,
  className = "",
}: IndicatorCardProps) => {
  const MoreIcon = icons.more;
  const classes = [
    "group relative flex flex-col items-center justify-center gap-1 w-[180px] h-[180px] px-3 py-[14px] rounded-2xl text-center font-[Inter,sans-serif] overflow-visible",
    tones[tone],
    className,
  ].filter(Boolean).join(" ");

  const menuButtonClasses = [
    "absolute top-[10px] right-[10px] inline-flex items-center justify-center w-7 h-7 p-0 bg-white/60 border-0 rounded-full text-inherit cursor-pointer transition-[opacity,background-color] duration-150 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white/90",
    isMenuOpen ? "opacity-100" : "opacity-0",
  ].join(" ");

  return (
    <div className={classes}>
      {onMenuClick && (
        <button
          type="button"
          aria-label="More options"
          className={menuButtonClasses}
          onClick={onMenuClick}
          data-action-menu-trigger
        >
          <MoreIcon size={20} />
        </button>
      )}
      <p className="m-0 text-[36px] font-bold leading-none">{value}</p>
      <p className="m-0 text-base font-bold uppercase leading-snug">{label}</p>
    </div>
  );
};
