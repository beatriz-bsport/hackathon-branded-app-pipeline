import Immutable from 'seamless-immutable';
import { loadStripe } from '@stripe/stripe-js';
import {
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_ENGINE_STRIPE,
} from '@bsport/common/lib/master-data/payment-group.js';
import {
  MarketplacePaymentMethodBillingDetails,
  MarketplacePaymentMethods,
} from '#src/libs/marketplace/types';

export type StripeInit = ReturnType<typeof loadStripe>;

export type PaymentBackendState = {
  // TODO: Add more properties and remove next line
  [key: string]: any; // Allows to not check keys other than the ones defined below
} & {
  bookkeepingAccounts: {
    byId: { [id: number]: BookkeepingAccount };
    allIds: Array<number>;
    loading: boolean;
    error: number | null;
    linkedProductNames: string[];
  };
};

export type PaymentMethod = {
  type: MarketplacePaymentMethods;
  id: string;
  readable_identifier: string;
  brand: string;
  display_brand: string;
  is_cobranded_card: boolean;
  payment_backend_identifier: number;
  additional_info: string;
  is_default: boolean;
  billing_details: Immutable.ImmutableObject<MarketplacePaymentMethodBillingDetails>;
};

export type PaymentConfigData = {
  payment_method: number;
  payment_method_id: string | null;
};

export type PayoutLegacy = {
  date_created: string;
  status: number;
  payments: Array<any>;
  amount_cts: number;
  company: number;
  id: number;
  readable_identifier: string;
  amount_cts_from_previous_included_payouts: number;
  is_included_in_payout?: {
    id: number;
    date_created: string;
    readable_identifier: string;
  };
  automatic: boolean;
};

export type StripePayout = {
  id: string;
  loading: boolean;
  error: Error | null;
  stripe_id: number;
  amount_cts: number;
  status: number;
  date_created: number;
  bsport_payout_object: PayoutLegacy;
  startingAfter: string | null;
  hasMore: boolean;
};

// New payout type
export type Payout = {
  id: number;
  company: number;
  _payment_backend_id: string;
  date_created: string;
  amount_cts: number;
  readable_identifier: string;
  status: number;
  reconciliation_status?:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'partially_failed'
    | 'skipped_manual';
  is_included_in_payout: {
    id: number;
    readable_identifier: string;
    payment_provider_date_created: string;
  } | null;
  amount_cts_from_previous_included_payouts: number;
  balance_transaction_count: number;
  payment_count: number;
  refund_count: number;
  dispute_count: number;
  failed_direct_debit_original_count: number;
  failed_direct_debit_reversal_count: number;
  balance_transfer_count: number;
  balance_transfer_refund_count: number;
  adjustment_count: number;
  application_fee_count: number;
  application_fee_refund_count: number;
  payout_failure_count: number;
  payout_cancel_count: number;
  payment_provider_date_created: string;
};

export type PayoutListResponse = {
  links: { next: string | null; previous: string | null };
  next_page: number | null;
  page: number;
  count: number;
  results: Payout[];
};

type PayoutRef = {
  id: number;
  readable_identifier: string;
  date_created: string;
};

export type ReconciledBsportPayment = {
  id: number;
  uuid: string;
  price: string;
  payment_received: boolean;
  payment_method: number;
  date: string;
  invoice: {
    uuid: string;
    public_identifier: string;
    amount_due_cts: number;
    issue_date: string;
  };
};

export type BalanceTransactionDisplayType =
  | 'payment'
  | 'refund'
  | 'dispute'
  | 'failed_direct_debit_original'
  | 'failed_direct_debit_reversal'
  | 'balance_transfer'
  | 'balance_transfer_refund'
  | 'adjustment'
  | 'application_fee'
  | 'application_fee_refund'
  | 'payout_failure'
  | 'payout_cancel'
  | 'other';

export type BalanceTransaction = {
  id: number;
  payment_provider_id: string;
  amount_cts: number;
  fee_cts: number;
  net_cts: number;
  currency: string;
  payment_provider_type: string;
  reconciliation_status: 'success' | 'error' | 'pending';
  error_type: string;
  display_type: BalanceTransactionDisplayType;
  description: string;
  source_payment_method: string;
  reconciled_bsport_payments: ReconciledBsportPayment[];
  reversal_of_balance_transaction_id: number | null;
  reversal_of_balance_transaction_payout: PayoutRef | null;
  reversal_balance_transaction_payout: PayoutRef | null;
  reconciled_bsport_payout: PayoutRef | null;
};

