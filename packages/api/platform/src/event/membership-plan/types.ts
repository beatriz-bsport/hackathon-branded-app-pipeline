import { BILLING_PLAN_EVENT_TYPES } from "./constants";

// #region Models

export type BillingPlanEventType =
  (typeof BILLING_PLAN_EVENT_TYPES)[keyof typeof BILLING_PLAN_EVENT_TYPES];

export type BillingPlanEventData = {
  billing_plan?: number;
  id?: number;
  payment_pack?: number;
  private_pass?: number;
  payment_combo?: number;
  amount?: number;
  from_date?: string;
  until_date?: string;
  pause?: number;
  created_by_staff?: string;
  deleted_by_staff?: string;
  stopping_user_name?: string;
  stopping_user_email?: string;
  has_been_stopped_by_member?: boolean;
};

export type BillingPlanEvent = {
  uuid: string;
  identifier: string;
  company_event: string;
  company_id: number;
  date: number;
  event_type: BillingPlanEventType;
  data: BillingPlanEventData;
};

// #endregion

// ----------------------------------------------------------------------------

// #region Params

export type FetchMembershipPlanEventsParams = {
  billing_plan: number;
  page?: number;
  page_size?: number;
  search?: string;
  min_date?: string;
  max_date?: string;
  event_types?: BillingPlanEventType[];
};

// #endregion
