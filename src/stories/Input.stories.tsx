import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../components/Input/Input";

const meta = {
  title: "Form/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div style={{ padding: "16px", maxWidth: "360px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Email: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    autoComplete: "email",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
};

export const Search: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    type: "search",
  },
};