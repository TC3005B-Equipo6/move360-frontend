import type { ItemType } from "./grid.config";
import type { Relationship } from "../indicators/Indicator/Indicator";

// Vocabulary is aligned 1:1 with the backend Indicator DTO (same field names
// and SCREAMING enum tokens), so create/update payloads are sent almost as-is.
// Only `coordinate` (from the grid row/col) and `filters` (flattened to parallel
// arrays) are reshaped at the service layer.

/** Backend `type`: output format of the figure. */
export type IndicatorType = "NUMBER" | "PERCENTAGE";
/** Backend `operation`: how the query aggregates the column. */
export type IndicatorOperation = "SUM" | "AVG";

// Data origin captured from the `/source*` catalog. These ids are the values the
// backend expects (sourceId/tableId/columnId in CreateIndicatorDTO) — see
// src/services/source/sourceService.ts for the index-vs-id contract quirks.
// INEGI tables carry `columnId`/`columnName`; SEMOVI tables carry `filters`
// (filterId -> selected values). Names are kept for display + edit prefill.
export interface IndicatorSource {
  sourceId?: number;
  sourceName?: string;
  tableId?: number;
  tableName?: string;
  columnId?: number;
  columnName?: string;
  /** SEMOVI only: selected filter values keyed by filter group id. */
  filters?: Record<number, string[]>;
}

export interface IndicatorConfig extends IndicatorSource {
  /** Backend `title`. */
  title: string;
  subtitle?: string;
  /** Backend output format. */
  type?: IndicatorType;
  /** Backend aggregation. */
  operation?: IndicatorOperation;
  /** Relation (DIRECT/INVERSE) + signed delta resolve the color + arrow. */
  relationship?: Relationship;
  /** Backend `data`: the displayed figure (computed by the backend). */
  data: number;
  deltaData?: number;
  /** UI-only suffix derived from `type` ("%"); NOT sent to the backend. */
  unit?: string;
  /** ISO `YYYY-MM-DD` (backend LocalDate). */
  startDate: string;
  endDate: string;
  isMenuOpen?: boolean;
}

/** The modal's output object: a config plus the grid item id. */
export interface IndicatorWidget extends IndicatorConfig {
  id: string;
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
  /** Backend indicator id (int). Only set once the indicator is persisted. */
  indicatorId?: number;
  /** True when a tracked attribute (coordinate, title, subtitle, relationship)
   * changed since the last persist; drives the PATCH on confirm. */
  modified?: boolean;
}

export interface DashboardData {
  id: string;
  items: DashboardItem[];
}
