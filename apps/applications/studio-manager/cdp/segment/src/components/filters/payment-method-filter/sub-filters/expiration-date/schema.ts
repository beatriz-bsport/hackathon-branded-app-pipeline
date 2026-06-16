import { z } from "zod";

import { ownsPaymentMethodToApi } from "#src/components/filters/payment-method-filter/constants";
import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { i18nInstance } from "#src/utils/i18n";

import type { PaymentMethodFilterFormValue } from "../../types";
import { PAYMENT_METHOD_SUB_FILTER_IDS } from "../payment-method-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Conditional validation for the expiration date sub-filter when it is active.
 */
export const refineExpirationDateSubFilter = (
  value: PaymentMethodFilterFormValue,
  context: z.RefinementCtx,
) => {
  refineSmartlistDateSubFilter({
    isActive:
      ownsPaymentMethodToApi(value.ownsPaymentMethod) &&
      value.subFilters.includes(PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate),
    fieldPath: "expirationDate",
    dateValue: value.expirationDate,
    context,
    messages: {
      dateRequired: i18nInstance.t(
        "filters.600.validation.expirationDateRequired",
        {
          ns: I18N_NAMESPACE,
        },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.600.validation.expirationDateBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationRequired: i18nInstance.t(
        "filters.600.validation.expirationDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.600.validation.expirationDateDurationBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
    },
  });
};
