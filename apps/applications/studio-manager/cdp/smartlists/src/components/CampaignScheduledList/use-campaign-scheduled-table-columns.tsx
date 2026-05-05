import { useMemo } from "react";

import { CommunicationKind } from "@bsport/api-cdp/automated-campaign";
import {
  Body,
  Chip,
  type GenericTableColumn,
  Tooltip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import {
  COMMUNICATION_CHANNEL_BY_KIND_MAP,
  COMMUNICATION_KIND_ICON_MAP,
} from "#src/utils/constants";
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
  const { t } = useTranslation(["campaign", "details"]);
  const isMobile = !useMatchMedia("md");

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
        <Tooltip
          label={t(
            `automation.messages.channels.${COMMUNICATION_CHANNEL_BY_KIND_MAP[row.campaignKind]}`,
            { ns: "details" },
          )}
        >
          <Chip
            size="lg"
            type="weak"
            color="default"
            iconLeft={COMMUNICATION_KIND_ICON_MAP[row.campaignKind]}
          />
        </Tooltip>
      ),
    };

    const columnCampaignName: TableColumn = {
      header: t("table.campaignScheduled.headers.campaignName"),
      id: "column-campaign-name",
      keyPath: "campaign-name",
      type: "custom",
      align: "start",
      render: (row) => (
        <div className="flex flex-row gap-sm">
          {isMobile ? (
            <Chip
              className="self-center"
              size="lg"
              type="weak"
              color="default"
              iconLeft={COMMUNICATION_KIND_ICON_MAP[row.campaignKind]}
            />
          ) : null}
          <div className="flex flex-col gap-2xs">
            <Tooltip label={row.campaignName} placement="bottom-left">
              <Body
                className={
                  isMobile
                    ? "max-w-[150px] md:max-w-full overflow-hidden text-ellipsis"
                    : "w-[800px] overflow-hidden text-ellipsis"
                }
                htmlVariant="span"
                size="lg"
                weight="weak"
              >
                {row.campaignName}
              </Body>
            </Tooltip>
            {isMobile ? (
              <Body size="md" htmlVariant="p" weight="weak" color="weak">
                {row.scheduledDate}, {row.scheduledHour}
              </Body>
            ) : null}
          </div>
        </div>
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

    if (isMobile) {
      return [columnCampaignName, columnMoreActions];
    }

    return [
      columnScheduledDate,
      columnCampaignKind,
      columnCampaignName,
      columnMoreActions,
    ].filter(Boolean);
  }, [onEdit, onDelete, isMobile, t]);

  return columns;
};
