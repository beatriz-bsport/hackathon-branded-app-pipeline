import {
  type CreateExpensesCompleteFilterPayload,
  type ExpensesCompleteFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";
import {
  mapDateFilterType,
  toApiDateSection,
  toFormDateSection,
} from "#src/components/filters/shared/smartlist-date-filter/smartlist-date-utils";
import {
  DEFAULT_ABSOLUTE_START_DATE,
  DEFAULT_RELATIVE_SECOND_DAYS,
  DEFAULT_RELATIVE_START_DAYS,
} from "#src/components/primitive-filters/date-filter/utils";

import type { PurchaseHistoryFilterFormValue } from "../../types";
import { PURCHASE_HISTORY_SUB_FILTER_IDS } from "../purchase-history-sub-filter-id";
import type { PurchaseHistorySubFilterModule } from "../purchase-history-sub-filter-module-contract";
import { PurchaseDateSubFilterSection } from "./component";
import { refinePurchaseDateSubFilter } from "./schema";

const PURCHASE_DATE_INACTIVE_API_SLICE: Partial<CreateExpensesCompleteFilterPayload> =
  {
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_EXACT,
    date: DEFAULT_ABSOLUTE_START_DATE,
    date_second: DEFAULT_ABSOLUTE_START_DATE,
    duration: DEFAULT_RELATIVE_START_DAYS,
    duration_second: DEFAULT_RELATIVE_SECOND_DAYS,
  };

const toPurchaseDateApiSlice = (
  value: PurchaseHistoryFilterFormValue,
): Partial<CreateExpensesCompleteFilterPayload> => {
  if (
    !value.subFilters.includes(PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate)
  ) {
    return PURCHASE_DATE_INACTIVE_API_SLICE;
  }

  const purchaseDateType = mapDateFilterType(value.purchaseDate);
  const purchaseDateSection = toApiDateSection(
    value.purchaseDate,
    purchaseDateType,
  );

  return {
    date_filter_active: true,
    date_filter_type: purchaseDateType,
    date: purchaseDateSection.fromDate,
    date_second: purchaseDateSection.toDate,
    duration: purchaseDateSection.firstDurationValue,
    duration_second: purchaseDateSection.secondDurationValue,
  };
};

export const purchaseDatePurchaseHistorySubFilterModule: PurchaseHistorySubFilterModule =
  {
    id: PURCHASE_HISTORY_SUB_FILTER_IDS.purchaseDate,
    labelKey: "filters.24.subFilters.purchaseDate",
    Section: PurchaseDateSubFilterSection,
    refine: refinePurchaseDateSubFilter,
    readFromApi: (filter: ExpensesCompleteFilter) => ({
      isActive: filter.date_filter_active === true,
      partial: {
        purchaseDate: toFormDateSection(
          filter.date_filter_type,
          filter.date,
          filter.date_second,
          filter.duration,
          filter.duration_second,
        ),
      },
    }),
    appendCreatePayloadSlice: (value) => toPurchaseDateApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const purchaseDateDirty = hasNestedDirty(dirtyFields.purchaseDate);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !purchaseDateDirty && !subFiltersTouched) {
        return {};
      }
      return toPurchaseDateApiSlice(value);
    },
  };
