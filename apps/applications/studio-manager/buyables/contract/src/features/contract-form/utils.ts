import type { AppointmentPass } from "@bsport/api-buyables/appointment-pass";
import type {
  AppointmentPassDetails,
  Contract,
  CreateContractParams,
  PassDetails,
} from "@bsport/api-buyables/contract";
import { type Pass, START_DATE_METHOD } from "@bsport/api-buyables/pass";
import {
  convertBackendToFormTimeRestrictions,
  convertFormToBackendTimeRestrictions,
} from "@bsport/kaizen-business-components/buyables/pass-form";

import {
  BENEFIT_KIND,
  type BenefitKind,
  getBenefitKind,
} from "#src/utils/contract-benefit";

import {
  DEFAULT_APPOINTMENT_PASS_DETAILS,
  DEFAULT_LIMITATIONS,
  DEFAULT_NO_SHOW,
  DEFAULT_PASS_DETAILS,
  DEFAULT_PENALTY,
  EXPIRATION_DAYS_BEFORE_FIRST_USE_DEFAULT,
} from "./constants";
import type {
  AppointmentPassFormDetails,
  BenefitConfigInContract,
  ContractFormData,
  PassFormDetails,
  SharedBenefitDetails,
} from "./types";

// #region API to FORM

/**
 * Maps the retrieved {@link Pass} benefit into the form-shaped
 * `payment_pack_details`: derives the frontend-only helper flags, converts the
 * off-peak schedule and renames the API fields. The shared (`credits`,
 * `grants_door_access`) and contract-inherited (`tax`, `bookkeeping_account_id`)
 * fields are handled separately.
 */
function toPassFormDetails(pass: Pass): PassFormDetails {
  const {
    theorical_margin_value,
    penalty_account_value,
    no_show_penalty_amount,
    unlimited,
    SCTs,
    metaActivities,
    establishments,
    off_peak_schedule,
    ...correctFields
  } = pass;

  return {
    theorical_margin_value: Number(theorical_margin_value),
    penalty_account_value: Number(penalty_account_value),
    no_show_penalty_amount: Number(no_show_penalty_amount),
    sct_ids: SCTs,
    meta_activity_ids: metaActivities,
    establishment_ids: establishments,
    // Frontend-only helpers
    hasUnlimitedCredits: unlimited,
    hasMaximumUsage:
      pass.max_purchase_per_member != null ||
      pass.max_bookings_per_day != null ||
      pass.max_bookings_per_week != null ||
      pass.max_bookings_per_month != null,
    applyPenalties: pass.penalty_active || pass.no_show_penalty_active,
    offPeakActive: Object.keys(off_peak_schedule).length > 0,
    off_peak_schedule: convertBackendToFormTimeRestrictions(off_peak_schedule),
    ...correctFields,
  };
}

/**
 * Maps the retrieved {@link AppointmentPass} benefit into the form-shaped
 * `private_pass_details`. The retrieve model doesn't carry the slot
 * `compatibility`, so it defaults to an empty list.
 */
function toAppointmentPassFormDetails(
  appointmentPass: AppointmentPass,
): AppointmentPassFormDetails {
  return {
    is_unpaid_private_booking_integration:
      appointmentPass.is_unpaid_private_booking_integration,
    available: appointmentPass.available,
    applies_for_payroll: appointmentPass.applies_for_payroll,
    on_behalf_of_teacher: appointmentPass.on_behalf_of_teacher,
    full_vod_access: appointmentPass.full_vod_access,
    category_id: appointmentPass.category,
    private_service_ids: appointmentPass.private_services,
    compatibility: [],
  };
}

function getSharedConfig({
  benefitKind,
  pass,
  appointmentPass,
}: {
  benefitKind: BenefitKind;
  pass?: Pass | null;
  appointmentPass?: AppointmentPass | null;
}): SharedBenefitDetails {
  if (benefitKind === BENEFIT_KIND.APPOINTMENT_PASS) {
    return {
      credits: appointmentPass?.credits ?? null,
      // The appointment-pass retrieve model has no door access flag
      grants_door_access: false,
    };
  }
  return {
    credits: pass?.credits ?? appointmentPass?.credits ?? null,
    grants_door_access: pass?.grants_door_access || false,
  };
}

