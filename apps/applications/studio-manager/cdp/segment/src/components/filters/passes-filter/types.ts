import type { PaymentPackFilter } from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";

import type { OWNERSHIP_OPTIONS } from "./constants";
import type { PassSubFilterId } from "./sub-filters/pass-sub-filter-id";

/**
 * Ownership selection (matches `has_pack` boolean on the API side).
 */
export type OwnershipOption =
  (typeof OWNERSHIP_OPTIONS)[keyof typeof OWNERSHIP_OPTIONS];

/**
 * Form value for a single pass filter card.
 *
 * Each sub-filter adds an entry in `subFilters` plus a dedicated slot on this
 * object. See `REGISTERED_PASS_SUB_FILTERS` for the list of wired modules.
 */
export type PassesFilterFormValue = {
  id?: number;
  smartlist: number;
  ownership: OwnershipOption;
  selectAllPaymentPacks: boolean;
  selectedPaymentPackIds: number[];
  subFilters: PassSubFilterId[];
  purchaseDate: DateFilterValue;
  expirationDate: DateFilterValue;
  creditLeft: NumericComparatorFilterValue;
};

/**
 * Lightweight representation of a Pass option used by the selection field.
 * The selection field only needs the id, the display name, the credits and
 * the price to build its rows.
 */
export type PassOption = {
  id: number;
  name: string;
  credits: number | null;
  price?: number | { source: string; parsedValue: number };
};

/**
 * Patch payload sent to `PATCH /payment_pack/{filterId}/`.
 * The shape mirrors the create payload but only contains dirty leaves.
 */
export type DirtyPatchPayload = Partial<
  Omit<PaymentPackFilter, "id" | "company_id" | "filter_identifier">
>;

export type PassesFilterCardProps = {
  smartlistId: string;
  filterValue: PassesFilterFormValue;
  passOptions: PassOption[];
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
