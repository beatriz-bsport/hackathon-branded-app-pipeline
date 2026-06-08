import { purchaseDatePurchaseHistorySubFilterModule } from "./purchase-date/module";
import type { PurchaseHistorySubFilterModule } from "./purchase-history-sub-filter-module-contract";

export const REGISTERED_PURCHASE_HISTORY_SUB_FILTERS: PurchaseHistorySubFilterModule[] =
  [purchaseDatePurchaseHistorySubFilterModule];
