import {
  BILLING_PLAN_STATUS_NOT_STARTED,
  BILLING_PLAN_STATUS_STARTED,
  BILLING_PLAN_STATUS_STOPPED,
  BILLING_PLAN_STATUS_PAUSED,
  BILLING_PLAN_STATUS_ENDED,
} from '@bsport/common/lib/master-data/subscription-status';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import type { Payment, PaymentEngine } from '#libs/payment/types';
import { ErrorAndLoading } from '../../state/types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PrivatePass } from '#libs/private-service/types';
import type { PaymentCombo } from '#libs/payment-combo/types';

export type PlannedInvoice = {
  date: string;
  status: number;
  price: number;
  voucher: number;
  uuid: string;
  id: number;
  billing_plan: number;
  name: string;
  contract: number;
  payment_method: number;
  member: number;
  amount_due_cts: number;
  is_last_invoice_before_scheduled_stop: boolean;
  reverted: boolean;
  invoice_legal_identifier: string;
};

export type Subscription<
  PrivatePassType = number,
  PaymentPackType = number,
  PaymentComboType = number,
> = {
  auto_renewal: boolean;
  canceled_at: string;
  contract: number;
  contract_terms_date_accepted: string;
  contract_terms_pdf_link: string | null;
  date_created: string;
  description: string;
  editable: boolean;
  first_billing_date: string;
  flat_fee: string;
  has_ended: boolean;
  id: number;
  is_v2: boolean;
  interval: 'month' | 'week' | 'day' | 'year';
  legal_contract: string;
  member: number;
  memberName: string;
  memberArchived: boolean;
  name: string;
  name_without_member_name: string;
  nb_interval: number;
  next_billing_date: string;
  note: string;
  stop_note: string;
  pauses: Array<SubscriptionPause>;
  payment_combo: PaymentComboType;
  payment_engine: number;
  payment_method: number;
  payment_method_identifier: number;
  payment_pack: PaymentPackType;
  planned_invoices: Array<PlannedInvoice>;
  private_pass: PrivatePassType;
  recurrence_basis: number;
  recurrent_price: number;
  recurrent_voucher: number;
  status: number;
  stripe_payment_method_id: string;
  trial_nb: number;
  month_billing_day: number | null;
  has_discount: boolean;
};

export type SubscriptionInterval = 'month' | 'week' | 'day' | 'year';

export type SubscriptionData = {
  name: string;
  member: number;
  nb_interval: number;
  recurrent_price: number;
  trial_nb: number;
  interval: 'month' | 'week' | 'day' | 'year';
  recurrent_voucher: number;
  payment_pack: number;
  first_billing_timestamp: number;
};

export type SubscriptionPause = {
  id: number;
  days: number;
  date_created: string;
  date_ended: string;
  from_date: string;
  until_date: string;
  billing_plan: number;
  name: string; // this is the pause reason
  first_paused_planned_invoice: number; // id of the planned invoice
  creator_staff_name?: string;
  version: string;
  contract_pause?: number;
};

export type Contract = {
  id: number;
  company: number;
  payment_pack?: number;
  private_pass?: number;
  payment_combo?: number;
  name: string;
  description: string;
  contract: string;
  manager_only: boolean;
  auto_renewal: boolean;
  flat_fee: string;
  recurrent_price: string;
  nb_interval: number;
  disabled: boolean;
  interval: 'month' | 'week' | 'day' | 'year';
  recurrence_basis: number;
  tax: string;
  contract_terms_pdf_link: string | null;
  is_usable_by_staff: boolean;
  month_billing_day: number | null;
  highlighted_as_recommended: boolean;
};

export type ContractWithPaymentPack<
  PrivatePassType = PrivatePass,
  PaymentComboType = PaymentCombo,
> = {
  id: number;
  company: number;
  name: string;
  description: string;
  contract: string;
  manager_only: boolean;
  auto_renewal: boolean;
  tax: string;
  flat_fee: string;
  recurrent_price: string;
  nb_interval: number;
  disabled: boolean;
  interval: 'month' | 'week' | 'day' | 'year';
  recurrence_basis: number;
  payment_pack?: PaymentPack;
  private_pass?: PrivatePassType;
  payment_combo?: PaymentComboType;
  is_usable_by_staff: boolean;
  month_billing_day: number | null;
  highlighted_as_recommended: boolean;
  tags_on_first_billing: Array<number>;
};

export type ContractInterval = 'month' | 'week';

export type ContractPause = {
  company?: number;
  name: string;
  days: number;
  from_date?: string;
  until_date?: string;
  contract?: number;
  id: number;
  date_created: string;
  processing?: boolean;
  creator_staff_name: string;
};

export type ContractPauseDetails = ContractPause & {
  billing_plan_errors: any[];
  billing_plan_impossible: any[];
  billing_plan_invalid: any[];
  billing_plan_invalid_ids: number[];
  billing_plan_success: any[];
  billing_plan_success_ids: number[];
};

