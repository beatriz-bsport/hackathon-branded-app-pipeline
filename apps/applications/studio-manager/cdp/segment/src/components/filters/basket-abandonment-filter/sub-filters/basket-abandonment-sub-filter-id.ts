export const BASKET_ABANDONMENT_SUB_FILTER_IDS = {
  abandonmentDate: "abandonmentDate",
} as const;

export type BasketAbandonmentSubFilterId =
  (typeof BASKET_ABANDONMENT_SUB_FILTER_IDS)[keyof typeof BASKET_ABANDONMENT_SUB_FILTER_IDS];

export type BasketAbandonmentSubFilterField = "abandonmentDate";

export const basketAbandonmentSubFilterFieldMap: Record<
  BasketAbandonmentSubFilterId,
  BasketAbandonmentSubFilterField
> = {
  [BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate]: "abandonmentDate",
};
