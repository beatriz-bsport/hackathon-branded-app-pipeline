import { useMemo } from "react";
import { useOutletContext } from "react-router";

import {
  Body,
  Card,
  Chip,
  ErrorFallback,
  type GenericTableColumn,
  Icon,
  Table,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind, EventKind } from "#src/api/constants";
import type { Smartlist } from "#src/api/types";
import {
  type AutomatedCampaignWithAnalytics,
  useAutomatedCampaignAnalytics,
} from "#src/api/use-automated-campaign-analytics";
import { useTranslation } from "#src/utils/i18n";

type AutomationPageContext = {
  smartlistId: string;
  smartlist: Smartlist | undefined;
};

type TableRow = AutomatedCampaignWithAnalytics & {
  id: number;
};

export const AutomationPageContent = () => {
  const { smartlistId } = useOutletContext<AutomationPageContext>();
  const { t, i18n } = useTranslation("details");

  const campaigns = useAutomatedCampaignAnalytics(smartlistId);

  const columns: GenericTableColumn<TableRow>[] = useMemo(
    () => [
      {
        id: "created-on",
        header: t("automation.messages.columns.createdOn"),
        type: "date",
        keyPath: "date_created",
      },
      {
        id: "channel",
        header: "",
        type: "custom",
        render: (row) => {
          const channelMap: Record<
            number,
            {
              icon: "mail-01" | "message-dots-circle" | "notification-message";
              label: string;
            }
          > = {
            [CommunicationKind.EMAIL]: {
              icon: "mail-01",
              label: t("automation.messages.channels.email"),
            },
            [CommunicationKind.SMS]: {
              icon: "message-dots-circle",
              label: t("automation.messages.channels.sms"),
            },
            [CommunicationKind.PUSH]: {
              icon: "notification-message",
              label: t("automation.messages.channels.push"),
            },
          };

          const channel = channelMap[row.communication_kind];
          if (!channel) return null;

          return (
            <Chip
              type="weak"
              color="default"
              size="lg"
              iconLeft={channel.icon}
              aria-label={channel.label}
            />
          );
        },
      },
      {
        id: "condition",
        header: t("automation.messages.columns.condition"),
        type: "custom",
        render: (row) => {
          const isJoin = row.event_kind === EventKind.JOIN;
          const icon = isJoin ? "log-in-03" : "log-out-01";
          const text = isJoin
            ? t("automation.messages.conditions.onJoin")
            : t("automation.messages.conditions.onLeave");
          const color = isJoin
            ? "text-onsurface-status-positive-weak"
            : "text-onsurface-status-critical-weak";

          return (
            <div className="flex flex-col gap-xs">
              <Body size="md">{row.title ?? ""}</Body>
              <div className="flex items-center gap-xs">
                <Icon icon={icon} size="sm" className={color} />
                <Body size="md" color="weak">
                  {text}
                </Body>
              </div>
            </div>
          );
        },
      },
      {
        id: "recipients",
        header: t("automation.messages.columns.analytics"),
        type: "custom",
        align: "center",
        render: (row) => (
          <div className="flex flex-col items-center">
            <Body size="lg">{row.total_recipients}</Body>
            <Body size="sm" color="weak">
              {t("automation.messages.columns.recipients")}
            </Body>
          </div>
        ),
      },
      {
        id: "opens",
        header: "",
        type: "custom",
        align: "center",
        render: (row) => {
          // Only show for email campaigns
          if (row.communication_kind !== CommunicationKind.EMAIL) {
            return <span />;
          }

          return (
            <div className="flex flex-col items-center">
              <Body size="lg">{row.total_read}</Body>
              <Body size="sm" color="weak">
                {t("automation.messages.columns.opens")}
              </Body>
            </div>
          );
        },
      },
      {
        id: "clicks",
        header: "",
        type: "custom",
        align: "center",
        render: (row) => {
          // Only show for email campaigns
          if (row.communication_kind !== CommunicationKind.EMAIL) {
            return <span />;
          }

          return (
            <div className="flex flex-col items-center">
              <Body size="lg">{row.total_click}</Body>
              <Body size="sm" color="weak">
                {t("automation.messages.columns.clicks")}
              </Body>
            </div>
          );
        },
      },
    ],
    [i18n.language],
  );

  const rows: TableRow[] = useMemo(
    () =>
      campaigns.map((campaign: AutomatedCampaignWithAnalytics) => ({
        ...campaign,
        id: campaign.id,
      })),
    [campaigns],
  );

  return (
    <Card padding="none" className="overflow-hidden">
      <Table
        columns={columns}
        rows={rows}
        emptyStateProps={{
          isEmpty: rows.length === 0,
          emptyConfig: {
            title: t("automation.messages.emptyState"),
          },
        }}
      />
    </Card>
  );
};

type AutomationErrorFallbackProps = {
  onRetry: () => void;
};

export function AutomationErrorFallback({
  onRetry,
}: AutomationErrorFallbackProps) {
  const { t } = useTranslation("details");

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="grid place-items-center">
        <ErrorFallback
          title={t("automation.messages.error.title")}
          description={t("automation.messages.error.description")}
          actionProps={{
            label: t("automation.messages.error.retryLabel"),
            onClick: onRetry,
          }}
        />
      </div>
    </Card>
  );
}
