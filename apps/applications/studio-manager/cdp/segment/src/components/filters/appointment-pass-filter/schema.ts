import { z } from "zod";

import { OWNERSHIP_OPTIONS } from "#src/components/filters/passes-filter/constants";
import { creditLeftValueSchema } from "#src/components/filters/passes-filter/sub-filters/credit-left/schema";
import { expirationDateValueSchema } from "#src/components/filters/passes-filter/sub-filters/expiration-date/schema";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";
import { REGISTERED_PASS_SUB_FILTERS } from "#src/components/filters/passes-filter/sub-filters/registry";
import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";
import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { AppointmentPassFilterFormValue } from "./types";

const subFilterIdSchema = z.array(
  z.union([
    z.literal(PASS_SUB_FILTER_IDS.purchaseDate),
    z.literal(PASS_SUB_FILTER_IDS.expirationDate),
    z.literal(PASS_SUB_FILTER_IDS.creditLeft),
  ]),
);

/**
 * Validation schema for the appointment pass filter card (base + pass sub-filters).
 */
export const appointmentPassFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    ownership: z.enum([OWNERSHIP_OPTIONS.own, OWNERSHIP_OPTIONS.doesNotOwn]),
    selectAllPaymentPacks: z.boolean(),
    selectedPaymentPackIds: z.array(z.number().int().positive()),
    /** Which optional sub-filters are enabled in the UI; drives section visibility, conditional validation, and active API slices (not sent to the backend as-is). */
    subFilters: subFilterIdSchema,
    purchaseDate: dateFilterValueSchema,
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
          "filters.25.validation.selectedPassesRequired",
          { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
        ),
      });
    }
  })
  .superRefine((value, context) => {
    for (const passSubFilterModule of REGISTERED_PASS_SUB_FILTERS) {
      passSubFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<AppointmentPassFilterFormValue>;
