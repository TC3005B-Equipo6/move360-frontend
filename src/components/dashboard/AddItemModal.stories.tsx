import type { Meta, StoryObj } from "@storybook/react";
import { AddItemModal } from "./AddItemModal";

const meta = {
  title: "Dashboard/AddItemModal",
  component: AddItemModal,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AddItemModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => console.log("Cerrar modal"),
    onSelect: (choice) => console.log("Seleccionado:", choice),
  },
};

export const Playground: Story = {
  args: {
    onClose: () => {},
    onSelect: (choice) => {
      alert(`Seleccionaste: ${choice}`);
    },
  },
};
