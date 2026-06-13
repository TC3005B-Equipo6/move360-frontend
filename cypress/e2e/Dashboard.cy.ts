describe("Dashboard Detail - Move360", () => {
  const dashboardId = "8632930f-9940-459d-9be0-0450832717b1";

  beforeEach(() => {
    cy.visit(`http://localhost:5173/dashboard/${dashboardId}`);
  });

  it("carga la pantalla del dashboard", () => {
    cy.get("body", { timeout: 15000 }).should("be.visible");
  });

  it("muestra el botón de detalles", () => {
    cy.get('[aria-label="Ver detalles del dashboard"]', {
      timeout: 15000,
    }).should("be.visible");
  });

  it("abre el modal de detalles del dashboard", () => {
    cy.get('[aria-label="Ver detalles del dashboard"]', {
      timeout: 15000,
    }).click();

    cy.contains("Detalles", { timeout: 10000 }).should("exist");
  });

  it("permite entrar en modo edición", () => {
    cy.get('[aria-label="Editar"]', {
      timeout: 15000,
    }).click();

    cy.get('[aria-label="Confirmar cambios"]').should("exist");
  });

  it("abre el modal de confirmar cambios", () => {
    cy.get('[aria-label="Editar"]', {
      timeout: 15000,
    }).click();

    cy.get('[aria-label="Confirmar cambios"]').click();
    

    cy.contains("Confirmar cambios").should("be.visible");
    cy.contains("¿Deseas guardar los cambios realizados en el dashboard?").should("be.visible");
    cy.contains("Cancelar").should("be.visible");
    cy.contains("Descartar").should("be.visible");
    cy.contains("button", "Confirmar").should("be.visible");
  });
});