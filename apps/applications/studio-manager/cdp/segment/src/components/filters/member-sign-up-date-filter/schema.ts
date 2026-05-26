import { z } from "zod";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import { purchaseDateValueSchema } from "#src/components/filters/passes-filter/sub-filters/purchase-date/schema";
import { mapDateFilterType } from "#src/components/filters/passes-filter/sub-filters/purchase-date/utils";
import {
  ABSOLUTE_DATE_OPERATOR_BETWEEN,
  DATE_FILTER_TYPE_ABSOLUTE,
} from "#src/components/primitive-filters/date-filter/constants";
import { i18nInstance } from "#src/utils/i18n";

import type { MemberSignUpDateFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

const refineSignUpDateFilter = (
  value: MemberSignUpDateFilterFormValue,
  context: z.RefinementCtx,
) => {
  const dateFilterType = mapDateFilterType(value.signUpDate);

  if (value.signUpDate.dateType === DATE_FILTER_TYPE_ABSOLUTE) {
    const { operator, fromDate, toDate } = value.signUpDate.absolute;
    if (
      operator === ABSOLUTE_DATE_OPERATOR_BETWEEN &&
      (!fromDate || !toDate || fromDate.trim() === "" || toDate.trim() === "")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["signUpDate", "absolute", "toDate"],
        message: i18nInstance.t(
          "filters.18.validation.signUpDateBetweenRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
      return;
    }
    if (
      operator !== ABSOLUTE_DATE_OPERATOR_BETWEEN &&
      (!fromDate || fromDate.trim() === "")
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["signUpDate", "absolute", "fromDate"],
        message: i18nInstance.t("filters.18.validation.signUpDateRequired", {
          ns: I18N_NAMESPACE,
        }),
      });
    }
    return;
  }

  const { firstDays, secondDays } = value.signUpDate.relative;

  if (dateFilterType === SmartlistDateFilterType.DURATION_BETWEEN) {
    if (firstDays === null || secondDays === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["signUpDate", "relative", "secondDays"],
        message: i18nInstance.t(
          "filters.18.validation.signUpDateDurationBetweenRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
    }
    return;
  }

  if (firstDays === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["signUpDate", "relative", "firstDays"],
      message: i18nInstance.t(
        "filters.18.validation.signUpDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
    });
  }
};

/**
 * Validation schema for the member sign-up date filter card.
 */
export const memberSignUpDateFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    signUpDate: purchaseDateValueSchema,
  })
  .superRefine(refineSignUpDateFilter);
