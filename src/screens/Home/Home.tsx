import { useState } from "react";
import { AppLayout } from "../../components/navigation/AppLayout/AppLayout";
import { Header } from "../../components/navigation/Header/Header";
import { ProfileCard } from "../../components/common/ProfileCard/ProfileCard";
import { IconButton } from "../../components/common/IconButton/IconButton";
import { Modal } from "../../components/common/Modal/Modal";
import { DashboardGrid } from "../../components/dashboard/DashboardGrid";
import { HOME_DASHBOARD_ITEMS } from "../../databases/dashboardData";
import { useProfile, displayName } from "../../services/auth/useProfile";

export default function HomeScreen() {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  function handleConfirm() {
    // TODO: llamada REST para persistir cambios de layout
    setIsConfirmModalOpen(false);
    setIsEditing(false);
  }

  return (
    <>
    <AppLayout
      header={
        <Header
          title="Movilidad Febrero 2026"
          subtitle="Afluencia e incidencias por servicio de transporte · Comparativo contra enero 2026"
          actions={
            <div className="flex items-center gap-2">
              {isEditing ? (
                // En modo edición el único camino de salida es confirmar: el
                // botón editar se reemplaza por el de confirmar (flujo forzado).
                <IconButton
                  size="small"
                  iconName="checkCircle"
                  iconSize={26}
                  label=""
                  className="!h-14 !w-14 !rounded-xl !shadow-sm"
                  color="primary"
                  onPress={() => setIsConfirmModalOpen(true)}
                  aria-label="Confirmar cambios"
                  tooltip="Confirmar"
                />
              ) : (
                <IconButton
                  size="small"
                  iconName="edit"
                  iconSize={26}
                  label=""
                  className="!h-14 !w-14 !rounded-xl !shadow-sm !bg-surface-raised !text-primary !ring-1 !ring-inset !ring-border-strong hover:!bg-primary-subtle hover:!text-primary-hover"
                  color="secondary"
                  onPress={() => setIsEditing(true)}
                  aria-label="Editar"
                  tooltip="Editar"
                />
              )}
            </div>
          }
          profile={
            <ProfileCard
              variant="compact"
              name={displayName(profile)}
              role={profile?.role ?? ""}
              isLoading={isProfileLoading}
            />
          }
        />
      }
    >
      <DashboardGrid
        readonly={!isEditing}
        dashboardId="home"
        initialItems={HOME_DASHBOARD_ITEMS}
        bottomBufferRows={0}
      />
    </AppLayout>
    {isConfirmModalOpen && (
      <Modal
        title="Confirmar cambios"
        message="¿Deseas guardar los cambios realizados en el dashboard?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        confirmVariant="blue"
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmModalOpen(false)}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    )}
    </>
  );
}
