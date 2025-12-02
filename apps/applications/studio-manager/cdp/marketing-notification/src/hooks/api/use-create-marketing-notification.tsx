import {
  CreateMarketingNotificationParams,
  createMarketingNotificationAction,
} from "@bsport/store-cdp-marketing-notification";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const createMarketingNotificationBound = createMarketingNotificationAction.bind(
  null,
  fetch,
);

/**
 * Hook for fetching appointment passes list.
 *
 * This hook retrieves related appointment passes based on the authorized params that this endpoint accepets.
 *
 * @return Fetch function for fetching appointment passes
 */
export function useCreateMarketingNotification() {
  const [, createMarketingNotification] = useAsync<
    typeof createMarketingNotificationBound
  >({
    asyncFn: createMarketingNotificationBound,
  });

  const handleCreateMarketingNotification = (
    params: CreateMarketingNotificationParams,
  ) => {
    createMarketingNotification(params);
  };

  return {
    handleCreateMarketingNotification,
  };
}
