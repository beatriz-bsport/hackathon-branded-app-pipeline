import { z } from "zod";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

/**
 * Zod fragment for a smartlist date sub-filter slot (`DateFilterValue` shape).
 */
export const dateFilterValueSchema: z.ZodType<DateFilterValue> = z.object({
  dateType: z.enum(["absolute", "relative"]),
  absolute: z.object({
    operator: z.enum(["on_or_before", "on_or_after", "exactly_on", "between"]),
    fromDate: z.string().nullable(),
    toDate: z.string().nullable(),
  }),
  relative: z.object({
    operator: z.enum([
      "past_more_than",
      "past_exactly",
      "past_between",
      "future_more_than",
      "future_exactly",
      "future_between",
    ]),
    firstDays: z.number().nullable(),
    secondDays: z.number().nullable(),
  }),
}) as z.ZodType<DateFilterValue>;
