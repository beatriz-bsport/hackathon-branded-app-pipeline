import { useMemo } from "react";
import { useOutletContext } from "react-router";

import {
  type AutomatedCampaign,
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
} from "@bsport/kaizen-primitive-core";

import type { Smartlist } from "#src/api/types";
import { useAutomatedCampaignsSuspenseQuery } from "#src/api/use-automated-campaigns";
import { AutomationTriggerIcon } from "#src/components/AutomationTriggerIcon/AutomationTriggerIcon";
import {
  DeleteAutomationModal,
  useDeleteAutomationModal,
} from "#src/components/DeleteAutomationModal";
import { StopPropagationWrapper } from "#src/components/StopPropagationWrapper";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

type AutomationPageContext = {
  smartlistId: string;
  smartlist: Smartlist | undefined;
};

type TableRow = AutomatedCampaign & {
  onRowClick?: () => void;
};

const COLUMN_IDS = {
  CREATED_ON: "created-on",
  CHANNEL: "channel",
  CONDITION: "condition",
  ACTIONS: "actions",
};

const INLINE_ACTIONS = {
  EDIT: "edit",
  DELETE: "delete",
};

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

  const { data: campaigns } = useAutomatedCampaignsSuspenseQuery(smartlistId);

  const {
    isOpen: isDeleteAutomationOpen,
    automationId: automationToDeleteId,
    requestDelete,
    cancelDelete,
  } = useDeleteAutomationModal();

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

            return (
              <StopPropagationWrapper>
                <DropdownMenu
                  items={items}
                  onSelectOption={({ setIsPopoverOpened, id }) => {
                    setIsPopoverOpened(false);

                    if (id === INLINE_ACTIONS.DELETE) {
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

      const compactHiddenColumns = [COLUMN_IDS.CREATED_ON];

      return compact
        ? allColumns.filter((col) => !compactHiddenColumns.includes(col.id))
        : allColumns;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language, compact, smartlistId],
  );

  const rows: TableRow[] = useMemo(
    () =>
      campaigns.map((campaign) => ({
        ...campaign,
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
