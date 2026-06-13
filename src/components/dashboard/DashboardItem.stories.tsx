import type { Meta, StoryObj } from "@storybook/react";
import { DashboardItem } from "./DashboardItem";
import type { DashboardItem as DashboardItemType } from "./types";

const chartItem: DashboardItemType = {
  id: "chart-1",
  type: "chartMd",
  row: 0,
  col: 0,
  config: {
    title: "Usuarios por línea",
    subtitle: "Últimos 30 días",
    delta: 12,
    data: [
      { name: "Línea 1", Usuarios: 120 },
      { name: "Línea 2", Usuarios: 95 },
      { name: "Línea 3", Usuarios: 80 },
    ],
    series: [
      {
        key: "Usuarios",
        color: "#4F46E5",
        label: "Usuarios",
      },
    ],
    config: {
      chartType: "line",
      sourceId: 1,
      tableId: 1,
      dimensionColumn: "linea",
      metricColumns: ["Usuarios"],
      operation: "SUM",
      compareEnabled: false,
      compareTableId: null,
      startMonth: "2026-01",
      endMonth: "2026-06",
      sourceName: "SEMOVI",
      tableName: "Usuarios",
    },
  },
};

const indicatorItem: DashboardItemType = {
  id: "indicator-1",
  type: "indicator",
  row: 0,
  col: 0,
  config: {
    title: "Usuarios activos",
    subtitle: "Últimos 30 días",
    data: 15234,
    relationship: "DIRECT",
    deltaData: 8,
    unit: "%",
    startDate: "2026-01-01",
    endDate: "2026-06-12",
  },
};

const meta = {
  title: "Components/DashboardItem",
  component: DashboardItem,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DashboardItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Chart: Story = {
  args: {
    item: chartItem,
    readonly: false,
    onDelete: (id) => console.log("Delete:", id),
    onEdit: (id) => console.log("Edit:", id),
  },
};

export const Indicator: Story = {
  args: {
    item: indicatorItem,
    readonly: false,
    onDelete: (id) => console.log("Delete:", id),
    onEdit: (id) => console.log("Edit:", id),
  },
};

export const Loading: Story = {
  args: {
    ...Chart.args,
    isLoading: true,
    loadingLabel: "Esperando confirmación",
  },
};

export const Readonly: Story = {
  args: {
    ...Chart.args,
    readonly: true,
  },
};

