import type { Meta, StoryObj } from "@storybook/react";
import { ListItem } from "./ListItem";

const meta: Meta<typeof ListItem> = {
  title: "Components/ListItem",
  component: ListItem,
};

export default meta;

type Story = StoryObj<typeof ListItem>;

export const Dashboard: Story = {
  args: {
    title: "Dashboard Línea 5",
    date: "23-02-2026",
    author: "Eleanor Alarcón",
    iconName: "barchart",
    onPress: () => console.log("Abrir dashboard"),
  },
};

export const Reporte: Story = {
  args: {
    title: "Líneas 1 A 5 Reporte Operaciones",
    date: "08-11-2025",
    author: "Eleanor Alarcón",
    iconName: "file",
    onPress: () => console.log("Abrir reporte"),
  },
};

export const TituloLargo: Story = {
  args: {
    title: "Tendencias Enero 2026 Línea 5 Con Un Título Extra Largo Para Probar Truncado",
    date: "23-02-2026",
    author: "Omar Estrada",
    iconName: "barchart",
    onPress: () => console.log("Click"),
  },
};
