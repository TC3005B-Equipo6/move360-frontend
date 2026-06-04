import type { ItemType } from "./grid.config";
import type { Relationship } from "../indicators/Indicator/Indicator";
import type { ChartType, GraphOperation } from "./itemMapping";

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

/** A row of computed graph data. `name` is the dimension label; every selected
 * metric (and `${metric}_compare` in compare mode) appears as a keyed value. */
export type GraphDataRow = {
  name: string;
  [metricOrCompareKey: string]: string | number | null;
};

// Aligned 1:1 with the backend Graph DTO (CreateGraphRequest / GraphResponse):
// the builder fields are sent almost as-is. `data`/`series`/`delta` are computed
// by the backend and rendered directly (never recomputed in the frontend).
export interface ChartConfig {
  config: {
    /** Backend `GraphType`, lower-cased for the recharts renderer. */
    chartType: ChartType;
    /** Backend numeric catalog indices (from `GET /graph/catalog`). */
    sourceId: number;
    tableId: number;
    dimensionColumn: string;
    metricColumns: string[];
    operation: GraphOperation;
    compareEnabled: boolean;
    compareTableId: number | null;
    /** `YYYY-MM`. */
    startMonth: string;
    endMonth: string;
    /** Display-only labels kept for the header/legend (not sent to the backend). */
    sourceName?: string;
    tableName?: string;
  };
  subtitle?: string;
  delta?: number;
  data: GraphDataRow[];
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
  /** Backend resource id (int): indicator id for INDICATOR items, graph id for
   * GRAPH items. Only set once the item is persisted (POST) or loaded. */
  resourceId?: number;
  /** Position changed since last persist -> goes in the batch layout PUT. */
  moved?: boolean;
  /** Content (title/subtitle/relationship or graph query) changed since last
   * persist -> goes in a per-resource PATCH (/indicator or /graph). */
  contentModified?: boolean;
}

export interface DashboardData {
  id: string;
  items: DashboardItem[];
}
