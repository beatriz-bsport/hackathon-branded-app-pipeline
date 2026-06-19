import { useMemo } from "react";
import { useOutletContext } from "react-router";

import {
  CommunicationKind,
  EventKind,
} from "@bsport/api-cdp/automated-campaign";
import {
  Body,
  Button,
  Card,
  Chip,
  DropdownMenu,
  type DropdownMenuItems,
  type GenericTableColumn,
  Table,
  Tooltip,
  toast,
} from "@bsport/kaizen-primitive-core";

import type { Smartlist } from "#src/api/types";
import {
  type AutomatedCampaignWithAnalytics,
  useAutomatedCampaignAnalytics,
} from "#src/api/use-automated-campaign-analytics";
import { useExportCampaign } from "#src/api/use-export-campaign";
import { AutomationTriggerIcon } from "#src/components/AutomationTriggerIcon/AutomationTriggerIcon";
import {
  DeleteAutomationModal,
  useDeleteAutomationModal,
} from "#src/components/DeleteAutomationModal";
import { StopPropagationWrapper } from "#src/components/StopPropagationWrapper";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";
import { downloadFileFromUrl } from "#src/utils/utils";

type AutomationPageContext = {
  smartlistId: string;
  smartlist: Smartlist | undefined;
};

type TableRow = AutomatedCampaignWithAnalytics & {
  id: number;
};

const COLUMN_IDS = {
  CREATED_ON: "created-on",
  CHANNEL: "channel",
  CONDITION: "condition",
  OPEN: "open",
  CLICKS: "clicks",
  RECIPIENTS: "recipients",
  ACTIONS: "actions",
};

const INLINE_ACTIONS = {
  EXPORT: "export",
  EDIT: "edit",
  DELETE: "delete",
};

const TOAST_TIMEOUT = 3000;

