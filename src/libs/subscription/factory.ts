import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
} from '@bsport/common/lib/master-data/payment-group';
import {
  PENDING,
  SUCCEEDED,
  FAILED,
  PROCESSING,
  CANCELED,
} from '@bsport/common/lib/master-data/planned-invoice-status';
import { BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB } from '@bsport/common/lib/master-data/subscription-payment-methods';

import {
  generateRandomDescription,
  generateRandomName,
  generateRandomPrice,
} from '../../utils/factories';
import { FakerTextLength } from '../../utils/types';

import {
  ContractFactoryOptions,
  ContractInterval,
  PlannedInvoiceFactoryOptions,
  SubscriptionFactoryOptions,
  SubscriptionInterval,
} from '#libs/subscription/types';

const randomInterval = faker.helpers.arrayElement<SubscriptionInterval>([
  'month',
  'week',
  'day',
  'year',
]);
const randomContractInterval = faker.helpers.arrayElement<ContractInterval>([
  'month',
  'week',
]);
const randomStatus = faker.helpers.arrayElement([
  PENDING.id,
  SUCCEEDED.id,
  FAILED.id,
  PROCESSING.id,
  CANCELED.id,
]);

/**
 * Generates a subscription pause with Faker.
 * @returns {SubscriptionPause}
 */
export const subscriptionPauseFactory = () => {
  return {
    id: faker.number.int(10000),
    days: faker.number.int(10),
    date_created: moment().subtract(2, 'week').format(),
    date_ended: moment().subtract(5, 'day').format(),
    from_date: moment().subtract(10, 'day').format(),
    until_date: moment().add(10, 'day').format(),
    billing_plan: faker.number.int(10000),
    name: faker.lorem.sentence(2),
    first_paused_planned_invoice: faker.number.int(10000),
    creator_staff_name: faker.person.fullName(),
    version: faker.number.int(20).toString(),
    contract_pause: faker.number.int(10000),
  };
};

/**
 * Generates a list of subscription pause with Faker
 * @param count The number of subscription pause to generate
 * @returns {SubscriptionPause[]}
 */
const subscriptionPauseListFactory = (count: number) => {
  return faker.helpers.multiple(() => subscriptionPauseFactory(), { count });
};

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
const plannedInvoiceFactory = (options?: PlannedInvoiceFactoryOptions) => {
  return {
    id: faker.number.int(10000),
    date: moment().add(1, 'month').format(),
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
const plannedInvoiceListFactory = (count: number) => {
  return faker.helpers.multiple(() => plannedInvoiceFactory(), { count });
};

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
    recurrence_basis: faker.number.int(20),
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

/**
 * Generates a contract with Faker. You can use the options parameter to alter properties of the returned object
 * @param options The options given to alter properties of generated contract
 * @returns {Contract}
 * @example
 * const fakeContract = contractFactory({
 *  hasPaymentPack: true,
 *  monthBillingDay: 5
 * })
 */
export const contractFactory = (options?: ContractFactoryOptions) => {
  return {
    id: faker.number.int(10000),
    company: parseInt(faker.finance.accountNumber(4)),
    payment_pack: options?.hasPaymentPack ? faker.number.int(10000) : null,
    private_pass: options?.hasPrivatePass ? faker.number.int(10000) : null,
    payment_combo: options?.hasPaymentCombo ? faker.number.int(10000) : null,
    name: generateRandomName(faker),
    description: generateRandomDescription(faker, FakerTextLength.LONG),
    contract: faker.finance.accountNumber(4),
    manager_only: options?.isManagerOnly ?? faker.datatype.boolean(),
    auto_renewal: options?.isAutoRenewal ?? faker.datatype.boolean(),
    flat_fee: generateRandomPrice(faker, { min: 5, max: 100 }).toString(),
    recurrent_price: generateRandomPrice(faker, { min: 5, max: 100 }),
    nb_interval: faker.number.int({ min: 6, max: 24 }),
    disabled: options?.isDisabled ?? faker.datatype.boolean(),
    interval: randomContractInterval,
    recurrence_basis: faker.number.int(20),
    tax: faker.number.int(20).toString(),
    contract_terms_pdf_link: faker.internet.url(),
    is_usable_by_staff: options?.isUsableByStaff ?? faker.datatype.boolean(),
    month_billing_day: options?.monthBillingDay ?? null,
  };
};

/**
 * Generates a list of contracts with Faker
 * @param count The number of contracts to generate
 * @returns {Contract[]}
 */
export const contractListFactory = (
  count: number,
  options?: ContractFactoryOptions,
) => {
  return faker.helpers.multiple(() => contractFactory(options), { count });
};
