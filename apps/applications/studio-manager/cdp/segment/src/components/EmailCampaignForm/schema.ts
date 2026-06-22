import { z } from "zod";

import {
  addCampaignScheduleRefinement,
  getCampaignBaseObjectSchema,
} from "#src/components/campaign-generic-fields/campaign-base-schema";
import { i18nInstance } from "#src/utils/i18n";

import { EMAIL_TYPE_VALUES } from "./constants";
import type {
  EmailCampaignFormData,
  EmailChannelFormData,
  EmailMessageContentFormData,
} from "./types";

const subjectRequiredMessage = () =>
  i18nInstance.t("email.creation.form.errors.subjectRequired", {
    ns: "sm-smartlists_campaign",
  });
const bodyRequiredMessage = () =>
  i18nInstance.t("email.creation.form.errors.bodyRequired", {
    ns: "sm-smartlists_campaign",
  });

/** Message content: text-only (subject + body required) vs email template (subject required, template id optional). */
export const emailMessageContentSchema = z.discriminatedUnion("isTextOnly", [
  z.object({
    isTextOnly: z.literal(true),
    emailSubject: z.string({
      message: subjectRequiredMessage(),
    }),
    emailBody: z.string({
      message: bodyRequiredMessage(),
    }),
    emailTemplateId: z.number().nullable().optional(),
    emailTemplateDesign: z.string().nullable().optional(),
    emailTemplateHtml: z.string().optional(),
    isOnTheFlyHtmlTemplate: z.boolean().optional(),
  }),
  z.object({
    isTextOnly: z.literal(false),
    emailSubject: z.string({
      message: subjectRequiredMessage(),
    }),
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
    isOnTheFlyHtmlTemplate: z.boolean().optional(),
  }),
]) satisfies z.ZodType<EmailMessageContentFormData>;

export const emailChannelSchema = z.object({
  // Email type UI is hidden; forms always default to marketing.
  emailType: z.enum(EMAIL_TYPE_VALUES),
}) satisfies z.ZodType<EmailChannelFormData>;

export const getEmailCampaignSchema = (companyTimezone: string) => {
  const emailCampaignSchema = getCampaignBaseObjectSchema()
    .and(emailChannelSchema)
    .and(emailMessageContentSchema)
    .superRefine((data, ctx) => {
      addCampaignScheduleRefinement(ctx, data, companyTimezone);
    }) satisfies z.ZodType<EmailCampaignFormData>;

  return emailCampaignSchema;
};

export type EmailCampaignFormSchema = z.infer<
  ReturnType<typeof getEmailCampaignSchema>
>;