export type ContractPauseRequestData = {
  contract_pause_id?: number;
  contract: number;
  days: number;
  from_date: string;
  until_date: string;
  name?: string;
  action_pack_kind?: number;
};

export type PauseRequestData = {
  pause_id?: number;
  from_date: string;
  name: string;
  days: number;
  action_pack_kind?: number;
};

export type PauseRequestResults = {
  pause?: {
    pause_id: number;
    from_date: string;
    until_date: string;
  };
  subscription: Subscription;
};

export type PauseBadRequestResults = {
  from_date?: string;
  days?: string;
};

export type PauseSubmitResults = {
  resultIdentifier: number;
  subscriptionName?: string;
  subscriberName?: string;
  fromDate: string;
  untilDate: string;
  countSubscription?: number;
};

export type SubscriptionState = {
  byId: { [id: number]: Subscription };
  createOrUpdate: ErrorAndLoading;
  bulk: ErrorAndLoading;
  list: ErrorAndLoading & {
    allIds: Array<number>;
  };
  byMember: ErrorAndLoading & {
    allIds: Array<number>;
  };
  detail: ErrorAndLoading;
  stop: ErrorAndLoading;
  freeze: ErrorAndLoading;
  switchSubscriptionItem: ErrorAndLoading;
  switchPaymentMethod: ErrorAndLoading;
  events: {
    items: Array<any>;
    page: number;
  } & ErrorAndLoading;
  plannedInvoice: {
    byId: { [key: number]: PlannedInvoice };
    allIds: Array<number>;
    nextPage: number | null;
    page: number;
  } & ErrorAndLoading;
  contractPause: ErrorAndLoading & {
    allIds: Array<number>;
    byId: { [id: number]: ContractPause };
    page: number;
    nextPage?: number;
  };
  contract: ErrorAndLoading & {
    byId: { [id: number]: Contract };
    allIds: Array<number>;
    createOrUpdate: ErrorAndLoading;
    byMarketplace: ErrorAndLoading & {
      allIds: Array<number>;
    };
    forBooking: ErrorAndLoading & {
      allIds: Array<number>;
    };
  };
  contractTermsDownload: ErrorAndLoading;
  tags_on_first_billing: number[];
};

export type SubscriptionQueryParams = {
  page?: number;
  page_size?: number;
  member?: number;
  id__in?: number[];
  status?: 'active' | 'future' | 'expired';
};

export type PlannedInvoiceFactoryOptions = {
  status?: number;
  isLastInvoiceBeforeScheduledStop?: boolean;
  isReverted?: boolean;
};

export type ContractFactoryOptions = {
  hasPaymentCombo?: boolean;
  hasPaymentPack?: boolean;
  hasPrivatePass?: boolean;
  isManagerOnly?: boolean;
  isAutoRenewal?: boolean;
  isDisabled?: boolean;
  isUsableByStaff?: boolean;
  monthBillingDay?: number;
  isHighlightedAsRecommended?: boolean;
};

export type RegisterBackgroundReturnValue = {
  billing_plan: Subscription;
  compatible_consumer_payment_pack_id: number | null;
};

export type SubscriptionStatus =
  | typeof BILLING_PLAN_STATUS_NOT_STARTED
  | typeof BILLING_PLAN_STATUS_STARTED
  | typeof BILLING_PLAN_STATUS_STOPPED
  | typeof BILLING_PLAN_STATUS_PAUSED
  | typeof BILLING_PLAN_STATUS_ENDED;

export type SubscriptionPaymentMethod =
  | typeof BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT
  | typeof BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT
  | typeof BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB
  | typeof BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA;

export type SubscriptionREST = {
  auto_renewal: boolean;
  canceled_at: string | null;
  contract_terms_date_accepted: string;
  contract_terms_pdf_link: string;
  contract_terms: string;
  contract: number;
  date_created: string;
  description: string;
  editable: boolean;
  expiration_date: string;
  failed_payments_invoices: SubscriptionsInvoicesDetailsREST[];
  first_billing_date: string;
  flat_fee: string;
  has_discount: boolean;
  has_ended: boolean;
  id: number;
  interval: SubscriptionInterval;
  is_v2: boolean;
  last_billing_date: string;
  legal_contract: string;
  member: number;
  memberArchived: boolean;
  memberName: string;
  month_billing_day: number | null;
  name_without_member_name: string;
  name: string;
  nb_interval: number;
  next_billing_date: string;
  note: string;
  pauses: SubscriptionPause[] | null;
  payment_combo: number | null;
  payment_engine: PaymentEngine;
  payment_method_identifier: number;
  payment_method: SubscriptionPaymentMethod;
  payment_pack: number;
  planned_invoices: number[] | null;
  private_pass: number | null;
  recurrence_basis: number;
  recurrent_price: string;
  started_at: string;
  status: SubscriptionStatus;
  stop_note: string;
  stripe_payment_method_id: string;
};

export type SubscriptionsInvoicesDetailsREST = {
  date: string;
  payments: Payment[];
  billing_plan_id: number;
  uuid: string;
};
