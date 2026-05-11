import type { Layout, LayoutItem } from "react-grid-layout";

export function detectSwapTarget(
  before: Layout,
  oldItem: LayoutItem,
  newItem: LayoutItem,
): LayoutItem | undefined {
  return before.find(
    (it) =>
      it.i !== oldItem.i &&
      it.x === newItem.x &&
      it.y === newItem.y &&
      it.w === oldItem.w &&
      it.h === oldItem.h,
  );
}
