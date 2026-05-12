import { z } from "zod";

import { creditLeftValueSchema } from "#src/components/filters/passes-filter/sub-filters/credit-left/schema";
import { expirationDateValueSchema } from "#src/components/filters/passes-filter/sub-filters/expiration-date/schema";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";
import { purchaseDateValueSchema } from "#src/components/filters/passes-filter/sub-filters/purchase-date/schema";
import { REGISTERED_PASS_SUB_FILTERS } from "#src/components/filters/passes-filter/sub-filters/registry";
import { i18nInstance } from "#src/utils/i18n";

import { OWNERSHIP_OPTIONS } from "./constants";
import type { PassesFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Allowed `subFilters` entries. When a new sub-filter is registered, add its
 * id literal here (and in `PASS_SUB_FILTER_IDS`).
 */
const subFilterIdSchema = z.array(
  z.union([
    z.literal(PASS_SUB_FILTER_IDS.purchaseDate),
    z.literal(PASS_SUB_FILTER_IDS.expirationDate),
    z.literal(PASS_SUB_FILTER_IDS.creditLeft),
  ]),
);

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
    expirationDate: expirationDateValueSchema,
    creditLeft: creditLeftValueSchema,
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
