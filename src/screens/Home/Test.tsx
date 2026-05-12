import { Sidebar } from '../../components/SideBar/SideBar';
import { Header } from '../../components/Header/Header';
import { ProfileCard } from '../../components/ProfileCard/ProfileCard';
import { AddButton } from '../../components/AddButton/AddButton'; 
import { HomeGrid } from '../../components/Indicator/HomeGrid';
import { AddWidgetModal } from "../../components/Indicator/AddWidget";
import { useState, useEffect} from "react";

export default function HomeScreen() {

  const [widgets, setWidgets] = useState<any[]>(
  () => {
    const saved =
      localStorage.getItem(
        "homeWidgets"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  }
);

  const [showModal, setShowModal] =
    useState(false);
    useEffect(() => {
    localStorage.setItem(
      "homeWidgets",
      JSON.stringify(widgets)
    );
  }, [widgets]);
  return (
    <div className="flex flex-row items-center bg-[#E7EEF6] p-8 h-screen w-screen box-border">
      <Sidebar />
      <div className="flex flex-col items-center gap-8 w-full h-full">
        <div className="flex flex-row items-center justify-between w-full px-8 box-border gap-5">
          <Header title="Bienvenido" />
          <ProfileCard
            name="Juan Pérez"
            role=""
          />
        </div>
        <div className="w-full flex-1 overflow-auto px-8">
          <HomeGrid widgets={widgets} />
        </div>
        <AddButton
          onPress={() =>
            setShowModal(true)
          }
          className="absolute bottom-8 right-8"
        />

        {showModal && (
          <AddWidgetModal
            onClose={() =>
              setShowModal(false)
            }
            onAddWidget={(widget) => {
              setWidgets((prev) => [
                ...prev,
                widget,
              ]);
            }}
          />
        )}

      </div>
    </div>
  );
}
