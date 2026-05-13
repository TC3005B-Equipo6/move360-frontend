import type { ItemType } from "./grid.config";
import type { IndicatorWidget, ChartWidget } from "../Indicator/types";

export type IndicatorConfig = Omit<IndicatorWidget, "id" | "type">;
export type ChartConfig = Omit<ChartWidget, "id" | "type">;

export interface DashboardItem {
  id: string;
  type: ItemType;
  row: number;
  col: number;
  config?: IndicatorConfig | ChartConfig;
}

export interface DashboardData {
  id: string;
  items: DashboardItem[];
}
