describe("Navegación - Move360", () => {
  it("permite iniciar sesión y entrar al home", () => {
    cy.visit("http://localhost:5173");

    cy.get('input[type="email"]').type("sara@prueba.com");
    cy.get('input[type="password"]').type("TEMP_PASSWORD");

    cy.contains("Iniciar sesión").click();

    cy.contains("Movilidad Febrero 2026", { timeout: 15000 }).should("be.visible");
    cy.contains("Afluencia e incidencias por servicio de transporte").should("be.visible");
  });
});