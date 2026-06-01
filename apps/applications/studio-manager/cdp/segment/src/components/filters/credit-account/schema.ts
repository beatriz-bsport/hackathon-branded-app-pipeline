import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { CREDIT_ACCOUNT_NUMBER_TYPE } from "./constants";
import type { CreditAccountFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

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
          "filters.1.validation.secondValueGreaterThanFirst",
          {
            ns: I18N_NAMESPACE,
          },
        ),
      });
    }
  }) satisfies z.ZodType<CreditAccountFilterFormValue>;
