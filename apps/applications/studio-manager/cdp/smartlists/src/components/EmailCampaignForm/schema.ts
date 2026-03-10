import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { EMAIL_TYPE_VALUES } from "./constants";
import type { EmailCampaignFormData } from "./types";

export const getEmailCampaignSchema = () =>
  z.object({
    emailType: z.enum(EMAIL_TYPE_VALUES, {
      required_error: i18nInstance.t("email.creation.form.emailType.required", {
        ns: "sm-smartlists_campaign",
      }),
    }),
  }) satisfies z.ZodType<EmailCampaignFormData>;

export type EmailCampaignFormSchema = z.infer<
  ReturnType<typeof getEmailCampaignSchema>
>;
