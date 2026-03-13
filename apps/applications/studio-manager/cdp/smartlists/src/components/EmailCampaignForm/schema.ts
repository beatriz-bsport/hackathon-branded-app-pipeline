import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { CAMPAIGN_NAME_MAX_LENGTH } from "./EmailNameField";
import { EMAIL_TYPE_VALUES } from "./constants";
import type { EmailCampaignFormData } from "./types";

export const getEmailCampaignSchema = () =>
  z.object({
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
  }) satisfies z.ZodType<EmailCampaignFormData>;

export type EmailCampaignFormSchema = z.infer<
  ReturnType<typeof getEmailCampaignSchema>
>;
