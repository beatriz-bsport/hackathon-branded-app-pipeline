import { faker } from '@faker-js/faker';
import { Coupon } from './types';

function randomPercent() {
  return faker.datatype.number({ min: 1, max: 100 });
}

function randomAmount() {
  return faker.datatype.number({ min: 5, max: 100 });
}

function randomDateFuture() {
  return faker.date.future().toISOString().split('T')[0];
}

function randomArrayNumbers(length: number) {
  return Array.from({ length }, () => faker.datatype.number(1000));
}

export function couponFactory(couponOverride?: Partial<Coupon>): Coupon {
  return {
    id: faker.datatype.number(1000),
    available: faker.datatype.boolean(),
    company: faker.datatype.number(1000),
    code: faker.random.alphaNumeric(10),
    amount_off: randomAmount(),
    percent_off: randomPercent(),
    voucher_type: faker.datatype.number(100),
    only_on_first_checkout: faker.datatype.boolean(),
    whitelist_members: randomArrayNumbers(10),
    discounts: randomArrayNumbers(5),
    usage_per_member: faker.datatype.number(10),
    usage_total: faker.datatype.number(100),
    applies_to: faker.datatype.number(1000),
    only_on_objects: randomArrayNumbers(3),
    expiration_date: randomDateFuture(),
    is_active: faker.datatype.boolean(),
    combinable: faker.datatype.boolean(),
    minimum_amount: randomAmount(),
    name: faker.commerce.productName(),
    whitelist_tags: randomArrayNumbers(5),
    blacklist_tags: randomArrayNumbers(5),
    subscription_mode: faker.datatype.number(10),
    coupon_template_instance: undefined,
    coupon_type: undefined,
    available_unique_codes: {},
    coupon_cost_for_company: faker.datatype.number(1000),
    nb_unique_codes: faker.datatype.number(100),
    nb_discounts: faker.datatype.number(10),
    ...couponOverride,
  };
}
