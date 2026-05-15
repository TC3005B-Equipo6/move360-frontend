import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center bg-surface-base p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const IniciarSesion: Story = {
  args: {
    variant: "blue",
    size: "large",
    label: "Iniciar sesión",
    onPress: () => console.log("Iniciar sesion"),
  },
};

export const Cargando: Story = {
  args: {
    variant: "blue",
    size: "large",
    label: "Iniciando sesión",
    isLoading: true,
  },
};

export const Deshabilitado: Story = {
  args: {
    variant: "blue",
    size: "large",
    label: "Continuar",
    disabled: true,
  },
};

export const GenerarReporte: Story = {
  args: {
    variant: "white",
    label: "Generar reporte",
    size: "large",
  },
};

export const GuardarUsuario: Story = {
  args: {
    variant: "blue",
    label: "Guardar usuario",
    size: "large",
  },
};

export const Guardar: Story = {
  args: {
    variant: "blue",
    label: "Guardar",
    size: "medium",
  },
};

export const Agregar: Story = {
  args: {
    variant: "blue",
    label: "Agregar",
    size: "medium",
  },
};

export const Aceptar: Story = {
  args: {
    variant: "blue",
    label: "Aceptar",
    size: "medium",
  },
};

export const Enviar: Story = {
  args: {
    variant: "blue",
    label: "Enviar",
    size: "medium",
  },
};

export const Cancelar: Story = {
  args: {
    variant: "white",
    label: "Cancelar",
    size: "medium",
  },
};

export const Eliminar: Story = {
  args: {
    variant: "red",
    label: "Eliminar",
    size: "medium",
  },
};

export const Desactivar: Story = {
  args: {
    variant: "red",
    label: "Desactivar",
    size: "medium",
  },
};
