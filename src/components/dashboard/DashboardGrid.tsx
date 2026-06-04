import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  GridLayout,
  getCompactor,
  type EventCallback,
  type LayoutItem,
} from "react-grid-layout";
import { AddButton } from "../common/AddButton/AddButton";
import { AddItemModal, type AddItemChoice } from "./AddItemModal";
import { ChartFlowModal } from "./ChartFlowModal";
import { DashboardItem } from "./DashboardItem";
import { CELL_SIZE, GRID_COLUMNS, GUTTER, ITEM_SIZES, type ItemType } from "./grid.config";
import { findFirstFreeSlot } from "./layout/findFirstFreeSlot";
import { fromRGL, toRGL } from "./layout/mapping";
import { resolveCollisions } from "./layout/resolveCollisions";
import { detectSwapTarget } from "./layout/swapDetection";
import { loadDashboardItems, saveDashboardItems } from "../../services/dashboard/dashboardService";
import {
  buildCreatePayload,
  buildUpdatePayload,
  createIndicator,
  deleteIndicator,
  updateIndicator,
} from "../../services/indicator/indicatorService";
import type { DashboardItem as Item, ChartConfig, IndicatorConfig, IndicatorWidget } from "./types";
import { IndicatorModal } from "../indicators/IndicatorModal/IndicatorModal";

interface Props {
  dashboardId?: string;
  readonly?: boolean;
  initialItems?: Item[];
  bottomBufferRows?: number;
  /** When true, indicator changes sync to the backend (`dashboardId` must be a
   * real UUID). Only `DashboardDetail` enables this; Home/Test stay local. */
  persistIndicators?: boolean;
}

/** Imperative handle: parent (the confirm button) flushes pending edits. */
export interface DashboardGridHandle {
  flushModified: () => Promise<void>;
}

const GRID_WIDTH = GRID_COLUMNS * CELL_SIZE + (GRID_COLUMNS - 1) * GUTTER + 2 * GUTTER;

const compactor = getCompactor(null, true);

function computeReflowLayout(
  before: LayoutItem[],
  oldItem: LayoutItem,
  newItem: LayoutItem,
): LayoutItem[] {
  const target = detectSwapTarget(before, oldItem, newItem);
  if (target) {
    return before.map((it) => {
      if (it.i === oldItem.i) return { ...it, x: target.x, y: target.y };
      if (it.i === target.i) return { ...it, x: oldItem.x, y: oldItem.y };
      return it;
    });
  }
  const placed = before.map((it) =>
    it.i === newItem.i ? { ...it, x: newItem.x, y: newItem.y } : it,
  );
  return resolveCollisions(placed, newItem.i);
}

