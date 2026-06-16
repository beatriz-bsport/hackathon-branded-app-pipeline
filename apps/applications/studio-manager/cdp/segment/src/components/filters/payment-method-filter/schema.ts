import { z } from "zod";

import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";

import { OWNS_PAYMENT_METHOD } from "./constants";
import { PAYMENT_METHOD_SUB_FILTER_IDS } from "./sub-filters/payment-method-sub-filter-id";
import { REGISTERED_PAYMENT_METHOD_SUB_FILTERS } from "./sub-filters/registry";
import type { PaymentMethodFilterFormValue } from "./types";

const subFilterIdSchema = z.array(
  z.literal(PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate),
);

/**
 * Validation schema for the saved payment method filter.
 */
export const paymentMethodFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    ownsPaymentMethod: z.enum([
      OWNS_PAYMENT_METHOD.has,
      OWNS_PAYMENT_METHOD.doesNotHave,
    ]),
    subFilters: subFilterIdSchema,
    expirationDate: dateFilterValueSchema,
  })
  .superRefine((value, context) => {
    for (const subFilterModule of REGISTERED_PAYMENT_METHOD_SUB_FILTERS) {
      subFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<PaymentMethodFilterFormValue>;
