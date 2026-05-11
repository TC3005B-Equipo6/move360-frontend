import type { ItemType } from "./grid.config";

export interface DashboardItem {
  id: string;
  type: ItemType;
  row: number;
  col: number;
}

export interface DashboardData {
  id: string;
  items: DashboardItem[];
}
