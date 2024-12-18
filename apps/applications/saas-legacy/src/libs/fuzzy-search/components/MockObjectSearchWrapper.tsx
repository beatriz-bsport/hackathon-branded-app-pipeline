import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { coachPaymentRuleFactory } from '#src/libs/coach-payment-rules/factories';
import { couponFactory } from '#src/libs/coupon/factories';
import type { ObjectSearchPaginated } from '#src/libs/fuzzy-search/types';
import { API_V1_URI } from '../../../http';

const generateFakeCoupons = (length: number): ObjectSearchPaginated => ({
  count: length,
  next_page: null,
  results: Array.from({ length }, couponFactory),
  links: {
    next: null,
    previous: null,
  },
  page: 1,
});

const generateFakePaymentRules = (length: number): ObjectSearchPaginated => ({
  count: length,
  next_page: null,
  results: Array.from({ length }, coachPaymentRuleFactory),
  links: {
    next: null,
    previous: null,
  },
  page: 1,
});

/**
 * Mocks the object-search results for coupons and coach payment rules.
 * This is only used to mock the search inside the storybook.
 */

const MockObjectSearchWrapper = ({
  children,
}: {
  children?: React.ReactElement | React.ReactElement[];
}) => {
  const mock = new MockAdapter(axios);

  mock
    .onGet(new RegExp(`^${API_V1_URI}/coupon/search/.{1,10}$`))
    .reply(200, generateFakeCoupons(10));

  mock
    .onGet(new RegExp(`^${API_V1_URI}/coupon/search/.{11,20}$`))
    .reply(200, generateFakeCoupons(5));

  mock
    .onGet(new RegExp(`^${API_V1_URI}/coupon/search/.{21,120}$`))
    .reply(200, generateFakeCoupons(2));

  mock
    .onGet(new RegExp(`^${API_V1_URI}/coach_payment_rules/search/.{1,10}$`))
    .reply(200, generateFakePaymentRules(10));

  mock
    .onGet(new RegExp(`^${API_V1_URI}/coach_payment_rules/search/.{11,20}$`))
    .reply(200, generateFakePaymentRules(5));

  mock
    .onGet(new RegExp(`^${API_V1_URI}/coach_payment_rules/search/.{21,120}$`))
    .reply(200, generateFakePaymentRules(2));

  return <>{children}</>;
};

export default React.memo(MockObjectSearchWrapper);
