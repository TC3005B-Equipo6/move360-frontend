import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IndicatorTypeToggle } from "./IndicatorTypeToggle";

const meta: Meta<typeof IndicatorTypeToggle> = {
  title: "Components/IndicatorTypeToggle",
  component: IndicatorTypeToggle,
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

type Story = StoryObj<typeof IndicatorTypeToggle>;

export const Default: Story = {
  render: () => {
    const [isPositive, setIsPositive] = useState(true);
    return <IndicatorTypeToggle isPositive={isPositive} onChange={setIsPositive} />;
  },
};
