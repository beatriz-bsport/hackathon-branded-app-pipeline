import {
  type CreateFirstPurchaseFilterPayload,
  SmartlistDateFilterType,
  SmartlistPaymentComparator,
} from "@bsport/api-cdp/smartlist";

import { firstPurchaseStatusToApi } from "../constants";
import type { FirstPurchaseFilterFormValue } from "../types";

/**
 * Builds the `POST /first_purchase/` payload from a form value.
 */
export const createFirstPurchaseFilterPayload = (
  value: FirstPurchaseFilterFormValue,
): CreateFirstPurchaseFilterPayload => ({
  smartlist: value.smartlist,
  first_payment_is_done: firstPurchaseStatusToApi(value.firstPurchaseStatus),
  date_filter_active: false,
  date: "",
  date_filter_type: SmartlistDateFilterType.DURATION_BEFORE,
  date_second: "",
  duration: 0,
  duration_second: 0,
  value_payment_active: false,
  comparator_payment: SmartlistPaymentComparator.GTE,
  value_payment: 0,
  value_second_payment: 0,
});
