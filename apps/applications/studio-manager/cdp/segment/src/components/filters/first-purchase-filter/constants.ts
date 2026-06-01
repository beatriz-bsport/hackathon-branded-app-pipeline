/**
 * Radio `value` strings for the first-purchase status field (Kaizen RadioGroup).
 */
export const FIRST_PURCHASE_STATUS = {
  done: "done",
  notDone: "notDone",
} as const;

export type FirstPurchaseStatusOption =
  (typeof FIRST_PURCHASE_STATUS)[keyof typeof FIRST_PURCHASE_STATUS];

/**
 * Maps the UI radio option to the API `first_payment_is_done` boolean.
 */
export const firstPurchaseStatusToApi = (
  status: FirstPurchaseStatusOption,
): boolean => status === FIRST_PURCHASE_STATUS.done;

/**
 * Maps the API boolean to the UI radio option.
 */
export const firstPurchaseStatusFromApi = (
  firstPaymentIsDone: boolean,
): FirstPurchaseStatusOption =>
  firstPaymentIsDone
    ? FIRST_PURCHASE_STATUS.done
    : FIRST_PURCHASE_STATUS.notDone;
