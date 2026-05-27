export const FIRST_PURCHASE_SUB_FILTER_IDS = {
  purchaseDate: "purchaseDate",
  purchaseAmount: "purchaseAmount",
} as const;

export type FirstPurchaseSubFilterId =
  (typeof FIRST_PURCHASE_SUB_FILTER_IDS)[keyof typeof FIRST_PURCHASE_SUB_FILTER_IDS];

export type FirstPurchaseSubFilterField = "purchaseDate" | "purchaseAmount";

export const firstPurchaseSubFilterFieldMap: Record<
  FirstPurchaseSubFilterId,
  FirstPurchaseSubFilterField
> = {
  [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate]: "purchaseDate",
  [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseAmount]: "purchaseAmount",
};
