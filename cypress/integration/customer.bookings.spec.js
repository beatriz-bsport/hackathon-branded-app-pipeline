/// <reference types="Cypress" />

import moment from 'moment';

import { fillSignUpForm } from './customer.utils';
import { REACT_APP_TEST_URI } from './common.utils';

context('Booking', () => {
  beforeEach(() => {
    cy.request(REACT_APP_TEST_URI)
      .its('body')
      .as('db');
  });

  it('user can cancel a booking', function() {
    cy.setCookie('auth_token', this.db.users.customer.token);

    const bookingId = this.db.marketplace.booking;
    cy.wait(1000);
    cy.visit('/');
    cy.get(`#booking-cancel-${bookingId}`).click();
    cy.get(`#booking-cancel-cancel-${bookingId}`).click();
    cy.get(`#booking-cancel-${bookingId}`).click();
    cy.get(`#booking-cancel-confirm-${bookingId}`).click();

    cy.get('body').contains('You have no booking on waiting list');
  });

  it('unauthenticated user is redirected to booking page after sign in', function() {
    const offer = this.db.marketplace.offer;
    const company = this.db.marketplace.company;
    const path = `/customer/payment/offer/${offer.id}`;
    const search = `?membership=${company.id}`;
    cy.visit(path + search);

    cy.get('[name=login]').type('customer@bsport.io');
    cy.get('[name=password]').type('password');

    cy.get('#btn-signin').click();

    cy.url()
      .location('pathname')
      .should('eq', path);
  });

  it('unauthenticated user is redirected to booking page after sign up', function() {
    const offer = this.db.marketplace.offer;
    const company = this.db.marketplace.company;
    const path = `/customer/payment/offer/${offer.id}`;
    const search = `?membership=${company.id}`;
    cy.visit(path + search);

    cy.get('#btn-goto-signup').click();

    fillSignUpForm();

    cy.get('#btn-signup-skip').click();

    cy.url()
      .location('pathname')
      .should('eq', path);
  });

  it('auth customer can book with an existing pass', function() {
    cy.setCookie('auth_token', this.db.users.customer.token);

    const offer = this.db.marketplace.offer;
    const company = this.db.marketplace.company;
    const cpp = this.db.users.customer.cpp;

    cy.visit(`/customer/payment/offer/${offer.id}?membership=${company.id}`);

    cy.get(`#btn-payment-pack-user-${cpp}`).click();
    cy.url()
      .location('pathname')
      .should('eq', '/');
    cy.get('body').contains('Booking confirmed');
  });
});
