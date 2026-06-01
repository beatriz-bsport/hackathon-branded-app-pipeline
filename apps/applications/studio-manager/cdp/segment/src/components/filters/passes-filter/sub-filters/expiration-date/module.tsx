import { DateTime } from "luxon";

import {
  type CreatePaymentPackFilterPayload,
  type PaymentPackFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";
import {
  mapDateFilterType,
  toApiDateSection,
  toFormDateSection,
} from "#src/components/filters/shared/smartlist-date-filter/smartlist-date-utils";

import type { PassesFilterFormValue } from "../../types";
import { PASS_SUB_FILTER_IDS } from "../pass-sub-filter-id";
import type { PassSubFilterModule } from "../pass-sub-filter-module-contract";
import { ExpirationDateSubFilterSection } from "./component";
import { refineExpirationDateSubFilter } from "./schema";

const EXPIRATION_DATE_INACTIVE_API_SLICE: Partial<CreatePaymentPackFilterPayload> =
  {
    expiration_date_filter_active: false,
    expiration_date_filter_type: SmartlistDateFilterType.DATE_AFTER,
    expiration_date: DateTime.now().toFormat("yyyy-MM-dd"),
    expiration_date_second: DateTime.now().toFormat("yyyy-MM-dd"),
    expiration_duration: 0,
    expiration_duration_second: 0,
  };

const toExpirationDateApiSlice = (
  value: PassesFilterFormValue,
): Partial<CreatePaymentPackFilterPayload> => {
  if (!value.subFilters.includes(PASS_SUB_FILTER_IDS.expirationDate)) {
    return EXPIRATION_DATE_INACTIVE_API_SLICE;
  }

  const expirationDateType = mapDateFilterType(value.expirationDate);
  const expirationDateSection = toApiDateSection(
    value.expirationDate,
    expirationDateType,
  );

  return {
    expiration_date_filter_active: true,
    expiration_date_filter_type: expirationDateType,
    expiration_date: expirationDateSection.fromDate,
    expiration_date_second: expirationDateSection.toDate,
    expiration_duration: expirationDateSection.firstDurationValue,
    expiration_duration_second: expirationDateSection.secondDurationValue,
  };
};

export const expirationDatePassSubFilterModule: PassSubFilterModule = {
  id: PASS_SUB_FILTER_IDS.expirationDate,
  labelKey: "filters.19.subFilters.expirationDate",
  Section: ExpirationDateSubFilterSection,
  refine: refineExpirationDateSubFilter,
  readFromApi: (filter: PaymentPackFilter) => ({
    isActive: filter.expiration_date_filter_active,
    partial: {
      expirationDate: toFormDateSection(
        filter.expiration_date_filter_type,
        filter.expiration_date,
        filter.expiration_date_second,
        filter.expiration_duration,
        filter.expiration_duration_second,
      ),
    },
  }),
  appendCreatePayloadSlice: (value) => toExpirationDateApiSlice(value),
  appendDirtyPatchSlice: (dirtyFields, value) => {
    const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
    const expirationDateDirty = hasNestedDirty(dirtyFields.expirationDate);
    if (!subFiltersDirty && !expirationDateDirty) {
      return {};
    }
    return toExpirationDateApiSlice(value);
  },
};
