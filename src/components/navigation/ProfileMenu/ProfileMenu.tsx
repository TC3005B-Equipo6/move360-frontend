import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileCard } from "../../common/ProfileCard/ProfileCard";
import { LogoutConfirmModal } from "../LogoutConfirmModal/LogoutConfirmModal";
import { icons } from "../../../icons";
import { logout, type UserProfile } from "../../../services/auth/authService";
import { displayName } from "../../../services/auth/useProfile";

export interface ProfileMenuProps {
  profile: UserProfile | null;
  isLoading?: boolean;
}

const LogoutIcon = icons.logout;

const fullName = (profile: UserProfile | null): string =>
  profile
    ? [profile.firstName, profile.surname, profile.maternalSurname].filter(Boolean).join(" ") || displayName(profile)
    : displayName(profile);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-caption font-semibold uppercase tracking-wide text-content-muted">{label}</span>
    <span className="text-body-sm font-medium text-content-primary [overflow-wrap:anywhere]">{value || "—"}</span>
  </div>
);

// The compact ProfileCard chip becomes a trigger that toggles a dropdown with
// the user's full data and a logout action (same flow as the sidebar button).
export const ProfileMenu = ({ profile, isLoading = false }: ProfileMenuProps) => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleConfirmLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div ref={ref} className="relative">
      <ProfileCard
        variant="compact"
        name={displayName(profile)}
        role={profile?.role ?? ""}
        isLoading={isLoading}
        onClick={() => setOpen((o) => !o)}
      />
      {open && !isLoading && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[1000] mt-2 w-[300px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl bg-surface-overlay shadow-xl ring-1 ring-inset ring-border-subtle"
        >
          <div className="flex flex-col gap-3 p-4">
            <Row label="Nombre completo" value={fullName(profile)} />
            <Row label="Rol" value={profile?.role ?? ""} />
            <Row label="Correo" value={profile?.email ?? ""} />
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setShowLogoutModal(true);
            }}
            className="flex w-full items-center gap-2 border-t border-border-subtle px-4 py-3 text-body-sm font-semibold text-danger transition-colors hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-danger"
          >
            <LogoutIcon size={18} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
      {showLogoutModal && (
        <LogoutConfirmModal onClose={() => setShowLogoutModal(false)} onConfirm={handleConfirmLogout} />
      )}
    </div>
  );
};
