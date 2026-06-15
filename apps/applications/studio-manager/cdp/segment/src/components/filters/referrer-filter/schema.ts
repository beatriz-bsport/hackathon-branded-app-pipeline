import { z } from "zod";

import { SMARTLIST_REFERRER_COMPARATOR } from "@bsport/api-cdp/smartlist";

import { i18nInstance } from "#src/utils/i18n";

import type { ReferrerFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

const referrerComparatorSchema = z.union([
  z.literal(SMARTLIST_REFERRER_COMPARATOR.LTE),
  z.literal(SMARTLIST_REFERRER_COMPARATOR.GTE),
  z.literal(SMARTLIST_REFERRER_COMPARATOR.EQUAL),
  z.literal(SMARTLIST_REFERRER_COMPARATOR.BETWEEN),
]);

export const referrerFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    comparator_referred: referrerComparatorSchema,
    value_referred: z.number().int().min(0),
    value_second_referred: z.number().int().min(0),
    value_obtained_reward_active: z.boolean(),
    value_obtained_reward: z.number().int().min(0),
    value_second_reward: z.number().int().min(0),
    comparator_reward: referrerComparatorSchema,
    value_obtained_money_active: z.boolean(),
    value_obtained_money: z.number().int().min(0),
    value_second_obtained_money: z.number().int().min(0),
    comparator_obtained_money: referrerComparatorSchema,
  })
  .superRefine((data, context) => {
    if (data.comparator_referred !== SMARTLIST_REFERRER_COMPARATOR.BETWEEN) {
      return;
    }

    if (data.value_second_referred < data.value_referred) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value_second_referred"],
        message: i18nInstance.t(
          "filters.29.validation.valueSecondReferredGreaterThanFirst",
          {
            ns: I18N_NAMESPACE,
          },
        ),
      });
    }
  }) satisfies z.ZodType<ReferrerFilterFormValue>;
