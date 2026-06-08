import type {
  BasketAbandonmentFilter,
  UpdateBasketAbandonmentFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";

import type { BasketAbandonmentSubFilterId } from "./sub-filters/basket-abandonment-sub-filter-id";

export type BasketAbandonmentFilterFormValue = {
  id?: number;
  smartlist: number;
  subFilters: BasketAbandonmentSubFilterId[];
  basketValue: NumericComparatorFilterValue;
  abandonmentDate: DateFilterValue;
};

export type BasketAbandonmentFilterCardProps = {
  smartlistId: string;
  filterValue: BasketAbandonmentFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type BasketAbandonmentDirtyPatchPayload =
  UpdateBasketAbandonmentFilterPayload;

export type { BasketAbandonmentFilter };
