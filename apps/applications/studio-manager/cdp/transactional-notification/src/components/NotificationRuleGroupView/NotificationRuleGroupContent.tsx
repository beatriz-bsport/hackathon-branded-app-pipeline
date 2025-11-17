import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  DetailDrawer,
  ListLayout,
  Table,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import type { NotificationRuleSettings } from "@bsport/store-cdp-notification-rule";

import { NotificationRuleDetailsContent } from "#src/components/NotificationRuleEventDetail/NotificationRuleDetailsContent";
import { NotificationRuleList } from "#src/components/NotificationRuleGroupView/NotificationRuleList";
import { getTableColumns } from "#src/components/NotificationRuleGroupView/TableConfig";
import { useNotificationRuleNavigation } from "#src/hooks/actions/use-notification-rule-navigation";
import { useTogglePushNotification } from "#src/hooks/api/use-toggle-push-notification";
import { useUpdateNotificationRuleSettings } from "#src/hooks/api/use-update-notification-rule-settings";
import { useFormatNotificationEventTable } from "#src/hooks/layout/use-format-notification-event-table";
import { useAvailableUpsells } from "#src/hooks/layout/use-upsell-blocker";
import { NOTIFICATION_EVENT_QUERY_PARAM } from "#src/utils/constants";
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
  const { isPushNotificationEnabled } = useAvailableUpsells();
  const isMobile = !useMatchMedia("lg");

  const [searchParams] = useSearchParams();
  const notificationId = searchParams.get(NOTIFICATION_EVENT_QUERY_PARAM);
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
    baseNotificationEventId: notificationId
      ? parseInt(notificationId, 10)
      : undefined,
  });

  const { togglePushNotification } = useTogglePushNotification({
    onSuccess: fetchNotificationRuleEventData,
  });

  const { toggleEmailNotification, toggleEmailCarbonCopy } =
    useUpdateNotificationRuleSettings({
      notificationRuleSettings,
      onSuccess: fetchNotificationRuleEventData,
    });

  const openDetailDrawer = useCallback(
    (notificationEventId: number) => {
      if (
        selectedNotificationRule?.rule.notification_event ===
        notificationEventId
      ) {
        setSelectedNotificationRule(null);
      } else {
        const notificationEvent = notificationEventsRefinedData.find(
          (event) => event.rule.notification_event === notificationEventId,
        );
        if (notificationEvent) {
          setSelectedNotificationRule(notificationEvent);
        }
      }
    },
    [
      notificationEventsRefinedData,
      selectedNotificationRule,
      setSelectedNotificationRule,
    ],
  );

  // Memoize table columns to prevent unnecessary re-creation
  const tableColumns = useMemo(
    () =>
      getTableColumns({
        openPreview: (notificationEventId: number) =>
          openDetailDrawer(notificationEventId),
        checkCommunicationMethodPreferences: ({
          notificationRuleEventId,
          communicationMethod,
          checked,
        }) => {
          if (communicationMethod === "push_notification") {
            const notificationEvent = notificationEventsRefinedData.find(
              (event) =>
                event.rule.notification_event === notificationRuleEventId,
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
      }),
    [
      openDetailDrawer,
      notificationEventsRefinedData,
      togglePushNotification,
      toggleEmailNotification,
      isPushNotificationEnabled,
    ],
  );

  const tableRow = useMemo(() => {
    const rows = formatNotificationRuleEventTableItems({
      selectedNotificationRule,
      isPushNotificationEnabled,
      items: notificationEventsRefinedData,
      onRowClick: (row) => {
        openDetailDrawer(row.rule.notification_event);
      },
    });
    return rows;
  }, [
    formatNotificationRuleEventTableItems,
    notificationEventsRefinedData,
    isPushNotificationEnabled,
    openDetailDrawer,
    selectedNotificationRule,
  ]);

  return (
    <ListLayout.Content>
      {isMobile ? (
        <NotificationRuleList
          notificationEventsRefinedData={notificationEventsRefinedData}
          selectedNotificationRule={selectedNotificationRule}
          isPushNotificationEnabled={isPushNotificationEnabled}
          onItemClick={openDetailDrawer}
        />
      ) : (
        <Table columns={tableColumns} rowHeight="lg" rows={tableRow} />
      )}
      <DetailDrawer
        className="w-[650px]"
        id="notification-rule-detail-drawer"
        onClose={() => {
          setSelectedNotificationRule(null);
        }}
        isOpen={!!selectedNotificationRule}
        actionsConfig={[
          {
            id: "previous-tag-details",
            kind: "icon-button",
            icon: "chevron-up",
            label: "Previous",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToPreviousNotificationRule,
            tooltipProps: {
              label: "Previous",
              placement: "bottom-right",
            },
          },
          {
            id: "next-tag-details",
            kind: "icon-button",
            icon: "chevron-down",
            label: "Next",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToNextNotificationRule,
            tooltipProps: {
              label: "Next",
              placement: "bottom-right",
            },
          },
        ]}
      >
        {selectedNotificationRule?.rule ? (
          <NotificationRuleDetailsContent
            selectedNotificationEventId={
              selectedNotificationRule?.rule.notification_event
            }
            selectedNotificationRule={selectedNotificationRule}
            getNotificationRuleEventLabel={getNotificationRuleEventLabel}
            toggleEmailCarbonCopy={toggleEmailCarbonCopy}
            toggleEmailNotification={toggleEmailNotification}
          />
        ) : null}
      </DetailDrawer>
    </ListLayout.Content>
  );
};
