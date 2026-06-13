import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "../../src/components/common/Modal/Modal";

describe("Modal", () => {
  it("renderiza título y mensaje", () => {
    const { getByText } = render(
      <Modal
        title="Confirmar acción"
        message="¿Deseas continuar?"
      />
    );

    expect(getByText("Confirmar acción")).toBeInTheDocument();
    expect(getByText("¿Deseas continuar?")).toBeInTheDocument();
  });

  it("ejecuta onClose al presionar cerrar", () => {
    const onClose = vi.fn();

    const { getByLabelText } = render(
      <Modal
        title="Modal de prueba"
        onClose={onClose}
      />
    );

    fireEvent.click(getByLabelText("Cerrar"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ejecuta onConfirm al presionar aceptar", () => {
    const onConfirm = vi.fn();

    const { getByRole } = render(
      <Modal
        title="Confirmación"
        message="Guardar cambios"
        confirmText="Guardar"
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(getByRole("button", { name: "Guardar" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("ejecuta onCancel al presionar cancelar", () => {
    const onCancel = vi.fn();

    const { getByRole } = render(
      <Modal
        title="Cancelar acción"
        cancelText="No guardar"
        onCancel={onCancel}
      />
    );

    fireEvent.click(getByRole("button", { name: "No guardar" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renderiza contenido personalizado con children", () => {
    const { getByText } = render(
      <Modal title="Formulario">
        <p>Contenido personalizado</p>
      </Modal>
    );

    expect(getByText("Contenido personalizado")).toBeInTheDocument();
  });
});