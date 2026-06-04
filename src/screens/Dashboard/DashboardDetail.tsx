import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileCard } from '../../components/common/ProfileCard/ProfileCard';
import { IconButton } from '../../components/common/IconButton/IconButton';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import { DashboardGrid, type DashboardGridHandle } from '../../components/dashboard/DashboardGrid';
import { getDashboard, type DashboardDetail as DashboardDetailDto } from '../../services/dashboard/dashboardService';
import { useProfile, displayName } from '../../services/auth/useProfile';
import { DashboardDetailsModal } from '../../components/dashboard/DashboardDetailsModal/DashboardDetailsModal';

function NotFound() {
  const navigate = useNavigate();
  return (
    <AppLayout header={<Header title="Dashboard no encontrado" />}>
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="m-0 text-body-sm font-medium text-content-secondary">
          El dashboard que buscas no existe o no está disponible.
        </p>
        <Button variant="white" size="medium" label="Volver a mis dashboards" onPress={() => navigate('/dashboard')} />
      </div>
    </AppLayout>
  );
}

// Keyed by dashboard id so navigating between dashboards remounts with fresh state.
function DashboardDetailView({ dashboardId }: { dashboardId: string }) {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [dashboard, setDashboard] = useState<DashboardDetailDto | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const gridRef = useRef<DashboardGridHandle>(null);

  async function handleConfirm() {
    // Persiste en lote los indicadores modificados (coordenada/título/subtítulo).
    try {
      await gridRef.current?.flushModified();
    } catch (e) {
      console.error('PATCH /indicator failed', e);
    }
    setIsConfirmModalOpen(false);
    setIsEditing(false);
  }

  useEffect(() => {
    let active = true;
    getDashboard(dashboardId)
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      });
    return () => {
      active = false;
    };
  }, [dashboardId]);

  if (notFound) return <NotFound />;

  return (
    <>
    <AppLayout
      header={
        <Header
          title={dashboard?.title ?? 'Cargando…'}
          subtitle={dashboard?.description ?? undefined}
          actions={
            <div className="flex items-center gap-2">
              <IconButton
                size="small"
                iconName="info"
                iconSize={26}
                label=""
                className="!h-14 !w-14 !rounded-xl !shadow-sm !bg-surface-raised !text-primary !ring-1 !ring-inset !ring-border-strong hover:!bg-primary-subtle hover:!text-primary-hover"
                color="secondary"
                onPress={() => setIsDetailsOpen(true)}
                aria-label="Ver detalles del dashboard"
                tooltip="Detalles"
              />
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
              role={profile?.role ?? ''}
              isLoading={isProfileLoading}
            />
          }
        />
      }
    >
      <DashboardGrid ref={gridRef} dashboardId={dashboardId} persistIndicators readonly={!isEditing} />
    </AppLayout>
    {isDetailsOpen && (
      <DashboardDetailsModal
        dashboardId={dashboardId}
        isOwner
        onClose={() => setIsDetailsOpen(false)}
        onTitleChange={(_, title) =>
          setDashboard((prev) => (prev ? { ...prev, title } : prev))
        }
      />
    )}
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

export default function DashboardDetail() {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  if (!dashboardId) return <NotFound />;
  return <DashboardDetailView key={dashboardId} dashboardId={dashboardId} />;
}
