// / <reference types="Cypress" />

import moment from 'moment';
import FactoryBot from '../../../src/libs/member/Member.factory';
import { pickUpDate } from '../datepicker.utils';
import {
  REACT_APP_URI,
  REACT_APP_TEST_URI,
  selectCountryPhoneCode,
} from '../common.utils';

context('Manager - Member', () => {
  beforeEach(() => {
    cy.request(REACT_APP_TEST_URI)
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.manager.token);
      });
  });
  // check if the manager can create a member, with all fields filled up
  it('Manager can add a new member - all fields are required', () => {
    // create a fake member
    const member = FactoryBot.Member.createOne();
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/create-member/`).as(
      'addMemberRequest1',
    );
    cy.visit('/member/add');
    // programmatically upload the user avartar
    cy.upload_file('user.png', 'image/png', 'input[type=file]');
    cy.get('[name=firstname]').type(member.first_name);
    cy.get('[name=lastname]').type(member.last_name);
    cy.get('[name=gender]')
      .closest('div')
      .click();
    cy.get(`[data-value="${member.gender}"]`).click();
    cy.get('[name=email]').type(member.email);
    cy.get('[name=membership_ID]').type(member.membership_id);
    cy.get('[name="birthday"]').click();
    pickUpDate();
    cy.get('[name="birthday"]')
      .invoke('val')
      .then((memberBirthDay) => {
        member.birthday = moment(memberBirthDay).format('YYYY-MM-DD', true);
      });
    cy.get('[name=date_joined]').click();
    // pick a date
    pickUpDate();
    // check if picked date is valid
    cy.get('[name=date_joined]')
      .invoke('val')
      .then((date_joined) => {
        member.date_joined = moment(date_joined).format('DD/MM/YYYY', true);
      });

    selectCountryPhoneCode(
      '[name=phone__country]',
      'France (République française)',
      'FR',
    );
    cy.get('[name="phone"]')
      .type(member.phone.phone_number)
      .invoke('val')
      .then((phone) => {
        // this only update the member and the country code also it remove the space to have the same exact same number when the one we receive from the api
        const tel = phone.replace(/\s/g, '');
        member.phone.phone_number = tel.replace(/^0/g, '+33');
      });
    cy.get('[name=address_line_1]').type(member.address.address_line_1);
    cy.get('[name=address_line_2]').type(member.address.address_line_2);
    cy.get('[name=city]').type(member.address.city);
    cy.get('[name=zipcode]').type(member.address.zipcode);
    cy.get('[name=country]').type(member.address.country);
    cy.get('[type="checkbox"]').check();
    cy.get('[type=submit]').click();
    // try to find the success message
    cy.get('body').contains('Member added');
    // check server response
    cy.wait('@addMemberRequest1').then((xhr) => {
      expect(xhr.status).to.be.equal(201);
      const createdMember = Object.assign({}, xhr.response.body);
      Object.keys(createdMember).forEach((property) => {
        if (property === 'photo') {
          expect(createdMember[property]).to.be.a('string');
        } else if (property === 'address' || property === 'phone') {
          expect(createdMember[property]).to.deep.equal(member[property]);
        } else expect(createdMember[property]).to.be.equal(member[property]);
      });
    });
  });
  // check if the manager can create a member, with only firstname and lastname fields
  it('Manager can add a new member - only fistname and lastname are required', () => {
    const member = FactoryBot.Member.createOne();
    cy.server();
    cy.route('POST', `${REACT_APP_URI}/saas/create-member/`).as(
      'addMemberRequest2',
    );
    cy.visit('/member/add');
    cy.get('[name=firstname]').type(member.first_name);
    cy.get('[name=lastname]').type(member.last_name);
    cy.get('[name=email]').type(member.email);
    cy.get('[type=submit]').click();
    // try to find the success message
    cy.get('body').contains('Member added');
    // check the server response
    cy.wait('@addMemberRequest2').then((xhr) => {
      expect(xhr.status).to.be.equal(201);
      const createdMember = Object.assign({}, xhr.response.body);
      // response body should not be null or undefined
      assert.isObject(createdMember, 'Member should be a valid object');
      expect(createdMember.first_name).to.be.equal(member.first_name);
      expect(createdMember.last_name).to.be.equal(member.last_name);
      expect(createdMember.email).to.be.equal(member.email);
      expect(createdMember.gender).to.be.equal('');
      // eslint-disable-next-line no-unused-expressions
      expect(createdMember.birthday).to.be.null;
      // eslint-disable-next-line no-unused-expressions
      expect(createdMember.phone).to.be.null;
      // eslint-disable-next-line no-unused-expressions
      expect(createdMember.photo).to.be.null;
    });
    // redirect to member list page
    cy.url()
      .location('pathname')
      .should('contains', '/member');
  });

  it('Manager can update member', () => {
    const memberData = { address: null, phone: null };
    cy.visit('/member');
    // click on show button
    cy.contains('Show').click();
    // check if we get redirect to info page
    cy.url()
      .location('pathname')
      .should('match', /member.([0-9]+).info/);
    // click on the edit button
    cy.contains('Edit').click();
    // check if we get redirect to edit page with the member id
    cy.url()
      .location('pathname')
      .should('match', /member.edit.([0-9]+)/);
    // extract the member id from pathname
    cy.window().then((win) => {
      const memberId = win.location.pathname.replace(/^\D+/g, '');
      cy.server();
      cy.route('PUT', `${REACT_APP_URI}/saas/member/${memberId}`).as(
        'updateMemberRequest',
      );
    });
    // get the form data, it will be used to compare it with the response data
    cy.get('[name=firstname]')
      .clear()
      .type(member.first_name);
    cy.get('[name=lastname]')
      .clear()
      .type(member.last_name);
    cy.get('[name=gender]')
      .closest('div')
      .click();
    cy.get(`[data-value="${member.gender}"]`).click();
    cy.get('[name=email]')
      .clear()
      .type(member.email);

    cy.get('[name="birthday"]').click();
    pickUpDate();
    cy.get('[name=birthday]')
      .invoke('val')
      .then((birthday) => {
        member.birthday = moment(birthday).format('YYYY-MM-DD', true);
      });

    cy.get('[name=date_joined]').click();
    // pick a date
    pickUpDate();
    // pick up a phone country code
    selectCountryPhoneCode(
      '[name=phone__country]',
      'Morocco (‫المغرب‬‎)',
      'MA',
    );
    cy.get('[name="phone"]')
      .clear()
      .type(member.phone.phone_number)
      .invoke('val')
      .then((value) => {
        const phone = value.replace(/ /g, '');
        member.phone.phone_number = phone.replace(/^0/g, '+212');
      });
    cy.get('[name=address_line_1]')
      .clear()
      .type(member.address.address_line_1);
    cy.get('[name=address_line_2]')
      .clear()
      .type(member.address.address_line_2);
    cy.get('[name=city]')
      .clear()
      .type(member.address.city);
    cy.get('[name=zipcode]')
      .clear()
      .type(member.address.zipcode);
    cy.get('[name=country]')
      .clear()
      .type(member.address.country);
    // click on the submit button
    cy.get('[type=submit]').click();
    cy.get('body').contains('Member details updated');
    // check the server response
    cy.wait('@updateMemberRequest').then((xhr) => {
      expect(xhr.status).to.be.equal(200);
      const updatedMember = Object.assign({}, xhr.response.body);
      // response body should not be null or undefined
      expect(updatedMember).to.be.a('Object');
      Object.keys(updatedMember).forEach((property) => {
        if (property === 'photo') {
          expect(updatedMember[property]).to.be.a('string');
        } else if (property === 'address' || property === 'phone') {
          expect(updatedMember[property]).to.deep.equal(member[property]);
        } else expect(updatedMember[property]).to.be.equal(member[property]);
      });
      // expect(member.first_name).to.be.equal(memberData.first_name);
      // expect(member.last_name).to.be.equal(memberData.last_name);
      // expect(member.email).to.be.equal(memberData.email);
      // expect(member.gender).to.be.equal(memberData.gender);
      // expect(member.address).to.deep.equal(memberData.address);
      // expect(member.phone).to.deep.equal(memberData.phone);
    });
    // redirect to member list page
    cy.url()
      .location('pathname')
      .should('contains', '/member');
  });

  it('Manager can update member', () => {
    const member = FactoryBot.Member.createOne();
    cy.visit('/member');
    // click on show button
    cy.contains('Show').click();
    // check if we get redirect to info page
    cy.url()
      .location('pathname')
      .should('match', /member.([0-9]+).info/);
    // click on the edit button
    cy.contains('Edit').click();
    // check if we get redirect to edit page with the member id
    cy.url()
      .location('pathname')
      .should('match', /member.edit.([0-9]+)/);
    // extract the member id from pathname
    cy.window().then((win) => {
      const memberId = win.location.pathname.replace(/^\D+/g, '');
      cy.server();
      cy.route('PUT', `${REACT_APP_URI}/saas/member/${memberId}`).as(
        'updateMemberRequest',
      );
    });
    // get the form data, it will be used to compare it with the response data
    cy.get('[name=firstname]')
      .invoke('val')
      .then((value) => {
        memberData.first_name = value;
      });
    cy.get('[name=lastname]')
      .invoke('val')
      .then((value) => {
        memberData.last_name = value;
      });
    cy.get('[name=gender]')
      .invoke('val')
      .then((value) => {
        memberData.gender = value;
      });
    cy.get('[name=email]')
      .invoke('val')
      .then((value) => {
        memberData.email = value;
      });
    cy.get('[name="birthday"]')
      .invoke('val')
      .then((value) => {
        if (value) {
          memberData.birthday = moment(value).format('YYYY-MM-DD', true);
        }
      });

    cy.get('[name="phone"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.phone = { phone_number: value.replace(/ /g, '') };
      });
    cy.get('[name="address_line_1"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address = { address_line_1: value };
      });
    cy.get('[name="address_line_2"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address.address_line_2 = value;
      });
    cy.get('[name="city"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address.city = value;
      });
    cy.get('[name="zipcode"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address.zipcode = value;
      });
    cy.get('[name="country"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address.country = value;
      });
    // click on the submit button
    cy.get('[type=submit]').click();
    cy.get('body').contains('Member details updated');
    // check the server response
    cy.wait('@updateMemberRequest').then((xhr) => {
      expect(xhr.status).to.be.equal(200);
      const member = Object.assign({}, xhr.response.body);
      // response body should not be null or undefined
      expect(member).to.not.equal({});
      assert.isObject(member, 'Member should be a valid object');
      expect(member.first_name).to.be.equal(memberData.first_name);
      expect(member.last_name).to.be.equal(memberData.last_name);
      expect(member.email).to.be.equal(memberData.email);
      expect(member.gender).to.be.equal(memberData.gender);
      expect(member.address).to.deep.equal(memberData.address);
      expect(member.phone).to.deep.equal(memberData.phone);
    });
    // redirect to member list page
    cy.url()
      .location('pathname')
      .should('contains', '/member');
  });

  it('Manager can update member', () => {
    const memberData = { address: null, phone: null };
    cy.visit('/member');
    // click on show button
    cy.contains('Show').click();
    // check if we get redirect to info page
    cy.url()
      .location('pathname')
      .should('match', /member.([0-9]+).info/);
    // click on the edit button
    cy.contains('Edit').click();
    // check if we get redirect to edit page with the member id
    cy.url()
      .location('pathname')
      .should('match', /member.edit.([0-9]+)/);
    // extract the member id from pathname
    cy.window().then((win) => {
      const memberId = win.location.pathname.replace(/^\D+/g, '');
      cy.server();
      cy.route('PUT', `${REACT_APP_URI}/saas/member/${memberId}`).as(
        'updateMemberRequest',
      );
    });
    // get the form data, it will be used to compare it with the response data
    cy.get('[name=firstname]')
      .invoke('val')
      .then((value) => {
        memberData.first_name = value;
      });
    cy.get('[name=lastname]')
      .clear()
      .type(member.last_name);
    cy.get('[name=gender]')
      .closest('div')
      .click();
    cy.get(`[data-value="${member.gender}"]`).click();
    cy.get('[name=email]')
      .clear()
      .type(member.email);

    cy.get('[name="birthday"]').click();
    pickUpDate();
    cy.get('[name=birthday]')
      .invoke('val')
      .then((birthday) => {
        member.birthday = moment(birthday).format('YYYY-MM-DD', true);
      });

    cy.get('[name=date_joined]').click();
    // pick a date
    pickUpDate();
    // pick up a phone country code
    selectCountryPhoneCode(
      '[name=phone__country]',
      'Morocco (‫المغرب‬‎)',
      'MA',
    );
    cy.get('[name="phone"]')
      .clear()
      .type(member.phone.phone_number)
      .invoke('val')
      .then((value) => {
        const phone = value.replace(/ /g, '');
        member.phone.phone_number = phone.replace(/^0/g, '+212');
      });
    cy.get('[name=address_line_1]')
      .clear()
      .type(member.address.address_line_1);
    cy.get('[name=address_line_2]')
      .clear()
      .type(member.address.address_line_2);
    cy.get('[name=city]')
      .clear()
      .type(member.address.city);
    cy.get('[name=zipcode]')
      .clear()
      .type(member.address.zipcode);
    cy.get('[name=country]')
      .clear()
      .type(member.address.country);
    // click on the submit button
    cy.get('[type=submit]').click();
    cy.get('body').contains('Member details updated');
    // check the server response
    cy.wait('@updateMemberRequest').then((xhr) => {
      expect(xhr.status).to.be.equal(200);
      const updatedMember = Object.assign({}, xhr.response.body);
      // response body should not be null or undefined
      expect(updatedMember).to.be.a('Object');
      Object.keys(updatedMember).forEach((property) => {
        if (property === 'photo') {
          expect(updatedMember[property]).to.be.a('string');
        } else if (property === 'address' || property === 'phone') {
          expect(updatedMember[property]).to.deep.equal(member[property]);
        } else expect(updatedMember[property]).to.be.equal(member[property]);
      });
      // expect(member.first_name).to.be.equal(memberData.first_name);
      // expect(member.last_name).to.be.equal(memberData.last_name);
      // expect(member.email).to.be.equal(memberData.email);
      // expect(member.gender).to.be.equal(memberData.gender);
      // expect(member.address).to.deep.equal(memberData.address);
      // expect(member.phone).to.deep.equal(memberData.phone);
    });
    // redirect to member list page
    cy.url()
      .location('pathname')
      .should('contains', '/member');
  });

  it('Manager can update member', () => {
    const member = FactoryBot.Member.createOne();
    cy.visit('/member');
    // click on show button
    cy.contains('Show').click();
    // check if we get redirect to info page
    cy.url()
      .location('pathname')
      .should('match', /member.([0-9]+).info/);
    // click on the edit button
    cy.contains('Edit').click();
    // check if we get redirect to edit page with the member id
    cy.url()
      .location('pathname')
      .should('match', /member.edit.([0-9]+)/);
    // extract the member id from pathname
    cy.window().then((win) => {
      const memberId = win.location.pathname.replace(/^\D+/g, '');
      cy.server();
      cy.route('PUT', `${REACT_APP_URI}/saas/member/${memberId}`).as(
        'updateMemberRequest',
      );
    });
    // get the form data, it will be used to compare it with the response data
    cy.get('[name=firstname]')
      .invoke('val')
      .then((value) => {
        memberData.first_name = value;
      });
    cy.get('[name=lastname]')
      .invoke('val')
      .then((value) => {
        memberData.last_name = value;
      });
    cy.get('[name=gender]')
      .invoke('val')
      .then((value) => {
        memberData.gender = value;
      });
    cy.get('[name=email]')
      .invoke('val')
      .then((value) => {
        memberData.email = value;
      });
    cy.get('[name="birthday"]')
      .invoke('val')
      .then((value) => {
        if (value) {
          memberData.birthday = moment(value).format('YYYY-MM-DD', true);
        }
      });

    cy.get('[name="phone"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.phone = { phone_number: value.replace(/ /g, '') };
      });
    cy.get('[name="address_line_1"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address = { address_line_1: value };
      });
    cy.get('[name="address_line_2"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address.address_line_2 = value;
      });
    cy.get('[name="city"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address.city = value;
      });
    cy.get('[name="zipcode"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address.zipcode = value;
      });
    cy.get('[name="country"]')
      .invoke('val')
      .then((value) => {
        if (value) memberData.address.country = value;
      });
    // click on the submit button
    cy.get('[type=submit]').click();
    cy.get('body').contains('Member details updated');
    // check the server response
    cy.wait('@updateMemberRequest').then((xhr) => {
      expect(xhr.status).to.be.equal(200);
      const member = Object.assign({}, xhr.response.body);
      // response body should not be null or undefined
      expect(member).to.not.equal({});
      assert.isObject(member, 'Member should be a valid object');
      expect(member.first_name).to.be.equal(memberData.first_name);
      expect(member.last_name).to.be.equal(memberData.last_name);
      expect(member.email).to.be.equal(memberData.email);
      expect(member.gender).to.be.equal(memberData.gender);
      expect(member.address).to.deep.equal(memberData.address);
      expect(member.phone).to.deep.equal(memberData.phone);
    });
    // redirect to member list page
    cy.url()
      .location('pathname')
      .should('contains', '/member');
  });
});
