import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SelectField } from "./Dropdown";

const meta: Meta<typeof SelectField> = {
  title: "Components/Dropdown",
  component: SelectField,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-surface-base p-6">
        <div className="w-full max-w-[420px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SelectField>;

export const Periodo: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState("ene-jun");

      return (
        <SelectField
          label="Periodo"
          value={value}
          onChange={setValue}
          options={[
            {
              label: "Ene - Jun 2026",
              value: "ene-jun",
            },
            {
              label: "Jul - Dic 2026",
              value: "jul-dic",
            },
          ]}
        />
      );
    };

    return <Demo />;
  },
};

export const Fuente: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState("semovi");

      return (
        <SelectField
          label="Fuente"
          value={value}
          onChange={setValue}
          options={[
            {
              label: "SEMOVI",
              value: "semovi",
            },
            {
              label: "INEGI",
              value: "inegi",
            },
            {
              label: "SCT",
              value: "sct",
            },
          ]}
        />
      );
    };

    return <Demo />;
  },
};

export const Disabled: Story = {
  args: {
    label: "Fuente",
    value: "semovi",
    disabled: true,
    onChange: () => {},
    options: [
      {
        label: "SEMOVI",
        value: "semovi",
      },
    ],
  },
};
