import type {
  ContractPayload,
  ContractWithPaymentPack,
} from '#src/libs/subscription/types';
import type {
  PrivatePass,
  ServiceCompatibilityPass,
} from '#src/libs/private-service/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import {
  CREDIT_NUMBER_OPTION,
  type FormValues,
  InvoicingType,
  ObjectType,
} from '#src/libs/subscription/components/contract/contract-revamp/types';
import {
  emptyPaymentPackDetailsForms,
  emptyPrivatePassDetailsForms,
} from './constants';
import {
  formatOffPeakScheduleOnEdit,
  formatOffPeakScheduleOnSubmit,
} from '#src/libs/payment-packs/utils';
import {
  PENALTY_KIND_BLOCK_CPP,
  PENALTY_KIND_NEGATIVE_ACCOUNT,
} from '#src/libs/payment-packs/constants';
import { penaltyKindDict } from '#src/libs/payment-packs/components/PaymentPackForm/PaymentPackForm.component';
import { ImmutableArray } from 'seamless-immutable';
import { getFormInitial } from '#src/libs/private-service/utils';

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function getIdOrObject<T extends { id: number }>(
  value: T | number,
): number {
  return isNumber(value) ? value : value.id;
}

export const getObjectTypeFromContract = (
  contract: ContractWithPaymentPack<PrivatePass, PaymentCombo>,
): ObjectType => {
  if (!!contract?.payment_pack) {
    return ObjectType.PAYMENT_PACK;
  }
  return ObjectType.PRIVATE_PASS;
};

export const contractToFormValues = (
  contract: ContractWithPaymentPack<PrivatePass, PaymentCombo>,
  paymentPackList: ImmutableArray<PaymentPack>,
  privatePassList: PrivatePass[],
  compatibleServicePass?: Array<ServiceCompatibilityPass>,
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
            id: paymentPack?.id,
            credits: paymentPack?.credits ?? undefined,
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
        ? {
            id: privatePass?.id,
            credits: privatePass?.credits || 0,
            expiration_days_before_first_use:
              privatePass?.expiration_days_before_first_use || 365,
            description: privatePass?.description || null,
            available: privatePass?.available ?? true,
            applies_for_payroll: privatePass?.applies_for_payroll ?? true,
            on_behalf_of_teacher: privatePass?.on_behalf_of_teacher ?? false,
            full_vod_access: privatePass?.full_vod_access ?? true,
            grants_door_access: privatePass?.grants_door_access ?? false,
            private_services: privatePass?.private_services || null,
            category: privatePass?.category || null,
            template_instance: privatePass?.template_instance || null,
            bookkeeping_account: privatePass?.bookkeeping_account || null,
            compatibility:
              !!compatibleServicePass && !!privatePass
                ? getFormInitial(privatePass, compatibleServicePass)
                    .compatibility
                : [],
          }
        : emptyPrivatePassDetailsForms,
    unusable_by_staff: !contract.is_usable_by_staff,
    tags_on_first_billing: contract.tags_on_first_billing || [],
  };
};

export const formValuesToContract = (
  formValues: FormValues,
): ContractPayload => {
  const base = {
    id: formValues?.id,
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
      credits:
        details_values.credit_number === CREDIT_NUMBER_OPTION.limited
          ? details_values.credits
          : null,
      tax: String(formValues.tax),
      theorical_margin_value: details_values.theorical_margin_value,
      bookkeeping_account: details_values.bookkeeping_account ?? null,
      sct_ids:
        details_values.categories && details_values.categories.length
          ? details_values.categories
          : [],
      meta_activity_ids:
        details_values.metaActivities && details_values.metaActivities.length
          ? details_values.metaActivities
          : [],
      establishment_ids:
        details_values.establishments && details_values.establishments.length
          ? details_values.establishments
          : [],
      max_bookings_per_day: details_values.max_bookings_per_day ?? null,
      max_bookings_per_week: details_values.max_bookings_per_week ?? null,
      max_bookings_per_month: details_values.max_bookings_per_month ?? null,
      max_purchase_per_member: details_values.max_purchase_per_member ?? null,
      full_vod_access: !!details_values.full_vod_access,
      only_vod_access: !!details_values.full_vod_access
        ? !!details_values.only_vod_access
        : false,
      allow_guest_pass: !!details_values.allow_guest_pass,
      grants_door_access:
        !details_values.only_vod_access && !!details_values.grants_door_access,
      expiration_days_before_first_use:
        details_values.expiration_days_before_first_use ?? null,
      applies_for_payroll: !!details_values.applies_for_payroll,
      penalty_active:
        details_values.credit_number === CREDIT_NUMBER_OPTION.unlimited &&
        details_values.apply_penalties &&
        !!details_values.penalty_active,
      penalty_nb_late_cancellations:
        details_values.penalty_nb_late_cancellations ?? null,
      penalty_nb_days: details_values.penalty_nb_days ?? null,
      penalty_kind:
        details_values.penalty_kind === 'block'
          ? PENALTY_KIND_BLOCK_CPP
          : PENALTY_KIND_NEGATIVE_ACCOUNT,
      penalty_days_blocked: details_values.penalty_days_blocked ?? null,
      penalty_account_value: details_values.penalty_account_value ?? null,
      no_show_penalty_active:
        details_values.credit_number === CREDIT_NUMBER_OPTION.unlimited &&
        details_values.apply_penalties &&
        !!details_values.no_show_penalty_active,
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

  const details_values = formValues.private_pass_details;

  const private_pass_details_payload = {
    credits: details_values.credits,
    tax: String(formValues.tax),
    expiration_days_before_first_use:
      details_values.expiration_days_before_first_use,
    description: details_values.description,
    available: details_values.available,
    applies_for_payroll: details_values.applies_for_payroll,
    on_behalf_of_teacher: details_values.on_behalf_of_teacher,
    full_vod_access: details_values.full_vod_access,
    grants_door_access: details_values.grants_door_access,
    bookkeeping_account_id: details_values.bookkeeping_account ?? null,
    private_service_ids:
      details_values.private_services && details_values.private_services.length
        ? details_values.private_services
        : null,
    category_id:
      details_values.category !== null ? details_values.category : null,
    template_instance:
      details_values.template_instance !== null
        ? details_values.template_instance
        : null,
    compatibility: details_values.compatibility,
  };

  return {
    ...base,
    private_pass_details: private_pass_details_payload,
  };
};
