import type { AppointmentPass } from "#src/appointment-pass";
import type { Pass } from "#src/pass";

/**
 * Represents a subscription contract with detailed configuration options.
 */
export type Contract = {
  // Core fields
  id: number;
  disabled: boolean;
  company: number; // ForeignKey to Company
  tax: number | null; // Computed property
  payment_pack: number | null; // ForeignKey to PaymentPack
  private_pass: number | null; // ForeignKey to PrivatePass
  payment_combo: number | null; // ForeignKey to PaymentCombo
  contract_template: number | null; // ForeignKey to ContractTemplate

  // Billing and recurrence
  nb_interval: number;
  recurrent_price: number;
  recurrence_basis: number;
  interval: "month" | "week" | "day" | "year";
  month_billing_day: number | null;

  // Descriptive fields
  name: string;
  description: string;
  contract: string;
  contract_terms_current_version: number;
  contract_terms_history: Record<string, unknown>;
  contract_terms_pdf_link: string | null;
  contract_terms_date_updated: string | null; // ISO date string

  // Flags and settings
  manager_only: boolean;
  auto_renewal: boolean;
  flat_fee: number;
  is_usable_by_staff: boolean;
  has_mandatory_commitment_period: boolean;
  commitment_period_value: number | null;
  commitment_period_unit: "day" | "week" | "month" | "year" | null;
  nb_interval_after_auto_renewal: number | null;
  highlighted_as_recommended: boolean;
  member_relation_auto_share: boolean | null;
  editable: boolean;

  // Tags
  tags_on_first_billing: number[]; // IDs of related tags

  // Metadata
  metadata: Record<string, unknown>;
  source: number | null;
};

export type CompatiblePrivateService = {
  private_service: number;
  excluded_slot_ids: number[];
};

/**
 * Details for a PrivatePass, if the contract is linked to one.
 */
export type AppointmentPassDetails = {
  credits: number;
  tax: number; // string in legacy
  expiration_days_before_first_use: number;
  expiration_date: string | null; // ISO date string
  description: string | null;
  is_unpaid_private_booking_integration: boolean;
  available: boolean;
  applies_for_payroll: boolean;
  on_behalf_of_teacher: boolean;
  full_vod_access: boolean;
  grants_door_access: boolean;
  bookkeeping_account_id: number | null;
  category_id: number | null;
  private_service_ids: number[] | null;
  compatibility: CompatiblePrivateService[];
};

/**
 * Details for a PaymentPack, if the contract is linked to one.
 */
export type PassDetails = {
  credits: number | null;
  theorical_margin_value: number;
  tax: number; // string in legacy
  bookkeeping_account_id: number | null;

  max_bookings_per_month: number | null;
  max_bookings_per_week: number | null;
  max_bookings_per_day: number | null;
  max_purchase_per_member: number | null;

  start_date_method: number; // ChoiceField, e.g., "on_purchase"
  expiration_days_before_first_use: number | null; // number on legacy
  expiration_date: string | null; // ISO date string

  penalty_active: boolean;
  penalty_nb_late_cancellations: number;
  penalty_nb_days: number;
  penalty_kind: number;
  penalty_days_blocked: number;
  penalty_account_value: number;

  no_show_penalty_active: boolean;
  no_show_penalty_threshold: number;
  no_show_penalty_time_window_days: number;
  no_show_penalty_kind: number;
  no_show_penalty_days_blocked: number;
  no_show_penalty_amount: number;

  off_peak_schedule: Record<string, string[][]>;

  sct_ids: number[] | null;
  meta_activity_ids: number[] | null;
  establishment_ids: number[] | null;

  full_vod_access: boolean;
  only_vod_access: boolean;
  allow_guest_pass: boolean;
  applies_for_payroll: boolean;
  grants_door_access: boolean;
};

export type ContractWithBenefits = Contract & {
  payment_pack_details?: Pass | null;
  private_pass_details?: AppointmentPass | null;
};
