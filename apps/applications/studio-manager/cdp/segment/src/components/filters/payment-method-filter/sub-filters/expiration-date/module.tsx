import {
  type CreatePaymentMethodFilterPayload,
  type PaymentMethodFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { ownsPaymentMethodToApi } from "#src/components/filters/payment-method-filter/constants";
import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";
import {
  mapDateFilterType,
  toApiDateSection,
  toFormDateSection,
} from "#src/components/filters/shared/smartlist-date-filter/smartlist-date-utils";

import type { PaymentMethodFilterFormValue } from "../../types";
import { PAYMENT_METHOD_SUB_FILTER_IDS } from "../payment-method-sub-filter-id";
import type { PaymentMethodSubFilterModule } from "../payment-method-sub-filter-module-contract";
import { ExpirationDateSubFilterSection } from "./component";
import { refineExpirationDateSubFilter } from "./schema";

const EXPIRATION_DATE_INACTIVE_API_SLICE: Partial<CreatePaymentMethodFilterPayload> =
  {
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_BEFORE,
    date: null,
    date_second: null,
    duration: 0,
    duration_second: 0,
  };

const toExpirationDateApiSlice = (
  value: PaymentMethodFilterFormValue,
): Partial<CreatePaymentMethodFilterPayload> => {
  if (
    !ownsPaymentMethodToApi(value.ownsPaymentMethod) ||
    !value.subFilters.includes(PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate)
  ) {
    return EXPIRATION_DATE_INACTIVE_API_SLICE;
  }

  const expirationDateType = mapDateFilterType(value.expirationDate);
  const expirationDateSection = toApiDateSection(
    value.expirationDate,
    expirationDateType,
  );

  return {
    date_filter_active: true,
    date_filter_type: expirationDateType,
    date: expirationDateSection.fromDate,
    date_second: expirationDateSection.toDate,
    duration: expirationDateSection.firstDurationValue,
    duration_second: expirationDateSection.secondDurationValue,
  };
};

export const expirationDatePaymentMethodSubFilterModule: PaymentMethodSubFilterModule =
  {
    id: PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate,
    labelKey: "filters.600.subFilters.expirationDate",
    Section: ExpirationDateSubFilterSection,
    refine: refineExpirationDateSubFilter,
    readFromApi: (filter: PaymentMethodFilter) => ({
      isActive:
        filter.owns_payment_method === true &&
        filter.date_filter_active === true,
      partial: {
        expirationDate: toFormDateSection(
          filter.date_filter_type,
          filter.date ?? "",
          filter.date_second ?? "",
          filter.duration,
          filter.duration_second,
        ),
      },
    }),
    appendCreatePayloadSlice: (value) => toExpirationDateApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const expirationDateDirty = hasNestedDirty(dirtyFields.expirationDate);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !expirationDateDirty && !subFiltersTouched) {
        return {};
      }
      return toExpirationDateApiSlice(value);
    },
  };
