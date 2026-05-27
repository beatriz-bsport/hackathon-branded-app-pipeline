import {
  type CreateFirstPurchaseFilterPayload,
  type FirstPurchaseFilter,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { firstPurchaseStatusToApi } from "#src/components/filters/first-purchase-filter/constants";
import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { FirstPurchaseFilterFormValue } from "../../types";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "../first-purchase-sub-filter-id";
import type { FirstPurchaseSubFilterModule } from "../first-purchase-sub-filter-module-contract";
import { PurchaseAmountSubFilterSection } from "./purchase-amount.component";
import { refinePurchaseAmountSubFilter } from "./schema";
import {
  mapPaymentComparator,
  toFormPurchaseAmountSection,
  toNumericApiValue,
} from "./utils";

const PURCHASE_AMOUNT_INACTIVE_API_SLICE: Partial<CreateFirstPurchaseFilterPayload> =
  {
    value_payment_active: false,
    comparator_payment: SmartlistPaymentComparator.GTE,
    value_payment: 0,
    value_second_payment: 0,
  };

const toPurchaseAmountApiSlice = (
  value: FirstPurchaseFilterFormValue,
): Partial<CreateFirstPurchaseFilterPayload> => {
  if (
    !firstPurchaseStatusToApi(value.firstPurchaseStatus) ||
    !value.subFilters.includes(FIRST_PURCHASE_SUB_FILTER_IDS.purchaseAmount)
  ) {
    return PURCHASE_AMOUNT_INACTIVE_API_SLICE;
  }

  return {
    value_payment_active: true,
    comparator_payment: mapPaymentComparator(value.purchaseAmount.operator),
    value_payment: toNumericApiValue(value.purchaseAmount.firstValue),
    value_second_payment: toNumericApiValue(value.purchaseAmount.secondValue),
  };
};

export const purchaseAmountFirstPurchaseSubFilterModule: FirstPurchaseSubFilterModule =
  {
    id: FIRST_PURCHASE_SUB_FILTER_IDS.purchaseAmount,
    labelKey: "filters.28.subFilters.purchaseAmount",
    Section: PurchaseAmountSubFilterSection,
    refine: refinePurchaseAmountSubFilter,
    readFromApi: (filter: FirstPurchaseFilter) => ({
      isActive: filter.value_payment_active === true,
      partial: {
        purchaseAmount: toFormPurchaseAmountSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toPurchaseAmountApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const purchaseAmountDirty = hasNestedDirty(dirtyFields.purchaseAmount);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !purchaseAmountDirty && !subFiltersTouched) {
        return {};
      }
      return toPurchaseAmountApiSlice(value);
    },
  };
