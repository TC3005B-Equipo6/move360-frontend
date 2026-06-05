import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileMenu } from '../../components/navigation/ProfileMenu/ProfileMenu';
import { ListItem } from '../../components/common/ListItem/ListItem';
import { AddButton } from '../../components/common/AddButton/AddButton';
import { OverflowMenuButton } from '../../components/common/OverflowMenuButton/OverflowMenuButton';
import { ActionMenu } from '../../components/common/ActionMenu/ActionMenu';
import { Modal } from '../../components/common/Modal/Modal';
import { Button } from '../../components/common/Button/Button';
import { CreateDashboardModal } from '../../components/dashboard/CreateDashboardModal';
import { DashboardDetailsModal } from '../../components/dashboard/DashboardDetailsModal/DashboardDetailsModal';
import {
  listDashboards,
  deleteDashboard,
  type UserDashboardSummary,
} from '../../services/dashboard/dashboardService';
import { useProfile } from '../../services/auth/useProfile';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function Dashboards() {
  const navigate = useNavigate();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [dashboards, setDashboards] = useState<UserDashboardSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<UserDashboardSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailsDashboardId, setDetailsDashboardId] = useState<string | null>(null);

  const loadDashboards = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      setDashboards(await listDashboards());
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboards();
  }, [loadDashboards]);

  const handleCreated = (dashboard: UserDashboardSummary) => {
    setCreateOpen(false);
    navigate(`/dashboard/${dashboard.id}`);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteDashboard(pendingDelete.id);
      setDashboards((prev) => prev.filter((d) => d.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      // keep the dialog open so the user can retry
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout
      header={
        <Header
          title="Mis Dashboards"
          profile={<ProfileMenu profile={profile} isLoading={isProfileLoading} />}
        />
      }
    >
      <div className="mx-5 bg-surface-raised border border-subtle rounded-md shadow-sm h-full overflow-y-auto p-6 flex flex-col gap-4">
        {isLoading ? (
          <p className="m-auto text-body-sm font-medium text-content-muted">Cargando dashboards…</p>
        ) : loadError ? (
          <div className="m-auto flex flex-col items-center gap-3 text-center">
            <p className="m-0 text-body-sm font-medium text-content-secondary">
              No se pudieron cargar los dashboards.
            </p>
            <Button variant="white" size="medium" label="Reintentar" onPress={loadDashboards} />
          </div>
        ) : dashboards.length === 0 ? (
          <div className="m-auto flex flex-col items-center gap-1 text-center">
            <p className="m-0 text-body-lg font-semibold text-content-primary">No tienes dashboards aún</p>
            <p className="m-0 text-body-sm font-medium text-content-muted">
              Crea tu primer dashboard con el botón +.
            </p>
          </div>
        ) : (
          dashboards.map((dashboard) => (
            <ListItem
              key={dashboard.id}
              title={dashboard.title}
              date={formatDate(dashboard.createdAt)}
              iconName="barchart"
              onPress={() => navigate(`/dashboard/${dashboard.id}`)}
              actions={
                <div className="relative">
                  <OverflowMenuButton
                    isOpen={openMenuId === dashboard.id}
                    forceVisible
                    label="Opciones del dashboard"
                    onClick={() => setOpenMenuId((id) => (id === dashboard.id ? null : dashboard.id))}
                  />
                  {openMenuId === dashboard.id && (
                    <div className="absolute right-0 top-full z-20 mt-1">
                      <ActionMenu
                        onDetails={() => {
                          setOpenMenuId(null);
                          setDetailsDashboardId(dashboard.id);
                        }}
                        onDelete={() => {
                          setOpenMenuId(null);
                          setPendingDelete(dashboard);
                        }}
                        onClose={() => setOpenMenuId(null)}
                      />
                    </div>
                  )}
                </div>
              }
            />
          ))
        )}
      </div>

      <div className="fixed bottom-8 right-8 z-30">
        <AddButton onPress={() => setCreateOpen(true)} />
      </div>

      {createOpen && (
        <CreateDashboardModal onClose={() => setCreateOpen(false)} onCreated={handleCreated} />
      )}

      {detailsDashboardId && (
        <DashboardDetailsModal
          dashboardId={detailsDashboardId}
          isOwner
          onClose={() => setDetailsDashboardId(null)}
          onIsPublicChange={(id, isPublic) =>
            setDashboards((prev) =>
              prev.map((d) => (d.id === id ? { ...d, isPublic } : d)),
            )
          }
          onTitleChange={(id, title) =>
            setDashboards((prev) =>
              prev.map((d) => (d.id === id ? { ...d, title } : d)),
            )
          }
        />
      )}

      {pendingDelete && (
        <Modal
          title="Eliminar dashboard"
          message={`¿Seguro que quieres eliminar «${pendingDelete.title}»?`}
          secondaryMessage="Esta acción no se puede deshacer."
          iconName="trash"
          onClose={() => !isDeleting && setPendingDelete(null)}
          footer={
            <>
              <Button
                variant="white"
                size="medium"
                label="Cancelar"
                onPress={() => setPendingDelete(null)}
                disabled={isDeleting}
              />
              <Button
                variant="red"
                size="medium"
                label="Eliminar"
                onPress={handleConfirmDelete}
                isLoading={isDeleting}
              />
            </>
          }
        />
      )}
    </AppLayout>
  );
}
