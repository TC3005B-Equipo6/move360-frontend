import type { ItemType } from "./grid.config";
import type { RelationType } from "../indicators/Indicator/Indicator";

/** Backend `type`: output format of the figure. */
export type IndicatorType = "number" | "percentage";
/** Backend `operation`: how the query aggregates the column. */
export type IndicatorOperation = "sum" | "average";

// Data origin captured from the `/source*` catalog. Indices are the values the
// backend expects (sourceId/tableId/columnId in CreateIndicatorDTO) — see
// src/services/source/sourceService.ts for the index-vs-id contract quirks.
// INEGI tables carry `columnIndex`/`columnName`; SEMOVI tables carry `filters`
// (filterId -> selected values). Names are kept for display + edit prefill.
export interface IndicatorSource {
  sourceIndex?: number;
  sourceName?: string;
  tableIndex?: number;
  tableName?: string;
  columnIndex?: number;
  columnName?: string;
  /** SEMOVI only: selected filter values keyed by filter group id. */
  filters?: Record<number, string[]>;
}

export interface IndicatorWidget extends IndicatorSource {
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
  startDate: Date;
  endDate: Date;
}

export interface IndicatorConfig extends IndicatorSource {
  value: number;
  label: string;
  subtitle?: string;
  relationType?: RelationType;
  deltaData?: number;
  unit?: string;
  indicatorType?: IndicatorType;
  operation?: IndicatorOperation;
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
