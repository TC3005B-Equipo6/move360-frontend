import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IndicatorColorPicker } from "./IndicatorColorPicker";
import type { ColorKey } from "./colors";

const meta: Meta<typeof IndicatorColorPicker> = {
  title: "Components/IndicatorColorPicker",
  component: IndicatorColorPicker,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof IndicatorColorPicker>;

export const Default: Story = {
  render: () => {
    const [color, setColor] = useState<ColorKey>("green");
    return <IndicatorColorPicker selectedColor={color} onSelect={setColor} />;
  },
};
