import { purchaseDatePurchaseHistorySubFilterModule } from "./purchase-date/module";
import type { PurchaseHistorySubFilterId } from "./purchase-history-sub-filter-id";
import type { PurchaseHistorySubFilterModule } from "./purchase-history-sub-filter-module-contract";

export const REGISTERED_PURCHASE_HISTORY_SUB_FILTERS: PurchaseHistorySubFilterModule[] =
  [purchaseDatePurchaseHistorySubFilterModule];

export const REGISTERED_PURCHASE_HISTORY_SUB_FILTERS_BY_ID =
  REGISTERED_PURCHASE_HISTORY_SUB_FILTERS.reduce(
    (accumulator, subFilterModule) => {
      accumulator[subFilterModule.id] = subFilterModule;
      return accumulator;
    },
    {} as Record<PurchaseHistorySubFilterId, PurchaseHistorySubFilterModule>,
  );
