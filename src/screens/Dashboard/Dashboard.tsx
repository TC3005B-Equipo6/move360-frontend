import { Sidebar } from '../../components/SideBar/SideBar';
import { Header } from '../../components/Header/Header';
import { ProfileCard } from '../../components/ProfileCard/ProfileCard';
import { DashboardGrid } from '../../components/Dashboard/DashboardGrid';

export default function DashboardScreen() {
  return (
    <div className="flex flex-row items-center bg-[#E7EEF6] p-8 h-screen w-screen box-border">
      <Sidebar />
      <div className="flex flex-col items-center gap-8 w-full h-full">
        <div className="flex flex-row items-center justify-between w-full px-8 box-border gap-5">
          <Header title="Dashboard" />
          <ProfileCard name="Juan Pérez" role={''} />
        </div>
        <div className="w-full flex-1 min-h-0">
          <DashboardGrid dashboardId="home" />
        </div>
      </div>
    </div>
  );
}
