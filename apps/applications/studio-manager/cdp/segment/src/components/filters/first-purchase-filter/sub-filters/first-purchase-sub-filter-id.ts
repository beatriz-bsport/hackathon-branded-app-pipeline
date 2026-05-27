export const FIRST_PURCHASE_SUB_FILTER_IDS = {
  purchaseDate: "purchaseDate",
} as const;

export type FirstPurchaseSubFilterId =
  (typeof FIRST_PURCHASE_SUB_FILTER_IDS)[keyof typeof FIRST_PURCHASE_SUB_FILTER_IDS];

export type FirstPurchaseSubFilterField = "purchaseDate";

export const firstPurchaseSubFilterFieldMap: Record<
  FirstPurchaseSubFilterId,
  FirstPurchaseSubFilterField
> = {
  [FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate]: "purchaseDate",
};
