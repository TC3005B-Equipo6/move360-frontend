import type { Meta, StoryObj } from "@storybook/react";
import { ActionMenu } from "./ActionMenu";

const meta: Meta<typeof ActionMenu> = {
  title: "Components/ActionMenu",
  component: ActionMenu,
};

export default meta;

type Story = StoryObj<typeof ActionMenu>;

export const Default: Story = {
  args: {
    onDelete: () => console.log("Eliminar"),
    onEdit: () => console.log("Editar"),
  },
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

export const CercaDelBordeDerecho: Story = {
  render: (args) => (
    <div style={{ position: "relative", width: "100%", height: 200 }}>
      <div style={{ position: "absolute", right: 0, top: 0 }}>
        <ActionMenu {...args} />
      </div>
    </div>
  ),
  args: {
    onDelete: () => console.log("Eliminar"),
    onEdit: () => console.log("Editar"),
  },
};

export const CercaDelBordeInferior: Story = {
  render: (args) => (
    <div style={{ position: "relative", width: "100%", height: "98vh" }}>
      <div style={{ position: "absolute", bottom: 0, left: 20 }}>
        <ActionMenu {...args} />
      </div>
    </div>
  ),
  args: {
    onDelete: () => console.log("Eliminar"),
    onEdit: () => console.log("Editar"),
  },
};
