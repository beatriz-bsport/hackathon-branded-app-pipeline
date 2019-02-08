/// <reference types="Cypress" />

import { fillSignUpForm } from './customer.utils';

context('Consumer', () => {
  beforeEach(() => {
    cy.request('http://localhost:8000/state/reset')
      .its('body')
      .as('db');
    cy.visit('http://localhost:3000');
  });

  it('user can sign up', () => {
    cy.get('#btn-login-customer').click();
    cy.get('#btn-goto-signup').click();

    fillSignUpForm();

    cy.get('#btn-signup-skip').click();

    cy.url()
      .location('pathname')
      .should('eq', '/');
  });

  it('user can sign in with email', () => {
    cy.get('#btn-login-customer').click();

    // Fill in sign in form
    cy.get('[name=login]').type('customer@bsport.io');
    cy.get('[name=password]').type('password');

    cy.get('#btn-signin').click();

    cy.url()
      .location('pathname')
      .should('eq', '/');
  });

  it('user can reset password', function() {
    cy.visit('/login/reset_password');

    // Fill in form
    cy.get('[name=email]').type('customer@bsport.io');
    cy.get('#btn-reset-password').click();

    // Backend send reset link

    const { uid, reset_token } = this.db.users.customer;
    cy.visit(`/login/change_password/${uid}/${reset_token}`);

    // Fill in change form
    cy.get('[name=password]').type('mynewpassword');
    cy.get('[name=passwordConfirm]').type('mynewpassword');

    cy.get('#btn-new-password-confirm').click();
    cy.get('body').contains('Password reset successfull !');
    cy.url()
      .location('pathname')
      .should('eq', '/login');

    cy.request('POST', 'http://localhost:8000/authentication/with-login/', {
      username: 'customer@bsport.io',
      password: 'mynewpassword',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.equal('ok');
      expect(response.body.token).to.not.be.empty;
    });
  });
});
