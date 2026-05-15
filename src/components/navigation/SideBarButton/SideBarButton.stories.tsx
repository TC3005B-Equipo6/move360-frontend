import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SideBarButton, type SideBarButtonProps } from "./SideBarButton";

const meta = {
  title: "Components/SideBarButton",
  component: SideBarButton,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface-sunken)",
          padding: 10,
        }}
      >
        {/* The button is full-width; the rail defines its width. */}
        <div style={{ width: 172, background: "var(--surface-raised)", padding: 12, borderRadius: 16 }}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof SideBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: StoryObj<typeof meta> = {
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
  args: { tooltip: "Inicio", label: "Inicio", iconName: "home", selected: false, collapsed: false },
};

export const Selected: Story = {
  args: { tooltip: "Inicio", label: "Inicio", iconName: "home", selected: true, collapsed: false },
};

export const Collapsed: Story = {
  args: { tooltip: "Inicio", label: "Inicio", iconName: "home", selected: false, collapsed: true },
};

export const Disabled: Story = {
  args: { tooltip: "Ayuda", label: "Ayuda", iconName: "help", disabled: true, collapsed: false },
};
