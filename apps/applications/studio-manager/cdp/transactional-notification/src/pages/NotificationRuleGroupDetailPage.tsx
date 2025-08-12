import { Link, useParams } from "react-router";

import { Breadcrumbs, ListLayout, Table } from "@bsport/kaizen-primitive-core";

import { PushNotificationHelper } from "#src/components/NotificationRuleGroupDetail/PushNotificationHelper";
import { getTableColumns } from "#src/components/NotificationRuleGroupDetail/TableConfig";
import { useFormatNotificationEventTable } from "#src/hooks/layout/use-format-notification-event-table";
import { useFormatNotificationGroupList } from "#src/hooks/layout/use-format-notification-group-list";
import { useAvailableUpsells } from "#src/hooks/layout/use-upsell-blocker";
import { useTranslation } from "#src/utils/i18n";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

const FAKE_DATA: RefinedNotificationRuleEventData[] = [
  {
    rule: {
      notification_event: 19,
      is_editable: true,
      is_instance_specific: false,
      notification_group: "member",
      required_tags: [],
    },
    settings: {
      disabled: false,
      send_company: true,
    },
  },
  {
    rule: {
      notification_event: 6,
      is_editable: true,
      is_instance_specific: false,
      notification_group: "member",
      required_tags: [],
    },
    settings: {
      disabled: false,
      send_company: true,
    },
  },
  {
    rule: {
      notification_event: 32,
      is_editable: true,
      is_instance_specific: false,
      notification_group: "member",
      required_tags: [],
    },
    settings: {
      disabled: true,
      send_company: true,
    },
  },
  {
    rule: {
      notification_event: 303,
      is_editable: true,
      is_instance_specific: false,
      notification_group: "member",
      required_tags: ["new_email"],
    },
    settings: {
      disabled: false,
      send_company: false,
      disabled_checkboxes: true,
    },
  },
  {
    rule: {
      notification_event: 305,
      is_editable: true,
      is_instance_specific: false,
      notification_group: "member",
      required_tags: ["new_email"],
    },
    settings: {
      disabled: false,
      send_company: false,
      disabled_checkboxes: true,
    },
  },
  {
    rule: {
      notification_event: 301,
      is_editable: true,
      is_instance_specific: false,
      notification_group: "member",
      required_tags: ["reset_password_url"],
    },
    settings: {
      disabled: false,
      send_company: false,
      disabled_checkboxes: true,
    },
  },
  {
    rule: {
      notification_event: 302,
      is_editable: true,
      is_instance_specific: false,
      notification_group: "member",
      required_tags: ["email_confirmation_url"],
    },
    settings: {
      disabled: false,
      send_company: false,
      disabled_checkboxes: true,
    },
  },
];

const NotificationRuleGroupDetailPage = () => {
  const params = useParams();
  const rawId = String(params?.id);
  const { t } = useTranslation([
    "transactionalNotification",
    "notificationRuleEvent",
  ]);
  const { getNotificationRuleGroupLabel } = useFormatNotificationGroupList({
    notificationRuleEventMapByGroup: {},
  });
  const { formatNotificationRuleEventTableItems } =
    useFormatNotificationEventTable();
  const { pushNotification } = useAvailableUpsells();

  const tableColumns = getTableColumns({
    openPreview: () => {},
    checkCommunicationMethodPreferences: ({
      notificationRuleEventId,
      communicationMethod,
      checked,
    }) => {
      console.log(
        `Checking ${communicationMethod} for event ${notificationRuleEventId}: ${checked}`,
      );
    },
    t,
    permissions: {
      pushNotification,
    },
  });

  const tableRow = formatNotificationRuleEventTableItems(FAKE_DATA);

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={getNotificationRuleGroupLabel(rawId)}
        endGroupActions={[
          <PushNotificationHelper
            id="push-notification-helper"
            key="push-notification-helper-popover"
          />,
        ]}
        BreadcrumbsItems={[
          <Link
            id="to-notification-rule-group-list-page"
            key="to-notification-rule-group-list-page"
            to=".."
          >
            <Breadcrumbs.Item
              text={t("page.title", { ns: "transactionalNotification" })}
            />
          </Link>,
        ]}
      />
      <ListLayout.Content>
        <Table columns={tableColumns} rowHeight="lg" rows={tableRow} />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default NotificationRuleGroupDetailPage;
