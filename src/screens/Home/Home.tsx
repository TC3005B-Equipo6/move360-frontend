import { useState } from "react";
import { AppLayout } from "../../components/navigation/AppLayout/AppLayout";
import { Header } from "../../components/navigation/Header/Header";
import { ProfileCard } from "../../components/common/ProfileCard/ProfileCard";
import { IconButton } from "../../components/common/IconButton/IconButton";
import { DashboardGrid } from "../../components/dashboard/DashboardGrid";
import { HOME_DASHBOARD_ITEMS } from "../../databases/dashboardData";
import { useProfile, displayName } from "../../services/auth/useProfile";

export default function HomeScreen() {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <AppLayout
      header={
        <Header
          title="Movilidad Febrero 2026"
          subtitle="Afluencia e incidencias por servicio de transporte · Comparativo contra enero 2026"
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
              role={profile?.role ?? ""}
              isLoading={isProfileLoading}
            />
          }
        />
      }
    >
      <DashboardGrid
        readonly={!isEditing}
        dashboardId="home"
        initialItems={HOME_DASHBOARD_ITEMS}
        bottomBufferRows={0}
      />
    </AppLayout>
  );
}
