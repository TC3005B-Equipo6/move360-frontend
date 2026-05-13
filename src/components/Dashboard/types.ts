import type { ItemType } from "./grid.config";

export interface IndicatorWidget {
  id: string;
  type: "indicator";
  value: number;
  label: string;
  isPositive: boolean;
  backgroundColor: string;
  textColor: string;
}

export type IndicatorConfig = Omit<IndicatorWidget, "id" | "type">;

export interface ChartConfig {
  config: {
    chartType: "bar" | "line";
    source: string;
    datasetId: string;
    columns: string[];
    compareEnabled: boolean;
    compareTable: string;
    startDate: string;
    endDate: string;
  };
  data: Array<Record<string, string | number | undefined>>;
  series: {
    key: string;
    color: string;
    label?: string;
  }[];
}

export interface DashboardItem {
  id: string;
  type: ItemType;
  row: number;
  col: number;
  config: IndicatorConfig | ChartConfig;
}

export interface DashboardData {
  id: string;
  items: DashboardItem[];
}
