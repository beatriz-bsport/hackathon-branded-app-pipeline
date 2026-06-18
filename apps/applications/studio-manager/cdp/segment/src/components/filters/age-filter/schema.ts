import { z } from "zod";

import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import { AGE_FILTER_NUMBER_TYPE } from "./constants";
import type { AgeFilterFormValue } from "./types";

const MAX_AGE = 120;

export const ageFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    type: z.enum([
      AGE_FILTER_NUMBER_TYPE.between,
      AGE_FILTER_NUMBER_TYPE.lowerOrEqual,
      AGE_FILTER_NUMBER_TYPE.greaterOrEqual,
      AGE_FILTER_NUMBER_TYPE.equal,
    ]),
    value: z.number().int().min(0).max(MAX_AGE),
    secondValue: z.number().int().min(0).max(MAX_AGE).nullable(),
  })
  .superRefine((data, context) => {
    if (data.type !== AGE_FILTER_NUMBER_TYPE.between) {
      return;
    }

    if (data.secondValue === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t("filters.101.validation.secondValueRequired", {
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
          "filters.101.validation.secondValueGreaterThanFirst",
          {
            ns: I18N_SEGMENT_NAMESPACES.FILTERS,
          },
        ),
      });
    }
  }) satisfies z.ZodType<AgeFilterFormValue>;
