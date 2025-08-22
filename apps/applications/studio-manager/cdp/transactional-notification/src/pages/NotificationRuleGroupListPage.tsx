import { List, ListLayout } from "@bsport/kaizen-primitive-core";

import { useFetchNotificationRuleEvents } from "#src/hooks/api/use-fetch-notification-rule-events";
import { useFormatNotificationGroupList } from "#src/hooks/layout/use-format-notification-group-list";
import { notificationRuleEventMap } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

const NotificationRuleEventPage: React.FC = () => {
  const { t } = useTranslation("transactionalNotification");
  const { notificationRuleEventMapByGroup, isLoading } =
    useFetchNotificationRuleEvents();
  const { formatNotificationRuleGroupListItems } =
    useFormatNotificationGroupList({
      notificationRuleEventMapByGroup,
    });

  const formattedListItems = formatNotificationRuleGroupListItems(
    Object.values(notificationRuleEventMap),
  );

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("page.title")} />
      <ListLayout.Content className="w-full flex flex-col gap-md">
        <List
          className="h-full"
          id="notification-rule-event-list"
          items={formattedListItems}
          loadingProps={{
            isLoading: isLoading,
            message: t("notificationRuleEvents.list.loading.message"),
          }}
          emptyStateProps={{
            isEmpty: !formattedListItems.length,
            emptyConfig: {
              className: "h-full",
              title: t("notificationRuleEvents.list.emptyState.title"),
              subtitle: t("notificationRuleEvents.list.emptyState.description"),
            },
          }}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default NotificationRuleEventPage;
