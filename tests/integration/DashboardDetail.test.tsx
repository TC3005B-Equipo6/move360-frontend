import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import DashboardDetail from "../../src/screens/Dashboard/DashboardDetail";
import { getDashboardDetail } from "../../src/services/dashboard/dashboardService";

vi.mock("../../src/services/dashboard/dashboardService", () => ({
  getDashboardDetail: vi.fn(),
}));

vi.mock("../../src/services/auth/useProfile", () => ({
  useProfile: () => ({
    profile: {
      firstName: "Usuario",
      paternalSurname: "Prueba",
      role: "Admin",
    },
    isLoading: false,
  }),
  displayName: () => "Usuario Prueba",
}));

const mockedGetDashboardDetail = vi.mocked(getDashboardDetail);

describe("DashboardDetail - integración", () => {
  it("muestra loading mientras carga", () => {
    mockedGetDashboardDetail.mockImplementation(
      () => new Promise(() => {})
    );

    const { getByLabelText } = render(
      <MemoryRouter initialEntries={["/dashboard/123"]}>
        <Routes>
          <Route
            path="/dashboard/:dashboardId"
            element={<DashboardDetail />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      getByLabelText("Cargando dashboard")
    ).toBeInTheDocument();
  });

  it("muestra dashboard cuando carga correctamente", async () => {
    mockedGetDashboardDetail.mockResolvedValue({
      meta: {
        id: "123",
        title: "Dashboard Test",
        description: "Descripción Test",
        createdAt: "2026-01-01",
        isPublic: true,
        ownerName: "Usuario Prueba",
        tags: [],
      },
      items: [],
    });

    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard/123"]}>
        <Routes>
          <Route
            path="/dashboard/:dashboardId"
            element={<DashboardDetail />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByText("Dashboard Test")
      ).toBeInTheDocument();
    });
  });

  it("muestra pantalla de no encontrado cuando falla la carga", async () => {
    mockedGetDashboardDetail.mockRejectedValue(
      new Error("Not found")
    );

    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard/123"]}>
        <Routes>
          <Route
            path="/dashboard/:dashboardId"
            element={<DashboardDetail />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByText("Dashboard no encontrado")
      ).toBeInTheDocument();
    });
  });
});