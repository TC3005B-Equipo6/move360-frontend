import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileCard } from '../../components/common/ProfileCard/ProfileCard';
import { Button } from '../../components/common/Button/Button';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';
import { getDashboard, type DashboardSummary } from '../../services/dashboard/dashboardService';

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
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [notFound, setNotFound] = useState(false);

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
          profile={<ProfileCard variant="compact" name="Juan Pérez" role="Analista de movilidad" />}
        />
      }
    >
      <DashboardGrid dashboardId={dashboardId} />
    </AppLayout>
  );
}

export default function DashboardDetail() {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  if (!dashboardId) return <NotFound />;
  return <DashboardDetailView key={dashboardId} dashboardId={dashboardId} />;
}
