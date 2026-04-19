import styles from "./AddButton.module.css";
import { icons } from "../../icons";

export interface AddButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AddButton = ({ onPress, disabled = false, className = "" }: AddButtonProps) => {
  const PlusIcon = icons.plus;
  const classes = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      aria-label="Añadir"
      className={classes}
      onClick={onPress}
      disabled={disabled}
    >
      <PlusIcon size={32} />
    </button>
  );
};
