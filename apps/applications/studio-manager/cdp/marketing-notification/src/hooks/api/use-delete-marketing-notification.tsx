import { deleteMarketingNotificationAction } from "@bsport/store-cdp-marketing-notification";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const deleteMarketingNotificationBound = deleteMarketingNotificationAction.bind(
  null,
  fetch,
);

/**
 * Hook for deleting a marketing notification.
 * This hook deletes a marketing notification and invokes optional callbacks.
 * @return Object containing deleteMarketingNotification function
 */
export function useDeleteMarketingNotification({
  onSuccess,
  onFailure,
}: {
  onSuccess?: () => void;
  onFailure?: () => void;
}) {
  const [, deleteMarketingNotification] = useAsync<
    typeof deleteMarketingNotificationBound
  >({
    asyncFn: deleteMarketingNotificationBound,
    onSuccess: () => {
      onSuccess?.();
    },
    onFailure: () => {
      onFailure?.();
    },
  });

  return {
    deleteMarketingNotification,
  };
}
