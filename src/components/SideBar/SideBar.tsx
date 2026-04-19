import styles from "./SideBar.module.css";
import { SideBarButton, type SideBarButtonProps } from "../SideBarButton/SideBarButton";

export interface SidebarItem {
  id: string;
  props: SideBarButtonProps;
}

export interface SidebarProps {
  topItems?: SidebarItem[];
  bottomItems?: SidebarItem[];
  className?: string;
}

export const Sidebar = ( {topItems = [], bottomItems = [], className = "" }: SidebarProps) => (
  <nav className={`${styles.sidebar} ${className}`}>
    <div className={styles.items}>
        {topItems.map((it) => (
          <SideBarButton key={it.id} {...it.props} />
        ))}
      </div>
      <div className={styles.items}>
        {bottomItems.map((it) => (
          <SideBarButton key={it.id} {...it.props} />
        ))}
      </div>
  </nav>
);
