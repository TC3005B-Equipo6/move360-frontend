import api from "../api";
import type {
  DashboardData,
  DashboardItem as Item,
  IndicatorConfig,
} from "../../components/dashboard/types";
import type { IndicatorType, IndicatorOperation } from "../../components/dashboard/types";
import type { Relationship } from "../../components/indicators/Indicator/Indicator";
import {
  fromCoord,
  sizeToItemType,
  type Coordinate,
  type DashboardItemKind,
  type GraphType,
} from "../../components/dashboard/itemMapping";
import {
  getGraphCatalog,
  graphToChartConfig,
  type GraphSnapshot,
} from "../graph/graphService";

// --- Server-backed dashboard entity (CRUD) ---------------------------------
//
// Item content (indicators / charts) is NOT stored server-side yet, so the
// grid items keep living in localStorage (see the local layer below).
// See docs/adr/0001 and docs/pending-implementation.md.

export interface UserDashboardSummary {
  id: string;
  title: string;
  createdAt: string;
  isPublic: boolean;
}

export interface PublicDashboardSummary {
  id: string;
  ownerName: string;
  title: string;
  description: string | null;
  createdDate: string;
}

export interface DashboardTag {
  id: number;
  name: string;
  color: {
    id: number;
    name: string;
    hex: string;
  };
}

export interface DashboardDetail {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  isPublic: boolean;
  ownerName: string | null;
  tags: DashboardTag[];
}

export interface CreateDashboardInput {
  title: string;
  description?: string;
  isPublic: boolean;
}

interface RawUserDashboard {
  id: string;
  title: string;
  createdAt: string;
  public?: boolean;
  isPublic?: boolean;
}

interface RawPublicDashboard {
  id: string;
  ownerName: string;
  title: string;
  description: string | null;
  createdDate: string;
}

interface RawDashboardDetail {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  public?: boolean;
  isPublic?: boolean;
  owner?: { firstName?: string; paternalSurname?: string };
  ownerName?: string;
  tags?: DashboardTag[];
}

interface RawCreateDashboardResponse {
  title: string;
  description: string | null;
  user: string;
}

function toUserSummary(raw: RawUserDashboard): UserDashboardSummary {
  return {
    id: raw.id,
    title: raw.title,
    createdAt: raw.createdAt,
    isPublic: raw.public ?? raw.isPublic ?? false,
  };
}

function toPublicSummary(raw: RawPublicDashboard): PublicDashboardSummary {
  return {
    id: raw.id,
    ownerName: raw.ownerName,
    title: raw.title,
    description: raw.description ?? null,
    createdDate: raw.createdDate,
  };
}

function toDetail(raw: RawDashboardDetail): DashboardDetail {
  const first = raw.owner?.firstName ?? '';
  const last = raw.owner?.paternalSurname ?? '';
  const composedOwner = (first + ' ' + last).trim();
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? null,
    createdAt: raw.createdAt,
    isPublic: raw.public ?? raw.isPublic ?? false,
    ownerName: composedOwner || raw.ownerName?.trim() || null,
    tags: raw.tags ?? [],
  };
}

export async function listDashboards(): Promise<UserDashboardSummary[]> {
  const { data } = await api.get<RawUserDashboard[]>("/dashboard/me");
  return data.map(toUserSummary);
}

export async function listPublicDashboards(): Promise<PublicDashboardSummary[]> {
  const { data } = await api.get<RawPublicDashboard[]>("/dashboard");
  return data.map(toPublicSummary);
}

export async function getDashboard(id: string): Promise<DashboardDetail> {
  const { data } = await api.get<RawDashboardDetail>(`/dashboard/${id}`);
  return toDetail(data);
}

// --- Dashboard detail render (items[]) -------------------------------------
//
// `GET /dashboard/{id}` now returns `items[]` (INDICATOR | GRAPH) with the
// backend-computed snapshot. These are the source of truth for the grid; the
// localStorage layer below is only used by the local-only screens (Home/test).

interface RawDashboardIndicatorItem {
  title: string;
  subtitle: string | null;
  data: number | null;
  relationship: string;
  deltaData: number | null;
  operation: string;
  startDate: string;
  endDate: string;
  sourceId: number;
}

interface RawDashboardItem {
  itemId: string; // "indicator:<id>" | "graph:<id>"
  kind: DashboardItemKind;
  resourceId: number;
  type: string;
  coordinate: Coordinate;
  graph: GraphSnapshot | null;
  indicator: RawDashboardIndicatorItem | null;
}

interface RawDashboardDetailWithItems extends RawDashboardDetail {
  ownerName?: string;
  items?: RawDashboardItem[];
}

function toIndicatorConfig(raw: RawDashboardIndicatorItem, type: string): IndicatorConfig {
  const indicatorType = (type === "PERCENTAGE" ? "PERCENTAGE" : "NUMBER") as IndicatorType;
  return {
    title: raw.title,
    subtitle: raw.subtitle ?? undefined,
    type: indicatorType,
    operation: raw.operation as IndicatorOperation,
    relationship: raw.relationship as Relationship,
    data: raw.data ?? 0,
    deltaData: raw.deltaData ?? undefined,
    unit: indicatorType === "PERCENTAGE" ? "%" : undefined,
    startDate: raw.startDate,
    endDate: raw.endDate,
    sourceId: raw.sourceId,
  };
}

/** Resolves graph `sourceId`/`tableId` -> display names (the detail payload only
 * carries numeric ids). Built from `GET /graph/catalog`. */
