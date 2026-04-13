import { fromIsoString } from "@bsport/datetime-manipulation";

import type { CampaignScheduled } from "#src/api/types";
import { DELIVERY_MODE_SCHEDULE_LATER } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";

export const initSmsCampaignFormDefaultValues = ({
  campaign,
  companyTimezone,
}: {
  campaign: CampaignScheduled;
  companyTimezone: string;
}) => {
  const scheduledDateTime = fromIsoString(campaign.datetime_scheduled, {
    zone: companyTimezone,
  });

  return {
    formDefaults: {
      campaignName: campaign.title ?? "",
      deliveryMode: DELIVERY_MODE_SCHEDULE_LATER,
      scheduledDate: scheduledDateTime.toISODate() ?? undefined,
      scheduledTime: scheduledDateTime.toFormat("HH:mm"),
      message: campaign.text ?? "",
    },
  };
};
