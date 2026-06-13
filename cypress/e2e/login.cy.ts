describe("Login - Move360", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("muestra la pantalla de login correctamente", () => {
    cy.contains("Bienvenido a Move360").should("be.visible");
    cy.contains("Correo").should("be.visible");
    cy.contains("Contraseña").should("be.visible");
    cy.contains("Iniciar sesión").should("be.visible");
  });

  it("muestra errores si se intenta iniciar sesión sin datos", () => {
    cy.contains("Iniciar sesión").click();

    cy.contains("Ingresa tu correo").should("be.visible");
    cy.contains("Ingresa tu contraseña").should("be.visible");
  });

  it("abre el modal de recuperación de contraseña", () => {
    cy.contains("¿Olvidaste tu contraseña?").click();

    cy.contains("Recuperar contraseña").should("be.visible");
    cy.contains("Ingresa tu correo para generar una solicitud").should("be.visible");
    cy.contains("Enviar solicitud").should("be.visible");
  });

  it("muestra error si se intenta recuperar contraseña sin correo", () => {
    cy.contains("¿Olvidaste tu contraseña?").click();
    cy.contains("Enviar solicitud").click();

    cy.contains("Ingresa tu correo").should("be.visible");
  });
});