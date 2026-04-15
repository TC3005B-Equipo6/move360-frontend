import type { ReactNode } from "react";
import styles from "./Header.module.css";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightComponent?: ReactNode;
};

export function Header({
  title,
  subtitle,
  onBack,
  rightComponent,
}: HeaderProps) {
  return (
    <header className={styles.container}>
      <div className={styles.left}>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className={styles.backButton}
            aria-label="Go back"
          >
            <span className={styles.backIcon}>‹</span>
          </button>
        ) : null}
      </div>

      <div className={styles.center}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>

      <div className={styles.right}>{rightComponent ?? null}</div>
    </header>
  );
}