// @ts-expect-error
import FactoryBot from 'ya-factorybot';
import { fakerEN as faker } from '@faker-js/faker';
import MemberMinimalFactoryBot from '#libs/member/factories/MemberMinimal';

import { generateRandomName } from '#utils/factories';
import { AccessStatus, EntryStatus } from './constants';

/**
 * Generate an array of random numbers, of random length.
 *
 * @param options.minLength - Minimum length of the array
 * @param options.maxLength - Maximum length of the array
 * @param options.min - Minimum value of the random number
 * @param options.max - Maximum value of the random number
 * @returns Array of random numbers
 */
function generateRandomNumberArray({
  minLength,
  maxLength,
  min,
  max,
}: {
  minLength: number;
  maxLength: number;
  min: number;
  max: number;
}) {
  const arrayLength = faker.number.int({ min: minLength, max: maxLength });
  const randomNumberArray = [];
  for (let i = 0; i < arrayLength; i += 1) {
    const randomNumber = faker.number.int({ min, max });
    randomNumberArray.push(randomNumber);
  }

  return randomNumberArray;
}

// TODO: Refactor this function using the faker library for all boolean params
/**
 * Util function to generate fake (but deterministic) access status data.
 *
 * @see (bsport-django) access_control.factories.MemberVisitFactory.generate_fake_access_status_data
 *
 * This function was taken and adapted from the backend
 */
export function generateFakeAccessStatusData({
  numberOfBookingsInOtherEstablishments = 0,
  withMostRelevantBooking = false,
  withMostRelevantPrivateBooking = false,
  hasNegativeAccountBalance = false,
  hasUnpaidAppointments = false,
  hasUnpaidInvoices = false,
  withMostRelevantConsumerPaymentPack = false,
  withMostRelevantPrivateConsumerPass = false,
  numberOfCheckedPasses = 0,
  passIsDisabled = false,
  passIsIncompatibleWithAppointmentsInEstablishments = false,
  passIsIncompatibleWithEstablishments = false,
  passIsLinkedToPausedSubscription = false,
  passIsRestrictedByOffPeakSchedule = false,
  passIsRestrictedToVod = false,
  passIsValid = true,
  checkOnPassesIsValid = false,
  checkOnBookingsIsValid = false,
  checkOnMemberAccountIsValid = true,
}: {
  numberOfBookingsInOtherEstablishments?: number;
  withMostRelevantBooking?: boolean;
  withMostRelevantPrivateBooking?: boolean;
  hasNegativeAccountBalance?: boolean;
  hasUnpaidAppointments?: boolean;
  hasUnpaidInvoices?: boolean;
  withMostRelevantConsumerPaymentPack?: boolean;
  withMostRelevantPrivateConsumerPass?: boolean;
  numberOfCheckedPasses?: number;
  passIsDisabled?: boolean;
  passIsIncompatibleWithAppointmentsInEstablishments?: boolean;
  passIsIncompatibleWithEstablishments?: boolean;
  passIsLinkedToPausedSubscription?: boolean;
  passIsRestrictedByOffPeakSchedule?: boolean;
  passIsRestrictedToVod?: boolean;
  passIsValid?: boolean;
  checkOnPassesIsValid?: boolean;
  checkOnBookingsIsValid?: boolean;
  checkOnMemberAccountIsValid?: boolean;
}) {
  let mostRelevantPassData = null;

  if (
    !!withMostRelevantConsumerPaymentPack &&
    !!withMostRelevantPrivateConsumerPass
  ) {
    throw new Error(
      "You can't have both a payment pack and a private pass as most relevant data.",
    );
  }

  let _numberOfCheckedPasses = numberOfCheckedPasses;

  if (
    checkOnPassesIsValid &&
    !withMostRelevantConsumerPaymentPack &&
    !withMostRelevantPrivateConsumerPass &&
    numberOfCheckedPasses === 0
  ) {
    _numberOfCheckedPasses = 1;
  }

  if (withMostRelevantConsumerPaymentPack) {
    const name = generateRandomName(faker);
    const expirationDate = faker.date.future().toISOString();
    mostRelevantPassData = {
      is_disabled: passIsDisabled,
      is_incompatible_with_establishments: passIsIncompatibleWithEstablishments,
      is_linked_to_paused_subscription: passIsLinkedToPausedSubscription,
      is_restricted_by_off_peak_schedule: passIsRestrictedByOffPeakSchedule,
      is_restricted_to_vod: passIsRestrictedToVod,
      is_valid: passIsValid,
      pass_name: name,
      expiration_date: expirationDate,
      pass_type: 'payment_pack',
    };
  } else if (withMostRelevantPrivateConsumerPass) {
    const name = generateRandomName(faker);
    const expirationDate = faker.date.future().toISOString();
    mostRelevantPassData = {
      is_disabled: passIsDisabled,
      is_incompatible_with_appointments_in_establishments:
        passIsIncompatibleWithAppointmentsInEstablishments,
      is_linked_to_paused_subscription: passIsLinkedToPausedSubscription,
      is_valid: passIsValid,
      pass_name: name,
      expiration_date: expirationDate,
      pass_type: 'private_pass',
    };
  }

  let mostRelevantBookingData = null;
  if (checkOnBookingsIsValid) {
    if (withMostRelevantBooking || withMostRelevantPrivateBooking) {
      mostRelevantBookingData = {
        booking_name: generateRandomName(faker),
      };
    }
  }

  const accessStatusData = {
    check_on_bookings: {
      bookings_in_other_establishments: Array.from({
        length: numberOfBookingsInOtherEstablishments,
      }).map(() => ({
        booking_name: generateRandomName(faker),
        establishment_name: generateRandomName(faker),
      })),
      most_relevant_booking_data: mostRelevantBookingData,
      is_valid: checkOnBookingsIsValid,
    },
    check_on_member_account: {
      has_negative_account_balance: hasNegativeAccountBalance,
      has_unpaid_appointments: hasUnpaidAppointments,
      has_unpaid_invoices: hasUnpaidInvoices,
      is_valid: checkOnMemberAccountIsValid,
    },
    check_on_passes: {
      is_valid: checkOnPassesIsValid,
      most_relevant_pass_data: mostRelevantPassData,
      number_of_checked_passes: _numberOfCheckedPasses,
    },
  };

  return accessStatusData;
}

FactoryBot.define('MemberVisitREST', {
  access_status: faker.helpers.enumValue(AccessStatus),
  datetime_created: faker.date.recent().toISOString(),
  entry_status: faker.helpers.enumValue(EntryStatus),
  establishments: generateRandomNumberArray({
    max: 100,
    maxLength: 5,
    min: 1,
    minLength: 1,
  }),
  id: FactoryBot.sequence(),
  initial_access_status: faker.helpers.enumValue(AccessStatus),
  last_update: faker.date.recent().toISOString(),
  member: MemberMinimalFactoryBot.MemberMinimal.create(1),
  staff_user: faker.number.int(1000),
  access_status_data: generateFakeAccessStatusData({}),
});

export default FactoryBot;
