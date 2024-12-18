import { getSubTotal } from '../utils';
import { Basket, CheckoutItem } from '../types';

const checkoutItems: Array<CheckoutItem> = [
  // @ts-expect-error
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
  // @ts-expect-error
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
  // @ts-expect-error
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
  // @ts-expect-error
  {
    quantity: 1,
    id: '4',
    unit_price: -50,
    name: 'string',
    buyable_item_identifier: 7,
    buyable_item_id: 0,
    editable: true,
  },
  // @ts-expect-error
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
  // @ts-expect-error
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
  // @ts-expect-error
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
  // @ts-expect-error
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
  // @ts-expect-error
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
  // @ts-expect-error
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
  // @ts-expect-error
  total_price_cts: '6000',
  checkout_items: checkoutItems,
  // @ts-expect-error
  company: '0',
  // @ts-expect-error
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
  // @ts-expect-error
  total_price_prepaid_lines: 0,
  prepaid_lines: [],
};

const basketWithVoucher: Basket = {
  member: 0,
  id: '0',
  is_finalized: true,
  total_price: '50',
  // @ts-expect-error
  total_price_cts: '5000',
  checkout_items: checkoutItemsWithVoucher,
  // @ts-expect-error
  company: '0',
  // @ts-expect-error
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
  // @ts-expect-error
  total_price_prepaid_lines: 0,
  prepaid_lines: [],
};

const basketEmpty: Basket = {
  member: 0,
  id: '0',
  is_finalized: true,
  total_price: '100',
  // @ts-expect-error
  total_price_cts: '10000',
  checkout_items: [],
  // @ts-expect-error
  company: '0',
  // @ts-expect-error
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
  // @ts-expect-error
  total_price_prepaid_lines: 0,
  prepaid_lines: [],
};

const basketEmptyQuantity: Basket = {
  member: 0,
  id: '0',
  is_finalized: true,
  total_price: '100',
  // @ts-expect-error
  total_price_cts: '6000',
  checkout_items: checkoutItemsEmpty,
  // @ts-expect-error
  company: '0',
  // @ts-expect-error
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
  // @ts-expect-error
  total_price_prepaid_lines: 0,
  prepaid_lines: [],
};

const getCheckoutItemPriceExcludingTax = (checkoutItem: CheckoutItem) => {
  const priceAsFloat =
    checkoutItem.unit_price < 0
      ? checkoutItem.unit_price * checkoutItem.quantity
      : checkoutItem.quantity *
        parseFloat(
          (checkoutItem.unit_price / (1 + checkoutItem.tax / 100)).toFixed(2),
        );

  return priceAsFloat.toFixed(2);
};

describe('TEST getSubTotal', () => {
  it('Should compute tax correctly', () => {
    expect(getSubTotal(basket)).toBe(
      checkoutItems
        .reduce(
          (sumExcludingTax, checkoutItem) =>
            sumExcludingTax +
            parseFloat(getCheckoutItemPriceExcludingTax(checkoutItem)),
          0,
        )
        .toFixed(2),
    );
    expect(getSubTotal(basketWithVoucher)).toBe(
      checkoutItemsWithVoucher
        .reduce(
          (sumExcludingTax, checkoutItem) =>
            sumExcludingTax +
            parseFloat(getCheckoutItemPriceExcludingTax(checkoutItem)),
          0,
        )
        .toFixed(2),
    );
  });
  it('Should not calcul ', () => {
    expect(getSubTotal(basketEmpty)).toBe(parseFloat('0').toFixed(2));
    expect(getSubTotal(basketEmptyQuantity)).toBe(parseFloat('0').toFixed(2));
  });
});
