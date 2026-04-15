import styles from "./ButtonCreate.module.css";

export interface CreateButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  label?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const CreateButton = ({
  variant = "primary",
  size = "medium",
  onPress,
  label = "New Task +",
  className = "",
  type = "button",
}: CreateButtonProps) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} onClick={onPress}>
      {label}
    </button>
  );
};