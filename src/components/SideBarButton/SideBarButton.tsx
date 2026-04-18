import styles from "./SideBarButton.module.css";

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
    iconName= "home",
}: SideBarButtonProps) => {
    const Icon = icons[iconName];
    const classes = [
        styles.button,
        styles[disabled ? "disabled" : "enabled"],
        styles[selected ? "selected" : ""],
        (!disabled && !selected) ? styles.hoverable : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button onClick={onPress} type={"button"} title={tooltip} disabled={disabled} className={classes}>
            <Icon size={50} />
        </button>
    );
};