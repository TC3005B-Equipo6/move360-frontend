import styles from "./IconButton.module.css";

import { icons, type IconName } from "../../icons";

export interface IconButtonProps {
    size?: "small" | "large";
    color?: "primary" | "secondary";
    onPress?: () => void;
    iconName?: IconName;
    label?: string;
    type?: "button" | "submit" | "reset";
}

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
        styles.button,
        styles[size],
        styles[color],
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button type={type} className={classes} onClick={onPress}>
            <Icon size={45} />
            {label && <span className={styles.label}>{label}</span>}
        </button>
    );
}