import {
  BILLING_PLAN_STATUS_NOT_STARTED,
  BILLING_PLAN_STATUS_STARTED,
  BILLING_PLAN_STATUS_STOPPED,
  BILLING_PLAN_STATUS_PAUSED,
  BILLING_PLAN_STATUS_ENDED,
} from '@bsport/common/lib/master-data/subscription-status.js';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
} from '@bsport/common/lib/master-data/subscription-payment-methods.js';
import type { Payment, PaymentEngine } from '#src/libs/payment/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type {
  ContractAvailability,
  PassType,
  SubscriptionInvoicingType,
} from '#src/libs/subscription/enums';
import type {
  SelectOption,
  PaginationFilterParams,
  ErrorAndLoading,
} from '#src/libs/types';
import { PAUSE_RESULTS_ERROR_CODES } from '#src/libs/subscription/constants';
import {
  PaymentPackDetails,
  PrivatePassDetails,
} from './components/contract/contract-revamp/types';

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
  commitment_period_value: number | null;
  commitment_period_unit: SubscriptionCommitmentPeriod | null;
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
  has_mandatory_commitment_period: boolean;
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
  nb_interval_after_auto_renewal: number | null;
  has_changed_after_renewal: boolean;
  is_shared_from_franchisor?: boolean;
  source_company_id?: number;
  source_company_name?: string;
  source_company_primary_color?: string;
};

export type SubscriptionInterval = 'month' | 'week' | 'day' | 'year';

export type SubscriptionCommitmentPeriod = 'day' | 'week' | 'month' | 'year';

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
  tags_on_first_billing: number[];
  nb_interval_after_auto_renewal: number | null;
  contract_template: number | null;
  editable: boolean;
  has_mandatory_commitment_period: boolean;
  commitment_period_value: number | null;
  commitment_period_unit: SubscriptionCommitmentPeriod | null;
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
  nb_interval_after_auto_renewal: number | null;
  contract_template: number | null;
  editable: boolean;
  has_mandatory_commitment_period: boolean;
  commitment_period_value: number | null;
  commitment_period_unit: SubscriptionCommitmentPeriod | null;
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

type PauseRequestErrorCodes = (typeof PAUSE_RESULTS_ERROR_CODES)[number];

export type PauseRequestErrorData = {
  pause_overlapped_from_date?: string;
  days?: number;
};

