import {
  Button,
  type GenericTableColumn,
  ToggleButton,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import type { TFunction } from "#src/utils/i18n";
import type {
  NotificationRuleEventTableRowData,
  TableRowData,
} from "#src/utils/types";

type TableColumn = GenericTableColumn<TableRowData>;

/**
 * Return the colums configs for the Member table
 */
export const getTableColumns = ({
  openPreview,
  checkCommunicationMethodPreferences,
  t,
  permissions,
}: NotificationRuleEventTableRowData & {
  t: TFunction;
}): Array<TableColumn> => {
  const columnName: TableColumn = {
    header: t("notificationRuleEventDetails.table.headers.name"),
    id: "column-name",
    keyPath: "name",
    type: "string",
    align: "start",
  };

  const columnEmailCheckbox: TableColumn = {
    header: t("notificationRuleEventDetails.table.headers.email"),
    id: "column-email-checkbox",
    keyPath: "email_notification_checked",
    type: "custom",
    align: "center",
    render: (row) => {
      const tooltipLabel = t(
        "notificationRuleEventDetails.table.tooltip.franchiseOwned",
      );
      const ToggleButtonComponent = (
        <ToggleButton
          key={`email-checkbox-action-${row.email_notification_checked ? "checked" : "unchecked"}`}
          id={`email-checkbox-action-${row.id}`}
          size="md"
          checked={row.email_notification_checked}
          disabled={row.email_notification_disabled}
          onChange={({ event, checked }) => {
            event?.stopPropagation();
            checkCommunicationMethodPreferences({
              notificationRuleEventId: row.id,
              communicationMethod: "email_notification",
              checked,
            });
          }}
          checkedConfig={{
            label: t(
              "notificationRuleEventDetails.table.notificationsToggle.activated",
            ),
            icon: "check",
          }}
          uncheckedConfig={{
            label: t(
              "notificationRuleEventDetails.table.notificationsToggle.deactivated",
            ),
          }}
        />
      );
      if (row.is_franchise_owned) {
        return (
          <Tooltip placement="bottom" label={tooltipLabel}>
            {ToggleButtonComponent}
          </Tooltip>
        );
      }
      return <div>{ToggleButtonComponent}</div>;
    },
  };

  const columnPushNotificationCheckbox: TableColumn = {
    header: t("notificationRuleEventDetails.table.headers.pushNotification"),
    id: "column-push-notification-checkbox",
    keyPath: "push_notification_checked",
    type: "custom",
    align: "center",
    render: (row) => {
      const tooltipLabel = t(
        "notificationRuleEventDetails.table.tooltip.setPushNotificationBeforeEnabling",
      );
      const ToggleButtonComponent = (
        <ToggleButton
          key={`push-notification-checkbox-action-${row.push_notification_checked ? "checked" : "unchecked"}`}
          id={`push-notification-checkbox-action-${row.id}`}
          size="md"
          checked={row.push_notification_checked}
          disabled={
            row.push_notification_disabled || !row.is_push_notification_set
          }
          onChange={({ event, checked }) => {
            event?.stopPropagation();
            checkCommunicationMethodPreferences({
              notificationRuleEventId: row.id,
              communicationMethod: "push_notification",
              checked,
            });
          }}
          checkedConfig={{
            label: t(
              "notificationRuleEventDetails.table.notificationsToggle.activated",
            ),
            icon: "check",
          }}
          uncheckedConfig={{
            label: t(
              "notificationRuleEventDetails.table.notificationsToggle.deactivated",
            ),
          }}
        />
      );
      if (!row.push_notification_disabled && !row.is_push_notification_set) {
        return (
          <Tooltip placement="bottom" label={tooltipLabel}>
            {ToggleButtonComponent}
          </Tooltip>
        );
      }
      return <div>{ToggleButtonComponent}</div>;
    },
  };

  const columnOpenPreviewAction: TableColumn = {
    header: "",
    id: "column-open-preview-action",
    keyPath: "",
    type: "custom",
    align: "center",
    render: (row) => {
      const tooltipLabel = t(
        "notificationRuleEventDetails.table.tooltip.franchiseOwned",
      );

      const ButtonComponent = (
        <Button
          color="main"
          intent="default"
          size="md"
          iconRight="edit-02"
          onClick={() => {
            openPreview(row.id);
          }}
        />
      );

      if (row.is_franchise_owned) {
        return (
          <Tooltip placement="bottom-right" label={tooltipLabel}>
            {ButtonComponent}
          </Tooltip>
        );
      }

      return <div>{ButtonComponent}</div>;
    },
  };

  return [
    columnName,
    columnEmailCheckbox,
    // TODO : We have to check if push notifications are set before adding the column
    permissions.isPushNotificationEnabled && columnPushNotificationCheckbox,
    columnOpenPreviewAction,
  ].filter((item) => !!item);
};
