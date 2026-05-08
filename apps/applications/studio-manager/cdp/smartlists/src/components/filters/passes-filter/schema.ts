import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { OWNERSHIP_OPTIONS } from "./constants";
import { PASS_SUB_FILTER_IDS } from "./sub-filters/pass-sub-filter-id";
import { purchaseDateValueSchema } from "./sub-filters/purchase-date/schema";
import { REGISTERED_PASS_SUB_FILTERS } from "./sub-filters/registry";
import type { PassesFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_campaign-filters";

/**
 * Allowed `subFilters` entries. When a new sub-filter is registered, add its
 * id literal here (and in `PASS_SUB_FILTER_IDS`).
 */
const subFilterIdSchema = z.array(z.literal(PASS_SUB_FILTER_IDS.purchaseDate));

/**
 * Validation schema for the pass filter (base fields + registered sub-filters).
 *
 * Each sub-filter module contributes its own `refine` callback so rules stay
 * co-located with the feature.
 */
export const passesFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    ownership: z.enum([OWNERSHIP_OPTIONS.own, OWNERSHIP_OPTIONS.doesNotOwn]),
    selectAllPaymentPacks: z.boolean(),
    selectedPaymentPackIds: z.array(z.number().int().positive()),
    subFilters: subFilterIdSchema,
    purchaseDate: purchaseDateValueSchema,
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
  })
  .superRefine((value, context) => {
    for (const passSubFilterModule of REGISTERED_PASS_SUB_FILTERS) {
      passSubFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<PassesFilterFormValue>;
