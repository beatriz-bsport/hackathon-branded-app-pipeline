// / <reference types="Cypress" />

import moment from 'moment';
import { pickUpDate } from '../datepicker.utils';
import {
  REACT_APP_URI,
  REACT_APP_TEST_URI,
  generateNumber,
  selectCountryPhoneCode,
} from '../common.utils';

const firstname = 'John';
const lastname = 'Doe';
const email = 'john.doe@gmail.com';
const gender = 'M';
const membership_id = generateNumber(10000);
const birth_year = 1990;
const phone = '+212610996315';
const address = {
  address_line_1: 'Cpt. Jean Luc PICARD',
  address_line_2: '52 RUE DES FLEURS',
  city: 'Paris',
  zipcode: 75008,
  country: 'France',
};

context('Manager - Member', () => {
  beforeEach(() => {
    cy.request(REACT_APP_TEST_URI)
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.manager.token);
      });
    cy.visit('/member/add');
  });
  // check if the manager can create a member, with all fields filled up
  it('Manager can add a new member - all fields are required', () => {
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/create-member/`).as(
      'addMemberRequest1',
    );
    // programmatically upload the user avartar
    cy.upload_file('user.png', 'image/png', 'input[type=file]');
    cy.get('[name=firstname]').type(firstname);
    cy.get('[name=lastname]').type(lastname);
    cy.get('[name=gender]').should('have.value', gender);
    cy.get('[name=email]').type(email);
    cy.get('[name=membership_id]').type(membership_id);
    cy.get('[name=birthday_year]').type(birth_year);
    cy.get('[name=date_joined]').click();
    // pick a date
    pickUpDate();
    // check if picked date is valid
    cy.get('[name=date_joined]').should(
      'have.value',
      moment().format('DD/MM/YYYY'),
    );
    selectCountryPhoneCode(
      '[name=phone_number__country]',
      'Morocco (‫المغرب‬‎)',
      'MA',
    );
    cy.get('[name=phone_number]').type(phone);
    cy.get('[name=address_line_1]').type(address.address_line_1);
    cy.get('[name=address_line_2]').type(address.address_line_2);
    cy.get('[name=city]').type(address.city);
    cy.get('[name=zipcode]').type(address.zipcode);
    cy.get('[name=country]').type(address.country);
    cy.get('[type="checkbox"]').check();
    cy.get('[type=submit]').click();
    // try to find the success message
    cy.get('body').contains('Member added');
    // check server response
    cy.wait('@addMemberRequest1').then((xhr) => {
      expect(xhr.status).to.be.equal(201);
      const member = Object.assign({}, xhr.response.body);
      expect(member).to.not.equal({});
      assert.isObject(member, 'Member should be a valid object');
      expect(member.first_name).to.be.equal(firstname);
      expect(member.last_name).to.be.equal(lastname);
      expect(member.email).to.be.equal(email);
      expect(member.gender).to.be.equal(gender);
      expect(moment(member.birthday, 'YYYY-MM-DD', true).year()).to.be.equal(
        birth_year,
      );
      expect(member.photo).to.not.be.null;
      expect(member.photo).to.be.a('string');
      expect(member.phone).to.deep.equal({ phone_number: phone });
      // TODO: retutn this serverside
      // expect(member.membership_id).to.be.equal(membership_id);
      // expect(member.address).to.deep.equal(address);
    });
  });
  // check if the manager can create a member, with only firstname and lastname fields
  it('Manager can add a new member - only fistname and lastname are required', () => {
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/create-member/`).as(
      'addMemberRequest2',
    );
    cy.visit('/member/add');
    cy.get('[name=firstname]').type('John');
    cy.get('[name=lastname]').type('Doe');
    cy.get('[type=submit]').click();
    // try to find the success message
    cy.get('body').contains('Member added');
    // check the server response
    cy.wait('@addMemberRequest2').then((xhr) => {
      expect(xhr.status).to.be.equal(201);
      const member = Object.assign({}, xhr.response.body);
      // response body should not be null or undefined
      expect(member).to.not.equal({});
      assert.isObject(member, 'Member should be a valid object');
      expect(member.first_name).to.be.equal(firstname);
      expect(member.last_name).to.be.equal(lastname);
      expect(member.gender).to.be.equal(gender);
      // I think it a mondatory  field
      expect(member.email).to.be.null;
      expect(member.birthday).to.be.null;
      expect(member.phone).to.be.null;
      expect(member.photo).to.be.null;
      // expect(member.membership_id).to.be.null;
      // the response does not contains this field else it should equal to the generated one
    });
    // redirect to member list page
    cy.url()
      .location('pathname')
      .should('eq', '/member');
  });
});
