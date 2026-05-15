import type { Meta, StoryObj } from "@storybook/react-vite";
import { Indicator } from "./Indicator";

const meta: Meta<typeof Indicator> = {
  title: "Components/Indicator",
  component: Indicator,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          background: "var(--surface-base)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Indicator>;

const baseDates = {
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-31"),
  isMenuOpen: false,
};

export const SinDelta_Direct: Story = {
  args: {
    value: 12,
    label: "Usuarios con descuento",
    tone: "direct",
    name: "Descuento",
    ...baseDates,
  },
};

export const SinDelta_Inverse: Story = {
  args: {
    value: 10,
    label: "Tiempo de recorrido promedio",
    tone: "inverse",
    name: "Recorrido",
    ...baseDates,
  },
};

export const DirectSube: Story = {
  args: {
    value: 24.8,
    label: "Afluencia mensual",
    tone: "direct",
    name: "Afluencia",
    delta: 2.4,
    unit: "M",
    ...baseDates,
  },
};

export const DirectBaja: Story = {
  args: {
    value: 22.1,
    label: "Afluencia mensual",
    tone: "direct",
    name: "Afluencia",
    delta: -1.6,
    unit: "M",
    ...baseDates,
  },
};

export const InverseSube: Story = {
  args: {
    value: 14,
    label: "Tiempo de recorrido promedio",
    tone: "inverse",
    name: "Recorrido",
    delta: 1.2,
    unit: "min",
    ...baseDates,
  },
};

export const InverseBaja: Story = {
  args: {
    value: 11,
    label: "Tiempo de recorrido promedio",
    tone: "inverse",
    name: "Recorrido",
    delta: -0.8,
    unit: "min",
    ...baseDates,
  },
};

export const ConUnidad: Story = {
  args: {
    value: 92,
    label: "Puntualidad",
    tone: "direct",
    name: "Puntualidad",
    delta: 1.1,
    unit: "%",
    ...baseDates,
  },
};
