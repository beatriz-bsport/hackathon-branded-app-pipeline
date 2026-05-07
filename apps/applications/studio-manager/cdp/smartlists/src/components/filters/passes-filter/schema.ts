import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { OWNERSHIP_OPTIONS } from "./constants";
import type { PassesFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_campaign-filters";

/**
 * Validation schema for the base pass filter (ownership scope only).
 *
 * Sub-filter rules are not declared here yet; they will be composed by future
 * sub-filter modules.
 */
export const passesFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    ownership: z.enum([OWNERSHIP_OPTIONS.own, OWNERSHIP_OPTIONS.doesNotOwn]),
    selectAllPaymentPacks: z.boolean(),
    selectedPaymentPackIds: z.array(z.number().int().positive()),
  })
  .superRefine((value, context) => {
    if (
      !value.selectAllPaymentPacks &&
      value.selectedPaymentPackIds.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selectedPaymentPackIds"],
        message: i18nInstance.t(
          "filters.19.validation.selectedPassesRequired",
          { ns: I18N_NAMESPACE },
        ),
      });
    }
  }) satisfies z.ZodType<PassesFilterFormValue>;
