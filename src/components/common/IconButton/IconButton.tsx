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
    small: "rounded-[20px] justify-center w-[60px] h-[60px]",
    large: "rounded-[15px] justify-around w-[200px] h-[60px] gap-[30px] px-6 py-3",
};

const colors: Record<string, string> = {
    primary: "bg-[#1F4E79] text-white font-medium",
    secondary: "bg-[#E7EEF6] text-[#1F4E79] font-medium",
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
    const classes = [
        "border-0 inline-flex items-center cursor-pointer transition-[opacity,transform] duration-200 font-[Inter,sans-serif] text-[25px]",
        sizes[size],
        colors[color],
    ].filter(Boolean).join(" ");

    return (
        <button type={type} className={classes} onClick={onPress}>
            <Icon size={45} />
            {label && <span>{label}</span>}
        </button>
    );
};
