import { z } from "zod";

import { FIRST_PURCHASE_STATUS } from "./constants";
import type { FirstPurchaseFilterFormValue } from "./types";

/**
 * Validation schema for the first purchase filter base fields.
 */
export const firstPurchaseFilterSchema = z.object({
  id: z.number().int().positive().optional(),
  smartlist: z.number().int().positive(),
  firstPurchaseStatus: z.enum([
    FIRST_PURCHASE_STATUS.done,
    FIRST_PURCHASE_STATUS.notDone,
  ]),
}) satisfies z.ZodType<FirstPurchaseFilterFormValue>;
