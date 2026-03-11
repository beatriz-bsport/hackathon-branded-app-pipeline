import { DateTime } from "luxon";

import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";

import { CommunicationKind } from "#src/api/constants";
import type { CampaignRecipientWithMemberData } from "#src/api/types";
import { getMemberInitialsFromFullName } from "#src/utils/memberUtils";

import { CampaignSentRecipientTableRowData } from "./use-campaign-sent-recipient-table-columns";

const CAMPAIGN_SENT_RECIPIENTS_ROW_PREFIX = "campaign-sent-recipients-row";
const CAMPAIGN_SENT_RECIPIENTS_ROW_ID = (recipientId: string) =>
  `${CAMPAIGN_SENT_RECIPIENTS_ROW_PREFIX}-${recipientId}`;
export const MEMBER_PROFILE_URL = (memberId: number) =>
  `/member/${memberId}/info`;

function formatCampaignSentRecipientsTableRow({
  campaignRecipientList,
  campaignKind,
  defaultEmptyDate,
}: {
  campaignRecipientList: CampaignRecipientWithMemberData[];
  campaignKind: CommunicationKind;
  defaultEmptyDate: string;
}): CampaignSentRecipientTableRowData[] {
  return campaignRecipientList.map((recipient) => {
    const lastOpenedDateTime = recipient.last_read
      ? DateTime.fromSeconds(recipient.last_read)
      : null;
    const lastOpenedDate = lastOpenedDateTime
      ? formatDateTimeFromDate(
          lastOpenedDateTime,
          DATETIME_FORMATS.YEAR_MONTH_DAY,
        )
      : defaultEmptyDate;
    const lastOpenedHour = lastOpenedDateTime
      ? formatDateTimeFromDate(lastOpenedDateTime, DATETIME_FORMATS.TIME_SIMPLE)
      : defaultEmptyDate;
    return {
      id: CAMPAIGN_SENT_RECIPIENTS_ROW_ID(recipient.member.toString()),
      memberId: recipient.member,
      recipientPhoneNumber: recipient.phonenumber,
      recipientEmail: recipient.email,
      recipientAvatar: recipient.avatar,
      recipientInitials: getMemberInitialsFromFullName(recipient.full_name),
      recipientName: recipient.full_name,
      lastOpenedDate: lastOpenedDate,
      lastOpenedHour: lastOpenedHour,
      status: recipient.status,
      openCount: recipient.read_count,
      clickCount: recipient.links_opened_count,
      campaignKind: campaignKind,
      link: MEMBER_PROFILE_URL(recipient.member),
    };
  });
}

export { formatCampaignSentRecipientsTableRow };
