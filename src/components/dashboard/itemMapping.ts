import type { ItemType } from "./grid.config";

// --- Shared dashboard item vocabulary (front <-> backend) -------------------
//
// Canonical enums + pure mappers shared by the dashboard service, the graph
// service and the grid. The frontend grid is column-major: a backend
// `Coordinate { x, y }` is `{ x: col, y: row }`. See the integration contract
// in move360-backend/docs/frontend-backend-graph-dashboard-contract.md.

/** Backend `DashboardItemKind`. Derived from the grid `ItemType`. */
export type DashboardItemKind = "INDICATOR" | "GRAPH";

/** Backend `GraphSize`. 1:1 with the chart `ItemType`s. */
export type GraphSize = "CHART_SM" | "CHART_MD" | "CHART_LG";

/** Backend `GraphType`. */
export type GraphType = "BAR" | "LINE" | "RANKING";

/** Backend `GraphOperation`. */
export type GraphOperation = "SUM" | "AVG";

/** Backend `Coordinate`. x = grid col, y = grid row. */
export interface Coordinate {
  x: number;
  y: number;
}

/** Chart render type (recharts) — backend `GraphType` lower-cased. */
export type ChartType = "bar" | "line" | "ranking";

const SIZE_TO_ITEM: Record<GraphSize, ItemType> = {
  CHART_SM: "chartSm",
  CHART_MD: "chartMd",
  CHART_LG: "chartLg",
};

const ITEM_TO_SIZE: Partial<Record<ItemType, GraphSize>> = {
  chartSm: "CHART_SM",
  chartMd: "CHART_MD",
  chartLg: "CHART_LG",
};

const GRAPH_TYPE_TO_CHART: Record<GraphType, ChartType> = {
  BAR: "bar",
  LINE: "line",
  RANKING: "ranking",
};

const CHART_TO_GRAPH_TYPE: Record<ChartType, GraphType> = {
  bar: "BAR",
  line: "LINE",
  ranking: "RANKING",
};

export const sizeToItemType = (size: GraphSize): ItemType => SIZE_TO_ITEM[size];

/** Throws if `type` is not a chart size — callers should guard with `isChartType`. */
export const itemTypeToSize = (type: ItemType): GraphSize => {
  const size = ITEM_TO_SIZE[type];
  if (!size) throw new Error(`ItemType "${type}" has no GraphSize`);
  return size;
};

export const graphTypeToChartType = (t: GraphType): ChartType => GRAPH_TYPE_TO_CHART[t];
export const chartTypeToGraphType = (t: ChartType): GraphType => CHART_TO_GRAPH_TYPE[t];

export const isChartType = (type: ItemType): boolean => type !== "indicator";

/** GRAPH for any chart size, INDICATOR otherwise. */
export const kindFromType = (type: ItemType): DashboardItemKind =>
  type === "indicator" ? "INDICATOR" : "GRAPH";

/** Grid (col,row) -> backend Coordinate. */
export const toCoord = (col: number, row: number): Coordinate => ({ x: col, y: row });

/** Backend Coordinate -> grid (col,row). */
export const fromCoord = (c: Coordinate): { col: number; row: number } => ({
  col: c.x,
  row: c.y,
});
