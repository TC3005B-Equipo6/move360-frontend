import type { DashboardItem } from "../types";
import { GRID_COLUMNS, ITEM_SIZES } from "../grid.config";

export function findFirstFreeSlot(
  items: DashboardItem[],
  w: number,
  h: number,
  cols: number = GRID_COLUMNS,
): { col: number; row: number } {
  const occupied = new Set<number>();
  let maxRow = 0;
  for (const it of items) {
    const { w: iw, h: ih } = ITEM_SIZES[it.type];
    for (let dy = 0; dy < ih; dy++) {
      for (let dx = 0; dx < iw; dx++) {
        occupied.add((it.row + dy) * cols + (it.col + dx));
      }
    }
    maxRow = Math.max(maxRow, it.row + ih);
  }

  const fits = (c: number, r: number): boolean => {
    if (c + w > cols) return false;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (occupied.has((r + dy) * cols + (c + dx))) return false;
      }
    }
    return true;
  };

  for (let r = 0; r <= maxRow; r++) {
    for (let c = 0; c <= cols - w; c++) {
      if (fits(c, r)) return { col: c, row: r };
    }
  }
  return { col: 0, row: maxRow };
}
