import { z } from "zod";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";

import { i18nInstance } from "#src/utils/i18n";

import { CAMPAIGN_NAME_MAX_LENGTH } from "./EmailNameField";
import { DELIVERY_MODE_VALUES, EMAIL_TYPE_VALUES } from "./constants";
import type { EmailCampaignFormData } from "./types";
import { MIN_SCHEDULE_MINUTES_FROM_NOW } from "./use-scheduled-date-time-validator";
import {
  isCommunicationScheduledInPast,
  isCommunicationScheduledTooSoon,
} from "./utils";

const subjectRequiredMessage = () =>
  i18nInstance.t("email.creation.form.message.subjectRequired", {
    ns: "sm-smartlists_campaign",
  });
const bodyRequiredMessage = () =>
  i18nInstance.t("email.creation.form.message.bodyRequired", {
    ns: "sm-smartlists_campaign",
  });

/** Message content: text-only (subject + body required) vs email template (optional). */
const messageContentSchema = z.discriminatedUnion("isTextOnly", [
  z.object({
    isTextOnly: z.literal(true),
    emailSubject: z.string().refine(
      (val) => val.trim().length > 0,
      () => ({ message: subjectRequiredMessage() }),
    ),
    emailBody: z.string().refine(
      (val) => val.trim().length > 0,
      () => ({ message: bodyRequiredMessage() }),
    ),
  }),
  z.object({
    isTextOnly: z.literal(false),
    emailSubject: z.string().optional(),
    emailBody: z.string().optional(),
  }),
]);

type ScheduleRefinementData = {
  deliveryMode: string;
  scheduledDate?: string;
  scheduledTime?: string;
};

/** Shared schedule validation for "schedule_later" delivery mode. */
function addScheduleRefinement<T extends ScheduleRefinementData>(
  ctx: z.RefinementCtx,
  data: T,
  companyTimezone: string,
): void {
  if (data.deliveryMode !== "schedule_later") return;

  if (!data.scheduledDate?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "email.creation.delivery.validation.scheduledDateRequired",
        { ns: "sm-smartlists_campaign" },
      ),
      path: ["scheduledDate"],
    });
    return;
  }
  if (!data.scheduledTime?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "email.creation.delivery.validation.scheduledTimeRequired",
        { ns: "sm-smartlists_campaign" },
      ),
      path: ["scheduledTime"],
    });
    return;
  }

  const zone = companyTimezone || "UTC";
  const now = getLocalNow({ zone });

  let scheduledDatetime: ReturnType<typeof fromIsoString> | null = null;
  try {
    const [hour, minute] = data.scheduledTime.trim().split(":").map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          "email.creation.delivery.validation.scheduledTimeRequired",
          { ns: "sm-smartlists_campaign" },
        ),
        path: ["scheduledDate"],
      });
      return;
    }
    scheduledDatetime = fromIsoString(data.scheduledDate.trim(), {
      zone,
    }).set({
      hour,
      minute,
      second: 0,
      millisecond: 0,
    });
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "email.creation.delivery.validation.scheduledDateInvalid",
        { ns: "sm-smartlists_campaign" },
      ),
      path: ["scheduledDate"],
    });
    return;
  }

  if (scheduledDatetime && isCommunicationScheduledInPast(scheduledDatetime)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "email.creation.delivery.validation.scheduledDateNotInPast",
        { ns: "sm-smartlists_campaign" },
      ),
      path: ["scheduledDate"],
    });
  }

  if (
    scheduledDatetime &&
    isCommunicationScheduledTooSoon(
      scheduledDatetime,
      now,
      MIN_SCHEDULE_MINUTES_FROM_NOW,
    )
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "email.creation.delivery.validation.scheduledAtLeast5Minutes",
        { ns: "sm-smartlists_campaign" },
      ),
      path: ["scheduledTime"],
    });
  }
}

export const getEmailCampaignSchema = (companyTimezone: string) => {
  const baseSchema = z.object({
    emailType: z.enum(EMAIL_TYPE_VALUES, {
      required_error: i18nInstance.t("email.creation.form.emailType.required", {
        ns: "sm-smartlists_campaign",
      }),
    }),
    campaignName: z
      .string()
      .min(1, {
        message: i18nInstance.t("email.creation.form.campaignName.required", {
          ns: "sm-smartlists_campaign",
        }),
      })
      .max(CAMPAIGN_NAME_MAX_LENGTH, {
        message: i18nInstance.t(
          "email.creation.form.campaignName.errorMaxLength",
          {
            ns: "sm-smartlists_campaign",
            count: CAMPAIGN_NAME_MAX_LENGTH,
          },
        ),
      }),
    deliveryMode: z.enum(DELIVERY_MODE_VALUES),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
  });

  return baseSchema.and(messageContentSchema).superRefine((data, ctx) => {
    addScheduleRefinement(ctx, data, companyTimezone);
  }) as z.ZodType<EmailCampaignFormData>;
};

export type EmailCampaignFormSchema = z.infer<
  ReturnType<typeof getEmailCampaignSchema>
>;
