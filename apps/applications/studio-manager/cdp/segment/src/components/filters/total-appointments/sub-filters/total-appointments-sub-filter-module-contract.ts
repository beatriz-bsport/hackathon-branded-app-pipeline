import type {
  CreatePrivateBookingsFilterPayload,
  PrivateBookingsFilter,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type { TotalAppointmentsNumberFilterFormValue } from "../types";
import type { TotalAppointmentsSubFilterId } from "./total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterSectionProps } from "./total-appointments-sub-filter-section-props";

export type TotalAppointmentsSubFilterModule = SubFilterModule<
  TotalAppointmentsSubFilterId,
  TotalAppointmentsNumberFilterFormValue,
  PrivateBookingsFilter,
  CreatePrivateBookingsFilterPayload,
  Partial<
    Omit<PrivateBookingsFilter, "id" | "company_id" | "filter_identifier">
  >,
  TotalAppointmentsSubFilterSectionProps
>;
