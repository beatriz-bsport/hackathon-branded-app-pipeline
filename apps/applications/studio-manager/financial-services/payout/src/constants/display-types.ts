export const DISPLAY_TYPES = [
  "payment",
  "refund",
  "dispute",
  "failed_direct_debit_original",
  "failed_direct_debit_reversal",
  "balance_transfer",
  "balance_transfer_refund",
  "adjustment",
  "application_fee",
  "application_fee_refund",
  "payout",
  "payout_failure",
  "payout_cancel",
  "other",
] as const;

export type DisplayType = (typeof DISPLAY_TYPES)[number];
