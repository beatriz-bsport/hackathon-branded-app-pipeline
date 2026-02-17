import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

import {
  Body,
  Button,
  Card,
  Chip,
  DropdownMenu,
  type DropdownMenuItems,
  type GenericTableColumn,
  Icon,
  Table,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind, EventKind } from "#src/api/constants";
import type { Smartlist } from "#src/api/types";
import {
  type AutomatedCampaignWithAnalytics,
  useAutomatedCampaignAnalytics,
} from "#src/api/use-automated-campaign-analytics";
import { DeleteAutomationModal } from "#src/components/DeleteAutomationModal";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

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

export const MessagesSection = (
  { compact }: { compact?: boolean } = { compact: false },
) => {
  const { smartlistId } = useOutletContext<AutomationPageContext>();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation("details");

  const campaigns = useAutomatedCampaignAnalytics(smartlistId);

  const [automationToDelete, setAutomationToDelete] = useState<TableRow | null>(
    null,
  );

  const handleCloseDeleteModal = () => {
    setAutomationToDelete(null);
  };

  const columns: GenericTableColumn<TableRow>[] = useMemo(() => {
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
          const icon = isJoin ? "log-in-03" : "log-out-01";
          const text = isJoin
            ? t("automation.messages.conditions.onJoin")
            : t("automation.messages.conditions.onLeave");
          const color = isJoin
            ? "text-onsurface-status-positive-weak"
            : "text-onsurface-status-critical-weak";

          return (
            <div className="flex flex-col gap-xs">
              <Body size="md" className="whitespace-normal break-words">
                {row.title ?? ""}
              </Body>
              <div className="flex items-center gap-xs">
                <Icon icon={icon} size="sm" className={color} />
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
              id: "edit",
              label: t("automation.messages.actions.edit"),
              iconLeft: "edit-02",
            },
            {
              id: "delete",
              label: t("automation.messages.actions.delete"),
              iconLeft: "trash-01",
            },
          ];

          return (
            <DropdownMenu
              items={items}
              onSelectOption={({ setIsPopoverOpened, id }) => {
                setIsPopoverOpened(false);

                if (id === "delete") {
                  setAutomationToDelete(row);
                } else if (id === "edit") {
                  navigate(`/${smartlistId}/automation/message/${row.id}`);
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

    // we should't add t as dependency, instead we add the language
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, navigate, smartlistId, compact]);

  const rows: TableRow[] = useMemo(
    () =>
      campaigns.map((campaign: AutomatedCampaignWithAnalytics) => ({
        ...campaign,
        id: campaign.id,
      })),
    [campaigns],
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
      {automationToDelete && (
        <DeleteAutomationModal
          isOpen
          onClose={handleCloseDeleteModal}
          smartlistId={smartlistId}
          automation={automationToDelete}
        />
      )}
    </>
  );
};
