import type { FirstPurchaseSubFilterModule } from "./first-purchase-sub-filter-module-contract";
import { purchaseDateFirstPurchaseSubFilterModule } from "./purchase-date/purchase-date.module";

/**
 * Ordered list of first-purchase sub-filter modules.
 */
export const REGISTERED_FIRST_PURCHASE_SUB_FILTERS: FirstPurchaseSubFilterModule[] =
  [purchaseDateFirstPurchaseSubFilterModule];
