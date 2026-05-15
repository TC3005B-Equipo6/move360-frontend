import { useState } from "react";
import { SideBarButton, type SideBarButtonProps } from "../SideBarButton/SideBarButton";
import { Modal } from "../../common/Modal/Modal";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth/authService";

export interface SidebarItem {
  id: string;
  props: SideBarButtonProps;
}

export interface SidebarProps {
  className?: string;
  /** Additive: controlled collapsed state (rail width). Uncontrolled if omitted. */
  collapsed?: boolean;
  /** Additive: toggle handler. Falls back to internal state if omitted. */
  onToggle?: () => void;
}

export const Sidebar = ({ className = "", collapsed, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Controlled when `collapsed` is provided (AppLayout); uncontrolled otherwise.
  const isCollapsed = collapsed ?? internalCollapsed;
  const handleToggle = onToggle ?? (() => setInternalCollapsed((v) => !v));

  const handleConfirmLogout = async () => {
    await logout();
    navigate("/");
  };

  const top: SidebarItem[] = [
    {
      id: "home",
      props: {
        tooltip: "Inicio", label: "Inicio", iconName: "home", collapsed: isCollapsed,
        selected: pathname === "/home", onPress: () => navigate("/home"),
      },
    },
    {
      id: "explore",
      props: {
        tooltip: "Explorar", label: "Explorar", iconName: "explore", collapsed: isCollapsed,
        selected: pathname === "/explore", onPress: () => navigate("/explore"),
      },
    },
    {
      id: "dashboards",
      props: {
        tooltip: "Dashboards", label: "Dashboards", iconName: "piechart", collapsed: isCollapsed,
        selected: pathname === "/dashboard", onPress: () => navigate("/dashboard"),
      },
    },
    {
      id: "reports",
      props: {
        tooltip: "Reportes", label: "Reportes", iconName: "file", collapsed: isCollapsed,
        selected: pathname === "/reports", onPress: () => navigate("/reports"),
      },
    },
  ];

  const bottom: SidebarItem[] = [
    {
      id: "help",
      props: { tooltip: "Ayuda", label: "Ayuda", iconName: "help", collapsed: isCollapsed, selected: false },
    },
    {
      id: "logout",
      props: {
        tooltip: "Cerrar sesión", label: "Cerrar sesión", iconName: "logout", collapsed: isCollapsed,
        selected: false, onPress: () => setShowLogoutModal(true),
      },
    },
  ];

  return (
    <>
      <nav
        className={`shrink-0 flex flex-col justify-between h-full bg-surface-raised border-r border-subtle overflow-hidden py-4 box-border ${className}`}
        style={{ width: isCollapsed ? 64 : 172, transition: "width 220ms cubic-bezier(0.2,0,0,1)" }}
      >
        <div className="flex flex-col gap-6">
          {/* Toggle + wordmark — the wordmark only shows when the rail is expanded. */}
          <div className="flex items-center gap-2 h-10 px-3">
            <button
              type="button"
              onClick={handleToggle}
              aria-label={isCollapsed ? "Abrir menú" : "Cerrar menú"}
              className="grid place-items-center w-10 h-10 shrink-0 rounded-md text-content-secondary cursor-pointer transition-[background-color,transform] duration-150 hover:bg-surface-sunken active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="block w-[18px] h-[2px] rounded-full bg-current" />
                <span className="block w-[18px] h-[2px] rounded-full bg-current" />
                <span className="block w-[18px] h-[2px] rounded-full bg-current" />
              </span>
            </button>
            <img
              src="/move360.png"
              alt="Move360"
              className={`h-5 w-auto max-w-[104px] object-contain shrink-0 transition-opacity duration-150 ${
                isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
          </div>

          <div className="flex flex-col gap-1 px-3">
            {top.map((it) => (
              <SideBarButton key={it.id} {...it.props} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 px-3">
          {bottom.map((it) => (
            <SideBarButton key={it.id} {...it.props} />
          ))}
        </div>
      </nav>

      {showLogoutModal && (
        <Modal
          className="w-[430px] px-8 py-8"
          onClose={() => setShowLogoutModal(false)}
          footer={
            <div className="flex w-full items-center justify-between gap-4">
              <button
                type="button"
                className="inline-flex min-h-12 w-[150px] cursor-pointer items-center justify-center rounded-md border-0 bg-surface-raised px-5 font-sans text-body font-semibold text-content-secondary shadow-xs ring-1 ring-inset ring-border transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-surface-sunken hover:text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 w-[170px] cursor-pointer items-center justify-center rounded-md border-0 bg-danger px-5 font-sans text-body font-semibold text-content-on-primary shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[#9f2f24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
                onClick={handleConfirmLogout}
              >
                Cerrar sesión
              </button>
            </div>
          }
        >
          <p className="m-0 text-center text-wrap-balance text-h3 font-semibold leading-tight text-content-primary">
            ¿Estás seguro de que deseas
            <br />
            cerrar sesión?
          </p>
        </Modal>
      )}
    </>
  );
}