export type BalanceTransactionListResponse = {
  links: { next: string | null; previous: string | null };
  next_page: number | null;
  page: number;
  count: number;
  results: BalanceTransaction[];
};

export type StripeBalance = {
  isLoading: boolean;
  error: Error | null;
  amountAvailable: number;
  amountPending: number;
};

export type PaymentInstalmentData = {
  nb_interval: number;
  recurrence_basis: number;
  interval: string;
  anchor_date: string;
};

export type IntervalType = 'month' | 'week' | 'year' | 'day';

export type StripeSetupIntentResponse = {
  setupIntent: {
    payment_method_id: string;
  };
};

export type Payment = {
  uuid: string;
  price: string;
  id: number;
  payment_received: boolean;
  payment_method: number;
  payment_note: string;
  invoice: number;
  stripe_charge_id: string;
  date: string;
  reverted: boolean;
  is_method_editable: boolean;
  is_returnable: boolean;
  transaction_fee: number;
  payment_engine: number;
  is_v2: boolean;
  is_processing: boolean;
  returned_amount: number;
};

export type CreatePaymentAttemptResponsePayload = {
  payment_attempt_id: string;
  payment_attempt_amount: number;
};

export type PaymentAttemptMinimal = {
  id: string;
  amount: number;
};

export enum TermsAndConditionType {
  GENERAL_TERMS_OF_USE = 'generalTermsOfUse',
  TERMS_AND_CONDITIONS = 'theTermsAndConditions',
  WAIVER = 'waiver',
}

export type PaymentGroup = {
  id: number;
  member: number;
  invoice: string | null;
  basket: number | null;
  payment_method_identifier: number;
  client_secret: string;
  price_cts: number;
  currency: string;
  status: number;
};

export type InternalPaymentPayload = {
  date: string;
  payment_backend_id?: string;
  payment_method_identifier: number;
  payment_note: string;
  price_cts?: number;
  secret?: string;
};

export type StripeAPIException = {
  type?: string;
  message: string;
  code: string;
  decline_code?: string;
};

export type PaymentEngine =
  | typeof PAYMENT_ENGINE_STRIPE
  | typeof PAYMENT_ENGINE_BSPORT;

export type BookkeepingAccount = {
  id: number;
  company_id: number;
  account_number: string;
  account_name: string;
  vat_rate: string;
  created_at: string;
  updated_at: string;
};

export type BookkeepingAccountSubmitParams = Omit<
  BookkeepingAccount,
  'id' | 'company_id' | 'created_at' | 'updated_at'
>;

export type fetchBookkeepingAccountListFilter = {
  is_active?: boolean;
};

export type DetachPaymentMethodPayload = {
  payment_method_id: string;
} & (
  | {
      company: number;
      member?: number;
    }
  | {
      member: number;
      company?: number;
    }
);
export type DetachPaymentMethodResponse = {
  payment_backend_payment_method_id: string | null;
};

export type PayPalScriptProviderOptions = {
  clientId: string;
  merchantId: string;
  components: string;
  currency: string;
  integrationDate: string;
  debug: boolean;
  commit: boolean;
  intent: string;
  dataPartnerAttributionId: string;
  locale?: string;
};

export type PaymentGroupBillingEstablishmentPayload = {
  paymentGroupId: number;
  establishmentId: number | null;
};

export type UpdatePaymentIntentArgs = {
  save_for_later: boolean;
  payment_group_id: number;
};

export type UpdatePaymentIntentResult = {
  client_secret: string;
};

export type StripePaymentMethodDomain = {
  id: number;
  pk: number;
  stripe_company: number;
  company: number;
  payment_provider_id: string;
  status: string;
  domain_name: string;
  created_at: string;
  updated_at: string;
};

export type StripeDomainListState = {
  loading: boolean;
  error: Error | null;
  items: StripePaymentMethodDomain[];
  registerError: Error | null;
};
