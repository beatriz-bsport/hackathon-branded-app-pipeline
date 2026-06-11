import type {
  PaymentPackFilter,
  PrivatePassFilter,
} from "@bsport/api-cdp/smartlist";

import { OWNERSHIP_OPTIONS } from "#src/components/filters/passes-filter/constants";
import { REGISTERED_PASS_SUB_FILTERS } from "#src/components/filters/passes-filter/sub-filters/registry";
import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";

import type { AppointmentPassFilterFormValue } from "../types";

/**
 * Converts a server-side `PrivatePassFilter` into the shared pass-filter form shape.
 */
export const mapPrivatePassFilterToFormValue = (
  filter: PrivatePassFilter,
): AppointmentPassFilterFormValue => {
  const subFilters: AppointmentPassFilterFormValue["subFilters"] = [];
  const partialForm: Partial<AppointmentPassFilterFormValue> = {};

  for (const passSubFilterModule of REGISTERED_PASS_SUB_FILTERS) {
    const readResult = passSubFilterModule.readFromApi(
      filter as unknown as PaymentPackFilter,
    );
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
    selectAllPaymentPacks: filter.select_all_private_passes,
    selectedPaymentPackIds: filter.private_passes ?? [],
    subFilters,
    purchaseDate: partialForm.purchaseDate ?? createDefaultDateFilterValue(),
    expirationDate:
      partialForm.expirationDate ?? createDefaultDateFilterValue(),
    creditLeft: partialForm.creditLeft ?? defaultNumericComparatorFilterValue,
  };
};
