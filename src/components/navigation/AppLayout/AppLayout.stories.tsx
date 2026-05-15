import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { Header } from "../Header/Header";
import { ProfileCard } from "../../common/ProfileCard/ProfileCard";

const meta = {
  title: "Components/AppLayout",
  component: AppLayout,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/home"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const placeholder = (
  <div className="grid h-full place-items-center rounded-xl border border-subtle bg-surface-raised text-content-muted">
    Contenido de la pantalla
  </div>
);

export const ConHeader: Story = {
  args: {
    header: (
      <Header
        title="Panorama de movilidad"
        subtitle="Marzo 2025 – Febrero 2026"
        profile={<ProfileCard variant="compact" name="Andrés García" role="Analista de movilidad" />}
      />
    ),
    children: placeholder,
  },
};

export const SinHeader: Story = {
  args: {
    children: placeholder,
  },
};
