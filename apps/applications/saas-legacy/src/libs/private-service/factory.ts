import { fakerEN as faker } from '@faker-js/faker';

import { CB } from '@bsport/common/master-data/payment-methods.js';

import { coachesFactory } from '#src/libs/associated-coach/factories';

import type {
  PrivateSlot,
  PrivateService,
  PrivatePassFactoryOptions,
  PrivateServiceFactoryOptions,
} from '#src/libs/private-service/types';
import type { Coach } from '#src/libs/associated-coach/types';
import {
  generateRandomDescription,
  generateRandomIdList,
  generateRandomName,
  generateRandomPrice,
} from '../../utils/factories';

/**
 * Generates a private slot with Faker.
 * @returns {PrivateSlot}
 */
export const privateSlotFactory = () => {
  return {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    private_service: parseInt(faker.finance.accountNumber(4), 10),
    available: faker.datatype.boolean(),
    credit: faker.number.int(10),
    duration_minutes: faker.number.int({ min: 30, max: 120 }),
    people_capacity_used: faker.number.int(5),
    booking_interval_minutes: faker.helpers.arrayElement([5, 10, 15, 20]),
  };
};

/**
 * Generates a list of private slot with Faker
 * @param count The number of private slot to generate
 * @returns {PrivateSlot[]}
 */
export const privateSlotListFactory = (count: number) => {
  return faker.helpers.multiple(() => privateSlotFactory(), { count });
};

/**
 * Generates a private service with Faker.
 * @param options Parameters that transform property IDs into faker objects
 * @returns {PrivateService}
 * @example
 * const privateServiceWithSlots = privateServiceFactory({ withSlots });
 */
export const privateServiceFactory = (
  options?: PrivateServiceFactoryOptions,
) => {
  const privateService: PrivateService<
    number | Partial<Coach>,
    number,
    number | PrivateSlot
  > = {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    description: generateRandomDescription(faker),
    available: faker.datatype.boolean(),
    establishments: generateRandomIdList(faker, 3),
    coach_capacity_used: faker.number.int(5),
    use_full_establishment_capacity: faker.datatype.boolean(),
    coaches: generateRandomIdList(faker, 3),
    color: faker.internet.color(),
    company: faker.number.int({ max: 10000 }),
    slots: generateRandomIdList(faker, 5),
    establishment_attribution: faker.number.int(4),
    is_home_service: faker.datatype.boolean(),
    coach_attribution: faker.number.int(4),
    manager_only: faker.datatype.boolean(),
    has_own_availability_slots: faker.datatype.boolean(),
    last_discard_minutes: faker.helpers.arrayElement([5, 10, 15]),
    last_booking_minutes: faker.helpers.arrayElement([5, 10, 15]),
    cover_main: faker.image.url({ width: 800, height: 400 }),
    private_service_group: parseInt(faker.finance.accountNumber(4), 10),
    slots_duration_minute: [60, 90, 120],
    availability_padding_start_minutes: faker.helpers.arrayElement([5, 10, 15]),
    availability_padding_end_minutes: faker.helpers.arrayElement([5, 10, 15]),
    pad_before_stop: faker.datatype.boolean(),
    available_on_partnership: faker.datatype.boolean(),
    member_whitelist_tags: [],
    member_blacklist_tags: [],
  };

  if (options?.withSlots) {
    privateService.slots = privateSlotListFactory(3);
  }

  if (options?.withCoaches) {
    privateService.coaches = coachesFactory(3);
  }

  return privateService;
};

/**
 * Generates a list of private service with Faker
 * @param count The number of private service to generate
 * @param options Parameters that transform property IDs into faker objects
 * @returns {PrivateService[]}
 */
export const privateServiceListFactory = (
  count: number,
  options?: PrivateServiceFactoryOptions,
) => {
  return faker.helpers.multiple(() => privateServiceFactory(options), {
    count,
  });
};

/**
 * Generates a private service group with Faker
 * @returns {PrivateServiceGroup}
 */
export const privateServiceGroupFactory = () => {
  return {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    private_services: generateRandomIdList(faker, 5),
  };
};

/**
 * Generates a list of private service group with Faker
 * @param count The number of private service group to generate
 * @returns {PrivateServiceGroup[]}
 */
export const privateServiceGroupListFactory = (count: number) => {
  return faker.helpers.multiple(() => privateServiceGroupFactory(), {
    count,
  });
};

/**
 * Generates a private pass with Faker. You can use the options parameter to alter properties of the returned object
 * @param options The options given to alter properties of generated private pass
 * @returns {PrivatePass}
 * @example
 * const fakePrivatePass = privatePassFactory({
 *  is_unpaid_private_booking_integration: true,
 *  new_member_only: false
 * })
 */
export const privatePassFactory = (options?: PrivatePassFactoryOptions) => {
  return {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    credits: faker.number.int(10),
    price: generateRandomPrice(faker, { min: 5, max: 100 }),
    tax: faker.number.int(20),
    private_services: generateRandomIdList(faker, 3),
    manager_only: options?.isManagerOnly ?? faker.datatype.boolean(),
    available: options?.isAvailable ?? faker.datatype.boolean(),
    duration_days: faker.number.int(30),
    duration_months: faker.number.int(12),
    duration_years: faker.number.int(2),
    available_payment_method_identifiers: [CB.id],
    full_vod_access: faker.datatype.boolean(),
    editable: options?.isEditable ?? faker.datatype.boolean(),
    expiration_days_before_first_use: faker.number.int({ min: 30, max: 60 }),
    start_date_method: faker.number.int(4),
    new_member_only: options?.isNewMemberOnly ?? faker.datatype.boolean(),
    company: parseInt(faker.finance.accountNumber(4), 10),
    category: parseInt(faker.finance.accountNumber(3), 10),
    ordering_in_category: faker.number.int(10),
    template_instance: options?.isGenerateTemplateInstance
      ? parseInt(faker.finance.accountNumber(4), 10)
      : null,
    is_unpaid_private_booking_integration:
      options?.isUnpaidPrivateBookingIntegration ?? faker.datatype.boolean(),
    linked_payment_pack: parseInt(faker.finance.accountNumber(4), 10),
    description: faker.lorem.sentence(100),
    is_usable_by_staff: options?.isUsableByStaff ?? faker.datatype.boolean(),
    applies_for_payroll:
      options?.isAppliesForPayroll ?? faker.datatype.boolean(),
    on_behalf_of_teacher:
      options?.isOnBehalfOfTeacher ?? faker.datatype.boolean(),
  };
};

/**
 * Generates a list of private pass with Faker
 * @param count The number of private pass to generate
 * @returns {PrivatePass[]}
 */
export const privatePassListFactory = (
  count: number,
  options?: PrivatePassFactoryOptions,
) => {
  return faker.helpers.multiple(() => privatePassFactory(options), {
    count,
  });
};

/**
 * Generates a private pass category with Faker
 * @returns {PrivatePassCategory}
 */
export const privatePassCategoryFactory = () => {
  return {
    id: parseInt(faker.finance.accountNumber(4), 10),
    name: generateRandomName(faker),
    company_id: parseInt(faker.finance.accountNumber(4), 10),
    category_ordering: faker.number.int(10),
  };
};

/**
 * Generates a list of private pass category with Faker
 * @param count The number of private pass category to generate
 * @returns {PrivatePassCategory[]}
 */
export const privatePassCategoryListFactory = (count: number) => {
  return faker.helpers.multiple(() => privatePassCategoryFactory(), {
    count,
  });
};
