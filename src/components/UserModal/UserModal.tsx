import { useEffect, useRef } from "react";
import styles from "./UserModal.module.css";

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
  };
}

export const UserModal = ({ isOpen, onClose, user }: UserModalProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div ref={panelRef} className={styles.panel}>
      <p className={styles.name}>{user.name}</p>
      <p className={styles.email}>{user.email}</p>
    </div>
  );
};