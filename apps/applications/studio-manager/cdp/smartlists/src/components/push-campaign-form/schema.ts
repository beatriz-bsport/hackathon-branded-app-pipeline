import { z } from "zod";

import {
  addCampaignScheduleRefinement,
  getCampaignBaseObjectSchema,
} from "#src/components/campaign-generic-fields/campaign-base-schema";

import type { PushCampaignFormData } from "./types";

export const getPushCampaignSchema = (companyTimezone: string) =>
  getCampaignBaseObjectSchema().superRefine((data, ctx) => {
    addCampaignScheduleRefinement(ctx, data, companyTimezone);
  }) as z.ZodType<PushCampaignFormData>;
