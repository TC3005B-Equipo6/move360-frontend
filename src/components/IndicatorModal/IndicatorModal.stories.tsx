import type { Meta, StoryObj } from "@storybook/react-vite";
import { IndicatorModal } from "./IndicatorModal";

const meta: Meta<typeof IndicatorModal> = {
  title: "Components/IndicatorModal",
  component: IndicatorModal,
};

export default meta;

type Story = StoryObj<typeof IndicatorModal>;

export const Default: Story = {
  args: {
    onClose: () => {},
    onSave: () => {},
  },
};
