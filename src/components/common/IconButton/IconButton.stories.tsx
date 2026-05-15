import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  decorators: [
    (Story) => (
      <div
        className="flex min-h-screen items-center justify-center bg-surface-base p-6"
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    iconName: "sort",
    size: "large",
    label: "Nombre",
    type: "button",
    color: "primary"
  },
};

export const Reporte: Story = {
  args: {
    iconName: "report",
    size: "large",
    label: "Reporte",
    color: "secondary",
    type: "button"
  },
};

export const Small: Story = {
  args: {
    iconName: "settings",
    size: "small",
    label: "",
    color: "secondary",
    type: "button"
  },
};
