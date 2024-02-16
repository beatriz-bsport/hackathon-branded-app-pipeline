import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
} from '@bsport/common/lib/master-data/payment-group';

import { BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB } from '@bsport/common/lib/master-data/subscription-payment-methods';

import {
  generateRandomDescription,
  generateRandomName,
  generateRandomPrice,
} from '../../../utils/factories';
import { FakerTextLength } from '../../../utils/types';

import { SubscriptionInterval } from '#libs/subscription/types';
import { SubscriptionFactoryOptions } from './types';
import { subscriptionPauseListFactory } from './subscription_pause';
import { randomStatus } from './utils';
import { plannedInvoiceListFactory } from './planned_invoice';

const randomInterval = faker.helpers.arrayElement<SubscriptionInterval>([
  'month',
  'week',
  'day',
  'year',
]);

/**
 * Generates a subscription with Faker. You can use the options parameter to alter properties of the returned object
 * @param options The options given to alter properties of generated subscription
 * @returns {Subscription}
 * @example
 * const fakeSubscription = subscriptionFactory({
 *  hasDiscount: true,
 *  isAutoRenewal: true
 * })
 */
export const subscriptionFactory = (options?: SubscriptionFactoryOptions) => {
  return {
    id: faker.number.int(10000),
    auto_renewal: options?.isAutoRenewal ?? faker.datatype.boolean(),
    canceled_at: options?.isCanceled
      ? moment().subtract(1, 'week').format()
      : null,
    contract: faker.number.int(10000),
    contract_terms_date_accepted: moment().subtract(1, 'week').format(),
    contract_terms_pdf_link: faker.internet.url(),
    date_created: moment().subtract(3, 'week').format(),
    description: generateRandomDescription(faker, FakerTextLength.LONG),
    editable: options?.isEditable ?? faker.datatype.boolean(),
    first_billing_date: moment().add(1, 'month').format(),
    flat_fee: generateRandomPrice(faker, { min: 5, max: 100 }).toString(),
    has_ended: options?.isSubscriptionEnded ?? faker.datatype.boolean(),
    is_v2: options?.isV2 ?? faker.datatype.boolean(),
    interval: randomInterval,
    legal_contract: faker.lorem.sentence(200),
    member: faker.number.int(10000),
    memberName: faker.person.fullName(),
    memberArchived: options?.isMemberArchived ?? faker.datatype.boolean(),
    name: generateRandomName(faker),
    name_without_member_name: generateRandomName(faker),
    nb_interval: faker.number.int({ min: 6, max: 24 }),
    next_billing_date:
      options?.nextBillingDate ?? moment().add(2, 'weeks').format(),
    note: generateRandomDescription(faker),
    stop_note: generateRandomDescription(faker),
    pauses: subscriptionPauseListFactory(2),
    payment_combo: options?.hasPaymentCombo ? faker.number.int(10000) : null,
    payment_engine: PAYMENT_ENGINE_STRIPE,
    payment_method: BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
    payment_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    payment_pack: options?.hasPaymentPack ? faker.number.int(10000) : null,
    planned_invoices: plannedInvoiceListFactory(5),
    private_pass: options?.hasPrivatePass ? faker.number.int(10000) : null,
    recurrence_basis: faker.number.int({ min: 1, max: 20 }),
    recurrent_price: generateRandomPrice(faker, { min: 5, max: 100 }),
    recurrent_voucher: faker.number.int(10000),
    status: options?.status ?? randomStatus,
    stripe_payment_method_id: faker.string.uuid(),
    trial_nb: faker.number.int(5),
    month_billing_day: options?.nextBillingDate
      ? null
      : faker.number.int({ min: 1, max: 25 }),
    has_discount: options?.hasDiscount ?? faker.datatype.boolean(),
  };
};

/**
 * Generates a list of subscriptions with Faker
 * @param count The number of subscriptions to generate
 * @returns {Subscription[]}
 */
export const subscriptionListFactory = (
  count: number,
  options?: SubscriptionFactoryOptions,
) => {
  return faker.helpers.multiple(() => subscriptionFactory(options), { count });
};

export default subscriptionFactory;
