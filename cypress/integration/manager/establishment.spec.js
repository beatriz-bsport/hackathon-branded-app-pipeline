/// <reference types="Cypress" />

import faker from 'faker';
import { REACT_APP_URI, REACT_APP_TEST_URI } from '../common.utils';

const establishment_title = faker.lorem.words();
const establishment_info = faker.lorem.sentence();
let address = null;

context('Manager - Establishment', () => {
  beforeEach(() => {
    cy.request(REACT_APP_TEST_URI)
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.manager.token);
      });
    cy.visit('/establishment/add');
  });
  it('Manager can create new establishment, all fields are required', function() {
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/establishments/add`).as(
      'addEstablishmentRequest1',
    );
    // upload the establishment cover image
    cy.upload_file('establishment.jpg', 'image/jpg', 'input[type=file]');
    cy.get('#title').type(establishment_title);
    cy.get('#specific_info').type(establishment_info);
    cy.get('#cy-map-container').click();
    cy.wait(500); // wait response from google map api, after that check the address field
    // pickup an address from suggestions
    cy.get('#cy-map-container')
      .prev()
      .find('ul')
      .find('[role=button]')
      .first()
      .click({ multiple: true });

    cy.get('#address').then((input) => {
      address = Cypress.$(input).val();
      expect(address).to.not.equal(null);
      expect(address).to.not.equal(undefined);
      expect(address).to.be.a('string');
    });
    cy.wait(2000);
    // submit the request
    cy.get('[type=submit]').click();
    // check if the success message is displayed correctly
    cy.get('body').contains('Establishment added');
    // fill up the address field manually
    cy.wait('@addEstablishmentRequest1').then((xhr) => {
      expect(xhr.response.body).to.not.equal(null);
      expect(xhr.response.body).to.not.equal(undefined);
      expect(xhr.status).to.equal(201);
      const establishment = Object.assign({}, xhr.response.body);
      expect(establishment).to.not.equal({});
      expect(establishment.title).to.equal(establishment_title);
      expect(establishment.specific_info).to.equal(establishment_info);
      expect(establishment.location.address).to.equal(address);
      expect(establishment.easy_access).to.be.a('number');
      expect(establishment.cover).to.be.a('string');
      expect(establishment.images).to.be.a('array');
      cy.url()
        .location('pathname')
        .should('eq', '/establishment');
    });
  });
});
