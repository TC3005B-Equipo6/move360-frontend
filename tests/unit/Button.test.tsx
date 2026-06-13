import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../../src/components/common/Button/Button";

describe("Button", () => {
  it("renderiza el texto recibido", () => {
    render(<Button label="Guardar" />);

    expect(
      screen.getByRole("button", { name: "Guardar" })
    ).toBeInTheDocument();
  });

  it("ejecuta onPress al hacer click", () => {
    const onPress = vi.fn();

    render(
      <Button
        label="Guardar"
        onPress={onPress}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Guardar" })
    );

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("se deshabilita cuando isLoading es true", () => {
    render(
      <Button
        label="Guardando"
        isLoading
      />
    );

    expect(
      screen.getByRole("button", { name: "Guardando" })
    ).toBeDisabled();
  });

  it("se deshabilita cuando disabled es true", () => {
    render(
      <Button
        label="Eliminar"
        disabled
      />
    );

    expect(
      screen.getByRole("button", { name: "Eliminar" })
    ).toBeDisabled();
  });
});