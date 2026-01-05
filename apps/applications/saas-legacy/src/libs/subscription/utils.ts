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
  ContractWithPaymentPack,
  ContractPayload,
} from './types';
import {
  PassType,
  SubscriptionInvoicingType,
} from '#src/libs/subscription/enums';
import type { FranchiseUserBillingPlanPause } from '#src/libs/franchise/types';
import { TFunction } from 'i18next';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type {
  PaymentPack,
  PaymentPackTemplate,
} from '#src/libs/payment-packs/types';
import type {
  PrivatePass,
  PrivatePassTemplate,
} from '#src/libs/private-service/types';
import { SubscriptionStatusEnum } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/constants';
import {
  CREDIT_NUMBER_OPTION,
  FormValues,
  InvoicingType,
  ObjectType,
} from '#src/libs/subscription/components/contract/contract-revamp/types';
import { emptyPaymentPackDetailsForms } from './components/contract/contract-revamp/constants';
import { PaymentCombo } from '../payment-combo/types';
import {
  formatOffPeakScheduleOnEdit,
  formatOffPeakScheduleOnSubmit,
} from '../payment-packs/utils';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '#src/libs/payment-packs/constants';
import { penaltyKindDict } from '../payment-packs/components/PaymentPackForm/PaymentPackForm.component';
import { ImmutableArray } from 'seamless-immutable';
import { getObjectTypeFromContract } from './components/contract/contract-revamp/utils';

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

export const contractToFormValues = (
  contract: ContractWithPaymentPack<PrivatePass, PaymentCombo>,
  paymentPackList: ImmutableArray<PaymentPack>,
  privatePassList: PrivatePass[],
): FormValues => {
  const paymentPack = paymentPackList?.find(
    (pp) => pp?.id === contract?.payment_pack?.id,
  );
  const privatePass = privatePassList?.find(
    (pp) => pp?.id === contract?.private_pass?.id,
  );
  const objectType = getObjectTypeFromContract(contract);
  return {
    ...contract,
    invoicing_type: contract.month_billing_day
      ? InvoicingType.FIXED_DAY
      : InvoicingType.SAME_DAY_AS_SUBSCRIPTION,
    tax:
      objectType === ObjectType.PAYMENT_PACK
        ? paymentPack?.tax ?? 0
        : privatePass?.tax ?? 0,
    object_type: objectType,

    payment_pack_details:
      objectType === ObjectType.PAYMENT_PACK
        ? {
            credits: paymentPack?.credits || undefined,
            theorical_margin_value: paymentPack?.theorical_margin_value || 0,
            bookkeeping_account: paymentPack?.bookkeeping_account || null,
            categories: paymentPack?.categories || [],
            metaActivities: paymentPack?.metaActivities || [],
            establishments: paymentPack?.establishments || [],
            max_bookings_per_day: paymentPack?.max_bookings_per_day || null,
            max_bookings_per_week: paymentPack?.max_bookings_per_week || null,
            max_bookings_per_month: paymentPack?.max_bookings_per_month || null,
            max_purchase_per_member:
              paymentPack?.max_purchase_per_member || null,
            full_vod_access: paymentPack?.full_vod_access || false,
            only_vod_access: paymentPack?.only_vod_access || false,
            allow_guest_pass: paymentPack?.allow_guest_pass || false,
            applies_for_payroll: paymentPack?.applies_for_payroll || false,
            grants_door_access: paymentPack?.grants_door_access || false,
            expiration_days_before_first_use:
              paymentPack?.expiration_days_before_first_use || 0,
            expiration_date_active: !!paymentPack?.expiration_date,
            expiration_date: !!paymentPack?.expiration_date
              ? DateTime.fromISO(paymentPack?.expiration_date)
              : null,
            onsite_payment_available:
              paymentPack?.onsite_payment_available || false,
            penalty_active: paymentPack?.penalty_active || false,
            penalty_nb_late_cancellations:
              paymentPack?.penalty_nb_late_cancellations || 3,
            penalty_nb_days: paymentPack?.penalty_nb_days || 7,
            penalty_kind: !!paymentPack?.penalty_kind
              ? penaltyKindDict[paymentPack?.penalty_kind]
              : 'block',
            penalty_days_blocked: paymentPack?.penalty_days_blocked || 7,
            penalty_account_value: paymentPack?.penalty_account_value || 10,
            no_show_penalty_active:
              paymentPack?.no_show_penalty_active || false,
            no_show_penalty_threshold:
              paymentPack?.no_show_penalty_threshold || 3,
            no_show_penalty_time_window_days:
              paymentPack?.no_show_penalty_time_window_days || 7,
            no_show_penalty_kind: !!paymentPack?.no_show_penalty_kind
              ? penaltyKindDict[paymentPack?.no_show_penalty_kind]
              : 'block',
            no_show_penalty_days_blocked:
              paymentPack?.no_show_penalty_days_blocked || 7,
            no_show_penalty_amount: paymentPack?.no_show_penalty_amount || 10,
            off_peak_active:
              !!paymentPack?.off_peak_schedule &&
              !!Object.keys(paymentPack.off_peak_schedule)?.length,
            off_peak_schedule: !!paymentPack?.off_peak_schedule
              ? formatOffPeakScheduleOnEdit(paymentPack?.off_peak_schedule)
              : undefined,
            apply_penalties:
              !!paymentPack?.penalty_active ||
              !!paymentPack?.no_show_penalty_active,
            credit_number: !!paymentPack?.credits
              ? CREDIT_NUMBER_OPTION.limited
              : CREDIT_NUMBER_OPTION.unlimited,
          }
        : emptyPaymentPackDetailsForms,
    private_pass_details:
      objectType === ObjectType.PRIVATE_PASS
        ? {}
        : {
            tax: 0,
          },
    unusable_by_staff: !contract.is_usable_by_staff,
    tags_on_first_billing: contract.tags_on_first_billing || [],
  };
};

