import { useMemo } from "react";

import {
  Body,
  Chip,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { COMMUNICATION_KIND_ICON_MAP } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

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
  onEdit: (campaignId: number) => void;
  onDelete: (campaignId: number) => void;
};

type TableColumn = GenericTableColumn<CampaignScheduledTableRowData>;

/**
 * React hook that returns the column configs for the Campaign Scheduled table.
 */
export const useCampaignScheduledTableColumns = ({
  onEdit,
  onDelete,
}: CampaignScheduledTableRowParams): Array<TableColumn> => {
  const { t } = useTranslation("campaign");

  const columns = useMemo<Array<TableColumn>>(() => {
    const columnScheduledDate: TableColumn = {
      header: t("table.campaignScheduled.headers.scheduledDate"),
      id: "column-scheduled-date",
      keyPath: "scheduled-date",
      type: "custom",
      align: "start",
      render: (row) => (
        <div className="max-w-[100px] flex flex-col gap-2xs">
          <Body size="md" htmlVariant="span">
            {row.scheduledDate}
          </Body>
          <Body size="md" htmlVariant="p" weight="weak">
            {row.scheduledHour}
          </Body>
        </div>
      ),
    };

    const columnCampaignKind: TableColumn = {
      header: "",
      id: "column-campaign-kind",
      keyPath: "campaign-kind",
      type: "custom",
      align: "start",
      render: (row) => (
        <Chip
          size="lg"
          type="weak"
          color="default"
          iconLeft={COMMUNICATION_KIND_ICON_MAP[row.campaignKind]}
        />
      ),
    };

    const columnCampaignName: TableColumn = {
      header: t("table.campaignScheduled.headers.campaignName"),
      id: "column-campaign-name",
      keyPath: "campaign-name",
      type: "custom",
      align: "start",
      render: (row) => (
        <Body
          className="w-[800px] overflow-hidden text-ellipsis"
          htmlVariant="span"
          size="md"
        >
          {row.campaignName}
        </Body>
      ),
    };

    const columnMoreActions: TableColumn = {
      header: "",
      id: "column-more-action",
      keyPath: "",
      type: "custom",
      align: "end",
      render: (row) => (
        <CampaignScheduledActionDropdown
          onEdit={onEdit}
          onDelete={onDelete}
          campaignId={row.campaignId}
        />
      ),
    };

    return [
      columnScheduledDate,
      columnCampaignKind,
      columnCampaignName,
      columnMoreActions,
    ].filter(Boolean);
  }, [onEdit, onDelete]);

  return columns;
};
