import { Sidebar } from '../../components/navigation/SideBar/SideBar';
import { Header } from '../../components/navigation/Header/Header';
import { ProfileCard } from '../../components/common/ProfileCard/ProfileCard';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';
import { HOME_DASHBOARD_ITEMS } from '../../databases/dashboardData';

export default function HomeScreen() {
  return (
    <div className="flex flex-row items-center bg-[#E7EEF6] p-8 h-screen w-screen box-border">
      <Sidebar className="shrink-0" />
      <div className="flex flex-col items-center gap-8 w-full h-full min-w-0">
        <div className="flex w-full flex-col gap-1 px-8 box-border">
          <div className="flex flex-row items-center justify-between w-full gap-5">
            <div className="flex-1 min-w-0">
              <Header title="Movilidad 2025-2026" />
            </div>
            <ProfileCard name="Juan Pérez" role={''} className="shrink-0" />
          </div>
          <p className="text-sm text-[#5f6f8a] font-[Inter,sans-serif] pl-1">
            Metro, Metrobús y Tren Ligero · Marzo 2025 - Febrero 2026
          </p>
        </div>
        <div className="w-full flex-1 min-h-0">
          <DashboardGrid readonly initialItems={HOME_DASHBOARD_ITEMS} />
        </div>
      </div>
    </div>
  );
}
