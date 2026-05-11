import type { PaymentPackFilter } from "@bsport/api-cdp/smartlist";

import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { OWNERSHIP_OPTIONS } from "../constants";
import { REGISTERED_PASS_SUB_FILTERS } from "../sub-filters/registry";
import type { PassesFilterFormValue } from "../types";

/**
 * Converts a server-side `PaymentPackFilter` payload into the UI form value.
 *
 * Base fields are mapped directly. Each registered sub-filter module reads its
 * own API slice; active modules are reflected in `subFilters`, and each module
 * may merge additional slots through `partial`.
 */
export const mapApiFilterToFormValue = (
  filter: PaymentPackFilter,
): PassesFilterFormValue => {
  const subFilters: PassesFilterFormValue["subFilters"] = [];
  const partialForm: Partial<PassesFilterFormValue> = {};

  for (const passSubFilterModule of REGISTERED_PASS_SUB_FILTERS) {
    const readResult = passSubFilterModule.readFromApi(filter);
    if (readResult.isActive) {
      subFilters.push(passSubFilterModule.id);
    }
    Object.assign(partialForm, readResult.partial);
  }

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    ownership: filter.has_pack
      ? OWNERSHIP_OPTIONS.own
      : OWNERSHIP_OPTIONS.doesNotOwn,
    selectAllPaymentPacks: filter.select_all_payment_packs,
    selectedPaymentPackIds: filter.payment_packs ?? [],
    subFilters,
    purchaseDate: partialForm.purchaseDate ?? defaultDateFilterValue,
    expirationDate: partialForm.expirationDate ?? defaultDateFilterValue,
  };
};
