import { Link, useParams } from "react-router";

import { Breadcrumbs, ListLayout, Table } from "@bsport/kaizen-primitive-core";

import { PushNotificationHelper } from "#src/components/NotificationRuleGroupDetail/PushNotificationHelper";
import { getTableColumns } from "#src/components/NotificationRuleGroupDetail/TableConfig";
import { useFetchNotificationRuleEventGroupDetails } from "#src/hooks/api/use-fetch-notification-rule-event-group-details";
import { useUpdateNotificationRuleSettings } from "#src/hooks/api/use-update-notification-rule-settings";
import { useFormatNotificationEventTable } from "#src/hooks/layout/use-format-notification-event-table";
import { useFormatNotificationGroupList } from "#src/hooks/layout/use-format-notification-group-list";
import { useAvailableUpsells } from "#src/hooks/layout/use-upsell-blocker";
import { useTranslation } from "#src/utils/i18n";

const NotificationRuleGroupDetailPage = () => {
  const params = useParams();
  const rawId = String(params?.id);
  const { t } = useTranslation("transactionalNotification");
  const { pushNotification } = useAvailableUpsells();
  const { getNotificationRuleGroupLabel } = useFormatNotificationGroupList({
    notificationRuleEventMapByGroup: {},
  });
  const { formatNotificationRuleEventTableItems } =
    useFormatNotificationEventTable();
  const {
    notificationEventsRefinedData,
    notificationRuleSettings,
    fetchNotificationRuleEventData,
  } = useFetchNotificationRuleEventGroupDetails({
    eventGroupIdentifier: rawId,
  });
  const { toggleEmailNotification } = useUpdateNotificationRuleSettings({
    notificationRuleSettings,
    onSuccess: () => {
      fetchNotificationRuleEventData();
    },
  });

  const tableColumns = getTableColumns({
    openPreview: () => {},
    checkCommunicationMethodPreferences: ({
      notificationRuleEventId,
      communicationMethod,
      checked,
    }) => {
      if (communicationMethod === "push_notification") {
        // Handle push notification logic here if needed
        return;
      }
      toggleEmailNotification({
        notificationEventId: notificationRuleEventId,
        checked,
      });
    },
    t,
    permissions: {
      pushNotification,
    },
  });

  const tableRow = formatNotificationRuleEventTableItems(
    notificationEventsRefinedData,
  );

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
            <Breadcrumbs.Item text={t("page.title")} />
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
