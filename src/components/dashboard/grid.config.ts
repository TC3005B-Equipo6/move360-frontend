export const GRID_COLUMNS = 6;
export const CELL_SIZE = 180;
export const GUTTER = 20;

export const ITEM_SIZES = {
  indicator: { w: 1, h: 1 },
  chartSm: { w: 2, h: 2 },
  chartMd: { w: 3, h: 2 },
  chartLg: { w: 5, h: 2 },
} as const;

export type ItemType = keyof typeof ITEM_SIZES;
