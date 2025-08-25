import {
  type NotificationRuleDetail,
  createNotificationRuleDetailsAction,
  updateNotificationRuleDetailsAction,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseUpdateNotificationRuleSettingsProps = {
  notificationEventId: number;
  notificationEventDetails?: NotificationRuleDetail;
  onSuccess?: (notificationRuleSettings: NotificationRuleDetail) => void;
  onFailure?: (error: Error) => void;
};

const _createNotificationRuleDetails = createNotificationRuleDetailsAction.bind(
  null,
  fetch,
);

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
export function useUpdateNotificationRule({
  notificationEventId,
  onSuccess,
  onFailure,
}: UseUpdateNotificationRuleSettingsProps) {
  const [{ isLoading: isCreatingRuleDetails }, createNotificationRuleDetails] =
    useAsync<typeof _createNotificationRuleDetails>({
      asyncFn: _createNotificationRuleDetails,
      onSuccess: ({ value }) => onSuccess?.(value),
      onFailure: ({ error }) => onFailure?.(error),
    });

  const [{ isLoading }, updateNotificationRuleEventDetails] = useAsync<
    typeof _updateNotificationRuleDetails
  >({
    asyncFn: _updateNotificationRuleDetails,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
  });

  const createEmailDesignInNotification = ({
    emailDesignId,
  }: {
    emailDesignId: number;
  }) => {
    const notificationEventData = {
      notification_event: notificationEventId,
      email_design: emailDesignId,
    };
    createNotificationRuleDetails(notificationEventData);
  };

  const updateEmailDesignInNotification = ({
    emailDesignId,
    notificationEventDetails,
  }: {
    emailDesignId: number;
    notificationEventDetails: NotificationRuleDetail;
  }) => {
    const notificationEventData: NotificationRuleDetail = {
      ...notificationEventDetails,
      email_design: emailDesignId,
    };
    updateNotificationRuleEventDetails(notificationEventData);
  };

  return {
    isLoading: isCreatingRuleDetails || isLoading,
    createEmailDesignInNotification,
    updateEmailDesignInNotification,
  };
}
