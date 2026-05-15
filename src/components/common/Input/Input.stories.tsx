import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center bg-surface-base p-6">
        <div className="w-full max-w-sm rounded-xl bg-surface-raised p-6 shadow-md">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Usuario: Story = {
  args: {
    label: "Correo",
    placeholder: "ejemplo@move360.com",
    type: "email",
    autoComplete: "email",
  },
};

export const Contrasena: Story = {
  args: {
    label: "Contraseña",
    placeholder: "Introduce tu contraseña",
    type: "password",
    showPasswordToggle: true,
  },
};

export const Error: Story = {
  args: {
    label: "Correo",
    placeholder: "ejemplo@move360.com",
    type: "email",
    error: "Ingresa un correo válido",
  },
};

export const Deshabilitado: Story = {
  args: {
    label: "Correo",
    placeholder: "ejemplo@move360.com",
    type: "email",
    disabled: true,
  },
};
