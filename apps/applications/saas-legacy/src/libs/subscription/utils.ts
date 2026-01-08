import { Dispatch, SetStateAction } from 'react';
import { DateTime, Duration, DurationLikeObject } from 'luxon';
import type {
  SubscriptionInterval,
  SubscriptionPause,
  ContractTemplate,
  ContractTemplateFormValues,
  ContractTemplatePayload,
  SubscriptionREST,
  CommitmentPeriodDisplayReturnedValues,
} from './types';
import {
  PassType,
  SubscriptionInvoicingType,
} from '#src/libs/subscription/enums';
import type { FranchiseUserBillingPlanPause } from '#src/libs/franchise/types';
import { TFunction } from 'i18next';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type { PaymentPackTemplate } from '#src/libs/payment-packs/types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';
import { SubscriptionStatusEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';

export function isPaused(
  pausesArray?: (SubscriptionPause | FranchiseUserBillingPlanPause)[],
) {
  if (!pausesArray?.length) return false;
  return pausesArray.reduce(
    (acc, p) =>
      acc ||
      (DateTime.now() >= DateTime.fromISO(p.from_date).startOf('day') &&
        DateTime.now() <= DateTime.fromISO(p.until_date).endOf('day')),
    false,
  );
}

export const computeProrataPriceForSubscription = (
  first_BillingDate: string,
  monthBillingDay: number,
  recurrentPrice: string,
): string => {
  const reccurentPriceFloat = parseFloat(recurrentPrice);
  const firstBillingDate = first_BillingDate
    ? DateTime.fromISO(first_BillingDate)
    : DateTime.now();
  const secondBillingDate = getNextBillingDate(
    firstBillingDate,
    monthBillingDay,
  );
  const daysLeft = Math.abs(
    parseInt(
      firstBillingDate.diff(secondBillingDate, 'days').as('days').toString(),
    ),
  );

  if (daysLeft === 0) {
    return reccurentPriceFloat.toFixed(2);
  }

  const pricePerDay = reccurentPriceFloat / firstBillingDate.daysInMonth;
  return (pricePerDay * daysLeft).toFixed(2);
};

function getNextBillingDate(
  currentDate: DateTime,
  monthBillingDay: number,
): DateTime {
  // Determine the effective billing day to avoid exceeding the max day of the month (28/29/30/31).
  const effectiveBillingDay = Math.min(
    monthBillingDay,
    currentDate.daysInMonth,
  );

  if (currentDate.day === effectiveBillingDay) {
    return currentDate;
  }

  // Clone the currentDate to avoid updating the original currentDate as it is passed by reference.
  let nextBillingDate = currentDate.set({ day: effectiveBillingDay });
  if (nextBillingDate.startOf('day') <= currentDate.startOf('day')) {
    nextBillingDate = nextBillingDate.plus({ months: 1 });
    nextBillingDate = nextBillingDate.set({
      day: Math.min(effectiveBillingDay, nextBillingDate.daysInMonth),
    });
  }
  return nextBillingDate;
}

export const initializeContractTemplateFormValues = (
  contractTemplate: ContractTemplate | null,
  setDrawerInitialValues: Dispatch<SetStateAction<ContractTemplateFormValues>>,
) => {
  if (!contractTemplate) return;

  const initialValues = {
    id: contractTemplate.id,
    name: contractTemplate.name,
    description: contractTemplate.description,
    productType: contractTemplate.private_pass_template
      ? PassType.APPOINTMENT_PASSES
      : PassType.PASSES,
    privatePassTemplate: contractTemplate.private_pass_template,
    paymentPackTemplate: contractTemplate.payment_pack_template,
    contract: contractTemplate.contract,
    recurrentPrice: contractTemplate.recurrent_price,
    recurrenceBasis: contractTemplate.recurrence_basis,
    flatFee: contractTemplate.flat_fee,
    invoicingType: contractTemplate.month_billing_day
      ? SubscriptionInvoicingType.FIXED_DAY
      : SubscriptionInvoicingType.SAME_DAY_AS_SUBSCRIPTION,
    interval: contractTemplate.interval,
    numberOfIntervals: contractTemplate.nb_interval,
    monthBillingDay: contractTemplate.month_billing_day,
    managerOnly: contractTemplate.manager_only,
    autoRenewal: contractTemplate.auto_renewal,
    unusableByStaff: !contractTemplate.is_usable_by_staff,
    editable: contractTemplate?.editable,
    has_mandatory_commitment_period:
      !!contractTemplate?.has_mandatory_commitment_period,
    commitment_period_value: contractTemplate?.commitment_period_value ?? 1,
    commitment_period_unit: contractTemplate?.commitment_period_unit ?? 'month',
  };

  setDrawerInitialValues(initialValues);
};

export const mapContractTemplateFormValuesToApi = (
  contractTemplate: ContractTemplateFormValues,
): ContractTemplatePayload => {
  return {
    id: contractTemplate.id,
    name: contractTemplate.name,
    description: contractTemplate.description,
    private_pass_template: contractTemplate.privatePassTemplate,
    payment_pack_template: contractTemplate.paymentPackTemplate,
    contract: contractTemplate.contract,
    recurrent_price: contractTemplate.recurrentPrice,
    recurrence_basis: contractTemplate.recurrenceBasis,
    flat_fee: contractTemplate.flatFee,
    month_billing_day:
      contractTemplate.invoicingType === SubscriptionInvoicingType.FIXED_DAY
        ? contractTemplate.monthBillingDay
        : null,
    interval: contractTemplate.interval,
    nb_interval: contractTemplate.numberOfIntervals,
    manager_only: contractTemplate.managerOnly,
    auto_renewal: contractTemplate.autoRenewal,
    is_usable_by_staff: !contractTemplate.unusableByStaff,
    has_mandatory_commitment_period:
      !!contractTemplate?.has_mandatory_commitment_period,
    commitment_period_value: contractTemplate?.commitment_period_value,
    commitment_period_unit: contractTemplate?.commitment_period_unit,
  };
};

export const getAssociatedPassValidityInfo = (
  passTemplate: PaymentPackTemplate | PrivatePassTemplate,
  t: TFunction,
) => {
  let durationObject = {} as DurationLikeObject;

  // Conditionally add fields
  if (passTemplate.duration_years) {
    durationObject.years = passTemplate.duration_years;
  }
  if (passTemplate.duration_months) {
    durationObject.months = passTemplate.duration_months;
  }
  if (passTemplate.duration_days) {
    durationObject.days = passTemplate.duration_days;
  }

  const validityDuration = Duration.fromObject(durationObject);

  return `${t(
    'subscription:franchiseUserProfile.associatedPassValidity',
  )} ${validityDuration.toHuman()}`;
};

export const getSubscriptionPriceAndRecurrence = (
  interval: SubscriptionInterval,
  nbInterval: number,
  recurrenceBasis: number,
  price: string,
  t: TFunction,
) =>
  `${getCurrencyDisplayWithPrice(price)} - ${t(
    `subscription:contract.durationInfo.${interval}`,
    {
      count: recurrenceBasis * nbInterval,
    },
  )}`;

/**
 * Determine the commitment period section displayed information from the subscription selected.
 *
 * @param {SubscriptionREST} subscription The subscription to check
 * @param {boolean} [displayStopSubscriptionFromMemberSide] Optional boolean to indicate if the stop subscription from the member side is enabled for the requested company
 *
 * @returns An object containing the following information:
 * - isCommitmentPeriodSectionHidden: A boolean indicating if the commitment period section should be hidden
 * - shouldDisplayCommitmentPeriodAlert: A boolean indicating if the alert should be displayed
 * - shouldDisplayCommitmentPeriodSubtitle: A boolean indicating if the subtitle should be displayed
 * - isMemberCancellationAllowed: A boolean indicating if the member can cancel the subscription
 *
 * @example
 * const subscription = {
 *  has_mandatory_commitment_period: true,
 * commitment_period_unit: 'month',
 * commitment_period_value: 1,
 * status: 'started',
 * is_member_cancellation_allowed: false,
 * };
 * ReturnType {
 * isCommitmentPeriodSectionHidden: false,
 * shouldDisplayCommitmentPeriodAlert: true,
 * shouldDisplayCommitmentPeriodSubtitle: false,
 * isMemberCancellationAllowed: false,
 * }
 *
 */
export const getCommitmentPeriodDisplay = (
  subscription: SubscriptionREST,
  displayStopSubscriptionFromMemberSide?: boolean,
): CommitmentPeriodDisplayReturnedValues => {
  if (!subscription) {
    return {
      isCommitmentPeriodSectionHidden: true,
      shouldDisplayCommitmentPeriodAlert: false,
      shouldDisplayCommitmentPeriodSubtitle: false,
      isMemberCancellationAllowed: false,
    };
  }

  const {
    status,
    has_mandatory_commitment_period,
    commitment_period_unit,
    commitment_period_value,
    is_within_commitment_period,
    is_member_cancellation_allowed,
    auto_renewal,
    forecasted_expiration_date,
  } = subscription;

  const isSubscriptionStatusAllowingStop =
    status === SubscriptionStatusEnum.PAUSED ||
    status === SubscriptionStatusEnum.STARTED ||
    status === SubscriptionStatusEnum.NOT_STARTED ||
    status === SubscriptionStatusEnum.ENDED;

  const isCommitmentConfigurationNotValid =
    has_mandatory_commitment_period &&
    (!commitment_period_unit || !commitment_period_value);

  /**
   * The commitment period section should be hidden when:
   * - The subscription has no commitment period or no commitment value set whereas has_mandatory_commitment_period is True
   * - The subscription is stopped
   */
  const isCommitmentPeriodSectionHidden =
    isCommitmentConfigurationNotValid ||
    !isSubscriptionStatusAllowingStop ||
    !displayStopSubscriptionFromMemberSide;

  /**
   * It is the last billing cycle when:
   * - The subscription has no auto-renewal
   * - The subscription has no forecasted expiration date, meaning, there is no next payment planned
   */
  const isLastBillingCycle = !auto_renewal && !forecasted_expiration_date;

  return {
    isCommitmentPeriodSectionHidden: isCommitmentPeriodSectionHidden,
    /**
     * The alert should be displayed when:
     * - The subscription has a valid commitment period configuration
     * - The subscription has a required commitment period
     * - The member can't cancel the subscription at the moment, meaning before the end of the commitment period
     */
    shouldDisplayCommitmentPeriodAlert:
      !isCommitmentPeriodSectionHidden &&
      has_mandatory_commitment_period &&
      is_within_commitment_period &&
      !is_member_cancellation_allowed,
    /**
     * The subtitle should be displayed when:
     * - The subscription has a valid commitment period configuration
     * - The member can't stop the subscription
     * - The commitment period is past or there is no commitment period required
     * - It is the last billing cycle
     * -> The subscription is about to end with no next payment, meaning the last validity period -> Last case in which the member can't stop the subscription
     */
    shouldDisplayCommitmentPeriodSubtitle:
      !isCommitmentPeriodSectionHidden &&
      !is_member_cancellation_allowed &&
      !is_within_commitment_period &&
      isLastBillingCycle,
    isMemberCancellationAllowed: is_member_cancellation_allowed,
  };
};
