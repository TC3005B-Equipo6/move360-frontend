import type { Layout, LayoutItem } from "react-grid-layout";
import type { DashboardItem } from "../types";
import { ITEM_SIZES } from "../grid.config";

export function toRGL(items: DashboardItem[]): LayoutItem[] {
  return items.map((it) => {
    const { w, h } = ITEM_SIZES[it.type];
    return { i: it.id, x: it.col, y: it.row, w, h };
  });
}

export function fromRGL(layout: Layout, items: DashboardItem[]): DashboardItem[] {
  const byId = new Map(items.map((it) => [it.id, it] as const));
  return layout
    .map((l) => {
      const original = byId.get(l.i);
      if (!original) return null;
      return { ...original, row: l.y, col: l.x };
    })
    .filter((it): it is DashboardItem => it !== null);
}
