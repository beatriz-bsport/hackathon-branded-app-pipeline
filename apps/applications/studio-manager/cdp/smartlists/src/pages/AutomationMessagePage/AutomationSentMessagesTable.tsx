import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useId, useMemo } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Card,
  type GenericTableColumn,
  Table,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import type { PaginatedResponse } from "@bsport/store-base";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { campaignSentListQueryOptions } from "#src/api/api";
import type { CampaignSent } from "#src/api/types";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

type AutomationSentMessagesTableProps = {
  smartlistId: string;
  messageId: string;
};

type AutomationSentMessageRow = {
  id: string;
  sentDate: string;
  sentHour: string;
  totalRecipients: number;
  totalRead: number;
  totalClick: number;
  onRowClick: () => void;
};

export function AutomationSentMessagesTable({
  smartlistId,
  messageId,
}: AutomationSentMessagesTableProps) {
  const { t } = useTranslation();

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({
      defaultValues: {
        page: DEFAULT_PAGE,
        page_size: DEFAULT_PAGE_SIZE,
      },
    });

  const onPageSettingsChange = (page: number, pageSize: number) => {
    if (pageSize !== currentPageSize) {
      setPageSettings(DEFAULT_PAGE, pageSize);
    } else {
      setPageSettings(page, pageSize);
    }
  };

  const { count, rows, columns } = useAutomationSentMessagesTableData({
    smartlistId,
    messageId,
    currentPage,
    currentPageSize,
  });

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h2" weight="strong">
        {t("automation.messagePage.sentMessages.title", { ns: "details" })}
      </Title>
      <Card padding="none" className="overflow-hidden">
        <Table
          columns={columns}
          rows={rows}
          emptyStateProps={{
            isEmpty: count === 0,
            emptyConfig: {
              title: t("automation.messagePage.sentMessages.emptyTitle", {
                ns: "details",
              }),
              subtitle: t(
                "automation.messagePage.sentMessages.emptyDescription",
                {
                  ns: "details",
                },
              ),
            },
          }}
          paginationProps={{
            currentPage,
            rowsPerPage: currentPageSize,
            totalItems: count,
            showRowsPerPageSelector: true,
            onPageSettingsChange,
          }}
        />
      </Card>
    </div>
  );
}

type AutomationSentMessagesTableQueryData = {
  count: number;
  rows: AutomationSentMessageRow[];
};

function useAutomationSentMessagesTableData({
  smartlistId,
  messageId,
  currentPage,
  currentPageSize,
}: {
  smartlistId: string;
  messageId: string;
  currentPage: number;
  currentPageSize: number;
}) {
  const { navigateToSmartlistCampaignSentDetails } = useSmartlistNavigation();
  const { t, i18n } = useTranslation();

  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const rowId = useId();

  const automatedCampaignId = Number(messageId);
  invariant(
    Number.isInteger(automatedCampaignId),
    "Expected messageId param to be a valid number",
  );

  const selectTableData = useCallback(
    (
      data: PaginatedResponse<CampaignSent>,
    ): AutomationSentMessagesTableQueryData => ({
      count: data.count,
      rows: data.results.map((campaignSent) => ({
        id: `${rowId}-${campaignSent.uuid}`,
        sentDate: formatDateTime(
          campaignSent.date_created,
          DATETIME_FORMATS.YEAR_MONTH_DAY,
          {
            locale: i18n.language,
            timeZone: companyTimezone,
          },
        ),
        sentHour: formatDateTime(
          campaignSent.date_created,
          DATETIME_FORMATS.TIME_SIMPLE,
          {
            locale: i18n.language,
            timeZone: companyTimezone,
          },
        ),
        totalRecipients: campaignSent.total_recipients,
        totalRead: campaignSent.total_read,
        totalClick: campaignSent.total_click,
        onRowClick: () => {
          navigateToSmartlistCampaignSentDetails(
            smartlistId,
            campaignSent.uuid,
          );
        },
      })),
    }),
    [
      companyTimezone,
      i18n.language,
      navigateToSmartlistCampaignSentDetails,
      smartlistId,
      rowId,
    ],
  );

  const {
    data: { count, rows },
  } = useSuspenseQuery({
    ...campaignSentListQueryOptions({
      smartlist: Number(smartlistId),
      page: currentPage,
      page_size: currentPageSize,
      automated_campaign_id: automatedCampaignId,
      no_automated_campaign: undefined,
      only_automated_campaign: true,
      without_member_info: true,
    }),
    select: selectTableData,
  });

  const columns = useMemo<GenericTableColumn<AutomationSentMessageRow>[]>(
    () => [
      {
        id: "sent-on",
        header: t("campaignDetails.metadataBanner.headers.sentDate", {
          ns: "campaign",
        }),
        keyPath: "sentDate",
        type: "custom",
        render: (row) => (
          <div className="flex flex-col gap-2xs">
            <Body size="md">{row.sentDate}</Body>
            <Body size="sm" color="weak">
              {row.sentHour}
            </Body>
          </div>
        ),
      },
      {
        id: "analytics-recipients",
        header: t("automation.messages.columns.analytics", { ns: "details" }),
        keyPath: "totalRecipients",
        type: "custom",
        align: "center",
        render: (row) => (
          <AnalyticsCell
            value={row.totalRecipients}
            caption={t("automation.messages.columns.recipients", {
              ns: "details",
            })}
          />
        ),
      },
      {
        id: "analytics-opens",
        header: "",
        keyPath: "totalRead",
        type: "custom",
        align: "center",
        render: (row) => (
          <AnalyticsCell
            value={row.totalRead}
            caption={t("automation.messages.columns.opens", {
              ns: "details",
            })}
          />
        ),
      },
      {
        id: "analytics-clicks",
        header: "",
        keyPath: "totalClick",
        type: "custom",
        align: "center",
        render: (row) => (
          <AnalyticsCell
            value={row.totalClick}
            caption={t("automation.messages.columns.clicks", {
              ns: "details",
            })}
          />
        ),
      },
    ],
    [t],
  );

  return {
    count,
    rows,
    columns,
  };
}

function AnalyticsCell({
  value,
  caption,
}: {
  value: string | number;
  caption: string;
}) {
  return (
    <div className="flex min-w-element-2xl flex-col items-center gap-2xs">
      <Body size="lg">{value}</Body>
      <Body size="sm" color="weak">
        {caption}
      </Body>
    </div>
  );
}
