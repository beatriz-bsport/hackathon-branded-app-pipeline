import { toast } from "@bsport/kaizen-primitive-core";
import {
  type DeleteNotificationRuleParams,
  deleteNotificationRuleDetailsAction,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type UseUpdateNotificationRuleSettingsProps = {
  onSuccess?: (data: DeleteNotificationRuleParams) => void;
  onFailure?: (error: Error) => void;
};

const _deleteNotificationRuleDetails = deleteNotificationRuleDetailsAction.bind(
  null,
  fetch,
);

/**
 * Hook for deleting notification rule details, specifically email designs.
 *
 * @param notificationEventId - ID of the notification event to update
 * @param onSuccess - Callback executed on successful operation
 * @param onFailure - Callback executed on operation failure
 * @returns Object containing loading state and functions to create/update email designs
 */
export function useDeleteNotificationRule({
  onSuccess,
  onFailure,
}: UseUpdateNotificationRuleSettingsProps) {
  const { t } = useTranslation("transactionalNotification");

  const [{ isLoading }, deleteNotificationRuleEventDetails] = useAsync<
    typeof _deleteNotificationRuleDetails
  >({
    asyncFn: _deleteNotificationRuleDetails,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => {
      onFailure?.(error);
      toast({
        icon: "alert-triangle",
        title: t("notificationRuleEventDetails.toast.delete.failure"),
        status: "critical",
      });
    },
  });

  const deleteEmailDesignInNotification = ({ id }: { id: number }) => {
    const notificationEventData = {
      id,
    };
    deleteNotificationRuleEventDetails(notificationEventData);
  };

  return {
    isLoading,
    deleteEmailDesignInNotification,
  };
}
