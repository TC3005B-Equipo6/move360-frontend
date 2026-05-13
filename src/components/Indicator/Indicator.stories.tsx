import type { Meta, StoryObj } from "@storybook/react";
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
        padding: 10}}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Indicator>;

export const Positivo: Story = {
  args: {
    value: 12,
    label: "Usuarios con descuento",
    tone: "direct",
    name: "Descuento",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    isMenuOpen: false,
  },
};

export const Negativo: Story = {
  args: {
    value: 10,
    label: "Tiempo de recorrido promedio",
    tone: "inverse",
    name: "Recorrido",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    isMenuOpen: false,
  },
};

export const Neutro: Story = {
  args: {
    value: -2,
    label: "Promedio de usuarios mensuales",
    tone: "direct",
    name: "Usuarios",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    isMenuOpen: false,
  },
};

export const ConMenu: Story = {
  args: {
    value: 5,
    label: "Usuarios en línea",
    tone: "direct",
    name: "En línea",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    isMenuOpen: true,
  },
};
