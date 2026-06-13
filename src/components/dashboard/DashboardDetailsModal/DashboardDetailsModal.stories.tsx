import type { Meta, StoryObj } from "@storybook/react";
import { DashboardDetailsModal } from "./DashboardDetailsModal";

const meta: Meta<typeof DashboardDetailsModal> = {
  title: "Components/DashboardDetailsModal",
  component: DashboardDetailsModal,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    dashboardId: "1",
    isOwner: true,
    onClose: () => console.log("Cerrar modal"),
    onIsPublicChange: (dashboardId, isPublic) =>
      console.log("Visibilidad:", dashboardId, isPublic),
    onTitleChange: (dashboardId, title) =>
      console.log("Título actualizado:", dashboardId, title),
  },
};

export default meta;

type Story = StoryObj<typeof DashboardDetailsModal>;

export const Default: Story = {};

export const Owner: Story = {
  args: {
    isOwner: true,
  },
};

export const NonOwner: Story = {
  args: {
    isOwner: false,
  },
};