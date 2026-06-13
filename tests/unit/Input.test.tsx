import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "../../src/components/common/Input/Input";

describe("Input", () => {
  it("renderiza la etiqueta correctamente", () => {
    const { getByLabelText } = render(
      <Input label="Correo" />
    );

    expect(getByLabelText("Correo")).toBeInTheDocument();
  });

  it("muestra mensaje de error cuando existe", () => {
    const { getByText } = render(
      <Input
        label="Correo"
        error="Correo inválido"
      />
    );

    expect(getByText("Correo inválido")).toBeInTheDocument();
  });

  it("permite escribir texto", () => {
    const { getByLabelText } = render(
      <Input label="Nombre" />
    );

    const input = getByLabelText("Nombre") as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "José" },
    });

    expect(input.value).toBe("José");
  });

  it("permite mostrar y ocultar contraseña", () => {
    const { getByLabelText } = render(
      <Input
        label="Contraseña"
        type="password"
        showPasswordToggle
      />
    );

    const input = getByLabelText("Contraseña") as HTMLInputElement;

    expect(input.type).toBe("password");

    fireEvent.click(
      getByLabelText("Mostrar contraseña")
    );

    expect(input.type).toBe("text");
  });
});