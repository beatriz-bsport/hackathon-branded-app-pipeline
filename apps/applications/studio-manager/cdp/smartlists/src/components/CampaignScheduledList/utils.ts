import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import { CampaignScheduled } from "#src/api/types";
import { CAMPAIGN_SCHEDULED_DETAILS_URL } from "#src/urls";
import { getFallbackCampaignScheduledName } from "#src/utils/campaignUtils";
import { i18nInstance } from "#src/utils/i18n";

import { CampaignScheduledTableRowData } from "./use-campaign-scheduled-table-columns";

const CAMPAIGN_SCHEDULED_ROW_PREFIX = "campaign-scheduled-row";
const CAMPAIGN_SCHEDULED_ROW_ID = (campaignId: number) =>
  `${CAMPAIGN_SCHEDULED_ROW_PREFIX}-${campaignId}`;

function formatCampaignScheduledTableRow({
  campaignScheduledList,
  smartlistId,
}: {
  campaignScheduledList: CampaignScheduled[];
  smartlistId: string;
}): CampaignScheduledTableRowData[] {
  return campaignScheduledList.map((campaignScheduled) => ({
    id: CAMPAIGN_SCHEDULED_ROW_ID(campaignScheduled.id),
    campaignId: campaignScheduled.id,
    campaignKind: campaignScheduled.communication_kind,
    campaignName: getFallbackCampaignScheduledName(campaignScheduled),
    scheduledDate: formatDateTime(
      campaignScheduled.datetime_scheduled,
      DATETIME_FORMATS.YEAR_MONTH_DAY,
      {
        locale: i18nInstance.language,
      },
    ),
    scheduledHour: formatDateTime(
      campaignScheduled.datetime_scheduled,
      DATETIME_FORMATS.TIME_SIMPLE,
      {
        locale: i18nInstance.language,
      },
    ),
    link: CAMPAIGN_SCHEDULED_DETAILS_URL({
      campaignId: campaignScheduled.id,
      smartlistId: smartlistId,
    }),
  }));
}

export { formatCampaignScheduledTableRow };
