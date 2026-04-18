import styles from "./ListItem.module.css";
import { icons, type IconName } from "../../icons";

export interface ListItemProps {
  title: string;
  // TODO: date comes pre-formatted from the caller for now. When the backend
  // contract is defined, change to Date/ISO string and format inside the component.
  date: string;
  author: string;
  iconName: IconName;
  onPress?: () => void;
  className?: string;
}

export const ListItem = ({
  title,
  date,
  author,
  iconName,
  onPress,
  className = "",
}: ListItemProps) => {
  const Icon = icons[iconName];
  const classes = [styles.item, className].filter(Boolean).join(" ");

  return (
    <button type="button" onClick={onPress} className={classes}>
      <span className={styles.left}>
        <Icon size={32} className={styles.icon} />
        <span className={styles.title}>{title}</span>
      </span>
      <span className={styles.right}>
        <span className={styles.date}>{date}</span>
        <span className={styles.author}>{author}</span>
      </span>
    </button>
  );
};
