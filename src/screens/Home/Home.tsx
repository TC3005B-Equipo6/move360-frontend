import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileCard } from '../../components/common/ProfileCard/ProfileCard';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';
import { HOME_DASHBOARD_ITEMS } from '../../databases/dashboardData';

export default function HomeScreen() {
  return (
    <AppLayout
      header={
        <Header
          title="Movilidad 2025-2026"
          subtitle="Metro, Metrobús y Tren Ligero · Marzo 2025 – Febrero 2026"
          profile={<ProfileCard variant="compact" name="Juan Pérez" />}
        />
      }
    >
      <DashboardGrid readonly initialItems={HOME_DASHBOARD_ITEMS} />
    </AppLayout>
  );
}
