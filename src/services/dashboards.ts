import type { DashboardData } from "../components/Dashboard/types";

const storageKey = (id: string) => `move360:dashboard:${id}`;

export function loadDashboard(id: string): DashboardData {
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

export function saveDashboard(id: string, data: DashboardData): void {
  localStorage.setItem(storageKey(id), JSON.stringify(data));
}
