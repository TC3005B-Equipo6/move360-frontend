import { icons } from "../../../icons";

export interface OverflowMenuButtonProps {
  isOpen?: boolean;
  className?: string;
  label?: string;
  onClick: () => void;
}

export const OverflowMenuButton = ({
  isOpen = false,
  className = "",
  label = "More options",
  onClick,
}: OverflowMenuButtonProps) => {
  const MoreIcon = icons.more;
  const classes = [
    "item-menu inline-flex items-center justify-center w-[42px] h-[28px] p-0",
    "bg-surface-overlay/95 hover:bg-surface-overlay border border-subtle rounded-[6px] text-content-secondary cursor-pointer shadow-sm",
    "transition-[background-color,opacity,scale] duration-150 active:scale-[0.96]",
    "after:content-[''] after:absolute after:-inset-[5px]",
    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover/dashboard-item:opacity-100 group-hover/dashboard-item:pointer-events-auto",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      aria-label={label}
      data-action-menu-trigger
      className={classes}
      onClick={onClick}
    >
      <MoreIcon size={20} />
    </button>
  );
};
