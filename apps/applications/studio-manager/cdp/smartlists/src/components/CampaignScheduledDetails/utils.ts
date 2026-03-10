import { CommunicationKind } from "#src/api/constants";
import type { CommunicationRecipientMinimal } from "#src/api/types";
import { getMemberInitialsFromFullName } from "#src/utils/memberUtils";

import { CampaignScheduledRecipientTableRowData } from "./use-campaign-scheduled-recipient-table-columns";

const CAMPAIGN_SCHEDULED_RECIPIENTS_ROW_PREFIX =
  "campaign-scheduled-recipients-row";
const CAMPAIGN_SCHEDULED_RECIPIENTS_ROW_ID = (recipientId: number) =>
  `${CAMPAIGN_SCHEDULED_RECIPIENTS_ROW_PREFIX}-${recipientId}`;
export const MEMBER_PROFILE_URL = (memberId: number) =>
  `/member/${memberId}/info`;

function formatCampaignScheduledRecipientsTableRow({
  campaignRecipientList,
  campaignKind,
}: {
  campaignRecipientList: CommunicationRecipientMinimal[];
  campaignKind: CommunicationKind;
}): CampaignScheduledRecipientTableRowData[] {
  return campaignRecipientList.map((recipient) => ({
    id: CAMPAIGN_SCHEDULED_RECIPIENTS_ROW_ID(recipient.id),
    memberId: recipient.id,
    recipientPhoneNumber: recipient.phone ?? "",
    recipientEmail: recipient.email,
    recipientName: recipient.name,
    recipientInitials: getMemberInitialsFromFullName(recipient.name),
    recipientPhoto: recipient.photo ?? null,
    campaignKind: campaignKind,
    link: MEMBER_PROFILE_URL(recipient.id),
  }));
}

export { formatCampaignScheduledRecipientsTableRow };
