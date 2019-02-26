// <reference types="Cypress" />
import faker from 'faker';
import { REACT_APP_URI, REACT_APP_TEST_URI } from '../common.utils';

const activity_description = faker.lorem.sentence();
let sport = null;
let last_booking_minute = null;
let last_discard_minute = null;

context('Manager - MetaActivity', () => {
  beforeEach(() => {
    cy.request(REACT_APP_TEST_URI)
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.manager.token);
      });
  });

  it('Manager can create new activity with all fields', function() {
    cy.visit('activity/add');
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/create-meta-activity/`).as(
      'createActivityRequest1',
    );
    // avoid activity with the same name already exist error
    const activity_name = faker.lorem.words();
    // activity cover image
    cy.upload_file('activity.png', 'image/png', 'input[type=file][name=cover]');
    cy.get('[name=name]').type(activity_name);
    cy.get('#sport-category-select').click();
    cy.get('[data-value=48]').click();
    cy.get('[name=SCT]').then((input) => {
      sport = Cypress.$(input).val();
      expect(sport).to.be.equal('48');
    });
    cy.get('[name=description]').type(activity_description);
    cy.get('[data-cy=default_last_booking_minutes]').click();
    cy.get('[data-value=45]').click();
    cy.get('[name=default_last_booking_minutes]').then((input) => {
      last_booking_minute = Cypress.$(input).val();
      expect(last_booking_minute).to.be.equal('45');
    });
    cy.get('[data-cy=default_last_discard_minutes]').click();
    cy.get('[data-value=90]').click();
    cy.get('[name=default_last_discard_minutes]').then((input) => {
      last_discard_minute = Cypress.$(input).val();
      expect(last_discard_minute).to.be.equal('90');
    });
    cy.get('[type=submit]').click();
    cy.get('body').contains('Activity added');
    cy.wait('@createActivityRequest1').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.not.equal(null);
      expect(xhr.response.body).to.not.equal(undefined);
      const activity = Object.assign({}, xhr.response.body);
      expect(activity.name).to.equal(activity_name);
      expect(activity.description).to.equal(activity_description);
      expect(activity.category_id).to.equal(+sport);
      expect(activity.parent_category).to.be.a('number');
      expect(activity.cover_main).to.be.a('string');
      expect(activity.customer_enabled).to.be.true;
      expect(activity.etablissements).to.be.empty;
      expect(activity.levels).to.be.empty;
      expect(activity.offers).to.be.empty;
      expect(activity.images).to.be.empty;
      expect(activity.payment_packs_available).to.be.a('array');
      expect(activity.reviews).to.be.empty;
    });
  });

  it('Manager can create new activity with only name and description fields', function() {
    cy.visit('activity/add');
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/create-meta-activity/`).as(
      'createMetaActivityRequest2',
    );
    const activity_name = faker.lorem.words();
    cy.get('[name=name]').type(activity_name);
    cy.get('#sport-category-select').click();
    cy.get('[data-value=48]').click();
    cy.get('[name=SCT]').then((input) => {
      sport = Cypress.$(input).val();
      expect(sport).to.be.equal('48');
    });
    cy.get('[name=description]').type(activity_description);
    cy.get('[type=submit]').click();
    cy.get('body').contains('Activity added');
    cy.wait('@createMetaActivityRequest2').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.not.equal(null);
      expect(xhr.response.body).to.not.equal(undefined);
      const activity = Object.assign({}, xhr.response.body);
      expect(xhr.statusMessage).to.equal('200 (OK)');
      expect(activity.name).to.equal(activity_name);
      expect(activity.parent_category).to.be.a('number');
      expect(activity.cover_main).to.be.null;
      expect(activity.customer_enabled).to.be.true;
      expect(activity.etablissements).to.be.empty;
      expect(activity.levels).to.be.empty;
      expect(activity.offers).to.be.empty;
      expect(activity.images).to.be.empty;
      expect(activity.payment_packs_available).to.be.a('array');
      expect(activity.reviews).to.be.empty;
    });
  });
});
