import type { Meta, StoryObj } from "@storybook/react";
import { CreateDashboardModal } from "./CreateDashboardModal";

const meta = {
  title: "Dashboard/CreateDashboardModal",
  component: CreateDashboardModal,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CreateDashboardModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => console.log("Cerrar modal"),
    onCreated: (dashboard) => console.log("Dashboard creado:", dashboard),
  },
};

export const Playground: Story = {
  args: {
    onClose: () => {},
    onCreated: (dashboard) => {
      alert(`Dashboard creado: ${dashboard.title}`);
    },
  },
};