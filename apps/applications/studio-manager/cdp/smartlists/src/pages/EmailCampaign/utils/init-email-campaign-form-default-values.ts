import { fromIsoString } from "@bsport/datetime-manipulation";

import type { CampaignScheduled } from "#src/api/types";
import { EMAIL_TYPE_MARKETING } from "#src/components/EmailCampaignForm/constants";
import { DELIVERY_MODE_SCHEDULE_LATER } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";

export const initEmailCampaignFormDefaultValues = ({
  campaign,
  companyTimezone,
}: {
  campaign: CampaignScheduled;
  companyTimezone: string;
}) => {
  const scheduledDateTime = fromIsoString(campaign.datetime_scheduled, {
    zone: companyTimezone,
  });

  const hasTemplateId = campaign.email_design != null;
  const body = campaign.text ?? "";
  const isOnTheFlyHtmlTemplate = !hasTemplateId && body.trim().length > 0;

  return {
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
      isOnTheFlyHtmlTemplate,
    },
  };
};