export const formValuesToContract = (
  formValues: FormValues,
): ContractPayload => {
  const base = {
    name: formValues.name,
    description: formValues.description,
    contract: formValues.contract,
    manager_only: formValues.manager_only,
    auto_renewal: formValues.auto_renewal,
    flat_fee: formValues.flat_fee,
    recurrent_price: formValues.recurrent_price,
    nb_interval: formValues.nb_interval,
    interval: formValues.interval,
    recurrence_basis: formValues.recurrence_basis,
    tax: formValues.tax,
    is_usable_by_staff: !formValues.unusable_by_staff,
    month_billing_day:
      formValues.invoicing_type === InvoicingType.FIXED_DAY
        ? formValues.month_billing_day
        : null,
    highlighted_as_recommended: formValues.highlighted_as_recommended,
    nb_interval_after_auto_renewal: formValues.nb_interval_after_auto_renewal,
    tags_on_first_billing: formValues.tags_on_first_billing,
    contract_template: formValues.contract_template,
    editable: formValues.editable,
    has_mandatory_commitment_period: formValues.has_mandatory_commitment_period,
    commitment_period_value: formValues.commitment_period_value,
    commitment_period_unit: formValues.commitment_period_unit,
  };

  if (formValues.object_type === ObjectType.PAYMENT_PACK) {
    const details_values = formValues.payment_pack_details;

    const payment_pack_details_payload = {
      credits: details_values.credits ?? undefined,
      theorical_margin_value: details_values.theorical_margin_value,
      bookkeeping_account: details_values.bookkeeping_account ?? null,
      sct_ids:
        details_values.categories && details_values.categories.length
          ? details_values.categories
          : null,
      meta_activity_ids:
        details_values.metaActivities && details_values.metaActivities.length
          ? details_values.metaActivities
          : null,
      establishment_ids:
        details_values.establishments && details_values.establishments.length
          ? details_values.establishments
          : null,
      max_bookings_per_day: details_values.max_bookings_per_day ?? null,
      max_bookings_per_week: details_values.max_bookings_per_week ?? null,
      max_bookings_per_month: details_values.max_bookings_per_month ?? null,
      max_purchase_per_member: details_values.max_purchase_per_member ?? null,
      tax: details_values.tax ?? 0,
      full_vod_access: !!details_values.full_vod_access,
      only_vod_access: !!details_values.only_vod_access,
      allow_guest_pass: !!details_values.allow_guest_pass,
      adetails_valueslies_for_payroll: !!details_values.applies_for_payroll,
      grants_door_access: !!details_values.grants_door_access,
      expiration_days_before_first_use:
        details_values.expiration_days_before_first_use ?? null,
      expiration_date:
        details_values.expiration_date && details_values.expiration_date_active
          ? details_values.expiration_date.toISODate()
          : null,
      onsite_payment_available: !!details_values.onsite_payment_available,
      applies_for_payroll: !!details_values.applies_for_payroll,
      penalty_active: !!details_values.penalty_active,
      penalty_nb_late_cancellations:
        details_values.penalty_nb_late_cancellations ?? null,
      penalty_nb_days: details_values.penalty_nb_days ?? null,
      penalty_kind:
        details_values.penalty_kind === 'block'
          ? PENALTY_KIND_BLOCK_CPP
          : PENALTY_KIND_NEGATIVE_ACCOUNT,
      penalty_days_blocked: details_values.penalty_days_blocked ?? null,
      penalty_account_value: details_values.penalty_account_value ?? null,
      no_show_penalty_active: !!details_values.no_show_penalty_active,
      no_show_penalty_threshold:
        details_values.no_show_penalty_threshold ?? null,
      no_show_penalty_time_window_days:
        details_values.no_show_penalty_time_window_days ?? null,
      no_show_penalty_kind:
        details_values.no_show_penalty_kind === 'block'
          ? PENALTY_KIND_BLOCK_CPP
          : PENALTY_KIND_NEGATIVE_ACCOUNT,
      no_show_penalty_days_blocked:
        details_values.no_show_penalty_days_blocked ?? null,
      no_show_penalty_amount: details_values.no_show_penalty_amount ?? null,
      off_peak_schedule:
        details_values.off_peak_active && details_values.off_peak_schedule
          ? formatOffPeakScheduleOnSubmit(details_values.off_peak_schedule)
          : {},
    };
    return {
      ...base,
      payment_pack_details: payment_pack_details_payload,
    };
  }

  return {
    ...base,
    private_pass_details: formValues.private_pass_details,
  };
};
