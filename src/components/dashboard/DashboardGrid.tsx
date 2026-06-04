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
import { loadDashboardItems, saveDashboardItems, saveLayout } from "../../services/dashboard/dashboardService";
import {
  buildCreatePayload,
  buildUpdatePayload,
  createIndicator,
  deleteIndicator,
  updateIndicator,
} from "../../services/indicator/indicatorService";
import {
  buildCreateGraphPayload,
  buildUpdateGraphPayload,
  createGraph,
  deleteGraph,
  graphToChartConfig,
  updateGraph,
} from "../../services/graph/graphService";
import { itemTypeToSize, kindFromType, toCoord } from "./itemMapping";
import type { DashboardItem as Item, ChartConfig, IndicatorConfig, IndicatorWidget } from "./types";
import { IndicatorModal } from "../indicators/IndicatorModal/IndicatorModal";

interface Props {
  dashboardId?: string;
  readonly?: boolean;
  initialItems?: Item[];
  bottomBufferRows?: number;
  /** When true, item changes (indicators AND graphs) sync to the backend
   * (`dashboardId` must be a real UUID) and items come from `initialItems`
   * instead of localStorage. Only `DashboardDetail` enables this; Home/Test
   * stay local. */
  persistToBackend?: boolean;
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
  { dashboardId = "demo", readonly = false, initialItems, bottomBufferRows = 1, persistToBackend = false },
  ref,
) {
  const [items, setItems] = useState<Item[]>(() => initialItems ?? loadDashboardItems(dashboardId).items);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<AddItemChoice | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const layoutBeforeDrag = useRef<LayoutItem[] | null>(null);

  // Local-only screens (Home/Test) mirror the grid into localStorage. Backed
  // dashboards are server-sourced, so we never write them locally.
  useEffect(() => {
    if (!readonly && !persistToBackend) saveDashboardItems(dashboardId, { id: dashboardId, items });
  }, [dashboardId, items, readonly, persistToBackend]);

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

  // Create: place the indicator locally, then (if persisting) POST it. The
  // backend computes `data`/`deltaData`; we patch them back onto the item.
  const handleIndicatorCreate = (widget: IndicatorWidget) => {
    const config: IndicatorConfig = widget;
    const { w, h } = ITEM_SIZES.indicator;
    const { col, row } = findFirstFreeSlot(items, w, h);
    const id = widget.id;
    const newItem: Item = { id, type: "indicator", row, col, config };
    setItems((prev) => [...prev, newItem]);
    setPendingChoice(null);

    if (!persistToBackend) return;
    createIndicator(buildCreatePayload(config, dashboardId, col, row))
      .then((res) => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === id
              ? {
                  ...it,
                  resourceId: res.id,
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

  // Edit: replace the indicator config and flag content modified (the PATCH
  // happens later in flushModified, on confirm — see ADR 0002).
  const handleIndicatorEdit = (widget: IndicatorWidget) => {
    const config: IndicatorConfig = widget;
    setItems((prev) =>
      prev.map((it) => (it.id === widget.id ? { ...it, config, contentModified: true } : it)),
    );
    setEditingId(null);
  };

  // Create: place the graph locally, then (if persisting) POST it. The backend
  // computes data/series/delta; we patch the returned snapshot onto the item.
  const handleChartSave = ({ type, config }: { type: ItemType; config: ChartConfig }) => {
    const { w, h } = ITEM_SIZES[type];
    const { col, row } = findFirstFreeSlot(items, w, h);
    const id = crypto.randomUUID();
    const newItem: Item = { id, type, row, col, config };
    setItems((prev) => [...prev, newItem]);
    setPendingChoice(null);

    if (!persistToBackend) return;
    const size = itemTypeToSize(type);
    createGraph(buildCreateGraphPayload(config, size, dashboardId, col, row))
      .then((res) => {
        // res.type is present on the full GraphResponse. Keep the display-only
        // labels captured by the modal; take computed data/series/delta from back.
        const mapped = graphToChartConfig(res, res.type!, {
          sourceName: config.config.sourceName,
          tableName: config.config.tableName,
        });
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, resourceId: res.id, config: mapped } : it)),
        );
      })
      .catch((e) => console.error("POST /graph failed", e));
  };

  // Edit: replace the graph config (and size, since the modal can resize) and
  // flag content modified. The PATCH happens later in flushModified, on confirm.
  const handleChartEdit = ({ type, config }: { type: ItemType; config: ChartConfig }) => {
    setItems((prev) =>
      prev.map((it) => (it.id === editingId ? { ...it, type, config, contentModified: true } : it)),
    );
    setEditingId(null);
  };

  const handleEditRequest = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (item) setEditingId(id);
  };

  const handleDelete = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (persistToBackend && item?.resourceId != null) {
      const request =
        kindFromType(item.type) === "GRAPH"
          ? deleteGraph(item.resourceId)
          : deleteIndicator(item.resourceId);
      request.catch((e) => console.error("DELETE item failed", e));
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
          return { ...it, moved: true };
        }
        return it;
      });
    });
  };

  // Flush pending changes on confirm: all moved items go in a single batch
  // layout PUT (coordinates), while content edits go in per-resource PATCHes
  // (/indicator or /graph). Then clear the flags. See ADR 0002.
  const flushModified = useCallback(async () => {
    if (!persistToBackend) return;
    const persisted = items.filter((it) => it.resourceId != null);

    const layoutItems = persisted
      .filter((it) => it.moved)
      .map((it) => ({
        kind: kindFromType(it.type),
        resourceId: it.resourceId!,
        coordinate: toCoord(it.col, it.row),
      }));

    const contentPatches = persisted
      .filter((it) => it.contentModified)
      .map((it) =>
        it.type === "indicator"
          ? updateIndicator(it.resourceId!, buildUpdatePayload(it))
          : updateGraph(it.resourceId!, buildUpdateGraphPayload(it.config as ChartConfig, itemTypeToSize(it.type))),
      );

    await Promise.all([
      ...contentPatches,
      layoutItems.length > 0 ? saveLayout(dashboardId, layoutItems) : Promise.resolve(),
    ]);

    if (layoutItems.length > 0 || contentPatches.length > 0) {
      setItems((prev) =>
        prev.map((it) =>
          it.moved || it.contentModified ? { ...it, moved: false, contentModified: false } : it,
        ),
      );
    }
  }, [items, persistToBackend, dashboardId]);

  useImperativeHandle(ref, () => ({ flushModified }), [flushModified]);

  const editingItem = items.find((it) => it.id === editingId);
  const editingIndicator = editingItem?.type === "indicator" ? editingItem : undefined;
  const editingChart = editingItem && editingItem.type !== "indicator" ? editingItem : undefined;
  const editingWidget: IndicatorWidget | undefined = editingIndicator
    ? { ...(editingIndicator.config as IndicatorConfig), id: editingIndicator.id }
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
      {!readonly && editingIndicator && (
        <IndicatorModal
          onClose={() => setEditingId(null)}
          onSave={handleIndicatorEdit}
          indicator={editingWidget}
        />
      )}
      {!readonly && editingChart && (
        <ChartFlowModal
          onClose={() => setEditingId(null)}
          onSave={handleChartEdit}
          chart={{ type: editingChart.type, config: editingChart.config as ChartConfig }}
        />
      )}
    </div>
  );
});
