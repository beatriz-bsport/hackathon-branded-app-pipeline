// @ts-nocheck
import { getBasketTotalPriceExcludingTax } from '../utils';
import { Basket, CheckoutItem } from '../types';

const checkoutItems: Array<CheckoutItem> = [
  {
    quantity: 1,
    id: '0',
    unit_price: 30,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 0,
    editable: true,
    tax: 10,
  },
  {
    quantity: 2,
    id: '1',
    unit_price: 20,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 1,
    editable: true,
    tax: 12,
  },
  {
    quantity: 3,
    id: '2',
    unit_price: 10,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 2,
    editable: true,
    tax: 15,
  },
];

const checkoutItemsWithVoucher: Array<CheckoutItem> = [
  {
    quantity: 1,
    id: '4',
    unit_price: -50,
    name: 'string',
    buyable_item_identifier: 7,
    buyable_item_id: 0,
    editable: true,
  },
  {
    quantity: 1,
    id: '0',
    unit_price: 30,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 0,
    editable: true,
    tax: 10,
  },
  {
    quantity: 2,
    id: '1',
    unit_price: 20,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 1,
    editable: true,
    tax: 12,
  },
  {
    quantity: 3,
    id: '2',
    unit_price: 10,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 2,
    editable: true,
    tax: 15,
  },
];

const checkoutItemsEmpty: Array<CheckoutItem> = [
  {
    quantity: 0,
    id: '0',
    unit_price: 30,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 0,
    editable: true,
    tax: 10,
  },
  {
    quantity: 0,
    id: '1',
    unit_price: 20,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 1,
    editable: true,
    tax: 12,
  },
  {
    quantity: 0,
    id: '2',
    unit_price: 10,
    name: 'string',
    buyable_item_identifier: 1,
    buyable_item_id: 2,
    editable: true,
    tax: 15,
  },
];

const basket: Basket = {
  member: 0,
  id: '0',
  is_finalized: true,
  total_price: '100',
  total_price_cts: '6000',
  checkout_items: checkoutItems,
  company: '0',
  need_address: 'need_address',
  first_name: 'first_name',
  last_name: 'last_name',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  zipcode: 'zipcode',
  state: 'state',
  country: 'country',
  city: 'city',
  available_payment_methods: [],
  total_price_prepaid_lines: 0,
  prepaid_lines: [],
};

const basketWithVoucher: Basket = {
  member: 0,
  id: '0',
  is_finalized: true,
  total_price: '50',
  total_price_cts: '5000',
  checkout_items: checkoutItemsWithVoucher,
  company: '0',
  need_address: 'need_address',
  first_name: 'first_name',
  last_name: 'last_name',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  zipcode: 'zipcode',
  state: 'state',
  country: 'country',
  city: 'city',
  available_payment_methods: [],
  total_price_prepaid_lines: 0,
  prepaid_lines: [],
};

const basketEmpty: Basket = {
  member: 0,
  id: '0',
  is_finalized: true,
  total_price: '100',
  total_price_cts: '10000',
  checkout_items: [],
  company: '0',
  need_address: 'need_address',
  first_name: 'first_name',
  last_name: 'last_name',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  zipcode: 'zipcode',
  state: 'state',
  country: 'country',
  city: 'city',
  available_payment_methods: [],
  total_price_prepaid_lines: 0,
  prepaid_lines: [],
};

const basketEmptyQuantity: Basket = {
  member: 0,
  id: '0',
  is_finalized: true,
  total_price: '100',
  total_price_cts: '6000',
  checkout_items: checkoutItemsEmpty,
  company: '0',
  need_address: 'need_address',
  first_name: 'first_name',
  last_name: 'last_name',
  address_line_1: 'address_line_1',
  address_line_2: 'address_line_2',
  zipcode: 'zipcode',
  state: 'state',
  country: 'country',
  city: 'city',
  available_payment_methods: [],
  total_price_prepaid_lines: 0,
  prepaid_lines: [],
};

describe('TEST getBasketTotalPriceExcludingTax', () => {
  it('Should calcul tax correctly', () => {
    expect(getBasketTotalPriceExcludingTax(basket)).toBe(
      (
        parseFloat(basket.total_price) /
        (1 +
          (30 * 0.1 + 20 * 2 * 0.12 + 10 * 3 * 0.15) / (30 + 20 * 2 + 10 * 3))
      ).toFixed(2),
    );
    expect(getBasketTotalPriceExcludingTax(basketWithVoucher)).toBe(
      (
        parseFloat(basketWithVoucher.total_price) /
        (1 +
          (30 * 0.1 + 20 * 2 * 0.12 + 10 * 3 * 0.15) / (30 + 20 * 2 + 10 * 3))
      ).toFixed(2),
    );
  });
  it('Should not calcul ', () => {
    expect(getBasketTotalPriceExcludingTax(basketEmpty)).toBe(
      parseFloat('0').toFixed(2),
    );
    expect(getBasketTotalPriceExcludingTax(basketEmptyQuantity)).toBe(
      parseFloat('0').toFixed(2),
    );
  });
});
