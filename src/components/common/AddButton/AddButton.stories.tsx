import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddButton } from "./AddButton";

const meta: Meta<typeof AddButton> = {
  title: "Components/AddButton",
  component: AddButton,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: 20,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AddButton>;

export const Default: Story = {
  args: {
    onPress: () => console.log("Añadir elemento"),
  },
};

export const Disabled: Story = {
  args: {
    onPress: () => console.log("No debería disparar"),
    disabled: true,
  },
};
