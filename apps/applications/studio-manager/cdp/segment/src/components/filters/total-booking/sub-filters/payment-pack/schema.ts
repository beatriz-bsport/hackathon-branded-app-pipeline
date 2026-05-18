import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import type { TotalBookingNumberFilterFormValue } from "../../types";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "../total-booking-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

export const refinePaymentPackSubFilter = (
  value: TotalBookingNumberFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (!value.subFilters.includes(TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack)) {
    return;
  }

  if (
    !value.paymentPack.selectAllPaymentPacks &&
    value.paymentPack.selectedPaymentPackIds.length === 0
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["paymentPack", "selectedPaymentPackIds"],
      message: i18nInstance.t(
        "filters.22.validation.selectedPaymentPacksRequired",
        {
          ns: I18N_NAMESPACE,
        },
      ),
    });
  }
};
