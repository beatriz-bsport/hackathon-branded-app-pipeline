import type { FirstPurchaseFilter } from "@bsport/api-cdp/smartlist";

import { firstPurchaseStatusFromApi } from "../constants";
import type { FirstPurchaseFilterFormValue } from "../types";

/**
 * Converts a server-side `FirstPurchaseFilter` payload into the UI form value.
 */
export const mapFirstPurchaseFilterToFormValue = (
  filter: FirstPurchaseFilter,
): FirstPurchaseFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  firstPurchaseStatus: firstPurchaseStatusFromApi(filter.first_payment_is_done),
});
