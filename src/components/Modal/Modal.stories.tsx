import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

const CheckIcon = () => <div style={{ fontSize: "40px" }}>✔</div>;

export const ConfirmacionEnvio: Story = {
  args: {
    message: "Se ha enviado tu ticket de soporte al administrador.",
    secondaryMessage: "En breve recibirás noticias.",
    confirmText: "Aceptar",
    onConfirm: () => {},
    icon: <CheckIcon />,
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
    message: "¿Desea cerrar la sesión?",
    confirmText: "Salir",
    cancelText: "Cancelar",
    onConfirm: () => {},
    onCancel: () => {},
    confirmVariant: "red",
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


/*
export const NuevoUsuario: Story = {
  render: () => (
    <Modal
      title="Nuevo usuario"
      size="md"
      footer={
        <>
          <Button variant="white" label="Cancelar" />
          <Button variant="blue" label="Guardar usuario" />
        </>
      }
    >
      <div className={styles.formStack}>
        <input className={styles.input} placeholder="Nombre completo" />
        <select className={styles.select}>
          <option>Seleccionar rol</option>
        </select>
        <input className={styles.input} placeholder="Contraseña" />
        <input className={styles.input} placeholder="Teléfono" />
      </div>
    </Modal>
  ),
};

export const EditarUsuario: Story = {
  render: () => (
    <Modal
      title="Editar usuario"
      size="md"
      footer={
        <>
          <Button variant="white" label="Cancelar" />
          <Button variant="blue" label="Guardar cambios" />
        </>
      }
    >
      <div className={styles.formStack}>
        <input className={styles.input} defaultValue="Carlos Mendoza" />
        <select className={styles.select}>
          <option>Gerente</option>
        </select>
        <input className={styles.input} defaultValue="+52 555 123 4567" />
      </div>
    </Modal>
  ),
};

export const ConfirmarEliminarUsuario: Story = {
  render: () => (
    <Modal
      title="Eliminar usuario"
      size="sm"
      footer={
        <>
          <Button variant="white" label="Cancelar" />
          <Button variant="red" label="Eliminar" />
        </>
      }
    >
      <div className={styles.infoBox}>
        ¿Eliminar a Carlos Mendoza?
      </div>
    </Modal>
  ),
};

export const ConfirmarDesactivarUsuario: Story = {
  render: () => (
    <Modal
      title="Desactivar usuario"
      size="sm"
      footer={
        <>
          <Button variant="white" label="Cancelar" />
          <Button variant="red" label="Desactivar" />
        </>
      }
    >
      <div className={styles.infoBox}>
        ¿Desactivar a Carlos Mendoza?
      </div>
    </Modal>
  ),
};

export const DetalleTicket: Story = {
  render: () => (
    <Modal size="lg">
      <div className={styles.ticketTitle}>
        No puedo iniciar sesión
      </div>

      <div className={styles.infoBox}>
        Error 401 al intentar acceder con mis credenciales
      </div>
    </Modal>
  ),
}; */