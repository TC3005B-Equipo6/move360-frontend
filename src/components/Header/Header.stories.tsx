import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";

const meta = {
  title: "Components/Header",
  component: Header,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    title: "My Tasks",
  },
};

export const WithSubtitle: Story = {
  args: {
    title: "My Tasks",
    subtitle: "12 pending",
  },
};

export const WithBack: Story = {
  args: {
    title: "Task Detail",
    onBack: () => console.log("Back clicked"),
  },
};

export const WithBackAndSubtitle: Story = {
  args: {
    title: "Task Detail",
    subtitle: "Work list",
    onBack: () => console.log("Back clicked"),
  },
};

export const WithRightAction: Story = {
  args: {
    title: "My Tasks",
    rightComponent: (
      <button
        type="button"
        style={{
          border: "none",
          background: "transparent",
          fontSize: "24px",
          color: "#4293f5",
          cursor: "pointer",
        }}
      >
        +
      </button>
    ),
  },
};

export const Full: Story = {
  args: {
    title: "Task Detail",
    subtitle: "Work list",
    onBack: () => console.log("Back clicked"),
    rightComponent: (
      <button
        type="button"
        style={{
          border: "none",
          background: "transparent",
          fontSize: "18px",
          color: "#4293f5",
          cursor: "pointer",
        }}
      >
        Edit
      </button>
    ),
  },
};