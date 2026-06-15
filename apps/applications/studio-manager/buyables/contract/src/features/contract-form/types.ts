import type { z } from "zod";

import type {
  AppointmentPassDetails,
  CreateContractParams,
  PassDetails,
} from "@bsport/api-buyables/contract";
import type { UseFormControllerOutput } from "@bsport/form";
import type { TimePeriodSchedule } from "@bsport/kaizen-business-components/buyables/pass-form";

import type { BenefitKind } from "#src/utils/contract-benefit";

/**
 * Define types helpers to derive from the original API types
 */
type BenefitFieldsShared = "credits" | "grants_door_access";

type BenefitFieldsFromContract = "tax" | "bookkeeping_account_id";

type BenefitFieldsUnmanaged =
  | "description"
  | "expiration_days_before_first_use"
  | "expiration_date"
  | "start_date_method"
  | "no_show_penalty_mode_franchisor";

/**
 * Fields common to both benefit shapes. Held once in the form state and
 * mirrored into `payment_pack_details` / `private_pass_details` at init and
 * submit time, so switching benefit kind always resolves to the same values.
 */
export type SharedBenefitDetails = {
  credits: number | null;
  grants_door_access: boolean;
};

/**
 * Tax & bookkeeping account inherited from the contract config.
 * Matches fields from {@link BenefitFieldsFromContract}
 */
export type BenefitConfigInContract = {
  tax: number;
  bookkeeping_account_id: number | null;
};

/**
 * Form representation of {@link PassDetails} (the `payment_pack` benefit).
 * Extends the API model with frontend-only helper flags (camelCase) and swaps
 * the off-peak schedule for the shape the Kaizen time-periods selector consumes.
 */
export type PassFormDetails = Omit<
  PassDetails,
  | BenefitFieldsShared
  | BenefitFieldsFromContract
  | BenefitFieldsUnmanaged
  | "off_peak_schedule" // Change data type
> & {
  // Frontend-only helpers
  hasUnlimitedCredits: boolean;
  hasMaximumUsage: boolean;
  applyPenalties: boolean;
  offPeakActive: boolean;
  off_peak_schedule: TimePeriodSchedule[];
};

/**
 * Form representation of {@link AppointmentPassDetails} (the `private_pass`
 * benefit).
 */
export type AppointmentPassFormDetails = Omit<
  AppointmentPassDetails,
  BenefitFieldsFromContract | BenefitFieldsUnmanaged | BenefitFieldsShared
>;

export type ContractFormData = Pick<
  CreateContractParams,
  | "manager_only"
  | "name"
  | "description"
  | "recurrent_price"
  | "flat_fee"
  | "interval"
  | "recurrence_basis"
  | "month_billing_day"
  | "nb_interval"
  | "auto_renewal"
  | "nb_interval_after_auto_renewal"
  | "contract"
  | "commitment_period_unit"
  | "commitment_period_value"
  | "has_mandatory_commitment_period"
  | "highlighted_as_recommended"
  | "is_usable_by_staff"
  | "tags_on_first_billing"
> &
  BenefitConfigInContract & {
    // Benefit configuration
    benefitKind: BenefitKind; // frontend-only helper
    payment_pack_details: PassFormDetails | null;
    private_pass_details: AppointmentPassFormDetails | null;
    shared_details: SharedBenefitDetails; // frontend-only helper
  } & {
    hasCustomInterval: boolean; // frontend-only helper
  };

export type ContractFormSchema = z.ZodType<ContractFormData>;

export type ContractFormMethods = UseFormControllerOutput<ContractFormSchema>;
