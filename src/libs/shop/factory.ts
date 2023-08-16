import { fakerEN as faker } from '@faker-js/faker';
import { CB } from '@bsport/common/lib/master-data/payment-methods';

import {
  generateRandomName,
  generateRandomDescription,
  generateRandomPrice,
} from '../../utils/factories';

import { FakerTextLength } from '../../utils/types';
import { ShopItemFactoryOptions } from './types';

/**
 * Generates a shop item with Faker
 * @returns {ShopItem}
 * @example
 * const fakeShopItem = shopItemFactory({
 *  isUnlimitedProvisions: true,
 *  isDeliverable: false
 * })
 */
export const shopItemFactory = (options?: ShopItemFactoryOptions) => {
  return {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    subtitle: generateRandomDescription(faker, FakerTextLength.SMALL),
    description: generateRandomDescription(faker),
    tva: faker.number.int(20),
    price: generateRandomPrice(faker, { min: 5, max: 100 }),
    cover: faker.image.urlPicsumPhotos({ width: 600, height: 500 }),
    company: faker.number.int({ max: 10000 }),
    unlimited_provisions:
      options?.isUnlimitedProvisions ?? faker.datatype.boolean(),
    subshop: parseInt(faker.finance.accountNumber(4), 10),
    marketplace_enabled:
      options?.isMarketplaceEnabled ?? faker.datatype.boolean(),
    is_deliverable: options?.isDeliverable ?? faker.datatype.boolean(),
    available_payment_method_identifiers: [CB.id],
    current_stock: faker.number.int(20),
    disabled: options?.isDisabled ?? false,
  };
};

/**
 * Generates a list of shop item with Faker
 * @param count The number of shop item to generate
 * @param options The options given to alter properties of generated shop item
 * @returns {ShopItem[]}
 */
export const shopItemListFactory = (
  count: number,
  options?: ShopItemFactoryOptions,
) => {
  return faker.helpers.multiple(() => shopItemFactory(options), { count });
};
