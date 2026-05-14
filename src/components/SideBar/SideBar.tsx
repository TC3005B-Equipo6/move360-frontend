import { useState } from "react";
import { SideBarButton, type SideBarButtonProps } from "../SideBarButton/SideBarButton";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth/authService";

export interface SidebarItem {
  id: string;
  props: SideBarButtonProps;
}

export interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = async () => {
    await logout();
    navigate("/");
  };

  const top: SidebarItem[] = [
    { id: "home", 
      props: { 
        tooltip: "Home", iconName: "home", selected: pathname === "/home", onPress: () => navigate("/home")
      } as SideBarButtonProps },
    { id: "explore",
      props: {
        tooltip: "Explore", iconName: "explore", selected: pathname === "/explore", onPress: () => navigate("/explore")
      } as SideBarButtonProps },
    { id: "favorites",
      props: {
        tooltip: "Favorites", iconName: "piechart", selected: pathname === "/graphs", onPress: () => navigate("/dashboard")
      } as SideBarButtonProps },
    { id: "favorites",
      props: {
        tooltip: "Favorites", iconName: "file", selected: pathname === "/reports", onPress: () => navigate("/reports")
      } as SideBarButtonProps },
  ];

  const bottom: SidebarItem[] = [
    { id: "help",
      props: {
        tooltip: "Help", iconName: "help", selected: false 
      } as SideBarButtonProps },
    { id: "logout",
      props: {
        tooltip: "Log out", iconName: "logout", selected: false, onPress: () => setShowLogoutModal(true)
      } as SideBarButtonProps },
  ];
  return (
    <>
      <nav className={`bg-white rounded-[50px] flex flex-col justify-between h-full w-[100px] pt-[50px] pb-5 box-border ${className}`}>
        <div className="flex flex-col items-center gap-5">
          {top.map((it) => (
            <SideBarButton key={it.id} {...it.props} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-5">
          {bottom.map((it) => (
            <SideBarButton key={it.id} {...it.props} />
          ))}
        </div>
      </nav>

      {showLogoutModal && (
        <Modal
          title="Cerrar sesión"
          message="¿Estás seguro de que deseas"
          secondaryMessage="cerrar sesión?"
          onClose={() => setShowLogoutModal(false)}
          footer={
            <>
              <Button variant="white" size="large" label="Cancelar" onPress={() => setShowLogoutModal(false)} />
              <Button variant="red" size="large" label="Cerrar sesión" onPress={handleConfirmLogout} />
            </>
          }
        />
      )}
    </>
  );
}
