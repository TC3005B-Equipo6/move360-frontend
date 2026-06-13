import type { Meta, StoryObj } from "@storybook/react";
import { OverflowMenuButton } from "./OverflowMenuButton";

const meta: Meta<typeof OverflowMenuButton> = {
  title: "Components/OverflowMenuButton",
  component: OverflowMenuButton,
  parameters: {
    layout: "centered",
  },
  args: {
    onClick: () => console.log("Overflow menu clicked"),
  },
};

export default meta;

type Story = StoryObj<typeof OverflowMenuButton>;

export const Default: Story = {
  args: {
    label: "More more",
    forceVisible: true,
  },
};

export const Open: Story = {
  args: {
    label: "More options",
    isOpen: true,
  },
};

export const ForceVisible: Story = {
  args: {
    label: "More options",
    forceVisible: true,
  },
};

export const HiddenUntilHover: Story = {
  render: (args) => (
    <div className="group/dashboard-item p-8 border rounded-lg">
      <p className="mb-4 text-body-sm">
        Hover over this area to reveal the button.
      </p>

      <OverflowMenuButton {...args} />
    </div>
  ),
  args: {
    label: "More options",
  },
};