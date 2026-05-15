import { useEffect, useRef } from "react";

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
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
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
    <div
      ref={panelRef}
      className="inline-flex flex-col justify-center gap-5 px-10 py-[26px] bg-surface-overlay border border-subtle shadow-md rounded-xl h-[150px] w-[400px] items-center cursor-not-allowed opacity-70"
    >
      <p className="m-0 text-content-muted text-h3 font-semibold">{user.name}</p>
      <p className="m-0 text-content-muted text-h3 font-semibold">{user.email}</p>
    </div>
  );
};
