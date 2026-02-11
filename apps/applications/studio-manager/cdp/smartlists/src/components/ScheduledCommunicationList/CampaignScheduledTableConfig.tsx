import {
  Body,
  Chip,
  type GenericTableColumn,
  IconName,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { type TFunction } from "#src/utils/i18n";

import { CampaignScheduledActionDropdown } from "./CampaignScheduledActionDropdown";

export type CampaignScheduledTableRowData = {
  id: string;
  campaignId: number;
  campaignKind: CommunicationKind;
  campaignName: string;
  scheduledDate: string;
  scheduledHour: string;
};

export type CampaignScheduledTableRowParams = {
  onEdit: (camapignId: number) => void;
  onDelete: (camapignId: number) => void;
};

type TableColumn = GenericTableColumn<CampaignScheduledTableRowData>;

const COMMUNICATION_KIND_ICON_MAP: Record<CommunicationKind, IconName> = {
  [CommunicationKind.EMAIL]: "mail-01",
  [CommunicationKind.SMS]: "message-dots-circle",
  [CommunicationKind.PUSH]: "notification-message",
};

/**
 * Return the colums configs for the Member table
 */
export const getTableColumns = ({
  onEdit,
  onDelete,
  t,
}: CampaignScheduledTableRowParams & {
  t: TFunction;
}): Array<TableColumn> => {
  const columnScheduledDate: TableColumn = {
    header: t("table.campaignScheduled.headers.scheduledDate"),
    id: "column-scheduled-date",
    keyPath: "scheduled-date",
    type: "custom",
    align: "start",
    render: (row) => {
      return (
        <div className="max-w-[100px] flex flex-col gap-2xs">
          <Body size="md" htmlVariant="span">
            {row.scheduledDate}
          </Body>
          <Body size="md" htmlVariant="p" weight="weak">
            {row.scheduledHour}
          </Body>
        </div>
      );
    },
  };

  const columnCampaignKind: TableColumn = {
    header: "",
    id: "column-campaign-kind",
    keyPath: "campaign-kind",
    type: "custom",
    align: "start",
    render: (row) => {
      return (
        <Chip
          size="lg"
          type="weak"
          color="default"
          iconLeft={COMMUNICATION_KIND_ICON_MAP[row.campaignKind]}
        />
      );
    },
  };

  const columnCampaignName: TableColumn = {
    header: t("table.campaignScheduled.headers.campaignName"),
    id: "column-campaign-name",
    keyPath: "campaign-name",
    type: "custom",
    align: "start",
    render: (row) => {
      return (
        <Body className="w-[800px]" htmlVariant="span" size="md">
          {row.campaignName}
        </Body>
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
      return (
        <CampaignScheduledActionDropdown
          onEdit={onEdit}
          onDelete={onDelete}
          campaignId={row.campaignId}
        />
      );
    },
  };

  return [
    columnScheduledDate,
    columnCampaignKind,
    columnCampaignName,
    columnMoreActions,
  ].filter(Boolean);
};
