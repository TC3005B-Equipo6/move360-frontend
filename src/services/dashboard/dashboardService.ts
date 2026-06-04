import api from "../api";
import type { DashboardData } from "../../components/dashboard/types";

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
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? null,
    createdAt: raw.createdAt,
    isPublic: raw.public ?? raw.isPublic ?? false,
    ownerName: (first + ' ' + last).trim() || null,
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
