import { icons, type IconName } from "../../../icons";

export interface IconButtonProps {
    size?: "small" | "large";
    color?: "primary" | "secondary";
    onPress?: () => void;
    iconName?: IconName;
    label?: string;
    type?: "button" | "submit" | "reset";
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
    label = "",
    type = "button",
}: IconButtonProps) => {
    const Icon = icons[iconName];
    const iconSize = size === "small" ? 22 : 20;
    const classes = [
        "border-0 inline-flex items-center font-sans font-semibold cursor-pointer",
        "transition-[background-color,color,box-shadow,opacity,transform] duration-200 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "active:scale-[0.96]",
        sizes[size],
        colors[color],
    ].filter(Boolean).join(" ");

    return (
        <button type={type} className={classes} onClick={onPress}>
            <Icon size={iconSize} aria-hidden="true" />
            {label && <span className="whitespace-nowrap">{label}</span>}
        </button>
    );
};
