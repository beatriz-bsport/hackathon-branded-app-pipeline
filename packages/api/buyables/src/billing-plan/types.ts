// #region Models

export type BillingPlan = {
  id: number;
  name: string;
  name_without_member_name: string;
  member: number;
  memberName: string;
  legal_contract: string;
  contract: number;
  description: string;
  interval: string;
  recurrence_basis: number;
  nb_interval: number;
  recurrent_price: string;
  payment_method: number;
  payment_method_identifier: number;
  payment_engine: number;
  stripe_payment_method_id: string;
  canceled_at: string | null;
  date_created: string;
  first_billing_date: string;
  next_billing_date: string | null;
  has_ended: boolean;
  editable: boolean;
  planned_invoices: number[];
  pauses: BillingPlanPause[];
  auto_renewal: boolean;
  payment_pack: number | null;
  is_v2: boolean;
  private_pass: number | null;
  payment_combo: number | null;
  flat_fee: string;
  started_at: string | null;
  status: number;
  note: string;
  stop_note: string;
  memberArchived: boolean;
  contract_terms_date_accepted: string;
  contract_terms_pdf_link: string;
  month_billing_day: number | null;
  has_discount: boolean;
  member_relation_auto_share: boolean;
  has_changed_after_renewal: boolean;
  nb_interval_after_auto_renewal: number | null;
  is_shared_from_franchisor: boolean;
  source_company_id: string;
  source_company_name: string;
  source_company_primary_color: string;
  has_mandatory_commitment_period: boolean;
  commitment_period_value: number;
  commitment_period_unit: string;
  is_member_cancellation_allowed: boolean;
  is_within_commitment_period: boolean;
  forecasted_expiration_date: string;
  expiration_date: string;
};

export type BillingPlanPause = {
  date_created: string;
  date_ended: string;
  id: number;
  days: number;
  name: string;
  first_paused_planned_invoice: number;
  billing_plan: number;
  creator_staff_name: string;
  from_date: string;
  until_date: string;
  version: string;
  contract_pause: number | null;
};

// #endregion

// ----------------------------------------------------------------------------

// #region Params

export type FetchBillingPlansParams = {
  id__in?: number[];
  contract?: number;
  ordering?: string;
};

export type FetchPaginatedMembershipPlansParams = {
  page?: number;
  page_size?: number;
} & FetchBillingPlansParams;

// #endregion
