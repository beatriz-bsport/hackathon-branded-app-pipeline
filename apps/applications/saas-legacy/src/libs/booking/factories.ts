import { fakerEN as faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_LOCKED,
} from '@bsport/common/lib/master-data/bookable-status.js';
import { BOOKING_SOURCE_SAAS } from '@bsport/common/lib/master-data/booking_source.js';

import { consumerPaymentPackFactory } from '#src/libs/consumer-payment-pack/factories';
import { establishment_factory } from '#src/libs/establishment/factory';
import { coachFactory } from '#src/libs/associated-coach/factories';
import { meta_activity_factory } from '#src/libs/meta-activity/factory';
import { levelFactory } from '#src/libs/level/factories';
import { offerFactory } from '#src/libs/offer/factories';

import type { Booking } from '#src/libs/booking/types';

import {
  PRIVATE_BOOKING_CANCELLED_BY_STAFF,
  PRIVATE_BOOKING_COACH_MODIFIED_BY_STAFF,
  PRIVATE_BOOKING_DATE_TIME_MODIFIED_BY_STAFF,
  PRIVATE_BOOKING_RESTORED_BY_STAFF,
  RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
} from '#src/libs/private-service/components/constants';

const ETABLISHMENT = establishment_factory(1)[0];
const COACH = coachFactory();
const META_ACTIVITY = meta_activity_factory(1)[0];
const LEVEL = levelFactory();
const OFFER = offerFactory({});
const CONSUMER_PAYMENT_PACK = consumerPaymentPackFactory();

const BOOKING_DATE = DateTime.now().minus({ week: 2 }).toISO();
const BOOKING_CANCELED_DATE = DateTime.now().minus({ day: 3 }).toISO();
const RECENT_DATE = DateTime.now().minus({ hour: 6 }).toISO();
const ALL_BOOKING_STATUS = [
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_LOCKED,
];
const ALL_STAFF_HISTORY_ACTIONS = [
  PRIVATE_BOOKING_CANCELLED_BY_STAFF,
  PRIVATE_BOOKING_DATE_TIME_MODIFIED_BY_STAFF,
  PRIVATE_BOOKING_COACH_MODIFIED_BY_STAFF,
  PRIVATE_BOOKING_RESTORED_BY_STAFF,
  RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
];

export function BookingFactory(memberId: number): Booking {
  const bookingId = faker.number.int(10000);
  return {
    attendance: faker.datatype.boolean(),
    attendance_date_updated: faker.date.recent().toString(),
    booking_status_code: 0,
    // @ts-expect-error
    consumer_payment_pack: consumerPaymentPackFactory({ bookingId }),
    date: BOOKING_DATE,
    date_canceled: BOOKING_CANCELED_DATE,
    // @ts-expect-error
    first_in_company: faker.datatype.boolean(),
    id: bookingId,
    staff_history: [],
    member: memberId,
  };
}

export function BookingListFactory(
  length: number,
  idList: number[],
): Array<Booking> {
  const res = new Array(length).fill(0);
  return res.map((_, i) => BookingFactory(idList[i]));
}

/**
 * Generates a consumer booking with Faker
 * @returns {StaffModificationHistory<BookingModificationActionIdentifier>}
 */
const _staffHistoryFactory = () => {
  return {
    action_identifier: faker.helpers.arrayElement(ALL_STAFF_HISTORY_ACTIONS),
    staff_id: faker.number.int(10000),
    timestamp: DateTime.fromISO(BOOKING_DATE).toUnixInteger(),
  };
};

/**
 * Generates a list of consumer booking with Faker
 * @param count The number of consumer booking to generate
 * @returns {StaffModificationHistory<BookingModificationActionIdentifier>[]}
 */
const _staffHistoryListFactory = (count: number) => {
  return faker.helpers.multiple(() => _staffHistoryFactory(), { count });
};

/**
 * Generates a consumer booking with Faker
 * @returns {ConsumerBooking}
 */
export const consumerBookingFactory = () => {
  return {
    attendance: faker.datatype.boolean(),
    attendance_date_updated: RECENT_DATE,
    booking_status_code: faker.helpers.arrayElement(ALL_BOOKING_STATUS),
    coach: COACH,
    coach_override: faker.helpers.arrayElement([COACH, null]),
    consumer: faker.number.int(10000),
    consumer_payment_pack: CONSUMER_PAYMENT_PACK,
    credit_consumed: faker.number.int({ min: 1, max: 5 }),
    custom_level: faker.number.int(10000),
    date: BOOKING_DATE,
    date_canceled: faker.helpers.arrayElement([BOOKING_CANCELED_DATE, null]),
    date_no_show_registered: faker.helpers.arrayElement([RECENT_DATE, null]),
    date_roll_call_last_modified: faker.helpers.arrayElement([
      RECENT_DATE,
      null,
    ]),
    establishment: ETABLISHMENT,
    first_in_company: faker.datatype.boolean(),
    has_spivi_error: faker.datatype.boolean(),
    id: parseInt(faker.finance.accountNumber(4), 10),
    is_deleted: faker.datatype.boolean(),
    is_discardable: faker.datatype.boolean(),
    is_no_show: faker.datatype.boolean(),
    level: LEVEL,
    member: faker.number.int(10000),
    meta_activity: META_ACTIVITY,
    name: META_ACTIVITY.name,
    no_show_penalty_applied: faker.datatype.boolean(),
    offer: faker.number.int(10000),
    offer_date_start: OFFER.date_start,
    offer_duration_minute: OFFER.duration_minute,
    recurrence_rule_booking: faker.helpers.arrayElement([
      faker.number.int(10000),
      null,
    ]),
    roll_call_attendance: faker.helpers.arrayElement([
      faker.number.int(10000),
      null,
    ]),
    roll_call_attendance_date_updated: faker.helpers.arrayElement([
      RECENT_DATE,
      null,
    ]),
    roll_call_needs_validation: faker.datatype.boolean(),
    source: BOOKING_SOURCE_SAAS.id,
    source_member: faker.helpers.arrayElement([faker.number.int(10000), null]),
    spot_id: faker.helpers.arrayElement([
      faker.number.int({ min: 1, max: 20 }),
      null,
    ]),
    spot_information: {},
    staff_history: _staffHistoryListFactory(2),
    was_refunded: faker.datatype.boolean(),
  };
};

/**
 * Generates a list of consumer booking with Faker
 * @param count The number of consumer booking to generate
 * @returns {ConsumerBooking[]}
 */
export const consumerBookingListFactory = (count: number) => {
  return faker.helpers.multiple(() => consumerBookingFactory(), { count });
};
