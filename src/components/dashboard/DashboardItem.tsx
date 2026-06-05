import { forwardRef, useState, type CSSProperties, type ReactNode } from "react";
import { Chart } from "../charts/Chart/Chart";
import { Indicator } from "../indicators/Indicator/Indicator";
import { ActionMenu } from "../common/ActionMenu/ActionMenu";
import { OverflowMenuButton } from "../common/OverflowMenuButton/OverflowMenuButton";
import type { DashboardItem as Item, ChartConfig, IndicatorConfig } from "./types";

interface Props {
  item: Item;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  readonly?: boolean;
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

const getMetricLabel = (columns: string[]) => {
  const [firstColumn] = columns;
  if (!firstColumn || firstColumn === "value") return "Afluencia";
  return firstColumn;
};

export const DashboardItem = forwardRef<HTMLDivElement, Props>(function DashboardItem(
  { item, onDelete, onEdit, readonly = false, style, className, onMouseDown, onMouseUp, onTouchEnd, children },
  ref,
) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((o) => !o);
  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(item.id);
  };
  const handleEdit = () => {
    setMenuOpen(false);
    onEdit?.(item.id);
  };

  const menuButton = (
    <OverflowMenuButton
      isOpen={menuOpen}
      className="absolute top-3 right-3 z-10"
      onClick={toggleMenu}
    />
  );

  const renderContent = () => {
    if (item.type === "indicator") {
      const cfg = item.config as IndicatorConfig;
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Indicator
            data={cfg.data}
            title={cfg.title}
            subtitle={cfg.subtitle}
            relationship={cfg.relationship}
            deltaData={cfg.deltaData}
            unit={cfg.unit}
          />
          {!readonly && menuButton}
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
          title={cfg.title || cfg.config.tableName || cfg.config.sourceName || ""}
          subtitle={cfg.subtitle}
          delta={cfg.delta}
          metricLabel={getMetricLabel(cfg.config.metricColumns)}
        />
        {!readonly && menuButton}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      style={style}
      className={[className, "group/dashboard-item relative"].filter(Boolean).join(" ")}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
    >
      {renderContent()}
      {!readonly && menuOpen && (
        <div className="item-menu absolute top-[46px] right-3 z-20">
          <ActionMenu onDelete={handleDelete} onEdit={handleEdit} onClose={closeMenu} />
        </div>
      )}
      {/* RGL placeholder children (resize handles, etc.) — no se usan aquí pero los reenviamos */}
      {children}
    </div>
  );
});
