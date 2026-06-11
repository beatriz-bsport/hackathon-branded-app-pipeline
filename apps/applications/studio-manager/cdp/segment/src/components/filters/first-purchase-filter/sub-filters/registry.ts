import type { FirstPurchaseSubFilterId } from "./first-purchase-sub-filter-id";
import type { FirstPurchaseSubFilterModule } from "./first-purchase-sub-filter-module-contract";
import { purchaseAmountFirstPurchaseSubFilterModule } from "./purchase-amount/module";
import { purchaseDateFirstPurchaseSubFilterModule } from "./purchase-date/module";

/**
 * Ordered list of first-purchase sub-filter modules.
 */
export const REGISTERED_FIRST_PURCHASE_SUB_FILTERS: FirstPurchaseSubFilterModule[] =
  [
    purchaseDateFirstPurchaseSubFilterModule,
    purchaseAmountFirstPurchaseSubFilterModule,
  ];

export const REGISTERED_FIRST_PURCHASE_SUB_FILTERS_BY_ID =
  REGISTERED_FIRST_PURCHASE_SUB_FILTERS.reduce(
    (accumulator, subFilterModule) => {
      accumulator[subFilterModule.id] = subFilterModule;
      return accumulator;
    },
    {} as Record<FirstPurchaseSubFilterId, FirstPurchaseSubFilterModule>,
  );
