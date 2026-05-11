import { DateTime } from "luxon";

import {
  type CreatePaymentPackFilterPayload,
  type PaymentPackFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import type { PassesFilterFormValue } from "../../types";
import { hasNestedDirty } from "../is-nested-dirty";
import { PASS_SUB_FILTER_IDS } from "../pass-sub-filter-id";
import type { PassSubFilterModule } from "../pass-sub-filter-module-contract";
import { PurchaseDateSubFilterSection } from "./purchase-date.component";
import { refinePurchaseDateSubFilter } from "./schema";
import {
  mapDateFilterType,
  toApiDateSection,
  toFormDateSection,
} from "./utils";

const PURCHASE_DATE_INACTIVE_API_SLICE =
  (): Partial<CreatePaymentPackFilterPayload> => ({
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_AFTER,
    date_bought: DateTime.now().toFormat("yyyy-MM-dd"),
    date_bought_second: DateTime.now().toFormat("yyyy-MM-dd"),
    duration_bought: 0,
    duration_bought_second: 0,
  });

const toPurchaseDateApiSlice = (
  value: PassesFilterFormValue,
): Partial<CreatePaymentPackFilterPayload> => {
  if (!value.subFilters.includes(PASS_SUB_FILTER_IDS.purchaseDate)) {
    return PURCHASE_DATE_INACTIVE_API_SLICE();
  }

  const purchaseDateType = mapDateFilterType(value.purchaseDate);
  const purchaseDateSection = toApiDateSection(
    value.purchaseDate,
    purchaseDateType,
  );

  return {
    date_filter_active: true,
    date_filter_type: purchaseDateType,
    date_bought: purchaseDateSection.fromDate,
    date_bought_second: purchaseDateSection.toDate,
    duration_bought: purchaseDateSection.firstDurationValue,
    duration_bought_second: purchaseDateSection.secondDurationValue,
  };
};

export const purchaseDatePassSubFilterModule: PassSubFilterModule = {
  id: PASS_SUB_FILTER_IDS.purchaseDate,
  labelKey: "filters.19.subFilters.purchaseDate",
  Section: PurchaseDateSubFilterSection,
  refine: refinePurchaseDateSubFilter,
  readFromApi: (filter: PaymentPackFilter) => ({
    isActive: filter.date_filter_active,
    partial: {
      purchaseDate: toFormDateSection(
        filter.date_filter_type,
        filter.date_bought,
        filter.date_bought_second,
        filter.duration_bought,
        filter.duration_bought_second,
      ),
    },
  }),
  appendCreatePayloadSlice: (value) => toPurchaseDateApiSlice(value),
  appendDirtyPatchSlice: (dirtyFields, value) => {
    const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
    const purchaseDateDirty = hasNestedDirty(dirtyFields.purchaseDate);
    if (!subFiltersDirty && !purchaseDateDirty) {
      return {};
    }
    return toPurchaseDateApiSlice(value);
  },
};
