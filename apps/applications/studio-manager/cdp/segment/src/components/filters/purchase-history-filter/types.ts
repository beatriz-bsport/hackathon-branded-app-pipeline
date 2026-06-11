import type {
  CreateExpensesCompleteFilterPayload,
  ExpensesCompleteFilter,
  UpdateExpensesCompleteFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";

import type { PurchaseHistorySubFilterId } from "./sub-filters/purchase-history-sub-filter-id";

export type PurchaseHistoryFilterFormValue = {
  id?: number;
  smartlist: number;
  totalSpent: NumericComparatorFilterValue;
  spentOn: number[];
  subFilters: PurchaseHistorySubFilterId[];
  purchaseDate: DateFilterValue;
};

export type PurchaseHistoryFilterCardProps = {
  smartlistId: string;
  filterValue: PurchaseHistoryFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type PurchaseHistoryFilterCreatePayload =
  CreateExpensesCompleteFilterPayload;
export type DirtyPatchPayload = UpdateExpensesCompleteFilterPayload;

export type { ExpensesCompleteFilter };
