import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";

const meta = {
  title: "Components/Header",
  component: Header,
  decorators: [
    (Story) => (
      <div
      style={{
        minHeight: "100vh", 
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#EEF2F7",
        padding: 10}}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Metrobús general",
  },
};