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

// Color = relationType ⊕ sign(deltaData). The arrow follows deltaData's sign
// only, so an up arrow on an `inverse` relation reads as bad (danger).

export const Directo_SinMovimiento: Story = {
  args: {
    value: 12,
    label: "Usuarios con descuento",
    relationType: "direct",
  },
};

export const Inverso_SinMovimiento: Story = {
  args: {
    value: 10,
    label: "Tiempo de recorrido promedio",
    relationType: "inverse",
  },
};

export const Directo_Sube: Story = {
  args: {
    value: 24.8,
    label: "Afluencia mensual",
    relationType: "direct",
    deltaData: 2.4,
    unit: "M",
  },
};

export const Directo_Baja: Story = {
  args: {
    value: 22.1,
    label: "Afluencia mensual",
    relationType: "direct",
    deltaData: -1.6,
    unit: "M",
  },
};

export const Inverso_Sube: Story = {
  args: {
    value: 14,
    label: "Tiempo de recorrido promedio",
    relationType: "inverse",
    deltaData: 1.2,
    unit: "min",
  },
};

export const Inverso_Baja: Story = {
  args: {
    value: 11,
    label: "Tiempo de recorrido promedio",
    relationType: "inverse",
    deltaData: -0.8,
    unit: "min",
  },
};

export const ConUnidad: Story = {
  args: {
    value: 92,
    label: "Puntualidad",
    relationType: "direct",
    deltaData: 1.1,
    unit: "%",
  },
};
