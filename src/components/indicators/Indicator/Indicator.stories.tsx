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

// `delta` is the backend verdict (color); `deltaData` is the signed magnitude
// (its sign draws the arrow). The two are independent: an up arrow can be bad.

export const SinMovimiento_Positivo: Story = {
  args: {
    value: 12,
    label: "Usuarios con descuento",
    delta: "positive",
  },
};

export const SinMovimiento_Negativo: Story = {
  args: {
    value: 10,
    label: "Tiempo de recorrido promedio",
    delta: "negative",
  },
};

export const Sube_Bueno: Story = {
  args: {
    value: 24.8,
    label: "Afluencia mensual",
    delta: "positive",
    deltaData: 2.4,
    unit: "M",
  },
};

export const Baja_Malo: Story = {
  args: {
    value: 22.1,
    label: "Afluencia mensual",
    delta: "negative",
    deltaData: -1.6,
    unit: "M",
  },
};

export const Sube_Malo: Story = {
  args: {
    value: 14,
    label: "Tiempo de recorrido promedio",
    delta: "negative",
    deltaData: 1.2,
    unit: "min",
  },
};

export const Baja_Bueno: Story = {
  args: {
    value: 11,
    label: "Tiempo de recorrido promedio",
    delta: "positive",
    deltaData: -0.8,
    unit: "min",
  },
};

export const ConUnidad: Story = {
  args: {
    value: 92,
    label: "Puntualidad",
    delta: "positive",
    deltaData: 1.1,
    unit: "%",
  },
};
