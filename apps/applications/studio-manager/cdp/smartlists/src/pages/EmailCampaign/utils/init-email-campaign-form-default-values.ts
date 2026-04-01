import { fromIsoString } from "@bsport/datetime-manipulation";

import type { CampaignScheduled } from "#src/api/types";
import {
  DELIVERY_MODE_SCHEDULE_LATER,
  EMAIL_TYPE_MARKETING,
} from "#src/components/EmailCampaignForm/constants";
import type { EmailCampaignFormData } from "#src/components/EmailCampaignForm/types";

type InitEmailCampaignFormDefaultsResult = {
  formDefaults: EmailCampaignFormData;
  isOnTheFlyHtmlTemplate: boolean;
};

export const initEmailCampaignFormDefaultValues = ({
  campaign,
  companyTimezone,
}: {
  campaign: CampaignScheduled;
  companyTimezone: string;
}): InitEmailCampaignFormDefaultsResult => {
  const scheduledDateTime = fromIsoString(campaign.datetime_scheduled, {
    zone: companyTimezone,
  });

  const hasTemplateId = campaign.email_design != null;
  const body = campaign.text ?? "";
  const isOnTheFlyHtmlTemplate = !hasTemplateId && body.trim().length > 0;

  return {
    isOnTheFlyHtmlTemplate,
    formDefaults: {
      emailType: EMAIL_TYPE_MARKETING,
      // TODO: Replace once campaign name backend support is available.
      campaignName: campaign.title ?? "",
      deliveryMode: DELIVERY_MODE_SCHEDULE_LATER,
      scheduledDate: scheduledDateTime.toISODate() ?? undefined,
      scheduledTime: scheduledDateTime.toFormat("HH:mm"),
      isTextOnly: false,
      emailSubject: campaign.title ?? "",
      emailBody: "",
      emailTemplateId: campaign.email_design,
      emailTemplateDesign: undefined,
      emailTemplateHtml: body,
    },
  };
};
