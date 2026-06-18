import { z } from "zod";

import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import { CREDIT_ACCOUNT_NUMBER_TYPE } from "./constants";
import type { CreditAccountFilterFormValue } from "./types";

export const creditAccountFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    type: z.enum([
      CREDIT_ACCOUNT_NUMBER_TYPE.between,
      CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual,
      CREDIT_ACCOUNT_NUMBER_TYPE.greaterOrEqual,
      CREDIT_ACCOUNT_NUMBER_TYPE.equal,
    ]),
    value: z.number().int(),
    secondValue: z.number().int().nullable(),
  })
  .superRefine((data, context) => {
    if (data.type !== CREDIT_ACCOUNT_NUMBER_TYPE.between) {
      return;
    }

    if (data.secondValue === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t("filters.1.validation.secondValueRequired", {
          ns: I18N_SEGMENT_NAMESPACES.FILTERS,
        }),
      });
      return;
    }

    if (data.secondValue < data.value) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t(
          "filters.1.validation.secondValueGreaterThanFirst",
          {
            ns: I18N_SEGMENT_NAMESPACES.FILTERS,
          },
        ),
      });
    }
  }) satisfies z.ZodType<CreditAccountFilterFormValue>;
