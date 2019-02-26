// / <reference types="Cypress" />

import moment from 'moment';

import {
  generateNumber,
  REACT_APP_URI,
  REACT_APP_TEST_URI,
} from '../common.utils';
import { pickUpDate } from '../datepicker.utils';

const pass_name = 'Test Payment Pack';
const pass_price = generateNumber(300);
const pass_tax = generateNumber(100);
const pass_credits = generateNumber(1000);
let pass_lower_date = null;
let pass_upper_date = null;

context('Manager - PaymentPack', () => {
  beforeEach(() => {
    cy.request(REACT_APP_TEST_URI)
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.manager.token);
      });
    cy.visit('/payment-pack/add');
  });

  it('Manager can create a new pass with only name, price and tax', () => {
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/payment-pack/add/`).as(
      'createNewPassRequest1',
    );
    cy.get('[name=name]').type(pass_name);
    // fill pass price field
    expect(pass_price).to.be.within(0, 1000);
    cy.get('[name=price]').type(pass_price);
    // fill pass tax value field
    expect(pass_tax).to.be.within(0, 100);
    cy.get('[name=tax]').type(pass_tax);
    // fill up pass credits field
    cy.get('[type=submit]').click();
    cy.get('body').contains('Pass successfully saved');
    cy.wait('@createNewPassRequest1').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.not.equal(null);
      expect(xhr.response.body).to.not.equal(undefined);
      const newPass = Object.assign({}, xhr.response.body);
      expect(xhr.statusMessage).to.equal('200 (OK)');
      expect(newPass.name).to.equal(pass_name);
      expect(newPass.price).to.equal(pass_price);
      expect(newPass.credits).to.equal(null);
      expect(newPass.disabled).to.be.false;
      expect(newPass.categories).to.be.a('array');
      expect(newPass.establishments).to.be.a('array');
      expect(newPass.metaActivities).to.be.a('array');
      expect(newPass.categories).to.be.empty;
      expect(newPass.establishments).to.be.empty;
      expect(newPass.metaActivities).to.be.empty;
    });
  });

  it('Manager can create a new pass with all fields required', () => {
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/payment-pack/add/`).as(
      'createNewPassRequest2',
    );
    cy.get('[name=name]').type(pass_name);
    // fill pass price field
    expect(pass_price).to.be.within(0, 1000);
    cy.get('[name=price]').type(pass_price);
    // fill pass tax value field
    expect(pass_tax).to.be.within(0, 100);
    cy.get('[name=tax]').type(pass_tax);
    // fill up pass credits field
    expect(pass_credits).to.be.within(0, 1000);
    cy.get('[name=credits]').type(pass_credits);
    // pass validity by number days
    cy.get('[type=radio][name=timeType][value=VALID_BY_DURATION]').check();
    cy.get('[name=duration_days]').should('be.visible');
    // pass validity by range
    cy.get('[type=radio][name=timeType][value=VALID_BY_DATERANGE]').check();
    cy.get('[name=lower_date]')
      .should('be.visible')
      .click();
    pickUpDate();
    // check the picked date
    cy.get('[name=lower_date]').then((input) => {
      pass_lower_date = Cypress.$(input).val();
      expect(moment(pass_lower_date, 'DD/MM/YYYY', true).isValid()).to.be.true;
    });
    cy.get('[name=upper_date]').click();
    pickUpDate();
    // // here also we should check if picked date is valid
    cy.get('[name=upper_date]').then((input) => {
      pass_upper_date = Cypress.$(input).val();
      expect(moment(pass_upper_date, 'DD/MM/YYYY', true).isValid()).to.be.true;
    });
    cy.get('[type=checkbox][name=new_member_only]').check();
    cy.get('[type=checkbox][name=manager_only]').check();
    // we should only have only one choice
    cy.get('[type=checkbox][name=new_member_only]').should(
      'not.have.attr',
      'checked',
    );
    // those fields did not show up in testing interface...
    // cy.get('[type=checkbox][name=categories]').check();
    // cy.get('[type=checkbox][name=metaActivities]').check();
    // cy.get('[type=checkbox][name=establishments]').check();

    cy.get('[type=submit]').click();
    cy.get('body').contains('Pass successfully saved');
    cy.wait('@createNewPassRequest2').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.not.equal(null);
      expect(xhr.response.body).to.not.equal(undefined);
      const newPass = Object.assign({}, xhr.response.body);
      expect(xhr.statusMessage).to.equal('200 (OK)');
      expect(newPass.name).to.equal(pass_name);
      expect(newPass.price).to.equal(pass_price);
      expect(newPass.tax).to.be.equal(pass_tax.toFixed(2));
      expect(newPass.credits).to.equal(pass_credits);
      expect(newPass.disabled).to.be.false;
      expect(newPass.categories).to.be.a('array');
      expect(newPass.establishments).to.be.a('array');
      expect(newPass.metaActivities).to.be.a('array');
      // expect(newPass.categories).to.not.be.empty;
      // expect(newPass.establishments).to.not.be.empty;
      // expect(newPass.metaActivities).to.not.be.empty;
    });
  });
});
