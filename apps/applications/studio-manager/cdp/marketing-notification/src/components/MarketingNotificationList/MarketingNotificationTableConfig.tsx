import {
  Body,
  Button,
  Chip,
  type GenericTableColumn,
  Popover,
  ToggleButton,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import type { TFunction } from "#src/utils/i18n";
import type {
  MarketingNotificationTableRowData,
  MarketingNotificationTableRowParams,
} from "#src/utils/types";

type TableColumn = GenericTableColumn<MarketingNotificationTableRowData>;

/**
 * Return the colums configs for the Member table
 */
export const getTableColumns = ({
  openPreview,
  editNotification,
  deleteNotification,
  toggleMarketingNotification,
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
          // @ts-expect-error: dynamic keys badly supported
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
        <div className="flex flex-col gap-xs max-w-[500px]">
          <Tooltip placement="bottom" label={row.triggerType}>
            <Body
              className="overflow-hidden text-ellipsis"
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
      if (row.isEmailNotificationBroken) {
        return (
          <Body size="md" weight="strong" htmlVariant="p" color="critical">
            {t("table.notificationState.broken")}
          </Body>
        );
      }
      return (
        <ToggleButton
          id={`marketing-notification-checkbox-action-${row.id}`}
          size="md"
          checked={row.isNotificationActive}
          disabled={
            !permissions.isUserMarketingNotificationManager ||
            !row.isAbleToUpdateNotification
          }
          onChange={({ event, checked }) => {
            event.stopPropagation();
            toggleMarketingNotification({
              notificationId: row.id,
              checked,
            });
          }}
          checkedConfig={{
            label: t("table.notificationState.enabled"),
            icon: "check",
          }}
          uncheckedConfig={{
            label: t("table.notificationState.disabled"),
          }}
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
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <Button
                color="default"
                intent="flat"
                size="md"
                iconLeft="dots-vertical"
                onClick={() => {
                  setIsPopoverOpened((opened) => !opened);
                }}
              />
            )}
          </Popover.Anchor>
          <Popover.Content placement="bottom-right">
            {() => (
              <div className="flex flex-col gap-sm">
                <Button
                  intent="flat"
                  color="default"
                  size="md"
                  iconLeft="eye"
                  label={t("table.actions.preview")}
                  onClick={() => {
                    openPreview(row.id);
                  }}
                />
                <Button
                  intent="flat"
                  color="default"
                  size="md"
                  iconLeft="edit-02"
                  label={t("table.actions.edit")}
                  onClick={() => {
                    editNotification(row.id);
                  }}
                />
                <Button
                  intent="flat"
                  color="default"
                  size="md"
                  iconLeft="trash-01"
                  label={t("table.actions.delete")}
                  onClick={() => {
                    deleteNotification(row.id);
                  }}
                />
              </div>
            )}
          </Popover.Content>
        </Popover>
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
