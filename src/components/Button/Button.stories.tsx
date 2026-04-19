import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const IniciarSesion: Story = {
  args: {
    variant: "blue",
    size: "medium",
    label: "Iniciar sesión",
    onPress: () => console.log("Iniciar sesión"),
  },
};

export const GenerarReporte: Story = {
  args: {
    variant: "white",
    label: "Generar reporte",
  },
};

export const GuardarUsuario: Story = {
  args: {
    variant: "blue",
    label: "Guardar usuario",
  },
};

export const Guardar: Story = {
  args: {
    variant: "blue",
    label: "Guardar",
  },
};

export const Agregar: Story = {
  args: {
    variant: "blue",
    label: "Agregar",
  },
};

export const Aceptar: Story = {
  args: {
    variant: "blue",
    label: "Aceptar",
  },
};

export const Enviar: Story = {
  args: {
    variant: "blue",
    label: "Enviar",
  },
};

export const HacerUnaCopia: Story = {
  args: {
    variant: "white",
    label: "Hacer una copia",
  },
};

export const NuevoUsuario: Story = {
  args: {
    variant: "blue",
    label: "+ Nuevo usuario",
  },
};

export const CrearAdmin: Story = {
  args: {
    variant: "white",
    label: "Crear admin",
  },
};

export const Cancelar: Story = {
  args: {
    variant: "white",
    label: "Cancelar",
  },
};

export const Eliminar: Story = {
  args: {
    variant: "red",
    label: "Eliminar",
  },
};

export const Desactivar: Story = {
  args: {
    variant: "red",
    label: "Desactivar",
  },
};