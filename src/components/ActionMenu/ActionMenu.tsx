import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./ActionMenu.module.css";
import { icons } from "../../icons";

export interface ActionMenuProps {
  onDelete: () => void;
  onEdit: () => void;
  onClose?: () => void;
  className?: string;
}

export const ActionMenu = ({ onDelete, onEdit, onClose, className = "" }: ActionMenuProps) => {
  const TrashIcon = icons.trash;
  const EditIcon = icons.edit;
  const menuRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const rect = menuRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(0, window.innerWidth - rect.right - 8);
    const y = Math.min(0, window.innerHeight - rect.bottom - 8);
    setOffset({ x, y });
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (menuRef.current?.contains(target)) return;
      if (target.closest("[data-action-menu-trigger]")) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const classes = [styles.menu, className].filter(Boolean).join(" ");

  return (
    <div
      ref={menuRef}
      className={classes}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      role="menu"
    >
      <button
        type="button"
        className={`${styles.item} ${styles.danger}`}
        onClick={onDelete}
        role="menuitem"
      >
        <TrashIcon size={20} className={styles.icon} />
        <span className={styles.label}>Eliminar</span>
      </button>
      <div className={styles.divider} />
      <button
        type="button"
        className={styles.item}
        onClick={onEdit}
        role="menuitem"
      >
        <EditIcon size={20} className={styles.icon} />
        <span className={styles.label}>Editar</span>
      </button>
    </div>
  );
};
