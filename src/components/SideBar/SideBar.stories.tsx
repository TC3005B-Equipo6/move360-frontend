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
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#EEF2F7",
            padding: 10,
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

export const Default: Story = {};
