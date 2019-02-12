/// <reference types="Cypress" />

context('Manager - Activity', () => {
  beforeEach(() => {
    cy.request('http://localhost:8000/state/reset')
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.manager.token);
      });
  });

  it('manager can create a new activity', function() {
    cy.visit('/meta-activity/add');

    cy.get('[name=name]').type('Aqua poney');

    cy.get('#sport-category-select').click();
    cy.get('[data-value=48]').click();

    cy.get('[name=description]').type('Super activity');
    cy.get('[name=default_waiting_list_max_size]').type('3');

    cy.get('[type=submit]').click();

    cy.get('body').contains('Activity added');
  });
});
