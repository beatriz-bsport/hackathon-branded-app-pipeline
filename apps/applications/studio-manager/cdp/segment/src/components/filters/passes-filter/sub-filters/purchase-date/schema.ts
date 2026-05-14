import { z } from "zod";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import { DATE_FILTER_TYPE_ABSOLUTE } from "#src/components/primitive-filters/date-filter/constants";
import { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";
import { i18nInstance } from "#src/utils/i18n";

import type { PassesFilterFormValue } from "../../types";
import { PASS_SUB_FILTER_IDS } from "../pass-sub-filter-id";
import { mapDateFilterType } from "./utils";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Zod fragment for the `purchaseDate` slot on the pass filter form.
 */
export const purchaseDateValueSchema: z.ZodType<DateFilterValue> = z.object({
  dateType: z.enum(["absolute", "relative"]),
  absolute: z.object({
    operator: z.enum(["on_or_before", "on_or_after", "exactly_on", "between"]),
    fromDate: z.string().nullable(),
    toDate: z.string().nullable(),
  }),
  relative: z.object({
    operator: z.enum([
      "past_more_than",
      "past_exactly",
      "past_between",
      "future_more_than",
      "future_exactly",
      "future_between",
    ]),
    firstDays: z.number().nullable(),
    secondDays: z.number().nullable(),
  }),
}) as z.ZodType<DateFilterValue>;

/**
 * Same zod shape as `purchaseDateValueSchema`, reused by the expiration date
 * slot (`DateFilterValue`).
 */
export const dateFilterValueSchema = purchaseDateValueSchema;

/**
 * Adds conditional validation for the pass purchase date sub-filter when it is
 * active (`subFilters` contains `purchase_date`).
 *
 * Rules follow the smartlist payment pack filter contract (absolute vs
 * relative operators and API date filter types).
 */
export const refinePurchaseDateSubFilter = (
  value: PassesFilterFormValue,
  context: z.RefinementCtx,
) => {
  if (!value.subFilters.includes(PASS_SUB_FILTER_IDS.purchaseDate)) {
    return;
  }

  const dateFilterType = mapDateFilterType(value.purchaseDate);

  if (value.purchaseDate.dateType === DATE_FILTER_TYPE_ABSOLUTE) {
    const { operator, fromDate, toDate } = value.purchaseDate.absolute;
    if (
      operator === "between" &&
      (!fromDate || !toDate || fromDate.trim() === "" || toDate.trim() === "")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["purchaseDate", "absolute", "toDate"],
        message: i18nInstance.t(
          "filters.19.validation.purchaseDateBetweenRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
      return;
    }
    if (operator !== "between" && (!fromDate || fromDate.trim() === "")) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["purchaseDate", "absolute", "fromDate"],
        message: i18nInstance.t("filters.19.validation.purchaseDateRequired", {
          ns: I18N_NAMESPACE,
        }),
      });
    }
    return;
  }

  const { firstDays, secondDays } = value.purchaseDate.relative;

  if (dateFilterType === SmartlistDateFilterType.DURATION_BETWEEN) {
    if (firstDays === null || secondDays === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["purchaseDate", "relative", "secondDays"],
        message: i18nInstance.t(
          "filters.19.validation.purchaseDateDurationBetweenRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
    }
    return;
  }

  if (firstDays === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["purchaseDate", "relative", "firstDays"],
      message: i18nInstance.t(
        "filters.19.validation.purchaseDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
    });
  }
};
