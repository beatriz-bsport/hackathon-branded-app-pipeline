import {
  type CreatePaymentPackFilterPayload,
  type PaymentPackFilter,
  SmartlistCreditComparator,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { PassesFilterFormValue } from "../../types";
import { PASS_SUB_FILTER_IDS } from "../pass-sub-filter-id";
import type { PassSubFilterModule } from "../pass-sub-filter-module-contract";
import { CreditLeftSubFilterSection } from "./component";
import { refineCreditLeftSubFilter } from "./schema";
import {
  mapCreditComparator,
  toFormCreditSection,
  toNumericApiValue,
} from "./utils";

const CREDIT_LEFT_INACTIVE_API_SLICE: Partial<CreatePaymentPackFilterPayload> =
  {
    credit_filter_active: false,
    credit_comparator: SmartlistCreditComparator.GTE,
    credit_value: 0,
    credit_value_second: 0,
  };

const toCreditLeftApiSlice = (
  value: PassesFilterFormValue,
): Partial<CreatePaymentPackFilterPayload> => {
  if (!value.subFilters.includes(PASS_SUB_FILTER_IDS.creditLeft)) {
    return CREDIT_LEFT_INACTIVE_API_SLICE;
  }

  return {
    credit_filter_active: true,
    credit_comparator: mapCreditComparator(value.creditLeft.operator),
    credit_value: toNumericApiValue(value.creditLeft.firstValue),
    credit_value_second: toNumericApiValue(value.creditLeft.secondValue),
  };
};

export const creditLeftPassSubFilterModule: PassSubFilterModule = {
  id: PASS_SUB_FILTER_IDS.creditLeft,
  labelKey: "filters.19.subFilters.creditLeft",
  Section: CreditLeftSubFilterSection,
  refine: refineCreditLeftSubFilter,
  readFromApi: (filter: PaymentPackFilter) => ({
    isActive: filter.credit_filter_active,
    partial: {
      creditLeft: toFormCreditSection(filter),
    },
  }),
  appendCreatePayloadSlice: (value) => toCreditLeftApiSlice(value),
  appendDirtyPatchSlice: (dirtyFields, value) => {
    const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
    const creditLeftDirty = hasNestedDirty(dirtyFields.creditLeft);
    if (!subFiltersDirty && !creditLeftDirty) {
      return {};
    }
    return toCreditLeftApiSlice(value);
  },
};
