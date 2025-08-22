import { Link, useParams } from "react-router";

import { Breadcrumbs, ListLayout } from "@bsport/kaizen-primitive-core";

import { NotificationRuleTableContent } from "#src/components/NotificationRuleGroupView/NotificationRuleGroupContent";
import { PushNotificationHelper } from "#src/components/NotificationRuleGroupView/PushNotificationHelper";
import { useFetchNotificationRuleEventGroupDetails } from "#src/hooks/api/use-fetch-notification-rule-event-group-details";
import { useFormatNotificationGroupList } from "#src/hooks/layout/use-format-notification-group-list";
import { useTranslation } from "#src/utils/i18n";

const NotificationRuleGroupDetailPage = () => {
  const params = useParams();
  const rawId = String(params?.id);
  const { t } = useTranslation("transactionalNotification");
  const { getNotificationRuleGroupLabel } = useFormatNotificationGroupList({
    notificationRuleEventMapByGroup: {},
  });
  const {
    notificationEventsRefinedData,
    notificationRuleSettings,
    fetchNotificationRuleEventData,
  } = useFetchNotificationRuleEventGroupDetails({
    eventGroupIdentifier: rawId,
  });

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
      <NotificationRuleTableContent
        notificationEventsRefinedData={notificationEventsRefinedData}
        notificationRuleSettings={notificationRuleSettings}
        fetchNotificationRuleEventData={fetchNotificationRuleEventData}
      />
    </ListLayout>
  );
};

export default NotificationRuleGroupDetailPage;
