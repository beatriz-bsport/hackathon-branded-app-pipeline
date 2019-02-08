/// <reference types="Cypress" />

context('Manager - Coach', () => {
  beforeEach(() => {
    cy.request('http://localhost:8000/state/reset')
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.manager.token);
      });
  });

  it('manager can create a new coach', function() {
    cy.visit('/coach/add');

    cy.get('[name=firstname]').type('John');
    cy.get('[name=lastname]').type('Doe');
    cy.get('[name=email]').type('coach@bsport.io');

    cy.get('[type=submit]').click();

    cy.get('body').contains('Coach added');
    cy.url()
      .location('pathname')
      .should('eq', '/coach');
  });
});
