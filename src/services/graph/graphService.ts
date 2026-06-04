import api from "../api";
import type { ChartConfig, GraphDataRow } from "../../components/dashboard/types";
import {
  chartTypeToGraphType,
  graphTypeToChartType,
  toCoord,
  type Coordinate,
  type GraphOperation,
  type GraphSize,
  type GraphType,
} from "../../components/dashboard/itemMapping";

// --- Graph persistence + catalog -------------------------------------------
//
// Wraps the backend `/graph` resource and `/graph/catalog`. Mirrors the shape
// of `indicatorService`: the frontend `ChartConfig.config` vocabulary is aligned
// 1:1 with `CreateGraphRequest`, so payloads are sent almost as-is. The backend
// computes `data[]`/`series[]`/`delta`; the frontend renders them directly.
//
// The graph catalog is a DIFFERENT source from the indicator `/source*` catalog.
// `sourceId`/`tableId` are backend numeric indices (tableId scoped to sourceId).
// See move360-backend/docs/frontend-backend-graph-dashboard-contract.md.

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// --- Catalog ----------------------------------------------------------------

export interface CatalogColumn {
  columnName: string;
  displayName: string;
}

export interface CatalogTable {
  tableId: number;
  displayName: string;
  defaultDimension: string;
  dimensions: CatalogColumn[];
  metrics: CatalogColumn[];
}

export interface CatalogSource {
  sourceId: number;
  name: string;
  tables: CatalogTable[];
}

export interface GraphCatalogResponse {
  sources: CatalogSource[];
}

export async function getGraphCatalog(): Promise<GraphCatalogResponse> {
  const { data } = await api.get<GraphCatalogResponse>("/graph/catalog");
  return data;
}

// --- Graph DTOs -------------------------------------------------------------

export interface GraphSeries {
  id?: number;
  seriesKey: string;
  label: string;
  color: string;
  data: Array<{ name: string; value: number | null }>;
}

/** Fields shared by `GraphResponse` and the embedded dashboard-detail graph item.
 * NOTE: `type` is optional because the dashboard-detail `GraphItemDTO` does NOT
 * carry it — there the `GraphType` lives at the item level (`ItemDTO.type`). The
 * full `GraphResponse` does include it. Always pass the type explicitly to
 * `graphToChartConfig`. */
export interface GraphSnapshot {
  title?: string;
  subtitle?: string;
  size: GraphSize;
  type?: GraphType;
  sourceId: number;
  tableId: number;
  dimensionColumn: string;
  metricColumns: string[];
  operation: GraphOperation;
  compareEnabled: boolean;
  compareTableId: number | null;
  startMonth: string;
  endMonth: string;
  delta: number | null;
  data: GraphDataRow[];
  series: GraphSeries[];
}

/** Full `GraphResponse` (POST/GET/PATCH). */
export interface GraphResponse extends GraphSnapshot {
  itemId: string;
  id: number;
  dashboardId: string;
  coordinate: Coordinate;
}

export interface CreateGraphRequest {
  dashboardId: string;
  title: string;
  subtitle?: string;
  size: GraphSize;
  type: GraphType;
  sourceId: number;
  tableId: number;
  dimensionColumn: string;
  metricColumns: string[];
  operation: GraphOperation;
  compareEnabled?: boolean;
  compareTableId?: number | null;
  startMonth: string;
  endMonth: string;
  coordinate: Coordinate;
}

/** Partial of `CreateGraphRequest` without `dashboardId`. */
export type UpdateGraphRequest = Partial<Omit<CreateGraphRequest, "dashboardId">>;

// --- Mappers ----------------------------------------------------------------

/** Backend graph snapshot -> the renderer-facing `ChartConfig`. Works for both
 * `GraphResponse` and the dashboard-detail embedded graph; `type` MUST be passed
 * explicitly (the embedded item carries it at the item level, not in the graph).
 * Optional `names` fill the display-only header labels (the detail payload only
 * carries numeric ids). */
export function graphToChartConfig(
  g: GraphSnapshot,
  type: GraphType,
  names?: { sourceName?: string; tableName?: string },
): ChartConfig {
  const chartType = graphTypeToChartType(type);

  // The backend keys each data row by its metric column (e.g. `passengers`),
  // but the ranking renderer reads a flat `value`. Ranking always has exactly
  // one metric, so project that metric onto `value`.
  const seriesKey = g.series[0]?.seriesKey ?? g.metricColumns[0];
  const data: GraphDataRow[] =
    chartType === "ranking" && seriesKey
      ? g.data.map((row) => ({ name: String(row.name), value: (row[seriesKey] as number | null) ?? null }))
      : g.data;

  return {
    title: g.title,
    subtitle: g.subtitle,
    config: {
      chartType,
      sourceId: g.sourceId,
      tableId: g.tableId,
      dimensionColumn: g.dimensionColumn,
      metricColumns: g.metricColumns,
      operation: g.operation,
      compareEnabled: g.compareEnabled,
      compareTableId: g.compareTableId,
      startMonth: g.startMonth,
      endMonth: g.endMonth,
      sourceName: names?.sourceName,
      tableName: names?.tableName,
    },
    delta: g.delta ?? undefined,
    data,
    series: g.series.map((s, index) => ({
      key: s.seriesKey,
      color: s.color || colors[index % colors.length],
      label: s.label,
    })),
  };
}

/** Build the create body from a chart config + its placed slot. */
export function buildCreateGraphPayload(
  config: ChartConfig,
  size: GraphSize,
  dashboardId: string,
  col: number,
  row: number,
): CreateGraphRequest {
  const c = config.config;
  return {
    dashboardId,
    title: config.title ?? "",
    subtitle: config.subtitle,
    size,
    type: chartTypeToGraphType(c.chartType),
    sourceId: c.sourceId,
    tableId: c.tableId,
    dimensionColumn: c.dimensionColumn,
    metricColumns: c.metricColumns,
    operation: c.operation,
    compareEnabled: c.compareEnabled,
    compareTableId: c.compareEnabled ? c.compareTableId : null,
    startMonth: c.startMonth,
    endMonth: c.endMonth,
    coordinate: toCoord(col, row),
  };
}

/** Build the content-only update body (query-affecting fields). Coordinate moves
 * go through the batch layout endpoint, so they are not included here. */
export function buildUpdateGraphPayload(config: ChartConfig, size: GraphSize): UpdateGraphRequest {
  const c = config.config;
  return {
    title: config.title,
    subtitle: config.subtitle,
    size,
    type: chartTypeToGraphType(c.chartType),
    sourceId: c.sourceId,
    tableId: c.tableId,
    dimensionColumn: c.dimensionColumn,
    metricColumns: c.metricColumns,
    operation: c.operation,
    compareEnabled: c.compareEnabled,
    compareTableId: c.compareEnabled ? c.compareTableId : null,
    startMonth: c.startMonth,
    endMonth: c.endMonth,
  };
}

// --- CRUD -------------------------------------------------------------------

export async function createGraph(payload: CreateGraphRequest): Promise<GraphResponse> {
  const { data } = await api.post<GraphResponse>("/graph", payload);
  return data;
}

export async function updateGraph(id: number, payload: UpdateGraphRequest): Promise<GraphResponse> {
  const { data } = await api.patch<GraphResponse>(`/graph/${id}`, payload);
  return data;
}

export async function deleteGraph(id: number): Promise<void> {
  await api.delete(`/graph/${id}`);
}
