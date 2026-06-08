import type {
  CreateExpensesCompleteFilterPayload,
  ExpensesCompleteFilter,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type {
  DirtyPatchPayload,
  PurchaseHistoryFilterFormValue,
} from "../types";
import type { PurchaseHistorySubFilterId } from "./purchase-history-sub-filter-id";
import type { PurchaseHistorySubFilterSectionProps } from "./purchase-history-sub-filter-section-props";

export type PurchaseHistorySubFilterModule = SubFilterModule<
  PurchaseHistorySubFilterId,
  PurchaseHistoryFilterFormValue,
  ExpensesCompleteFilter,
  CreateExpensesCompleteFilterPayload,
  DirtyPatchPayload,
  PurchaseHistorySubFilterSectionProps
>;
