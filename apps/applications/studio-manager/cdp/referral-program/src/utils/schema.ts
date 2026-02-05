import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";
import type {
  ReferralProgramFormData,
  ReferringRewardOptionType,
  TimeUnit,
} from "#src/utils/types";

const httpUrlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const positivePriceRegex = /^\d{1,6}([.,]\d+)?$/;

const onlyTwoDecimalsMaxRegex = /^\d{1,6}([.,]\d{1,2})?$/;

export const referralProgramSchema = z
  .object({
    basketMinimalAmount: z
      .string()
      // 1. Check the general format: only digits, optional minus, optional decimal separator
      .refine(
        (value) => {
          const match = positivePriceRegex.test(value);
          return match;
        },
        {
          message: i18nInstance.t(
            "active.form.basketMinimalAmount.errors.invalidFormat",
          ),
        },
      )
      // 2. Check for at most two decimals (only if there's a decimal part)
      .refine(
        (value) => {
          const match = onlyTwoDecimalsMaxRegex.test(value);
          return match;
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
      .refine((value) => positivePriceRegex.test(value), {
        message: i18nInstance.t(
          "active.form.referringReward.errors.invalidFormat",
        ),
      })
      // 2. Check for at most two decimals (only if there's a decimal part)
      .refine(
        (value) => {
          const match = onlyTwoDecimalsMaxRegex.test(value);
          return match;
        },
        {
          message: i18nInstance.t(
            "active.form.referringReward.errors.tooManyDecimalPoints",
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
    referringRewardAmount: z
      .string()
      // 1. Check the general format: only digits, optional minus, optional decimal separator
      .refine((value) => positivePriceRegex.test(value), {
        message: i18nInstance.t(
          "active.form.referralReward.errors.invalidFormat",
        ),
      })
      // 2. Check for at most two decimals (only if there's a decimal part)
      .refine(
        (value) => {
          const match = onlyTwoDecimalsMaxRegex.test(value);
          return match;
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
      })
      .refine(
        (value) => {
          return Number.isInteger(value);
        },
        (value) => ({
          message: i18nInstance.t(
            "active.form.referralReward.errors.onlyWholePercentage",
            {
              wholeNumberUnder: Math.floor(value),
              wholeNumberAbove: Math.floor(value) + 1,
            },
          ),
        }),
      ),
    referringRewardType: z.custom<ReferringRewardOptionType>(),
    applicationTimeLimitInterval: z.coerce.number(),
    applicationTimeLimitUnit: z.custom<TimeUnit>(),
    toggleTagReferredMember: z.boolean(),
    tagReferredMember: z.number().nullable(),
    toggleLinkRedirection: z.boolean(),
    redirectLink: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (!value) return true; // If the field is not toggled, no need to validate
          return httpUrlRegex.test(value);
        },
        {
          message: i18nInstance.t(
            "active.form.redirectLink.errors.invalidFormat",
          ),
        },
      ),
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
    if (data.toggleTagReferredMember && !data.tagReferredMember) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t("active.form.tagSelector.errors.notProvided"),
        path: ["tagReferredMember"],
      });
    }
    if (data.toggleLinkRedirection && !data.redirectLink) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t("active.form.redirectLink.errors.notProvided"),
        path: ["redirectLink"],
      });
    }
  }) satisfies z.ZodType<ReferralProgramFormData>;

export type ReferralProgramFormSchema = z.infer<typeof referralProgramSchema>;
