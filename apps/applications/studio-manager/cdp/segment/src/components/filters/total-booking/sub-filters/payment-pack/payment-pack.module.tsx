import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";
import type { TotalBookingSubFilterModule } from "../total-booking-sub-filter-module-contract";
import { PaymentPackSubFilterSection } from "./payment-pack.component";
import { refinePaymentPackSubFilter } from "./schema";

const PAYMENT_PACK_INACTIVE_API_SLICE: Partial<CreateTotalBookingFilterPayload> =
  {
    payment_pack_filter_active: false,
    select_all_payment_packs: true,
    payment_packs: [],
  };

const toPaymentPackApiSlice = (
  value: TotalBookingNumberFilterFormValue,
): Partial<CreateTotalBookingFilterPayload> => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack)) {
    return PAYMENT_PACK_INACTIVE_API_SLICE;
  }

  return {
    payment_pack_filter_active: true,
    select_all_payment_packs: value.paymentPack.selectAllPaymentPacks,
    payment_packs: value.paymentPack.selectedPaymentPackIds,
  };
};

const toFormPaymentPackSection = (filter: TotalBookingFilter) => ({
  selectAllPaymentPacks: filter.select_all_payment_packs,
  selectedPaymentPackIds: filter.payment_packs ?? [],
});

export const paymentPackTotalBookingSubFilterModule: TotalBookingSubFilterModule =
  {
    id: TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack,
    labelKey: "filters.22.subFilters.passes",
    Section: PaymentPackSubFilterSection,
    refine: refinePaymentPackSubFilter,
    readFromApi: (filter) => ({
      isActive: filter.payment_pack_filter_active,
      partial: {
        paymentPack: toFormPaymentPackSection(filter),
      },
    }),
    appendCreatePayloadSlice: (value) => toPaymentPackApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const paymentPackDirty = hasNestedDirty(dirtyFields.paymentPack);
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !paymentPackDirty && !subFiltersTouched) {
        return {};
      }
      return toPaymentPackApiSlice(value);
    },
  };
