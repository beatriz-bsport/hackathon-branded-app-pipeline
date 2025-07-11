import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";
import type { ReferralProgramFormData } from "#src/utils/types";

export const referralProgramSchema = z
  .object({
    basketMinimalAmount: z
      .string()
      // 1. Check the general format: only digits, optional minus, optional decimal separator
      .refine((value) => /^-?\d+([.,]\d*)?$/.test(value), {
        message: i18nInstance.t(
          "active.form.basketMinimalAmount.errors.invalidFormat",
        ),
      })
      // 2. Check for at most two decimals (only if there's a decimal part)
      .refine(
        (value) => {
          const match = /^-?\d+([.,](\d+))?$/.exec(value);
          if (!match || !match[2]) return true; // No decimal part, or not matching
          return match[2].length <= 2;
        },
        {
          message: i18nInstance.t(
            "active.form.basketMinimalAmount.errors.tooManyDecimalPoints",
          ),
        },
      ),
    amountReferringReward: z
      .string()
      // 1. Check the general format: only digits, optional minus, optional decimal separator
      .refine((value) => /^-?\d+([.,]\d*)?$/.test(value), {
        message: i18nInstance.t(
          "active.form.referringReward.errors.invalidFormat",
        ),
      })
      // 2. Check for at most two decimals (only if there's a decimal part)
      .refine(
        (value) => {
          const match = /^-?\d+([.,](\d+))?$/.exec(value);
          if (!match || !match[2]) return true; // No decimal part, or not matching
          return match[2].length <= 2;
        },
        {
          message: i18nInstance.t(
            "active.form.referringReward.errors.tooManyDecimalPoints",
          ),
        },
      ),
    maxReferringUsage: z.coerce
      .number()
      .positive()
      .int({
        message: i18nInstance.t(
          "active.form.referringReward.maxReferringNumber.errors.noFloat",
        ),
      })
      .min(1, {
        message: i18nInstance.t(
          "active.form.referringReward.maxReferringNumber.errors.tooSmall",
        ),
      })
      .max(5, {
        message: i18nInstance.t(
          "active.form.referringReward.maxReferringNumber.errors.tooBig",
        ),
      }),
    referringRewardAmount: z
      .string()
      // 1. Check the general format: only digits, optional minus, optional decimal separator
      .refine((value) => /^-?\d+([.,]\d*)?$/.test(value), {
        message: i18nInstance.t(
          "active.form.referralReward.errors.invalidFormat",
        ),
      })
      // 2. Check for at most two decimals (only if there's a decimal part)
      .refine(
        (value) => {
          const match = /^-?\d+([.,](\d+))?$/.exec(value);
          if (!match || !match[2]) return true; // No decimal part, or not matching
          return match[2].length <= 2;
        },
        {
          message: i18nInstance.t(
            "active.form.referralReward.errors.tooManyDecimalPoints",
          ),
        },
      ),
    referringRewardPercentage: z.coerce
      .number()
      .nonnegative()
      .max(100, {
        message: i18nInstance.t(
          "active.form.referralReward.errors.percentageTooHigh",
        ),
      }),
    referringRewardType: z.string(),
    applicationTimeLimitInterval: z.coerce.number(),
    applicationTimeLimitUnit: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.applicationTimeLimitInterval < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          "active.form.timeLimitForUsage.interval.errors.lowerThanOne",
          { timeUnit: data.applicationTimeLimitUnit },
        ),
        path: ["applicationTimeLimitInterval"],
      });
    }
  }) satisfies z.ZodType<ReferralProgramFormData>;

export type ReferralProgramFormSchema = z.infer<typeof referralProgramSchema>;
