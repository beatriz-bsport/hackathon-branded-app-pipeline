import { toast } from "@bsport/kaizen-primitive-core";
import {
  type NotificationRuleDetail,
  updateNotificationRuleDetailsAction,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type UseTogglePushNotificationProps = {
  onSuccess?: (notificationRuleDetails: NotificationRuleDetail) => void;
  onFailure?: (error: Error) => void;
};

const _updateNotificationRuleDetails = updateNotificationRuleDetailsAction.bind(
  null,
  fetch,
);

/**
 * Hook for creating and updating notification rule details, specifically email designs.
 *
 * @param notificationEventId - ID of the notification event to update
 * @param onSuccess - Callback executed on successful operation
 * @param onFailure - Callback executed on operation failure
 * @returns Object containing loading state and functions to create/update email designs
 */
export function useTogglePushNotification({
  onSuccess,
  onFailure,
}: UseTogglePushNotificationProps) {
  const { t } = useTranslation("transactionalNotification");

  const [{ isLoading }, updateNotificationRuleEventDetails] = useAsync<
    typeof _updateNotificationRuleDetails
  >({
    asyncFn: _updateNotificationRuleDetails,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => {
      onFailure?.(error);
      toast({
        icon: "alert-triangle",
        title: t("notificationRuleEventDetails.toast.update.failure"),
        status: "critical",
      });
    },
  });

  const togglePushNotification = ({
    checked,
    notificationEventDetails,
  }: {
    checked: boolean;
    notificationEventDetails: NotificationRuleDetail;
  }) => {
    const notificationEventData: NotificationRuleDetail = {
      ...notificationEventDetails,
      is_notification_push_active: checked,
    };
    updateNotificationRuleEventDetails(notificationEventData);
  };

  return {
    isLoading,
    togglePushNotification,
  };
}
