import {
  Button,
  Checkbox,
  type GenericTableColumn,
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
      const CheckboxComponent = (
        <Checkbox
          id={`email-checkbox-action-${row.id}`}
          value={row.email_notification_checked ? "checked" : "unchecked"}
          disabled={row.email_notification_disabled}
          onChange={(checked: boolean) => {
            checkCommunicationMethodPreferences({
              notificationRuleEventId: row.id,
              communicationMethod: "email_notification",
              checked,
            });
          }}
        />
      );
      if (row.is_franchise_owned) {
        return (
          <Tooltip placement="bottom" label={tooltipLabel}>
            {CheckboxComponent}
          </Tooltip>
        );
      }
      return <div>{CheckboxComponent}</div>;
    },
  };

  const columnPushNotificationCheckbox: TableColumn = {
    header: t("notificationRuleEventDetails.table.headers.pushNotification"),
    id: "column-push-notification-checkbox",
    keyPath: "push_notification_checked",
    type: "custom",
    align: "center",
    render: (row) => (
      <Checkbox
        id={`push-notification-checkbox-action-${row.id}`}
        value={row.push_notification_checked ? "checked" : "unchecked"}
        disabled={row.push_notification_disabled}
        onChange={(checked: boolean) => {
          checkCommunicationMethodPreferences({
            notificationRuleEventId: row.id,
            communicationMethod: "push_notification",
            checked,
          });
        }}
      />
    ),
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
          label={t("notificationRuleEventDetails.table.actions.preview")}
          color="main"
          intent="default"
          size="md"
          disabled={row.is_franchise_owned}
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
    permissions.pushNotification && columnPushNotificationCheckbox,
    columnOpenPreviewAction,
  ].filter((item) => !!item);
};
