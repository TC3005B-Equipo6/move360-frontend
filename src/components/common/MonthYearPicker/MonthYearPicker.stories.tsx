import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MonthYearPicker } from "./MonthYearPicker";

const meta: Meta<typeof MonthYearPicker> = {
  title: "Components/MonthYearPicker",
  component: MonthYearPicker,
};

export default meta;

type Story = StoryObj<typeof MonthYearPicker>;

const Interactive = ({ initial, size }: { initial: string; size?: "sm" | "lg" }) => {
  const [value, setValue] = useState(initial);
  return (
    <div className="flex w-[360px] flex-col gap-2">
      <MonthYearPicker value={value} onChange={setValue} size={size} />
      <span className="text-body-sm text-content-muted">value: {value || "(vacío)"}</span>
    </div>
  );
};

export const Empty: Story = {
  render: () => <Interactive initial="" />,
};

export const WithValue: Story = {
  render: () => <Interactive initial="2025-03" />,
};

export const Small: Story = {
  render: () => <Interactive initial="2025-03" size="sm" />,
};
