import {
  Body,
  Chip,
  ChipProps,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";
import { EmailStatus } from "@bsport/store-communicate-communication";

import { useTranslation } from "#src/utils/i18n";
import type { MarketingNotificationRecipientsTableRowData } from "#src/utils/types";

type TableColumn =
  GenericTableColumn<MarketingNotificationRecipientsTableRowData>;

/**
 * Hook that returns the columns configuration for the Marketing Notification Recipients table
 */
export const useFormatMarketingNotificationRecipientsTableColumns =
  (): Array<TableColumn> => {
    const { t } = useTranslation("marketingNotificationDetails");
    const columnDateSent: TableColumn = {
      header: t("drawer.performance.allNotifications.table.header.date"),
      id: "column-date-sent",
      keyPath: "date-sent",
      type: "custom",
      align: "start",
      render: (row) => {
        return (
          <div className="flex flex-col gap-2xs">
            <Body htmlVariant="p">{row.dateSent}</Body>
            <Body htmlVariant="p" size="sm" color="weak">
              {row.hourSent}
            </Body>
          </div>
        );
      },
    };

    const columnCommunicationKind: TableColumn = {
      header: "",
      id: "column-communication-kind",
      keyPath: "communication-kind",
      type: "custom",
      align: "start",
      render: (row) => {
        return (
          <div className="flex flex-row gap-xs">
            <Chip
              size="lg"
              type="weak"
              color="default"
              iconLeft={
                row.communicationKind === 0 ? "mail-01" : "notification-message"
              }
            />
          </div>
        );
      },
    };

    const columnRecipientIdentity: TableColumn = {
      header: t("drawer.performance.allNotifications.table.header.recipient"),
      id: "column-recipient-identity",
      keyPath: "recipient-identity",
      type: "custom",
      align: "start",
      render: (row) => {
        const recipientIdentity = row.recipientIdentity || t("noData");
        return (
          <div className="flex flex-col gap-2xs">
            <Body htmlVariant="p">{recipientIdentity}</Body>
            {row.recipientsRelationshipsCount &&
            row.recipientsRelationshipsCount > 0 ? (
              <Tooltip
                placement="bottom-right"
                label={t(
                  "drawer.performance.allNotifications.table.tooltip.relatedMember",
                )}
              >
                <Body htmlVariant="p" size="sm" color="weak">
                  {t(
                    "drawer.performance.allNotifications.table.recipients.forwardedToRelationships",
                    {
                      count: row.recipientsRelationshipsCount,
                    },
                  )}
                </Body>
              </Tooltip>
            ) : null}
          </div>
        );
      },
    };

    const columnStatus: TableColumn = {
      header: t("drawer.performance.allNotifications.table.header.status"),
      id: "column-status",
      keyPath: "status",
      type: "custom",
      align: "start",
      render: (row) => {
        let chipConfig: ChipProps = {
          className: "min-w-[70px]",
          color: "default",
          size: "lg",
          type: "weak",
          label: t(
            "drawer.performance.allNotifications.helper.status.noData.label",
          ),
        };
        if (row.isNotificationRead) {
          chipConfig = {
            ...chipConfig,
            color: "main",
            label: t(
              "drawer.performance.allNotifications.helper.status.opened.label",
            ),
          };
        } else if (row.status === EmailStatus.DELIVERED) {
          chipConfig = {
            ...chipConfig,
            color: "positive",
            label: t(
              "drawer.performance.allNotifications.helper.status.sent.label",
            ),
          };
        } else if (row.status === EmailStatus.DEFERRED) {
          chipConfig = {
            ...chipConfig,
            color: "critical",
            label: t(
              "drawer.performance.allNotifications.helper.status.failed.label",
            ),
          };
        }
        return <Chip {...chipConfig} />;
      },
    };

    return [
      columnDateSent,
      columnCommunicationKind,
      columnRecipientIdentity,
      columnStatus,
    ];
  };
