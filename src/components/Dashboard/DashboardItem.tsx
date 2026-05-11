import { forwardRef, useState, type CSSProperties, type ReactNode } from "react";
import { Chart } from "../Chart/Chart";
import { IndicatorCard } from "../IndicatorCard/IndicatorCard";
import { ActionMenu } from "../ActionMenu/ActionMenu";
import { icons } from "../../icons";
import type { DashboardItem as Item } from "./types";
import { MOCK_DONUT, MOCK_INDICATOR } from "./mocks";

interface Props {
  item: Item;
  onDelete: (id: string) => void;
  // RGL inyecta estas props vía cloneElement; las recibimos y reenviamos al DOM root.
  style?: CSSProperties;
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  children?: ReactNode;
}

const chartSizeMap = {
  chartSm: "sm",
  chartMd: "md",
  chartLg: "lg",
} as const;

export const DashboardItem = forwardRef<HTMLDivElement, Props>(function DashboardItem(
  { item, onDelete, style, className, onMouseDown, onMouseUp, onTouchEnd, children },
  ref,
) {
  const [menuOpen, setMenuOpen] = useState(false);
  const MoreIcon = icons.more;

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((o) => !o);
  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(item.id);
  };

  const renderContent = () => {
    if (item.type === "indicator") {
      return (
        <IndicatorCard
          value={MOCK_INDICATOR.value}
          label={MOCK_INDICATOR.label}
          tone={MOCK_INDICATOR.tone}
          onMenuClick={toggleMenu}
          isMenuOpen={menuOpen}
        />
      );
    }
    return (
      <div className="relative w-full h-full">
        <Chart type="donut" data={MOCK_DONUT} size={chartSizeMap[item.type]} title="Gráfica" />
        <button
          type="button"
          aria-label="More options"
          data-action-menu-trigger
          className="item-menu absolute top-4 right-4 inline-flex items-center justify-center w-8 h-8 p-0 bg-white/80 hover:bg-white border-0 rounded-full text-[#5f6f8a] cursor-pointer shadow-sm"
          onClick={toggleMenu}
        >
          <MoreIcon size={20} />
        </button>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      style={style}
      className={className}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
    >
      {renderContent()}
      {menuOpen && (
        <div className="item-menu absolute top-12 right-3 z-20">
          <ActionMenu onDelete={handleDelete} onEdit={closeMenu} onClose={closeMenu} />
        </div>
      )}
      {/* RGL placeholder children (resize handles, etc.) — no se usan aquí pero los reenviamos */}
      {children}
    </div>
  );
});
