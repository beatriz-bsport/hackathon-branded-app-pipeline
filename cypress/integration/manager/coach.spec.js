// / <reference types="Cypress" />

import {
  REACT_APP_URI,
  REACT_APP_TEST_URI,
  selectCountryPhoneCode,
} from '../common.utils';

const firstname = 'John';
const lastname = 'Doe';
const email = 'coach@bsport.io';
const phone_number = '+33942538406';
const birth_year = '2019';
const description = 'New bsport coach';
const gender = 'F';
const facebook_url = 'http://facebook.com';
const instagram_url = 'http://instagram.com';

context('Manager - Coach', () => {
  beforeEach(() => {
    cy.request(REACT_APP_TEST_URI)
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.manager.token);
      });
    cy.visit('/coach/add');
  });

  it('Manager can create a new coach - all fields are required', () => {
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/create-coach/`).as(
      'createCoachRequest1',
    );
    // upload coach avatar
    cy.upload_file('user.png', 'image/png', 'input[type=file]');
    cy.get('[name=firstname]').type(firstname);
    cy.get('[name=lastname]').type(lastname);
    cy.get('[name=email]').type(email);
    cy.get('[name=phone]').type(phone_number);
    cy.get('[name=birthdayYear]').type(birth_year);
    cy.get('[name=description]').type(description);
    selectCountryPhoneCode(
      '[name=phone__country]',
      'France (République française)',
      'FR',
    );
    cy.get('[name=gender')
      .siblings('div')
      .first()
      .click();
    cy.get('[role=option][data-value=F]').click();
    cy.get('[name=gender]').should('have.value', gender);
    cy.get('[name=facebook_url]').type(facebook_url);
    cy.get('[name=instagram_url]').type(instagram_url);
    cy.get('[type=submit]').click();
    cy.wait('@createCoachRequest1').then((xhr) => {
      expect(xhr.status).to.equal(201);
      expect(xhr.response.body).to.not.equal(null);
      expect(xhr.response.body).to.not.equal(undefined);
      expect(xhr.statusMessage).to.equal('201 (Created)');
      const coach = Object.assign({}, xhr.response.body);
      expect(coach).to.not.equal({});
      // address should be null because we did not have address field
      expect(coach.address).to.be.null;
      expect(coach.first_name).to.equal(firstname);
      expect(coach.last_name).to.equal(lastname);
      expect(coach.email).to.equal(email);
      expect(coach.birthday).to.have.string(birth_year);
      expect(coach.gender).to.equal(gender);
      expect(coach.phone.phone_number).to.be.equal(phone_number);
      expect(coach.photo).to.not.be.null;
      expect(coach.photo).to.be.a('string');
    });
    cy.get('body').contains('Coach added');
  });

  it('Manager can create a new coach with only some fields', () => {
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/create-coach/`).as(
      'createCoachRequest2',
    );
    // upload coach avatar
    cy.get('[name=firstname]').type(firstname);
    cy.get('[name=lastname]').type(lastname);
    cy.get('[name=email]').type(email);
    cy.get('[type=submit]').click();
    cy.wait('@createCoachRequest2').then((xhr) => {
      expect(xhr.status).to.equal(201);
      expect(xhr.response.body).to.not.equal(null);
      expect(xhr.response.body).to.not.equal(undefined);
      expect(xhr.statusMessage).to.equal('201 (Created)');
      const coach = Object.assign({}, xhr.response.body);
      expect(coach).to.not.equal({});
      // address should be null because we did not have address field
      expect(coach.address).to.be.null;
      expect(coach.first_name).to.equal(firstname);
      expect(coach.last_name).to.equal(lastname);
      expect(coach.email).to.equal(email);
      expect(coach.birthday).to.be.null;
      expect(coach.gender).to.be.oneOf(['M', 'F']);
      expect(coach.phone).to.be.null;
    });
    cy.get('body').contains('Coach added');
    cy.url()
      .location('pathname')
      .should('eq', '/coach');
  });
});
