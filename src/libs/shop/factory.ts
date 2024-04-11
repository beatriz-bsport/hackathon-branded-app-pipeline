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
    barcode: faker.helpers.arrayElement([
      faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
      '',
    ]),
    name: generateRandomName(faker),
    subtitle: generateRandomDescription(faker, FakerTextLength.SMALL),
    description: generateRandomDescription(faker),
    tva: faker.number.int(20).toString(),
    price: generateRandomPrice(faker, { min: 5, max: 100 }).toString(),
    supplier_price: generateRandomPrice(faker, { min: 5, max: 100 }).toString(),
    cover: faker.image.urlPicsumPhotos({ width: 600, height: 500 }),
    company: faker.number.int({ max: 10000 }),
    company_details: {
      id: faker.number.int({ max: 10000 }),
      name: faker.lorem.words(3),
    },
    unlimited_provisions:
      options?.isUnlimitedProvisions ?? faker.datatype.boolean(),
    subshop: parseInt(faker.finance.accountNumber(4), 10),
    marketplace_enabled:
      options?.isMarketplaceEnabled ?? faker.datatype.boolean(),
    is_deliverable: options?.isDeliverable ?? faker.datatype.boolean(),
    is_standalone_item: options?.isStandaloneItem ?? faker.datatype.boolean(),
    featured: faker.datatype.boolean(),
    sell_only_on_provision: faker.datatype.boolean(),
    available_payment_method_identifiers: [CB.id],
    current_stock: faker.number.int(20),
    number_of_variants: faker.number.int(20),
    total_sales: faker.number.int(500),
    disabled: options?.isDisabled ?? false,
    color: faker.color.human(),
    size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL']),
    lowest_variant_price: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 20, max: 100 }),
    ]),
    all_variants_follow_base_price:
      options?.allVariantsFollowBasePrice ?? faker.datatype.boolean(),
    stock_keeping_unit: faker.string.alphanumeric(10),
    supplier: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 1, max: 1000 }),
    ]),
    tags_on_purchase: faker.helpers.multiple(() => faker.number.int(10000), {
      count: faker.number.int(5),
    }),
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