export const DashboardGrid = forwardRef<DashboardGridHandle, Props>(function DashboardGrid(
  { dashboardId = "demo", readonly = false, initialItems, bottomBufferRows = 1, persistIndicators = false },
  ref,
) {
  const [items, setItems] = useState<Item[]>(() => initialItems ?? loadDashboardItems(dashboardId).items);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<AddItemChoice | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const layoutBeforeDrag = useRef<LayoutItem[] | null>(null);

  useEffect(() => {
    if (!readonly) saveDashboardItems(dashboardId, { id: dashboardId, items });
  }, [dashboardId, items, readonly]);

  const occupiedRows = items.reduce(
    (max, it) => Math.max(max, it.row + ITEM_SIZES[it.type].h),
    0,
  );
  const visibleRows = occupiedRows + bottomBufferRows;
  const minHeight = visibleRows * CELL_SIZE + (visibleRows + 1) * GUTTER;

  const handlePick = (choice: AddItemChoice) => {
    setPendingChoice(choice);
    setPickerOpen(false);
  };

  const closeConfigModal = () => setPendingChoice(null);

  const placeItem = (type: ItemType, config: IndicatorConfig | ChartConfig) => {
    const { w, h } = ITEM_SIZES[type];
    const { col, row } = findFirstFreeSlot(items, w, h);
    const newItem: Item = { id: crypto.randomUUID(), type, row, col, config };
    setItems((prev) => [...prev, newItem]);
    setPendingChoice(null);
  };

  // Create: place the indicator locally, then (if persisting) POST it. The
  // backend computes `data`/`deltaData`; we patch them back onto the item.
  const handleIndicatorCreate = (widget: IndicatorWidget) => {
    const config: IndicatorConfig = widget;
    const { w, h } = ITEM_SIZES.indicator;
    const { col, row } = findFirstFreeSlot(items, w, h);
    const id = widget.id;
    const newItem: Item = { id, type: "indicator", row, col, config, modified: false };
    setItems((prev) => [...prev, newItem]);
    setPendingChoice(null);

    if (!persistIndicators) return;
    createIndicator(buildCreatePayload(config, dashboardId, col, row))
      .then((res) => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === id
              ? {
                  ...it,
                  indicatorId: res.id,
                  config: {
                    ...(it.config as IndicatorConfig),
                    data: res.data ?? 0,
                    deltaData: res.deltaData ?? (it.config as IndicatorConfig).deltaData,
                  },
                }
              : it,
          ),
        );
      })
      .catch((e) => console.error("POST /indicator failed", e));
  };

  // Edit: replace the indicator config and flag it modified (the PATCH happens
  // later in flushModified, on confirm — see ADR 0002).
  const handleIndicatorEdit = (widget: IndicatorWidget) => {
    const config: IndicatorConfig = widget;
    setItems((prev) => prev.map((it) => (it.id === widget.id ? { ...it, config, modified: true } : it)));
    setEditingId(null);
  };

  const handleChartSave = ({ type, config }: { type: ItemType; config: ChartConfig }) => {
    placeItem(type, config);
  };

  const handleEditRequest = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (item?.type === "indicator") setEditingId(id);
  };

  const handleDelete = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (persistIndicators && item?.type === "indicator" && item.indicatorId != null) {
      deleteIndicator(item.indicatorId).catch((e) => console.error("DELETE /indicator failed", e));
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleDragStart: EventCallback = () => {
    layoutBeforeDrag.current = toRGL(items);
  };

  const handleDragStop: EventCallback = (_layout, oldItem, newItem) => {
    const before = layoutBeforeDrag.current;
    layoutBeforeDrag.current = null;
    if (!before || !oldItem || !newItem) return;

    const final = computeReflowLayout(before, oldItem, newItem);
    setItems((prev) => {
      const next = fromRGL(final, prev);
      // Any item whose coordinate changed is now pending a PATCH.
      return next.map((it) => {
        const prior = prev.find((p) => p.id === it.id);
        if (prior && (prior.row !== it.row || prior.col !== it.col)) {
          return { ...it, modified: true };
        }
        return it;
      });
    });
  };

  // Flush all pending indicator edits (coordinate/title/subtitle/relationship)
  // to the backend in one batch, then clear the flags. Called from the confirm
  // button via the imperative handle.
  const flushModified = useCallback(async () => {
    if (!persistIndicators) return;
    const toUpdate = items.filter(
      (it) => it.modified && it.type === "indicator" && it.indicatorId != null,
    );
    await Promise.all(toUpdate.map((it) => updateIndicator(it.indicatorId!, buildUpdatePayload(it))));
    if (toUpdate.length > 0) {
      setItems((prev) => prev.map((it) => (it.modified ? { ...it, modified: false } : it)));
    }
  }, [items, persistIndicators]);

  useImperativeHandle(ref, () => ({ flushModified }), [flushModified]);

  const editingItem = items.find((it) => it.id === editingId && it.type === "indicator");
  const editingWidget: IndicatorWidget | undefined = editingItem
    ? { ...(editingItem.config as IndicatorConfig), id: editingItem.id }
    : undefined;

  return (
    <div className="relative w-full h-full overflow-auto">
      <div style={{ width: GRID_WIDTH }} className="mx-auto">
        <GridLayout
          width={GRID_WIDTH}
          layout={toRGL(items)}
          style={{ minHeight }}
          gridConfig={{
            cols: GRID_COLUMNS,
            rowHeight: CELL_SIZE,
            margin: [GUTTER, GUTTER],
            containerPadding: [GUTTER, GUTTER],
          }}
          dragConfig={{
            enabled: !readonly,
            bounded: true,
            cancel: ".item-menu, [data-action-menu-trigger]",
          }}
          resizeConfig={{ enabled: false }}
          compactor={compactor}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
        >
          {items.map((item) => (
            <DashboardItem
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onEdit={handleEditRequest}
              readonly={readonly}
            />
          ))}
        </GridLayout>
      </div>

      {!readonly && (
        <div className="fixed bottom-8 right-8 z-30">
          <AddButton onPress={() => setPickerOpen(true)} />
        </div>
      )}

      {!readonly && pickerOpen && <AddItemModal onSelect={handlePick} onClose={() => setPickerOpen(false)} />}

      {!readonly && pendingChoice === "indicator" && (
        <IndicatorModal onClose={closeConfigModal} onSave={handleIndicatorCreate} />
      )}
      {!readonly && pendingChoice === "chart" && (
        <ChartFlowModal onClose={closeConfigModal} onSave={handleChartSave} />
      )}
      {!readonly && editingItem && (
        <IndicatorModal
          onClose={() => setEditingId(null)}
          onSave={handleIndicatorEdit}
          indicator={editingWidget}
        />
      )}
    </div>
  );
});
