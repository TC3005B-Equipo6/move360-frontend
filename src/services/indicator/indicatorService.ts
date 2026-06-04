import api from "../api";
import type {
  DashboardItem,
  IndicatorConfig,
  IndicatorType,
  IndicatorOperation,
} from "../../components/dashboard/types";
import type { Relationship } from "../../components/indicators/Indicator/Indicator";

// --- Indicator persistence -------------------------------------------------
//
// Wraps the backend `/indicator` resource. The frontend `IndicatorConfig`
// vocabulary is aligned 1:1 with the backend DTOs (same field names + SCREAMING
// enum tokens), so the payloads are the config sent almost as-is. Only two
// fields are reshaped here: `coordinate` (from the grid row/col) and `filters`
// (the UI keeps a `Record<filterId, string[]>`; the backend wants two parallel
// arrays `{ ids, values }`).
//
// See docs/adr/0001, docs/adr/0002 and docs/pending-implementation.md § Indicator.

/** Backend `Coordinate(x, y)`. The grid is column-major: x = col, y = row. */
export interface Coordinate {
  x: number;
  y: number;
}

/** Backend `IndicatorFiltersDTO`: parallel arrays, `ids[i]` ↔ `values[i]`. */
export interface IndicatorFiltersPayload {
  ids: number[];
  values: string[];
}

/** Body for `POST /indicator` (mirrors `CreateIndicatorDTO`). */
export interface CreateIndicatorPayload {
  title: string;
  subtitle: string;
  type: IndicatorType;
  relationship: Relationship;
  operation: IndicatorOperation;
  startDate: string;
  endDate: string;
  dashboardId: string;
  sourceId: number;
  tableId: number;
  columnId: number;
  filters: IndicatorFiltersPayload;
  coordinate: Coordinate;
}

/** Body for `PATCH /indicator/{id}` — the backend only persists these fields. */
export interface UpdateIndicatorPayload {
  title: string;
  subtitle?: string;
  relationship?: Relationship;
  coordinate: Coordinate;
}

/** Response of `POST` / `PATCH` (mirrors `CreateIndicatorResponseDTO`). */
export interface CreateIndicatorResponse {
  id: number;
  title: string;
  subtitle: string;
  type: IndicatorType;
  relationship: Relationship;
  deltaData: number | null;
  data: number | null;
}

/** Flatten the UI's grouped filters into the backend's parallel arrays. */
export function flattenFilters(
  filters: Record<number, string[]> | undefined,
): IndicatorFiltersPayload {
  const ids: number[] = [];
  const values: string[] = [];
  for (const [groupId, groupValues] of Object.entries(filters ?? {})) {
    for (const value of groupValues) {
      ids.push(Number(groupId));
      values.push(value);
    }
  }
  return { ids, values };
}

/** Build the create body from a config + the dashboard id + the placed slot. */
export function buildCreatePayload(
  config: IndicatorConfig,
  dashboardId: string,
  col: number,
  row: number,
): CreateIndicatorPayload {
  return {
    title: config.title,
    subtitle: config.subtitle ?? "",
    type: config.type ?? "NUMBER",
    relationship: config.relationship ?? "DIRECT",
    operation: config.operation ?? "SUM",
    startDate: config.startDate,
    endDate: config.endDate,
    dashboardId,
    sourceId: config.sourceId ?? 0,
    tableId: config.tableId ?? 0,
    // SEMOVI has no column; the backend ignores columnId for that source.
    columnId: config.columnId ?? 0,
    filters: flattenFilters(config.filters),
    coordinate: { x: col, y: row },
  };
}

/** Build the update body from a dashboard item (coordinate from its slot). */
export function buildUpdatePayload(item: DashboardItem): UpdateIndicatorPayload {
  const config = item.config as IndicatorConfig;
  return {
    title: config.title,
    subtitle: config.subtitle,
    relationship: config.relationship,
    coordinate: { x: item.col, y: item.row },
  };
}

export async function createIndicator(
  payload: CreateIndicatorPayload,
): Promise<CreateIndicatorResponse> {
  const { data } = await api.post<CreateIndicatorResponse>("/indicator", payload);
  return data;
}

export async function updateIndicator(
  id: number,
  payload: UpdateIndicatorPayload,
): Promise<void> {
  await api.patch(`/indicator/${id}`, payload);
}

export async function deleteIndicator(id: number): Promise<void> {
  await api.delete(`/indicator/${id}`);
}
