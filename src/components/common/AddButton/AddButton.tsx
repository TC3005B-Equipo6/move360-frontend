import { icons } from "../../../icons";

export interface AddButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AddButton = ({ onPress, disabled = false, className = "" }: AddButtonProps) => {
  const PlusIcon = icons.plus;
  const classes = [
    "inline-flex h-14 w-14 items-center justify-center rounded-full border-0 bg-primary text-content-on-primary shadow-lg",
    "transition-[background-color,box-shadow,opacity,transform] duration-200 ease-out",
    "hover:enabled:bg-primary-hover hover:enabled:shadow-xl",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "active:scale-[0.96] active:bg-primary-active active:shadow-md",
    "disabled:cursor-not-allowed disabled:bg-border-strong disabled:opacity-70 disabled:shadow-none disabled:active:scale-100",
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
      <PlusIcon size={26} aria-hidden="true" />
    </button>
  );
};
