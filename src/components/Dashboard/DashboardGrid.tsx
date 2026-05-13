import { useEffect, useRef, useState } from "react";
import {
  GridLayout,
  getCompactor,
  type EventCallback,
  type LayoutItem,
} from "react-grid-layout";
import { AddButton } from "../AddButton/AddButton";
import { AddItemModal, type AddItemChoice } from "./AddItemModal";
import { ChartFlowModal } from "./ChartFlowModal";
import { DashboardItem } from "./DashboardItem";
import { CELL_SIZE, GRID_COLUMNS, GUTTER, ITEM_SIZES, type ItemType } from "./grid.config";
import { findFirstFreeSlot } from "./layout/findFirstFreeSlot";
import { fromRGL, toRGL } from "./layout/mapping";
import { resolveCollisions } from "./layout/resolveCollisions";
import { detectSwapTarget } from "./layout/swapDetection";
import { loadDashboard, saveDashboard } from "../../services/dashboards";
import type { DashboardItem as Item, ChartConfig, IndicatorConfig } from "./types";
import { IndicatorModal } from "../Indicator/IndicatorModal";
import type { IndicatorWidget } from "../Indicator/types";

interface Props {
  dashboardId?: string;
}

const GRID_WIDTH = GRID_COLUMNS * CELL_SIZE + (GRID_COLUMNS - 1) * GUTTER + 2 * GUTTER;

// noOverlapCompactor: type=null + allowOverlap=true. RGL no empuja items durante el drag
// (deja overlaps visuales mientras el cursor está encima); el push lo aplicamos nosotros
// en onDragStop con resolveCollisions (push mínimo + cascada).
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

export const DashboardGrid = ({ dashboardId = "demo" }: Props) => {
  const [items, setItems] = useState<Item[]>(() => loadDashboard(dashboardId).items);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<AddItemChoice | null>(null);
  const layoutBeforeDrag = useRef<LayoutItem[] | null>(null);

  useEffect(() => {
    saveDashboard(dashboardId, { id: dashboardId, items });
  }, [dashboardId, items]);

  // Una fila extra después de la última ocupada (vacía siempre visible al final).
  const occupiedRows = items.reduce(
    (max, it) => Math.max(max, it.row + ITEM_SIZES[it.type].h),
    0,
  );
  const visibleRows = occupiedRows + 1;
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
      isPositive: widget.isPositive,
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
            enabled: true,
            bounded: true,
            cancel: ".item-menu, [data-action-menu-trigger]",
          }}
          resizeConfig={{ enabled: false }}
          compactor={compactor}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
        >
          {items.map((item) => (
            <DashboardItem key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </GridLayout>
      </div>

      <div className="fixed bottom-8 right-8 z-30">
        <AddButton onPress={() => setPickerOpen(true)} />
      </div>

      {pickerOpen && <AddItemModal onSelect={handlePick} onClose={() => setPickerOpen(false)} />}

      {pendingChoice === "indicator" && (
        <IndicatorModal onClose={closeConfigModal} onSave={handleIndicatorSave} />
      )}
      {pendingChoice === "chart" && (
        <ChartFlowModal onClose={closeConfigModal} onSave={handleChartSave} />
      )}
    </div>
  );
};
