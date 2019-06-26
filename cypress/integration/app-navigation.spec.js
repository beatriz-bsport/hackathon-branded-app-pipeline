/// <reference types="Cypress" />

import moment from 'moment';
import {
  BASE_URI,
  REACT_APP_URI,
  REACT_APP_TEST_URI,
  notErrorPage,
} from './common.utils';

describe('Testing App Navigation', function() {
  context('Test the refresh button', () => {
    // get the manager token before each test
    beforeEach(function() {
      cy.request(REACT_APP_TEST_URI)
        .its('body')
        .as('db')
        .then((response) => {
          cy.setCookie('auth_token', response.users.manager.token);
        });
    });

    it('Check if the data is correctly loaded after refresh', function() {
      cy.visit('/');
      cy.server();
      // register alerts request

      cy.route('GET', `${REACT_APP_URI}/alerts/`).as('Alerts');

      cy.route('GET', `${REACT_APP_URI}/saas/meta-activities/`).as(
        'MetaActivities',
      );
      cy.route('GET', `${REACT_APP_URI}/saas/offers/minimal`).as(
        'MinimalOffers',
      );
      cy.route('GET', `${REACT_APP_URI}/saas/activities/minimal/`).as(
        'MinimalActivities',
      );
      cy.route('GET', `${REACT_APP_URI}/saas/associated-coach/`).as(
        'AssociatedCoachs',
      );
      cy.route('GET', `${REACT_APP_URI}/saas/establishments/`).as(
        'Establishments',
      );
      cy.route('GET', `${REACT_APP_URI}/category/SCT`).as('SCT');
      cy.route('GET', `${REACT_APP_URI}/category/easy-accesses`).as(
        'EasyAccesses',
      );
      cy.route('GET', `${REACT_APP_URI}/saas/payment-pack/`).as('PaymentPack');
      cy.route('GET', `${REACT_APP_URI}/statistics/bookings`).as('Bookings');
      cy.route('GET', `${REACT_APP_URI}/statistics/new-members`).as(
        'NewMembers',
      );
      cy.route('GET', `${REACT_APP_URI}/statistics/turnover`).as('Turnover');
      cy.route('GET', `${BASE_URI}/shop/items`).as('ShopItems');
      cy.route('GET', `${REACT_APP_URI}/payment-rules/`).as('PaymentRules');
      cy.route('GET', `${REACT_APP_URI}/saas/workshop-activities/`).as(
        'WorkshopActivities',
      );
      // click on the refresh button
      cy.get('button[name="refresh"]').click();
      cy.wait([
        '@MetaActivities',
        '@MinimalOffers',
        '@MinimalActivities',
        '@AssociatedCoachs',
        '@Establishments',
        '@SCT',
        '@EasyAccesses',
        '@PaymentPack',
        '@Bookings',
        '@NewMembers',
        '@Turnover',
        '@ShopItems',
        '@PaymentRules',
        '@WorkshopActivities',
        '@Alerts',
      ]).then((xhrs) =>
        xhrs.map((xhr) => {
          expect(xhr.status).to.be.equal(200);
          expect(xhr.response.body).to.be.a('array');
        }),
      );
    });
  });

  context('Test app navigation items', () => {
    // get the manager token before each test
    beforeEach(function() {
      cy.request(REACT_APP_TEST_URI)
        .its('body')
        .as('db')
        .then((response) => {
          cy.setCookie('auth_token', response.users.manager.token);
        });
    });
    // Testing navigation items
    [
      {
        page: 'dashboard',
        path: '/dashboard',
      },
      {
        page: 'planning',
        path: '/planning',
      },
      {
        page: 'activity',
        path: '/activity',
      },
      {
        page: 'workshops',
        path: '/workshop-activity',
      },
      {
        page: 'coach',
        path: '/coach',
      },
      {
        page: 'coach',
        path: '/coach',
      },
      {
        page: 'establishment',
        path: '/establishment',
      },
      {
        page: 'payment pack',
        path: '/payment-pack',
      },
      {
        page: 'shop',
        path: '/shop',
      },
      {
        page: 'member',
        path: '/member',
      },
      {
        page: 'invoice',
        path: '/invoice',
      },
      {
        page: 'reporting',
        path: '/reporting',
      },
      {
        page: 'marketing',
        path: '/marketing',
      },
      {
        page: 'settings',
        path: '/settings/payment-rules',
      },
    ].map((item) => {
      it(`Check if ${item.page} page renders without crash`, function() {
        cy.visit(item.path);
        // check if the page crash
        notErrorPage();
        // check if we get redirect to the dashboard page correctly
        if (item.page === 'planning') {
          const momentDate = moment();
          cy.url()
            .location('pathname')
            .should(
              'eq',
              `/calendar/${momentDate.year()}/${momentDate.month() +
                1}/${momentDate.date()}`,
            );
        } else {
          cy.url()
            .location('pathname')
            .should('eq', item.path);
        }
      });
    });
  });
});
