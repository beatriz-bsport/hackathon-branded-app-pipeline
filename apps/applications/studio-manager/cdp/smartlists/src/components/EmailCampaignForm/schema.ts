import { z } from "zod";

import {
  addCampaignScheduleRefinement,
  getCampaignBaseObjectSchema,
} from "#src/components/campaign-generic-fields/campaign-base-schema";
import { i18nInstance } from "#src/utils/i18n";

import { EMAIL_TYPE_VALUES } from "./constants";
import type { EmailCampaignFormData } from "./types";

const subjectRequiredMessage = () =>
  i18nInstance.t("email.creation.form.errors.subjectRequired", {
    ns: "sm-smartlists_campaign",
  });
const bodyRequiredMessage = () =>
  i18nInstance.t("email.creation.form.errors.bodyRequired", {
    ns: "sm-smartlists_campaign",
  });

/** Message content: text-only (subject + body required) vs email template (subject required, template id optional). */
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
    emailSubject: z.string().refine(
      (val) => (val ?? "").trim().length > 0,
      () => ({ message: subjectRequiredMessage() }),
    ),
    emailBody: z.string().optional(),
    emailTemplateId: z.number().nullable().optional(),
    emailTemplateDesign: z.string().nullable().optional(),
    emailTemplateHtml: z.string({
      message: i18nInstance.t(
        "email.creation.form.errors.selectEmailTemplate",
        {
          ns: "sm-smartlists_campaign",
        },
      ),
    }),
  }),
]);

export const getEmailCampaignSchema = (companyTimezone: string) => {
  const emailChannelSchema = z.object({
    emailType: z.enum(EMAIL_TYPE_VALUES, {
      required_error: i18nInstance.t(
        "email.creation.form.errors.emailTypeRequired",
        {
          ns: "sm-smartlists_campaign",
        },
      ),
    }),
  });
  return getCampaignBaseObjectSchema()
    .and(emailChannelSchema)
    .and(messageContentSchema)
    .superRefine((data, ctx) => {
      addCampaignScheduleRefinement(ctx, data, companyTimezone);
    }) as z.ZodType<EmailCampaignFormData>;
};

export type EmailCampaignFormSchema = z.infer<
  ReturnType<typeof getEmailCampaignSchema>
>;
