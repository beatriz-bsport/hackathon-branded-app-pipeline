import { z } from "zod";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";

import { i18nInstance } from "#src/utils/i18n";

import {
  DELIVERY_MODE_SCHEDULE_LATER,
  DELIVERY_MODE_VALUES,
  MIN_SCHEDULE_MINUTES_FROM_NOW,
} from "./campaign-delivery-mode.constants";
import {
  isCommunicationScheduledInPast,
  isCommunicationScheduledTooSoon,
} from "./campaign-delivery-mode.utils";
import { CAMPAIGN_NAME_MAX_LENGTH } from "./campaign-name-field";

export type CampaignBaseSchemaData = {
  campaignName: string;
  deliveryMode: string;
  scheduledDate?: string;
  scheduledTime?: string;
};

export const getCampaignBaseObjectSchema = () =>
  z.object({
    campaignName: z
      .string()
      .max(CAMPAIGN_NAME_MAX_LENGTH, {
        message: i18nInstance.t("generic.creation.form.errors.errorMaxLength", {
          ns: "sm-smartlists_campaign",
          count: CAMPAIGN_NAME_MAX_LENGTH,
        }),
      })
      .refine((value) => value.trim().length > 0, {
        message: i18nInstance.t(
          "generic.creation.form.errors.campaignNameRequired",
          {
            ns: "sm-smartlists_campaign",
          },
        ),
      }),
    deliveryMode: z.enum(DELIVERY_MODE_VALUES),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
  });

export function addCampaignScheduleRefinement<T extends CampaignBaseSchemaData>(
  ctx: z.RefinementCtx,
  data: T,
  companyTimezone: string,
): void {
  if (data.deliveryMode !== DELIVERY_MODE_SCHEDULE_LATER) return;
  const scheduledDate = data.scheduledDate?.trim();
  const scheduledTime = data.scheduledTime?.trim();

  if (!scheduledDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "generic.creation.form.errors.scheduledDateRequired",
        {
          ns: "sm-smartlists_campaign",
        },
      ),
      path: ["scheduledDate"],
    });
  }
  if (!scheduledTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "generic.creation.form.errors.scheduledTimeRequired",
        {
          ns: "sm-smartlists_campaign",
        },
      ),
      path: ["scheduledTime"],
    });
  }
  if (!scheduledDate || !scheduledTime) return;

  const zone = companyTimezone || "UTC";
  const now = getLocalNow({ zone });

  let scheduledDatetime: ReturnType<typeof fromIsoString> | null = null;
  try {
    const [hour, minute] = scheduledTime.split(":").map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18nInstance.t(
          "generic.creation.form.errors.scheduledTimeRequired",
          {
            ns: "sm-smartlists_campaign",
          },
        ),
        path: ["scheduledDate"],
      });
      return;
    }
    scheduledDatetime = fromIsoString(scheduledDate, { zone }).set({
      hour,
      minute,
      second: 0,
      millisecond: 0,
    });
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "generic.creation.form.errors.scheduledDateInvalid",
        {
          ns: "sm-smartlists_campaign",
        },
      ),
      path: ["scheduledDate"],
    });
    return;
  }

  if (scheduledDatetime && isCommunicationScheduledInPast(scheduledDatetime)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18nInstance.t(
        "generic.creation.form.errors.scheduledDateNotInPast",
        {
          ns: "sm-smartlists_campaign",
        },
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
        "generic.creation.form.errors.scheduledAtLeast5Minutes",
        {
          ns: "sm-smartlists_campaign",
        },
      ),
      path: ["scheduledTime"],
    });
  }
}