export type PauseRequestErrorResults = {
  error_code?: PauseRequestErrorCodes;
  error_data?: PauseRequestErrorData;
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
  contractTemplate: {
    delete: ErrorAndLoading;
    restore: ErrorAndLoading;
    active: ErrorAndLoading & {
      byId: { [id: number]: ContractTemplate };
      allIds: number[];
      page: number;
      numberOfPages: number;
      count: number;
    };
    detail: ErrorAndLoading;
    disabled: ErrorAndLoading & {
      byId: { [id: number]: ContractTemplate };
      allIds: number[];
      page: number;
      numberOfPages: number;
      count: number;
    };
    billingPlans: ErrorAndLoading & {
      byId: { [id: number]: Subscription };
      allIds: number[];
      page: number;
      nextPage: number | null;
      count: number;
    };
    createOrUpdate: ErrorAndLoading;
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

export type SubscriptionDetailsQueryParams = {
  billing_plan_id: number;
  page: number;
  page_size: number;
  company?: number;
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
  hasContractTemplate?: boolean;
  isManagerOnly?: boolean;
  isAutoRenewal?: boolean;
  isDisabled?: boolean;
  isUsableByStaff?: boolean;
  monthBillingDay?: number;
  isHighlightedAsRecommended?: boolean;
  isEditable?: boolean;
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
  failed_payments_invoices: SubscriptionsFailedInvoicesREST[];
  first_billing_date: string;
  flat_fee: string;
  has_been_renewed: boolean;
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
  price_to_display_cts: number;
  private_pass: number | null;
  recurrence_basis: number;
  recurrent_price: string;
  started_at: string;
  status: SubscriptionStatus;
  stop_note: string;
  stripe_payment_method_id: string;
  voucher: string;
  is_shared_from_franchisor?: boolean;
  source_company_id?: number;
  source_company_name?: string;
  source_company_primary_color?: string;
  has_mandatory_commitment_period: boolean;
  commitment_period_value: number | null;
  commitment_period_unit: SubscriptionCommitmentPeriod | null;
  is_member_cancellation_allowed: boolean;
  is_within_commitment_period: boolean;
  forecasted_expiration_date: string;
};

export type SubscriptionsFailedInvoicesREST = {
  uuid: string;
  date: string;
  next_retry_date: string;
  payments: Payment[];
};

export type SubscriptionsInvoicesDetailsREST = {
  amount_paid_cts: string;
  billing_plan_id: number;
  date: string;
  uuid: string;
  stripe_invoice_pdf: string | null;
};

export type SubscriptionsInvoicesDetailsParams = {
  id: number;
  page_size?: number;
};

export type ContractQueryParams = {
  offer?: number;
  id__in?: number[];
  company?: number;
  manager_only?: boolean;
  disabled?: boolean;
  is_usable_by_staff?: boolean;
};

export type ContractTemplate = {
  id: number;
  disabled: boolean;
  franchisor: number;
  children_contracts: number[];
  payment_pack_template: number;
  private_pass_template: number;
  nb_interval: number;
  recurrent_price: number;
  recurrence_basis: number;
  interval: SubscriptionInterval;
  month_billing_day: number | null;
  name: string;
  description: string;
  contract: string;
  manager_only: boolean;
  auto_renewal: boolean;
  flat_fee: number;
  is_usable_by_staff: boolean;
  companies: number[];
  editable?: boolean;
  has_mandatory_commitment_period: boolean;
  commitment_period_value: number | null;
  commitment_period_unit: SubscriptionCommitmentPeriod | null;
};

export type ContractTemplatePayload = Omit<
  ContractTemplate,
  'franchisor' | 'companies' | 'children_contracts' | 'disabled'
>;
export type ContractTemplatePaginatedQueryParams = PaginationFilterParams & {
  id__in?: number[];
  companies?: number[];
  is_appointment_pass?: boolean;
  disabled?: boolean;
  manager_only?: boolean;
  is_usable_by_staff?: boolean;
  private_pass_templates?: number[];
  payment_pack_templates?: number[];
};

export type ContractAvailabilityOptionProps =
  SelectOption<ContractAvailability>;
export type PassTypeOptionProps = SelectOption<PassType>;
export type CompanyOptionProps = SelectOption<number>;
export type PrivatePassTemplateOptionProps = SelectOption<number>;
export type PaymentPackTemplateOptionProps = SelectOption<number>;

export type ContractTemplateFormValues = {
  id?: number;
  name: string;
  description: string;
  productType: PassType;
  privatePassTemplate: number;
  paymentPackTemplate: number;
  contract: string;
  recurrentPrice: number;
  flatFee: number;
  invoicingType: SubscriptionInvoicingType;
  interval: SubscriptionInterval;
  recurrenceBasis: number;
  numberOfIntervals: number;
  monthBillingDay: number | null;
  managerOnly: boolean;
  autoRenewal: boolean;
  unusableByStaff: boolean;
  editable?: boolean;
  has_mandatory_commitment_period: boolean;
  commitment_period_value: number | null;
  commitment_period_unit: SubscriptionCommitmentPeriod | null;
};

/** The payload type when adding or switching payment method for a Subscription */
export type SubscriptionPaymentMethodParams = {
  id: number;
  payment_engine?: number;
  payment_method_id: string | null;
  payment_method_identifier: number;
  source?: string;
};

export type CommitmentPeriodDisplayReturnedValues = {
  isCommitmentPeriodSectionHidden: boolean;
  shouldDisplayCommitmentPeriodAlert: boolean;
  shouldDisplayCommitmentPeriodSubtitle: boolean;
  isMemberCancellationAllowed: boolean;
};

type ContractBasePayload = Omit<
  Contract,
  | 'company'
  | 'tax'
  | 'payment_pack'
  | 'private_pass'
  | 'payment_combo'
  | 'id'
  | 'disabled'
  | 'contract_terms_pdf_link'
> & {
  id?: number;
};

export type ContractPayloadPaymentPack = ContractBasePayload & {
  payment_pack_details: PaymentPackDetails;
};
export type ContractPayloadPrivatePass = ContractBasePayload & {
  private_pass_details: PrivatePassDetails;
};

export type ContractPayload =
  | ContractPayloadPaymentPack
  | ContractPayloadPrivatePass;
