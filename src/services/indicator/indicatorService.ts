import api, { COMPUTE_TIMEOUT_MS } from "../api";
import type {
  DashboardItem,
  IndicatorConfig,
  IndicatorType,
  IndicatorOperation,
} from "../../components/dashboard/types";
import type { Relationship } from "../../components/indicators/Indicator/Indicator";
import { toCoord, type Coordinate } from "../../components/dashboard/itemMapping";

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

// Content-only PATCH. Coordinate moves go through the batch layout endpoint
// (`PUT /dashboard/{id}/layout`), so this payload never carries coordinate.
// The backend now accepts the full editable indicator origin on PATCH (not just
// identity), recomputing `data`/`deltaData` for query-affecting fields. We mirror
// the graph pattern and send the whole origin every edit (no field diffing).
/** Body for `PATCH /indicator/{id}` (mirrors `UpdateIndicatorDTO`). */
export interface UpdateIndicatorPayload {
  title: string;
  subtitle?: string;
  relationship?: Relationship;
  type?: IndicatorType;
  operation?: IndicatorOperation;
  startDate?: string;
  endDate?: string;
  sourceId?: number;
  tableId?: number;
  columnId?: number;
  filters?: IndicatorFiltersPayload;
}

/** Response of `POST` (mirrors `CreateIndicatorResponseDTO`). */
export interface CreateIndicatorResponse {
  id: number;
  title: string;
  subtitle: string;
  type: IndicatorType;
  relationship: Relationship;
  deltaData: number | null;
  data: number | null;
}

/** Response of `GET` / `PATCH /indicator/{id}` (mirrors `GetIndicatorResponseDTO`).
 * The grid only reads `data`/`deltaData` to reconcile after a recompute. */
export interface IndicatorResponse {
  itemId: string;
  id: number;
  dashboardId: string;
  title: string;
  subtitle: string | null;
  type: IndicatorType;
  data: number | null;
  relationship: Relationship;
  deltaData: number | null;
  operation: IndicatorOperation;
  startDate: string;
  endDate: string;
  coordinate: Coordinate;
  sourceId: number;
  tableId: number;
  columnId: number | null;
  filters: IndicatorFiltersPayload;
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

/** Inverse of `flattenFilters`: group the backend's parallel arrays back into the
 * UI's `Record<filterGroupId, string[]>` so the edit modal can re-select them. */
export function unflattenFilters(
  payload: IndicatorFiltersPayload | null | undefined,
): Record<number, string[]> {
  const grouped: Record<number, string[]> = {};
  const ids = payload?.ids ?? [];
  const values = payload?.values ?? [];
  for (let i = 0; i < ids.length; i++) {
    (grouped[ids[i]] ??= []).push(values[i]);
  }
  return grouped;
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
    coordinate: toCoord(col, row),
  };
}

/** Build the update body from a dashboard item. Sends the full editable origin
 * (mirrors `buildCreatePayload`); the backend recomputes `data`/`deltaData` for
 * query-affecting changes and leaves them untouched for identity-only edits. */
export function buildUpdatePayload(item: DashboardItem): UpdateIndicatorPayload {
  const config = item.config as IndicatorConfig;
  return {
    title: config.title,
    subtitle: config.subtitle ?? "",
    relationship: config.relationship,
    type: config.type,
    operation: config.operation,
    startDate: config.startDate,
    endDate: config.endDate,
    sourceId: config.sourceId,
    tableId: config.tableId,
    // SEMOVI has no column; the backend stores null for non-INEGI sources.
    columnId: config.columnId ?? 0,
    filters: flattenFilters(config.filters),
  };
}

export async function createIndicator(
  payload: CreateIndicatorPayload,
): Promise<CreateIndicatorResponse> {
  const { data } = await api.post<CreateIndicatorResponse>("/indicator", payload, {
    timeout: COMPUTE_TIMEOUT_MS,
  });
  return data;
}

export async function updateIndicator(
  id: number,
  payload: UpdateIndicatorPayload,
): Promise<IndicatorResponse> {
  const { data } = await api.patch<IndicatorResponse>(`/indicator/${id}`, payload, {
    timeout: COMPUTE_TIMEOUT_MS,
  });
  return data;
}

export async function deleteIndicator(id: number): Promise<void> {
  await api.delete(`/indicator/${id}`);
}
