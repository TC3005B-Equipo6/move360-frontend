import type { Meta, StoryObj } from "@storybook/react";
import { ChartFlowModal } from "./ChartFlowModal";
import type { ChartConfig } from "./types";

const editConfig: ChartConfig = {
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
      label: "Usuarios",
      color: "var(--chart-1)",
    },
  ],
  config: {
    chartType: "bar",
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
};

const meta = {
  title: "Dashboard/ChartFlowModal",
  component: ChartFlowModal,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ChartFlowModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Create: Story = {
  args: {
    onClose: () => console.log("Cerrar"),
    onSave: (result) => console.log("Guardar:", result),
  },
};

export const Edit: Story = {
  args: {
    onClose: () => console.log("Cerrar"),
    onSave: (result) => console.log("Guardar:", result),
    chart: {
      type: "chartMd",
      config: editConfig,
    },
  },
};

export const EditLineChart: Story = {
  args: {
    onClose: () => {},
    onSave: (result) => console.log(result),
    chart: {
      type: "chartLg",
      config: {
        ...editConfig,
        config: {
          ...editConfig.config,
          chartType: "line",
        },
      },
    },
  },
};

export const EditRanking: Story = {
  args: {
    onClose: () => {},
    onSave: (result) => console.log(result),
    chart: {
      type: "chartMd",
      config: {
        ...editConfig,
        config: {
          ...editConfig.config,
          chartType: "ranking",
          metricColumns: ["Usuarios"],
        },
      },
    },
  },
};
