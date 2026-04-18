import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SideBarButton, type SideBarButtonProps } from "./SideBarButton";

const meta = {
  title: "Components/SideBarButton",
  component: SideBarButton,
  decorators: [
    (Story) => (
      <div style={{ padding: "16px", maxWidth: "360px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SideBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tooltip: "Home", iconName: "home", onPress: () => console.log("Home clicked") },
};


export const Interactive: StoryObj<typeof meta> = {
  render: (args: SideBarButtonProps) => {
    const [selected, setSelected] = useState(Boolean(args.selected));
    return (
      <SideBarButton
        {...args}
        selected={selected}
        onPress={() => {
          setSelected((s) => !s);
          args.onPress?.();
        }}
      />
    );
  },
  args: { tooltip: "Home", iconName: "home", selected: false },
};

export const Selected: Story = {
  args: { 
    tooltip: "Home",
    iconName: "help",
    selected: true
 },
};

export const Disabled: Story = {
  args: {
    tooltip: "Star",
    iconName: "help",
    disabled: true
 },
};
