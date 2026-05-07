import { DateTime } from "luxon";

import {
  type CreatePaymentPackFilterPayload,
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { OWNERSHIP_OPTIONS } from "../constants";
import type { PassesFilterFormValue } from "../types";

/**
 * Neutral, inactive defaults for sub-filter API fields.
 *
 * The backend tolerates these fields being omitted on `POST`, but the shared
 * API client type (`CreatePaymentPackFilterPayload`) is strict, so we emit a
 * fully-typed payload with deactivated sub-filters.
 *
 * Future sub-filter modules will replace the relevant slice when they are
 * registered.
 */
const INACTIVE_SUB_FILTER_DEFAULTS = {
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_AFTER,
  date_bought: DateTime.now().toFormat("yyyy-MM-dd"),
  date_bought_second: DateTime.now().toFormat("yyyy-MM-dd"),
  duration_bought: 0,
  duration_bought_second: 0,
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
 * Only the base ownership fields are derived from the form. Sub-filter fields
 * are set to their inactive defaults, which the backend treats as "no
 * sub-filter applied".
 */
export const toCreatePayload = (
  value: PassesFilterFormValue,
): CreatePaymentPackFilterPayload => ({
  smartlist: value.smartlist,
  has_pack: value.ownership === OWNERSHIP_OPTIONS.own,
  select_all_payment_packs: value.selectAllPaymentPacks,
  payment_packs: value.selectedPaymentPackIds,
  ...INACTIVE_SUB_FILTER_DEFAULTS,
});
