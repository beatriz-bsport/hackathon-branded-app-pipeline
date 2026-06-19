import type {
  CreatePrivatePassFilterPayload,
  PrivatePassFilter,
} from "@bsport/api-cdp/smartlist";

import type {
  PassOption,
  PassesFilterFormValue,
} from "#src/components/filters/passes-filter/types";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

/**
 * Form value used by the appointment pass (private pass, id 25) card.
 *
 * Structurally identical to {@link PassesFilterFormValue} so
 * {@link PassesFilterSubFiltersArea} and the pass sub-filter modules can be
 * reused without duplication. Mappers translate `selectAllPaymentPacks` /
 * `selectedPaymentPackIds` to `select_all_private_passes` / `private_passes`.
 */
export type AppointmentPassFilterFormValue = PassesFilterFormValue;

export type AppointmentPassDirtyPatchPayload = Partial<
  Omit<PrivatePassFilter, "id" | "company_id" | "filter_identifier">
>;

export type AppointmentPassFilterCreatePayload = CreatePrivatePassFilterPayload;

export type AppointmentPassFilterCardProps =
  SegmentFilterCardProps<AppointmentPassFilterFormValue> & {
    passOptions: PassOption[];
  };
