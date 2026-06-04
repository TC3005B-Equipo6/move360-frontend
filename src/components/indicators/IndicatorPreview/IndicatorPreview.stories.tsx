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

export const Directa: Story = {
  args: {
    title: "Usuarios con descuento",
    subtitle: "Febrero 2026 vs enero 2026",
    relationship: "DIRECT",
    unit: "%",
  },
};

export const Inversa: Story = {
  args: {
    title: "Tiempo de recorrido promedio",
    subtitle: "Febrero 2026 vs enero 2026",
    relationship: "INVERSE",
    unit: "min",
  },
};
