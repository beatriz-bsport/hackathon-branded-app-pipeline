import { type CreatePaymentPackFilterPayload } from "@bsport/api-cdp/smartlist";

import { OWNERSHIP_OPTIONS } from "../constants";
import { REGISTERED_PASS_SUB_FILTERS } from "../sub-filters/registry";
import type { PassesFilterFormValue } from "../types";

/**
 * Builds the `POST /payment_pack/` payload from a form value.
 *
 * Base ownership fields are always derived from the form. Each registered
 * sub-filter module contributes its own API slice.
 */
export const createPassesPayload = (
  value: PassesFilterFormValue,
): CreatePaymentPackFilterPayload => {
  const subFilterSlices = REGISTERED_PASS_SUB_FILTERS.reduce<
    Partial<CreatePaymentPackFilterPayload>
  >(
    (accumulator, passSubFilterModule) => ({
      ...accumulator,
      ...passSubFilterModule.appendCreatePayloadSlice(value),
    }),
    {},
  );

  return {
    smartlist: value.smartlist,
    has_pack: value.ownership === OWNERSHIP_OPTIONS.own,
    select_all_payment_packs: value.selectAllPaymentPacks,
    payment_packs: value.selectedPaymentPackIds,
    ...subFilterSlices,
  } as CreatePaymentPackFilterPayload;
};
