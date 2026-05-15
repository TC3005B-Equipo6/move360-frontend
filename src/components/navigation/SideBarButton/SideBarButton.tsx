import { icons, type IconName } from "../../../icons";

export interface SideBarButtonProps {
    disabled?: boolean;
    selected?: boolean;
    onPress?: () => void;
    tooltip?: string;
    className?: string;
    iconName?: IconName;
    /** Additive: text label shown beside the icon when the rail is expanded. */
    label?: string;
    /** Additive: when true, the label is hidden (rail collapsed). */
    collapsed?: boolean;
}

export const SideBarButton = ({
    disabled = false,
    selected = false,
    onPress,
    tooltip = "add",
    className = "",
    iconName = "home",
    label,
    collapsed = false,
}: SideBarButtonProps) => {
    const Icon = icons[iconName];
    const classes = [
        "flex items-center gap-3 w-full h-11 px-2.5 rounded-md border-0 cursor-pointer transition-[background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        disabled
            ? "bg-transparent text-border-strong cursor-not-allowed"
            : selected
            ? "bg-primary text-content-on-primary"
            : "bg-transparent text-content-secondary hover:bg-surface-sunken active:scale-[0.96]",
        className,
    ].filter(Boolean).join(" ");

    return (
        <button onClick={onPress} type="button" title={tooltip} disabled={disabled} className={classes}>
            <span className="grid place-items-center w-6 shrink-0">
                <Icon size={22} />
            </span>
            {label && (
                <span
                    className={[
                        "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-body-sm font-medium transition-opacity duration-150",
                        collapsed ? "opacity-0 pointer-events-none" : "opacity-100",
                    ].join(" ")}
                >
                    {label}
                </span>
            )}
        </button>
    );
};
