import { useMemo } from "react";

import { formatDateTime } from "@bsport/datetime-formatting";
import {
  CommunicationKind,
  type CommunicationRecipient,
  type CommunicationSent,
  selectRecipients,
  useCommunicationStore,
} from "@bsport/store-communicate-communication";

import { useCompanyData } from "#src/hooks/api/use-company-data";
import type { MarketingNotificationRecipientsTableRowData } from "#src/utils/types";

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
export function useFormatCommunicationRecipients(
  communicationSentList: CommunicationSent[],
) {
  const { userLocale, companyTimezone } = useCompanyData();
  const recipients = useCommunicationStore(selectRecipients);

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
        const communicationRecipients = recipients?.[communication.id];
        const mainRecipientId =
          communication?.recipient_member_id_list?.[0] || 0;
        const mainRecipient =
          communicationRecipients?.byId[mainRecipientId] ||
          Object.values(communicationRecipients?.byId || {}).find(
            (recipient) => communication?.id === recipient?.communication_sent,
          );
        const recipientsRelationshipsCount =
          (communication?.recipient_member_id_list?.length || 1) - 1;

        const recipientIdentity = getRecipientIdentity({
          communication,
          recipient: mainRecipient!,
        });

        return {
          id: communication.id,
          communicationKind: communication.kind,
          dateSent: formattedDate,
          hourSent: formattedTime,
          recipientIdentity,
          status: communication.status,
          isNotificationRead: mainRecipient?.read_count > 0 || false,
          recipientsRelationshipsCount,
        };
      });
    }, [communicationSentList, recipients, userLocale, companyTimezone]);

  return formattedRecipients;
}

/**
 * Helper function to extract recipient identity based on communication kind
 *
 * @param communication - The communication object
 * @returns The recipient identity string (email for kind 0, name for others)
 */
function getRecipientIdentity({
  communication,
  recipient,
}: {
  communication: CommunicationSent;
  recipient: CommunicationRecipient;
}): string {
  const firstRecipient = communication?.data.recipient_list?.[0];

  if (!firstRecipient) {
    return recipient?.email || "";
  }

  // For email communications (kind === 0), prefer email address
  if (communication.kind === CommunicationKind.EMAIL) {
    return firstRecipient.email || firstRecipient.name || "";
  }

  // For other communication types, use name
  return firstRecipient.name || "";
}
