import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  const classes = [
    "inline-flex flex-col min-w-[140px] bg-white rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden font-[Inter,sans-serif]",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={menuRef}
      className={classes}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      role="menu"
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 px-[14px] py-[10px] bg-transparent border-0 cursor-pointer text-[#dc2626] font-[inherit] text-[15px] font-medium text-left transition-colors duration-150 hover:bg-[#f3f4f6] active:bg-[#fee2e2] active:scale-[0.98]"
        onClick={onDelete}
        role="menuitem"
      >
        <TrashIcon size={20} className="shrink-0" />
        <span className="capitalize whitespace-nowrap">Eliminar</span>
      </button>
      <div className="h-px bg-[#e5e7eb] w-full" />
      <button
        type="button"
        className="inline-flex items-center gap-2 px-[14px] py-[10px] bg-transparent border-0 cursor-pointer text-[#1f4e79] font-[inherit] text-[15px] font-medium text-left transition-colors duration-150 hover:bg-[#f3f4f6] active:bg-[#e5e7eb] active:scale-[0.98]"
        onClick={onEdit}
        role="menuitem"
      >
        <EditIcon size={20} className="shrink-0" />
        <span className="capitalize whitespace-nowrap">Editar</span>
      </button>
    </div>
  );
};
