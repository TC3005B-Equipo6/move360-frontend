import type { Meta, StoryObj } from "@storybook/react";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

const meta: Meta<typeof LogoutConfirmModal> = {
  title: "Components/LogoutConfirmModal",
  component: LogoutConfirmModal,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onClose: () => console.log("Cancel logout"),
    onConfirm: () => console.log("Confirm logout"),
  },
};

export default meta;

type Story = StoryObj<typeof LogoutConfirmModal>;

export const Default: Story = {};

export const Interactive: Story = {
  args: {
    onClose: () => alert("Cancelar"),
    onConfirm: () => alert("Cerrar sesión"),
  },
};