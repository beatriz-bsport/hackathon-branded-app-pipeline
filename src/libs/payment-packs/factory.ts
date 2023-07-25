import { fakerEN as faker } from '@faker-js/faker';

import {
  generateRandomDescription,
  generateRandomIdList,
  generateRandomName,
  generateRandomPrice,
} from '../../utils/factories';
import { PaymentPackFactoryOptions } from '#libs/payment-packs/types';

/**
 * Generates a payment pack category with Faker
 * @returns {PaymentPackCategory}
 */
export const paymentPackCategoryFactory = () => {
  return {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    company_id: parseInt(faker.finance.accountNumber(4), 10),
    category_ordering: faker.number.int(10),
  };
};

/**
 * Generates a list of payment pack category with Faker
 * @param count The number of payment pack category to generate
 * @returns {PaymentPackCategory[]}
 */
export const paymentPackCategoryListFactory = (count: number) => {
  return faker.helpers.multiple(() => paymentPackCategoryFactory, { count });
};

/**
 * Generates off peak schedule object with Faker
 * @returns {Record<string, string[][]>}
 */
const _paymentPackOffPeakScheduleFactory = () => {
  const getRandomSchedule = () =>
    [
      ['08:00', '12:00'],
      ['14:00', '18:00'],
      ['00:00', '23:59'],
    ][faker.number.int(2)];
  return {
    '1': [getRandomSchedule()],
    '2': [getRandomSchedule()],
    '3': [getRandomSchedule()],
    '4': [getRandomSchedule()],
    '5': [getRandomSchedule()],
    '6': [getRandomSchedule()],
    '7': [getRandomSchedule()],
  };
};

/**
 * Generates a payment pack with Faker. You can use the options parameter to alter properties of the returned object
 * @param options The options given to alter properties of generated payment pack
 * @returns {PaymentPack}
 * @example
 * const fakePaymentPack = paymentPackFactory({
 *  isUnlimited: true,
 *  validityDaterange: { upper: '2023-06-30', lower: '2023-05-12' }
 * })
 */
export const paymentPackFactory = (options?: PaymentPackFactoryOptions) => {
  return {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    description: generateRandomDescription(faker),
    price: generateRandomPrice(faker, { min: 5, max: 100 }),
    base_price: generateRandomPrice(faker, { min: 5, max: 100 }),
    tax: faker.number.int(20),
    credits: options?.isUnlimited ? null : faker.number.int(10),
    unlimited: options?.isUnlimited ?? faker.datatype.boolean(),
    nb_consumer_payment_packs: faker.number.int(5),
    max_bookings_per_day: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 1, max: 3 }),
    ]),
    max_bookings_per_week: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 1, max: 6 }),
    ]),
    max_bookings_per_month: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 1, max: 25 }),
    ]),
    max_purchase_per_member: faker.helpers.arrayElement([
      null,
      faker.number.int({ min: 1, max: 5 }),
    ]),
    expiration_days_before_first_use: faker.number.int({ min: 30, max: 60 }),
    theorical_margin_value: faker.number.int(10),
    validity_daterange: options?.validityDaterange ?? null,
    duration_days: options?.validityDaterange ? null : faker.number.int(30),
    duration_months: options?.validityDaterange ? null : faker.number.int(12),
    duration_years: options?.validityDaterange ? null : faker.number.int(2),
    disabled: options?.isDisabled ?? faker.datatype.boolean(),
    start_date_method: faker.number.int(4),
    manager_only: options?.isManagerOnly ?? faker.datatype.boolean(),
    new_member_only: options?.isNewMemberOnly ?? faker.datatype.boolean(),
    company: faker.number.int({ max: 10000 }),
    SCTS: generateRandomIdList(faker, 3),
    metaActivities: generateRandomIdList(faker, 3),
    category: faker.number.int({ max: 1000 }),
    ordering_in_category: faker.number.int(10),
    editable: options?.isEditable ?? faker.datatype.boolean(),
    establishments: generateRandomIdList(faker, 2),
    categories: generateRandomIdList(faker, 5),
    barcode: faker.finance.accountNumber(8),
    onsite_payment_available:
      options?.isOnsitePaymentAvailable ?? faker.datatype.boolean(),
    full_vod_access: faker.datatype.boolean(),
    only_vod_access: faker.datatype.boolean(),
    penalty_active: options?.isPenaltyActive ?? faker.datatype.boolean(),
    penalty_nb_late_cancellations: options?.isPenaltyActive
      ? faker.number.int(10)
      : null,
    penalty_nb_days: options?.isPenaltyActive ? faker.number.int(10) : null,
    penalty_kind: options?.isPenaltyActive ? faker.number.int(1) : null,
    penalty_days_blocked: options?.isPenaltyActive
      ? faker.number.int(10)
      : null,
    penalty_account_value: options?.isPenaltyActive
      ? faker.number.int({ min: 25, max: 50 })
      : null,
    no_show_penalty_active:
      options?.isNoShowPenaltyActive ?? faker.datatype.boolean(),
    no_show_penalty_threshold: options?.isNoShowPenaltyActive
      ? faker.number.int(3)
      : null,
    no_show_penalty_time_window_days: options?.isNoShowPenaltyActive
      ? faker.number.int(7)
      : null,
    no_show_penalty_kind: options?.isNoShowPenaltyActive
      ? faker.number.int(3)
      : null,
    no_show_penalty_days_blocked: options?.isNoShowPenaltyActive
      ? faker.number.int(7)
      : null,
    no_show_penalty_amount: options?.isNoShowPenaltyActive
      ? generateRandomPrice(faker, { min: 5, max: 30 })
      : null,
    start_on_first_user:
      options?.isStartOnFirstUser ?? faker.datatype.boolean(),
    notifications: generateRandomIdList(faker, 2),
    whitelist_tags: generateRandomIdList(faker, 3),
    blacklist_tags: generateRandomIdList(faker, 3),
    template_instance: options?.isTemplate
      ? parseInt(faker.finance.accountNumber(4), 10)
      : null,
    linked_private_pass: parseInt(faker.finance.accountNumber(4), 10),
    allow_guest_pass: options?.isAllowGuestPass ?? faker.datatype.boolean(),
    is_universal_pass: options?.isUniversalPass ?? faker.datatype.boolean(),
    is_usable_by_staff: options?.isUsableByStaff ?? faker.datatype.boolean(),
    applies_for_payroll:
      options?.isAppliesForPayroll ?? faker.datatype.boolean(),
    off_peak_schedule: _paymentPackOffPeakScheduleFactory(),
  };
};

/**
 * Generates a list of payment pack with Faker
 * @param count The number of payment pack to generate
 * @param options The options given to alter properties of generated payment packs
 * @returns {PaymentPack[]}
 */
export const paymentPackListFactory = (
  count: number,
  options?: PaymentPackFactoryOptions,
) => {
  return faker.helpers.multiple(() => paymentPackFactory(options), { count });
};
