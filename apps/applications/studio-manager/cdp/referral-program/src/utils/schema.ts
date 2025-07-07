import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";
import type { ReferralProgramFormData } from "#src/utils/types";

export const referralProgramSchema = z.object({
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
  maxReferringUsage: z.coerce
    .number()
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
}) satisfies z.ZodType<ReferralProgramFormData>;

export type ReferralProgramFormSchema = z.infer<typeof referralProgramSchema>;
