import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginScreen from "../../src/screens/Login/Login";
import {
  login,
  validateToken,
  requestPasswordRecovery,
} from "../../src/services/auth/authService";

vi.mock("../../src/services/auth/authService", () => ({
  login: vi.fn(),
  validateToken: vi.fn(),
  requestPasswordRecovery: vi.fn(),
}));

const mockedLogin = vi.mocked(login);
const mockedValidateToken = vi.mocked(validateToken);
const mockedRequestPasswordRecovery = vi.mocked(requestPasswordRecovery);

describe("LoginScreen - integración", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("muestra los elementos principales del login", () => {
    const { getByText, getByLabelText, getByRole } = render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    );

    expect(getByText("Bienvenido a Move360")).toBeInTheDocument();
    expect(getByLabelText("Correo")).toBeInTheDocument();
    expect(getByLabelText("Contraseña")).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Iniciar sesión" })
    ).toBeInTheDocument();
    expect(
      getByText("¿Olvidaste tu contraseña?")
    ).toBeInTheDocument();
  });

  it("muestra errores cuando se intenta iniciar sesión sin datos", () => {
    const { getByRole, getByText } = render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    );

    fireEvent.click(
      getByRole("button", { name: "Iniciar sesión" })
    );

    expect(getByText("Ingresa tu correo")).toBeInTheDocument();
    expect(getByText("Ingresa tu contraseña")).toBeInTheDocument();
  });

  it("guarda el token cuando el login es exitoso", async () => {
    mockedLogin.mockResolvedValue("fake-token");
    mockedValidateToken.mockResolvedValue(undefined);

    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText("Correo"), {
      target: { value: "test@move360.com" },
    });

    fireEvent.change(getByLabelText("Contraseña"), {
      target: { value: "password123" },
    });

    fireEvent.click(
      getByRole("button", { name: "Iniciar sesión" })
    );

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith(
        "test@move360.com",
        "password123"
      );
    });

    expect(localStorage.getItem("token")).toBe("fake-token");
    expect(mockedValidateToken).toHaveBeenCalledTimes(1);
  });

  it("abre el modal de recuperación de contraseña", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    );

    fireEvent.click(
      getByText("¿Olvidaste tu contraseña?")
    );

    expect(
      getByText("Recuperar contraseña")
    ).toBeInTheDocument();

    expect(
      getByText(/Ingresa tu correo para generar una solicitud/i)
    ).toBeInTheDocument();
  });

  it("envía solicitud de recuperación de contraseña", async () => {
    mockedRequestPasswordRecovery.mockResolvedValue(undefined);

    const {
      getByText,
      getAllByLabelText,
      getByRole,
    } = render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    );

    fireEvent.click(
      getByText("¿Olvidaste tu contraseña?")
    );

    const correos = getAllByLabelText("Correo");

    fireEvent.change(correos[1], {
      target: { value: "test@move360.com" },
    });

    fireEvent.click(
      getByRole("button", { name: "Enviar solicitud" })
    );

    await waitFor(() => {
      expect(mockedRequestPasswordRecovery).toHaveBeenCalledWith(
        "test@move360.com"
      );
    });

    expect(
      getByText("Solicitud enviada correctamente")
    ).toBeInTheDocument();
  });
});