import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { LAST_BOOKING_MIN_VALUE } from "./constants";
import type { LastBookingFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

export const lastBookingFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    value: z.number().int().nullable(),
  })
  .superRefine((data, context) => {
    if (data.value === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: i18nInstance.t("filters.501.validation.valueRequired", {
          ns: I18N_NAMESPACE,
        }),
      });
      return;
    }

    if (data.value < LAST_BOOKING_MIN_VALUE) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: i18nInstance.t("filters.501.validation.valueMin", {
          ns: I18N_NAMESPACE,
        }),
      });
    }
  }) satisfies z.ZodType<LastBookingFilterFormValue>;
