import { IconButton } from "../IconButton/IconButton";
import styles from "./Header.module.css";

export type HeaderProps = {
  title: string;
};

export function Header({
  title = "Hola",
}: HeaderProps) {
  return (
    <div className={styles.header}>
      <>{title}</>
      <div style={{ display: "flex", gap: 25 }}>
        <IconButton size="large" iconName="report" label="Reporte" color="secondary" />
        <IconButton size="small" iconName="settings" label="" color="secondary"/>
      </div>
    </div>
  );
}