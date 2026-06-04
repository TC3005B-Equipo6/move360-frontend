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

// Color = relationship ⊕ sign(deltaData). The arrow follows deltaData's sign
// only, so an up arrow on an `INVERSE` relation reads as bad (danger).

export const Directo_SinMovimiento: Story = {
  args: {
    data: 12,
    title: "Usuarios con descuento",
    relationship: "DIRECT",
  },
};

export const Inverso_SinMovimiento: Story = {
  args: {
    data: 10,
    title: "Tiempo de recorrido promedio",
    relationship: "INVERSE",
  },
};

export const Directo_Sube: Story = {
  args: {
    data: 24.8,
    title: "Afluencia mensual",
    relationship: "DIRECT",
    deltaData: 2.4,
    unit: "M",
  },
};

export const Directo_Baja: Story = {
  args: {
    data: 22.1,
    title: "Afluencia mensual",
    relationship: "DIRECT",
    deltaData: -1.6,
    unit: "M",
  },
};

export const Inverso_Sube: Story = {
  args: {
    data: 14,
    title: "Tiempo de recorrido promedio",
    relationship: "INVERSE",
    deltaData: 1.2,
    unit: "min",
  },
};

export const Inverso_Baja: Story = {
  args: {
    data: 11,
    title: "Tiempo de recorrido promedio",
    relationship: "INVERSE",
    deltaData: -0.8,
    unit: "min",
  },
};

export const ConUnidad: Story = {
  args: {
    data: 92,
    title: "Puntualidad",
    relationship: "DIRECT",
    deltaData: 1.1,
    unit: "%",
  },
};
