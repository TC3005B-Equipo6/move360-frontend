import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { Sidebar } from "./SideBar";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/home"]}>
        <div
          style={{
            height: "600px",
            display: "flex",
            background: "var(--surface-sunken)",
          }}
        >
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Uncontrolled — the hamburger toggles the rail's own internal state.
export const Default: Story = {};

export const Colapsado: Story = {
  args: { collapsed: true },
};

export const Expandido: Story = {
  args: { collapsed: false },
};
