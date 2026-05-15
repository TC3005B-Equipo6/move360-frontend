import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileCard } from '../../components/common/ProfileCard/ProfileCard';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

export default function DashboardScreen() {
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
      <DashboardGrid dashboardId="home" />
    </AppLayout>
  );
}
