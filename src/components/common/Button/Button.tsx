import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  variant?: "blue" | "red" | "white";
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  isLoading?: boolean;
}

const variants: Record<string, string> = {
  blue: "bg-primary text-content-on-primary shadow-sm hover:bg-primary-hover active:bg-primary-active",
  red: "bg-danger text-content-on-primary shadow-sm hover:bg-[#9f2f24]",
  white:
    "bg-surface-raised text-content-secondary shadow-xs ring-1 ring-inset ring-border hover:bg-surface-sunken hover:text-content-primary",
};

const sizes: Record<string, string> = {
  small: "min-h-10 px-4 text-body-sm",
  medium: "min-h-10 px-5 text-body-sm",
  large: "min-h-12 px-6 text-body",
};

export const Button = ({
  variant = "blue",
  size = "medium",
  onPress,
  label = "New Task +",
  type = "button",
  className = "",
  isLoading = false,
  disabled = false,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-md border-0 font-sans font-semibold",
    "transition-[background-color,color,box-shadow,opacity,transform] duration-200 ease-out",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "active:scale-[0.96]",
    isDisabled ? "cursor-not-allowed opacity-60 active:scale-100" : "cursor-pointer",
    variants[variant],
    sizes[size],
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onPress}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}
      {label}
    </button>
  );
};
