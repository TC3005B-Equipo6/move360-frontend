import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "./ProfileCard";

const meta: Meta<typeof ProfileCard> = {
  title: "Components/ProfileCard",
  component: ProfileCard,
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
