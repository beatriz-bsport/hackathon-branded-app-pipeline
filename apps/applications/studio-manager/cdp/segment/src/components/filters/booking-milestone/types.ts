import type {
  BookingMilestoneFilter,
  CreateBookingMilestoneFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { TotalBookingNumberFilterFormValue } from "#src/components/filters/total-booking/types";

/**
 * Form value used by the booking milestone (id 21) card.
 *
 * Structurally identical to {@link TotalBookingNumberFilterFormValue} so the
 * shared total-booking sub-filter modules (activity, attendance, booking date,
 * booking hour range, coach, establishment, level, payment pack) can be reused
 * without duplication. The booking-milestone-specific logic only reads `value`
 * (milestone index, 1-based) and the sub-filter slices; `type` / `secondValue`
 * live in the form state but are not surfaced in the milestone UI and are
 * dropped by the milestone mappers.
 */
export type BookingMilestoneFilterFormValue = TotalBookingNumberFilterFormValue;

export type BookingMilestoneDirtyPatchPayload = Partial<
  Omit<BookingMilestoneFilter, "id" | "company_id" | "filter_identifier">
>;

export type BookingMilestoneFilterCreatePayload =
  CreateBookingMilestoneFilterPayload;

export type BookingMilestoneFilterCardProps = {
  smartlistId: string;
  /** Studio tenant from the smartlist shell (same pattern as total-booking filter). */
  companyId: number;
  filterValue: BookingMilestoneFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type { BookingMilestoneSubFilterId } from "./sub-filters/booking-milestone-sub-filter-id";
