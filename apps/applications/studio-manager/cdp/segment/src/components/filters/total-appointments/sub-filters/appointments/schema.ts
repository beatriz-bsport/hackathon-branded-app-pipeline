import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import type { TotalAppointmentsNumberFilterFormValue } from "../../types";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "../total-appointments-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Validates the appointment scope sub-filter when it is active on the card.
 */
export const refineAppointmentsSubFilter = (
  value: TotalAppointmentsNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (
    !value.subFilters.includes(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointment)
  ) {
    return;
  }

  if (
    !value.appointment.selectAllAppointments &&
    value.appointment.selectedAppointmentIds.length === 0
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["appointment", "selectedAppointmentIds"],
      message: i18nInstance.t(
        "filters.26.validation.selectedAppointmentsRequired",
        {
          ns: I18N_NAMESPACE,
        },
      ),
    });
  }
};
