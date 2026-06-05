import {
  type BasketAbandonmentFilter,
  type CreateBasketAbandonmentFilterPayload,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";
import {
  getDefaultApiDate,
  mapDateFilterType,
  toApiDateSection,
  toFormDateSection,
} from "#src/components/filters/shared/smartlist-date-filter/smartlist-date-utils";

import type { BasketAbandonmentFilterFormValue } from "../../types";
import { BASKET_ABANDONMENT_SUB_FILTER_IDS } from "../basket-abandonment-sub-filter-id";
import type { BasketAbandonmentSubFilterModule } from "../basket-abandonment-sub-filter-module-contract";
import { AbandonmentDateSubFilterSection } from "./component";
import { refineAbandonmentDateSubFilter } from "./schema";

const ABANDONMENT_DATE_INACTIVE_API_SLICE: Partial<CreateBasketAbandonmentFilterPayload> =
  {
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_EXACT,
    date: getDefaultApiDate(),
    date_second: getDefaultApiDate(),
    duration: 0,
    duration_second: 0,
  };

const toAbandonmentDateApiSlice = (
  value: BasketAbandonmentFilterFormValue,
): Partial<CreateBasketAbandonmentFilterPayload> => {
  if (
    !value.subFilters.includes(
      BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate,
    )
  ) {
    return ABANDONMENT_DATE_INACTIVE_API_SLICE;
  }

  const abandonmentDateType = mapDateFilterType(value.abandonmentDate);
  const abandonmentDateSection = toApiDateSection(
    value.abandonmentDate,
    abandonmentDateType,
  );

  return {
    date_filter_active: true,
    date_filter_type: abandonmentDateType,
    date: abandonmentDateSection.fromDate,
    date_second: abandonmentDateSection.toDate,
    duration: abandonmentDateSection.firstDurationValue,
    duration_second: abandonmentDateSection.secondDurationValue,
  };
};

export const abandonmentDateBasketAbandonmentSubFilterModule: BasketAbandonmentSubFilterModule =
  {
    id: BASKET_ABANDONMENT_SUB_FILTER_IDS.abandonmentDate,
    labelKey: "filters.20.subFilters.abandonmentDate",
    Section: AbandonmentDateSubFilterSection,
    refine: refineAbandonmentDateSubFilter,
    readFromApi: (filter: BasketAbandonmentFilter) => ({
      isActive: filter.date_filter_active === true,
      partial: {
        abandonmentDate: toFormDateSection(
          filter.date_filter_type,
          filter.date ?? getDefaultApiDate(),
          filter.date_second ?? getDefaultApiDate(),
          filter.duration,
          filter.duration_second,
        ),
      },
    }),
    appendCreatePayloadSlice: (value) => toAbandonmentDateApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const abandonmentDateDirty = hasNestedDirty(dirtyFields.abandonmentDate);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !abandonmentDateDirty && !subFiltersTouched) {
        return {};
      }
      return toAbandonmentDateApiSlice(value);
    },
  };
