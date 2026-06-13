import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Explore from "../../src/screens/Explore/Explore";
import { listPublicDashboards } from "../../src/services/dashboard/dashboardService";

vi.mock("../../src/services/auth/useProfile", () => ({
  useProfile: () => ({
    profile: {
      firstName: "Usuario",
      paternalSurname: "Prueba",
      role: "Admin",
      email: "test@move360.com",
    },
    isLoading: false,
  }),
  displayName: () => "Usuario Prueba",
}));

vi.mock("../../src/services/dashboard/dashboardService", () => ({
  listPublicDashboards: vi.fn(),
}));

const mockedListPublicDashboards = vi.mocked(listPublicDashboards);

describe("Explore - integración", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra estado de carga inicial", () => {
    mockedListPublicDashboards.mockImplementation(
      () => new Promise(() => {})
    );

    const { getByText } = render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );

    expect(
      getByText("Cargando dashboards…")
    ).toBeInTheDocument();
  });

  it("muestra dashboards públicos cuando el servicio responde con datos", async () => {
    mockedListPublicDashboards.mockResolvedValue([
      {
        id: "dashboard-1",
        title: "Dashboard de prueba",
        createdDate: "2026-02-10",
        ownerName: "Usuario Prueba",
      },
    ]);

    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByText("Dashboard de prueba")
      ).toBeInTheDocument();
    });

    expect(
      getAllByText("Usuario Prueba").length
    ).toBeGreaterThan(0);
  });

  it("muestra mensaje cuando no hay dashboards públicos", async () => {
    mockedListPublicDashboards.mockResolvedValue([]);

    const { getByText } = render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByText("No hay dashboards públicos")
      ).toBeInTheDocument();
    });

    expect(
      getByText(
        "Cuando alguien publique un dashboard, aparecerá aquí."
      )
    ).toBeInTheDocument();
  });

  it("muestra error cuando falla la carga y permite reintentar", async () => {
    mockedListPublicDashboards
      .mockRejectedValueOnce(new Error("Error"))
      .mockResolvedValueOnce([]);

    const { getByText, getByRole } = render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByText(
          "No se pudieron cargar los dashboards públicos."
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(
      getByRole("button", { name: "Reintentar" })
    );

    await waitFor(() => {
      expect(
        getByText("No hay dashboards públicos")
      ).toBeInTheDocument();
    });

    expect(
      mockedListPublicDashboards
    ).toHaveBeenCalledTimes(2);
  });
});