import { IconButton } from "../IconButton/IconButton";

export type HeaderProps = {
  title: string;
  showReport?: boolean;
  showSettings?: boolean;
};

export function Header({ title = "Hola", showReport = false, showSettings = false }: HeaderProps) {
  return (
    <div className="bg-white rounded-[20px] flex items-center justify-between h-[100px] w-full px-5 font-[Inter,sans-serif] text-[#1F4E79] text-[35px] font-light gap-5">
      <>{title}</>
      {(showReport || showSettings) && (
        <div className="flex gap-[25px]">
          {showReport && <IconButton size="large" iconName="report" label="Reporte" color="secondary" />}
          {showSettings && <IconButton size="small" iconName="settings" label="" color="secondary" />}
        </div>
      )}
    </div>
  );
}