export const MessagesSection = (
  { compact }: { compact?: boolean } = { compact: false },
) => {
  const { smartlistId } = useOutletContext<AutomationPageContext>();
  const {
    navigateToSmartlistEmailAutomationEdit,
    navigateToSmartlistEmailAutomationMessage,
    navigateToSmartlistSmsAutomationEdit,
    navigateToSmartlistSmsAutomationMessage,
    navigateToSmartlistPushAutomationEdit,
    navigateToSmartlistPushAutomationMessage,
  } = useSmartlistNavigation();

  const { t, i18n } = useTranslation("details");

  const campaigns = useAutomatedCampaignAnalytics(smartlistId);

  const {
    isOpen: isDeleteAutomationOpen,
    automationId: automationToDeleteId,
    requestDelete,
    cancelDelete,
  } = useDeleteAutomationModal();

  const exportCampaign = useExportCampaign({
    onSuccess: (cdnUrl) => {
      downloadFileFromUrl(cdnUrl, {
        onSuccess: () => {
          toast({
            status: "positive",
            icon: "download-01",
            description: t("automation.messages.toasts.success.exported"),
            buttonIcon: "x-close",
          });
        },
        onError: () => {
          toast({
            status: "critical",
            icon: "alert-circle",
            description: t("automation.messages.toasts.error.exportFailed"),
            buttonIcon: "x-close",
          });
        },
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.messages.toasts.error.exportFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const columns: GenericTableColumn<TableRow>[] = useMemo(
    () => {
      const allColumns: GenericTableColumn<TableRow>[] = [
        {
          id: COLUMN_IDS.CREATED_ON,
          header: t("automation.messages.columns.createdOn"),
          type: "date",
          keyPath: "date_created",
        },
        {
          id: COLUMN_IDS.CHANNEL,
          header: compact ? t("automation.messages.columns.condition") : "",
          type: "custom",
          align: compact ? "center" : undefined,
          render: (row) => {
            const channelMap: Record<
              number,
              {
                icon:
                  | "mail-01"
                  | "message-dots-circle"
                  | "notification-message";
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

            if (!channel) {
              return null;
            }

            return (
              <Tooltip label={channel.label}>
                <Chip
                  type="weak"
                  color="default"
                  size="lg"
                  iconLeft={channel.icon}
                  aria-label={channel.label}
                />
              </Tooltip>
            );
          },
        },
        {
          id: COLUMN_IDS.CONDITION,
          header: compact ? "" : t("automation.messages.columns.condition"),
          type: "custom",
          render: (row) => {
            const isJoin = row.event_kind === EventKind.JOIN;
            const text = isJoin
              ? t("automation.messages.conditions.onJoin")
              : t("automation.messages.conditions.onLeave");

            const title = row.title || row.text;
            return (
              <div className="flex flex-col gap-xs">
                <Body size="md" className="whitespace-normal break-words">
                  {title}
                </Body>
                <div className="flex items-center gap-xs">
                  <AutomationTriggerIcon trigger={row.event_kind} size="sm" />
                  <Body
                    size="md"
                    color="weak"
                    className="whitespace-normal break-words"
                  >
                    {text}
                  </Body>
                </div>
              </div>
            );
          },
        },
        {
          id: COLUMN_IDS.RECIPIENTS,
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
          id: COLUMN_IDS.OPEN,
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
          id: COLUMN_IDS.CLICKS,
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
        {
          id: COLUMN_IDS.ACTIONS,
          type: "custom",
          align: "end",
          header: "",
          render: (row) => {
            const items: DropdownMenuItems = [
              {
                id: INLINE_ACTIONS.EDIT,
                label: t("automation.messages.actions.edit"),
                iconLeft: "edit-02",
              },
              {
                id: INLINE_ACTIONS.DELETE,
                label: t("automation.messages.actions.delete"),
                iconLeft: "trash-01",
              },
            ];

            if (
              row.communication_kind === CommunicationKind.EMAIL &&
              row.campaign_sent_uuid !== null
            ) {
              items.push({
                id: INLINE_ACTIONS.EXPORT,
                label: t("automation.messages.actions.export"),
                iconLeft: "download-01",
              });
            }

            return (
              <StopPropagationWrapper>
                <DropdownMenu
                  items={items}
                  onSelectOption={({ setIsPopoverOpened, id }) => {
                    setIsPopoverOpened(false);

                    if (id === INLINE_ACTIONS.EXPORT) {
                      invariant(
                        row.campaign_sent_uuid !== null,
                        "Export only available for rows with campaign_sent_uuid",
                      );
                      toast({
                        status: "default",
                        icon: "send-01",
                        description: t(
                          "automation.messages.toasts.info.exportPending",
                        ),
                        duration: TOAST_TIMEOUT,
                        buttonIcon: "x-close",
                      });
                      exportCampaign.mutate(row.campaign_sent_uuid);
                    } else if (id === INLINE_ACTIONS.DELETE) {
                      requestDelete(row.id);
                    } else if (id === INLINE_ACTIONS.EDIT) {
                      if (row.communication_kind === CommunicationKind.EMAIL) {
                        navigateToSmartlistEmailAutomationEdit(
                          smartlistId,
                          String(row.id),
                        );
                      } else if (
                        row.communication_kind === CommunicationKind.PUSH
                      ) {
                        navigateToSmartlistPushAutomationEdit(
                          smartlistId,
                          String(row.id),
                        );
                      } else if (
                        row.communication_kind === CommunicationKind.SMS
                      ) {
                        navigateToSmartlistSmsAutomationEdit(
                          smartlistId,
                          String(row.id),
                        );
                      }
                    } else {
                      invariant(false, `Unhandled action id: ${id}`);
                    }
                  }}
                  placement="bottom-right"
                  target={({ setIsPopoverOpened }) => (
                    <Button
                      kind="icon-button"
                      intent="flat"
                      icon="dots-vertical"
                      onClick={() => setIsPopoverOpened(true)}
                      color="default"
                      label="open-actions-menu"
                      size="md"
                    />
                  )}
                />
              </StopPropagationWrapper>
            );
          },
        },
      ];

      const compactHiddenColumns = [
        COLUMN_IDS.CREATED_ON,
        COLUMN_IDS.RECIPIENTS,
        COLUMN_IDS.OPEN,
        COLUMN_IDS.CLICKS,
      ];

      return compact
        ? allColumns.filter((col) => !compactHiddenColumns.includes(col.id))
        : allColumns;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language, compact, smartlistId],
  );

  const rows: TableRow[] = useMemo(
    () =>
      campaigns.map((campaign: AutomatedCampaignWithAnalytics) => ({
        ...campaign,
        id: campaign.id,
        onRowClick:
          campaign.communication_kind === CommunicationKind.EMAIL
            ? () =>
                navigateToSmartlistEmailAutomationMessage(
                  smartlistId,
                  campaign.id,
                )
            : campaign.communication_kind === CommunicationKind.PUSH
              ? () =>
                  navigateToSmartlistPushAutomationMessage(
                    smartlistId,
                    campaign.id,
                  )
              : campaign.communication_kind === CommunicationKind.SMS
                ? () =>
                    navigateToSmartlistSmsAutomationMessage(
                      smartlistId,
                      campaign.id,
                    )
                : undefined,
      })),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [campaigns, smartlistId],
  );

  return (
    <>
      <Card padding="none" className="overflow-hidden">
        <Table
          columns={columns}
          rows={rows}
          rowHeight="lg"
          emptyStateProps={{
            isEmpty: rows.length === 0,
            emptyConfig: {
              title: t("automation.messages.emptyState"),
            },
          }}
        />
      </Card>
      <DeleteAutomationModal
        isOpen={isDeleteAutomationOpen}
        onClose={cancelDelete}
        smartlistId={smartlistId}
        automationId={automationToDeleteId}
      />
    </>
  );
};
