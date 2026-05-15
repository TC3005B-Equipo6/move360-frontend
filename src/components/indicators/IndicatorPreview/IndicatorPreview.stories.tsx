import type { Meta, StoryObj } from "@storybook/react-vite";
import { IndicatorPreview } from "./IndicatorPreview";

const meta: Meta<typeof IndicatorPreview> = {
  title: "Components/IndicatorPreview",
  component: IndicatorPreview,
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

type Story = StoryObj<typeof IndicatorPreview>;

export const Positivo: Story = {
  args: {
    value: 12,
    label: "Usuarios con descuento",
    tone: "direct",
    backgroundColor: "#DDF3E4",
    textColor: "#166534",
  },
};

export const Negativo: Story = {
  args: {
    value: 8,
    label: "Tiempo de recorrido promedio",
    tone: "inverse",
    backgroundColor: "#F8D7DA",
    textColor: "#B42318",
  },
};
