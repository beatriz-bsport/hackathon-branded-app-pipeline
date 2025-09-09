import { DetailDrawer, ListLayout, Table } from "@bsport/kaizen-primitive-core";
import type { NotificationRuleSettings } from "@bsport/store-cdp-notification-rule";

import { NotificationRuleDetailsContent } from "#src/components/NotificationRuleEventDetail/NotificationRuleDetailsContent";
import { getTableColumns } from "#src/components/NotificationRuleGroupView/TableConfig";
import { useDrawerQueryParam } from "#src/hooks/actions/use-drawer-query-params";
import { useNotificationRuleNavigation } from "#src/hooks/actions/use-notification-rule-navigation";
import { useTogglePushNotification } from "#src/hooks/api/use-toggle-push-notification";
import { useUpdateNotificationRuleSettings } from "#src/hooks/api/use-update-notification-rule-settings";
import { useFormatNotificationEventTable } from "#src/hooks/layout/use-format-notification-event-table";
import { useAvailableUpsells } from "#src/hooks/layout/use-upsell-blocker";
import { useTranslation } from "#src/utils/i18n";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

type NotificationRuleEventTableContentProps = {
  notificationEventsRefinedData: RefinedNotificationRuleEventData[];
  notificationRuleSettings: NotificationRuleSettings;
  fetchNotificationRuleEventData: () => void;
};

export const NotificationRuleTableContent = ({
  notificationEventsRefinedData,
  notificationRuleSettings,
  fetchNotificationRuleEventData,
}: NotificationRuleEventTableContentProps) => {
  const { t } = useTranslation("transactionalNotification");
  const { openId, openDrawer, closeDrawer } = useDrawerQueryParam();
  const { isPushNotificationEnabled } = useAvailableUpsells();
  const {
    formatNotificationRuleEventTableItems,
    getNotificationRuleEventLabel,
  } = useFormatNotificationEventTable();
  const {
    selectedNotificationRule,
    setSelectedNotificationRule,
    navigateToNextNotificationRule,
    navigateToPreviousNotificationRule,
  } = useNotificationRuleNavigation({
    refinedNotificationRules: notificationEventsRefinedData,
    baseNotificationEventId: openId ? parseInt(openId, 10) : undefined,
  });
  const { togglePushNotification } = useTogglePushNotification({
    onSuccess: () => {
      fetchNotificationRuleEventData();
    },
  });
  const { toggleEmailNotification, toggleEmailCarbonCopy } =
    useUpdateNotificationRuleSettings({
      notificationRuleSettings,
      onSuccess: () => {
        fetchNotificationRuleEventData();
      },
    });

  const openDetailDrawer = (notificationEventId: number) => {
    if (
      selectedNotificationRule?.rule.notification_event === notificationEventId
    ) {
      setSelectedNotificationRule(null);
      closeDrawer();
    } else {
      const notificationEvent = notificationEventsRefinedData.find(
        (event) => event.rule.notification_event === notificationEventId,
      );
      if (notificationEvent) {
        setSelectedNotificationRule(notificationEvent);
        openDrawer(notificationEvent.rule.notification_event);
      }
    }
  };

  const tableColumns = getTableColumns({
    openPreview: (notificationEventId: number) =>
      openDetailDrawer(notificationEventId),
    checkCommunicationMethodPreferences: ({
      notificationRuleEventId,
      communicationMethod,
      checked,
    }) => {
      if (communicationMethod === "push_notification") {
        const notificationEvent = notificationEventsRefinedData.find(
          (event) => event.rule.notification_event === notificationRuleEventId,
        );
        if (!notificationEvent?.details) return;
        togglePushNotification({
          checked,
          notificationEventDetails: notificationEvent.details,
        });
      } else if (communicationMethod === "email_notification") {
        toggleEmailNotification({
          notificationEventId: notificationRuleEventId,
          checked,
        });
      }
    },
    t,
    permissions: {
      isPushNotificationEnabled,
    },
  });

  const tableRow = formatNotificationRuleEventTableItems({
    isPushNotificationEnabled,
    items: notificationEventsRefinedData,
    onRowClick: (row) => {
      openDetailDrawer(row.rule.notification_event);
    },
  });

  return (
    <ListLayout.Content>
      <Table columns={tableColumns} rowHeight="lg" rows={tableRow} />
      <DetailDrawer
        className="w-[650px]"
        id="notification-rule-detail-drawer"
        onClose={() => {
          setSelectedNotificationRule(null);
          closeDrawer();
        }}
        isOpen={!!selectedNotificationRule}
        actionsConfig={[
          {
            id: "next-tag-details",
            iconLeft: "chevron-down",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToNextNotificationRule,
            tooltipProps: {
              label: "Next",
              placement: "bottom-right",
            },
          },
          {
            id: "previous-tag-details",
            iconLeft: "chevron-up",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToPreviousNotificationRule,
            tooltipProps: {
              label: "Previous",
              placement: "bottom-right",
            },
          },
        ]}
      >
        {selectedNotificationRule?.rule ? (
          <NotificationRuleDetailsContent
            eventGroupIdentifier={
              selectedNotificationRule.rule.notification_group
            }
            selectedNotificationEventId={
              selectedNotificationRule?.rule.notification_event
            }
            selectedNotificationRule={selectedNotificationRule}
            getNotificationRuleEventLabel={getNotificationRuleEventLabel}
            toggleEmailCarbonCopy={toggleEmailCarbonCopy}
          />
        ) : null}
      </DetailDrawer>
    </ListLayout.Content>
  );
};
