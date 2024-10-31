import { fakerEN as faker } from '@faker-js/faker';

import { generateRandomName } from '../../utils/factories';
import {
  Basket,
  BuyableItemOptions,
  CheckoutItem,
  type PrepaidLineExtraData,
  type PrepaidLine,
} from './types';

/**
 * Returns a Checkout Item
 * @param checkoutItemOverwrite If you want to specify props to your checkout item
 */
export const checkoutItemFactory = (
  checkoutItemOverwrite?: Partial<CheckoutItem>,
): CheckoutItem => {
  const safeCheckoutItemOverwrite = checkoutItemOverwrite ?? {};
  return {
    quantity: faker.number.int({ max: 5, min: 1 }),
    id: faker.number.int().toString(),
    unit_price: faker.number.int({ max: 1000, min: 0 }),
    name: generateRandomName(faker),
    buyable_item_identifier: BuyableItemOptions.BUYABLE_ITEM_PASS,
    buyable_item_id: faker.number.int(),
    editable: faker.datatype.boolean(),
    clearable: faker.datatype.boolean(),
    tax: 0.2,
    extra_data: {},
    expiration_datetime: '',
    ...safeCheckoutItemOverwrite,
  };
};

/**
 * Returns a list of Checkout Item
 * @param count The number of elements you want in the list
 * @param checkoutItemOverwrite Overwrites props of the mock checkout items for all the checkout items in the list
 */
export const checkoutItemsFactory = (
  count: number,
  checkoutItemOverwrite?: Partial<CheckoutItem>,
): CheckoutItem[] => {
  return faker.helpers.multiple(
    () => checkoutItemFactory(checkoutItemOverwrite),
    {
      count,
    },
  );
};

/**
 * Returns a PrepaidLine
 * @param extraData Some additional data for giftcard or internal account
 */
export const prepaidLineFactory = (
  extraData?: PrepaidLineExtraData,
): PrepaidLine => {
  return {
    id: faker.number.int().toString(),
    unit_value: faker.number
      .float({ max: 1000, min: 0, multipleOf: 0.01 })
      .toFixed(2),
    name: generateRandomName(faker),
    extra_data: extraData ?? {},
  };
};

/**
 * Returns a list of  PrepaidLines
 * @param count The number of PrepaidLines in the return value
 * @param extraData Some additional data for giftcard or internal account
 */
export const prepaidLinesFactory = (
  count: number,
  extraData?: PrepaidLineExtraData,
): PrepaidLine[] => {
  return faker.helpers.multiple(() => prepaidLineFactory(extraData), { count });
};

/**
 * Returns a Basket
 * @param nb_items The number of checkout items you want in the basket
 * @param basketOverwrite Overwrites the mocked basket. Useful if you want specific props in your basket
 */
export const basketFactory = (
  nb_items: number,
  basketOverwrite?: Partial<Basket>,
): Basket => {
  const checkout_items = checkoutItemsFactory(nb_items);
  const safeBasketOverwrite = basketOverwrite ?? {};
  return {
    member: faker.number.int(),
    id: faker.number.int(16).toString(),
    is_finalized: false,
    total_price: checkout_items
      .reduce(
        (previous, current) => previous + current.unit_price * current.quantity,
        0,
      )
      .toString(),
    total_price_cts: checkout_items.reduce(
      (previous, current) => previous + current.unit_price * current.quantity,
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
    ...safeBasketOverwrite,
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
