import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileCard } from '../../components/common/ProfileCard/ProfileCard';
import { ListItem } from '../../components/common/ListItem/ListItem';
import { Button } from '../../components/common/Button/Button';
import {
  listPublicDashboards,
  type PublicDashboardSummary,
} from '../../services/dashboard/dashboardService';
import { useProfile, displayName } from '../../services/auth/useProfile';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function Explore() {
  const navigate = useNavigate();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [dashboards, setDashboards] = useState<PublicDashboardSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadDashboards = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      setDashboards(await listPublicDashboards());
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboards();
  }, [loadDashboards]);

  return (
    <AppLayout
      header={
        <Header
          title="Dashboards públicos"
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
      <div className="mx-5 bg-surface-raised border border-subtle rounded-md shadow-sm h-full overflow-y-auto p-6 flex flex-col gap-4">
        {isLoading ? (
          <p className="m-auto text-body-sm font-medium text-content-muted">Cargando dashboards…</p>
        ) : loadError ? (
          <div className="m-auto flex flex-col items-center gap-3 text-center">
            <p className="m-0 text-body-sm font-medium text-content-secondary">
              No se pudieron cargar los dashboards públicos.
            </p>
            <Button variant="white" size="medium" label="Reintentar" onPress={loadDashboards} />
          </div>
        ) : dashboards.length === 0 ? (
          <div className="m-auto flex flex-col items-center gap-1 text-center">
            <p className="m-0 text-body-lg font-semibold text-content-primary">No hay dashboards públicos</p>
            <p className="m-0 text-body-sm font-medium text-content-muted">
              Cuando alguien publique un dashboard, aparecerá aquí.
            </p>
          </div>
        ) : (
          dashboards.map((dashboard) => (
            <ListItem
              key={dashboard.id}
              title={dashboard.title}
              date={formatDate(dashboard.createdDate)}
              author={dashboard.ownerName}
              iconName="barchart"
              onPress={() => navigate(`/dashboard/${dashboard.id}`)}
            />
          ))
        )}
      </div>
    </AppLayout>
  );
}
