import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileCard } from "./ProfileCard";

const meta: Meta<typeof ProfileCard> = {
  title: "Components/ProfileCard",
  component: ProfileCard,
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

type Story = StoryObj<typeof ProfileCard>;

export const Analista: Story = {
  args: {
    name: "Andrés García",
    role: "Analista",
  },
};

export const Administrador: Story = {
  args: {
    name: "María López",
    role: "Administrador",
  },
};

export const Gerente: Story = {
  args: {
    name: "Carlos Hernández",
    role: "Gerente de Operaciones",
  },
};

export const NombreCorto: Story = {
  args: {
    name: "Ana",
    role: "Usuario",
  },
};

export const SinRol: Story = {
  args: {
    name: "Juan Pérez",
  },
};
