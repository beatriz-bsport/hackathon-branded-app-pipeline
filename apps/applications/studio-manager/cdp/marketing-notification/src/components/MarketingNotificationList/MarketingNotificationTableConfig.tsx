import {
  Body,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { NotificationToggle } from "#src/components/Common/NotificationToggle";
import { type TFunction } from "#src/utils/i18n";
import type {
  MarketingNotificationTableRowData,
  MarketingNotificationTableRowParams,
} from "#src/utils/types";

import { NotificationActionsMenu } from "../Common/NotificationActionsMenu";

type TableColumn = GenericTableColumn<MarketingNotificationTableRowData>;

/**
 * Return the colums configs for the Member table
 */
export const getTableColumns = ({
  openPreview,
  editNotification,
  deleteNotification,
  t,
  permissions,
}: MarketingNotificationTableRowParams & {
  t: TFunction;
}): Array<TableColumn> => {
  const columnNotificationType: TableColumn = {
    header: t("table.headers.notificationType"),
    id: "column-notification-type",
    keyPath: "notification-type",
    type: "custom",
    align: "start",
    render: (row) => {
      return (
        <Chip
          size="lg"
          type="weak"
          color="default"
          label={t(`table.notificationType.${row.notificationType}`)}
        />
      );
    },
  };

  const columnTriggerCondition: TableColumn = {
    header: t("table.headers.triggerCondition"),
    id: "column-trigger-condition",
    keyPath: "trigger-condition",
    type: "custom",
    align: "start",
    render: (row) => {
      return (
        <div className="flex flex-col gap-xs">
          <Tooltip placement="bottom" label={row.triggerType}>
            <Body
              className="max-w-[500px] overflow-hidden text-ellipsis"
              htmlVariant="p"
              size="md"
              color="default"
              weight="strong"
            >
              {row.triggerType}
            </Body>
          </Tooltip>
          <Body
            className="overflow-hidden text-ellipsis"
            htmlVariant="p"
            size="sm"
            color="default"
            weight="weak"
          >
            {row.triggerDate}
          </Body>
        </div>
      );
    },
  };

  const columnNotificationChannel: TableColumn = {
    header: t("table.headers.communicationChannel"),
    id: "column-notification-channel",
    keyPath: "channel",
    type: "custom",
    align: "center",
    render: (row) => {
      const getEmailChip = () => {
        if (row.isEmailNotificationBroken) {
          return (
            <Tooltip placement="bottom" label={t("table.brokenEmailTooltip")}>
              <Chip
                size="lg"
                type="weak"
                color="critical"
                iconLeft="alert-triangle"
              />
            </Tooltip>
          );
        }
        if (row.isEmailNotificationSet) {
          return (
            <Chip size="lg" type="weak" color="default" iconLeft="mail-01" />
          );
        }
        return null;
      };

      const emailChip = getEmailChip();
      const pushChip = row.isPushNotificationSet ? (
        <Chip
          size="lg"
          type="weak"
          color="default"
          iconLeft="notification-message"
        />
      ) : null;

      return (
        <div className="flex flex-row gap-xs">
          {emailChip}
          {pushChip}
        </div>
      );
    },
  };

  const columnToggleNotification: TableColumn = {
    header: "",
    id: "column-email-checkbox",
    keyPath: "email_notification_checked",
    type: "custom",
    align: "center",
    render: (row) => {
      return (
        <NotificationToggle
          isActive={row.isNotificationActive}
          disabled={
            !permissions.isUserMarketingNotificationManager ||
            !row.isAbleToUpdateNotification
          }
          notificationId={row.id}
          isEmailNotificationBroken={row.isEmailNotificationBroken}
        />
      );
    },
  };

  const columnMoreActions: TableColumn = {
    header: "",
    id: "column-open-preview-action",
    keyPath: "",
    type: "custom",
    align: "end",
    render: (row) => {
      return (
        <NotificationActionsMenu
          onPreview={openPreview}
          onEdit={editNotification}
          onDelete={deleteNotification}
          notificationId={row.id}
        />
      );
    },
  };

  return [
    columnNotificationType,
    columnTriggerCondition,
    columnNotificationChannel,
    columnToggleNotification,
    ...(permissions.isUserMarketingNotificationManager
      ? [columnMoreActions]
      : []),
  ].filter(Boolean);
};
