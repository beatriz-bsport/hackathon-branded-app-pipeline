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
        console.log("Validating basketMinimalAmount:", value);
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
}) satisfies z.ZodType<ReferralProgramFormData>;

export type ReferralProgramFormSchema = z.infer<typeof referralProgramSchema>;
