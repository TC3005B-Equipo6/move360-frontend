import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileCard } from '../../components/common/ProfileCard/ProfileCard';
import { IconButton } from '../../components/common/IconButton/IconButton';
import { Button } from '../../components/common/Button/Button';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';
import { getDashboard, type DashboardDetail as DashboardDetailDto } from '../../services/dashboard/dashboardService';
import { useProfile, displayName } from '../../services/auth/useProfile';

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
    <AppLayout
      header={
        <Header
          title={dashboard?.title ?? 'Cargando…'}
          subtitle={dashboard?.description ?? undefined}
          actions={
            <IconButton
              size="small"
              iconName="settings"
              iconSize={26}
              label=""
              className={`!h-14 !w-14 !rounded-xl !shadow-sm ${
                isEditing
                  ? ""
                  : "!bg-surface-raised !text-primary !ring-1 !ring-inset !ring-border-strong hover:!bg-primary-subtle hover:!text-primary-hover"
              }`}
              color={isEditing ? "primary" : "secondary"}
              onPress={() => setIsEditing((value) => !value)}
              aria-label={isEditing ? "Desactivar ajustes" : "Ajustes"}
            />
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
      <DashboardGrid dashboardId={dashboardId} readonly={!isEditing} />
    </AppLayout>
  );
}

export default function DashboardDetail() {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  if (!dashboardId) return <NotFound />;
  return <DashboardDetailView key={dashboardId} dashboardId={dashboardId} />;
}