export function transformContractIntoFormState({
  contract,
  pass,
  appointmentPass,
}: {
  contract: Contract;
  pass?: Pass | null;
  appointmentPass?: AppointmentPass | null;
}): ContractFormData {
  const hasCustomInterval = contract.month_billing_day == null;

  const benefitKind = getBenefitKind({
    hasPass: contract.payment_pack != null,
    hasAppointmentPass: contract.private_pass != null,
  });

  const shared_details = getSharedConfig({
    benefitKind,
    pass,
    appointmentPass,
  });

  const payment_pack_details =
    benefitKind !== BENEFIT_KIND.APPOINTMENT_PASS && pass
      ? toPassFormDetails(pass)
      : DEFAULT_PASS_DETAILS;

  const private_pass_details =
    benefitKind !== BENEFIT_KIND.PASS && appointmentPass
      ? toAppointmentPassFormDetails(appointmentPass)
      : DEFAULT_APPOINTMENT_PASS_DETAILS;

  return {
    ...contract,
    hasCustomInterval,
    benefitKind,
    // Contract-level benefit config, inherited by every benefit detail
    tax: Number(pass?.tax ?? appointmentPass?.tax ?? 0),
    bookkeeping_account_id:
      pass?.bookkeeping_account ?? appointmentPass?.bookkeeping_account ?? null,
    shared_details,
    payment_pack_details,
    private_pass_details,
  };
}

// #endregion

// ----------------------------------------------------------------------------

// #region FORM to API

/**
 * Mirrors the shared & contract-inherited fields into a full API
 * {@link PassDetails}, converting the off-peak schedule back to its backend
 * shape, dropping the frontend-only flags and enforcing the lifecycle defaults.
 */
function toPassDetails(
  formDetails: PassFormDetails,
  shared: SharedBenefitDetails,
  config: BenefitConfigInContract,
): PassDetails {
  const {
    hasUnlimitedCredits,
    applyPenalties,
    offPeakActive,
    hasMaximumUsage,
    off_peak_schedule,
    only_vod_access,
    full_vod_access,
    ...rest
  } = formDetails;

  // When the pass is not limited or applyPenalties is off, reset penalties to default (unset)
  const sanitizedPenalty =
    hasUnlimitedCredits && applyPenalties && rest.penalty_active
      ? {} // preserve penalty fields
      : DEFAULT_PENALTY; // reset to defaults
  const sanitizedNoShow =
    hasUnlimitedCredits && applyPenalties && rest.no_show_penalty_active
      ? {} // preserve noshow fields
      : DEFAULT_NO_SHOW; // reset to defaults

  const sanitizedLimitations = hasMaximumUsage ? {} : DEFAULT_LIMITATIONS;

  return {
    ...rest,
    ...sanitizedPenalty,
    ...sanitizedNoShow,
    ...sanitizedLimitations,
    full_vod_access,
    only_vod_access: full_vod_access && only_vod_access, // Requires both fields
    credits: hasUnlimitedCredits ? null : shared.credits,
    off_peak_schedule: offPeakActive
      ? convertFormToBackendTimeRestrictions(off_peak_schedule)
      : {},
    grants_door_access: shared.grants_door_access,
    tax: config.tax,
    bookkeeping_account_id: config.bookkeeping_account_id,
    // Enforced fields for the benefit
    start_date_method: START_DATE_METHOD.ON_PURCHASE,
    expiration_days_before_first_use: EXPIRATION_DAYS_BEFORE_FIRST_USE_DEFAULT,
    expiration_date: null,
  };
}

function toAppointmentPassDetails(
  formDetails: AppointmentPassFormDetails,
  shared: SharedBenefitDetails,
  config: BenefitConfigInContract,
): AppointmentPassDetails {
  return {
    ...formDetails,
    tax: config.tax,
    bookkeeping_account_id: config.bookkeeping_account_id,
    // Lifecycle fields don't make sense for a contract benefit
    description: null,
    expiration_days_before_first_use: EXPIRATION_DAYS_BEFORE_FIRST_USE_DEFAULT,
    expiration_date: null,
    credits: shared.credits ?? 0,
    grants_door_access: shared.grants_door_access,
  };
}

/**
 * Converts a ContractFormData into the API params for the revamped Contract
 * endpoint, mirroring the shared fields into both detail objects and nullifying
 * the detail object(s) unused by the chosen benefit kind.
 */
export function transformFormStateIntoContractAPIParams({
  formState,
}: {
  formState: ContractFormData;
}): CreateContractParams {
  const {
    benefitKind,
    payment_pack_details,
    private_pass_details,
    shared_details,
    // Contract-level benefit config, injected into each benefit detail
    tax,
    bookkeeping_account_id,
    ...rest
  } = formState;

  const config: BenefitConfigInContract = { tax, bookkeeping_account_id };

  const wantsPass = benefitKind !== BENEFIT_KIND.APPOINTMENT_PASS;
  const wantsAppointmentPass = benefitKind !== BENEFIT_KIND.PASS;

  return {
    ...rest,
    payment_pack_details:
      wantsPass && payment_pack_details
        ? toPassDetails(payment_pack_details, shared_details, config)
        : null,
    private_pass_details:
      wantsAppointmentPass && private_pass_details
        ? toAppointmentPassDetails(private_pass_details, shared_details, config)
        : null,
  };
}
