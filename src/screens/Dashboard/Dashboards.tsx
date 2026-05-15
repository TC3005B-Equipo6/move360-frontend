import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileCard } from '../../components/common/ProfileCard/ProfileCard';
import { ListItem } from '../../components/common/ListItem/ListItem';

interface Dashboard {
  id: string;
  title: string;
  createdAt: string;
  owner: string;
}

const DASHBOARDS: Dashboard[] = [
  {
    id: '1',
    title: 'Movilidad 2025-2026',
    createdAt: '2025-03-01',
    owner: 'Juan Pérez',
  },
  {
    id: '2',
    title: 'Análisis de Metro L2',
    createdAt: '2025-04-15',
    owner: 'María García',
  },
  {
    id: '3',
    title: 'Reporte Mensual Metrobús',
    createdAt: '2025-05-10',
    owner: 'Juan Pérez',
  },
  {
    id: '4',
    title: 'Tendencias de Pago',
    createdAt: '2025-05-12',
    owner: 'Carlos López',
  },
  {
    id: '5',
    title: 'Ocupación Tren Ligero',
    createdAt: '2025-05-13',
    owner: 'Juan Pérez',
  },
];

export default function Dashboards() {
  const dashboards = DASHBOARDS;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDashboardClick = (dashboardId: string) => {
    // TODO: Navigate to dashboard detail page
    console.log('Navigate to dashboard:', dashboardId);
  };

  return (
    <AppLayout
      header={
        <Header
          title="Mis Dashboards"
          profile={<ProfileCard variant="compact" name="Juan Pérez" />}
        />
      }
    >
      <div className="bg-surface-raised border border-subtle rounded-md shadow-sm h-full overflow-y-auto p-6 flex flex-col gap-4">
        {dashboards.map((dashboard) => (
          <ListItem
            key={dashboard.id}
            title={dashboard.title}
            date={formatDate(dashboard.createdAt)}
            author={dashboard.owner}
            iconName="file"
            onPress={() => handleDashboardClick(dashboard.id)}
          />
        ))}
      </div>
    </AppLayout>
  );
}
