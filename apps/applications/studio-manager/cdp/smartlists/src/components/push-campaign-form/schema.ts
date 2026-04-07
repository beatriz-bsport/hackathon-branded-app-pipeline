import { z } from "zod";

import { CAMPAIGN_NAME_MAX_LENGTH } from "#src/components/campaign-generic-fields/campaign-name-field";
import { i18nInstance } from "#src/utils/i18n";

import type { PushCampaignFormData } from "./types";

export const pushCampaignSchema = z.object({
  campaignName: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: i18nInstance.t(
        "push.creation.form.errors.campaignNameRequired",
        {
          ns: "sm-smartlists_campaign",
        },
      ),
    })
    .refine((value) => value.trim().length <= CAMPAIGN_NAME_MAX_LENGTH, {
      message: i18nInstance.t("push.creation.form.errors.errorMaxLength", {
        ns: "sm-smartlists_campaign",
        count: CAMPAIGN_NAME_MAX_LENGTH,
      }),
    }),
}) as z.ZodType<PushCampaignFormData>;
