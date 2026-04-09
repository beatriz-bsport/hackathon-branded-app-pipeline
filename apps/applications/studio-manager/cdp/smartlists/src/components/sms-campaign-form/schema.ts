import { z } from "zod";

import {
  addCampaignScheduleRefinement,
  getCampaignBaseObjectSchema,
} from "#src/components/campaign-generic-fields/campaign-base-schema";
import { getSmsContentObjectSchema } from "#src/components/sms-content-generic-field/schema";

import type { SmsCampaignFormData } from "./types";

export const getSmsCampaignSchema = (
  companyTimezone: string,
): z.ZodType<SmsCampaignFormData> =>
  getCampaignBaseObjectSchema()
    .and(getSmsContentObjectSchema())
    .superRefine((data, ctx) => {
      addCampaignScheduleRefinement(ctx, data, companyTimezone);
    });
