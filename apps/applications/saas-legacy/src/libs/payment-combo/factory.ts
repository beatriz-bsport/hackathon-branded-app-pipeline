import { fakerEN as faker } from '@faker-js/faker';

import {
  CB,
  BACS_DEBIT,
  SEPA,
} from '@bsport/common/lib/master-data/payment-methods';

import { DateTime } from 'luxon';
import { paymentPackFactory } from '#src/libs/payment-packs/factory';
import { privatePassFactory } from '#src/libs/private-service/factory';
import { shopItemFactory } from '#src/libs/shop/factory';

import {
  generateRandomName,
  generateRandomDescription,
  generateRandomPrice,
} from '../../utils/factories';

import type { PaymentComboFactoryOptions } from './types';

/**
 * Generates a payment combo item with Faker
 * @param count The number of payment combo item to generate
 */
const paymentComboItemListFactory = (
  count: number,
  itemType: 'paymentPack' | 'privatePass' | 'shopItem',
) => {
  const getPaymentComboData = () => {
    switch (itemType) {
      case 'paymentPack':
        return paymentPackFactory();
      case 'privatePass':
        return privatePassFactory();
      case 'shopItem':
        return shopItemFactory();
      default:
        return paymentPackFactory();
    }
  };
  return faker.helpers.multiple(
    () => {
      return {
        id: parseInt(faker.finance.accountNumber(4), 10),
        price: generateRandomPrice(faker, { min: 5, max: 100 }),
        name: generateRandomName(faker),
        quantity: faker.number.int(10),
        tax: 'VAT',
        data: getPaymentComboData(),
      };
    },
    { count },
  );
};

/**
 * Generates a payment combo with Faker
 * @returns {PaymentCombo}
 */
export const paymentComboFactory = (options?: PaymentComboFactoryOptions) => {
  return {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    description: generateRandomDescription(faker),
    price: generateRandomPrice(faker, { min: 5, max: 100 }),
    use_payment_combo_tax_on_items: faker.datatype.boolean(),
    tax: faker.number.int(20),
    tax_calculation: faker.number.int(15),
    company: faker.number.int({ max: 10000 }),
    available: faker.datatype.boolean(),
    manager_only: faker.datatype.boolean(),
    date_created: DateTime.now().minus({ week: 1 }).toISO(),
    payment_packs: paymentComboItemListFactory(
      faker.number.int(3),
      'paymentPack',
    ),
    shop_items: paymentComboItemListFactory(faker.number.int(3), 'shopItem'),
    private_passes: paymentComboItemListFactory(
      faker.number.int(3),
      'privatePass',
    ),
    max_purchase_per_member: faker.helpers.arrayElement([
      null,
      faker.number.int(5),
    ]),
    barcode: faker.finance.accountNumber(13),
    available_payment_method_identifier: [CB.id, BACS_DEBIT.id, SEPA.id],
    new_member_only: faker.datatype.boolean(),
    is_usable_by_staff: faker.datatype.boolean(),
    highlighted_as_recommended: options?.isHighlightedAsRecommended ?? false,
  };
};

/**
 * Generates a list of payment combo with Faker
 * @param count The number of payment combo to generate
 * @returns {PaymentCombo[]}
 */
export const paymentComboListFactory = (
  count: number,
  options?: PaymentComboFactoryOptions,
) => {
  return faker.helpers.multiple(() => paymentComboFactory(options), { count });
};
