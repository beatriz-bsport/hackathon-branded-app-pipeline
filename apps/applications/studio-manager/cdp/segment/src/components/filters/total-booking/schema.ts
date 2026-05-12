import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { TOTAL_BOOKING_NUMBER_TYPE } from "./constants";
import type { TotalBookingNumberFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

export const totalBookingNumberFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    type: z.enum([
      TOTAL_BOOKING_NUMBER_TYPE.between,
      TOTAL_BOOKING_NUMBER_TYPE.lowerOrEqual,
      TOTAL_BOOKING_NUMBER_TYPE.greaterOrEqual,
      TOTAL_BOOKING_NUMBER_TYPE.equal,
    ]),
    value: z
      .number()
      .int()
      .min(
        0,
        i18nInstance.t("filters.22.validation.valueRequired", {
          ns: I18N_NAMESPACE,
        }),
      ),
    secondValue: z
      .number()
      .int()
      .min(
        0,
        i18nInstance.t("filters.22.validation.valueRequired", {
          ns: I18N_NAMESPACE,
        }),
      )
      .nullable(),
  })
  .superRefine((data, context) => {
    if (data.type !== TOTAL_BOOKING_NUMBER_TYPE.between) {
      return;
    }

    if (data.secondValue === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t("filters.22.validation.secondValueRequired", {
          ns: I18N_NAMESPACE,
        }),
      });
      return;
    }

    if (data.secondValue < data.value) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t(
          "filters.22.validation.secondValueGreaterThanFirst",
          {
            ns: I18N_NAMESPACE,
          },
        ),
      });
    }
  }) satisfies z.ZodType<TotalBookingNumberFilterFormValue>;
