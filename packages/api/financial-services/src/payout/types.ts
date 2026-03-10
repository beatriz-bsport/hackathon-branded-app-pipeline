export type PayoutListLinks = {
  next: string | null;
  previous: string | null;
};

export type PayoutListItemIncludedInPayout = {
  id: number;
  readable_identifier: string;
  payment_provider_date_created: string;
};

export type PayoutListItem = {
  id: number;
  company: number;
  _payment_backend_id: string;
  payment_provider_date_created: string;
  amount_cts: number;
  readable_identifier: string;
  status: number;
  reconciliation_status: string;
  is_included_in_payout: PayoutListItemIncludedInPayout | null;
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
};

export type PayoutListResponse = {
  links: PayoutListLinks;
  next_page: number | null;
  page: number;
  count: number;
  results: PayoutListItem[];
};

export type BalanceTransactionDisplayStats = {
  amount_cts: number;
  count: number;
};

export type BalanceTransactionStats = {
  by_display_type: Record<string, BalanceTransactionDisplayStats>;
  no_display_type: BalanceTransactionDisplayStats;
};

export type PayoutDetailResponse = {
  id: number;
  company: number;
  _payment_backend_id: string;
  amount_cts: number;
  readable_identifier: string;
  status: number;
  automatic: boolean;
  reconciliation_status: string;
  reconciliation_date: string | null;
  payment_provider_arrival_date: string;
  payment_provider_date_created: string;
  is_included_in_payout: PayoutListItemIncludedInPayout | null;
  amount_cts_from_previous_included_payouts: number;
  balance_transaction_stats: BalanceTransactionStats;
};

export type ReconciledInvoice = {
  uuid: string;
  public_identifier: string;
  amount_due_cts: number;
  issue_date: string;
};

export type ReconciledBsportPayment = {
  id: number;
  uuid: string;
  price: string;
  payment_received: boolean;
  payment_method: number;
  date: string;
  invoice: ReconciledInvoice;
};

export type BalanceTransactionPayoutSummary = {
  id: number;
  readable_identifier: string;
  payment_provider_date_created: string;
};

export type PayoutBalanceTransaction = {
  id: number;
  payment_provider_id: string;
  amount_cts: number;
  fee_cts: number;
  net_cts: number;
  currency: string;
  payment_provider_type: string;
  reconciliation_status: string;
  error_type: string;
  display_type: string;
  description: string;
  source_payment_method: string;
  reconciled_bsport_payments: ReconciledBsportPayment[];
  reversal_of_balance_transaction_id: number | null;
  reversal_of_balance_transaction_payout: BalanceTransactionPayoutSummary | null;
  reversal_balance_transaction_payout: BalanceTransactionPayoutSummary | null;
  reconciled_bsport_payout: BalanceTransactionPayoutSummary | null;
};

export type PayoutBalanceTransactionsListResponse = {
  links: PayoutListLinks;
  next_page: number | null;
  page: number;
  count: number;
  results: PayoutBalanceTransaction[];
};

export type GetPayoutListRequest = {
  page: number;
  page_size?: number;
};

export type GetPayoutDetailRequest = {
  payout_id: number;
};

export type GetPayoutBalanceTransactionsRequest = {
  payout_id: number;
  page: number;
  page_size?: number;
};
