import type { CampaignScheduled } from "@bsport/api-cdp/communicate";
import { fromIsoString } from "@bsport/datetime-manipulation";

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
  const hasHtmlTags =
    /<!DOCTYPE/i.test(body) || /<\/?[a-z][\w:-]*(?:\s[^<>]*)?>/i.test(body);
  const isTextOnly = body.trim().length > 0 && !hasHtmlTags && !hasTemplateId;
  const isOnTheFlyHtmlTemplate = !hasTemplateId && hasHtmlTags;

  const baseFormDefaults = {
    emailType: EMAIL_TYPE_MARKETING,
    campaignName: campaign.title ?? "",
    deliveryMode: DELIVERY_MODE_SCHEDULE_LATER,
    scheduledDate: scheduledDateTime.toISODate() ?? undefined,
    scheduledTime: scheduledDateTime.toFormat("HH:mm"),
    emailSubject: campaign.title ?? "",
  };

  if (isTextOnly) {
    return {
      formDefaults: {
        ...baseFormDefaults,
        isTextOnly: true,
        emailBody: body,
        emailTemplateId: undefined,
        emailTemplateDesign: undefined,
        emailTemplateHtml: undefined,
        isOnTheFlyHtmlTemplate,
      },
    };
  }

  if (isOnTheFlyHtmlTemplate) {
    return {
      formDefaults: {
        ...baseFormDefaults,
        isTextOnly: false,
        emailBody: undefined,
        emailTemplateId: undefined,
        emailTemplateDesign: undefined,
        emailTemplateHtml: body,
        isOnTheFlyHtmlTemplate: true,
      },
    };
  }
  return {
    formDefaults: {
      ...baseFormDefaults,
      isTextOnly: false,
      emailBody: undefined,
      emailTemplateId: campaign.email_design,
      emailTemplateDesign: undefined,
      emailTemplateHtml: undefined,
      isOnTheFlyHtmlTemplate: false,
    },
  };
};
