import { useQueryClient } from "@tanstack/react-query";

import { smartlistKeys } from "@bsport/api-cdp/smartlist";

/**
 * Returns a handler that invalidates the smartlist members query to trigger a refetch.
 */
export const useRefreshSmartlistMembers = (smartlistId: string) => {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({
      queryKey: [...smartlistKeys.membersLists(), smartlistId],
    });
  };
};
