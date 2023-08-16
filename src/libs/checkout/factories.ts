import { fakerEN as faker } from '@faker-js/faker';

import { generateRandomName } from '../../utils/factories';
import {
  Basket,
  BuyableItemOptions,
  CheckoutItem,
  CheckoutItemExtraData,
} from './types';

/**
 * Returns a Checkout Item
 * @param buyableItemType The buyable item identifier. Default is Pass
 * @param extraData Some extra data related to the offer
 * @param tax
 */
export const checkoutItemFactory = (
  buyableItemType?: BuyableItemOptions,
  extraData?: CheckoutItemExtraData,
  tax?: number,
): CheckoutItem => {
  return {
    quantity: faker.number.int({ max: 5, min: 1 }),
    id: faker.number.int().toString(),
    unit_price: faker.number.int({ max: 50, min: 0 }),
    name: generateRandomName(faker),
    buyable_item_identifier:
      buyableItemType ?? BuyableItemOptions.BUYABLE_ITEM_PASS,
    buyable_item_id: faker.number.int(),
    editable: faker.datatype.boolean(),
    clearable: faker.datatype.boolean(),
    tax: tax ?? 0.2,
    extra_data: extraData ?? {},
  };
};

/**
 * Returns a list of Checkout Item
 * @param count The number of elements you want in the list
 * @param buyableItemType The buyable item identifier. Default is Pass
 * @param extraData Some extra data related to the offer
 * @param tax
 */
export const checkoutItemsFactory = (
  count: number,
  buyableItemType?: BuyableItemOptions,
  extraData?: CheckoutItemExtraData,
  tax?: number,
): CheckoutItem[] => {
  return faker.helpers.multiple(
    () => checkoutItemFactory(buyableItemType, extraData, tax),
    { count },
  );
};

/**
 * Returns a Basket
 * @param nb_items The number of checkout items you want in the basket
 */
export const basketFactory = (nb_items: number): Basket => {
  const checkout_items = checkoutItemsFactory(nb_items);
  return {
    member: faker.number.int(),
    id: faker.number.int(16).toString(),
    is_finalized: false,
    total_price: checkout_items
      .reduce((previous, current) => previous + current.unit_price, 0)
      .toString(),
    total_price_cts: checkout_items.reduce(
      (previous, current) => previous + current.unit_price,
      0,
    ),
    checkout_items,
    company: faker.number.int(),
    need_address: false,
    first_name: 'Jean',
    last_name: 'Test',
    address_line_1: '15 Paris Street',
    address_line_2: 'Third floor',
    zipcode: '75013',
    state: 'Paris',
    country: 'France',
    city: 'Paris',
    available_payment_methods: [0],
    total_price_prepaid_lines: '0',
    total_price_prepaid_lines_cts: 0,
    prepaid_lines: [] as number[],
    invoice: faker.number.int(2) === 1 ? '123456' : undefined,
    is_fully_paid: faker.number.int(2) === 1 ? true : undefined,
    date_created: new Date().toISOString(),
    date_updated: new Date().toISOString(),
  };
};

/**
 * Returns list of Baskets
 * @param amount The number of baskets you want in the list
 */
export const createManyBaskets = (amount = 1): Basket[] => {
  const basketsIds = [...Array(amount).keys()];
  return basketsIds.map(() => {
    return basketFactory(faker.number.int({ max: 10, min: 1 }));
  });
};
