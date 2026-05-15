

import { Sidebar } from '../../components/SideBar/SideBar';
import { Header } from '../../components/Header/Header';
import { ProfileCard } from '../../components/ProfileCard/ProfileCard';
import { ListItem } from '../../components/ListItem/ListItem';

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
    <div className="flex flex-row items-center bg-[#E7EEF6] p-8 h-screen w-screen box-border">
      <Sidebar className="shrink-0" />
      <div className="flex flex-col items-center gap-8 w-full h-full min-w-0">
        <div className="flex w-full flex-col gap-1 px-8 box-border">
          <div className="flex flex-row items-center justify-between w-full gap-5">
            <div className="flex-1 min-w-0">
              <Header title="Mis Dashboards" />
            </div>
            <ProfileCard name="Juan Pérez" role={''} className="shrink-0" />
          </div>
        </div>
        <div className="w-full flex-1 min-h-0 px-8">
          <div className="bg-white rounded-[20px] h-full overflow-y-auto p-6 flex flex-col gap-4">
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
        </div>
      </div>
    </div>
  );
}