import { useEffect, useRef, useState } from "react";
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
import { loadDashboard, saveDashboard } from "../../services/dashboards";
import type { DashboardItem as Item, ChartConfig, IndicatorConfig, IndicatorWidget } from "./types";
import { IndicatorModal } from "../indicators/IndicatorModal/IndicatorModal";

interface Props {
  dashboardId?: string;
  readonly?: boolean;
  initialItems?: Item[];
  bottomBufferRows?: number;
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

export const DashboardGrid = ({ dashboardId = "demo", readonly = false, initialItems, bottomBufferRows = 1 }: Props) => {
  const [items, setItems] = useState<Item[]>(() => initialItems ?? loadDashboard(dashboardId).items);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<AddItemChoice | null>(null);
  const layoutBeforeDrag = useRef<LayoutItem[] | null>(null);

  useEffect(() => {
    if (!readonly) saveDashboard(dashboardId, { id: dashboardId, items });
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

  const handleIndicatorSave = (widget: IndicatorWidget) => {
    const config: IndicatorConfig = {
      value: widget.value,
      label: widget.label,
      name: widget.name,
      tone: widget.tone,
      operation: widget.operation,
      source: widget.source,
      table: widget.table,
      column: widget.column,
      startDate: widget.startDate,
      endDate: widget.endDate,
      backgroundColor: widget.backgroundColor,
      textColor: widget.textColor,
    };
    placeItem("indicator", config);
  };

  const handleChartSave = ({ type, config }: { type: ItemType; config: ChartConfig }) => {
    placeItem(type, config);
  };

  const handleDelete = (id: string) => {
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
    setItems((prev) => fromRGL(final, prev));
  };

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
            <DashboardItem key={item.id} item={item} onDelete={handleDelete} readonly={readonly} />
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
        <IndicatorModal onClose={closeConfigModal} onSave={handleIndicatorSave} />
      )}
      {!readonly && pendingChoice === "chart" && (
        <ChartFlowModal onClose={closeConfigModal} onSave={handleChartSave} />
      )}
    </div>
  );
};
