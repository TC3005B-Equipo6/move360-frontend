import { forwardRef, useState, type CSSProperties, type ReactNode } from "react";
import { Chart } from "../charts/Chart/Chart";
import { Indicator, type IndicatorTone } from "../indicators/Indicator/Indicator";
import { ActionMenu } from "../common/ActionMenu/ActionMenu";
import { OverflowMenuButton } from "../common/OverflowMenuButton/OverflowMenuButton";
import type { DashboardItem as Item, ChartConfig, IndicatorConfig } from "./types";

interface Props {
  item: Item;
  onDelete: (id: string) => void;
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

type RenderIndicatorConfig = Partial<Omit<IndicatorConfig, "tone">> & {
  value: number;
  label: string;
  tone?: IndicatorTone | "positive" | "neutral" | "negative";
  isPositive?: boolean;
};

const toDate = (value?: string | Date) => {
  if (value instanceof Date) return value;
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getIndicatorTone = (cfg: RenderIndicatorConfig): IndicatorTone => {
  if (cfg.tone === "inverse" || cfg.tone === "negative") return "inverse";
  if (cfg.tone === "direct" || cfg.tone === "positive" || cfg.tone === "neutral") return "direct";
  return cfg.isPositive === false ? "inverse" : "direct";
};

const getMetricLabel = (columns: string[]) => {
  const [firstColumn] = columns;
  if (!firstColumn || firstColumn === "value") return "Afluencia";
  return firstColumn;
};

export const DashboardItem = forwardRef<HTMLDivElement, Props>(function DashboardItem(
  { item, onDelete, readonly = false, style, className, onMouseDown, onMouseUp, onTouchEnd, children },
  ref,
) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((o) => !o);
  const handleDelete = () => {
    setMenuOpen(false);
    onDelete(item.id);
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
      const cfg = item.config as RenderIndicatorConfig;
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <Indicator
            value={cfg.value}
            label={cfg.label}
            subtitle={cfg.subtitle}
            tone={getIndicatorTone(cfg)}
            name={cfg.name ?? cfg.label}
            startDate={toDate(cfg.startDate)}
            endDate={toDate(cfg.endDate)}
            isMenuOpen={menuOpen || Boolean(cfg.isMenuOpen)}
            delta={cfg.delta}
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
          title={cfg.config.datasetId || cfg.config.source}
          subtitle={cfg.subtitle}
          delta={cfg.delta}
          metricLabel={getMetricLabel(cfg.config.columns)}
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
          <ActionMenu onDelete={handleDelete} onEdit={closeMenu} onClose={closeMenu} />
        </div>
      )}
      {/* RGL placeholder children (resize handles, etc.) — no se usan aquí pero los reenviamos */}
      {children}
    </div>
  );
});
