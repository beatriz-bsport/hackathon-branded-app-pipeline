import { z } from "zod";

import { COMBINE_MODE_OPTIONS, CONSENT_OPTIONS } from "./constants";
import type { MarketingNotificationFilterFormValue } from "./types";

export const marketingNotificationFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    smsFilterActive: z.boolean(),
    smsConsent: z.enum([CONSENT_OPTIONS.accepted, CONSENT_OPTIONS.rejected]),
    emailFilterActive: z.boolean(),
    emailConsent: z.enum([CONSENT_OPTIONS.accepted, CONSENT_OPTIONS.rejected]),
    combineMode: z.enum([COMBINE_MODE_OPTIONS.and, COMBINE_MODE_OPTIONS.or]),
    isV2: z.boolean(),
  })
  .superRefine((data, context) => {
    if (!data.smsFilterActive && !data.emailFilterActive) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["smsFilterActive"],
        message: "atLeastOneChannelRequired",
      });
    }
  }) satisfies z.ZodType<MarketingNotificationFilterFormValue>;
