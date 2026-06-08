export const PURCHASE_HISTORY_SUB_FILTER_IDS = {
  purchaseDate: "purchaseDate",
} as const;

export type PurchaseHistorySubFilterId =
  (typeof PURCHASE_HISTORY_SUB_FILTER_IDS)[keyof typeof PURCHASE_HISTORY_SUB_FILTER_IDS];

export type PurchaseHistorySubFilterField = "purchaseDate";

export const purchaseHistorySubFilterFieldMap: Record<
  PurchaseHistorySubFilterId,
  PurchaseHistorySubFilterField
> = {
  [PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate]: "purchaseDate",
};
