import { useMemo } from "react";

import { formatDateTime } from "@bsport/datetime-formatting";
import {
  type CommunicationSent,
  selectRecipientsWithMemberData,
  useCommunicationStore,
} from "@bsport/store-communicate-communication";

import { useCompanyData } from "#src/hooks/api/use-company-data";
import type { MarketingNotificationRecipientsTableRowData } from "#src/utils/types";

function getCommunicationTitle(communication: CommunicationSent) {
  if (communication?.title) {
    return communication.title;
  } else if (communication?.data?.subject) {
    return communication.data.subject;
  }
  return "";
}

function getCommunicationBody(communication: CommunicationSent) {
  if (communication?.text) {
    return communication.text;
  } else if (communication?.data?.body) {
    return communication.data.body;
  }
  return "";
}

/**
 * Hook for formatting communication recipients data for table display.
 *
 * This hook takes raw communication sent data and formats it into the structure
 * needed for the marketing notification recipients table. It handles date/time
 * formatting, recipient identity extraction, and status mapping.
 *
 * @param communicationSentList - Array containing communication sent data
 * @returns Formatted array of recipient table row data
 */
export function useFormatCommunicationRecipientsWithMemberData(
  communicationSentList: CommunicationSent[],
) {
  const { userLocale, companyTimezone } = useCompanyData();
  const recipientsWithMemberData = useCommunicationStore(
    selectRecipientsWithMemberData,
  );

  const formattedRecipients =
    useMemo((): MarketingNotificationRecipientsTableRowData[] => {
      return communicationSentList.map((communication) => {
        const formattedDate = formatDateTime(
          communication.date_created,
          "year-month-day",
          {
            locale: userLocale,
            timeZone: companyTimezone,
          },
        );
        const formattedTime = formatDateTime(
          communication.date_created,
          "time-simple",
          {
            locale: userLocale,
            timeZone: companyTimezone,
          },
        );
        const communicationRecipients =
          recipientsWithMemberData?.[communication.uuid];
        const mainRecipientId =
          communication?.recipient_member_id_list?.[0] || 0;
        const mainRecipient =
          communicationRecipients?.byId[mainRecipientId] ||
          Object.values(communicationRecipients?.byId || {}).find(
            (recipient) => communication?.id === recipient?.communication_sent,
          );
        const recipientsRelationshipsCount =
          (communication?.recipient_member_id_list?.length || 1) - 1;

        return {
          id: communication.id,
          communicationKind: communication.kind,
          dateSent: formattedDate,
          hourSent: formattedTime,
          recipientFullName: mainRecipient?.full_name || "",
          recipientEmail: mainRecipient?.email || "",
          recipientMemberId: mainRecipient?.member || 0,
          status: communication.status,
          isNotificationRead: mainRecipient?.read_count > 0 || false,
          recipientsRelationshipsCount,
          notificationContent: {
            title: getCommunicationTitle(communication),
            body: getCommunicationBody(communication),
          },
        };
      });
    }, [
      communicationSentList,
      recipientsWithMemberData,
      userLocale,
      companyTimezone,
    ]);

  return formattedRecipients;
}
