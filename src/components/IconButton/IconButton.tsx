import styles from "./IconButton.module.css";

import { icons, type IconName } from "../../icons";

export interface IconButtonProps {
    size?: "small" | "large";
    onPress?: () => void;
    iconName?: IconName;
    label?: string;
    type?: "button" | "submit" | "reset";
}

export const IconButton = ({
    size = "small",
    onPress,
    iconName = "sort",
    label = "Nombre",
    type = "button",
}: IconButtonProps) => {
    const Icon = icons[iconName];
    const classes = [
        styles.button,
        styles[size],
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