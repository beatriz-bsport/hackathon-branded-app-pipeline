import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import type { CampaignSent } from "#src/api/types";
import { CAMPAIGN_SENT_DETAILS_URL } from "#src/urls";
import { getFallbackCampaignName } from "#src/utils/campaignUtils";
import { i18nInstance } from "#src/utils/i18n";

import { CampaignSentTableRowData } from "./use-campaign-sent-table-columns";

const CAMPAIGN_SENT_ROW_PREFIX = "campaign-sent-row";
const CAMPAIGN_SENT_ROW_ID = (campaignUuid: string) =>
  `${CAMPAIGN_SENT_ROW_PREFIX}-${campaignUuid}`;

function formatCampaignSentTableRow({
  campaignSentList,
  smartlistId,
}: {
  campaignSentList: CampaignSent[];
  smartlistId: string;
}): CampaignSentTableRowData[] {
  return campaignSentList.map((campaignSent) => ({
    id: CAMPAIGN_SENT_ROW_ID(campaignSent.uuid),
    campaignUuid: campaignSent.uuid,
    campaignKind: campaignSent.kind,
    campaignName: getFallbackCampaignName(campaignSent),
    sentDate: formatDateTime(
      campaignSent.date_created,
      DATETIME_FORMATS.YEAR_MONTH_DAY,
      {
        locale: i18nInstance.language,
      },
    ),
    sentHour: formatDateTime(
      campaignSent.date_created,
      DATETIME_FORMATS.TIME_SIMPLE,
      {
        locale: i18nInstance.language,
      },
    ),
    campaignAnalytics: {
      recipients: campaignSent.total_recipients,
      openCount: campaignSent.total_read,
      clickCount: campaignSent.total_click,
    },
    link: CAMPAIGN_SENT_DETAILS_URL({
      campaignUuid: campaignSent.uuid,
      smartlistId: smartlistId,
    }),
  }));
}

export { formatCampaignSentTableRow };
