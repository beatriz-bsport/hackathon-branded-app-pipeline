import { BILLING_INTERVALS } from "@bsport/api-buyables/contract";
import { PENALTY_KINDS } from "@bsport/api-buyables/pass";

import { BENEFIT_KIND } from "#src/utils/contract-benefit";

import type {
  AppointmentPassFormDetails,
  ContractFormData,
  PassFormDetails,
  SharedBenefitDetails,
} from "./types";

export const EXPIRATION_DAYS_BEFORE_FIRST_USE_DEFAULT = 365;

export const FIELD_CONSTRAINTS = {
  TEXTFIELD_LENGTH_MIN: 1,
  NAME_LENGTH_MAX: 100,
  PRICE_MIN: 0,
  TAX_RATE_MIN: 0,
  TAX_RATE_MAX: 100,
  MONTH_DAY_MIN: 1,
  MONTH_DAY_MAX: 31,
  RECURRENCE_BASIS_MIN: 1,
  NB_CUSTOM_INTERVAL_MIN: 1,
  NB_FIXED_INTERVAL_MIN: 2,
  NB_FIXED_INTERVAL_MAX: 12,
  COMMITMENT_VALUE_MIN: 1,
  COMMITMENT_VALUE_MAX: 90,
  // Benefit
  CREDITS_MIN: 0,
  MARGIN_MIN: 0,
  PENALTY_VALUE_MIN: 0,
  MAX_USAGE_MIN: 0,
};

export const DEFAULT_SHARED_DETAILS = {
  credits: 0,
  grants_door_access: false,
} satisfies SharedBenefitDetails;

type PenaltyDefaults = Pick<
  PassFormDetails,
  | "penalty_active"
  | "penalty_nb_late_cancellations"
  | "penalty_nb_days"
  | "penalty_kind"
  | "penalty_days_blocked"
  | "penalty_account_value"
>;

export const DEFAULT_PENALTY = {
  penalty_active: false,
  penalty_nb_late_cancellations: 3,
  penalty_nb_days: 7,
  penalty_kind: PENALTY_KINDS.BLOCK_PASS,
  penalty_days_blocked: 7,
  penalty_account_value: 10,
} satisfies PenaltyDefaults;

type NoShowDefaults = Pick<
  PassFormDetails,
  | "no_show_penalty_active"
  | "no_show_penalty_threshold"
  | "no_show_penalty_time_window_days"
  | "no_show_penalty_kind"
  | "no_show_penalty_days_blocked"
  | "no_show_penalty_amount"
>;

export const DEFAULT_NO_SHOW = {
  no_show_penalty_active: false,
  no_show_penalty_threshold: 3,
  no_show_penalty_time_window_days: 7,
  no_show_penalty_kind: PENALTY_KINDS.BLOCK_PASS,
  no_show_penalty_days_blocked: 7,
  no_show_penalty_amount: 10,
} satisfies NoShowDefaults;

export const DEFAULT_LIMITATIONS = {
  max_bookings_per_month: null,
  max_bookings_per_week: null,
  max_bookings_per_day: null,
  max_purchase_per_member: null,
};

export const DEFAULT_PASS_DETAILS = {
  theorical_margin_value: 0,
  ...DEFAULT_LIMITATIONS,
  ...DEFAULT_PENALTY,
  ...DEFAULT_NO_SHOW,
  sct_ids: [],
  meta_activity_ids: [],
  establishment_ids: [],
  full_vod_access: false,
  only_vod_access: false,
  allow_guest_pass: true,
  applies_for_payroll: true,
  // Form-only helper flags
  hasUnlimitedCredits: false,
  applyPenalties: false,
  offPeakActive: false,
  hasMaximumUsage: false,
  off_peak_schedule: [],
} satisfies PassFormDetails;

export const DEFAULT_APPOINTMENT_PASS_DETAILS = {
  is_unpaid_private_booking_integration: false,
  available: true,
  applies_for_payroll: false,
  on_behalf_of_teacher: false,
  full_vod_access: false,
  category_id: null,
  private_service_ids: null,
  compatibility: [],
} satisfies AppointmentPassFormDetails;

export const DEFAULT_DATA = {
  manager_only: false,
  name: "",
  description: "",
  // contract-level benefit config (inherited by every benefit detail)
  tax: 0,
  bookkeeping_account_id: null,
  // benefit configuration
  benefitKind: BENEFIT_KIND.PASS,
  payment_pack_details: DEFAULT_PASS_DETAILS,
  private_pass_details: DEFAULT_APPOINTMENT_PASS_DETAILS,
  shared_details: DEFAULT_SHARED_DETAILS,
  // price
  flat_fee: 0,
  recurrent_price: 0,
  // billing cycle
  interval: BILLING_INTERVALS.MONTH,
  recurrence_basis: 1,
  month_billing_day: null,
  hasCustomInterval: true,
  nb_interval: 1,
  // auto renewal
  auto_renewal: false,
  nb_interval_after_auto_renewal: null,
  // terms
  contract: "",
  // commitment period
  has_mandatory_commitment_period: false,
  commitment_period_unit: null,
  commitment_period_value: null,
  // visibility-rules
  highlighted_as_recommended: false,
  is_usable_by_staff: true,
  // tags
  tags_on_first_billing: [],
} satisfies ContractFormData;
