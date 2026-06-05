import { AppLayout } from "../../components/navigation/AppLayout/AppLayout";
import { Header } from "../../components/navigation/Header/Header";
import { ProfileMenu } from "../../components/navigation/ProfileMenu/ProfileMenu";
import { DashboardGrid } from "../../components/dashboard/DashboardGrid";
import { HOME_DASHBOARD_ITEMS } from "../../databases/dashboardData";
import { useProfile } from "../../services/auth/useProfile";

export default function HomeScreen() {
  const { profile, isLoading: isProfileLoading } = useProfile();

  return (
    <AppLayout
      header={
        <Header
          title="Movilidad Febrero 2026"
          subtitle="Afluencia e incidencias por servicio de transporte · Comparativo contra enero 2026"
          profile={<ProfileMenu profile={profile} isLoading={isProfileLoading} />}
        />
      }
    >
      <DashboardGrid
        readonly
        dashboardId="home"
        initialItems={HOME_DASHBOARD_ITEMS}
        bottomBufferRows={0}
      />
    </AppLayout>
  );
}
