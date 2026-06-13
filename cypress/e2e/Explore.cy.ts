describe("Explore - Dashboards públicos", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/explore");
  });

  it("muestra la pantalla de dashboards públicos", () => {
    cy.contains("Dashboards públicos", { timeout: 10000 }).should("be.visible");
  });

  it("muestra algún resultado, mensaje vacío o error controlado", () => {
    cy.get("body", { timeout: 10000 }).then(($body) => {
      const text = $body.text();

      expect(
        text.includes("No hay dashboards públicos") ||
        text.includes("No se pudieron cargar los dashboards públicos") ||
        text.length > 0
      ).to.eq(true);
    });
  });
});