type GraphNameResolver = (sourceId: number, tableId: number) => {
  sourceName?: string;
  tableName?: string;
};

const noNames: GraphNameResolver = () => ({});

function toDashboardItem(raw: RawDashboardItem, resolveNames: GraphNameResolver): Item | null {
  const { col, row } = fromCoord(raw.coordinate);
  if (raw.kind === "GRAPH" && raw.graph) {
    return {
      id: raw.itemId,
      type: sizeToItemType(raw.graph.size),
      row,
      col,
      config: graphToChartConfig(
        raw.graph,
        raw.type as GraphType,
        resolveNames(raw.graph.sourceId, raw.graph.tableId),
      ),
      resourceId: raw.resourceId,
    };
  }
  if (raw.kind === "INDICATOR" && raw.indicator) {
    return {
      id: raw.itemId,
      type: "indicator",
      row,
      col,
      config: toIndicatorConfig(raw.indicator, raw.type),
      resourceId: raw.resourceId,
    };
  }
  return null;
}

/** Builds a name resolver from the graph catalog. Catalog failures degrade to no
 * names (titles fall back to empty) rather than breaking the dashboard load. */
async function buildGraphNameResolver(): Promise<GraphNameResolver> {
  try {
    const catalog = await getGraphCatalog();
    const sourceNames = new Map<number, string>();
    const tableNames = new Map<string, string>(); // key: `${sourceId}:${tableId}`
    for (const source of catalog.sources) {
      sourceNames.set(source.sourceId, source.name);
      for (const table of source.tables) {
        tableNames.set(`${source.sourceId}:${table.tableId}`, table.displayName);
      }
    }
    return (sourceId, tableId) => ({
      sourceName: sourceNames.get(sourceId),
      tableName: tableNames.get(`${sourceId}:${tableId}`),
    });
  } catch {
    return noNames;
  }
}

export interface DashboardDetailWithItems {
  meta: DashboardDetail;
  items: Item[];
}

/** `GET /dashboard/{id}` returning metadata + mapped grid items. The graph
 * catalog is fetched in parallel to resolve source/table display names (the
 * detail payload only carries numeric ids). */
export async function getDashboardDetail(id: string): Promise<DashboardDetailWithItems> {
  const [{ data }, resolveNames] = await Promise.all([
    api.get<RawDashboardDetailWithItems>(`/dashboard/${id}`),
    buildGraphNameResolver(),
  ]);
  const items = (data.items ?? [])
    .map((raw) => toDashboardItem(raw, resolveNames))
    .filter((it): it is Item => it !== null);
  return { meta: toDetail(data), items };
}

// --- Layout batch ----------------------------------------------------------

interface LayoutItemPayload {
  kind: DashboardItemKind;
  resourceId: number;
  coordinate: Coordinate;
}

/** `PUT /dashboard/{id}/layout` — batch coordinate persistence (both kinds). */
export async function saveLayout(id: string, items: LayoutItemPayload[]): Promise<void> {
  await api.put(`/dashboard/${id}/layout`, { items });
}

// The backend's POST /dashboard does NOT return an id today; it returns
// { title, description, user }. We resolve the new id by re-fetching the
// user's dashboards and matching by title + the most recent createdAt.
// Tracked in docs/pending-implementation.md.
export async function createDashboard(
  input: CreateDashboardInput
): Promise<UserDashboardSummary> {
  const { data: created } = await api.post<RawCreateDashboardResponse>("/dashboard", input);
  const list = await listDashboards();
  const matches = list
    .filter((d) => d.title === created.title)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (matches.length === 0) {
    throw new Error("Created dashboard not found after refetch");
  }
  return matches[0];
}

export interface UpdateDashboardInput {
  title: string;
  description?: string;
}

export async function updateDashboard(id: string, input: UpdateDashboardInput): Promise<void> {
  await api.patch(`/dashboard/${id}`, input);
}

export async function getAllTags(): Promise<DashboardTag[]> {
  const { data } = await api.get<DashboardTag[]>('/tag');
  return data;
}

export async function addTagToDashboard(dashboardId: string, tagId: number): Promise<void> {
  await api.post(`/dashboard/${dashboardId}/tag/${tagId}`);
}

export async function removeTagFromDashboard(dashboardId: string, tagId: number): Promise<void> {
  await api.delete(`/dashboard/${dashboardId}/tag/${tagId}`);
}

export async function deleteDashboard(id: string): Promise<void> {
  await api.delete(`/dashboard/${id}`);
  localStorage.removeItem(storageKey(id));
}

// --- Local item persistence (temporary) ------------------------------------
//
// Grid items are persisted in localStorage keyed by the real dashboard id.
// TODO: when the backend gains item endpoints, replace this layer with HTTP
// and add the ItemType <-> SCREAMING_SNAKE mapping (see docs/todo.md).

const storageKey = (id: string) => `move360:dashboard:${id}`;

export function loadDashboardItems(id: string): DashboardData {
  const raw = localStorage.getItem(storageKey(id));
  if (!raw) return { id, items: [] };
  try {
    const parsed = JSON.parse(raw) as DashboardData;
    if (parsed && Array.isArray(parsed.items)) return parsed;
  } catch {
    // fall through to empty
  }
  return { id, items: [] };
}

export function saveDashboardItems(id: string, data: DashboardData): void {
  localStorage.setItem(storageKey(id), JSON.stringify(data));
}
