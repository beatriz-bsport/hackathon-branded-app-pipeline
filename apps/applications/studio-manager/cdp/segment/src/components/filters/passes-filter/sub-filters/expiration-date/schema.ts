import { z } from "zod";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import { DATE_FILTER_TYPE_ABSOLUTE } from "#src/components/primitive-filters/date-filter/constants";
import { i18nInstance } from "#src/utils/i18n";

import type { PassesFilterFormValue } from "../../types";
import { PASS_SUB_FILTER_IDS } from "../pass-sub-filter-id";
import { dateFilterValueSchema } from "../purchase-date/schema";
import { mapDateFilterType } from "../purchase-date/utils";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Zod fragment for the `expirationDate` slot (identical shape to purchase date).
 */
export const expirationDateValueSchema = dateFilterValueSchema;

/**
 * Adds conditional validation for the pass expiration date sub-filter when it is
 * active (`subFilters` contains `expiration_date`).
 *
 * Same rules as purchase date; paths target `expirationDate`.
 */
export const refineExpirationDateSubFilter = (
  value: PassesFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (!value.subFilters.includes(PASS_SUB_FILTER_IDS.expirationDate)) {
    return;
  }

  const dateFilterType = mapDateFilterType(value.expirationDate);

  if (value.expirationDate.dateType === DATE_FILTER_TYPE_ABSOLUTE) {
    const { operator, fromDate, toDate } = value.expirationDate.absolute;
    if (
      operator === "between" &&
      (!fromDate || !toDate || fromDate.trim() === "" || toDate.trim() === "")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expirationDate", "absolute", "toDate"],
        message: i18nInstance.t(
          "filters.19.validation.expirationDateBetweenRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
      return;
    }
    if (operator !== "between" && (!fromDate || fromDate.trim() === "")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expirationDate", "absolute", "fromDate"],
        message: i18nInstance.t(
          "filters.19.validation.expirationDateRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
    }
    return;
  }

  const { firstDays, secondDays } = value.expirationDate.relative;

  if (dateFilterType === SmartlistDateFilterType.DURATION_BETWEEN) {
    if (firstDays === null || secondDays === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expirationDate", "relative", "secondDays"],
        message: i18nInstance.t(
          "filters.19.validation.expirationDateDurationBetweenRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
    }
    return;
  }

  if (firstDays === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expirationDate", "relative", "firstDays"],
      message: i18nInstance.t(
        "filters.19.validation.expirationDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
    });
  }
};
