import { icons } from "../../icons";

export interface AddButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AddButton = ({ onPress, disabled = false, className = "" }: AddButtonProps) => {
  const PlusIcon = icons.plus;
  const classes = [
    "inline-flex items-center justify-center w-16 h-16 border-0 rounded-full bg-[#1f4e79] text-white cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-[background-color,transform,box-shadow] duration-200",
    "hover:enabled:bg-[#163a5c] hover:enabled:shadow-[0_6px_16px_rgba(0,0,0,0.3)]",
    "active:scale-95 active:shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
    "disabled:bg-[#94a3b8] disabled:cursor-not-allowed disabled:shadow-none",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      aria-label="Añadir"
      className={classes}
      onClick={onPress}
      disabled={disabled}
    >
      <PlusIcon size={32} />
    </button>
  );
};
