import type { CreatePrivatePassFilterPayload } from "@bsport/api-cdp/smartlist";

import { OWNERSHIP_OPTIONS } from "#src/components/filters/passes-filter/constants";
import { REGISTERED_PASS_SUB_FILTERS } from "#src/components/filters/passes-filter/sub-filters/registry";

import type { AppointmentPassFilterFormValue } from "../types";

/**
 * Builds the `POST /private_pass/` payload from the appointment pass form value.
 */
export const createAppointmentPassPayload = (
  value: AppointmentPassFilterFormValue,
): CreatePrivatePassFilterPayload => {
  const subFilterSlices = REGISTERED_PASS_SUB_FILTERS.reduce<
    Partial<CreatePrivatePassFilterPayload>
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
    select_all_private_passes: value.selectAllPaymentPacks,
    private_passes: value.selectedPaymentPackIds,
    ...subFilterSlices,
  } as CreatePrivatePassFilterPayload;
};
