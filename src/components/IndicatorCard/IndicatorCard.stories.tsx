import type { Meta, StoryObj } from "@storybook/react";
import { IndicatorCard } from "./IndicatorCard";

const meta: Meta<typeof IndicatorCard> = {
  title: "Components/IndicatorCard",
  component: IndicatorCard,
};

export default meta;

type Story = StoryObj<typeof IndicatorCard>;

export const Positivo: Story = {
  args: {
    value: "+12%",
    label: "Usuarios con descuento",
    tone: "positive",
  },
};

export const Negativo: Story = {
  args: {
    value: "+10%",
    label: "Tiempo de recorrido promedio",
    tone: "negative",
  },
};

export const Neutro: Story = {
  args: {
    value: "-2%",
    label: "Promedio de usuarios mensuales",
    tone: "neutral",
  },
};

export const ConMenu: Story = {
  args: {
    value: "+5%",
    label: "Usuarios en línea 4",
    tone: "positive",
    onMenuClick: () => console.log("Menu abierto"),
  },
};
