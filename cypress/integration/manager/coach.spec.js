// / <reference types="Cypress" />
import { DateTime } from 'luxon';
import {
  REACT_APP_URI,
  REACT_APP_TEST_URI,
  selectCountryPhoneCode,
} from '../common.utils';

import { pickUpDate } from '../datepicker.utils';

const firstname = 'John';
const lastname = 'Doe';
const email = 'coach@bsport.io';
const phone_number = '+33942538406';
const birth_day = '';
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
  });

  // check if manager can update a coach details
  it('Manager can update coach', () => {
    const coachData = { phone: {} };
    cy.visit('/coach');
    // click on edit the first coach
    cy.get('a>button[aria-label="edit"]').click();
    // verify that we are in the correct place
    cy.url()
      .location('pathname')
      .should('match', /coach.edit.([0-9]+)/);
    // extract the coach id from url
    cy.window().then((win) => {
      const coachId = win.location.pathname.replace(/^\D+/g, '');
      cy.server();
      cy.route('PUT', `${REACT_APP_URI}/saas/coach/${coachId}`).as(
        'updateCoachRequest',
      );
    });
    // get the form data, this will be used to make sure it with the response data
    cy.get('[name=firstname]')
      .invoke('val')
      .then((value) => {
        coachData.first_name = value;
      });
    cy.get('[name=lastname]')
      .invoke('val')
      .then((value) => {
        coachData.last_name = value;
      });

    cy.get('[name=email]')
      .invoke('val')
      .then((value) => {
        coachData.email = value;
      });

    cy.get('[name="phone"]')
      .invoke('val')
      .then((value) => {
        if (value) coachData.phone = { phone_number: value.replace(/ /g, '') };
      });

    cy.get('[name=gender]')
      .invoke('val')
      .then((value) => {
        coachData.gender = value;
      });

    cy.get('[name="birthday"]')
      .invoke('val')
      .then((value) => {
        if (value) {
          coachData.birthday = DateTime.fromISO(value).toISO();
        }
      });
    cy.get('[name=description]')
      .invoke('val')
      .then((value) => {
        coachData.description = value;
      });
    cy.get('[name=facebook_url]')
      .invoke('val')
      .then((value) => {
        coachData.facebook_url = value;
      });
    cy.get('[name=instagram_url]')
      .invoke('val')
      .then((value) => {
        coachData.instagram_url = value;
      });
    cy.get('[type=submit]').click();

    cy.get('body').contains('Coach details updated');

    // check the server response
    cy.wait('@updateMemberRequest').then((xhr) => {
      expect(xhr.status).to.be.equal(200);
      const coach = Object.assign({}, xhr.response.body);
      // response body should not be null or undefined
      expect(member).to.not.equal({});
      assert.isObject(member, 'coach should be a valid object');
      // expect(caoch.first_name).to.be.equal(memberData.first_name);
      // expect(member.last_name).to.be.equal(memberData.last_name);
      // expect(member.email).to.be.equal(memberData.email);
      // expect(member.gender).to.be.equal(memberData.gender);
      // expect(member.address).to.deep.equal(memberData.address);
      expect(coach).to.deep.equal(coachData);
    });
    // redirect to member list page
    cy.url().location('pathname').should('contains', '/member');
  });
});
