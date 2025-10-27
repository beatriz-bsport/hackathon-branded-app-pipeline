import type { TFunction } from 'i18next';
import type { ImmutableArray, ImmutableObject } from 'seamless-immutable';
import {
  UPSELL_IDENTIFIER_ACCESS_MONITORING,
  UPSELL_IDENTIFIER_KISI_INTEGRATION,
} from '#src/libs/platform-billing/upsell-identifiers';

import { hasAnyUpsell } from '#src/libs/platform-billing/utils';

import type { RolePermission } from '#src/libs/role/types';
import type { UpsellSumup } from '#src/libs/company/types';
import type {
  Establishment,
  EstablishmentGroupAPI,
} from '#src/libs/establishment/types';
import type { MemberVisitREST, PassCheckResultInclusive } from './types';

/**
 * Checks if a staff member can perform access monitoring based on their permissions and selected establishments.
 * @param featureList - The list of upsell features.
 * @param permissions - The role permissions of the staff member.
 * @param establishmentsSelectedInRole - The establishments selected in the staff member's role.
 * @returns A boolean indicating whether the staff member can perform access monitoring.
 */
export const staffMemberCanPerformAccessMonitoring = (
  featureList: Array<UpsellSumup>,
  permissions: RolePermission,
  establishmentsSelectedInRole: number[],
) => {
  return (
    hasAnyUpsell({ upsell: featureList }, [
      UPSELL_IDENTIFIER_ACCESS_MONITORING,
      UPSELL_IDENTIFIER_KISI_INTEGRATION,
    ]) &&
    permissions?.navigationMenu?.accessMonitoring?.perform &&
    !!establishmentsSelectedInRole?.length
  );
};

/**
 * Computes the different member visit warnings array based on the provided member visit data.
 * These warnings are the sum-up of all the potential unmet criteria encountered during the member visit check.
 * (negative account balance, unpaid invoices etc.)
 *
 * @param memberVisit - The member visit data.
 * @param t - The translation function.
 * @returns An object containing the warnings, the validity of the checked passes, and the number of checked passes.
 */
export const getMemberVisitWarnings = (
  memberVisit: MemberVisitREST,
  t: TFunction,
): {
  warnings: string[];
  checkOnPassesIsValid: boolean;
  numberOfCheckedPasses: number;
} => {
  const {
    check_on_bookings: checkOnBookings,
    check_on_passes: checkOnPasses,
    check_on_member_account: checkOnMemberAccount,
  } = memberVisit?.access_status_data ?? {};

  const {
    has_unpaid_invoices: hasUnpaidInvoices,
    has_negative_account_balance: hasNegativeAccountBalance,
    has_unpaid_appointments: hasUnpaidAppointments,
  } = checkOnMemberAccount ?? {};

  const { bookings_in_other_establishments: bookingsInOtherEstablishments } =
    checkOnBookings ?? {};

  const {
    is_valid: checkOnPassesIsValid,
    number_of_checked_passes: numberOfCheckedPasses,
    most_relevant_pass_data: mostRelevantPassData,
  } = checkOnPasses ?? {};

  const warnings = [];

  if (hasUnpaidInvoices) {
    warnings.push(t('memberVisit.warnings.hasUnpaidInvoices'));
  }

  if (hasNegativeAccountBalance) {
    warnings.push(t('memberVisit.warnings.hasNegativeAccountBalance'));
  }

  if (hasUnpaidAppointments) {
    warnings.push(t('memberVisit.warnings.hasUnpaidAppointments'));
  }

  if (bookingsInOtherEstablishments?.length) {
    warnings.push(
      t('memberVisit.warnings.bookingsInOtherEstablishments', {
        bookingName: bookingsInOtherEstablishments[0].booking_name,
        establishmentName: bookingsInOtherEstablishments[0].establishment_name,
      }),
    );
  }

  if (numberOfCheckedPasses === 0) {
    warnings.push(t('memberVisit.warnings.noPasses'));
  }

  const {
    is_disabled: isDisabled,
    pass_name: passName,
    is_incompatible_with_establishments: isIncompatibleWithEstablishments,
    is_linked_to_paused_subscription: isLinkedToPausedSubscription,
    is_restricted_by_off_peak_schedule: isRestrictedByOffPeakSchedule,
    is_restricted_to_vod: isRestrictedToVod,
    is_incompatible_with_appointments_in_establishments:
      isIncompatibleWithAppointmentsInEstablishments,
  } = (mostRelevantPassData as PassCheckResultInclusive) ?? {};

  if (isDisabled) {
    warnings.push(t('memberVisit.warnings.passIsDisabled', { passName }));
  }

  if (isLinkedToPausedSubscription) {
    warnings.push(
      t('memberVisit.warnings.passLinkedToPausedSubscription', { passName }),
    );
  }

  if (isRestrictedToVod) {
    warnings.push(t('memberVisit.warnings.passRestrictedToVod', { passName }));
  }

  if (isRestrictedByOffPeakSchedule) {
    warnings.push(
      t('memberVisit.warnings.passRestrictedByOffPeakSchedule', {
        passName,
      }),
    );
  }

  if (isIncompatibleWithEstablishments) {
    warnings.push(
      t('memberVisit.warnings.passIncompatibleWithEstablishments', {
        passName,
      }),
    );
  }

  if (isIncompatibleWithAppointmentsInEstablishments) {
    warnings.push(
      t(
        'memberVisit.warnings.passIncompatibleWithAppointmentsInEstablishments',
        { passName },
      ),
    );
  }

  return { warnings, checkOnPassesIsValid, numberOfCheckedPasses };
};

/**
 * Formats the location string based on the provided parameters.
 *
 * @param staffLocationEstablishmentGroup - The establishment group of the staff's location.
 * @param staffLocationAddress - The address of the staff's location.
 * @param establishmentObjects - An array of establishment objects.
 * @returns The formatted location string.
 *
 * @example
 * // Returns "Location Group - Establishment 1, Establishment 2" when
 *  - staffLocationEstablishmentGroup = { name: "Location Group", ... }
 *  - staffLocationAddress = null
 *  - establishmentObjects = [{ title: "Establishment 1", ... }, { title: "Establishment 2", ... }]
 *
 * @example
 * // Returns "Address - Establishment 1, Establishment 2" when
 * - staffLocationEstablishmentGroup = null
 * - staffLocationAddress = "Address"
 * - establishmentObjects = [{ title: "Establishment 1", ... }, { title: "Establishment 2", ... }]
 */
export const formatLocationString = ({
  staffLocationEstablishmentGroup,
  staffLocationAddress,
  establishmentObjects,
}: {
  staffLocationEstablishmentGroup: ImmutableObject<EstablishmentGroupAPI>;
  staffLocationAddress: string;
  establishmentObjects: ImmutableArray<Establishment>;
}) =>
  [
    `${staffLocationEstablishmentGroup?.name ?? staffLocationAddress ?? ''}`,
    establishmentObjects
      ?.map((establishment) => establishment.title)
      ?.join(', '),
  ].join(' - ');

/**
 * Returns the URL for performing access monitoring with optional query parameters.
 *
 * @param params - Optional query parameters as key-value pairs.
 * @returns The access monitoring URL with the specified query parameters.
 */
export const getPerformAccessMonitoringUrl = (params?: {
  [key: string]: any;
}) => {
  return `/access-monitoring/perform${
    params ? `?${new URLSearchParams(params)}` : ''
  }`;
};
