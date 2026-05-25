import api from "../api";
import type { DashboardData } from "../../components/dashboard/types";

// --- Server-backed dashboard entity (CRUD) ---------------------------------
//
// The backend exposes `/dashboard` (singular). Item content (indicators /
// charts) is NOT stored server-side yet, so the grid items keep living in
// localStorage (see the local layer below). See docs/adr/0001.

export interface DashboardOwner {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
}

export interface DashboardSummary {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  isPublic: boolean;
  owner: DashboardOwner;
}

export interface CreateDashboardInput {
  title: string;
  description?: string;
  isPublic: boolean;
}

// The backend serializes its domain `Dashboard` directly: `owner` arrives as a
// full user (we ignore the sensitive fields) and the boolean may serialize as
// `public` or `isPublic` depending on the Jackson config.
interface RawDashboard {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  public?: boolean;
  isPublic?: boolean;
  owner: {
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
  };
}

function toSummary(raw: RawDashboard): DashboardSummary {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? null,
    createdAt: raw.createdAt,
    isPublic: raw.public ?? raw.isPublic ?? false,
    owner: {
      firstName: raw.owner?.firstName ?? "",
      paternalSurname: raw.owner?.paternalSurname ?? "",
      maternalSurname: raw.owner?.maternalSurname ?? "",
    },
  };
}

export function ownerDisplayName(owner: DashboardOwner): string {
  return [owner.firstName, owner.paternalSurname].filter(Boolean).join(" ");
}

export async function listDashboards(): Promise<DashboardSummary[]> {
  const { data } = await api.get<RawDashboard[]>("/dashboard");
  return data.map(toSummary);
}

export async function getDashboard(id: string): Promise<DashboardSummary> {
  const { data } = await api.get<RawDashboard>(`/dashboard/${id}`);
  return toSummary(data);
}

export async function createDashboard(input: CreateDashboardInput): Promise<DashboardSummary> {
  const { data } = await api.post<RawDashboard>("/dashboard", input);
  return toSummary(data);
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
