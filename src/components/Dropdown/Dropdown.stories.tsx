import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SelectField } from "./Dropdown";

const meta: Meta<typeof SelectField> = {
  title: "Components/Dropdown",
  component: SelectField,
};

export default meta;

type Story = StoryObj<typeof SelectField>;

export const Periodo: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState("ene-jun");

      return (
        <div style={{ width: 420 }}>
          <SelectField
            label="PERIODO"
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
        </div>
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
        <div style={{ width: 420 }}>
          <SelectField
            label="FUENTE"
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
        </div>
      );
    };

    return <Demo />;
  },
};

export const Disabled: Story = {
  args: {
    label: "FUENTE",
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