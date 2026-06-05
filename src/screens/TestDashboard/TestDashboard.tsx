import { AppLayout } from '../../components/navigation/AppLayout/AppLayout';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileMenu } from '../../components/navigation/ProfileMenu/ProfileMenu';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';
import { useProfile } from '../../services/auth/useProfile';

export default function DashboardScreen() {
  const { profile, isLoading: isProfileLoading } = useProfile();
  return (
    <AppLayout
      header={
        <Header
          title="Movilidad 2025-2026"
          subtitle="Metro, Metrobús y Tren Ligero · Marzo 2025 – Febrero 2026"
          profile={<ProfileMenu profile={profile} isLoading={isProfileLoading} />}
        />
      }
    >
      <DashboardGrid dashboardId="home" />
    </AppLayout>
  );
}
