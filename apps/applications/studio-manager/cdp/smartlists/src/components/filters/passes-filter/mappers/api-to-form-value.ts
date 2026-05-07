import { type PaymentPackFilter } from "@bsport/api-cdp/smartlist";

import { OWNERSHIP_OPTIONS } from "../constants";
import type { PassesFilterFormValue } from "../types";

/**
 * Converts a server-side `PaymentPackFilter` payload into the UI form value.
 *
 * Sub-filter API fields (`date_*`, `credit_*`, `expiration_*`) are
 * intentionally ignored at this stage. They will round-trip safely because the
 * dirty patch builder never marks them as dirty when no sub-filter UI is
 * touching them.
 */
export const mapApiFilterToFormValue = (
  filter: PaymentPackFilter,
): PassesFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  ownership: filter.has_pack
    ? OWNERSHIP_OPTIONS.own
    : OWNERSHIP_OPTIONS.doesNotOwn,
  selectAllPaymentPacks: filter.select_all_payment_packs,
  selectedPaymentPackIds: filter.payment_packs ?? [],
});
