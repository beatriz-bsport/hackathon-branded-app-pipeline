import React from 'react';

import { faker } from '@faker-js/faker';

import PriceCountForStorybook, {
  PriceCountProps,
} from './PriceCount/PriceCount.component';
import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items.js';
import { CONTRACT_BOOKING_FUNNEL_IDENTIFIER } from '#src/libs/marketplace/constants';
import { PrepaidLine } from '#src/libs/checkout/types';

const PriceCountTemplate = (args: PriceCountProps) => (
  <div
    style={{
      width: '374px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <PriceCountForStorybook {...args} />
  </div>
);

export const PriceCount = PriceCountTemplate.bind({});

const couponItem = {
  quantity: 1,
  id: '12',
  unit_price: -5,
  name: 'Code promo',
  buyable_item_identifier: BUYABLE_ITEM_COUPON,
  buyable_item_id: 123,
  editable: false,
  clearable: true,
  tax: 0,
  extra_data: {},
};

const contractItem = {
  quantity: 1,
  id: '1234',
  unit_price: 20,
  name: 'Subscription 1',
  buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
  buyable_item_id: 12345,
  editable: false,
  clearable: false,
  tax: 5,
  extra_data: {},
};

const flatFeeItem = {
  quantity: 1,
  id: '123456',
  unit_price: 8,
  name: 'Flat fee',
  buyable_item_identifier: CONTRACT_BOOKING_FUNNEL_IDENTIFIER,
  buyable_item_id: 1234567,
  editable: false,
  clearable: false,
  tax: 0,
  extra_data: {},
};

const subscriptionPseudoBasket = {
  member: 1,
  id: '4d605228-9776-4144-be55-05220abc2977',
  is_finalized: false,
  total_price: '23',
  total_price_cts: 2000,
  checkout_items: [couponItem, contractItem, flatFeeItem],
  company: 120,
  need_address: '',
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  address_line_1: faker.location.streetAddress(),
  address_line_2: '',
  zipcode: '84565',
  state: faker.location.state(),
  country: faker.location.country(),
  city: faker.location.city(),
  available_payment_methods: [1],
  total_price_prepaid_lines: '0',
  total_price_prepaid_lines_cts: 0,
  prepaid_lines: [] as PrepaidLine[],
  instalment_payment: null as null,
};

PriceCount.args = {
  basket: subscriptionPseudoBasket,
  isDeleteButtonDisabled: false,
  isExcludingTax: true,
  onRemoveCheckoutItem: () => {},
  onRemoveInternalAccountPrepaidLine: () => {},
  prepaidLines: [],
};

export default {
  title: 'Subscription/PriceCount',
  component: PriceCountForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
  argTypes: {
    isExcludingTax: { control: 'boolean' },
    isDeleteButtonDisabled: { control: 'boolean' },
  },
};
