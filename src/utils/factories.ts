import { Faker } from '@faker-js/faker';
import { FakerTextLength } from './types';

/**
 *  @deprecated Use `faker.number.int()` instead
 */
export function generateRandomInt(max: number, min: number = 0) {
  // Return a random value between min (included, 0 if undefined) and max (excluded)
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Returns a list of random IDs
 * @param fakerInstance The faker instance
 * @param count The number of IDs to generate
 */
export const generateRandomIdList = (fakerInstance: Faker, count: number) => {
  return fakerInstance.helpers.multiple(
    () => parseInt(fakerInstance.finance.accountNumber(4), 10),
    {
      count,
    },
  );
};

/**
 * Generates a product name with Faker
 * @param length The text length
 */
export const generateRandomName = (
  fakerInstance: Faker,
  length?: FakerTextLength,
) => {
  switch (length) {
    case FakerTextLength.LONG:
      return fakerInstance.helpers
        .multiple(fakerInstance.commerce.productName, { count: 3 })
        .join(' ');
    default:
      return fakerInstance.commerce.productName();
  }
};

/**
 * Generates a product description with Faker
 * @param length The text length
 */
export const generateRandomDescription = (
  fakerInstance: Faker,
  length?: FakerTextLength,
) => {
  switch (length) {
    case FakerTextLength.SMALL:
      return fakerInstance.commerce
        .productDescription()
        .split(' ')
        .slice(0, 5)
        .join(' ');
    case FakerTextLength.LONG:
      return fakerInstance.helpers
        .multiple(fakerInstance.commerce.productDescription, { count: 3 })
        .join(' ');
    default:
      return fakerInstance.commerce.productDescription();
  }
};

/**
 * Generates a price between min and max (inclusive) with Faker
 *
 * @param options.min The minimum price. Defaults to `1`.
 * @param options.max The maximum price. Defaults to `1000`.
 * @param options.dec The number of decimal places. Defaults to `2`.
 * @param options.symbol The currency value to use. Defaults to `''`.
 */
export const generateRandomPrice = (
  fakerInstance: Faker,
  priceOptions?: {
    min?: number;
    max?: number;
    dec?: number;
    symbol?: string;
  },
) => {
  return parseFloat(fakerInstance.commerce.price(priceOptions));
};
