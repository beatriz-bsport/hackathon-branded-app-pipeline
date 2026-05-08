import { DateTime } from "luxon";

import {
  type CreatePaymentPackFilterPayload,
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { OWNERSHIP_OPTIONS } from "../constants";
import { REGISTERED_PASS_SUB_FILTERS } from "../sub-filters/registry";
import type { PassesFilterFormValue } from "../types";

/**
 * Inactive defaults for credit + expiration API fields until those sub-filters
 * are migrated into modules.
 */
const INACTIVE_CREDIT_AND_EXPIRATION_DEFAULTS = {
  credit_filter_active: false,
  credit_comparator: SmartlistCreditComparator.GTE,
  credit_value: 0,
  credit_value_second: 0,
  expiration_date_filter_active: false,
  expiration_date_filter_type: SmartlistDateFilterType.DATE_AFTER,
  expiration_date: DateTime.now().toFormat("yyyy-MM-dd"),
  expiration_date_second: DateTime.now().toFormat("yyyy-MM-dd"),
  expiration_duration: 0,
  expiration_duration_second: 0,
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
    ...INACTIVE_CREDIT_AND_EXPIRATION_DEFAULTS,
    ...subFilterSlices,
  } as CreatePaymentPackFilterPayload;
};
