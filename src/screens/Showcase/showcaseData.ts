// Showcase — throwaway prototype data + format helpers.
// Phase 1 of the redesign. This whole folder is exploratory: it does NOT use the
// real component library and may be deleted once the official identity is chosen.
// The /showcase route itself is kept as a living style reference.

import {
  monthlyData,
  systemData,
  paymentData,
  rankingData,
} from "../../databases/dashboardData";

export { monthlyData, systemData, paymentData, rankingData };

/** Compact number for KPIs / axes: 1_263_959_562 -> "1.26 B". */
export function formatCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)} K`;
  return `${n}`;
}

/** Full grouped number for tooltips: 1263959562 -> "1,263,959,562". */
export function formatFull(n: number): string {
  return n.toLocaleString("es-MX");
}

export interface Kpi {
  label: string;
  value: string;
  unit?: string;
  delta: number; // percentage points, signed
}

/** KPI row mirroring HOME_DASHBOARD_ITEMS, with synthetic deltas for the prototype. */
export const kpis: Kpi[] = [
  { label: "Metro", value: "70.2", unit: "%", delta: 2.4 },
  { label: "Metrobús", value: "28.1", unit: "%", delta: 1.1 },
  { label: "Tren Ligero", value: "1.7", unit: "%", delta: -0.3 },
  { label: "Prepago", value: "88.6", unit: "%", delta: 0.8 },
  { label: "Gratuidad", value: "11.4", unit: "%", delta: -0.8 },
  { label: "Total anual", value: "1,800.8", unit: "M", delta: 3.2 },
];

export interface DashboardEntry {
  title: string;
  author: string;
  date: string;
  kind: "dashboard" | "report";
}

/** Mock dashboard list for the variants that show one. */
export const dashboardList: DashboardEntry[] = [
  { title: "Dashboard Línea 5", author: "Eleanor Alarcón", date: "23 feb 2026", kind: "dashboard" },
  { title: "Tendencias Enero 2026", author: "Omar Estrada", date: "11 feb 2026", kind: "dashboard" },
  { title: "Líneas 1 a 5 — Operaciones", author: "Eleanor Alarcón", date: "08 nov 2025", kind: "report" },
  { title: "Afluencia Metrobús Q4", author: "Andrés García", date: "30 oct 2025", kind: "dashboard" },
];
