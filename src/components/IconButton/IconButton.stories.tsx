import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  decorators: [
    (Story) => (
      <div
      style={{
        minHeight: "100vh", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#EEF2F7",
        padding: 10}}>
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
    type: "button"
  },
};

export const Calendar: Story = {
  args: {
    iconName: "calendar",
    size: "large",
    label: "Inicio",
    type: "button"
  },
};

export const Small: Story = {
  args: {
    iconName: "settings",
    size: "small",
    label: "",
    type: "button"
  },
};