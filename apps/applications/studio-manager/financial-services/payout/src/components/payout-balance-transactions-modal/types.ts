import type { ChipProps } from "@bsport/kaizen-primitive-core";

/**
 * Balance transaction display_type from the API.
 * Used for the "Type" column in the balance transactions table.
 */
export const BALANCE_TRANSACTION_DISPLAY_TYPES = [
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

export type BalanceTransactionDisplayType =
  (typeof BALANCE_TRANSACTION_DISPLAY_TYPES)[number];

/** i18n key for modal display type column */
export type ModalDisplayTypeKey =
  | `modal.displayType.${BalanceTransactionDisplayType}`
  | "modal.displayType.other";

/** String → display type map for safe lookup (no cast) */
export const DISPLAY_TYPE_MAP: Record<string, BalanceTransactionDisplayType> =
  (() => {
    const m: Record<string, BalanceTransactionDisplayType> = {};
    for (const v of BALANCE_TRANSACTION_DISPLAY_TYPES) {
      m[v] = v;
    }
    return m;
  })();

/**
 * Balance transaction reconciliation_status from the API.
 * Used for the "Status" column.
 */
export const BALANCE_TRANSACTION_RECONCILIATION_STATUSES = [
  "success",
  "skipped",
  "error",
  "pending",
] as const;

export type BalanceTransactionReconciliationStatus =
  (typeof BALANCE_TRANSACTION_RECONCILIATION_STATUSES)[number];

/** i18n key for modal reconciliation status column */
export type ModalReconciliationStatusKey =
  `modal.reconciliationStatus.${BalanceTransactionReconciliationStatus}`;

/** String → reconciliation status map for safe lookup (no cast) */
export const RECONCILIATION_STATUS_MAP: Record<
  string,
  BalanceTransactionReconciliationStatus
> = (() => {
  const m: Record<string, BalanceTransactionReconciliationStatus> = {};
  for (const v of BALANCE_TRANSACTION_RECONCILIATION_STATUSES) {
    m[v] = v;
  }
  return m;
})();

/**
 * Chip color for each balance transaction reconciliation status.
 */
export const RECONCILIATION_STATUS_CHIP_COLOR: Record<
  BalanceTransactionReconciliationStatus,
  ChipProps["color"]
> = {
  success: "positive",
  skipped: "warning",
  error: "critical",
  pending: "warning",
};
