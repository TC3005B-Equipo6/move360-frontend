import { forwardRef, useState, type CSSProperties, type ReactNode } from "react";
import { Chart } from "../Chart/Chart";
import { IndicatorPreview } from "../IndicatorPreview/IndicatorPreview";
import { ActionMenu } from "../ActionMenu/ActionMenu";
import { icons } from "../../icons";
import type { DashboardItem as Item, ChartConfig, IndicatorConfig } from "./types";

interface Props {
  item: Item;
  onDelete: (id: string) => void;
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

  const menuButton = (
    <button
      type="button"
      aria-label="More options"
      data-action-menu-trigger
      className="item-menu absolute top-4 right-4 inline-flex items-center justify-center w-8 h-8 p-0 bg-white/80 hover:bg-white border-0 rounded-full text-[#5f6f8a] cursor-pointer shadow-sm"
      onClick={toggleMenu}
    >
      <MoreIcon size={20} />
    </button>
  );

  const renderContent = () => {
    if (item.type === "indicator") {
      const cfg = item.config as IndicatorConfig;
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <IndicatorPreview
            value={cfg.value}
            label={cfg.label}
            tone={cfg.tone}
            backgroundColor={cfg.backgroundColor}
            textColor={cfg.textColor}
          />
          {menuButton}
        </div>
      );
    }

    const cfg = item.config as ChartConfig;
    return (
      <div className="relative w-full h-full">
        <Chart
          type={cfg.config.chartType}
          data={cfg.data}
          series={cfg.series}
          size={chartSizeMap[item.type]}
          title={cfg.config.datasetId || cfg.config.source}
        />
        {menuButton}
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
