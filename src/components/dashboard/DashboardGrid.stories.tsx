import type { Meta, StoryObj } from "@storybook/react";
import { DashboardGrid } from "./DashboardGrid";
import type { DashboardItem } from "./types";

const demoItems: DashboardItem[] = [
  {
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
  },
  {
    id: "chart-1",
    type: "chartMd",
    row: 0,
    col: 2,
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
  },
];

const meta = {
  title: "Dashboard/DashboardGrid",
  component: DashboardGrid,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DashboardGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dashboardId: "storybook",
    readonly: false,
    persistToBackend: false,
    initialItems: demoItems,
  },
};

export const Readonly: Story = {
  args: {
    dashboardId: "storybook",
    readonly: true,
    persistToBackend: false,
    initialItems: demoItems,
  },
};

export const Empty: Story = {
  args: {
    dashboardId: "storybook",
    readonly: false,
    persistToBackend: false,
    initialItems: [],
  },
};
