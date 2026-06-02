import { z } from "zod";

import { purchaseAmountValueSchema } from "#src/components/filters/first-purchase-filter/sub-filters/purchase-amount/schema";
import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";

import { FIRST_PURCHASE_STATUS } from "./constants";
import { FIRST_PURCHASE_SUB_FILTER_IDS } from "./sub-filters/first-purchase-sub-filter-id";
import { REGISTERED_FIRST_PURCHASE_SUB_FILTERS } from "./sub-filters/registry";
import type { FirstPurchaseFilterFormValue } from "./types";

const subFilterIdSchema = z.array(
  z.union([
    z.literal(FIRST_PURCHASE_SUB_FILTER_IDS.purchaseDate),
    z.literal(FIRST_PURCHASE_SUB_FILTER_IDS.purchaseAmount),
  ]),
);

/**
 * Validation schema for the first purchase filter (base fields + registered sub-filters).
 */
export const firstPurchaseFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    firstPurchaseStatus: z.enum([
      FIRST_PURCHASE_STATUS.done,
      FIRST_PURCHASE_STATUS.notDone,
    ]),
    subFilters: subFilterIdSchema,
    purchaseDate: dateFilterValueSchema,
    purchaseAmount: purchaseAmountValueSchema,
  })
  .superRefine((value, context) => {
    for (const subFilterModule of REGISTERED_FIRST_PURCHASE_SUB_FILTERS) {
      subFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<FirstPurchaseFilterFormValue>;
