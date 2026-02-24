import { useMemo } from "react";

import {
  Body,
  Chip,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { COMMUNICATION_KIND_ICON_MAP } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { CampaignSentActionDropdown } from "./CampaignSentActionDropdown";

export type CampaignAnalytics = {
  recipients: number;
  openCount?: number;
  clickCount?: number;
};

export type CampaignSentTableRowData = {
  id: string;
  campaignUuid: string;
  campaignKind: CommunicationKind;
  campaignName: string;
  sentDate: string;
  sentHour: string;
  campaignAnalytics?: CampaignAnalytics;
  link: string;
};

export type CampaignSentTableRowParams = {
  onPreview: (campaignId: string) => void;
};

type TableColumn = GenericTableColumn<CampaignSentTableRowData>;

/**
 * React hook that returns the column configs for the Campaign Sent table.
 */
export const useCampaignSentTableColumns = ({
  onPreview,
}: CampaignSentTableRowParams): Array<TableColumn> => {
  const { t } = useTranslation("campaign");
  const columns = useMemo<Array<TableColumn>>(() => {
    const columnScheduledDate: TableColumn = {
      header: t("table.campaignSent.headers.sentDate"),
      id: "column-scheduled-date",
      keyPath: "scheduled-date",
      type: "custom",
      align: "start",
      render: (row) => (
        <div className="max-w-[100px] flex flex-col gap-2xs">
          <Body size="md" htmlVariant="span">
            {row.sentDate}
          </Body>
          <Body size="md" htmlVariant="p" weight="weak">
            {row.sentHour}
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
      header: t("table.campaignSent.headers.campaignName"),
      id: "column-campaign-name",
      keyPath: "campaign-name",
      type: "custom",
      align: "start",
      render: (row) => (
        <Body
          className="w-[400px] overflow-hidden text-ellipsis"
          htmlVariant="span"
          size="md"
        >
          {row.campaignName}
        </Body>
      ),
    };

    const columnCampaignAnalytics: TableColumn = {
      header: t("table.campaignSent.headers.campaignAnalytics"),
      id: "column-campaign-analytics",
      keyPath: "campaign-analytics",
      type: "custom",
      align: "start",
      render: (row) => (
        <div className="w-[400px] flex flex-row gap-lg">
          {row.campaignAnalytics?.recipients != null ? (
            <div className="flex flex-col gap-2xs">
              <Body htmlVariant="span" size="lg">
                {row.campaignAnalytics.recipients}
              </Body>
              <Body htmlVariant="p" size="md" weight="weaker">
                {t("table.campaignSent.analytics.recipients")}
              </Body>
            </div>
          ) : null}

          {row.campaignKind === CommunicationKind.EMAIL &&
          row.campaignAnalytics?.openCount != null ? (
            <div className="flex flex-col gap-2xs">
              <Body htmlVariant="span" size="lg">
                {row.campaignAnalytics.openCount}
              </Body>
              <Body htmlVariant="p" size="md" weight="weaker">
                {t("table.campaignSent.analytics.openCount")}
              </Body>
            </div>
          ) : null}

          {row.campaignKind === CommunicationKind.EMAIL &&
          row.campaignAnalytics?.clickCount != null ? (
            <div className="flex flex-col gap-2xs">
              <Body htmlVariant="span" size="lg">
                {row.campaignAnalytics.clickCount}
              </Body>
              <Body htmlVariant="p" size="md" weight="weaker">
                {t("table.campaignSent.analytics.clickCount")}
              </Body>
            </div>
          ) : null}
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
        <CampaignSentActionDropdown
          campaignUuid={row.campaignUuid}
          onPreview={onPreview}
        />
      ),
    };

    return [
      columnScheduledDate,
      columnCampaignKind,
      columnCampaignName,
      columnCampaignAnalytics,
      columnMoreActions,
    ].filter(Boolean);
  }, [onPreview]);

  return columns;
};
