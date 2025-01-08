import { fakerEN as faker } from '@faker-js/faker';

import { BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB } from '@bsport/common/master-data/subscription-payment-methods.js';

import { DateTime } from 'luxon';
import { PlannedInvoiceFactoryOptions } from '#src/libs/subscription/types';
import {
  generateRandomName,
  generateRandomPrice,
} from '../../../utils/factories';

import { randomStatus } from './utils';

/**
 * Generates a planned invoice with Faker. You can use the options parameter to alter properties of the returned object
 * @param options The options given to alter properties of generated planned invoice
 * @returns {PlannedInvoice}
 * @example
 * const fakePlannedInvoice = plannedInvoiceFactory({
 *  isReverted: true,
 *  isLastInvoiceBeforeScheduledStop: false
 * })
 */
export const plannedInvoiceFactory = (
  options?: PlannedInvoiceFactoryOptions,
) => {
  return {
    id: faker.number.int(10000),
    date: DateTime.now().plus({ months: 1 }).toISO(),
    status: options?.status ?? randomStatus,
    price: generateRandomPrice(faker, { min: 5, max: 100 }),
    voucher: faker.number.int(10000),
    uuid: faker.string.uuid(),
    billing_plan: faker.number.int(10000),
    name: generateRandomName(faker),
    contract: faker.number.int(10000),
    payment_method: BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
    member: faker.number.int(10000),
    amount_due_cts: faker.number.int(50000),
    is_last_invoice_before_scheduled_stop:
      options?.isLastInvoiceBeforeScheduledStop ?? faker.datatype.boolean(),
    reverted: options?.isReverted ?? faker.datatype.boolean(),
    invoice_legal_identifier: faker.string.alphanumeric(3).toUpperCase(),
  };
};

/**
 * Generates a list of planned invoices with Faker
 * @param count The number of planned invoices to generate
 * @returns {PlannedInvoice[]}
 */
export const plannedInvoiceListFactory = (count: number) => {
  return faker.helpers.multiple(() => plannedInvoiceFactory(), { count });
};

export default plannedInvoiceFactory;
