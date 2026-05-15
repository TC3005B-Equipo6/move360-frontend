import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";
import { Button } from "../../common/Button/Button";
import { ProfileCard } from "../../common/ProfileCard/ProfileCard";

const meta = {
  title: "Components/Header",
  component: Header,
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          background: "var(--surface-base)",
          padding: 24,
          boxSizing: "border-box",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Mis Dashboards",
  },
};

export const ConSubtitulo: Story = {
  args: {
    title: "Panorama de movilidad",
    subtitle: "Marzo 2025 – Febrero 2026",
  },
};

export const Completo: Story = {
  args: {
    title: "Panorama de movilidad",
    subtitle: "Marzo 2025 – Febrero 2026",
    actions: <Button label="Nuevo dashboard" />,
    profile: <ProfileCard variant="compact" name="Andrés García" role="Analista de movilidad" />,
  },
};
