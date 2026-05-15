import type { ItemType } from "./grid.config";
import type { IndicatorTone } from "../Indicator/Indicator";

export interface IndicatorWidget {
  id: string;
  type: "indicator";
  value: number;
  label: string;
  name: string;
  tone?: IndicatorTone;
  operation: "porcentaje" | "total";
  source?: string;
  table?: string;
  column?: string;
  startDate: Date;
  endDate: Date;
  backgroundColor: string;
  textColor: string;
}

export interface IndicatorConfig {
  value: number;
  label: string;
  name: string;
  tone?: IndicatorTone;
  operation?: "porcentaje" | "total";
  source?: string;
  table?: string;
  column?: string;
  startDate: Date | string;
  endDate: Date | string;
  backgroundColor?: string;
  textColor?: string;
  isMenuOpen?: boolean;
}

export interface ChartConfig {
  config: {
    chartType: "bar" | "line" | "donut";
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
