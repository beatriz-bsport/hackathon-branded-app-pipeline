import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

import { paymentPackFactory } from '#libs/payment-packs/factory';

import type { ConsumerPaymentPackFactoryOptions } from './types';

/**
 * Generates a consumer payment pack with Faker. You can use the options parameter to alter properties of the returned object
 * @param options The options given to alter properties of generated consumer payment pack
 * @returns {ConsumerPaymentPack}
 * @example
 * const fakeBooking = bookingFactory()
 * const fakeConsumerPaymentPack = consumerPaymentPackFactory({
 *  booking: fakeBooking.id,
 * })
 */
export const consumerPaymentPackFactory = (
  options?: ConsumerPaymentPackFactoryOptions,
) => {
  const paymentPack = paymentPackFactory();
  return {
    id: faker.number.int(10000),
    used_credits: options?.usedCredits || faker.number.int(10),
    available_credits: options?.availableCredits || faker.number.int(10),
    payment_pack_id: options?.paymentPackId || paymentPack.id.toString(),
    bookings: [(options?.bookingId || faker.number.int(10000)).toString()],
    starting_date: options?.startingDate || moment().startOf('month').format(),
    ending_date: options?.endingDate || moment().endOf('month').format(),
    member_id: options?.memberId || faker.number.int(10000),
    bookings_this_week: faker.number.int(10),
    payment_pack: paymentPack,
    disabled: options?.isDisabled || faker.datatype.boolean(),
    reverted: options?.isReverted || faker.datatype.boolean(),
    invoice: faker.string.uuid(),
    src_consumer_payment_pack: options?.srcConsumerPaymentPack || [],
    dst_consumer_payment_pack: options?.dstConsumerPaymentPack || null,
    track_modified_credit: [[1], [2], [3]],
    penalty_disabled_from: options?.penaltyDisabledFrom || null,
    penalty_disabled_until: options?.penaltyDisabledUntil || null,
    consumer_payment_pack_source: faker.number.int(10000),
    linked_private_consumer_pass: options?.linkedPrivateConsumerPass || null,
    consumer: options?.consumer || null,
  };
};

/**
 * Generates a list of consumer payment pack with Faker
 * @param count The number of consumer payment pack to generate
 * @param options The options given to alter properties of generated consumer payment packs
 * @returns {ConsumerPaymentPack[]}
 */
export const consumerPaymentPackListFactory = (
  count: number,
  options?: ConsumerPaymentPackFactoryOptions,
) => {
  return faker.helpers.multiple(() => consumerPaymentPackFactory(options), {
    count,
  });
};
