import { CB } from '@bsport/common/lib/master-data/payment-methods.js';
import { fakerEN as faker } from '@faker-js/faker';
import {
  generateRandomName,
  generateRandomDescription,
  generateRandomPrice,
} from '#src/utils/factories';

import { FakerTextLength } from '#src/utils/types';
import type {
  ShopItemFactoryOptions,
  ShopSupplierFactoryOptions,
  SubshopFactoryOptions,
} from './types';

/**
 * Generates a subshop with Faker
 * @returns {SubShop}
 * @example
 * const fakeSubshop = subshopFactory();
 */
export const subshopFactory = (options?: SubshopFactoryOptions) => {
  return {
    id: faker.number.int({ max: 10000 }),
    name: generateRandomName(faker),
    ...(!options?.isFranchise && {
      company: faker.number.int({ max: 10000 }),
    }),
    ...(!options?.isFranchise && {
      shopItems: faker.helpers.multiple(() => faker.number.int(10000), {
        count: faker.number.int(5),
      }),
    }),
    ...(options?.isFranchise && {
      franchisor: faker.number.int({ max: 10000 }),
    }),
  };
};

/**
 * Generates a list of subshop with Faker
 * @param count The number of subshop to generate
 * @param options The options given to alter properties of generated subshop
 * @returns {SubShop[]}
 */
export const subshopListFactory = (
  count: number,
  options?: SubshopFactoryOptions,
) => {
  return faker.helpers.multiple(() => subshopFactory(options), { count });
};

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
      is_multi_location_webshop_enabled: faker.datatype.boolean(),
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
    base_item: faker.helpers.arrayElement([
      faker.number.int({ min: 1, max: 1000 }),
      null,
    ]),
    shop_item_template: faker.number.int({ max: 10000 }),
    ...(options?.isFranchise && {
      franchisor: faker.number.int({ max: 10000 }),
    }),
    ...(options?.isFranchise && {
      sub_shop_template: faker.number.int({ max: 10000 }),
    }),
    ...(options?.isFranchise && {
      supplier_template: faker.number.int({ max: 10000 }),
    }),
    ...(options?.isFranchise && {
      synced_companies: faker.helpers.multiple(
        () => ({
          id: faker.number.int(10000),
          name: generateRandomName(faker),
        }),
        {
          count: faker.number.int(5),
        },
      ),
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

/**
 * Generates a shop supplier with Faker
 * @example
 * const fakeShopSupplier = shopSupplierFactory()
 */
export const shopSupplierFactory = (options?: ShopSupplierFactoryOptions) => {
  return {
    description: generateRandomDescription(faker),
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    ...(options.isFranchise && {
      franchisor: faker.number.int({ max: 10000 }),
    }),
  };
};

/**
 * Generates a list of shop supplier with Faker
 * @param count The number of shop supplier to generate
 */
export const shopSupplierListFactory = (
  count: number,
  options?: ShopSupplierFactoryOptions,
) => {
  return faker.helpers.multiple(() => shopSupplierFactory(options), { count });
};
