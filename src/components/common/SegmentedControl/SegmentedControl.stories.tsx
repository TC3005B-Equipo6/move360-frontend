import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import SegmentedControl from "./SegmentedControl";
import { BarChart2, TrendingUp, Table, Settings } from "lucide-react";

const meta: Meta<typeof SegmentedControl> = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  args: {
    value: "indicador",
    options: [
      {
        label: "Indicador",
        value: "indicador",
        icon: <TrendingUp size={18} />,
      },
      {
        label: "Gráfica",
        value: "grafica",
        icon: <BarChart2 size={18} />,
      },
    ],
  },
};

export const WithMultipleOptions: Story = {
  args: {
    value: "grafica",
    options: [
      {
        label: "Indicador",
        value: "indicador",
        icon: <TrendingUp size={18} />,
      },
      {
        label: "Gráfica",
        value: "grafica",
        icon: <BarChart2 size={18} />,
      },
      {
        label: "Tabla",
        value: "tabla",
        icon: <Table size={18} />,
      },
      {
        label: "Config",
        value: "config",
        icon: <Settings size={18} />,
      },
    ],
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("grafica");

    return (
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          {
            label: "Indicador",
            value: "indicador",
            icon: <TrendingUp size={18} />,
          },
          {
            label: "Gráfica",
            value: "grafica",
            icon: <BarChart2 size={18} />,
          },
        ]}
      />
    );
  },
};
