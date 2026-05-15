import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-surface-base">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const ConfirmacionEnvio: Story = {
  args: {
    message: "Se ha enviado tu ticket de soporte al administrador.",
    secondaryMessage: "En breve recibirás noticias.",
    confirmText: "Aceptar",
    onConfirm: () => {},
    iconName: "checkCircle",
  },
};

export const SesionExpirada: Story = {
  args: {
    title: "SESIÓN EXPIRADA",
    message: "Su sesión ha expirado",
    secondaryMessage: "Inicie sesión nuevamente",
    confirmText: "Aceptar",
    onConfirm: () => {},
  },
};

export const CerrarSesion: Story = {
  args: {
    className: "w-[430px] px-8 py-8",
    footer: (
      <div className="flex w-full items-center justify-between gap-4">
        <button
          type="button"
          className="inline-flex min-h-12 w-[150px] cursor-pointer items-center justify-center rounded-md border-0 bg-surface-raised px-5 font-sans text-body font-semibold text-content-secondary shadow-xs ring-1 ring-inset ring-border transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-surface-sunken hover:text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
        >
          Cancelar
        </button>
        <button
          type="button"
          className="inline-flex min-h-12 w-[170px] cursor-pointer items-center justify-center rounded-md border-0 bg-danger px-5 font-sans text-body font-semibold text-content-on-primary shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[#9f2f24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
        >
          Cerrar sesión
        </button>
      </div>
    ),
    children: (
      <p className="m-0 text-center text-wrap-balance text-h3 font-semibold leading-tight text-content-primary">
        ¿Estás seguro de que deseas
        <br />
        cerrar sesión?
      </p>
    ),
  },
};

export const EliminarIndicador: Story = {
  args: {
    message: "¿Eliminar indicador?",
    secondaryMessage: "Esta acción no se puede deshacer",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    onConfirm: () => {},
    onCancel: () => {},
    confirmVariant: "red",
  },
};
