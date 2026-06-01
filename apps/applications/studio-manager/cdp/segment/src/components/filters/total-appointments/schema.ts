import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "./constants";
import type { TotalAppointmentsNumberFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

const VALUE_REQUIRED_MESSAGE = i18nInstance.t(
  "filters.26.validation.valueRequired",
  { ns: I18N_NAMESPACE },
);

export const totalAppointmentsNumberFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    type: z.enum([
      TOTAL_APPOINTMENTS_NUMBER_TYPE.between,
      TOTAL_APPOINTMENTS_NUMBER_TYPE.lowerOrEqual,
      TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual,
      TOTAL_APPOINTMENTS_NUMBER_TYPE.equal,
    ]),
    value: z.number().int().min(0, VALUE_REQUIRED_MESSAGE),
    secondValue: z.number().int().min(0, VALUE_REQUIRED_MESSAGE).nullable(),
  })
  .superRefine((data, context) => {
    if (data.type !== TOTAL_APPOINTMENTS_NUMBER_TYPE.between) {
      return;
    }

    if (data.secondValue === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t("filters.26.validation.secondValueRequired", {
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
          "filters.26.validation.secondValueGreaterThanFirst",
          {
            ns: I18N_NAMESPACE,
          },
        ),
      });
    }
  }) satisfies z.ZodType<TotalAppointmentsNumberFilterFormValue>;
