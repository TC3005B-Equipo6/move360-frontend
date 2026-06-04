import { icons, type IconName } from "../../../icons";

export interface IconButtonProps {
    size?: "small" | "large";
    color?: "primary" | "secondary";
    onPress?: () => void;
    iconName?: IconName;
    iconSize?: number;
    label?: string;
    className?: string;
    "aria-label"?: string;
    type?: "button" | "submit" | "reset";
    tooltip?: string;
}

const sizes: Record<string, string> = {
    small: "h-11 w-11 rounded-md justify-center",
    large: "min-h-11 rounded-md justify-center gap-2.5 px-4 py-2.5 text-body-sm",
};

const colors: Record<string, string> = {
    primary: "bg-primary text-content-on-primary shadow-sm hover:bg-primary-hover active:bg-primary-active",
    secondary: "bg-primary-subtle text-primary shadow-xs hover:bg-surface-sunken hover:text-primary-hover",
};

export const IconButton = ({
    size = "small",
    color = "primary",
    onPress,
    iconName = "sort",
    iconSize,
    label = "",
    className = "",
    "aria-label": ariaLabel,
    type = "button",
    tooltip,
}: IconButtonProps) => {
    const Icon = icons[iconName];
    const resolvedIconSize = iconSize ?? (size === "small" ? 22 : 20);
    const classes = [
        "border-0 inline-flex items-center font-sans font-semibold cursor-pointer",
        "transition-[background-color,color,box-shadow,opacity,transform] duration-200 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "active:scale-[0.96]",
        sizes[size],
        colors[color],
        className,
    ].filter(Boolean).join(" ");

    const button = (
        <button type={type} className={classes} onClick={onPress} aria-label={ariaLabel || label || undefined}>
            <Icon size={resolvedIconSize} aria-hidden="true" />
            {label && <span className="whitespace-nowrap">{label}</span>}
        </button>
    );

    if (!tooltip) return button;

    return (
        <div className="relative inline-flex group">
            {button}
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-50">
                {tooltip}
            </span>
        </div>
    );
};
