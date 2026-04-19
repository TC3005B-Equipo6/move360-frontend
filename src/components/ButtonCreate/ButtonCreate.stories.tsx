import type { Meta, StoryObj } from "@storybook/react";
import { CreateButton } from "./ButtonCreate";

const meta: Meta<typeof CreateButton> = {
  title: "Components/CreateButton",
  component: CreateButton,
};

export default meta;

type Story = StoryObj<typeof CreateButton>;

export const Dashboard: Story = {
  args: {
    variant: "primary",
    size: "medium",
    label: "Nuevo dashboard +",
    onPress: () => console.log("New dashboard"),
  },
};

export const Grafico: Story = {
  args: {
    variant: "secondary",
    size: "small",
    label: "Nueva gráfica +",
    onPress: () => console.log("New graph"),
  },
};

export const Eliminar: Story = {
  args: {
    variant: "danger",
    size: "small",
    label: "Eliminar",
    onPress: () => console.log("Eliminar"),
  },
};