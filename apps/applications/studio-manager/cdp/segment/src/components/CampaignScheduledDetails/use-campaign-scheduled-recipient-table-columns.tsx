import { useMemo } from "react";

import { CommunicationKind } from "@bsport/api-cdp/automated-campaign";
import { Body, type GenericTableColumn } from "@bsport/kaizen-primitive-core";

import { MemberAvatar } from "#src/components/member-avatar";
import { i18nInstance, useTranslation } from "#src/utils/i18n";

import { CampaignScheduledRecipientActionDropdown } from "./CampaignScheduledRecipientActionDropdown";

export type CampaignScheduledRecipientTableRowData = {
  id: string;
  memberId: number;
  campaignKind: CommunicationKind;
  recipientPhoneNumber: string;
  recipientEmail: string;
  recipientName: string;
  recipientPhoto: string | null;
  link: string;
};

export type CampaignScheduledTableRowParams = {
  navigateToMemberProfile: (memberId: number) => void;
  copyContactInfo: (contactInfo: string) => void;
};

type TableColumn = GenericTableColumn<CampaignScheduledRecipientTableRowData>;

/**
 * React hook that returns the column configs for the Campaign Sent Recipients table.
 */
export const useCampaignScheduledRecipientTableColumns = ({
  navigateToMemberProfile,
  copyContactInfo,
}: CampaignScheduledTableRowParams): Array<TableColumn> => {
  const { t } = useTranslation("campaign");
  const columns = useMemo<Array<TableColumn>>(() => {
    const columnMemberIdentity: TableColumn = {
      header: t("table.campaignRecipient.headers.memberIdentity"),
      id: "column-member-identity",
      type: "custom",
      align: "start",
      render: (row) => {
        return (
          <div className="flex flex-row gap-sm items-center">
            <MemberAvatar name={row.recipientName} photo={row.recipientPhoto} />
            <div className="flex flex-col gap-2xs">
              <Body size="lg" htmlVariant="span" weight="weak">
                {row.recipientName}
              </Body>
              {row.campaignKind === CommunicationKind.EMAIL && (
                <Body size="md" htmlVariant="p" weight="weak" color="weak">
                  {row.recipientEmail}
                </Body>
              )}
              {row.campaignKind === CommunicationKind.SMS && (
                <Body size="md" htmlVariant="p" weight="weak" color="weak">
                  {row.recipientPhoneNumber}
                </Body>
              )}
            </div>
          </div>
        );
      },
    };

    const columnMoreActions: TableColumn = {
      header: "",
      id: "column-more-action",
      keyPath: "",
      type: "custom",
      align: "end",
      render: (row) => {
        const contactInfoToCopy = {
          [CommunicationKind.EMAIL]: row.recipientEmail,
          [CommunicationKind.SMS]: row.recipientPhoneNumber,
          [CommunicationKind.PUSH]: row.recipientName,
        };

        return (
          <CampaignScheduledRecipientActionDropdown
            memberId={row.memberId}
            contactInfo={contactInfoToCopy[row.campaignKind]}
            campaignKind={row.campaignKind}
            navigateToMemberProfile={navigateToMemberProfile}
            copyContactInfo={copyContactInfo}
          />
        );
      },
    };

    return [columnMemberIdentity, columnMoreActions].filter(Boolean);
  }, [navigateToMemberProfile, copyContactInfo, i18nInstance.language]);

  return columns;
};
