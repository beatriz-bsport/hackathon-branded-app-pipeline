import { z } from "zod";

import { moneyObtainedValueSchema } from "#src/components/filters/referred-members-filter/sub-filters/money-obtained/schema";

import { REFERRED_MEMBER_STATUS } from "./constants";
import { REFERRED_MEMBERS_SUB_FILTER_IDS } from "./sub-filters/referred-members-sub-filter-id";
import { REGISTERED_REFERRED_MEMBERS_SUB_FILTERS } from "./sub-filters/registry";
import type { ReferredMembersFilterFormValue } from "./types";

const subFilterIdSchema = z.array(
  z.literal(REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained),
);

/**
 * Validation schema for the referred members filter (base fields + registered sub-filters).
 */
export const referredMembersFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    referredStatus: z.enum([
      REFERRED_MEMBER_STATUS.referred,
      REFERRED_MEMBER_STATUS.notReferred,
    ]),
    subFilters: subFilterIdSchema,
    moneyObtained: moneyObtainedValueSchema,
  })
  .superRefine((value, context) => {
    for (const subFilterModule of REGISTERED_REFERRED_MEMBERS_SUB_FILTERS) {
      subFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<ReferredMembersFilterFormValue>;
