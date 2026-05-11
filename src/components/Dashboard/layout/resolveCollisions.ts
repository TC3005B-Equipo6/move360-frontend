import type { LayoutItem } from "react-grid-layout";
import { GRID_COLUMNS } from "../grid.config";

export function rectsOverlap(a: LayoutItem, b: LayoutItem): boolean {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

/**
 * Busca el primer slot libre arriba del item, manteniendo SU MISMA COLUMNA (item.x).
 * Devuelve null si no hay espacio arriba en esa columna.
 */
function findSlotAbove(
  layout: LayoutItem[],
  item: LayoutItem,
  cols: number,
): { x: number; y: number } | null {
  const occupied = new Set<number>();
  for (const it of layout) {
    if (it.i === item.i) continue;
    for (let dy = 0; dy < it.h; dy++) {
      for (let dx = 0; dx < it.w; dx++) {
        occupied.add((it.y + dy) * cols + (it.x + dx));
      }
    }
  }

  const fits = (y: number): boolean => {
    for (let dy = 0; dy < item.h; dy++) {
      for (let dx = 0; dx < item.w; dx++) {
        if (occupied.has((y + dy) * cols + (item.x + dx))) return false;
      }
    }
    return true;
  };

  for (let y = 0; y < item.y; y++) {
    if (fits(y)) return { x: item.x, y };
  }
  return null;
}

/**
 * Reordena items que colisionan con el dragger. Para cada item desplazado:
 *   1) Si hay un slot libre arriba (y menor), se mueve ahí.
 *   2) Si no, se empuja hacia abajo a pusher.y + pusher.h (con cascada).
 * El dragger nunca se mueve.
 */
export function resolveCollisions(
  layout: LayoutItem[],
  draggerId: string,
  cols: number = GRID_COLUMNS,
): LayoutItem[] {
  const items = layout.map((it) => ({ ...it }));
  const indexById = new Map(items.map((it, i) => [it.i, i] as const));
  const queue: string[] = [draggerId];

  while (queue.length > 0) {
    const id = queue.shift()!;
    const pusherIdx = indexById.get(id);
    if (pusherIdx === undefined) continue;
    const pusher = items[pusherIdx];

    for (let i = 0; i < items.length; i++) {
      const candidate = items[i];
      if (candidate.i === pusher.i) continue;
      if (candidate.i === draggerId) continue;
      if (!rectsOverlap(candidate, pusher)) continue;

      // Try UP first
      const upSlot = findSlotAbove(items, candidate, cols);
      if (upSlot !== null) {
        items[i] = { ...candidate, x: upSlot.x, y: upSlot.y };
        // Sin cascada: el slot encontrado está garantizado libre.
        continue;
      }

      // Push DOWN (comportamiento previo) con cascada.
      const newY = pusher.y + pusher.h;
      if (newY > candidate.y) {
        items[i] = { ...candidate, y: newY };
        queue.push(candidate.i);
      }
    }
  }

  return items;
}
