/// <reference types="Cypress" />

import moment from 'moment';
import { REACT_APP_URI, REACT_APP_TEST_URI } from './common.utils';

context('Payment', () => {
  beforeEach(() => {
    cy.request(`${REACT_APP_TEST_URI}?with_stripe=1`)
      .its('body')
      .as('db')
      .then((response) => {
        cy.setCookie('auth_token', response.users.customer.token);
      });
  });

  it('user can book an activity', function() {
    cy.visit(`/m/${this.db.marketplace.company.slug}`);

    const offer = this.db.marketplace.offer;

    const dateOffer = moment(offer.date);

    cy.get('#calendar-next-month').click();
    cy.get(`#calendar-day-${dateOffer.format('YYYY-MM-DD')}`).click();
    cy.get(`#offer-book-${offer.id}`).click();
    cy.get(`#payment-pack-buy-${offer.payment_pack_id}`).click();

    cy.wait(2000);
    cy.get('.__PrivateStripeElement > iframe').then(($iframe) => {
      const doc = $iframe.contents().find('body');
      let input = doc.find('[name=cardnumber]');
      cy.wrap(input)
        .type('4242')
        .type('4242')
        .type('4242')
        .type('4242');
      input = doc.find('[name=exp-date]');
      cy.wrap(input)
        .clear()
        .type('12')
        .type('20');
      input = doc.find('[name=cvc]');
      cy.wrap(input)
        .type('123')
        .type('{enter}');
    });
    cy.get('#stripe-pay').click();

    cy.url()
      .location('pathname')
      .should('eq', `/customer/payment/pass/${offer.payment_pack_id}`);

    cy.request({
      url: `${REACT_APP_URI}/booking/future/`,
      headers: { Authorization: `Token ${this.db.users.customer.token}` },
    }).then((response) => {
      const bookings = response.body.results;
      const booking = bookings.find((b) => b.offer.id === offer.id);
      expect(booking).to.be.not.null;
      expect(booking.status).to.be.true;
    });
  });
});
