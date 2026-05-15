import { useEffect, useLayoutEffect, useRef } from "react";
import { icons } from "../../../icons";

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

  useLayoutEffect(() => {
    const node = menuRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = Math.min(0, window.innerWidth - rect.right - 8);
    const y = Math.min(0, window.innerHeight - rect.bottom - 8);
    node.style.transform = `translate(${x}px, ${y}px)`;
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

  const classes = [
    "inline-flex flex-col min-w-[140px] bg-surface-overlay border border-subtle rounded-md shadow-md overflow-hidden",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={menuRef}
      className={classes}
      role="menu"
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 px-[14px] py-[10px] min-h-10 bg-transparent border-0 cursor-pointer text-danger text-body-sm font-medium text-left transition-[background-color,scale] duration-150 hover:bg-surface-sunken active:bg-danger-subtle active:scale-[0.96]"
        onClick={onDelete}
        role="menuitem"
      >
        <TrashIcon size={20} className="shrink-0" />
        <span className="capitalize whitespace-nowrap">Eliminar</span>
      </button>
      <div className="h-px bg-border-subtle w-full" />
      <button
        type="button"
        className="inline-flex items-center gap-2 px-[14px] py-[10px] min-h-10 bg-transparent border-0 cursor-pointer text-primary text-body-sm font-medium text-left transition-[background-color,scale] duration-150 hover:bg-surface-sunken active:bg-surface-sunken active:scale-[0.96]"
        onClick={onEdit}
        role="menuitem"
      >
        <EditIcon size={20} className="shrink-0" />
        <span className="capitalize whitespace-nowrap">Editar</span>
      </button>
    </div>
  );
};
