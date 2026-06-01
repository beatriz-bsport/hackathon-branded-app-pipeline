import {
  type CreateFirstPurchaseFilterPayload,
  type FirstPurchaseFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { firstPurchaseStatusToApi } from "#src/components/filters/first-purchase-filter/constants";
import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";
import {
  getDefaultApiDate,
  mapDateFilterType,
  toApiDateSection,
  toFormDateSection,
} from "#src/components/filters/shared/smartlist-date-filter/smartlist-date-utils";

import type { FirstPurchaseFilterFormValue } from "../../types";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "../first-purchase-sub-filter-id";
import type { FirstPurchaseSubFilterModule } from "../first-purchase-sub-filter-module-contract";
import { PurchaseDateSubFilterSection } from "./purchase-date.component";
import { refinePurchaseDateSubFilter } from "./schema";

const PURCHASE_DATE_INACTIVE_API_SLICE: Partial<CreateFirstPurchaseFilterPayload> =
  {
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_EXACT,
    date: getDefaultApiDate(),
    date_second: getDefaultApiDate(),
    duration: 0,
    duration_second: 0,
  };

const toPurchaseDateApiSlice = (
  value: FirstPurchaseFilterFormValue,
): Partial<CreateFirstPurchaseFilterPayload> => {
  if (
    !firstPurchaseStatusToApi(value.firstPurchaseStatus) ||
    !value.subFilters.includes(FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate)
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

export const purchaseDateFirstPurchaseSubFilterModule: FirstPurchaseSubFilterModule =
  {
    id: FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate,
    labelKey: "filters.28.subFilters.purchaseDate",
    Section: PurchaseDateSubFilterSection,
    refine: refinePurchaseDateSubFilter,
    readFromApi: (filter: FirstPurchaseFilter) => ({
      isActive:
        filter.first_payment_is_done === true &&
        filter.date_filter_active === true,
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
