import {
  type CreatePaymentPackFilterPayload,
  SmartlistCreditComparator,
} from "@bsport/api-cdp/smartlist";

import { OWNERSHIP_OPTIONS } from "../constants";
import { REGISTERED_PASS_SUB_FILTERS } from "../sub-filters/registry";
import type { PassesFilterFormValue } from "../types";

/**
 * Inactive defaults for credit API fields until the credits sub-filter module
 * exists. Purchase and expiration slices are owned by their modules.
 */
const INACTIVE_CREDIT_DEFAULTS = {
  credit_filter_active: false,
  credit_comparator: SmartlistCreditComparator.GTE,
  credit_value: 0,
  credit_value_second: 0,
} as const;

/**
 * Builds the `POST /payment_pack/` payload from a form value.
 *
 * Base ownership fields are always derived from the form. Each registered
 * sub-filter module contributes its own API slice. Remaining serializer keys
 * are filled with inactive defaults until their modules exist.
 */
export const toCreatePayload = (
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
    ...INACTIVE_CREDIT_DEFAULTS,
    ...subFilterSlices,
  } as CreatePaymentPackFilterPayload;
};
