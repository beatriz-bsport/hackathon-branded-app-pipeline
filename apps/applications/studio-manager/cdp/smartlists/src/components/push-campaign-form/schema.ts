import { z } from "zod";

import {
  addCampaignScheduleRefinement,
  getCampaignBaseObjectSchema,
} from "#src/components/campaign-generic-fields/campaign-base-schema";
import { getPushNotificationContentObjectSchema } from "#src/components/push-notification-generic-field/schema";

import type { PushCampaignFormData } from "./types";

export const getPushCampaignSchema = (companyTimezone: string) =>
  getCampaignBaseObjectSchema()
    .and(getPushNotificationContentObjectSchema())
    .superRefine((data, ctx) => {
      addCampaignScheduleRefinement(ctx, data, companyTimezone);
    }) as z.ZodType<PushCampaignFormData>;
