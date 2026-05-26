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
    "aria-label": "Ajustes",
    color: "secondary",
    type: "button"
  },
};

export const AjustesDashboard: Story = {
  args: {
    iconName: "settings",
    iconSize: 26,
    size: "small",
    label: "",
    "aria-label": "Ajustes",
    color: "secondary",
    className:
      "!h-14 !w-14 !rounded-xl !bg-surface-raised !text-primary !shadow-sm !ring-1 !ring-inset !ring-border-strong hover:!bg-primary-subtle hover:!text-primary-hover",
    type: "button",
  },
};

export const AjustesDashboardActivo: Story = {
  args: {
    iconName: "settings",
    iconSize: 26,
    size: "small",
    label: "",
    "aria-label": "Desactivar ajustes",
    color: "primary",
    className: "!h-14 !w-14 !rounded-xl !shadow-sm",
    type: "button",
  },
};
