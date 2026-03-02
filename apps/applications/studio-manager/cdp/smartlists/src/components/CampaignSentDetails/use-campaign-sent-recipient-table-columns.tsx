import { useMemo } from "react";

import {
  Avatar,
  Body,
  Chip,
  type ChipProps,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import {
  CommunicationKind,
  CommunicationRecipientStatus,
} from "#src/api/constants";
import { useTranslation } from "#src/utils/i18n";

import { CampaignSentRecipientActionDropdown } from "./CampaignSentRecipientActionDropdown";

export type CampaignSentRecipientTableRowData = {
  id: string;
  memberId: number;
  campaignKind: CommunicationKind;
  recipientPhoneNumber: string;
  recipientEmail: string;
  recipientName: string;
  lastOpenedDate: string;
  lastOpenedHour: string;
  status: CommunicationRecipientStatus;
  openCount: number;
  clickCount: number;
  link: string;
};

export type CampaignSentTableRowParams = {
  navigateToMemberProfile: (memberId: number) => void;
  copyContactInfo: (contactInfo: string) => void;
};

type TableColumn = GenericTableColumn<CampaignSentRecipientTableRowData>;

/**
 * React hook that returns the column configs for the Campaign Sent Recipients table.
 */
export const useCampaignSentTableColumns = ({
  navigateToMemberProfile,
  copyContactInfo,
}: CampaignSentTableRowParams): Array<TableColumn> => {
  const { t } = useTranslation("campaign");
  const columns = useMemo<Array<TableColumn>>(() => {
    const columnMemberIdentity: TableColumn = {
      header: t("table.campaignRecipient.headers.memberIdentity"),
      id: "column-member-identity",
      type: "custom",
      align: "start",
      render: (row) => (
        <div className="flex flex-row gap-xs items-center">
          {/* TODO: Add avatar - when the discussion is resolved : https://bsport.slack.com/archives/C092DRALBL1/p1771415975643399 */}
          <Avatar shape="round" size="md" initials="A" />
          <div className="flex flex-col gap-2xs">
            <Body size="md" htmlVariant="span">
              {row.recipientName}
            </Body>
            <Body size="md" htmlVariant="p" weight="weak">
              {row.campaignKind === CommunicationKind.EMAIL
                ? row.recipientEmail
                : row.recipientPhoneNumber}
            </Body>
          </div>
        </div>
      ),
    };

    const columnLastOpenedDate: TableColumn = {
      header: t("table.campaignRecipient.headers.lastOpened"),
      id: "column-last-opened-date",
      type: "custom",
      align: "start",
      render: (row) => (
        <div className="max-w-[100px] flex flex-col gap-2xs">
          <Body size="md" htmlVariant="span">
            {row.lastOpenedDate}
          </Body>
          <Body size="md" htmlVariant="p" weight="weak">
            {row.lastOpenedHour}
          </Body>
        </div>
      ),
    };

    const columnMemberClicks: TableColumn = {
      header: t("table.campaignRecipient.headers.clickCount"),
      id: "column-member-clicks",
      keyPath: "clickCount",
      type: "number",
      align: "start",
    };

    const columnMemberOpens: TableColumn = {
      header: t("table.campaignRecipient.headers.openCount"),
      id: "column-member-opens",
      keyPath: "openCount",
      type: "number",
      align: "start",
    };

    const columnStatus: TableColumn = {
      header: t("table.campaignRecipient.headers.status"),
      id: "column-status",
      type: "custom",
      align: "start",
      render: (row) => {
        const recipientStatusChips = {
          [CommunicationRecipientStatus.BOUNCED]: {
            label: t("recipientStatus.bounced"),
            color: "critical",
          },
          [CommunicationRecipientStatus.UNKNOWN]: {
            label: t("recipientStatus.unknown"),
            color: "default",
          },
          [CommunicationRecipientStatus.DEFERRED]: {
            label: t("recipientStatus.deferred"),
            color: "critical",
          },
          [CommunicationRecipientStatus.DROPPED]: {
            label: t("recipientStatus.dropped"),
            color: "critical",
          },
          [CommunicationRecipientStatus.PENDING]: {
            label: t("recipientStatus.pending"),
            color: "info",
          },
          [CommunicationRecipientStatus.DELIVERED]: {
            label: t("recipientStatus.delivered"),
            color: "positive",
          },
          [CommunicationRecipientStatus.PROCESSED]: {
            label: t("recipientStatus.processed"),
            color: "info",
          },
        };

        const recipientStatusChip = recipientStatusChips[row.status] ?? {
          label: t("recipientStatus.unknown"),
          color: "default",
        };

        return (
          <Chip
            size="lg"
            type="weak"
            color={recipientStatusChip.color as ChipProps["color"]}
            label={recipientStatusChip.label}
          />
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
          <CampaignSentRecipientActionDropdown
            memberId={row.memberId}
            contactInfo={contactInfoToCopy[row.campaignKind]}
            campaignKind={row.campaignKind}
            navigateToMemberProfile={navigateToMemberProfile}
            copyContactInfo={copyContactInfo}
          />
        );
      },
    };

    return [
      columnMemberIdentity,
      columnLastOpenedDate,
      columnMemberClicks,
      columnMemberOpens,
      columnStatus,
      columnMoreActions,
    ].filter(Boolean);
  }, [navigateToMemberProfile, copyContactInfo, t]);

  return columns;
};
