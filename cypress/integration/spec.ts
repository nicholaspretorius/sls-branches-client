describe("CRA", () => {
  it("shows learn link", () => {
    cy.visit("http://localhost:3001");
    cy.get(".App-header").should("be.visible");
    cy.get(".App-header p").should("be.visible").and("have.text", "Hello world!");
  });
});

export { };
