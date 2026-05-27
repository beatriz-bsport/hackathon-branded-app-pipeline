import type {
  CreateFirstPurchaseFilterPayload,
  FirstPurchaseFilter,
  UpdateFirstPurchaseFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";

import type { FirstPurchaseStatusOption } from "./constants";
import type { FirstPurchaseSubFilterId } from "./sub-filters/first-purchase-sub-filter-id";

export type FirstPurchaseFilterFormValue = {
  id?: number;
  smartlist: number;
  firstPurchaseStatus: FirstPurchaseStatusOption;
  subFilters: FirstPurchaseSubFilterId[];
  purchaseDate: DateFilterValue;
  purchaseAmount: NumericComparatorFilterValue;
};

export type FirstPurchaseFilterCardProps = {
  smartlistId: string;
  filterValue: FirstPurchaseFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type FirstPurchaseFilterCreatePayload = CreateFirstPurchaseFilterPayload;
export type DirtyPatchPayload = UpdateFirstPurchaseFilterPayload;

export type { FirstPurchaseFilter };
