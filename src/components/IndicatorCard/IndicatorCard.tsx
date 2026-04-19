import styles from "./IndicatorCard.module.css";
import { icons } from "../../icons";

export type IndicatorTone = "positive" | "negative" | "neutral";

export interface IndicatorCardProps {
  value: string;
  label: string;
  tone: IndicatorTone;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
  className?: string;
}

export const IndicatorCard = ({
  value,
  label,
  tone,
  onMenuClick,
  isMenuOpen = false,
  className = "",
}: IndicatorCardProps) => {
  const MoreIcon = icons.more;
  const classes = [styles.card, styles[tone], className].filter(Boolean).join(" ");
  const menuButtonClasses = [styles.menuButton, isMenuOpen ? styles.menuButtonOpen : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {onMenuClick && (
        <button
          type="button"
          aria-label="More options"
          className={menuButtonClasses}
          onClick={onMenuClick}
          data-action-menu-trigger
        >
          <MoreIcon size={20} />
        </button>
      )}
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
};
