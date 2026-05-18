import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type { TotalBookingNumberFilterFormValue } from "../types";
import type { TotalBookingSubFilterId } from "./total-booking-sub-filter-id";
import type { TotalBookingSubFilterSectionProps } from "./total-booking-sub-filter-section-props";

export type TotalBookingSubFilterModule = SubFilterModule<
  TotalBookingSubFilterId,
  TotalBookingNumberFilterFormValue,
  TotalBookingFilter,
  CreateTotalBookingFilterPayload,
  Partial<Omit<TotalBookingFilter, "id" | "company_id" | "filter_identifier">>,
  TotalBookingSubFilterSectionProps
>;
