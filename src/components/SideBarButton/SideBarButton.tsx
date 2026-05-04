import { icons, type IconName } from "../../icons";

export interface SideBarButtonProps {
    disabled?: boolean;
    selected?: boolean;
    onPress?: () => void;
    tooltip?: string;
    className?: string;
    iconName?: IconName;
}

export const SideBarButton = ({
    disabled = false,
    selected = false,
    onPress,
    tooltip = "add",
    className = "",
    iconName = "home",
}: SideBarButtonProps) => {
    const Icon = icons[iconName];
    const classes = [
        "border-0 rounded-[50px] cursor-pointer transition-[opacity,transform] duration-200 w-[70px] h-[70px] font-bold flex items-center justify-center",
        disabled
            ? "bg-white text-[#E2E2E2] cursor-not-allowed"
            : selected
            ? "bg-[#E7EEF6] text-[#1F4E79]"
            : "bg-white text-[#64748B] hover:bg-[#f0f0f0]",
        className,
    ].filter(Boolean).join(" ");

    return (
        <button onClick={onPress} type="button" title={tooltip} disabled={disabled} className={classes}>
            <Icon size={50} />
        </button>
    );
};
