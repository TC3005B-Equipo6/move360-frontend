import type { ItemType } from "./grid.config";
import type { RelationType } from "../indicators/Indicator/Indicator";

/** Backend `type`: output format of the figure. */
export type IndicatorType = "number" | "percentage";
/** Backend `operation`: how the query aggregates the column. */
export type IndicatorOperation = "sum" | "average";

export interface IndicatorWidget {
  id: string;
  type: "indicator";
  value: number;
  label: string;
  subtitle?: string;
  // Relation (direct/inverse) + signed magnitude resolve the delta color + arrow.
  relationType?: RelationType;
  deltaData?: number;
  unit?: string;
  // Backend output format and aggregation; sent on create/update.
  indicatorType?: IndicatorType;
  operation?: IndicatorOperation;
  source?: string;
  table?: string;
  column?: string;
  startDate: Date;
  endDate: Date;
}

export interface IndicatorConfig {
  value: number;
  label: string;
  subtitle?: string;
  relationType?: RelationType;
  deltaData?: number;
  unit?: string;
  indicatorType?: IndicatorType;
  operation?: IndicatorOperation;
  source?: string;
  table?: string;
  column?: string;
  startDate: Date | string;
  endDate: Date | string;
  isMenuOpen?: boolean;
}

export interface ChartConfig {
  config: {
    chartType: "bar" | "line" | "donut" | "ranking";
    source: string;
    datasetId: string;
    columns: string[];
    compareEnabled: boolean;
    compareTable: string;
    startDate: string;
    endDate: string;
  };
  subtitle?: string;
  delta?: number;
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
